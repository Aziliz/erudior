"""Fast provider and grading regressions; requires only Python on Linux."""
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src-tauri/src/vm_lab"))
import runner
import guest_probe


class RunnerTests(unittest.TestCase):
    def test_guest_port_stays_open_between_host_observations(self):
        port = Mock()
        first, second = "a" * 32, "b" * 32
        port.readline.side_effect = [(first + " observe\n").encode(), b"",
                                     (second + " observe\n").encode(), OSError("device removed")]
        with patch.object(guest_probe, "observe", return_value={"ready": True}), patch.object(guest_probe.time, "sleep"):
            with self.assertRaisesRegex(OSError, "device removed"):
                guest_probe.serve(port, "client", "practice")
        replies = [json.loads(call.args[0]) for call in port.write.call_args_list]
        self.assertEqual([reply["nonce"] for reply in replies], [first, second])

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        cwd = Path.cwd()
        self.addCleanup(os.chdir, cwd)
        os.chdir(self.temp.name)
        self.args = [runner.SCENARIO, "solo", "course", "lesson"]

    def test_status_and_validation_have_no_side_effects(self):
        with patch.dict(os.environ, XDG_DATA_HOME=self.temp.name):
            self.assertFalse(any(runner.main(["status", *self.args])["running"].values()))
            for args in (["start", "shell", *self.args[1:]], ["erase-host", *self.args],
                         ["start", runner.SCENARIO, "../bad", "course", "lesson"]):
                with self.assertRaises(runner.LabError):
                    runner.main(args)
        self.assertEqual(list(Path.cwd().iterdir()), [])

    def test_partial_start_resumes_and_reset_is_scoped(self):
        base = Path("base.qcow2").resolve()
        base.write_bytes(b"base image")
        live = set()
        client_tries = 0

        def launch(role, image, attempt):
            nonlocal client_tries
            self.assertEqual(image, base)
            if role == "client":
                client_tries += 1
                if client_tries == 1:
                    raise runner.LabError("client startup interrupted")
            Path(role + ".qcow2").write_text(attempt["id"])
            live.add(role)

        def monitor(role, _command):
            live.discard(role)

        with patch.object(runner, "launch", side_effect=launch), patch.object(runner, "monitor", side_effect=monitor), \
                patch.object(runner, "running", side_effect=lambda role: role in live):
            with self.assertRaisesRegex(runner.LabError, "interrupted"):
                runner.operate("start", base)
            original = runner.load("attempt.json")
            self.assertEqual(live, {"server"})
            self.assertEqual(runner.operate("start", base)["running"], dict.fromkeys(runner.ROLES, True))
            self.assertEqual(runner.load("attempt.json"), original)
            runner.operate("stop", base)
            self.assertTrue(Path("client.qcow2").exists())
            Path("unrelated").touch()
            Path("reset-pending").touch()
            with self.assertRaisesRegex(runner.LabError, "interrupted"):
                runner.operate("start", base)
            runner.operate("reset", base)
            self.assertEqual(set(os.listdir()), {"base.qcow2", "unrelated"})

    def test_busy_lab_refuses_second_operator(self):
        import fcntl
        with patch.dict(os.environ, XDG_DATA_HOME=self.temp.name):
            with self.assertRaisesRegex(runner.LabError, "base image"):
                runner.main(["start", *self.args])
            with open("lock") as lock:
                fcntl.flock(lock, fcntl.LOCK_EX)
                with self.assertRaisesRegex(runner.LabError, "Another operation"):
                    runner.main(["reset", *self.args])

    def test_real_remote_file_and_autofs_are_independent(self):
        for fs, content, active, mount, expected in [
            ("6969", "marker", 0, "/mnt/projects", (True, True)),
            ("6969", "marker", 0, "/mnt", (True, True)),
            ("6969", "marker", 1, "", (False, True)),
            ("58465342", "marker", 0, "/mnt", (True, False)),
            ("6969", "wrong", 0, "/somewhere", (False, False)),
        ]:
            with self.subTest(expected=expected), patch.object(guest_probe, "command", side_effect=[
                    (0, "running"), *([(0, content), (0, fs), (0, mount), (active, "")] * 2)]), \
                    patch.object(guest_probe.time, "sleep"), \
                    patch.object(Path, "read_text", return_value="boot"):
                self.assertEqual(tuple(runner.checks(guest_probe.observe("client"), "marker").values()), expected)

    def test_active_autofs_can_finish_a_cold_mount(self):
        responses = [(0, "running"), (124, ""), (1, ""), (0, "/mnt/projects"), (0, ""),
                     (0, "marker"), (0, "6969"), (0, "/mnt/projects"), (0, "")]
        with patch.object(guest_probe, "command", side_effect=responses), patch.object(guest_probe.time, "sleep"):
            self.assertTrue(runner.checks(guest_probe.observe("client"), "marker")["remoteFile"])

    def test_grade_requires_a_new_boot_and_does_not_score_infrastructure_errors(self):
        start = {"probeRevision": 2, "boot": "a" * 36, "ready": True, "automount": True, "remoteMarker": "m"}
        end = dict(start, boot="b" * 36, remoteMarker="")
        with patch.object(runner, "probe", side_effect=[
                {"marker": "m", "exportActive": True, "ready": True}, start, {"reboot": True}, start, OSError("booting"), end
        ]) as probe, patch.object(runner.time, "sleep"):
            result = runner.grade({"id": "attempt", "marker": "m"})
            self.assertEqual(probe.call_count, 6)
            self.assertTrue(result["before"]["remoteFile"])
            self.assertFalse(result["after"]["remoteFile"])
        with patch.object(runner, "probe", return_value={}), self.assertRaises(runner.LabError):
            runner.grade({"id": "attempt", "marker": "m"})

    def test_probe_matches_complete_reply_to_nonce_role_and_attempt(self):
        from unittest.mock import MagicMock
        sock = MagicMock()
        sock.__enter__.return_value = sock
        nonce = "f" * 32
        packet = json.dumps({"nonce": nonce, "role": "client", "attempt": "a", "ready": True}).encode()
        sock.recv.side_effect = [b'{"nonce":"old"}\n' + packet[:12], packet[12:] + b"\n"]
        with patch.object(runner, "connect", return_value=sock), patch.object(runner.secrets, "token_hex", return_value=nonce):
            self.assertTrue(runner.probe("client", "observe", "a")["ready"])
            sock.sendall.assert_called_once_with((nonce + " observe\n").encode())
            sock.recv.side_effect = [packet + b"\n"]
            with self.assertRaisesRegex(runner.LabError, "different lab attempt"):
                runner.probe("server", "observe", "a")

    def test_seeds_have_distinct_addresses_and_server_only_export(self):
        def iso(args):
            Path(args[args.index("-output") + 1]).write_bytes(b"iso")
        with patch.object(runner, "tool", side_effect=lambda name: name), patch.object(runner, "run", side_effect=iso):
            for role in runner.ROLES:
                runner.seed(role, {"id": "a", "password": "test", "marker": "proof"})
                folder = Path(role + "-seed")
                net = json.loads((folder / "network-config").read_text())
                self.assertEqual(net["ethernets"]["lab"]["addresses"], [runner.ADDRESSES[role] + "/24"])
                config = json.loads((folder / "user-data").read_text().split("\n", 1)[1])
                self.assertEqual(any(f["path"].endswith(".exports") for f in config["write_files"]), role == "server")
                self.assertTrue(Path(role + "-seed.iso").is_file())


if __name__ == "__main__":
    unittest.main()

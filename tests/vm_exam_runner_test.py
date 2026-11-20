"""Exam lifecycle, portable rubric, and background grading regression checks."""
import contextlib
import json
import os
from pathlib import Path
import select
import socket
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src-tauri/src/vm_lab"))
import runner


class ExamTests(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.addCleanup(os.chdir, Path.cwd())
        os.chdir(tmp.name)
        patch.dict(os.environ, XDG_DATA_HOME=tmp.name).start()
        self.id = "467cf151-2285-41d8-af62-b3db18e23e7a"
        runner.save("attempt.json", {"id": self.id, "password": "fixture", "marker": "token"})
        self.client = {"ready": True, "boot": "a"*36, "probeRevision": 3, "clientToolsReady": True,
                       "operator": True, "automount": True, "remoteMarker": "token"}
        self.server = {"ready": True, "probeRevision": 3, "boot": "c"*36, "teamDirectory": True, "exportActive": True, "marker": "token"}
        self.tasks = [{"id": "client-operator", "points": 3}, {"id": "server-team-directory", "points": 4}, {"id": "client-nfs", "points": 3}]
        self.probe = patch.object(runner, "probe", side_effect=self.observe).start()
        self.worker = patch.object(runner, "ensure_worker").start()
        self.addCleanup(patch.stopall)
        self.reboots = 0

    def observe(self, role, verb, attempt):
        self.assertEqual(attempt, self.id)
        if verb == "reboot":
            self.reboots += 1
            (self.client if role == "client" else self.server)["boot"] = ("b" if role == "client" else "d")*36
            return {"reboot": True}
        return self.server.copy() if role == "server" else self.client.copy()

    def action(self, name, tasks=None, expected=None):
        return runner.exam_action(name, None, 20, self.id if expected is None else expected, tasks)

    def finish(self, generation=0):
        with patch.object(runner.time, "sleep"):
            runner.watch(self.id, generation)
        return runner.exam_status()

    def test_rubric_rejected_before_scope_creation(self):
        for bad in (None, [], [self.tasks[0]]*2, [{"id":"__proto__", "points":1}],
                    [{"id":"client-nfs", "points":True}], [{"id":"client-nfs", "points":0}],
                    [{"id":"client-nfs", "points":101}], [dict(self.tasks[0], script="echo")]):
            with self.subTest(bad=bad), self.assertRaises(runner.LabError):
                runner.main(["status",runner.ADMIN_EXAM,"s","c","l","20","",json.dumps(bad)])
        with self.assertRaises(runner.LabError):
            runner.main(["status",runner.EXAM,"s","c","l","20","",json.dumps(self.tasks)])

    def test_exam_requires_guest_tools_and_working_timer(self):
        self.client["clientToolsReady"] = False
        with self.assertRaisesRegex(runner.LabError,"autofs"):
            self.action("begin", self.tasks)
        self.assertNotIn("exam",runner.load("attempt.json"))
        self.client["clientToolsReady"] = True
        self.worker.side_effect = OSError("unavailable")
        with self.assertRaises(OSError):
            self.action("begin")
        self.assertNotIn("exam",runner.load("attempt.json"))

    def test_pin_reopen_partial_credit_and_submit(self):
        self.client["remoteMarker"] = ""
        state = self.action("begin",self.tasks)
        changed = [dict(self.tasks[0],points=80)]
        reopened = self.action("begin",changed)
        self.assertEqual(state["exam"]["deadlineAt"],reopened["exam"]["deadlineAt"])
        self.assertEqual(reopened["exam"]["rubric"],self.tasks)
        for action in ("check","reset","stop"):
            with self.assertRaises(runner.LabError):self.action(action,changed)
        with self.assertRaises(runner.LabError):self.action("submit",changed,"stale")
        self.assertTrue(runner.input_open(self.id))
        submitted=self.action("submit",changed)
        self.assertFalse(runner.input_open(self.id))
        self.assertIsNone(submitted["password"])
        self.assertIsNone(submitted["report"])
        r=self.finish()["report"]
        self.assertEqual(r["tasks"],[dict(self.tasks[0],before=True,after=True),dict(self.tasks[1],before=True,after=True),dict(self.tasks[2],before=False,after=False)])
        self.assertEqual(r["exam"]["reason"],"submitted")
        self.assertEqual(self.reboots,2)

    def test_no_client_reboot_for_server_only(self):
        del self.client["clientToolsReady"]
        self.server["exportActive"] = False
        self.action("begin",[self.tasks[1]])
        self.action("submit",[self.tasks[1]])
        self.assertEqual(self.finish()["report"]["tasks"],[dict(self.tasks[1],before=True,after=True)])
        self.assertEqual(self.reboots,1)
        self.assertFalse(any(call.args[:2] == ("client", "reboot") for call in self.probe.call_args_list))

    def test_failing_grader_preserves_evidence_for_retry(self):
        self.action("begin", self.tasks)
        self.action("submit",self.tasks)
        with patch.object(runner,"probe",side_effect=[self.server,self.client,OSError("reboot unavailable")]):
            error=self.finish()
        self.assertEqual(error["exam"]["phase"],"error")
        self.assertIsNone(error["report"])
        self.client.update(boot="b"*36,operator=False)
        self.server["teamDirectory"]=False
        self.action("retry",self.tasks)
        result=self.finish(1)["report"]["tasks"]
        self.assertEqual(result[0],dict(self.tasks[0],before=True,after=False))
        self.assertEqual(result[1],dict(self.tasks[1],before=True,after=False))
        self.assertEqual(self.reboots,1)

    def test_server_evidence_survives_interrupted_client_grading(self):
        self.action("begin", self.tasks)
        self.action("submit", self.tasks)
        def fail_client(role, verb, attempt):
            if role == "client" and verb == "reboot":
                raise OSError("client monitor unavailable")
            return self.observe(role, verb, attempt)
        self.probe.side_effect = fail_client
        self.assertEqual(self.finish()["exam"]["phase"], "error")
        self.assertTrue(runner.load("attempt.json")["exam"]["afterReboot"]["server"]["server-team-directory"])
        self.server["teamDirectory"] = False
        self.probe.side_effect = self.observe
        self.action("retry", self.tasks)
        report = self.finish(1)["report"]
        self.assertTrue(report["tasks"][1]["after"])
        self.assertEqual(self.reboots, 2)

    def test_older_sealed_attempt_keeps_original_policy(self):
        self.action("begin", self.tasks)
        self.action("submit", self.tasks)
        a = runner.load("attempt.json")
        del a["exam"]["gradingVersion"]
        a["exam"]["capture"] = {"boot": self.client["boot"], "before": {t["id"]: True for t in self.tasks}}
        runner.save("attempt.json", a)
        report = self.finish()["report"]
        self.assertNotIn("gradingVersion", report)
        self.assertNotIn("after", report["tasks"][1])
        self.assertEqual(self.reboots, 1)

    def test_old_probe_stops_new_clock(self):
        self.server["probeRevision"] = 2
        with self.assertRaisesRegex(runner.LabError, "server guest probe"):
            self.action("begin", self.tasks)
        self.assertNotIn("exam", runner.load("attempt.json"))

    def test_mock_checks_the_os_on_both_guests_before_start(self):
        self.client["platform"] = {"el10": True, "name": "Red Hat Enterprise Linux 10"}
        self.server["platform"] = {"el10": False, "name": "Other Linux"}
        with self.assertRaisesRegex(runner.LabError, "server with RHEL 10"):
            runner.exam_action("begin", None, 180, self.id, self.tasks, mock_profile=True)
        self.assertNotIn("exam", runner.load("attempt.json"))
        self.server["platform"] = {"el10": True, "name": "AlmaLinux 10"}
        state = runner.exam_action("begin", None, 180, self.id, self.tasks, mock_profile=True)
        self.assertEqual(state["exam"]["platforms"], {"client":"Red Hat Enterprise Linux 10","server":"AlmaLinux 10"})

    def test_mock_profile_pins_duration_and_rubric(self):
        args = ["status", runner.RHCSA_MOCK, "learner", "course", "unit"]
        self.assertEqual(runner.main(args)["exam"]["phase"], "new")
        for options in (["12"], ["180", "", json.dumps(self.tasks)]):
            with self.assertRaises(runner.LabError):
                runner.main(args + options)
        with patch.object(runner, "exam_action", return_value={}) as action:
            runner.main(["start", *args[1:]])
            self.assertEqual(action.call_args.args[2], 180)
            rubric = action.call_args.args[-1]
            self.assertEqual(len(rubric), 10)
            self.assertEqual(sum(t["points"] for t in rubric), 300)

    def test_single_nfs_compatibility_and_expiration(self):
        self.action("begin")
        with patch.object(runner, "ticks",return_value=runner.load("attempt.json")["exam"]["endTick"]):
            self.assertFalse(runner.input_open(self.id))
            state=self.action("status")
        self.assertEqual(state["exam"]["reason"],"expired")
        report=self.finish()["report"]
        self.assertEqual(report["exam"]["submittedAt"],report["exam"]["deadlineAt"])
        self.assertEqual(report["before"],report["after"])
        self.assertEqual(report["before"],{"automount": True,"remoteFile": True})

    def test_restart_interrupts_ungraded_session(self):
        self.action("begin",self.tasks)
        with patch.object(runner,"boot_id",return_value="new-host"):
            self.assertEqual(self.action("status")["exam"]["phase"],"interrupted")
        self.assertIsNone(runner.exam_status()["report"])

    def test_emulated_client_can_take_five_minutes_to_reboot(self):
        elapsed = 0
        def sleep(seconds):
            nonlocal elapsed
            elapsed += seconds

        def observe(role, verb, attempt):
            result = self.observe(role, verb, attempt)
            if role == "client" and self.reboots and verb != "reboot":
                result["ready"] = elapsed >= 300
            return result

        self.probe.side_effect = observe
        with patch.object(runner.os, "access", return_value=False), \
                patch.object(runner.time, "monotonic", side_effect=lambda: elapsed), \
                patch.object(runner.time, "sleep", side_effect=sleep):
            report = runner.grade(runner.load("attempt.json"))
        self.assertEqual(self.reboots, 1)
        self.assertEqual(elapsed, 300)
        self.assertEqual(report["before"], report["after"])

    def test_embedded_runner_starts_without_source_files_on_disk(self):
        command = runner.child_command("status", runner.ADMIN_EXAM, "learner", "course", "lesson",
                                       "30", "", json.dumps(self.tasks))
        env = dict(os.environ, XDG_DATA_HOME=str(Path.cwd()))
        result = subprocess.run(command, env=env, capture_output=True, text=True, check=True)
        self.assertEqual(json.loads(result.stdout)["exam"], {"phase": "new", "id": None})
        self.assertFalse(Path("erudior-vm-labs").exists())

    def test_open_terminal_stops_forwarding_at_submission_and_expiry(self):
        for end in ("submit", "expire"):
            with self.subTest(end=end):
                attempt = runner.load("attempt.json")
                attempt.pop("exam", None)
                runner.save("attempt.json", attempt)
                self.action("begin", self.tasks)
                master, slave = os.openpty()
                self.addCleanup(os.close, master)
                self.addCleanup(os.close, slave)
                with self.relay(slave) as peer:
                    # A guest prompt confirms the terminal relay has entered raw mode.
                    peer.sendall(b"ready")
                    self.assertTrue(select.select([master], [], [], 5)[0])
                    self.assertEqual(os.read(master, 5), b"ready")
                    os.write(master, b"before")
                    self.assertEqual(peer.recv(6), b"before")
                    if end == "submit":
                        self.action("submit", self.tasks)
                    else:
                        attempt = runner.load("attempt.json")
                        attempt["exam"]["endTick"] = runner.ticks()
                        runner.save("attempt.json", attempt)
                    os.write(master, b"after")
                    self.assertEqual(peer.recv(5), b"")

    @staticmethod
    @contextlib.contextmanager
    def relay(slave):
        peer, channel = socket.socketpair()
        with peer, channel:
            peer.settimeout(5)
            script = ("import sys,socket;sys.path.insert(0,sys.argv[1]);import runner;"
                      "channel=socket.socket(fileno=int(sys.argv[2]));"
                      "runner.connect=lambda *args:channel;"
                      "runner.timed_console('client',runner.load('attempt.json')['id'])")
            proc = subprocess.Popen([sys.executable, "-I", "-c", script, str(Path(runner.__file__).parent),
                                     str(channel.fileno())], stdin=slave, stdout=slave, pass_fds=(channel.fileno(),))
            channel.close()
            try:
                yield peer
                if proc.wait(timeout=5) != 0:
                    raise RuntimeError("Timed console failed.")
            finally:
                if proc.poll() is None:
                    proc.terminate()
                    proc.wait(timeout=5)

    def test_detached_worker_survives_launcher_exit(self):
        self.action("begin",self.tasks)
        a=runner.load("attempt.json")
        a["exam"]["endTick"]=runner.ticks()+400
        runner.save("attempt.json",a)
        script="import sys;sys.path.insert(0,sys.argv[1]);import runner;runner.ensure_worker(sys.argv[2])"
        subprocess.run([sys.executable,"-I","-c",script,str(Path(runner.__file__).parent),self.id],check=True)
        end=time.monotonic()+12
        while time.monotonic()<end and runner.load("attempt.json")["exam"]["phase"]!="error":
            time.sleep(.1)
        exam=runner.load("attempt.json")["exam"]
        self.assertEqual((exam["phase"],exam["reason"],exam["submittedAt"]),("error","expired",exam["deadlineAt"]))
        self.assertIsNone(runner.load("report.json"))


if __name__ == "__main__":
    unittest.main()

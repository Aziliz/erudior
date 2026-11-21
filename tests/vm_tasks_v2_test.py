"""Per-attempt task values, the randomized RHCSA form and the second guest-probe revision."""
import json
import os
from pathlib import Path
import random
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src-tauri/src/vm_lab"))
import runner
import guest_probe


class FormTests(unittest.TestCase):
    def test_form_has_one_task_per_area_and_thirty_points(self):
        for seed in range(200):
            form = runner.draw_form(random.Random(seed))
            self.assertEqual(len(form), 10)
            self.assertEqual(sum(t["points"] for t in form), 300)
            for task, (_, pool) in zip(form, runner.AREA_POOLS):
                self.assertIn(task["id"], pool)
            runner.rubric(form)

    def test_forms_vary(self):
        forms = {json.dumps(runner.draw_form(random.Random(seed))) for seed in range(50)}
        self.assertGreater(len(forms), 10)

    def test_params_are_distinct_safe_and_cover_defaults(self):
        for seed in range(300):
            p = runner.draw_params(random.Random(seed))
            self.assertEqual(p.keys(), runner.DEFAULT_PARAMS.keys())
            self.assertTrue(all(isinstance(v, str) and len(v) < 64 for v in p.values()))
            names = [p[k] for k in ("teamGroup", "opUser", "opGroup", "sshUser")]
            self.assertEqual(len(set(names)), len(names))
            for k in ("teamGroup", "opUser", "opGroup", "sshUser", "vgName", "lvName"):
                self.assertRegex(p[k], r"^[a-z][a-z0-9]{1,30}$")
            self.assertTrue(18000 <= int(p["webPort"]) <= 18999)
            self.assertTrue(0 <= int(p["cronMinute"]) <= 59 and 0 <= int(p["cronHour"]) <= 23)
            self.assertEqual(p["spareGateway"].rsplit(".", 1)[0], p["spareAddress"].rsplit(".", 1)[0])
            self.assertNotEqual(p["teamDir"], p["lvMount"])

    def test_probe_legacy_values_match_runner_defaults(self):
        for key, value in guest_probe.LEGACY.items():
            self.assertEqual(runner.DEFAULT_PARAMS[key], value)

    def test_first_mock_form_is_unchanged(self):
        self.assertEqual(len(runner.MOCK1_TASKS), 10)
        self.assertFalse(set(runner.MOCK1_TASKS) & set(runner.NEW_TASKS))


class RandomizedExamTests(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.addCleanup(os.chdir, Path.cwd())
        os.chdir(tmp.name)
        patch.dict(os.environ, XDG_DATA_HOME=tmp.name).start()
        self.addCleanup(patch.stopall)
        caps = {k: True for k in runner.NEED_NAMES}
        platform = {"el10": True, "name": "Red Hat Enterprise Linux 10"}
        self.guest = {r: {"ready": True, "boot": c * 36, "probeRevision": 4, "capabilities": dict(caps),
                          "platform": platform, "clientToolsReady": True, "operator": True, "teamDirectory": True,
                          "automount": True, "remoteMarker": "", "exportActive": True, "marker": ""}
                      for r, c in (("client", "a"), ("server", "c"))}
        self.passing = set()
        patch.object(runner, "probe", side_effect=self.observe).start()
        patch.object(runner, "ensure_worker").start()
        patch.object(runner, "operate", side_effect=lambda *a: {"running": {}, "password": None, "report": runner.load("report.json")}).start()

    def observe(self, role, verb, attempt):
        if verb == "reboot":
            self.guest[role]["boot"] = ("b" if role == "client" else "d") * 36
            return {"reboot": True}
        if verb.startswith("extra:"):
            return {"passed": verb[6:] in self.passing}
        marker = runner.load("attempt.json")["marker"]
        self.guest["server"]["marker"] = marker
        self.guest["client"]["remoteMarker"] = marker
        return self.guest[role].copy()

    def act(self, action, expected=None):
        return runner.exam_action(action, None, 180, expected, None, mock_profile=True, randomized=True)

    def test_form_and_values_are_drawn_once_and_pinned(self):
        self.act("start")
        attempt = runner.load("attempt.json")
        self.assertEqual(len(attempt["form"]), 10)
        self.assertEqual(attempt["params"].keys(), runner.DEFAULT_PARAMS.keys())
        self.assertNotIn("rubric", self.act("status")["exam"])  # Hidden until the clock starts.
        self.act("start")
        self.assertEqual(runner.load("attempt.json")["form"], attempt["form"])
        state = self.act("begin", attempt["id"])
        self.assertEqual(state["exam"]["rubric"], attempt["form"])
        self.assertEqual(state["exam"]["params"], attempt["params"])

    def test_report_carries_values_and_scores(self):
        self.act("start")
        attempt = runner.load("attempt.json")
        self.passing = {t["id"] for t in attempt["form"][:7]}
        self.act("begin", attempt["id"])
        self.act("submit", attempt["id"])
        with patch.object(runner.time, "sleep"):
            runner.watch(attempt["id"], 0)
        status = runner.exam_status()
        report = status["report"]
        self.assertIsNotNone(report, status["exam"])
        self.assertEqual(report["params"], attempt["params"])
        self.assertEqual(report["gradingVersion"], 2)
        earned = sum(t["points"] for t in report["tasks"] if t["before"] and t["after"])
        expected = sum(30 for t in attempt["form"] if t["id"] in self.passing or t["id"] in
                       {"client-operator", "server-team-directory", "client-nfs"})
        self.assertEqual(earned, expected)

    def test_old_probe_or_missing_tools_stop_the_clock(self):
        self.act("start")
        attempt = runner.load("attempt.json")
        self.guest["server"]["probeRevision"] = 3
        with self.assertRaisesRegex(runner.LabError, "guest probe"):
            self.act("begin", attempt["id"])
        self.guest["server"]["probeRevision"] = 4
        attempt["form"][4] = {"id": "server-lvm", "points": 30}
        runner.save("attempt.json", attempt)
        self.guest["server"]["capabilities"]["dataDisk"] = False
        with self.assertRaisesRegex(runner.LabError, "data disk"):
            self.act("begin", attempt["id"])
        self.assertNotIn("exam", runner.load("attempt.json"))

    def test_main_rejects_supplied_rubric_and_other_durations(self):
        args = ["status", runner.RHCSA_MOCK2, "learner", "course", "unit"]
        self.assertEqual(runner.main(args)["exam"]["phase"], "new")
        for options in (["12"], ["180", "", json.dumps([{"id": "client-nfs", "points": 30}])]):
            with self.assertRaises(runner.LabError):
                runner.main(args + options)

    def test_seed_writes_values_and_keeps_role_hostname(self):
        attempt = {"id": "x", "password": "p", "marker": "m", "params": runner.draw_params(random.Random(1))}
        with patch.object(runner, "run", side_effect=lambda args: Path("client-seed.iso.tmp").touch()), patch.object(runner, "tool", return_value="genisoimage"), \
                patch.object(runner.shutil, "which", return_value="/usr/bin/genisoimage"):
            runner.seed("client", attempt)
        config = json.loads(Path("client-seed/user-data").read_text().split("\n", 1)[1])
        files = {f["path"]: f for f in config["write_files"]}
        self.assertEqual(json.loads(files["/etc/erudior-lab/params.json"]["content"]), attempt["params"])
        self.assertEqual(files["/etc/erudior-lab/params.json"]["permissions"], "0600")
        self.assertTrue(config["preserve_hostname"])
        self.assertEqual(config["runcmd"][0], ["hostnamectl", "set-hostname", "client"])
        network = json.loads(Path("client-seed/network-config").read_text())
        self.assertEqual(network["ethernets"]["spare"]["match"]["macaddress"], runner.SPARE_MACS["client"])


class ProbeTests(unittest.TestCase):
    def setUp(self):
        self.p = dict(runner.DEFAULT_PARAMS)
        patch.object(guest_probe, "params", return_value=self.p).start()
        patch.object(guest_probe.shutil, "which", return_value="/usr/bin/x").start()
        self.addCleanup(patch.stopall)

    def run_with(self, key, responses, **extra):
        def fake(*argv, seconds=5):
            for prefix, answer in responses:
                if argv[:len(prefix)] == prefix:
                    return answer
            raise AssertionError(f"unexpected command {argv}")
        with patch.object(guest_probe, "command", side_effect=fake):
            for target, value in extra.items():
                patch.object(guest_probe, target, value).start()
            return guest_probe.extra_task(key, "467cf151-2285-41d8-af62-b3db18e23e7a")

    def test_lvm_requires_size_data_disk_xfs_and_mount(self):
        good = [(("lvs",), (0, "  400.00 /dev/labvg/labdata")), (("pvs",), (0, "  /dev/vdb1")),
                (("findmnt",), (0, "/dev/mapper/labvg-labdata xfs")), (("lsblk",), (0, "vdb1\nvdb"))]
        real = {"/dev/mapper/labvg-labdata": "/dev/dm-2", "/dev/labvg/labdata": "/dev/dm-2",
                guest_probe.DATA_DISK: "/dev/vdb", "/dev/vdb1": "/dev/vdb1"}
        extra = dict(on_data_disk=lambda d: True)
        with patch.object(guest_probe.os.path, "realpath", side_effect=lambda x: real.get(x, x)):
            self.assertTrue(self.run_with("server-lvm", good, **extra))
            self.assertFalse(self.run_with("server-lvm", [(("lvs",), (0, "  200.00 /dev/labvg/labdata"))] + good[1:], **extra))
            self.assertFalse(self.run_with("server-lvm", good[:2] + [(("findmnt",), (0, "/dev/mapper/labvg-labdata ext4"))] + good[3:], **extra))
            self.assertFalse(self.run_with("server-lvm", good[:2] + [(("findmnt",), (1, ""))] + good[3:], **extra))
        patch.stopall()
        patch.object(guest_probe, "params", return_value=self.p).start()
        patch.object(guest_probe.shutil, "which", return_value="/usr/bin/x").start()
        with patch.object(guest_probe.os.path, "realpath", side_effect=lambda x: real.get(x, x)), \
                patch.object(guest_probe.os.path, "exists", return_value=True):
            on_root = [good[0], (("pvs",), (0, "  /dev/vda3")), good[2], (("lsblk",), (0, "vda3\nvda"))]
            self.assertFalse(self.run_with("server-lvm", on_root))

    def test_swap_device_must_be_on_data_disk(self):
        swaps = "Filename Type Size Used Priority\n/dev/dm-3 partition 262140 0 -2\n"
        with patch.object(guest_probe.Path, "read_text", return_value=swaps), \
                patch.object(guest_probe.os.path, "exists", return_value=True), \
                patch.object(guest_probe.os.path, "realpath", side_effect=lambda x: "/dev/vdb" if "by-id" in x else x):
            self.assertTrue(self.run_with("server-swap-part", [(("lsblk",), (0, "dm-3\nvdb2\nvdb"))]))
            self.assertFalse(self.run_with("server-swap-part", [(("lsblk",), (0, "dm-3\nvda3\nvda"))]))
            self.p["swapDevMiB"] = "384"
            self.assertFalse(self.run_with("server-swap-part", [(("lsblk",), (0, "dm-3\nvdb2\nvdb"))]))

    def test_web_port_needs_service_listener_firewall_and_answer(self):
        from urllib import error
        good = [(("systemctl", "is-active"), (0, "")), (("systemctl", "is-enabled"), (0, "enabled")),
                (("getenforce",), (0, "Enforcing")), (("ss",), (0, "LISTEN 0 511 *:18080 *:*")),
                (("firewall-cmd", "--state"), (0, "running")), (("firewall-cmd", "--query-port=18080/tcp"), (0, "yes"))]
        forbidden = error.HTTPError("u", 403, "Forbidden", {}, None)
        with patch("urllib.request.urlopen", side_effect=forbidden):
            self.assertTrue(self.run_with("server-web-port", good))
            self.assertFalse(self.run_with("server-web-port", good[:5] + [(("firewall-cmd", "--query-port=18080/tcp"), (1, "no"))]))
            self.assertFalse(self.run_with("server-web-port", good[:3] + [(("ss",), (0, ""))] + good[4:]))
            self.assertFalse(self.run_with("server-web-port", good[:2] + [(("getenforce",), (0, "Permissive"))] + good[3:]))
        with patch("urllib.request.urlopen", side_effect=OSError("refused")):
            self.assertFalse(self.run_with("server-web-port", good))

    def test_ssh_runs_as_learner_without_passwords(self):
        seen = []
        def fake(*argv, seconds=5):
            seen.append(argv)
            return (0, "")
        with patch.object(guest_probe, "command", side_effect=fake):
            self.assertTrue(guest_probe.extra_task("client-ssh-key", "x"))
        argv = seen[0]
        self.assertEqual(argv[:4], ("runuser", "-u", "learner", "--"))
        self.assertIn("BatchMode=yes", argv)
        self.assertIn("PasswordAuthentication=no", argv)
        self.assertEqual(argv[-2:], ("labssh@192.168.77.10", "true"))
        with patch.object(guest_probe, "command", return_value=(255, "")):
            self.assertFalse(guest_probe.extra_task("client-ssh-key", "x"))

    def test_cron_entry_must_match_time_tag_and_daemon(self):
        base = [(("systemctl", "is-active"), (0, "")), (("systemctl", "is-enabled"), (0, "enabled"))]
        for table, ok in (("15 2 * * * /usr/bin/logger erudior-nightly", True),
                          ("MAILTO=root\n# 15 2 * * * logger erudior-nightly\n15 02 * * * logger -t x erudior-nightly", True),
                          ("15 2 * * 1 logger erudior-nightly", False), ("2 15 * * * logger erudior-nightly", False),
                          ("15 2 * * * echo erudior-nightly", False), ("", False)):
            with self.subTest(table=table):
                self.assertEqual(self.run_with("client-cron", base + [(("crontab",), (0, table))]), ok)
        self.assertFalse(self.run_with("client-cron", [(("systemctl", "is-active"), (3, ""))] + base[1:] +
                                       [(("crontab",), (0, "15 2 * * * logger erudior-nightly"))]))

    def test_network_needs_address_gateway_dns_and_hostname(self):
        addr = json.dumps([{"addr_info": [{"local": "10.88.10.20", "prefixlen": 24}]}])
        good = [(("ip",), (0, addr)), (("nmcli",), (0, "10.88.10.1\n10.88.10.53 | 192.0.2.1")),
                (("hostname",), (0, "client01.lab.test"))]
        extra = dict(spare_interface=lambda role: "eth1")
        with patch.object(guest_probe.Path, "read_text", return_value="client01.lab.test\n"):
            self.assertTrue(self.run_with("client-network", good, **extra))
            self.assertFalse(self.run_with("client-network", [good[0], (("nmcli",), (0, "10.88.10.1\n192.0.2.1")), good[2]], **extra))
            wrong = json.dumps([{"addr_info": [{"local": "10.88.10.20", "prefixlen": 16}]}])
            self.assertFalse(self.run_with("client-network", [(("ip",), (0, wrong))] + good[1:], **extra))
            self.assertFalse(self.run_with("client-network", good[:2] + [(("hostname",), (0, "client"))], **extra))
        with patch.object(guest_probe.Path, "read_text", return_value="client\n"):
            self.assertFalse(self.run_with("client-network", good, **extra))
        patch.object(guest_probe, "spare_interface", lambda role: None).start()
        self.assertFalse(guest_probe.extra_task("client-network", "x"))

    def test_existing_tasks_read_attempt_values(self):
        self.p.update(tunedProfile="balanced", hostAlias="cedar.lab.test")
        self.assertTrue(self.run_with("server-tuning", [(("tuned-adm",), (0, "Current active profile: balanced"))]))
        self.assertFalse(self.run_with("server-tuning", [(("tuned-adm",), (0, "Current active profile: throughput-performance"))]))
        self.assertTrue(self.run_with("client-resolution", [(("getent", "ahostsv4", "cedar.lab.test"), (0, "192.168.77.10 STREAM cedar.lab.test"))]))

    def test_params_file_falls_back_to_legacy_values(self):
        patch.stopall()
        with patch("builtins.open", side_effect=FileNotFoundError):
            self.assertEqual(guest_probe.params(), guest_probe.LEGACY)
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
            json.dump({"opUser": "kim42", "bad": 3}, f)
        self.addCleanup(os.unlink, f.name)
        with patch.object(guest_probe, "PARAMS_FILE", f.name):
            loaded = guest_probe.params()
        self.assertEqual(loaded["opUser"], "kim42")
        self.assertNotIn("bad", loaded)


if __name__ == "__main__":
    unittest.main()

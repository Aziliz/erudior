"""The RHCE rubric must measure two playbook runs and independent managed-node state."""
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from vm_lab_runner_test import runner

class AnsibleGrading(unittest.TestCase):
    def test_controlled_sequence(self):
        tasks = [{"id": runner.ANSIBLE_TASK, "points": 100}]
        attempt = {"id": "test", "marker": "test", "ansibleExam": True, "baseImage": runner.AUTO_IMAGE}
        for failure in [None, "ansible-run", "ansible-state", "ansible-repeat"]:
            verbs = []
            def response(role, verb, _):
                verbs.append((role, verb))
                if verb == "tasks":
                    return {"ready": True, "boot": "a"*36, "probeRevision": 4, "capabilities": {"ansible": True},
                            "platform": {"id":"almalinux", "el10":True, "name":"AlmaLinux 10"}}
                return {"passed": verb != failure}
            with self.subTest(failure=failure), patch.object(runner, "probe", side_effect=response):
                runner.capture(attempt, tasks, preflight=True, persistent=True)
                self.assertEqual(verbs, [("server","tasks"),("client","tasks"),("client","ansible-ready")])
                verbs.clear()
                check = runner.capture(attempt, tasks, persistent=True)
                self.assertEqual(check["before"][runner.ANSIBLE_TASK], failure is None)
                if failure is None:
                    self.assertEqual(verbs, [("server","tasks"),("server","ansible-reset"),("client","ansible-run"),
                                      ("server","ansible-state"),("client","ansible-repeat"),("server","ansible-state")])
    def test_fixed_rubric(self):
        with self.assertRaises(runner.LabError):
            runner.rubric([{"id":runner.ANSIBLE_TASK,"points":100}])
        with self.assertRaisesRegex(runner.LabError, "built-in rubric"):
            runner.main(["status",runner.RHCE_EXAM,"student","course","lesson","20","",json.dumps([])])

if __name__ == "__main__":
    unittest.main()

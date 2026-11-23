"""Coverage for the desktop IPC frame, owner scope, guest serial, and submission boundary."""

import json
import os
from contextlib import ExitStack
from pathlib import Path
import select
import socket
import subprocess
import sys
import tempfile
import unittest
import uuid
from unittest.mock import mock_open, patch

LIB = Path(__file__).resolve().parents[1] / "src-tauri/src/vm_lab"
sys.path.insert(0, str(LIB))
import runner


class DesktopProvider(unittest.TestCase):
    def test_embedded_frame_is_larger_than_a_windows_command_line(self):
        with tempfile.TemporaryDirectory() as tmp:
            for scenario, minutes in [(runner.SCENARIO, 20), (runner.RHCSA_MOCK, 180)]:
                args = [
                    "status",
                    scenario,
                    "student-one",
                    "course",
                    "lesson",
                    str(minutes),
                    "",
                    "null",
                ]
                payload = json.dumps(
                    [
                        (LIB / "alma_setup.py").read_text() + "\n" + (LIB / "runner.py").read_text(),
                        (LIB / "guest_probe.py").read_text(),
                        args,
                    ]
                ).encode()
                self.assertGreater(len(payload), 32767)
                cli = [
                    sys.executable,
                    "-I",
                    "-u",
                    "-c",
                    (LIB / "bootstrap.py").read_text(),
                    str(len(payload)),
                ]
                result = subprocess.run(
                    cli,
                    input=payload,
                    capture_output=True,
                    check=True,
                    env={**os.environ, "XDG_DATA_HOME": tmp},
                )
                state = json.loads(result.stdout)
                self.assertFalse(any(state["running"].values()))
                if scenario == runner.RHCSA_MOCK:
                    self.assertEqual(state["exam"]["phase"], "new")
                bad = subprocess.run(cli, input=payload[:100], capture_output=True)
                self.assertNotEqual(bad.returncode, 0)

    def test_selected_kit_stream_uses_the_native_frame_and_validates_bytes(self):
        kit = (LIB.parents[2] / "public/downloads/Erudior-AlmaLinux-10.3-Practice-Kit.zip").read_bytes()
        source = (LIB / "alma_setup.py").read_text() + "\n" + (LIB / "runner.py").read_text()
        with tempfile.TemporaryDirectory() as tmp:
            def invoke(kind, data=b""):
                frame = json.dumps([source, (LIB / "guest_probe.py").read_text(), ["_media", kind]]).encode()
                return subprocess.run([sys.executable, "-I", "-u", "-c", (LIB / "bootstrap.py").read_text(),
                                       str(len(frame))], input=frame + data, capture_output=True,
                                      env={**os.environ, "XDG_DATA_HOME": tmp})
            # The native start frame carries the offline kit without adding it to worker argv.
            bundled = json.dumps(["print(len(bundled_practice_kit))", "guest", ["start"], list(kit)]).encode()
            accepted = subprocess.run([sys.executable, "-I", "-u", "-c", (LIB / "bootstrap.py").read_text(),
                                       str(len(bundled))], input=bundled, capture_output=True, check=True)
            self.assertEqual(int(accepted.stdout), len(kit))
            self.assertFalse(json.loads(invoke("status").stdout)["kit"])
            self.assertTrue(json.loads(invoke("kit", kit).stdout)["kit"])
            self.assertNotEqual(invoke("kit", kit[:12]).returncode, 0)
            self.assertTrue(json.loads(invoke("status").stdout)["kit"])

    def test_frame_leaves_following_keyboard_bytes_untouched(self):
        code = "import os,sys;sys.argv.pop(1);sys.stdout.buffer.write(os.read(0,4))"
        frame = json.dumps([code, "guest", []]).encode()
        p = subprocess.run(
            [
                sys.executable,
                "-I",
                "-u",
                "-c",
                (LIB / "bootstrap.py").read_text(),
                str(len(frame)),
            ],
            input=frame + b"a\r\x03\x1b",
            capture_output=True,
            check=True,
        )
        self.assertEqual(p.stdout, b"a\r\x03\x1b")

    def test_emulate_the_x86_guest_on_arm(self):
        with patch.object(runner.platform, "machine", return_value="aarch64"):
            with patch(
                "builtins.open",
                side_effect=AssertionError("ARM KVM cannot accelerate x86 guests"),
            ):
                self.assertFalse(runner.x86_kvm())

    def test_lima_software_emulation_uses_virtual_clocks(self):
        with patch.dict(os.environ, {"ERUDIOR_VM_PROVIDER": "lima"}):
            self.assertEqual(runner.lima_guest_clock(False), ["-icount", "shift=3,sleep=on", "-rtc", "clock=vm"])
            self.assertEqual(runner.lima_guest_clock(True), [])
        with patch.dict(os.environ, {"ERUDIOR_VM_PROVIDER": ""}):
            self.assertEqual(runner.lima_guest_clock(False), [])

    def test_only_accelerate_when_kvm_can_create_a_vm(self):
        device = mock_open()
        with (
            patch.object(runner.platform, "machine", return_value="x86_64"),
            patch("builtins.open", device),
            patch.object(runner.fcntl, "ioctl", return_value=42) as create,
            patch.object(runner.os, "close") as close,
        ):
            self.assertTrue(runner.x86_kvm())
            device.assert_called_with("/dev/kvm", "rb+", buffering=0)
            close.assert_called_once_with(42)
            create.side_effect = OSError("Nested KVM unavailable")
            self.assertFalse(runner.x86_kvm())

    def test_scoped_raw_console_and_submission_gate(self):
        with (
            tempfile.TemporaryDirectory() as tmp,
            patch.dict(os.environ, {"XDG_DATA_HOME": tmp}),
        ):
            for scenario, role in [
                (runner.SCENARIO, "client"),
                (runner.RHCSA_MOCK, "server"),
            ]:
                with self.subTest(role=role):
                    ident = str(uuid.uuid4())
                    spec = [scenario, "learner", "course", "lesson"]
                    folder = runner.lab_folder(*spec)
                    folder.mkdir(parents=True)
                    attempt = {
                        "id": ident,
                        "exam": {
                            "phase": "active",
                            "hostBoot": runner.boot_id(),
                            "deadlineAt": 10**15,
                            "startedAt": 1,
                            "endTick": runner.ticks() + 60000,
                        },
                    }
                    (folder / "attempt.json").write_text(json.dumps(attempt))
                    # Only the QEMU transport is substituted; pipe handling, file locks,
                    # owner lookup, attempt validation and the deadline check are the real runner.
                    fixture = """import sys,socket
sys.path.insert(0,sys.argv[1])
import runner
runner.running=lambda role: True
runner.connect=lambda *args: socket.socket(fileno=int(sys.argv[2]))
runner.stream_console(*sys.argv[3:])
"""
                    with ExitStack() as stack:
                        guest, host = (
                            stack.enter_context(s) for s in socket.socketpair()
                        )
                        child = subprocess.Popen(
                            [
                                sys.executable,
                                "-I",
                                "-c",
                                fixture,
                                str(LIB),
                                str(host.fileno()),
                                role,
                                *spec,
                                ident,
                            ],
                            pass_fds=[host.fileno()],
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                        )
                        host.close()
                        try:
                            guest.sendall(b"login: ")
                            self.assertTrue(select.select([child.stdout], [], [], 4)[0])
                            self.assertEqual(
                                os.read(child.stdout.fileno(), 7), b"login: "
                            )
                            child.stdin.write(b"learner\r")
                            child.stdin.flush()
                            guest.settimeout(3)
                            self.assertEqual(guest.recv(128), b"learner\r")
                            if scenario == runner.RHCSA_MOCK:
                                previous = Path.cwd()
                                try:
                                    os.chdir(folder)
                                    runner.seal(attempt)
                                finally:
                                    os.chdir(previous)
                            else:
                                replacement = {**attempt, "id": str(uuid.uuid4())}
                                (folder / "new.json").write_text(
                                    json.dumps(replacement)
                                )
                                (folder / "new.json").replace(folder / "attempt.json")
                            try:
                                child.stdin.write(b"late\r")
                                child.stdin.flush()
                            except BrokenPipeError:
                                pass
                            self.assertEqual(child.wait(timeout=3), 0)
                            self.assertEqual(guest.recv(64), b"")
                        finally:
                            child.kill()
                            child.communicate()


if __name__ == "__main__":
    unittest.main()

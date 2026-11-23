#!/usr/bin/python3
"""Mirror boot milestones on the disposable Lima CI provider."""
import os
import sys

args = sys.argv[1:]
if "-serial" in args:
    i = args.index("-serial")
    serial = args[i + 1]
    if serial.startswith("unix:"):
        path, options = serial.removeprefix("unix:").split(",", 1)
        args[i:i + 2] = ["-chardev", f"socket,id=console,path={path},{options},logfile={path}.boot",
                         "-serial", "chardev:console"]
os.execv("/usr/bin/qemu-system-x86_64", ["qemu-system-x86_64", *args])

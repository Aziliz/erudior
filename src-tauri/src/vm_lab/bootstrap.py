# Read exactly the bootstrap bytes; later serial keystrokes may already be in the pipe.
import json
import os
import sys

length = int(sys.argv[1])
if not 0 < length <= 262144:
    raise SystemExit("Invalid VM bootstrap length")
payload = bytearray()
while len(payload) < length:
    chunk = os.read(0, min(65536, length - len(payload)))
    if not chunk:
        raise SystemExit("Incomplete VM bootstrap")
    payload.extend(chunk)
source, guest, arguments = json.loads(payload)
sys.argv = ["erudior-vm", guest, *arguments]
exec(compile(source, "<erudior-vm>", "exec"), {"__name__": "__main__", "runner_source": source})

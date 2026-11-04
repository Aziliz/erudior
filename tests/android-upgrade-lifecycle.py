"""Compile and execute the actual Android-independent production reducer, no model copy."""
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as output:
    subprocess.run(['java', 'com.sun.tools.javac.Main', '-source', '17', '-target', '17', '-d', output,
        str(ROOT/'src-tauri/android-installer/src/main/java/com/erudior/updates/NativeLifecycleState.java'),
        str(ROOT/'tests/android-lifecycle/NativeLifecycleStateTest.java')], check=True)
    subprocess.run(['java', '-cp', output, 'com.erudior.updates.NativeLifecycleStateTest'], check=True)

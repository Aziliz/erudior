# One-shot exact-source branch integration. Removed with its bootstrap workflow.
# Never edits main or executes network code. Fail rather than touching another revision.
import hashlib
from pathlib import Path
p = Path('src/App.tsx')
raw = p.read_bytes()
assert hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest() == '5084d53fe6f414064da3e968bd6b5674687942d5', 'App source moved; reconcile explicitly'
s = raw.decode()
old_import = 'import PhoneNavigation from "./components/PhoneNavigation";'
assert s.count(old_import) == 1
s = s.replace(old_import, old_import + '\nimport AppSidebar from "./components/AppSidebar";')
old = '''            <button className="brand" onClick={() => api.go({ name: "library" })} aria-label="Erudior: library">
              <Mark />
              Erudior
            </button>'''
new = '''            <AppSidebar key={sessionEpoch} api={api} current={view} managementLabel={managementLabel}
              showCommunity={showCommunity} blocked={localLocked || !!gate || concealed}
              preferences={{ theme, width, textSize, setTheme, setWidth, setTextSize }}
              onLock={lockWorkspace} onOpen={() => setDisplayOpen(false)} />'''
assert s.count(old) == 1
s = s.replace(old, new)
p.write_text(s)
Path('.github/workflows/app-sidebar-bootstrap.yml').unlink()
Path(__file__).unlink()

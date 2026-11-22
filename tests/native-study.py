import base64, json, os, pathlib, subprocess, sys, time, urllib.request
from urllib.error import HTTPError, URLError

course = json.loads(pathlib.Path("samples/rhcsa-10-administration.json").read_text())
# A small public fixture selects the RHCE machine profile without redistributing the course.
course["id"] = "rhce-ansible-alma10"
course["title"] = "RHCE practice terminal acceptance"
data = pathlib.Path(os.environ["XDG_DATA_HOME"]) / "com.erudior.app"
(data / "courses").mkdir(parents=True, exist_ok=True)
(data / "courses" / (course["id"] + ".json")).write_text(json.dumps(course))
(data / "progress.json").write_text(json.dumps(dict(version=1, seeded=True, catalogV1=True, attempts=[], stats={}, cards={}, lessonsDone={}, plans={}, activity={}, drills={})))
def req(path, data=None, method=None, timeout=100):
    r = urllib.request.Request("http://localhost:4444"+path, data=None if data is None else json.dumps(data).encode(), method=method, headers={"Content-Type":"application/json"})
    try:
        with urllib.request.urlopen(r,timeout=timeout) as s: return json.load(s).get("value")
    except HTTPError as e:
        raise RuntimeError(e.read().decode(errors="replace")[:1200]) from e
def wait(f, label, timeout=40):
    limit=time.monotonic()+timeout
    while time.monotonic()<limit:
        try:
            v=f()
            if v: return v
        except (ConnectionError,URLError): pass
        time.sleep(.45)
    raise RuntimeError("Timed out: "+label)
wait(lambda:req("/status"),"WebKitWebDriver")
v=req("/session",{"capabilities":{"alwaysMatch":{"webkitgtk:browserOptions":{"binary":"/usr/bin/erudior"}}}})
session="/session/"+v["sessionId"]
def js(s,*args):return req(session+"/execute/sync",{"script":s,"args":list(args)})
def button(text,container="document"):
    wait(lambda:js("const e=[..."+container+".querySelectorAll('button')].find(b=>b.textContent.trim()===arguments[0]&&!b.disabled); if(!e)return false;e.click();return true",text),text)
def screen():return js("return Array.from(document.querySelectorAll('.vm-console .xterm-accessibility-tree [role=listitem]')).map(e=>e.textContent).join('\\n')") or ""
def key(text):
    js("document.querySelector('.vm-console .xterm-helper-textarea').focus()")
    actions=[{"type":t,"value":c if c!='\n' else '\ue007'} for c in text for t in ("keyDown","keyUp")]
    req(session+"/actions",{"actions":[{"type":"key","id":"keyboard","actions":actions}]})
try:
    wait(lambda:js("const e=document.querySelector('.course-row');if(!e)return false;e.click();return true"), "native library")
    button("Lessons")
    wait(lambda:js("const e=[...document.querySelectorAll('.lesson-title')].find(e=>e.textContent.includes('Read a prompt'));if(!e)return false;e.closest('button').click();return true"),"open reading lesson")
    if sys.argv[1]=='preflight':
        print("Published RPM opened a reading in the Fedora RHCE desktop fixture.",flush=True)
        sys.exit()
    button("Open practice terminal")
    button("Start lab")
    wait(lambda:js("return document.querySelector('.vm-console [role=status]')?.textContent.includes('Connected')"),"native console",180)
    secret=wait(lambda:js("const d=[...document.querySelectorAll('details')].find(d=>d.querySelector('summary')?.textContent==='Console login');return d?.querySelectorAll('code')[1]?.textContent"),"lab credentials")
    for _ in range(45):
        key("\n")
        if 'login:' in screen(): break
        time.sleep(2)
    else: raise RuntimeError("The guest did not show a login prompt")
    for _ in range(5):
        key('learner\n')
        wait(lambda:'Password:' in screen(),"password prompt")
        key(secret+'\n')
        try:
            wait(lambda:'$' in screen(),"guest shell",12)
            break
        except RuntimeError:
            key("\n");time.sleep(3)
    key('cd /tmp\n');key('echo ERUDIOR_OS="$(cat /etc/almalinux-release)"\n')
    wait(lambda:'ERUDIOR_OS=AlmaLinux release 10.3' in screen(),"AlmaLinux 10.3 command output")
    assert js("window.lastConsole=document.querySelector('.xterm-helper-textarea');const a=document.querySelector('.vm-study-reader').getBoundingClientRect(),b=document.querySelector('.vm-study-machines').getBoundingClientRect();return a.width>150 && b.width>150 && (a.right<=b.left+1 || a.bottom<=b.top+1)")
    button('Previous')
    wait(lambda:js("return document.querySelector('.lesson-head h1')?.textContent.includes('Meet Linux')"),"previous lesson")
    assert js("return window.lastConsole===document.querySelector('.xterm-helper-textarea')")
    key('echo ERUDIOR_CWD="$PWD"\n')
    wait(lambda:'ERUDIOR_CWD=/tmp' in screen(),"working directory in the same shell")
    key('cloud-init status --wait >/dev/null; echo ERUDIOR_CLOUD=$?\n')
    wait(lambda:"ERUDIOR_CLOUD=0" in screen(),"finished guest configuration",180)
    key("export ANSIBLE_HOST_KEY_CHECKING=True\n")
    key("export ANSIBLE_PRIVATE_KEY_FILE=/home/learner/.ssh/erudior_rhce\n")
    key("for n in 1 2 3 4 5; do ansible all -i '192.168.77.10,' -u learner -m ansible.builtin.ping > /tmp/erudior-ansible.log 2>&1 && grep -q pong /tmp/erudior-ansible.log && break; sleep 4; done; tail -8 /tmp/erudior-ansible.log; grep -q pong /tmp/erudior-ansible.log; echo ERUDIOR_PING=$?\n")
    wait(lambda:'ERUDIOR_PING=0' in screen(),"Ansible ping from controller to managed guest",180)
    print("Fedora RPM verified the RHCE practice profile in the reader, the preserved guest shell and an Ansible ping between the two actual AlmaLinux guests.",flush=True)
except Exception:
    diagnostic=js("return [...document.querySelectorAll('.vm-console [role=status],.vm-study-machines [role=alert],.vm-study-machines .warn')].map(e=>e.textContent).join(' ')")
    rows=screen().strip()[-1300:]
    if "secret" in globals() and secret: rows=rows.replace(secret, "[redacted]")
    print("Native screen status:",diagnostic,"terminal:",rows,flush=True)
    raise
finally:
    req(session,method="DELETE")

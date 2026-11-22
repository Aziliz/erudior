# Local virtual machine labs

Import `samples/demo-vm-lab.json` in the desktop app and open one of its three lessons. **Mount a shared directory on demand** allows repeated practice checks. **Timed network mount practical** grades the same objective once at submission. **Administer a client and a server** uses an author-selected list of weighted tasks. All three use the base image below. Each lesson gets its own pair of disks.

## RHCSA practice exam for RHEL 10

Import `samples/rhcsa-10-practice-exam.json` and open **RHCSA practice exam**. One client and one server share a private network. Each of the ten tasks represents a different public EX200 objective area. Learners may use normal guest tools and installed documentation. Both guests must identify as RHEL 10 or compatible Enterprise Linux 10 before the timer starts. The lesson shows each guest’s actual distribution. The standalone profile accepts compatible EL10 guests. In the combined course, new attempts require AlmaLinux 10 on both machines. Red Hat uses RHEL 10 for EX200. Erudior sets the three-hour time limit, equal 30-point weights and 210/300 practice target.

The score report shows a practice outcome and points by objective area. Expand **Review task checks** to compare the observed state at submission with the state after the machine rebooted. A server configuration that disappeared on reboot earns zero even if it was correct at submission. Completed reports from earlier releases keep their original scores and identify unverified server persistence.

The [Red Hat EX200 objectives](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) specify RHEL 10, hands-on tasks and configurations that survive reboot. The [certification program guide](https://docs.redhat.com/en/documentation/red_hat_learning_subscription/1-latest/html/red_hat_certification_program_guide/index) describes objective-area reporting. The exercises, weights and passing target in this independent mock are Erudior practice settings. A single form samples each area.

| Area | Graded outcome | VM |
| --- | --- | --- |
| Essential tools | Group ownership and mode of a shared directory | Server |
| Software management | Enabled DNF repository pointed at the supplied local metadata, with package signature checking | Client |
| Shell scripts | Executable script classifies integer arguments when run unprivileged | Client |
| Running systems | Active TuneD profile | Server |
| Local storage | Active swap file of the specified size | Server |
| File systems | Autofs and access to the real NFS marker | Client |
| Deployment and maintenance | Supplied systemd service enabled and active | Server |
| Basic networking | Persistent IPv4 hostname resolution | Client |
| Users and groups | Local account and group membership | Client |
| Security | Regular web content file with the requested SELinux type in enforcing mode | Server |

## Run the desktop labs

Search the desktop Library for **Zero to RHCSA on RHEL 10** or import `samples/rhcsa-10-administration.json`. The Windows, macOS and Linux desktop programs provide the same two guest consoles inside the lesson. A private Linux provider runs QEMU and the grader locally. The two practice machines remain the x86-64 client and server. On Windows and macOS, the provider is an additional local virtualization layer.

| Desktop | Where the provider runs | First use |
| --- | --- | --- |
| Windows | Debian in WSL 2, using that distribution's default Linux user | In PowerShell run `wsl --install -d Debian`. Complete the Debian first-login setup. Confirm `wsl --list --verbose` shows Debian at version 2. For an existing WSL 1 install, use `wsl --set-version Debian 2`. |
| macOS, Intel or Apple silicon | A Lima instance named `erudior-labs` | Install Lima, then run `limactl start --name=erudior-labs --cpus=4 --memory=6 template:debian`. Enter it with `limactl shell erudior-labs`. For an existing stopped instance use `limactl start erudior-labs`. The app locates Lima in the standard Homebrew or MacPorts bin directories. |
| Linux | The account launching the desktop application | Install the tools below on the host. The two guest disks and grading receipts use the existing local lab data directory. |

In a Debian 13 provider run `sudo apt update` and `sudo apt install python3 qemu-system-x86 qemu-utils genisoimage`. On other Linux distributions install equivalent packages. Verify `qemu-system-x86_64 --version` is at least 9.2. The provider also needs Python 3.9 or newer, qemu-img and either genisoimage or xorriso. The in-app serial consoles use the local desktop bridge. Each guest gets 1.5 GiB RAM and two virtual CPUs. Allocate enough provider memory for both guests and Linux itself. Eligible x86-64 hosts can use KVM. Apple silicon and other hosts without usable x86 acceleration use QEMU software emulation; first boot and reboot checks can take several minutes.

### Set up from the AlmaLinux 10.3 DVD and practice kit

Open **Today → RHCSA practice machines** or **Today → RHCE practice machines** in the corresponding course. Choose **Start lab**. In a graded RHCSA lesson, choose **Prepare machines**. Erudior downloads the [official AlmaLinux 10.3 x86_64 DVD](https://repo.almalinux.org/almalinux/10.3/isos/x86_64/AlmaLinux-10.3-x86_64-dvd.iso) and uses the bundled [Erudior practice kit](https://app.erudior.com/downloads/Erudior-AlmaLinux-10.3-Practice-Kit.zip) in the Linux provider. To use files you already have, choose **Choose DVD ISO** and **Choose practice kit ZIP** before starting. Either file can also be downloaded independently. Local files selected on Windows or macOS are copied into the provider by the app.

Allow at least 19 GiB of free space for first use. Both files are checked against the digests pinned in the desktop release. The app installs a private 30 GiB sparse system disk from the DVD, boots it with the kit's configuration disc, and waits for the guest to confirm the template is ready. After the verified base is saved, the same machine can create fresh attempts offline. Setup progress appears in the lesson. For a failed guest installation, inspect `alma-installer.log` and `alma-kit.log` in the provider's `erudior-vm-labs/images` directory under XDG_DATA_HOME or `~/.local/share`.

Each learner's practice pair and each graded lesson use separate overlays. **Reset disks** or **Reset exam disks** discards changes to that pair, including its practice storage. Start it again to get a fresh baseline. The RHCSA exam timer starts when you choose **Begin**. Existing prepared RHCSA images and in-progress attempts keep their original backing files.

The RHCE pair has a private link, a NAT adapter, two empty practice disks per guest and the read-only DVD and tools discs. The kit configures the roles on first boot. Check `cloud-init status --wait` in both consoles. Use the learner's `~/.ssh/erudior_rhce` on the control node to reach the managed node at `192.168.77.10`. Navigator images and the editor's development container are staged online in the lessons that use them. Each RHCE guest uses 3 GiB of memory. Allocate at least 8 GiB to its provider (use `--memory=8` when creating the Lima instance). The provider also needs `ssh-keygen` for this track.

Open a practice lesson. Start both machines, open each console, press Enter and confirm the guest hostname. For timed work, prepare the pair, begin the attempt and submit from the app. The grader records both observations, and Progress retains the result. Closing a terminal closes its connection. Stopping WSL, Lima or the physical computer interrupts its VMs. After a provider restart, reopen the lesson to see the saved state and recovery options.

The browser and desktop catalogs both offer **Zero to RHCSA on RHEL 10**. Open or import `samples/rhcsa-10-administration.json` for the same 51 lessons and 76 questions. A manual two-guest setup supports hands-on work alongside the browser. The desktop app also records the built-in VM grades. Earlier desktop attempts retain their original course, lesson and scenario IDs. RHEL 10 has one published RHCSA course. The former web study edition was a duplicate for the same major version and has been removed. Old links open the combined course, where completed shared lessons carry forward on the same profile. Separate editions are retained when they teach different major versions, such as RHEL 9 and RHEL 10. Earlier quiz attempts remain in their original history.

[Microsoft WSL command reference](https://learn.microsoft.com/en-us/windows/wsl/basic-commands) · [Lima usage](https://lima-vm.io/docs/usage/) · [Lima shell](https://lima-vm.io/docs/reference/limactl_shell/)


## Practice a network mount

1. Select **Start lab**. The runner creates private copy-on-write disks, a first-boot seed per guest, and a virtual Ethernet link between the two guests. Its network, consoles and management connections use local Unix sockets. Allow cloud-init to finish on both guests.
2. Open **Client console** and expand **Console login** for the attempt's credentials. The learner account can use sudo inside either guest. The server at `192.168.77.10` exports `/srv/projects` to the client at `192.168.77.20`. Configure autofs on the client to mount the share at `/mnt/projects` when accessed.
3. Select **Check my work** and confirm the client reboot. The guest service checks whether autofs manages the mount and whether the expected file can be read on an NFS filesystem. The server supplies a fresh marker for each attempt. The runner repeats both checks after the client reports a new boot ID and finishes startup. Four independent results produce a practice score. A service or reboot failure leaves the last completed result available.
4. Check the lesson or the course's **Progress** tab for the latest saved result. If saving was interrupted, **Save latest check to course progress** recovers the result for that learner and lesson. Practice results live in learner progress and travel with progress backups. The VM disks and console password stay on the host.
5. **Stop lab** requests an orderly shutdown and preserves the disks. **Reset disks** asks for confirmation, stops the pair and removes this attempt's disks, credentials and cached report. A previously saved course score stays in the learner record. Close the consoles before opening another console to the same VM.

Each attempt belongs to one OS user, Erudior learner and course lesson. A per-attempt file lock serializes lifecycle operations. Opening a lesson only reads its status. Course data cannot select a host path, executable, network or guest command. The guest service accepts built-in observations and guest reboot requests through a dedicated virtio port. A learner with guest administrator rights controls that guest, so results are for local practice.

## Take a timed practical

1. Select **Prepare machines**. The host boots both guests. Setup and first boot take place before the clock starts. **Begin** checks that both guests can report their state. A practical with an NFS task also checks for a working server fixture and client tools.
2. Select **Begin** and use the **Client console** and **Server console** to complete the listed tasks. Each task shows its target machine and point value. Leaving the lesson or quitting the app keeps the deadline and the original rubric. Reopen the same lesson under the same learner to resume.
3. Select **Submit exam** for an early finish or let the timer expire. Both consoles stop accepting input. A background process records the observations and, for each machine with graded tasks, reboots it and checks a new boot ID. When both machines have tasks the server recovers first so its NFS export is available for the client. This also works with the lesson closed.
4. Reopen the lesson for a task-by-task result. An objective earns its points when it passes at submission and after its machine reboots. A server-only practical reboots the server. If a guest service fails, **Retry grading** reuses any saved submission evidence. A host restart that loses the running guests interrupts an ungraded attempt.
5. The grade and timing receipt travel with learner progress backups. Disks, open sessions and console credentials stay on the host. **Save exam result** retries an interrupted progress write. **Reset exam disks** starts the next attempt from the base image.

The sample awards 3 points for the client account, 4 for the server directory and 3 for the client NFS mount. A learner who completes the first two tasks earns 7/10. See the [course format](COURSE_FORMAT.md#local-virtual-machine-labs) for the lesson fields.

### Existing practice disks

New disks receive the current guest probe automatically. To retain an older practice pair's work when successive checks time out, install the updated `src-tauri/src/vm_lab/guest_probe.py` on each affected guest at `/usr/local/libexec/erudior-lab-probe.py`, run `sudo restorecon /usr/local/libexec/erudior-lab-probe.py` and restart `erudior-lab-probe.service`. The probe keeps its guest port open between checks and recognizes a real NFS file beneath a stacked autofs mount. Previously saved practice scores remain readable. Start the fixed mock with freshly prepared disks to receive the supplied service and local repository. In-flight exams started with the older grader finish with their original policy.

## Verify on a Linux host

The default runner unit tests use Python. The focused UI tests use the repository's installed JavaScript dependencies.

```sh
python3 tests/vm_lab_runner_test.py
python3 tests/vm_exam_runner_test.py
npm run test:vm-labs
```

For the two-guest acceptance test, supply the same prepared image and run the following command on a Linux host where QEMU can use Unix sockets.

```sh
python3 tests/vm_lab_host.py /absolute/path/to/prepared-cloud-image.qcow2
python3 tests/vm_tasks_host.py /absolute/path/to/prepared-cloud-image.qcow2
python3 tests/vm_tasks_host.py /absolute/path/to/prepared-cloud-image.qcow2 --rhcsa
```

Each test creates its own temporary data directory and overlays. The practice test expects zero of four checks on the clean pair, configures the client through its serial login and expects four of four after reboot. It also exercises stop, resume and reset against those test disks. The authored example checks 7/10 and 10/10. The RHCSA profile test submits two separate attempts and verifies 300/300 with persistent settings and 270/300 with a temporary server directory. The test checks each task on both sides of the relevant reboot. The desktop console buttons also require a packaged run on each target desktop.

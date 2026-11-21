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

### Prepare the AlmaLinux 10 image for the combined RHCSA course

Both student consoles in a new combined-course attempt use AlmaLinux 10 x86_64. Debian under WSL or Lima is the provider. The downloaded Generic Cloud disk contains an operating system but may lack required lab packages. Prepare a separate standalone qcow2 once while package sources are reachable. The course gives each learner a private overlay of that base.

1. Obtain the versioned AlmaLinux 10 **Generic Cloud x86_64 qcow2** and match its SHA-256 to the same filename on the official download page. Use the standard x86_64 build for these QEMU settings. [AlmaLinux images and checksums](https://almalinux.org/get-almalinux/) · [Generic Cloud images](https://wiki.almalinux.org/cloud/Generic-cloud)
2. In a copy of that VM, with the AlmaLinux repositories or matching DVD attached, confirm `ID=almalinux` and a 10.x `VERSION_ID` in `/etc/os-release`. Install the packages below. Use a console or the cloud login you configured for this preparation VM. The image needs BIOS boot, cloud-init NoCloud, serial login on ttyS0 and SELinux enforcing.
3. From the console check `dnf repolist --enabled`, `getenforce`, `rpm -q nfs-utils autofs tuned flatpak`, `test -x /usr/bin/python3`, and `/usr/bin/python3 -c 'import dnf'`. Enable serial login with `sudo systemctl enable serial-getty@ttyS0.service`. Confirm the distribution's cloud-init services are enabled and that the image accepts NoCloud seed media. Leave learner exercise names, custom automounts and the graded paths unused.
4. On this template copy, remove provisioning-only credentials you created and run `sudo cloud-init clean --logs --machine-id`. Shut down with `sudo systemctl poweroff`. Use `qemu-img convert -O qcow2 SOURCE.qcow2 almalinux-10-rhcsa.qcow2` in a fresh directory if you need a standalone disk from an overlay. Inspect `qemu-img info --backing-chain almalinux-10-rhcsa.qcow2`. A standalone base has one image in the chain.
5. Inside the provider create `~/.local/share/erudior-vm-labs/images` and copy the powered-off base there as **almalinux-10-rhcsa.qcow2**. With a custom XDG_DATA_HOME, use its erudior-vm-labs/images directory. Keep backing disks in place while attempts use them. On Windows copy from the corresponding `/mnt/c/...` path inside WSL. On macOS use `limactl copy ./almalinux-10-rhcsa.qcow2 erudior-labs:/tmp/almalinux-10-rhcsa.qcow2` and install it inside Lima.

```sh
sudo dnf install cloud-init python3 python3-dnf systemd sudo util-linux coreutils \
  autofs nfs-utils tuned selinux-policy-targeted policycoreutils-python-utils \
  firewalld NetworkManager openssh-clients openssh-server httpd curl \
  lvm2 xfsprogs e2fsprogs dosfstools parted at cronie chrony flatpak \
  createrepo_c grubby bzip2 tar man-db man-pages vim-minimal info
```

New attempts in the combined course load the AlmaLinux-specific file. The timed labs check both guest OS identities before the clock starts. Their private link has no Internet route. The manual pair can use a separate NAT adapter or the matching DVD for software workshops. Other courses and preexisting attempts retain their original image at `images/linux-nfs-autofs-v1.qcow2`. To move to AlmaLinux after a legacy practical, save its results and use **Reset disks** only when ready to discard that practical's work.

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

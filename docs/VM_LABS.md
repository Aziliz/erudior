# Local virtual machine labs

Import `samples/demo-vm-lab.json` in the desktop app and open one of its three lessons. **Mount a shared directory on demand** allows repeated practice checks. **Timed network mount practical** grades the same objective once at submission. **Administer a client and a server** uses an author-selected list of weighted tasks. All three use the base image below. Each lesson gets its own pair of disks.

## RHCSA practice exam for RHEL 10

The desktop course's final lesson uses `rhcsa-rhel10-practice-v2`. **Prepare machines** draws a form for the attempt: one task from each of the ten objective-area pools below, and fresh values for every name, size, port, address and time the tasks use (`draw_form` and `draw_params` in `runner.py`). The values go into each guest's cloud-init seed as `/etc/erudior-lab/params.json` (mode 0600), and the guest probe reads them when it checks. The task cards appear when the learner chooses **Begin**; the form and values are pinned to the attempt, and the report keeps the values for review. A reset draws a new form.

Both guests must identify as RHEL 10 or compatible Enterprise Linux 10 before the timer starts. Erudior sets the three-hour time limit, equal 30-point weights and 210/300 practice target. A server configuration that disappears on reboot earns zero even if it was correct at submission.

| Area | Task pool (one is drawn) | VM |
| --- | --- | --- |
| Essential tools | Group-owned setgid directory | Server |
| Software management | DNF repository with a given ID pointed at local metadata, signatures checked | Client |
| Shell scripts | Executable script that classifies an integer against a threshold, run unprivileged | Client |
| Running systems | Active TuneD profile | Server |
| Local storage | XFS logical volume on the data disk mounted persistently · swap partition or LV on the data disk · swap file | Server |
| File systems | Autofs mount of the NFS export | Client |
| Deployment and maintenance | Supplied service enabled and active · daily cron entry in learner's crontab | Server · Client |
| Basic networking | Static address, gateway and DNS on the second interface plus hostname · hosts-file name resolution | Client |
| Users and groups | Local account in a supplementary group | Client |
| Security | httpd on a custom port through firewalld with the SELinux port label · key-based SSH from client to server · SELinux file type | Server · Client |

The fixed first form, `rhcsa-rhel10-practice-v1` (`samples/rhcsa-10-practice-exam.json`), is still accepted, and earlier receipts keep their scores. Its ten tasks are the first or only entry of each pool above, with the default values.

The [Red Hat EX200 objectives](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) specify RHEL 10, hands-on tasks and configurations that survive reboot. The exercises, weights and passing target in this independent mock are Erudior practice settings.

### Extra guest hardware

New disk sets (prepared after this change) get two extra devices. The server has an empty 2 GiB disk (`server-data.qcow2`, guest path `/dev/disk/by-id/virtio-erudior-data`) for the storage tasks. Each guest has a second network interface (client `52:54:00:aa:01:20`, server `52:54:00:aa:01:10`) attached to an empty QEMU hub, so it carries no traffic; cloud-init declares it without addresses. Disks prepared earlier keep their original hardware; a task that needs the new devices or the probe revision 4 stops before the clock starts and asks for fresh disks. Cloud-init now sets the hostname once (`preserve_hostname`), so a learner's hostname change survives reboot.

## Run the desktop labs

Search the desktop Library for **RHCSA preparation • System administration on RHEL 10** or import `samples/rhcsa-10-administration.json`. The Windows, macOS and Linux desktop programs provide the same two guest consoles inside the lesson. A private Linux provider runs QEMU and the grader locally. The two practice machines remain the x86-64 client and server. On Windows and macOS, the provider is an additional local virtualization layer.

| Desktop | Where the provider runs | First use |
| --- | --- | --- |
| Windows | Debian in WSL 2, using that distribution's default Linux user | In PowerShell run `wsl --install -d Debian`. Complete the Debian first-login setup. Confirm `wsl --list --verbose` shows Debian at version 2. For an existing WSL 1 install, use `wsl --set-version Debian 2`. |
| macOS, Intel or Apple silicon | A Lima instance named `erudior-labs` | Install Lima, then run `limactl start --name=erudior-labs --cpus=4 --memory=6 template:debian`. Enter it with `limactl shell erudior-labs`. For an existing stopped instance use `limactl start erudior-labs`. The app locates Lima in the standard Homebrew or MacPorts bin directories. |
| Linux | The account launching the desktop application | Install the tools below on the host. The two guest disks and grading receipts use the existing local lab data directory. |

In a Debian 13 provider run `sudo apt update` and `sudo apt install python3 qemu-system-x86 qemu-utils genisoimage`. On other Linux distributions install equivalent packages. Verify `qemu-system-x86_64 --version` is at least 9.2. The provider also needs Python 3.9 or newer, qemu-img and either genisoimage or xorriso. The in-app serial consoles use the local desktop bridge. Each guest gets 1.5 GiB RAM and two virtual CPUs. Allocate enough provider memory for both guests and Linux itself. Eligible x86-64 hosts can use KVM. Apple silicon and other hosts without usable x86 acceleration use QEMU software emulation; first boot and reboot checks can take several minutes.

### Supply the guest image

Prepare a BIOS-bootable x86-64 RHEL 10 cloud image from media you are entitled to use, or a compatible Enterprise Linux 10 image. Install cloud-init with NoCloud support, Python 3, systemd, autofs, nfs-utils, sudo, util-linux and coreutils. For the newer graded tasks also install lvm2, xfsprogs, parted, httpd, firewalld (enabled), policycoreutils-python-utils, openssh-clients, openssh-server, cronie and NetworkManager. Enable cloud-init and serial login on ttyS0. Shut down the template with fresh cloud-init state. Leave the autofs maps unconfigured. Include DNF with its Python bindings, TuneD and its standard profiles, SELinux targeted policy and tools, swap utilities and runuser/prlimit. Start with SELinux enforcing and the graded paths and names unused. The engine adds the repository metadata and exercise service when it creates the guest disks.

Inside the provider use `mkdir -p ~/.local/share/erudior-vm-labs/images` and copy the powered-off standalone qcow2 to `~/.local/share/erudior-vm-labs/images/linux-nfs-autofs-v1.qcow2`. If you configure XDG_DATA_HOME for the provider process, use that directory instead of ~/.local/share. Keep the base image in place while overlays refer to it.

- On Windows, open Debian and copy the image from its Windows drive mount, for example `cp '/mnt/c/Users/your-name/Downloads/rhel10.qcow2' ~/.local/share/erudior-vm-labs/images/linux-nfs-autofs-v1.qcow2`. Use the actual Windows account and filename.
- On macOS, transfer the image with `limactl copy ./rhel10.qcow2 erudior-labs:/tmp/erudior-base.qcow2`. Inside the Lima instance move it from that temporary path into the images directory under the exact filename above.
- On Linux, copy the image directly into the images directory as the Erudior user.

Open a practice lesson. Start both machines, open each console, press Enter and confirm the guest hostname. For timed work, prepare the pair, begin the attempt and submit from the app. The grader records both observations, and Progress retains the result. Closing a terminal closes its connection. Stopping WSL, Lima or the physical computer interrupts its VMs. After a provider restart, reopen the lesson to see the saved state and recovery options.

The browser catalog offers **RHCSA preparation • RHEL 10 lessons and quizzes**. This edition also imports as an ordinary course JSON, uses browser-local progress and includes 17 instructional lessons with 36 questions. Each edition has a distinct course ID. A browser study record and a desktop VM attempt have independent progress.

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

New disks receive the current guest probe automatically. To keep an older practice client's work, install the updated `src-tauri/src/vm_lab/guest_probe.py` on the client at `/usr/local/libexec/erudior-lab-probe.py`, run `sudo restorecon /usr/local/libexec/erudior-lab-probe.py` and restart `erudior-lab-probe.service`. This revision can recognize a real NFS file beneath a stacked autofs mount. Previously saved practice scores remain readable. Start the fixed mock with freshly prepared disks to receive the supplied service and local repository. In-flight exams started with the older grader finish with their original policy.

## Verify on a Linux host

The default runner unit tests use Python. The focused UI tests use the repository's installed JavaScript dependencies.

```sh
python3 tests/vm_lab_runner_test.py
python3 tests/vm_exam_runner_test.py
python3 tests/vm_tasks_v2_test.py
npm run test:vm-labs
```

For the two-guest acceptance test, supply the same prepared image and run the following command on a Linux host where QEMU can use Unix sockets.

```sh
python3 tests/vm_lab_host.py /absolute/path/to/prepared-cloud-image.qcow2
python3 tests/vm_tasks_host.py /absolute/path/to/prepared-cloud-image.qcow2
python3 tests/vm_tasks_host.py /absolute/path/to/prepared-cloud-image.qcow2 --rhcsa
```

Each test creates its own temporary data directory and overlays. The practice test expects zero of four checks on the clean pair, configures the client through its serial login and expects four of four after reboot. It also exercises stop, resume and reset against those test disks. The authored example checks 7/10 and 10/10. The RHCSA profile test submits two separate attempts and verifies 300/300 with persistent settings and 270/300 with a temporary server directory. The test checks each task on both sides of the relevant reboot. The desktop console buttons also require a packaged run on each target desktop. The host test does not yet solve the six newer tasks or the randomized form; `tests/vm_tasks_v2_test.py` covers their grading logic with simulated guest output, and they still need one run against a real RHEL 10 pair.

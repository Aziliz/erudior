# RHCSA course verification

**Review date** November 21, 2026. **Course** Zero to RHCSA on RHEL 10, revision 4. **Practice system** AlmaLinux 10 x86_64 on the client and server. **Exam reference** Red Hat Enterprise Linux 10.

## Revision 4 curriculum and checks

The single RHEL 10 course contains 15 modules, 73 lessons and 120 questions. The learner starts inside an AlmaLinux guest, practices each new skill in a shared shell, then completes independent work orders and the existing two-machine assessments. All 51 earlier lesson IDs, 76 question IDs and 14 VM scenarios remain addressable. The optional container extension follows the final review. Its lesson and questions are excluded from core completion and core practice by the existing honors settings.

| Outline comparison | How an Erudior learner practices and checks the skill |
| --- | --- |
| Linux setup and shell | Identify a guest, user and prompt. Predict argument boundaries, look up syntax offline, recover from an unfinished command and use the client and server consoles. |
| Files and identity | Diagnose a broken link, extract precise log records, restore both archive formats and test directory traversal. The first independent shift requires a portable restored handoff. |
| Networking and software | Predict a private route and contrast device state with a persistent dual-stack profile. Install and remove a signed DVD RPM and a user-scoped Flatpak from a signed offline repository. |
| Running systems and daily operations | Separate resource usage from elapsed time, inspect journal history, schedule a oneshot and identify the selected time source. The second independent shift requires a working scheduled delivery after boot. |
| Storage, boot and automation | Verify GPT boundaries before and after a partition change, follow a file through its mount, compare running and selected kernels, and test a script using empty, missing, mixed and space-containing inputs. |
| Secure network services | Distinguish a blocked port from an absent listener. Test a response as the intended consumer. Walk directory permissions before troubleshooting SELinux contexts and exercise autofs after a manual NFS mount. |
| Exam and extension | Two rehearsals, an independent archive work order, a timed two-machine assessment and a targeted retake guide. Podman, volume lifetime and the image-mode comparison are optional extensions beyond the current published EX200 task list. |

Pearson's published RHEL 10 lesson outline informed sequencing and the move from demonstration to independent work. Red Hat's public EX200 goals determine the core assessment scope. The **Your route from first login to the practical** reference sets a performance checkpoint for each stage.

The revision 4 import, quiz references, course routes, practical scoring and production build passed. The desktop reader rendered all 73 lessons in Chromium. The release records the six lesson relocations by ID, source module and destination module, bound to the exact revision 3 and 4 package hashes. The publisher still checks all other identities and assessment scenarios. On a disposable AlmaLinux 10.3 guest, checks using the new workshop materials exercised shell expansion, links, regular expressions, both archive formats, directory permissions, script exit codes, GPT partition boundaries, mount hiding and service/timer activation. A signed Flatpak remote installed the inventory app and its runtime, exposed the expected payload and allowed clean removal. A signed tree RPM installed from the course DVD, ran, and was removed. The optional Podman exercise built its shell image locally and recovered the expected text from a named volume after replacing the container. On a second AlmaLinux pair the client fetched the roster through the server firewall, selected the private chrony source and demonstrated the failed and repaired scheduled service.

## Earlier practical verification

The results below describe the revision 2 baseline and its unchanged assessment profiles. They are distinct from the revision 4 checks above.

The content review covers 50 lessons, 36 lesson quizzes with 68 distinct questions, 18 glossary entries, two reference guides and both practical assessment formats. The course maps to all 62 skills in the published EX200 list. Both real-guest mock cases and all six rows of the independent practical passed on AlmaLinux 10.3. The desktop transport and documentation-only alternatives are identified below.

## Scope and evidence

| Check | Result |
| --- | --- |
| Learner interface | In Firefox and Chromium, the production build opened all 50 lessons and passed all 36 quizzes. Chromium entered through the legacy study-course URL and checked all 68 answer keys, choices and explanations against the course source. Both references and all 18 glossary terms opened. The earlier Firefox audit also checked the displayed task counts and caught a shell explanation incorrectly rendered as math. The corrected text passed the complete rerun. |
| Existing learners | Browser migration from the original study course retained an earlier completed lesson after reload. The course integration checks passed for legacy routes, import, question links, grading receipts, learner isolation and saved progress. |
| Linux commands | Both published shell scripts ran with boundary, missing, malformed and spaced-filename inputs. Regular-user tests confirmed mode 0700, parent-directory traversal, hard and symbolic links, gzip and bzip2 extraction, priority changes and TERM handling. |
| Storage and identity | A disposable Fedora 45 QEMU guest exercised GPT, PV/VG/LV operations, setgid inheritance, group rename and aging, XFS and ext4 online growth with retained data, VFAT, swap and mount hiding. A second kernel boot applied the saved fstab using mount -a and swapon -a. Its filesystem markers and swap survived. This was a custom Linux initramfs. |
| Services and packaging | On AlmaLinux, RPM verified the vendor signature of tree 2.1.0-8.el10 (key ID c2a1e572). DNF enforced local package signatures, installed it and removed it after the binary ran. Flatpak added a user remote with a signing key, installed and listed org.erudior.CourseCheck from that remote, then removed the app, runtime and remote. The seeded DNF repository also refreshed with DNF 4 and DNF 5. |
| Provider and build | All 34 Python VM tests, the TypeScript VM and combined-course suites, and the production web build passed. The Python tests include rejection of a different distribution or major release, guest reconnection, polling during reboot and QEMU shutdown. |
| Final source | Checked all lesson and quiz identifiers, every answer index, course references and fenced blocks, catalog metadata, the 10 single-task labs, two rehearsals and the fixed mock. Verified that lab identifiers, weights, time limits and existing question IDs are preserved. |
| AlmaLinux target | Obtained the official AlmaLinux 10.3 x86_64 Generic Cloud build dated 2026-11-16. The downloaded SHA-256 was `845d3a4e41fde973bdbf9763b62a88538c1a1fadc2332a89f6ea01e2c17c78ee` and matched the AlmaLinux download page. The image booted under QEMU. The stock disk lacked autofs, LVM, firewalld, httpd and Flatpak. The preparation VM installed the documented package set using AlmaLinux BaseOS and AppStream with package signature checking, confirmed SELinux Enforcing and produced a standalone qcow2. The timed assessment’s client and server both reported AlmaLinux 10.3 (Mauve Lion) before Begin. |

## Machine-graded AlmaLinux practical

Each attempt started from fresh client and server overlays. The same ten learner configurations were applied through the serial consoles. For the second attempt only, the team directory was placed on a temporary filesystem. Erudior submitted each attempt through its timed grader and rebooted both guests. Its application-side receipt validator and scoring functions accepted the resulting reports.

| Configuration | Before reboot | After both guests rebooted | Application score |
| --- | ---: | ---: | ---: |
| All required changes persistent | 10/10 | 10/10 | **300/300** |
| Team directory deliberately temporary | 10/10 | 9/10 | **270/300** |

Only the team directory lost credit in the second case. The [saved receipts](RHCSA_ALMA_RECEIPTS.json) include every task, point value, before/after result, platform and boot ID. The checks used the course's 180-minute rubric. Both attempts were submitted when their work was ready.

## AlmaLinux workshop observations

The separate workshop pair used a NAT adapter and an isolated private adapter on each guest. A pinned server host key and a client key authenticated an SSH command and SCP transfer over the private link. The client resolved archive.branch.test to 192.168.77.10, retrieved the expected page over HTTP 200, manually mounted the server export, then read the marker via an on-demand NFSv4.2 mount. Both the runtime and saved private-zone firewall policy allowed HTTP. The NAT zone had no HTTP service rule. Chrony selected the designated private server at 192.168.77.10. After the server returned, the client initially showed ^?. Restoring NTP access, marking sources online and requesting fresh samples produced ^*, reference ID C0A84D0A and normal leap status. The scheduling lesson now uses this recovery case. NetworkManager brought up both addresses of the separate dual-stack dummy profile.

The branch archive used a dedicated 2 GiB virtual disk. Its 512 MiB logical volume grew by 256 MiB online. XFS reported 469,762,048 usable bytes before growth and 738,197,504 afterward. The UUID, two original files, mode 2770 and inherited archivists group all matched. The server also passed the account-aging test, filename-with-spaces script tests and the manual 06:15 receipt-service check. Changing the document label made HTTP return 403 under SELinux. Restoring the expected label restored the page. The alternate path rule, port type, persistent Boolean and enforcing/permissive exercises also ran on AlmaLinux. A second storage workshop added a PV, extended ext4, remounted a labeled VFAT filesystem, demonstrated mount hiding and retired the training volumes. The actual at job, recurring cron job and systemd calendar timer all fired. The user and group lifecycle, limited sudo rule, regular-user permissions, both archives, process priority and shell input cases ran on the AlmaLinux client.

All six rows of the independent practical passed after a normal server reboot. The client received HTTP 200 and the exact branch marker while the private zone allowed only HTTP in both runtime and permanent configuration. The XFS UUID was `2852b278-8167-4465-aaa7-18ab816cc841`. At the GRUB console a one-time edit selected rescue mode. The authenticated shell reported active rescue.target on boot `5f0b8bab-c21c-4b37-957c-1b46d2e4de3a`. Removing the faulty mount definition restored a clean fstab verification. The next normal boot, `a3692e76-e70c-47be-863b-f1911070b53d`, reached multi-user.target without either training kernel argument and retained the earlier journal marker.

## Published skills mapped to course work

Counts follow the order of the skills in each Red Hat objective group. The examples below describe exercises in this course. The ten-task desktop mock samples each group. Workshops and the independent practical provide the rest of the practice.

| Objective group | Skills | Where to demonstrate them |
| --- | ---: | --- |
| Essential tools | 11 | **First prompt**, **Streams**, **Path walk**, **Edit and find help**, **Shell evidence**, **Identity**, and **SSH/firewall** cover prompt syntax, redirection, regex filtering, remote login, user switching, both archive formats, editing, file operations, links, access modes and offline manuals. |
| Software | 4 | **Software model**, **Choose and verify a software source**, and **Bring an offline RPM source online** cover adding a repository, inspecting a signature, RPM installation/removal, and the Flatpak remote and app lifecycle. |
| Scripts | 4 | **Build a decision**, **Turn a shell command into a testable tool**, and the classifier lab use tests, quoted arguments, loops and command output. Check both output streams and the exit status. |
| Operating systems in use | 10 | **Processes**, **Operations**, **Journal case**, **Boot targets**, **Boot repair**, **Tuning lab**, **Web service**, and **SSH/firewall** cover normal shutdown, boot interruption and target selection, CPU/memory diagnosis, priorities, tuning, journal interpretation and persistence, service control, and remote file transfer. |
| Local storage | 6 | **Storage map**, **LVM workshop**, **Swap workshop**, **Add capacity**, and **Mount identities** cover GPT changes, PV lifecycle, two-PV groups, LV lifecycle, UUID/label persistence, and adding capacity while retaining existing data. |
| Filesystems | 5 | **Mount case**, **Mount identities**, **NFS reasoning**, **NFS lab**, **Add capacity**, and **Permission model** cover local filesystem types, remote mounting, autofs triggers, LV extension and permissions diagnosis. |
| Deployment and maintenance | 6 | **Schedulers and time**, **Unit lifecycle**, **Boot targets**, **Boot repair**, **Software model**, and the manual pair cover one-time/recurring work, startup services, default targets, NTP selection, software sources and bootloader changes. Red Hat CDN practice requires an entitled RHEL guest. AlmaLinux practice uses its own mirrors or DVD. |
| Networking | 4 | **Network path**, **Resolver lab**, **Web service** and the manual pair cover a persistent dual-stack profile, name resolution, service startup and access rules attached to a private interface. |
| Users and groups | 4 | **Identity**, **Account policy** and **Operator lab** cover account creation/modification/deletion, interactive passwords and expiration, group rename and membership, and a limited sudo grant. |
| Security | 8 | **Permission model**, **Shell evidence**, **SSH/firewall**, **Web service**, **SELinux context** and **SELinux lab** cover firewall state, umask, key login, enforcing/permissive modes, process/file contexts, default labels, port type and Booleans. |

## Corrections learners will see

The installer, release check, quiz and software workshops now use AlmaLinux on the practice pair. During live testing, the guest service sometimes closed its observation port between adjacent checks. It now keeps the port open. A slow QEMU monitor reply also interrupted status polling during a reboot. The status panel now recognizes a running guest by checking its process, working directory and disk. Grading still requires a new guest boot ID. The host accepts a closed monitor after sending QEMU quit and confirms process exit before removing an overlay. The package lessons distinguish AlmaLinux mirrors and DVD keys from Red Hat CDN registration. The manual pair binds its private adapter to a separate firewalld zone before permitting NFS, SSH or HTTP.

Learners now rename a group and verify that its GID survives, test malformed and oversized script arguments, force SSH public-key authentication, check RPM signatures for local transactions, and compare both archive formats after extraction. The boot, journal, swap, scheduling, SELinux and service lessons ask for observable results. The independent practical now gives the same 06:15 delivery time in its brief and work order.

## Reproducing the desktop check

On a Linux desktop or the documented WSL/Lima provider, supply the prepared standalone AlmaLinux disk to the acceptance command below. It starts a fresh pair for each case, logs into their serial consoles as the learner, submits the ten tasks, reboots both roles, and compares every before/after flag. The full configuration should earn 300 points. Making only the team directory transient should earn 270.

This verification host refused to create Unix-domain sockets. For the live exam runs it connected QEMU’s monitor, serial console, observation channel and private guest link via host loopback TCP. The production application retains Unix-domain sockets. The graphical desktop console and its default transport still require a run on a desktop provider. The cloud-image installation route ran here. The alternative graphical ISO installation and Red Hat subscription/CDN exercise received documentation review. The latter requires an entitled RHEL system.

```sh
python3 tests/vm_tasks_host.py /absolute/path/to/almalinux-10-rhcsa.qcow2 --rhcsa
```

[Red Hat EX200 objectives and format](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) · [Sander van Vugt’s published RHEL 10 course outline](https://www.pearsonitcertification.com/store/red-hat-rhcsa-rhel-10-with-exam-labs-pearson-cert-prep-9780135493106) · [AlmaLinux image downloads and checksums](https://almalinux.org/get-almalinux/) · [Desktop VM setup](VM_LABS.md) · [QEMU quit semantics](https://www.qemu.org/docs/master/interop/qemu-qmp-ref.html) · [chronyc commands](https://chrony-project.org/doc/4.8/chronyc.html)

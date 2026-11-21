# RHCSA course verification

**Review date** November 20, 2026. **Course** Zero to RHCSA on RHEL 10, revision 2. **Practice system** AlmaLinux 10 x86_64 on the client and server. **Exam reference** Red Hat Enterprise Linux 10.

The content review covers 50 lessons, 36 lesson quizzes with 68 distinct questions, 18 glossary entries, two reference guides and both practical assessment formats. The course maps to all 62 skills in the published EX200 list. A release-quality end-to-end pass of the AlmaLinux practical is still open.

## Scope and evidence

| Check | Result |
| --- | --- |
| Learner interface | In the local production build, Firefox opened all 50 lessons, submitted all 68 keyed answers across 36 quizzes, checked their feedback and explanations, opened both references and found all 18 glossary terms. The test also checked each practical’s task count. One shell explanation rendered as math. After the wording was corrected, the complete browser run passed. |
| Existing learners | Browser migration from the original study course retained an earlier completed lesson after reload. The course integration checks passed for legacy routes, import, question links, grading receipts, learner isolation and saved progress. |
| Linux commands | Both published shell scripts ran with boundary, missing, malformed and spaced-filename inputs. Regular-user tests confirmed mode 0700, parent-directory traversal, hard and symbolic links, gzip and bzip2 extraction, priority changes and TERM handling. |
| Storage and identity | A disposable Fedora 45 QEMU guest exercised GPT, PV/VG/LV operations, setgid inheritance, group rename and aging, XFS and ext4 online growth with retained data, VFAT, swap and mount hiding. A second kernel boot applied the saved fstab using mount -a and swapon -a. Its filesystem markers and swap survived. This was a custom Linux initramfs. |
| Services and packaging | The seeded offline DNF repository refreshed under DNF 4 and DNF 5. The systemd unit and timer files, calendar expression, sudoers entry and chrony configuration passed parser checks. A real OpenSSH server accepted a pinned-host-key, public-key-only login and an SCP transfer to a separate account over guest loopback. Flatpak CLI options were checked. A signed application install/removal still needs a successful run. |
| Existing desktop provider | All 29 pre-change Python provider tests passed inside a disposable Linux guest, including the console and submission tests. The TypeScript VM suites and production build passed before the AlmaLinux-specific source changes. |
| Final source | Checked all lesson and quiz identifiers, every answer index, course references and fenced blocks, catalog metadata, the 10 single-task labs, two rehearsals and the fixed mock. Verified that lab identifiers, weights, time limits and existing question IDs are preserved. |
| AlmaLinux target | Obtained the official AlmaLinux 10.3 x86_64 Generic Cloud build dated 2026-11-16. The downloaded SHA-256 was `845d3a4e41fde973bdbf9763b62a88538c1a1fadc2332a89f6ea01e2c17c78ee` and matched the AlmaLinux download page. The workstation disconnected before a guest boot. The final AlmaLinux-specific edits, new provider tests and two-guest acceptance test have source checks only. |

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

The installer, release check, quiz and software workshops now use AlmaLinux on the practice pair. The package lessons distinguish AlmaLinux mirrors and DVD keys from Red Hat CDN registration. The manual pair binds its private adapter to a separate firewalld zone before permitting NFS, SSH or HTTP.

Learners now rename a group and verify that its GID survives, test malformed and oversized script arguments, force SSH public-key authentication, check RPM signatures for local transactions, and compare both archive formats after extraction. The boot, journal, swap, scheduling, SELinux and service lessons ask for observable results. The independent practical now gives the same 06:15 delivery time in its brief and work order.

## Outstanding AlmaLinux acceptance

1. Prepare the AlmaLinux base in the desktop setup guide and boot a fresh client/server pair. Record the two actual distribution IDs, version IDs, hostnames and boot IDs. Run the local build and the course/provider tests against this revision, including rejection of the wrong distribution or major version.
2. Run the repository's real-guest acceptance command below. Its two fresh attempts check all ten tasks after reboot. The first expects 300/300. The second intentionally makes the team directory transient and expects 270/300. Record both reports with the two guest identities.
3. Run the manual pair and six-row independent practical on AlmaLinux. Record results for GRUB/rescue, real scheduler firing, chrony source selection, private-interface firewall access, cross-guest SSH/NFS/autofs, enforcing SELinux and signed RPM/Flatpak transactions. Use separate RHEL credentials and media only for the Red Hat CDN transfer exercise.

```sh
python3 tests/vm_tasks_host.py /absolute/path/to/almalinux-10-rhcsa.qcow2 --rhcsa
```

[Red Hat EX200 objectives and format](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) · [Sander van Vugt’s published RHEL 10 course outline](https://www.pearsonitcertification.com/store/red-hat-rhcsa-rhel-10-with-exam-labs-pearson-cert-prep-9780135493106) · [AlmaLinux image downloads and checksums](https://almalinux.org/get-almalinux/) · [Desktop VM setup](VM_LABS.md)

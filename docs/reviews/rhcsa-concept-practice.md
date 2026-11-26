# RHCSA administration course review

**Course** `rhcsa-rhel10-administration`. **Date** November 26, 2026. **Reviewer** Independent AI content reviewer, separate from the revision author.

The course starts at a learner's first AlmaLinux login and builds to an independent two-machine administration practical. The revision 8 baseline contained 80 lessons, 124 knowledge checks, and no authored study cards. The cards address interpretation and recall. Execution, troubleshooting and verification after restart remain practical objectives.

## Source comparisons

| Source checked on November 26 | Objective and comparison |
| --- | --- |
| [Red Hat EX200, Study points for the exam](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) | Red Hat specifies RHEL 10, requires practical administration and expects changes to survive a reboot. The Erudior service, storage, permissions and security units cover these categories using AlmaLinux practice guests. Reviewing a written answer does not demonstrate practical performance. |
| [Dartmouth Research Computing, Advanced Linux](https://rc.dartmouth.edu/hpc-cookbook/fundamentals/linux-advanced/) | The permission and redirection sections support interpreting permission fields and predicting what reaches the next pipeline command in `permission-model` and `streams`. Dartmouth teaches shell use on a computing cluster. It does not assess this course's two-guest administration workflow. |
| [Portland State University, Working with Files](https://web.cecs.pdx.edu/~dmcgrath/courses/F26/introsec/working-with-files.html) | The link examples show why another hard link survives a rename and why a symbolic link targeting the old path can break. They support the explanation in `links-and-names`. Portland State also describes setgid directories, which supports the shared-directory exercise. |
| [GNU Bash manual, Bash Startup Files](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files) | An interactive non-login Bash normally reads the user's bashrc. A login Bash reads a login profile, which may in turn source bashrc. This distinction determined the wording finding below. |

## Baseline knowledge checks

For all 124 revision 8 items in bank `knowledge-checks`, the reviewer first saw only the stems and choices, selected one answer per item, then compared those selections with the stored keys. All 124 selections matched. Two correct options depended on conditions their prompts omitted.

| Item | Observation | Expected correction |
| --- | --- | --- |
| `security-umask-persist` | The prompt and explanation generalize a Bash startup-file convention to every interactive shell. File creation mode also depends on the mode requested by the program and any default ACL. | Identify Bash, the startup files used in the exercise and the file-creation conditions. |
| `running-rootpw` | The relabel marker's absolute pathname depends on which root directory the recovery shell sees. | Specify that the administrator is inside the writable, installed system's chroot when creating the marker. |

This pass checked the answer selection on the original bank and inspected explanations associated with the findings. It did not rerun the virtual machines, timers, network exercises, exam software or learner trials.

## Revision 9 study cards

The reviewer answered all eight fronts in deck `rhcsa-rhel10-administration-concepts` before opening their backs. Each back agreed with the independent solution. The following IDs use the common prefix `rhcsa-rhel10-administration-concept-`.

| Card | Skill checked | Lesson that demonstrates the skill |
| --- | --- | --- |
| 01 | Quote the expanded pathname and end option parsing | `shell-words` |
| 02 | Recognize shared inode identity and predict what happens after a name is removed | `links-and-names` |
| 03 | Distinguish listing a directory from searching the path to a readable file | `directory-access` |
| 04 | Distinguish a unit's enablement from its current activation | `unit-lifecycle` |
| 05 | Restrict service logs to the current boot | `journal-case` |
| 06 | Distinguish allocated LV capacity from mounted filesystem capacity | `lvm-workshop` |
| 07 | Check the intended mount after reboot | `mount-identities` |
| 08 | Verify a backup by extracting it separately and comparing it with the expected files | `archive-restore` |

The reviewer ran three checks in a temporary Linux directory. A quoted pathname containing a space and beginning with a dash reached `ls` intact. Two hard links shared an inode and the remaining name retained the contents after the first was deleted. A fresh tar extraction produced identical file bytes. The remaining cards received content review only.

## Revision 9 bank retest

Reviewed package SHA-256 `74b8ffeedaa968031571b6e7f4b6479fde4cc727618098a73cfd8f7f0522a5ff`. Both revised prompts now supply the missing conditions. The selected answers still apply. The reviewer also created an ordinary file with Bash under umask 027 and confirmed with GNU stat that its mode was 640 and its symbolic display was `-rw-r-----`.

The new item `permission-model-symbolic-0640` asks learners to produce the nine permission characters independently. The original implementation accepted an uppercase answer. After the author enabled case-sensitive grading, the actual course scorer accepted `rw-r-----` and rejected `RW-R-----`, `rwxr-----`, `rw-r--`, `-rw-r-----` and `0640`. The app's standard text normalization still tolerates trailing sentence punctuation. The revised package contains 125 questions across two response formats.

# RHCE in Ansible bank review

Course `rhce-ansible-alma10`, revision 4, SHA-256 `fe4cff22f5af19d2a9930edefcd09a9617fd29ae50608c9443be8e516b6f934a`. Reviewed November 26, 2026 by an independent AI reviewer. The learner practices Linux administration and remote access before using inventory, playbooks, roles and collections to deploy and recover a repeatable service on two AlmaLinux guests.

The current course has 41 lessons, 82 cards across 10 decks, 10 practical assignments and 10 rubrics. Its 152 questions comprise 89 single-choice, 17 multiple-select, 25 typed, 14 matching and seven ordering questions. The November 23 workbook described a different RHCE draft with 87 single-choice items. Adding a new bank or card deck to revision 4 to correct that older finding would duplicate existing work.

## Source comparisons

| Free material checked November 26 | Objective and comparison |
| --- | --- |
| [Ansible, Using variables](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_variables.html) and [Roles](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_reuse_roles.html) | The dictionary key in the loop exercise can be accessed using dot or bracket syntax. The role's low-precedence inputs belong under defaults, conventionally in defaults/main.yml. Both forms of each answer already receive credit. |
| [Portland State University, Ansible: Writing Playbooks From Scratch](https://web.cecs.pdx.edu/~dmcgrath/courses/Su26/secdevops/ansible.html) | The course connects declarative tasks to idempotency, variables, templates and roles. Erudior additionally requires an independent read from the target and a repeat run to establish delivery and convergence. |
| [Temple University, Ansible playbooks](https://www.hpc.temple.edu/mhpc/hpc-technology/exercise7/playbooks.html) | The examples distinguish copying source files to remote machines from setting file attributes, matching the shift-notice deployment. Erudior also tests reboot persistence and drift repair. |

## Independent review

The reviewer viewed stems and answer options, with keys and explanations withheld. Course-specific filenames were resolved against lesson text. One answer per question was recorded, including all selections for multiple-select, all pairs for matching and the entire sequence for ordering. Erudior's `isCorrect` accepted all 152 independently supplied responses. The reviewer then compared requested answer forms with the accepted forms. These discrepancies remained in revision 4.

| Item | Observed discrepancy | Expected correction |
| --- | --- | --- |
| `rhce-deploy-the-notice-apply-1` | The instruction to order the rest of the procedure follows an instruction to record the baseline. Recording the baseline is itself one of the five tiles. | Ask for the entire five-step sequence, keeping the independent read immediately after the first application. |
| `rhce-loop-over-channels-apply-1` | The prompt requires dot notation. The scorer also accepts both common bracket notations. All three address the requested key. | Request an expression using either notation. |
| `rhce-author-role-apply-1` | The prompt requests only a directory name, but the key accepts a filename relative to the role root. | Request the directory or its conventional main file, keeping all three accepted forms. |

The three discrepancies are independently reproducible in these revision 4 bytes. No prior working copy was available for comparison. The existing cards, lab steps, explanations beyond the scoped findings, VM behavior and signed deployment were outside this review.

## Revision 5 retest

All three revised prompts specify the full set of accepted responses or the exact order being assessed. All 152 original independent responses passed the scorer on revision 5, SHA-256 `7b1ff21e1d5eff1cba66e5e242f88d72375bdb8498569865e72a37d5cefc821c`. Swapping the last two steps failed. Dot notation and both quoted bracket forms passed, while `item.id` failed. `defaults`, `defaults/` and `defaults/main.yml` passed, while `vars/main.yml` failed. All three wording findings are closed on these package bytes.

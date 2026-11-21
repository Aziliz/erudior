// Same-major course consolidations. Different major versions keep separate course identities.
// Only IDs and shared progress keys belong here. The duplicate has no catalog entry or package.
export const courseDuplicates = [{
  id: "rhcsa-rhel10-study",
  replacementId: "rhcsa-rhel10-administration",
  sharedLessons: [
    "first-session", "shell-evidence", "account-policy", "rpm-flatpak", "script-contract",
    "operations", "boot-targets", "root-recovery", "lvm-workshop", "swap-workshop",
    "mount-identities", "unit-lifecycle", "schedules-time", "network-path", "ssh-firewall",
    "selinux-context", "after-action",
  ],
}];

export const duplicateCourse = (id: string) => courseDuplicates.find(course => course.id === id);

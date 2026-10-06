export const ROLES = [
  { id: 'parent', label: 'Parent', icon: 'users' },
  { id: 'sibling', label: 'Sibling', icon: 'user-check' },
  { id: 'bestfriend', label: 'Best Friend', icon: 'heart' },
  { id: 'partner', label: 'Partner', icon: 'heart-handshake' },
  { id: 'mentor', label: 'Mentor', icon: 'graduation-cap' },
  { id: 'colleague', label: 'Colleague', icon: 'briefcase' },
  { id: 'other', label: 'Other', icon: 'user' },
] as const;

export type RoleId = (typeof ROLES)[number]['id'];

export function getRoleLabel(roleId: string): string {
  const role = ROLES.find((r) => r.id === roleId);
  return role?.label ?? roleId;
}

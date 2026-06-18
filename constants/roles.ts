export const ROLES = [
  { id: 'parent', label: 'Parent', icon: 'people' },
  { id: 'sibling', label: 'Sibling', icon: 'people-outline' },
  { id: 'bestfriend', label: 'Best Friend', icon: 'heart' },
  { id: 'partner', label: 'Partner', icon: 'heart-outline' },
  { id: 'mentor', label: 'Mentor', icon: 'school' },
  { id: 'colleague', label: 'Colleague', icon: 'briefcase' },
  { id: 'other', label: 'Other', icon: 'person' },
] as const;

export type RoleId = (typeof ROLES)[number]['id'];

export function getRoleLabel(roleId: string): string {
  const role = ROLES.find((r) => r.id === roleId);
  return role?.label ?? roleId;
}

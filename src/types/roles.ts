// Role constants and helper functions
export const USER_ROLES = {
  NURSE: 'employee',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Helper function to check if user has supervisor role
export function isSupervisor(userRole: string): boolean {
  return userRole === USER_ROLES.SUPERVISOR || userRole === USER_ROLES.ADMIN;
}

// Helper function to check if user has nurse role
export function isNurse(userRole: string): boolean {
  return userRole === USER_ROLES.NURSE;
}

// Helper function to check if user can access personal data reports
export function canAccessPersonalDataReports(userRole: string): boolean {
  return isNurse(userRole) || isSupervisor(userRole);
}

// Helper function to check if user can access supervisor-only reports
export function canAccessSupervisorReports(userRole: string): boolean {
  return isSupervisor(userRole);
}

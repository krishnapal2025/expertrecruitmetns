/**
 * Utility functions for handling authentication and authorization
 */

interface UserData {
  id: number;
  email: string;
  userType: string;
  [key: string]: any;
}

interface ProfileData {
  id: number;
  role?: string;
  specialPrivileges?: {
    canOverrideRestrictions: boolean;
    canAccessAllAreas: boolean;
    canModifyAllContent: boolean;
    canManageAllUsers: boolean;
    canBypassApprovals: boolean;
  };
  [key: string]: any;
}

interface AuthUser {
  user?: UserData;
  profile?: ProfileData;
  userType?: string; // For compatibility with different auth structures
  [key: string]: any;
}

/**
 * Checks if a user has admin privileges
 */
export function isAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  
  // Handle nested user object format
  if (user.user?.userType) {
    return user.user.userType === "admin" || user.user.userType === "super_admin";
  }
  
  // Handle flat user format
  if (user.userType) {
    return user.userType === "admin" || user.userType === "super_admin";
  }
  
  return false;
}

/**
 * Checks if a user has super admin privileges
 */
export function isSuperAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  
  // Handle nested user object format
  if (user.user?.userType) {
    return user.user.userType === "super_admin";
  }
  
  // Handle flat user format
  if (user.userType) {
    return user.userType === "super_admin";
  }
  
  return false;
}

/**
 * Checks if a user has a specific special privilege
 * Only super_admin users have special privileges
 */
export function hasSpecialPrivilege(
  user: AuthUser | null | undefined,
  privilege: keyof ProfileData['specialPrivileges']
): boolean {
  if (!user) return false;
  
  // First verify the user is a super_admin
  if (!isSuperAdmin(user)) return false;
  
  // Check if the special privilege exists and is true
  return !!user.profile?.specialPrivileges?.[privilege];
}

/**
 * Get the role name in a user-friendly format
 */
export function getUserRoleName(user: AuthUser | null | undefined): string {
  if (!user) return 'Guest';
  
  // Handle nested user object format with priority to explicitly set role in profile
  if (user.profile?.role) {
    return formatRoleName(user.profile.role);
  }
  
  // Fall back to user type
  if (user.user?.userType) {
    return formatRoleName(user.user.userType);
  }
  
  // Handle flat user format
  if (user.userType) {
    return formatRoleName(user.userType);
  }
  
  return 'Guest';
}

/**
 * Format role name for display
 */
function formatRoleName(role: string): string {
  if (role === 'super_admin') return 'Super Administrator';
  if (role === 'admin') return 'Administrator';
  if (role === 'employer') return 'Employer';
  if (role === 'jobseeker') return 'Job Seeker';
  
  // Capitalize first letter of each word
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
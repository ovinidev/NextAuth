import { useAuth } from './useAuth';

interface UseCanProps {
  permissions?: string[];
  roles?: string[];
}

export const usePermissions = ({
  permissions = [],
  roles = [],
}: UseCanProps) => {
  const { accountInfo } = useAuth();

  if (!accountInfo.isAuthenticated) {
    return false;
  }

  if (permissions.length > 0) {
    const hasAllPermissions = permissions.every((permission) => {
      return accountInfo.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles.length > 0) {
    const hasAllRoles = roles.some((role) => {
      return accountInfo.roles.includes(role);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
};

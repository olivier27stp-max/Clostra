'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Permission, hasPermission, hasAnyPermission } from '@/types/permissions';
import type { UserRole } from '@/types/database';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseRoleGuardOptions {
  /** Required role(s). User must have at least one of these roles. */
  roles?: UserRole[];
  /** Required permission(s). User must have at least one of these. */
  permissions?: Permission[];
  /** Where to redirect on failure. Defaults to /dashboard. */
  redirectTo?: string;
}

interface UseRoleGuardResult {
  isAuthorized: boolean;
  isLoading: boolean;
}

export function useRoleGuard(
  options: UseRoleGuardOptions = {}
): UseRoleGuardResult {
  const { roles, permissions, redirectTo = '/dashboard' } = options;
  const { role, isLoading } = useAuthStore();
  const router = useRouter();

  const isAuthorized = (() => {
    if (isLoading || !role) return false;

    if (roles && roles.length > 0) {
      if (!roles.includes(role)) return false;
    }

    if (permissions && permissions.length > 0) {
      if (!hasAnyPermission(role, permissions)) return false;
    }

    return true;
  })();

  useEffect(() => {
    if (!isLoading && !isAuthorized && role) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthorized, role, router, redirectTo]);

  return { isAuthorized, isLoading };
}

// ---------------------------------------------------------------------------
// Component wrapper
// ---------------------------------------------------------------------------

interface RoleGuardProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: Permission[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  roles,
  permissions,
  redirectTo,
  fallback,
}: RoleGuardProps) {
  const { isAuthorized, isLoading } = useRoleGuard({
    roles,
    permissions,
    redirectTo,
  });

  if (isLoading) {
    return (
      fallback ?? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      )
    );
  }

  if (!isAuthorized) {
    return (
      fallback ?? (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <p className="text-lg font-semibold text-text-primary">
            Access Denied
          </p>
          <p className="text-sm text-text-secondary">
            You do not have permission to view this page.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}

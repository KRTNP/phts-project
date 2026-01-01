/**
 * Navigation helpers for role-aware dashboard routing.
 */
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/api/authApi';

/**
 * Map user role to dashboard home path.
 */
export function getDashboardHome(role?: string): string {
  switch (role) {
    case 'HEAD_DEPT':
    case 'PTS_OFFICER':
    case 'HEAD_HR':
    case 'DIRECTOR':
    case 'HEAD_FINANCE':
      return '/dashboard/approver';
    default:
      return '/dashboard/user';
  }
}

/**
 * Navigate back if history exists, otherwise go to role home.
 */
export function navigateBackOrHome(
  router: ReturnType<typeof useRouter>,
  role?: string
) {
  const fallback = getDashboardHome(role);
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
  } else {
    router.push(fallback);
  }
}

/**
 * Hook that returns a goBack handler and fallbackPath based on current user role.
 */
export function useRoleAwareBack() {
  const router = useRouter();
  const currentUser = AuthService.getCurrentUser();
  const fallbackPath = useMemo(
    () => getDashboardHome(currentUser?.role),
    [currentUser?.role]
  );

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  }, [router, fallbackPath]);

  return { goBack, fallbackPath };
}

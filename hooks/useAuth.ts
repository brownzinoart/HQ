import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isContributor: session?.user?.role === UserRole.CONTRIBUTOR,
    isViewer: session?.user?.role === UserRole.VIEWER,
    canEdit: session?.user?.role === UserRole.CONTRIBUTOR,
    canComment: true, // Both roles can comment
  };
}
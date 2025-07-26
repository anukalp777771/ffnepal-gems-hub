import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (adminOnly && !isAdmin) {
        navigate('/');
        return;
      }
    }
  }, [user, profile, loading, adminOnly, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (adminOnly && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
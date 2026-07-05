import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import type { Role } from '../../services/auth.service';

export default function RequireAuth({ role, children }: { role?: Role; children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    const roleLower = user.role.toLowerCase();
    const fallbackPath = roleLower === 'admin' 
      ? '/admin/dashboard' 
      : roleLower === 'owner' 
      ? '/owner/dashboard' 
      : '/resident/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }
  return <>{children}</>;
}

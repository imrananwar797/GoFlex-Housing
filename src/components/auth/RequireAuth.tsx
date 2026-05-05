import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import type { Role } from '../../services/auth.service';

export default function RequireAuth({ role, children }: { role?: Role; children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/dashboard-admin' : '/dashboard'} replace />;
  return <>{children}</>;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService, AuthUser, Role } from '../services/auth.service';
import { supabaseService, supabase } from '../services/supabase.service';
import { socketService } from '../services/socket.service';

interface AuthContextValue {
  user: AuthUser | null;
  login: (u: string, p: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'goflex_auth_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const savedUser = JSON.parse(raw);
        setUser(savedUser);
        if (savedUser.id) {
          supabaseService.subscribeToNotifications(savedUser.id, (notif) => {
            console.log('Push notification:', notif.message);
          });
        }
      }
    } catch {}
  }, []);

  // Listen for Supabase OAuth session changes
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const localUser: AuthUser = {
          id: parseInt(session.user.id.replace(/\D/g, '').slice(0, 8)) || 101,
          username: session.user.email?.split('@')[0] || 'google_user',
          email: session.user.email || '',
          role: 'resident',
          token: session.access_token
        };
        setUser(localUser);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    setUser,
    async login(u, p) {
      const res = await authService.login(u, p);
      if (!res.requires_2fa && res.access_token) {
        const authUser: AuthUser = {
          id: res.user.id,
          username: res.user.username,
          email: res.user.email,
          role: res.user.role.toLowerCase(),
          token: res.access_token
        };
        setUser(authUser);
        supabaseService.subscribeToNotifications(res.user.id, (notif) => {
          console.log('Push notification:', notif.message);
        });
      }
      return res;
    },
    async loginWithGoogle() {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      if (error) throw error;
      return data;
    },
    async register(data) {
      const res = await authService.register(data);
      const authUser: AuthUser = {
        id: res.id,
        username: res.username,
        email: res.email,
        role: res.role.toLowerCase(),
        token: res.access_token
      };
      setUser(authUser);
      if (res.access_token) {
        socketService.connect(res.access_token);
      }
    },
    logout() { 
      setUser(null); 
      localStorage.removeItem(STORAGE_KEY);
      if (supabase) {
        supabase.auth.signOut();
      }
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

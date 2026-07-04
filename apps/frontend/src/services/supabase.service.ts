import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const supabaseService = {
  /**
   * Subscribe to real-time notifications for a specific user
   * @param userId The ID of the user to listen for
   * @param callback Function to call when a notification is received
   */
  subscribeToNotifications(userId: number, callback: (payload: any) => void) {
    if (!supabase) {
      console.warn('Supabase not configured, real-time notifications disabled.');
      return () => {};
    }
    const channel = supabase
      .channel(`notifications:user_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notification',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Real-time notification received:', payload);
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Helper to send a test notification (Development only)
   */
  async sendTestNotification(userId: number, message: string) {
    if (!supabase) {
      console.warn('Supabase not configured, sendTestNotification skipped.');
      return { data: null, error: new Error('Supabase not configured') };
    }
    const { data, error } = await supabase
      .from('Notification')
      .insert([
        { user_id: userId, title: 'Test Alert', message: message }
      ]);
    return { data, error };
  }
};

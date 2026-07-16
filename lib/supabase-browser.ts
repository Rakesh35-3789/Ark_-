import { createClient } from '@supabase/supabase-js';

export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const safeUrl = url || 'https://placeholder.supabase.co';
  const safeKey = key || 'placeholder-public-anon-key';
  return createClient(safeUrl, safeKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

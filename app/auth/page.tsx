'use client';

import { FormEvent, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import Link from 'next/link';

export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage('');
    const form = new FormData(e.currentTarget); const email = String(form.get('email')); const password = String(form.get('password')); const fullName = String(form.get('fullName') || '');
    const supabase = createBrowserSupabase();
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${location.origin}/auth/callback` } });
    if (result.error) setMessage(result.error.message);
    else if (mode === 'signup') setMessage('Account created. Check your email to verify your account.');
    else location.href = '/dashboard';
    setBusy(false);
  }
  return <main className="auth-page"><form className="form-card" onSubmit={submit}>
    <div className="eyebrow">Secure ARK account</div><h1>{mode === 'login' ? 'Welcome back' : 'Join the network'}</h1>
    {mode === 'signup' && <label>Full name<input name="fullName" minLength={2} required /></label>}
    <label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" minLength={8} required /></label>
    {message && <div className="notice">{message}</div>}<button className="button" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
    <button type="button" className="text-action" onClick={() => {setMode(mode === 'login' ? 'signup':'login'); setMessage('')}}>{mode === 'login' ? 'New to ARK? Create an account' : 'Already have an account? Sign in'}</button>
    {mode === 'login' && <Link className="text-action" href="/auth/forgot-password">Forgot password?</Link>}
  </form></main>;
}

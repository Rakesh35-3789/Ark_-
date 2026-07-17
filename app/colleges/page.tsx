'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Lock, Mail, UserRound } from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabase-browser';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const fullName = String(form.get('fullName') ?? '').trim();
    const supabase = createBrowserSupabase();

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) setMessage(error.message);
      else setMessage('Account created. Check your email to verify your account.');
      setBusy(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setMessage(error?.message ?? 'Unable to sign in.');
      setBusy(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    window.location.href = profile?.role === 'admin' ? '/admin' : '/dashboard';
  }

  return (
    <main className="auth-page ark-auth-page">
      <form className="form-card ark-auth-card" onSubmit={submit}>
        <div className="ark-auth-brand">
          <span>ARK</span>
          <small>CHRONICLES</small>
        </div>

        <div className="auth-mode-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => { setMode('signup'); setMessage(''); }}
          >
            Join ARK
          </button>
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setMessage(''); }}
          >
            Login
          </button>
        </div>

        <div>
          <div className="eyebrow">Secure ARK account</div>
          <h1>{mode === 'login' ? 'Welcome back' : 'Join the network'}</h1>
          <p className="auth-copy">
            {mode === 'login'
              ? 'Normal users and admins sign in here using their own email and password.'
              : 'Create your ARK account to publish and follow your submissions.'}
          </p>
        </div>

        {mode === 'signup' && (
          <label>
            Full name
            <span className="auth-input-wrap"><UserRound size={18} /><input name="fullName" minLength={2} required /></span>
          </label>
        )}

        <label>
          Email
          <span className="auth-input-wrap"><Mail size={18} /><input name="email" type="email" required /></span>
        </label>

        <label>
          Password
          <span className="auth-input-wrap"><Lock size={18} /><input name="password" type="password" minLength={8} required /></span>
        </label>

        {message && <div className="notice">{message}</div>}

        <button className="button auth-submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in securely' : 'Create account'}
        </button>

        {mode === 'login' && (
          <Link className="text-action auth-forgot" href="/auth/forgot-password">
            Forgot password?
          </Link>
        )}

        <p className="admin-login-note">
          Admin access is not public. Only an account marked as <strong>admin</strong> in Supabase receives admin control.
        </p>
      </form>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

import { createBrowserSupabase } from '@/lib/supabase-browser';

type Mode = 'signup' | 'login';

const roles = [
  'Reader',
  'Student',
  'Founder',
  'Researcher',
  'Investor',
  'College Representative',
];

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('signup');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState('Reader');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setMessage('');
    setErrorMessage('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    setMessage('');
    setErrorMessage('');

    if (mode === 'signup' && fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setBusy(true);

    try {
      const supabase = createBrowserSupabase();

      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        router.push('/dashboard');
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            college: college.trim(),
            institution: college.trim(),
            role: role.toLowerCase().replaceAll(' ', '_'),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.session) {
        router.push('/dashboard');
        router.refresh();
        return;
      }

      setMessage(
        'Account created successfully. Check your email to verify your account.',
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Authentication failed. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function sendPasswordReset() {
    setMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Enter your email address first.');
      return;
    }

    setBusy(true);

    try {
      const supabase = createBrowserSupabase();

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      );

      if (error) throw error;

      setMessage('Password reset link sent to your email.');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to send password reset email.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="ark-auth-page">
      <div className="ark-auth-backdrop">
        <div className="ark-auth-grid" />
        <div className="ark-auth-glow ark-auth-glow-one" />
        <div className="ark-auth-glow ark-auth-glow-two" />
      </div>

      <section className="ark-auth-card">
        <Link href="/" className="ark-auth-close" aria-label="Close">
          <X size={21} />
        </Link>

        <div className="ark-auth-brand">
          <div>
            <span>A.R.K</span>
            <strong>CHRONICLES</strong>
          </div>

          <p>Architects of Rising Knowledge</p>
        </div>

        <div className="ark-auth-tabs">
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => switchMode('signup')}
          >
            Join ARK
          </button>

          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
        </div>

        <form className="ark-auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <label>
              <span>Full Name</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                minLength={2}
                required
              />
            </label>
          )}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Password</span>

            <div className="ark-password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                  mode === 'signup'
                    ? 'Minimum 6 characters'
                    : 'Enter your password'
                }
                autoComplete={
                  mode === 'signup' ? 'new-password' : 'current-password'
                }
                minLength={6}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>

          {mode === 'signup' && (
            <>
              <label>
                <span>College / Institution</span>
                <input
                  type="text"
                  value={college}
                  onChange={(event) => setCollege(event.target.value)}
                  placeholder="Start typing your college..."
                  autoComplete="organization"
                />
              </label>

              <label>
                <span>I Am A</span>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  {roles.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          {errorMessage && (
            <div className="ark-auth-alert error">{errorMessage}</div>
          )}

          {message && (
            <div className="ark-auth-alert success">{message}</div>
          )}

          {mode === 'login' && (
            <button
              type="button"
              className="ark-forgot-button"
              onClick={sendPasswordReset}
              disabled={busy}
            >
              Forgot password?
            </button>
          )}

          <button type="submit" className="ark-auth-submit" disabled={busy}>
            {busy ? (
              <>
                <Loader2 size={19} className="ark-spin" />
                Please wait
              </>
            ) : (
              <>
                {mode === 'signup' ? 'Join ARK' : 'Login'}
                <ArrowRight size={19} />
              </>
            )}
          </button>
        </form>

        <div className="ark-auth-security">
          <Lock size={16} />
          <span>Your information is protected by secure authentication.</span>
        </div>
      </section>

      <style jsx global>{`
        .ark-auth-page {
          min-height: 100dvh;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 42px 18px;
          background: #0c1530;
        }

        .ark-auth-backdrop,
        .ark-auth-grid,
        .ark-auth-glow {
          position: absolute;
        }

        .ark-auth-backdrop,
        .ark-auth-grid {
          inset: 0;
        }

        .ark-auth-backdrop {
          overflow: hidden;
        }

        .ark-auth-grid {
          opacity: 0.15;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.13) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.13) 1px,
              transparent 1px
            );
          background-size: 65px 65px;
          mask-image: radial-gradient(circle at center, black, transparent 76%);
        }

        .ark-auth-glow {
          border-radius: 50%;
          filter: blur(10px);
        }

        .ark-auth-glow-one {
          width: 430px;
          height: 430px;
          top: -140px;
          left: -100px;
          background: rgba(45, 72, 174, 0.38);
        }

        .ark-auth-glow-two {
          width: 360px;
          height: 360px;
          right: -100px;
          bottom: -100px;
          background: rgba(218, 176, 52, 0.18);
        }

        .ark-auth-card {
          width: min(470px, 100%);
          position: relative;
          z-index: 2;
          padding: 42px 44px 30px;
          border: 1px solid rgba(255, 255, 255, 0.34);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
          animation: arkAuthReveal 580ms both;
        }

        .ark-auth-close {
          width: 42px;
          height: 42px;
          position: absolute;
          top: 20px;
          right: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #f2f2f2;
          color: #111;
          transition: 180ms ease;
        }

        .ark-auth-close:hover {
          background: #111;
          color: white;
          transform: rotate(90deg);
        }

        .ark-auth-brand {
          padding-right: 45px;
          text-align: center;
        }

        .ark-auth-brand > div {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 9px;
        }

        .ark-auth-brand span {
          color: #d4a91f;
          font-size: 30px;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .ark-auth-brand strong {
          color: #111;
          font-size: 29px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .ark-auth-brand p {
          margin: 13px 0 0;
          color: #898989;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .ark-auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          margin: 34px 0 29px;
          padding: 4px;
          border-radius: 999px;
          background: #f1f1f1;
        }

        .ark-auth-tabs button {
          min-height: 51px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #666;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: 200ms ease;
        }

        .ark-auth-tabs button.active {
          background: #203679;
          color: white;
          box-shadow: 0 7px 20px rgba(32, 54, 121, 0.22);
        }

        .ark-auth-form {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .ark-auth-form label {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .ark-auth-form label > span {
          color: #4f4f4f;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .ark-auth-form input,
        .ark-auth-form select {
          width: 100%;
          min-height: 58px;
          padding: 0 17px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          outline: none;
          background: white;
          color: #111;
          font-size: 15px;
          transition: 180ms ease;
        }

        .ark-auth-form input:focus,
        .ark-auth-form select:focus {
          border-color: #203679;
          box-shadow: 0 0 0 4px rgba(32, 54, 121, 0.08);
        }

        .ark-password-field {
          position: relative;
        }

        .ark-password-field input {
          padding-right: 52px;
        }

        .ark-password-field button {
          width: 44px;
          height: 44px;
          position: absolute;
          top: 7px;
          right: 7px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #777;
          cursor: pointer;
        }

        .ark-auth-alert {
          padding: 12px 14px;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.5;
        }

        .ark-auth-alert.error {
          border: 1px solid #efc3c3;
          background: #fff1f1;
          color: #9d3030;
        }

        .ark-auth-alert.success {
          border: 1px solid #b9ddc3;
          background: #effaf2;
          color: #27713b;
        }

        .ark-forgot-button {
          align-self: flex-end;
          border: 0;
          background: transparent;
          color: #203679;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
        }

        .ark-auth-submit {
          min-height: 62px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 999px;
          background: #203679;
          color: white;
          font-size: 16px;
          font-weight: 950;
          cursor: pointer;
          transition: 180ms ease;
        }

        .ark-auth-submit:hover:not(:disabled) {
          box-shadow: 0 14px 30px rgba(32, 54, 121, 0.26);
          transform: translateY(-3px);
        }

        .ark-auth-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .ark-auth-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 22px;
          color: #8a8a8a;
          font-size: 9px;
          text-align: center;
        }

        .ark-spin {
          animation: arkSpin 800ms linear infinite;
        }

        @keyframes arkAuthReveal {
          from {
            opacity: 0;
            transform: translateY(26px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes arkSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .ark-auth-page {
            align-items: start;
            padding: 14px 10px;
          }

          .ark-auth-card {
            padding: 65px 22px 25px;
            border-radius: 27px;
          }

          .ark-auth-brand {
            padding-right: 0;
          }

          .ark-auth-brand span,
          .ark-auth-brand strong {
            font-size: 25px;
          }

          .ark-auth-brand p {
            font-size: 8px;
            letter-spacing: 0.2em;
          }

          .ark-auth-tabs {
            margin-top: 28px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ark-auth-card,
          .ark-spin {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
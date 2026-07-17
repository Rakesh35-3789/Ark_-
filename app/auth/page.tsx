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
      <div className="ark-auth-overlay" />

      <section className="ark-auth-modal">
        <Link href="/" className="ark-auth-close" aria-label="Close">
          <X size={22} />
        </Link>

        <div className="ark-auth-brand">
          <div className="ark-auth-brand-line">
            <span>A.R.K</span>
            <strong>CHRONICLES</strong>
          </div>

          <p>Architects of Rising Knowledge</p>
        </div>

        <div className="ark-auth-tabs" role="tablist" aria-label="Authentication">
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => switchMode('signup')}
          >
            Join Ark
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
                minLength={2}
                autoComplete="name"
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
                    ? 'Min 6 characters'
                    : 'Enter your password'
                }
                minLength={6}
                autoComplete={
                  mode === 'signup' ? 'new-password' : 'current-password'
                }
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
                {mode === 'signup' ? 'Join Ark' : 'Login'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="ark-auth-security">
          <Lock size={15} />
          <span>Secure authentication powered by ARK.</span>
        </div>
      </section>

      <style jsx global>{`
        .ark-auth-page {
          min-height: 100dvh;
          position: relative;
          display: grid;
          place-items: start center;
          overflow: hidden;
          padding: 56px 16px;
          background:
            linear-gradient(rgba(8, 11, 24, 0.72), rgba(8, 11, 24, 0.72)),
            radial-gradient(circle at top left, #253b82, transparent 40%),
            linear-gradient(180deg, #0e1731, #0a0f20);
        }

        .ark-auth-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.12) 1px,
              transparent 1px
            );
          background-size: 64px 64px;
          mask-image: radial-gradient(circle at center, black, transparent 78%);
        }

        .ark-auth-modal {
          width: min(500px, 100%);
          position: relative;
          z-index: 2;
          margin-top: 4px;
          padding: 48px 48px 28px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 32px;
          background: #ffffff;
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.38),
            0 -7px 0 #21377d;
          animation: arkModalReveal 520ms both;
        }

        .ark-auth-close {
          width: 44px;
          height: 44px;
          position: absolute;
          top: 20px;
          right: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #f4f4f4;
          color: #111;
          transition: 180ms ease;
        }

        .ark-auth-close:hover {
          background: #111;
          color: white;
          transform: rotate(90deg);
        }

        .ark-auth-brand {
          padding: 12px 40px 0;
          text-align: center;
        }

        .ark-auth-brand-line {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ark-auth-brand-line span {
          color: #d8a91b;
          font-size: 31px;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .ark-auth-brand-line strong {
          color: #0d0d0f;
          font-size: 30px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .ark-auth-brand p {
          margin: 13px 0 0;
          color: #8e8e8e;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .ark-auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          margin: 36px 0 30px;
          padding: 5px;
          border-radius: 999px;
          background: #f2f2f2;
        }

        .ark-auth-tabs button {
          min-height: 54px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #666;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          transition: 200ms ease;
        }

        .ark-auth-tabs button.active {
          background: #21377d;
          color: white;
          box-shadow: 0 10px 22px rgba(33, 55, 125, 0.22);
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
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ark-auth-form input,
        .ark-auth-form select {
          width: 100%;
          min-height: 60px;
          padding: 0 18px;
          border: 2px solid #e1e1e1;
          border-radius: 10px;
          outline: none;
          background: white;
          color: #111;
          font-size: 16px;
          font-weight: 600;
          transition: 180ms ease;
        }

        .ark-auth-form input::placeholder {
          color: #999;
          font-weight: 600;
        }

        .ark-auth-form input:focus,
        .ark-auth-form select:focus {
          border-color: #21377d;
          box-shadow: 0 0 0 4px rgba(33, 55, 125, 0.08);
        }

        .ark-password-field {
          position: relative;
        }

        .ark-password-field input {
          padding-right: 56px;
        }

        .ark-password-field button {
          width: 44px;
          height: 44px;
          position: absolute;
          top: 8px;
          right: 8px;
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
          color: #21377d;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .ark-auth-submit {
          min-height: 66px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 3px;
          border: 0;
          border-radius: 999px;
          background: #21377d;
          color: white;
          font-size: 17px;
          font-weight: 950;
          cursor: pointer;
          transition: 180ms ease;
        }

        .ark-auth-submit:hover:not(:disabled) {
          box-shadow: 0 16px 34px rgba(33, 55, 125, 0.28);
          transform: translateY(-3px);
        }

        .ark-auth-submit:disabled {
          opacity: 0.62;
          cursor: not-allowed;
        }

        .ark-auth-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 20px;
          color: #969696;
          font-size: 9px;
          text-align: center;
        }

        .ark-spin {
          animation: arkSpin 800ms linear infinite;
        }

        @keyframes arkModalReveal {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
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

        @media (max-width: 560px) {
          .ark-auth-page {
            align-items: start;
            padding: 20px 12px;
          }

          .ark-auth-modal {
            padding: 68px 24px 26px;
            border-radius: 28px;
          }

          .ark-auth-brand {
            padding: 0;
          }

          .ark-auth-brand-line span,
          .ark-auth-brand-line strong {
            font-size: 26px;
          }

          .ark-auth-brand p {
            font-size: 8px;
            letter-spacing: 0.2em;
          }

          .ark-auth-tabs {
            margin-top: 30px;
          }
        }

        @media (max-width: 390px) {
          .ark-auth-modal {
            padding-inline: 18px;
          }

          .ark-auth-brand-line span,
          .ark-auth-brand-line strong {
            font-size: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ark-auth-modal,
          .ark-spin {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
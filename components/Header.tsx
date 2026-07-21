'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  GraduationCap,
  Home,
  Info,
  LayoutDashboard,
  LibraryBig,
  Lock,
  LogIn,
  LogOut,
  Menu,
  Newspaper,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from './AuthProvider';

const navigation = [
  { label: 'Home', href: '/', description: 'Return to the ARK homepage', icon: Home },
  { label: 'Chronicles', href: '/explore', description: 'Discover approved stories', icon: Newspaper },
  { label: 'Founders', href: '/founders', description: 'Meet builders and startup leaders', icon: Users },
  { label: 'Magazines', href: '/magazines', description: 'Browse issues and archives', icon: LibraryBig },
  { label: 'Research', href: '/research', description: 'Explore papers and technical work', icon: BookOpen },
  { label: 'Investors', href: '/investors', description: 'Discover investors and supporters', icon: BriefcaseBusiness },
  { label: 'Opportunities', href: '/opportunities', description: 'Internships, events, grants and jobs', icon: Sparkles },
  { label: 'College Collabs', href: '/colleges', description: 'Explore institutions and collaborations', icon: GraduationCap },
  { label: 'Submit Story', href: '/submit', description: 'Publish your work for review', icon: Send },
  { label: 'About Us', href: '/about', description: 'Learn about ARK Chronicles', icon: Info },
  { label: 'Rewards', href: '/rewards', description: 'View achievements and recognition', icon: Trophy },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { user, profile, signOut, loading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await signOut();
      setOpen(false);
      window.location.assign('/');
    } finally {
      setSigningOut(false);
    }
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  const displayName =
    profile?.full_name ||
    profile?.username ||
    user?.email?.split('@')[0] ||
    'ARK Member';

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="ark-site-header">
        <div className="shell ark-header-inner">
          <Link href="/" className="ark-header-brand" aria-label="ARK home">
            <span className="ark-header-monogram">A.R.K</span>

            <span className="ark-header-brand-copy">
              <strong>CHRONICLES</strong>
              <small>Architects of Rising Knowledge</small>
            </span>
          </Link>
<nav className="ark-desktop-navigation" aria-label="Main navigation">
            <Link href="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>

            <Link href="/explore" className={isActive('/explore') ? 'active' : ''}>
              Chronicles
            </Link>

            <Link href="/founders" className={isActive('/founders') ? 'active' : ''}>
              Founders
            </Link>

            <Link
              href="/magazines"
              className={isActive('/magazines') ? 'active' : ''}
            >
              Magazines
            </Link>

            <Link href="/research" className={isActive('/research') ? 'active' : ''}>
              Research
            </Link>

            <Link
              href="/opportunities"
              className={isActive('/opportunities') ? 'active' : ''}
            >
              Opportunities
            </Link>

            <Link href="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </Link>

            <Link
              href="/submit?type=story"
              className={`ark-submit-link ${
                isActive('/submit') ? 'active' : ''
              }`}
            >
              Submit Story
            </Link>
          </nav>

          <div className="ark-header-actions">
            {!loading &&
              (user ? (
                <>
                  {profile?.role === 'admin' && (
                    <Link href="/admin" className="ark-admin-link">
                      <ShieldCheck size={17} />
                      <span>Admin</span>
                    </Link>
                  )}

                  <Link href="/dashboard" className="ark-user-button">
                    <span className="ark-user-avatar">{initial}</span>

                    <span className="ark-user-copy">
                      <small>Welcome</small>
                      <strong>{displayName}</strong>
                    </span>
                  </Link>
                </>
              ) : (
                <Link href="/auth" className="ark-join-button">
                  Join ARK
                  <ChevronRight size={16} />
                </Link>
              ))}

            <button
              type="button"
              className={`ark-menu-button ${open ? 'open' : ''}`}
              onClick={() => setOpen((current) => !current)}
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`ark-drawer-overlay ${open ? 'visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`ark-mobile-drawer ${open ? 'open' : ''}`}
        aria-hidden={!open}
      >
        <div className="ark-drawer-top">
          <Link href="/" className="ark-drawer-brand" onClick={() => setOpen(false)}>
            <strong>A.R.K</strong>
            <span>CHRONICLES</span>
          </Link>

          <button
            type="button"
            className="ark-drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={23} />
          </button>
        </div>

        {!loading && user && (
          <div className="ark-drawer-profile">
            <span className="ark-drawer-avatar">{initial}</span>

            <div>
              <small>Signed in as</small>
              <strong>{displayName}</strong>
              <span>{user.email}</span>
            </div>
          </div>
        )}

        <nav className="ark-drawer-navigation" aria-label="Mobile navigation">
          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? 'active' : ''}
                onClick={() => setOpen(false)}
                style={{ '--drawer-index': index } as React.CSSProperties}
              >
                <span className="ark-drawer-link-icon">
                  <Icon size={20} />
                </span>

                <span className="ark-drawer-link-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>

                <ChevronRight size={18} />
              </Link>
            );
          })}

          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className={isActive('/admin') ? 'active' : ''}
              onClick={() => setOpen(false)}
              style={
                {
                  '--drawer-index': navigation.length,
                } as React.CSSProperties
              }
            >
              <span className="ark-drawer-link-icon">
                <Lock size={20} />
              </span>

              <span className="ark-drawer-link-copy">
                <strong>Admin</strong>
                <small>Moderation and management</small>
              </span>

              <ChevronRight size={18} />
            </Link>
          )}
        </nav>

        {!loading && (
          <div className="ark-drawer-account">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="ark-drawer-account-link"
                >
                  <LayoutDashboard size={19} />
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="ark-drawer-account-link"
                >
                  <UserRound size={19} />
                  Profile
                </Link>

                <button
                  type="button"
                  className="ark-drawer-signout"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  <LogOut size={19} />
                  {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="ark-drawer-join"
              >
                <LogIn size={19} />
                Join or sign in to ARK
                <ChevronRight size={17} />
              </Link>
            )}
          </div>
        )}

        <div className="ark-drawer-footer">
          <Rocket size={17} />
          <span>Discover. Publish. Connect.</span>
        </div>
      </aside>

      <style jsx global>{`
        .ark-site-header {
          position: sticky;
          top: 0;
          z-index: 500;
          border-bottom: 1px solid rgba(8, 8, 8, 0.12);
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(18px);
        }

        .ark-header-inner {
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
        }

        .ark-header-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        .ark-header-monogram {
          padding-right: 14px;
          border-right: 1px solid #c6c6c6;
          color: #080808;
          font-size: 27px;
          font-weight: 950;
          letter-spacing: -0.07em;
        }

        .ark-header-brand-copy {
          display: flex;
          flex-direction: column;
        }

        .ark-header-brand-copy strong {
          color: #283f91;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 15px;
          letter-spacing: 0.12em;
        }

        .ark-header-brand-copy small {
          margin-top: 3px;
          color: #777;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ark-desktop-navigation {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .ark-desktop-navigation a {
          position: relative;
          padding: 29px 0;
          color: #242424;
          font-size: 12px;
          font-weight: 800;
        }

        .ark-desktop-navigation .ark-submit-link {
          padding: 11px 16px;
          border: 1px solid #283f91;
          border-radius: 8px;
          background: #283f91;
          color: white;
          transition: background 180ms ease, transform 180ms ease;
        }

        .ark-desktop-navigation .ark-submit-link::after {
          display: none;
        }

        .ark-desktop-navigation .ark-submit-link:hover,
        .ark-desktop-navigation .ark-submit-link.active {
          background: #17295f;
          color: white;
          transform: translateY(-2px);
        }

        .ark-desktop-navigation a::after {
          width: 0;
          height: 2px;
          position: absolute;
          right: 0;
          bottom: 19px;
          left: 0;
          content: '';
          background: #283f91;
          transition: width 180ms ease;
        }

        .ark-desktop-navigation a:hover,
        .ark-desktop-navigation a.active {
          color: #283f91;
        }

        .ark-desktop-navigation a:hover::after,
        .ark-desktop-navigation a.active::after {
          width: 100%;
        }

        .ark-header-actions {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
        }

        .ark-admin-link,
        .ark-join-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 15px;
          font-size: 11px;
          font-weight: 850;
        }

        .ark-admin-link {
          border: 1px solid rgba(40, 63, 145, 0.2);
          color: #283f91;
        }

        .ark-join-button {
          background: #080808;
          color: white;
        }

        .ark-user-button {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 6px 10px 6px 6px;
          border: 1px solid #d6d6d6;
          background: #fafafa;
        }

        .ark-user-avatar,
        .ark-drawer-avatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #283f91;
          color: white;
          font-weight: 900;
        }

        .ark-user-avatar {
          width: 34px;
          height: 34px;
          font-size: 12px;
        }

        .ark-user-copy {
          display: flex;
          flex-direction: column;
          max-width: 105px;
        }

        .ark-user-copy small {
          color: #888;
          font-size: 8px;
          text-transform: uppercase;
        }

        .ark-user-copy strong {
          overflow: hidden;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ark-menu-button {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border: 1px solid #d1d1d1;
          background: white;
          cursor: pointer;
          transition: 180ms ease;
        }

        .ark-menu-button:hover,
        .ark-menu-button.open {
          background: #080808;
          color: white;
        }

        .ark-drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 599;
          background: rgba(4, 5, 7, 0.58);
          opacity: 0;
          visibility: hidden;
          backdrop-filter: blur(5px);
          transition: 300ms ease;
        }

        .ark-drawer-overlay.visible {
          opacity: 1;
          visibility: visible;
        }

        .ark-mobile-drawer {
          width: min(430px, 92vw);
          height: 100dvh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 600;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          background: #1f367a;
          color: white;
          box-shadow: 25px 0 65px rgba(0, 0, 0, 0.28);
          transform: translateX(-105%);
          transition: transform 420ms cubic-bezier(0.76, 0, 0.24, 1);
        }

        .ark-mobile-drawer.open {
          transform: translateX(0);
        }

        .ark-drawer-top {
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
          background: #17295f;
        }

        .ark-drawer-brand {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .ark-drawer-brand strong {
          color: #e0b331;
          font-size: 25px;
          letter-spacing: -0.07em;
        }

        .ark-drawer-brand span {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.09em;
        }

        .ark-drawer-close {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: transparent;
          color: white;
          cursor: pointer;
        }

        .ark-drawer-profile {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 14px;
          margin: 18px 18px 4px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.08);
        }

        .ark-drawer-avatar {
          width: 45px;
          height: 45px;
        }

        .ark-drawer-profile div {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .ark-drawer-profile small,
        .ark-drawer-profile span {
          color: rgba(255, 255, 255, 0.68);
          font-size: 9px;
        }

        .ark-drawer-profile strong {
          margin: 3px 0;
          font-size: 14px;
        }

        .ark-drawer-navigation {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }

        .ark-drawer-navigation > a {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 72px;
          padding: 10px 20px;
          border-left: 4px solid transparent;
          color: white;
          opacity: 0;
          transform: translateX(-24px);
        }

        .ark-mobile-drawer.open .ark-drawer-navigation > a {
          animation: arkDrawerReveal 400ms both;
          animation-delay: calc(var(--drawer-index) * 35ms + 80ms);
        }

        .ark-drawer-navigation > a:hover,
        .ark-drawer-navigation > a.active {
          border-left-color: #e0b331;
          background: rgba(255, 255, 255, 0.1);
        }

        .ark-drawer-link-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          color: #f0c646;
        }

        .ark-drawer-link-copy {
          display: flex;
          flex-direction: column;
        }

        .ark-drawer-link-copy strong {
          font-size: 16px;
          font-weight: 800;
        }

        .ark-drawer-link-copy small {
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 10px;
        }

        .ark-drawer-account {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
          padding: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .ark-drawer-account-link,
        .ark-drawer-signout,
        .ark-drawer-join {
          min-height: 47px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          color: white;
          font-size: 11px;
          font-weight: 800;
        }

        .ark-drawer-signout {
          color: #ffd5d5;
          cursor: pointer;
        }

        .ark-drawer-signout:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ark-drawer-join {
          border-color: #e0b331;
          background: #e0b331;
          color: #111;
        }

        .ark-drawer-join svg:last-child {
          margin-left: auto;
        }

        .ark-drawer-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 17px 20px;
          background: #111f49;
          color: rgba(255, 255, 255, 0.64);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        @keyframes arkDrawerReveal {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
@media (max-width: 1080px) {
          .ark-desktop-navigation {
            gap: 16px;
          }

          .ark-user-copy {
            display: none;
          }
        }

        @media (max-width: 1180px) {
          .ark-desktop-navigation {
            display: none;
          }

          .ark-user-copy {
            display: none;
          }
        }

        @media (max-width: 850px) {
          .ark-desktop-navigation,
          .ark-admin-link,
          .ark-user-button,
          .ark-join-button {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .ark-header-inner {
            min-height: 70px;
            gap: 10px;
          }

          .ark-header-brand {
            gap: 9px;
          }

          .ark-header-monogram {
            padding-right: 10px;
          }

          .ark-header-brand-copy strong {
            font-size: 13px;
          }

          .ark-header-actions {
            gap: 7px;
          }

          .ark-menu-button {
            width: 40px;
            height: 40px;
          }

          .ark-header-brand-copy small {
            display: none;
          }

          .ark-header-monogram {
            font-size: 23px;
          }

          .ark-mobile-drawer {
            width: 86%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ark-mobile-drawer,
          .ark-drawer-overlay,
          .ark-drawer-navigation > a {
            transition: none !important;
            animation: none !important;
          }

          .ark-mobile-drawer.open .ark-drawer-navigation > a {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
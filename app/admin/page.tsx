/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Link from 'next/link';
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAuth } from '@/components/AuthProvider';

type AdminTab =
  | 'dashboard'
  | 'submissions'
  | 'users'
  | 'investors';

type Status = 'pending' | 'approved' | 'rejected';

type Submission = {
  type: 'story' | 'research' | 'founder' | 'opportunity';
  id: string;
  title: string;
  summary: string;
  label: string;
  created_at: string;
  submitted_by: string | null;
};

type UserProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  role: 'user' | 'admin' | 'editor';
  city: string | null;
  verified?: boolean;
  created_at: string;
};

type Investor = {
  id: string;
  name: string;
  firm: string;
  role_title: string | null;
  city: string | null;
  bio: string | null;
  website: string | null;
  status: Status;
  created_at: string;
};

type InvestorForm = {
  name: string;
  firm: string;
  role_title: string;
  city: string;
  bio: string;
  website: string;
  status: Status;
};

const emptyInvestorForm: InvestorForm = {
  name: '',
  firm: '',
  role_title: '',
  city: '',
  bio: '',
  website: '',
  status: 'approved',
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function AdminPage() {
  const { session, profile, loading } = useAuth();

  const [activeTab, setActiveTab] =
    useState<AdminTab>('dashboard');

  const [submissions, setSubmissions] =
    useState<Submission[]>([]);

  const [users, setUsers] =
    useState<UserProfile[]>([]);

  const [investors, setInvestors] =
    useState<Investor[]>([]);

  const [investorForm, setInvestorForm] =
    useState<InvestorForm>(emptyInvestorForm);

  const [editingInvestorId, setEditingInvestorId] =
    useState<string | null>(null);

  const [message, setMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [busy, setBusy] = useState(false);
const [initialLoading, setInitialLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);

const loadingDataRef = useRef(false);
const loadedTokenRef = useRef<string | null>(null);

const token = session?.access_token ?? null;

  const statistics = useMemo(() => {
    const pendingInvestors = investors.filter(
      (investor) => investor.status === 'pending',
    ).length;

    const approvedInvestors = investors.filter(
      (investor) => investor.status === 'approved',
    ).length;

    const rejectedInvestors = investors.filter(
      (investor) => investor.status === 'rejected',
    ).length;

    const admins = users.filter(
      (user) => user.role === 'admin',
    ).length;

    const verifiedUsers = users.filter(
      (user) => user.verified,
    ).length;

    return {
      totalUsers: users.length,
      admins,
      verifiedUsers,
      pendingSubmissions: submissions.length,
      totalInvestors: investors.length,
      pendingInvestors,
      approvedInvestors,
      rejectedInvestors,
    };
  }, [users, submissions, investors]);

  async function apiRequest(
    url: string,
    options: RequestInit = {},
  ) {
    if (!token) {
      throw new Error(
        'Your login session has expired. Please sign in again.',
      );
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...(options.headers ?? {}),
      },
    });

    let result: Record<string, unknown> = {};

    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      throw new Error(
        typeof result.error === 'string'
          ? result.error
          : 'The request could not be completed.',
      );
    }

    return result;
  }

  function clearMessages() {
    setMessage('');
    setErrorMessage('');
  }
  function normaliseSubmission(value: unknown): Submission | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as Record<string, unknown>;

  const type = String(item.type ?? '');

  if (
    type !== 'story' &&
    type !== 'research' &&
    type !== 'founder' &&
    type !== 'opportunity'
  ) {
    return null;
  }

  const id = String(item.id ?? '');

  if (!id) {
    return null;
  }

  return {
    type,
    id,
    title: String(item.title ?? 'Untitled submission'),
    summary: String(
      item.summary ??
        item.excerpt ??
        item.abstract ??
        item.description ??
        '',
    ),
    label: String(
      item.label ??
        item.category ??
        item.field ??
        item.organization ??
        type,
    ),
    created_at: String(
      item.created_at ??
        item.createdAt ??
        new Date().toISOString(),
    ),
    submitted_by:
      typeof item.submitted_by === 'string'
        ? item.submitted_by
        : typeof item.ownerName === 'string'
          ? item.ownerName
          : null,
  };
}

  const loadAllData = useCallback(
  async (showRefreshState = false) => {
    if (!token || profile?.role !== 'admin') {
      setInitialLoading(false);
      return;
    }

    if (loadingDataRef.current) {
      return;
    }

    loadingDataRef.current = true;

    if (showRefreshState) {
      setRefreshing(true);
    }

    clearMessages();

    try {
      const results = await Promise.allSettled([
        apiRequest('/api/admin/moderation'),
        apiRequest('/api/admin/users'),
        apiRequest('/api/admin/investors'),
      ]);

      const [
        moderationResult,
        usersResult,
        investorsResult,
      ] = results;

      const errors: string[] = [];

      if (moderationResult.status === 'fulfilled') {
        const response = moderationResult.value;

        const rawItems = Array.isArray(response.items)
          ? response.items
          : Array.isArray(response.submissions)
            ? response.submissions
            : [];

        const normalisedSubmissions = rawItems
          .map(normaliseSubmission)
          .filter(
            (item): item is Submission =>
              item !== null,
          );

        setSubmissions(normalisedSubmissions);
      } else {
        setSubmissions([]);

        errors.push(
          moderationResult.reason instanceof Error
            ? `Submissions: ${moderationResult.reason.message}`
            : 'Submissions could not be loaded.',
        );
      }

      if (usersResult.status === 'fulfilled') {
        const response = usersResult.value;

        setUsers(
          Array.isArray(response.users)
            ? (response.users as UserProfile[])
            : [],
        );
      } else {
        setUsers([]);

        errors.push(
          usersResult.reason instanceof Error
            ? `Users: ${usersResult.reason.message}`
            : 'Users could not be loaded.',
        );
      }

      if (investorsResult.status === 'fulfilled') {
        const response = investorsResult.value;

        setInvestors(
          Array.isArray(response.investors)
            ? (response.investors as Investor[])
            : [],
        );
      } else {
        setInvestors([]);

        errors.push(
          investorsResult.reason instanceof Error
            ? `Investors: ${investorsResult.reason.message}`
            : 'Investors could not be loaded.',
        );
      }

      if (errors.length > 0) {
        setErrorMessage(errors.join(' '));
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not load admin information.',
      );
    } finally {
      loadingDataRef.current = false;
      setInitialLoading(false);
      setRefreshing(false);
    }
  },
  [token, profile?.role],
);
    useEffect(() => {
  if (loading) {
    return;
  }

  if (!token || profile?.role !== 'admin') {
    setInitialLoading(false);
    return;
  }

  if (loadedTokenRef.current === token) {
    return;
  }

  loadedTokenRef.current = token;

  void loadAllData();
}, [
  loading,
  token,
  profile?.role,
  loadAllData,
]);
    

  async function decideSubmission(
    item: Submission,
    status: 'approved' | 'rejected',
  ) {
    clearMessages();
    setBusy(true);

    try {
      await apiRequest(
        `/api/admin/moderation/${item.type}/${item.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
      );

      setMessage(
        `"${item.title}" was ${status} successfully.`,
      );

      await loadAllData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not update this submission.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveInvestor(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    clearMessages();

    if (!investorForm.name.trim()) {
      setErrorMessage('Investor name is required.');
      return;
    }

    if (!investorForm.firm.trim()) {
      setErrorMessage(
        'Investor firm or organisation is required.',
      );
      return;
    }

    setBusy(true);

    try {
      if (editingInvestorId) {
        await apiRequest(
          `/api/admin/investors/${editingInvestorId}`,
          {
            method: 'PATCH',
            body: JSON.stringify(investorForm),
          },
        );

        setMessage('Investor updated successfully.');
      } else {
        await apiRequest('/api/admin/investors', {
          method: 'POST',
          body: JSON.stringify(investorForm),
        });

        setMessage('Investor added successfully.');
      }

      setInvestorForm(emptyInvestorForm);
      setEditingInvestorId(null);

      await loadAllData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not save the investor.',
      );
    } finally {
      setBusy(false);
    }
  }

  function startEditingInvestor(investor: Investor) {
    clearMessages();

    setEditingInvestorId(investor.id);

    setInvestorForm({
      name: investor.name ?? '',
      firm: investor.firm ?? '',
      role_title: investor.role_title ?? '',
      city: investor.city ?? '',
      bio: investor.bio ?? '',
      website: investor.website ?? '',
      status: investor.status,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function cancelInvestorEditing() {
    setEditingInvestorId(null);
    setInvestorForm(emptyInvestorForm);
    clearMessages();
  }

  async function changeInvestorStatus(
    investor: Investor,
    status: Status,
  ) {
    clearMessages();
    setBusy(true);

    try {
      await apiRequest(
        `/api/admin/investors/${investor.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
      );

      setMessage(
        `${investor.name} was marked as ${status}.`,
      );

      await loadAllData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not change investor status.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteInvestor(investor: Investor) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${investor.name}?`,
    );

    if (!confirmed) {
      return;
    }

    clearMessages();
    setBusy(true);

    try {
      await apiRequest(
        `/api/admin/investors/${investor.id}`,
        {
          method: 'DELETE',
        },
      );

      setMessage('Investor deleted successfully.');

      if (editingInvestorId === investor.id) {
        cancelInvestorEditing();
      }

      await loadAllData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not delete the investor.',
      );
    } finally {
      setBusy(false);
    }
  }

  
   if (loading || (session && !profile)) {
  return (
    <main className="admin-access-page">
      <div className="admin-access-card">
        <h1>Checking administrator access...</h1>
      </div>

      <AdminStyles />
    </main>
  );
}

if (!session) {
  return (
    <main className="admin-access-page">
      <div className="admin-access-card">
        <h1>Please sign in</h1>

        <Link href="/auth" className="admin-primary-button">
          Admin Sign In
        </Link>
      </div>

      <AdminStyles />
    </main>
  );
}

if (profile?.role !== "admin") {
  return (
    <main className="admin-access-page">
      <div className="admin-access-card">
        <h1>Admin access only</h1>

        <Link href="/" className="admin-primary-button">
          Return Home
        </Link>
      </div>

      <AdminStyles />
    </main>
  );

  }

  return (
    <main className="ark-admin-layout">
      <aside className="ark-admin-sidebar">
        <div>
          <Link href="/" className="ark-admin-logo">
            <span>A.R.K</span>
            <strong>ADMIN</strong>
          </Link>

          <p>Chronicles Management Centre</p>
        </div>

        <nav className="ark-admin-navigation">
          <button
            type="button"
            className={
              activeTab === 'dashboard' ? 'active' : ''
            }
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>

          <button
            type="button"
            className={
              activeTab === 'submissions' ? 'active' : ''
            }
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
            <span>{submissions.length}</span>
          </button>

          <button
            type="button"
            className={
              activeTab === 'users' ? 'active' : ''
            }
            onClick={() => setActiveTab('users')}
          >
            Users
            <span>{users.length}</span>
          </button>

          <button
            type="button"
            className={
              activeTab === 'investors' ? 'active' : ''
            }
            onClick={() => setActiveTab('investors')}
          >
            Investors
            <span>{investors.length}</span>
          </button>
        </nav>

        <div className="ark-admin-bottom-links">
          <Link href="/">Open Regular Website</Link>
          <Link href="/dashboard">
            My User Dashboard
          </Link>
          <Link href="/submit">Create Submission</Link>
        </div>
      </aside>

      <section className="ark-admin-content">
        {initialLoading && (
  <div className="admin-page-loading">
    <div className="admin-loading-spinner" />

    <div>
      <strong>Loading administration data…</strong>
      <span>
        Preparing submissions, members and investors.
      </span>
    </div>
  </div>
)}
        <header className="ark-admin-header">
          <div>
            <p>ARK Administration</p>

            <h1>
              Welcome, {profile.full_name || 'Admin'}
            </h1>
          </div>

          <button
  type="button"
  className="admin-refresh-button"
  onClick={() => void loadAllData(true)}
  disabled={refreshing || initialLoading}
>
  {refreshing ? 'Refreshing...' : 'Refresh Data'}
</button>
        </header>

        {message && (
          <div className="ark-admin-message success">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="ark-admin-message error">
            {errorMessage}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <section>
            <div className="ark-admin-title-row">
              <div>
                <span className="admin-eyebrow">
                  Platform overview
                </span>
                <h2>Admin Dashboard</h2>
              </div>
            </div>

            <div className="ark-admin-stat-grid">
              <article>
                <span>Registered Users</span>
                <strong>{statistics.totalUsers}</strong>
              </article>

              <article>
                <span>Pending Submissions</span>
                <strong>
                  {statistics.pendingSubmissions}
                </strong>
              </article>

              <article>
                <span>Total Investors</span>
                <strong>
                  {statistics.totalInvestors}
                </strong>
              </article>

              <article>
                <span>Approved Investors</span>
                <strong>
                  {statistics.approvedInvestors}
                </strong>
              </article>

              <article>
                <span>Pending Investors</span>
                <strong>
                  {statistics.pendingInvestors}
                </strong>
              </article>

              <article>
                <span>Rejected Investors</span>
                <strong>
                  {statistics.rejectedInvestors}
                </strong>
              </article>

              <article>
                <span>Verified Users</span>
                <strong>
                  {statistics.verifiedUsers}
                </strong>
              </article>

              <article>
                <span>Admin Accounts</span>
                <strong>{statistics.admins}</strong>
              </article>
            </div>

            <div className="admin-dashboard-columns">
              <article className="admin-summary-card">
                <h3>Pending moderation</h3>

                <p>
                  Stories, research papers, founder profiles
                  and opportunities waiting for review.
                </p>

                <strong>{submissions.length}</strong>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('submissions')
                  }
                >
                  Review submissions
                </button>
              </article>

              <article className="admin-summary-card">
                <h3>Investor directory</h3>

                <p>
                  Add, edit, approve, reject or remove
                  investor profiles.
                </p>

                <strong>{investors.length}</strong>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('investors')
                  }
                >
                  Manage investors
                </button>
              </article>

              <article className="admin-summary-card">
                <h3>ARK members</h3>

                <p>
                  View registered users, their roles,
                  verification and joining dates.
                </p>

                <strong>{users.length}</strong>

                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                >
                  View users
                </button>
              </article>
            </div>
          </section>
        )}

        {activeTab === 'submissions' && (
          <section>
            <div className="ark-admin-title-row">
              <div>
                <span className="admin-eyebrow">
                  Editorial review
                </span>
                <h2>Pending Submissions</h2>
              </div>

              <span>{submissions.length} pending</span>
            </div>

            <div className="ark-admin-list">
              {submissions.map((item) => (
                <article
                  className="ark-admin-card"
                  key={`${item.type}-${item.id}`}
                >
                  <div className="ark-admin-card-content">
                    <div className="ark-admin-tags">
                      <span>{item.type}</span>
                      <span>{item.label}</span>
                    </div>

                    <h3>{item.title}</h3>

                    <p>
                      {item.summary ||
                        'No description was provided.'}
                    </p>

                    <small>
                      Submitted by{' '}
                      {item.submitted_by || 'ARK user'}
                      {' · '}
                      {formatDate(item.created_at)}
                    </small>
                  </div>

                  <div className="ark-admin-actions">
                    <button
                      type="button"
                      className="approve-button"
                      disabled={busy}
                      onClick={() =>
                        void decideSubmission(
                          item,
                          'approved',
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="reject-button"
                      disabled={busy}
                      onClick={() =>
                        void decideSubmission(
                          item,
                          'rejected',
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}

              {!submissions.length && (
                <div className="ark-admin-empty">
                  <h3>No pending submissions</h3>
                  <p>
                    New submissions will appear here for
                    approval.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'users' && (
          <section>
            <div className="ark-admin-title-row">
              <div>
                <span className="admin-eyebrow">
                  Member directory
                </span>
                <h2>Registered Users</h2>
              </div>

              <span>{users.length} users</span>
            </div>

            <div className="ark-admin-table-wrapper">
              <table className="ark-admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>City</th>
                    <th>Verified</th>
                    <th>Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>
                          {user.full_name ||
                            user.username ||
                            'Unnamed user'}
                        </strong>

                        {user.username && (
                          <small>@{user.username}</small>
                        )}
                      </td>

                      <td>
                        <span
                          className={`user-role ${user.role}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        {user.city || 'Not provided'}
                      </td>

                      <td>
                        {user.verified ? 'Yes' : 'No'}
                      </td>

                      <td>
                        {new Date(
                          user.created_at,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!users.length && (
                <div className="ark-admin-empty">
                  No registered users were found.
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'investors' && (
          <section>
            <div className="ark-admin-title-row">
              <div>
                <span className="admin-eyebrow">
                  Investor directory
                </span>
                <h2>Manage Investors</h2>
              </div>

              <span>{investors.length} investors</span>
            </div>

            <form
              className="ark-investor-form"
              onSubmit={saveInvestor}
            >
              <h3>
                {editingInvestorId
                  ? 'Update Investor'
                  : 'Add New Investor'}
              </h3>

              <div className="ark-investor-form-grid">
                <label>
                  <span>Investor Name *</span>

                  <input
                    value={investorForm.name}
                    onChange={(event) =>
                      setInvestorForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Investor full name"
                    required
                  />
                </label>

                <label>
                  <span>Firm / Organisation *</span>

                  <input
                    value={investorForm.firm}
                    onChange={(event) =>
                      setInvestorForm((current) => ({
                        ...current,
                        firm: event.target.value,
                      }))
                    }
                    placeholder="Company or investment firm"
                    required
                  />
                </label>

                <label>
                  <span>Role / Title</span>

                  <input
                    value={investorForm.role_title}
                    onChange={(event) =>
                      setInvestorForm((current) => ({
                        ...current,
                        role_title: event.target.value,
                      }))
                    }
                    placeholder="Partner, Angel Investor..."
                  />
                </label>

                <label>
                  <span>City</span>

                  <input
                    value={investorForm.city}
                    onChange={(event) =>
                      setInvestorForm((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    placeholder="Hyderabad"
                  />
                </label>

                <label>
                  <span>Website</span>

                  <input
                    type="url"
                    value={investorForm.website}
                    onChange={(event) =>
                      setInvestorForm((current) => ({
                        ...current,
                        website: event.target.value,
                      }))
                    }
                    placeholder="https://example.com"
                  />
                </label>

                <label>
                  <span>Status</span>

                  <select
                    value={investorForm.status}
                    onChange={(event) =>
                      setInvestorForm((current) => ({
                        ...current,
                        status: event.target
                          .value as Status,
                      }))
                    }
                  >
                    <option value="approved">
                      Approved
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>
                  </select>
                </label>

                <label className="full-width">
                  <span>Investor Biography</span>

                  <textarea
                    rows={6}
                    value={investorForm.bio}
                    onChange={(event) =>
                      setInvestorForm((current) => ({
                        ...current,
                        bio: event.target.value,
                      }))
                    }
                    placeholder="Write about the investor, experience and investment interests."
                  />
                </label>
              </div>

              <div className="ark-form-buttons">
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={busy}
                >
                  {busy
                    ? 'Saving...'
                    : editingInvestorId
                      ? 'Update Investor'
                      : 'Add Investor'}
                </button>

                {editingInvestorId && (
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={cancelInvestorEditing}
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
            </form>

            <div className="ark-admin-list investor-list">
              {investors.map((investor) => (
                <article
                  className="ark-admin-card"
                  key={investor.id}
                >
                  <div className="ark-admin-card-content">
                    <div className="ark-admin-tags">
                      <span className={investor.status}>
                        {investor.status}
                      </span>

                      {investor.city && (
                        <span>{investor.city}</span>
                      )}
                    </div>

                    <h3>{investor.name}</h3>

                    <strong className="investor-position">
                      {investor.role_title
                        ? `${investor.role_title} at ${investor.firm}`
                        : investor.firm}
                    </strong>

                    <p>
                      {investor.bio ||
                        'No biography provided.'}
                    </p>

                    {investor.website && (
                      <a
                        href={investor.website}
                        target="_blank"
                        rel="noreferrer"
                        className="investor-website"
                      >
                        Open Website
                      </a>
                    )}

                    <small>
                      Added{' '}
                      {formatDate(investor.created_at)}
                    </small>
                  </div>

                  <div className="ark-admin-actions">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        startEditingInvestor(investor)
                      }
                    >
                      Edit
                    </button>

                    {investor.status !== 'approved' && (
                      <button
                        type="button"
                        className="approve-button"
                        disabled={busy}
                        onClick={() =>
                          void changeInvestorStatus(
                            investor,
                            'approved',
                          )
                        }
                      >
                        Approve
                      </button>
                    )}

                    {investor.status !== 'pending' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void changeInvestorStatus(
                            investor,
                            'pending',
                          )
                        }
                      >
                        Pending
                      </button>
                    )}

                    {investor.status !== 'rejected' && (
                      <button
                        type="button"
                        className="reject-button"
                        disabled={busy}
                        onClick={() =>
                          void changeInvestorStatus(
                            investor,
                            'rejected',
                          )
                        }
                      >
                        Reject
                      </button>
                    )}

                    <button
                      type="button"
                      className="delete-button"
                      disabled={busy}
                      onClick={() =>
                        void deleteInvestor(investor)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}

              {!investors.length && (
                <div className="ark-admin-empty">
                  <h3>No investors added</h3>
                  <p>
                    Use the form above to add the first
                    investor.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </section>

      <AdminStyles />
    </main>
  );
}

function AdminStyles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      .admin-access-page {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 30px;
        background:
          radial-gradient(
            circle at top right,
            rgba(48, 68, 143, 0.2),
            transparent 35%
          ),
          #f5f3ec;
      }

      .admin-access-card {
        width: min(520px, 100%);
        padding: 42px;
        border: 1px solid rgba(20, 31, 27, 0.12);
        border-radius: 24px;
        background: white;
        box-shadow: 0 25px 80px rgba(20, 35, 29, 0.1);
        text-align: center;
      }

      .admin-access-card h1 {
        margin: 12px 0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 42px;
      }

      .admin-access-card p {
        margin: 0 0 25px;
        color: #68716c;
        line-height: 1.7;
      }

      .admin-home-link {
        display: block;
        margin-top: 18px;
        color: #53615a;
        font-size: 13px;
        font-weight: 800;
      }

      .admin-eyebrow {
        color: #33447f;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .ark-admin-layout {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 270px minmax(0, 1fr);
        background: #f4f3ee;
        color: #17201c;
      }

      .ark-admin-sidebar {
        position: sticky;
        top: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 30px 22px;
        background: #13241c;
        color: white;
      }

      .ark-admin-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        color: white;
        text-decoration: none;
      }

      .ark-admin-logo span {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 25px;
        font-weight: 900;
      }

      .ark-admin-logo strong {
        padding: 5px 8px;
        border-radius: 5px;
        background: #d8b75f;
        color: #13241c;
        font-size: 9px;
        letter-spacing: 0.12em;
      }

      .ark-admin-sidebar > div > p {
        margin: 12px 0 0;
        color: rgba(255, 255, 255, 0.55);
        font-size: 11px;
      }

      .ark-admin-navigation {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 40px 0 auto;
      }

      .ark-admin-navigation button {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 14px 15px;
        border: 0;
        border-radius: 10px;
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 800;
        text-align: left;
        cursor: pointer;
      }

      .ark-admin-navigation button:hover,
      .ark-admin-navigation button.active {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .ark-admin-navigation button.active {
        box-shadow: inset 3px 0 #d8b75f;
      }

      .ark-admin-navigation button span {
        min-width: 25px;
        padding: 2px 7px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.12);
        font-size: 10px;
        text-align: center;
      }

      .ark-admin-bottom-links {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .ark-admin-bottom-links a {
        color: rgba(255, 255, 255, 0.65);
        font-size: 12px;
        font-weight: 700;
        text-decoration: none;
      }

      .ark-admin-bottom-links a:hover {
        color: white;
      }

      .ark-admin-content {
        min-width: 0;
        padding: 38px;
      }

      .ark-admin-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
        margin-bottom: 30px;
      }

      .ark-admin-header p {
        margin: 0 0 5px;
        color: #717b75;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .ark-admin-header h1 {
        margin: 0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: clamp(30px, 4vw, 46px);
      }

      .admin-refresh-button,
      .admin-primary-button,
      .admin-secondary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 43px;
        padding: 11px 18px;
        border: 1px solid #263b31;
        border-radius: 9px;
        font-weight: 900;
        cursor: pointer;
        text-decoration: none;
      }

      .admin-primary-button,
      .admin-refresh-button {
        background: #263b31;
        color: white;
      }

      .admin-secondary-button {
        background: white;
        color: #263b31;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .ark-admin-message {
        margin-bottom: 22px;
        padding: 15px 18px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 800;
      }

      .ark-admin-message.success {
        border: 1px solid #b7ddc8;
        background: #e1f4e9;
        color: #1d6a42;
      }

      .ark-admin-message.error {
        border: 1px solid #e7b9b9;
        background: #f9e6e6;
        color: #8d2929;
      }

      .ark-admin-title-row {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 22px;
      }

      .ark-admin-title-row h2 {
        margin: 6px 0 0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 32px;
      }

      .ark-admin-title-row > span {
        padding: 7px 12px;
        border-radius: 20px;
        background: white;
        color: #657169;
        font-size: 11px;
        font-weight: 800;
      }

      .ark-admin-stat-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .ark-admin-stat-grid article {
        min-height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 22px;
        border: 1px solid rgba(22, 39, 31, 0.1);
        border-radius: 15px;
        background: white;
        box-shadow: 0 10px 35px rgba(24, 42, 33, 0.04);
      }

      .ark-admin-stat-grid span {
        color: #6c756f;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
      }

      .ark-admin-stat-grid strong {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 38px;
      }

      .admin-dashboard-columns {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
        margin-top: 26px;
      }

      .admin-summary-card {
        padding: 25px;
        border-radius: 16px;
        background: #1c3026;
        color: white;
      }

      .admin-summary-card h3 {
        margin: 0 0 10px;
      }

      .admin-summary-card p {
        min-height: 65px;
        margin: 0;
        color: rgba(255, 255, 255, 0.65);
        line-height: 1.6;
      }

      .admin-summary-card strong {
        display: block;
        margin: 22px 0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 40px;
      }

      .admin-summary-card button {
        padding: 10px 13px;
        border: 0;
        border-radius: 8px;
        background: #d8b75f;
        color: #17201c;
        font-weight: 900;
        cursor: pointer;
      }

      .ark-admin-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .ark-admin-card {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 20px;
        padding: 23px;
        border: 1px solid rgba(20, 38, 29, 0.1);
        border-radius: 15px;
        background: white;
      }

      .ark-admin-card h3 {
        margin: 11px 0 7px;
        font-size: 20px;
      }

      .ark-admin-card p {
        max-width: 800px;
        margin: 9px 0;
        color: #68726c;
        line-height: 1.65;
      }

      .ark-admin-card small {
        display: block;
        margin-top: 12px;
        color: #89908c;
      }

      .ark-admin-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }

      .ark-admin-tags span {
        padding: 5px 9px;
        border-radius: 20px;
        background: #edf1ee;
        color: #46564d;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .ark-admin-tags span.approved {
        background: #ddf3e6;
        color: #17623f;
      }

      .ark-admin-tags span.pending {
        background: #fff2cb;
        color: #775d08;
      }

      .ark-admin-tags span.rejected {
        background: #f7dede;
        color: #8b2929;
      }

      .ark-admin-actions {
        display: flex;
        flex-wrap: wrap;
        align-content: start;
        justify-content: flex-end;
        gap: 8px;
      }

      .ark-admin-actions button {
        padding: 9px 12px;
        border: 1px solid #ccd3cf;
        border-radius: 7px;
        background: white;
        color: #283b31;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }

      .ark-admin-actions .approve-button {
        border-color: #20734d;
        background: #20734d;
        color: white;
      }

      .ark-admin-actions .reject-button,
      .ark-admin-actions .delete-button {
        border-color: #a63d3d;
        color: #9b3030;
      }

      .ark-admin-actions .delete-button {
        background: #fbe9e9;
      }

      .ark-admin-empty {
        padding: 55px 25px;
        border: 1px dashed #b9c3bd;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.55);
        color: #707a74;
        text-align: center;
      }

      .ark-admin-empty h3,
      .ark-admin-empty p {
        margin: 5px;
      }

      .ark-admin-table-wrapper {
        overflow-x: auto;
        border: 1px solid rgba(20, 38, 29, 0.1);
        border-radius: 15px;
        background: white;
      }

      .ark-admin-table {
        width: 100%;
        border-collapse: collapse;
      }

      .ark-admin-table th,
      .ark-admin-table td {
        padding: 17px;
        border-bottom: 1px solid #edf0ee;
        text-align: left;
      }

      .ark-admin-table th {
        color: #6d7771;
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .ark-admin-table td {
        font-size: 13px;
      }

      .ark-admin-table td strong,
      .ark-admin-table td small {
        display: block;
      }

      .ark-admin-table td small {
        margin-top: 4px;
        color: #7b847f;
      }

      .user-role {
        padding: 5px 9px;
        border-radius: 20px;
        background: #edf1ee;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .user-role.admin {
        background: #1f316f;
        color: white;
      }

      .user-role.editor {
        background: #fff0be;
        color: #765906;
      }

      .ark-investor-form {
        margin-bottom: 28px;
        padding: 27px;
        border: 1px solid rgba(20, 38, 29, 0.1);
        border-radius: 17px;
        background: white;
      }

      .ark-investor-form h3 {
        margin: 0 0 22px;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 26px;
      }

      .ark-investor-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .ark-investor-form label {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .ark-investor-form label span {
        color: #526159;
        font-size: 11px;
        font-weight: 900;
      }

      .ark-investor-form input,
      .ark-investor-form textarea,
      .ark-investor-form select {
        width: 100%;
        padding: 13px 14px;
        border: 1px solid #ccd4cf;
        border-radius: 9px;
        background: #fbfcfa;
        color: #17201c;
        font: inherit;
      }

      .ark-investor-form textarea {
        resize: vertical;
      }

      .ark-investor-form .full-width {
        grid-column: 1 / -1;
      }

      .ark-form-buttons {
        display: flex;
        gap: 10px;
        margin-top: 22px;
      }

      .investor-position {
        display: block;
        margin: 6px 0;
        color: #33483d;
      }

      .investor-website {
        display: inline-block;
        margin-top: 5px;
        color: #1f316f;
        font-size: 12px;
        font-weight: 900;
      }

      @media (max-width: 1100px) {
        .ark-admin-stat-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .admin-dashboard-columns {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 820px) {
        .ark-admin-layout {
          grid-template-columns: 1fr;
        }

        .ark-admin-sidebar {
          position: static;
          height: auto;
        }

        .ark-admin-navigation {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          margin: 25px 0;
        }

        .ark-admin-bottom-links {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .ark-admin-content {
          padding: 25px 18px 50px;
        }

        .ark-admin-card {
          grid-template-columns: 1fr;
        }

        .ark-admin-actions {
          justify-content: flex-start;
        }
      }

      @media (max-width: 600px) {
        .ark-admin-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .ark-admin-stat-grid,
        .ark-investor-form-grid {
          grid-template-columns: 1fr;
        }

        .ark-investor-form .full-width {
          grid-column: auto;
        }

        .ark-admin-navigation {
          grid-template-columns: 1fr;
        }

        .ark-admin-title-row {
          align-items: flex-start;
          flex-direction: column;
        }

        .ark-form-buttons {
          flex-direction: column;
        }
      }
    `}</style>
  );
}
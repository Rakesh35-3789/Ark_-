/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/components/AuthProvider';

type AdminTab =
  | 'dashboard'
  | 'submissions'
  | 'users'
  | 'investors';

type Status = 'pending' | 'approved' | 'rejected';

type Submission = {
  type: string;
  id: string;
  title: string;
  summary: string;
  label: string;
  created_at: string;
  submitted_by?: string | null;
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
  bio: string;
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

export default function AdminPage() {
  const { session, profile, loading } = useAuth();

  const [activeTab, setActiveTab] =
    useState<AdminTab>('dashboard');

  const [submissions, setSubmissions] = useState<
    Submission[]
  >([]);

  const [users, setUsers] = useState<UserProfile[]>([]);

  const [investors, setInvestors] = useState<Investor[]>(
    [],
  );

  const [investorForm, setInvestorForm] =
    useState<InvestorForm>(emptyInvestorForm);

  const [editingInvestorId, setEditingInvestorId] =
    useState<string | null>(null);

  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const token = session?.access_token;

  const statistics = useMemo(() => {
    return {
      users: users.length,

      admins: users.filter(
        (user) => user.role === 'admin',
      ).length,

      pendingSubmissions: submissions.length,

      investors: investors.length,

      publishedInvestors: investors.filter(
        (investor) => investor.status === 'approved',
      ).length,
    };
  }, [users, submissions, investors]);

  async function apiRequest(
    url: string,
    options: RequestInit = {},
  ) {
    if (!token) {
      throw new Error('Please log in again.');
    }

    const response = await fetch(url, {
      ...options,

      headers: {
        Authorization: `Bearer ${token}`,

        ...(options.body
          ? {
              'Content-Type': 'application/json',
            }
          : {}),

        ...(options.headers ?? {}),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || 'Something went wrong.',
      );
    }

    return result;
  }

  async function loadAllData() {
    if (!token || profile?.role !== 'admin') {
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const [
        submissionsResponse,
        usersResponse,
        investorsResponse,
      ] = await Promise.all([
        apiRequest('/api/admin/moderation'),
        apiRequest('/api/admin/users'),
        apiRequest('/api/admin/investors'),
      ]);

      setSubmissions(submissionsResponse.items ?? []);
      setUsers(usersResponse.users ?? []);
      setInvestors(investorsResponse.investors ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not load admin data.',
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (token && profile?.role === 'admin') {
      void loadAllData();
    }
  }, [token, profile?.role]);

  async function decideSubmission(
    item: Submission,
    status: 'approved' | 'rejected',
  ) {
    setMessage('');

    try {
      await apiRequest(
        `/api/admin/moderation/${item.type}/${item.id}`,
        {
          method: 'PATCH',

          body: JSON.stringify({
            status,
          }),
        },
      );

      setMessage(
        `${item.title} has been ${status}.`,
      );

      await loadAllData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not update submission.',
      );
    }
  }

  async function saveInvestor(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!investorForm.name.trim()) {
      setMessage('Investor name is required.');
      return;
    }

    if (!investorForm.firm.trim()) {
      setMessage('Investor firm is required.');
      return;
    }

    setBusy(true);
    setMessage('');

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
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not save investor.',
      );
    } finally {
      setBusy(false);
    }
  }

  function editInvestor(investor: Investor) {
    setEditingInvestorId(investor.id);

    setInvestorForm({
      name: investor.name,
      firm: investor.firm,
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

  function cancelEditing() {
    setEditingInvestorId(null);
    setInvestorForm(emptyInvestorForm);
  }

  async function changeInvestorStatus(
    investor: Investor,
    status: Status,
  ) {
    setMessage('');

    try {
      await apiRequest(
        `/api/admin/investors/${investor.id}`,
        {
          method: 'PATCH',

          body: JSON.stringify({
            status,
          }),
        },
      );

      setMessage(
        `${investor.name} has been ${status}.`,
      );

      await loadAllData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not update investor.',
      );
    }
  }

  async function deleteInvestor(
    investor: Investor,
  ) {
    const confirmed = window.confirm(
      `Delete ${investor.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setMessage('');

    try {
      await apiRequest(
        `/api/admin/investors/${investor.id}`,
        {
          method: 'DELETE',
        },
      );

      setMessage('Investor deleted successfully.');

      await loadAllData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not delete investor.',
      );
    }
  }

  if (loading) {
    return (
      <main className="admin-access-page">
        <div className="admin-access-card">
          Checking admin access...
        </div>
      </main>
    );
  }

  if (!session || profile?.role !== 'admin') {
    return (
      <main className="admin-access-page">
        <div className="admin-access-card">
          <h1>Admin access only</h1>

          <p>
            Only the official ARK administrator
            account can open this page.
          </p>

          <Link
            href="/auth"
            className="admin-primary-button"
          >
            Admin Sign In
          </Link>

          <Link
            href="/"
            className="admin-home-link"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ark-admin-layout">
      <aside className="ark-admin-sidebar">
        <div>
          <Link
            href="/"
            className="ark-admin-logo"
          >
            <span>A.R.K</span>
            <strong>ADMIN</strong>
          </Link>

          <p>Chronicles Management Centre</p>
        </div>

        <nav className="ark-admin-navigation">
          <button
            type="button"
            className={
              activeTab === 'dashboard'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveTab('dashboard')
            }
          >
            Dashboard
          </button>

          <button
            type="button"
            className={
              activeTab === 'submissions'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveTab('submissions')
            }
          >
            Submissions

            <span>{submissions.length}</span>
          </button>

          <button
            type="button"
            className={
              activeTab === 'users'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveTab('users')
            }
          >
            Users

            <span>{users.length}</span>
          </button>

          <button
            type="button"
            className={
              activeTab === 'investors'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveTab('investors')
            }
          >
            Investors

            <span>{investors.length}</span>
          </button>
        </nav>

        <div className="ark-admin-bottom-links">
          <Link href="/">
            Open Regular Website
          </Link>

          <Link href="/dashboard">
            My User Dashboard
          </Link>
        </div>
      </aside>

      <section className="ark-admin-content">
        <header className="ark-admin-header">
          <div>
            <p>ARK Administration</p>

            <h1>
              Welcome,{' '}
              {profile.full_name || 'Admin'}
            </h1>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => void loadAllData()}
            disabled={busy}
          >
            {busy
              ? 'Loading...'
              : 'Refresh Data'}
          </button>
        </header>

        {message && (
          <div className="ark-admin-message">
            {message}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <section>
            <h2>Admin Dashboard</h2>

            <div className="ark-admin-stat-grid">
              <article>
                <span>Registered Users</span>

                <strong>
                  {statistics.users}
                </strong>
              </article>

              <article>
                <span>Pending Submissions</span>

                <strong>
                  {
                    statistics.pendingSubmissions
                  }
                </strong>
              </article>

              <article>
                <span>Total Investors</span>

                <strong>
                  {statistics.investors}
                </strong>
              </article>

              <article>
                <span>Published Investors</span>

                <strong>
                  {
                    statistics.publishedInvestors
                  }
                </strong>
              </article>

              <article>
                <span>Admin Accounts</span>

                <strong>
                  {statistics.admins}
                </strong>
              </article>
            </div>
          </section>
        )}

        {activeTab === 'submissions' && (
          <section>
            <div className="ark-admin-title-row">
              <h2>Pending Submissions</h2>

              <span>
                {submissions.length} pending
              </span>
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

                    <p>{item.summary}</p>

                    <small>
                      Submitted by{' '}
                      {item.submitted_by ||
                        'ARK user'}
                      {' · '}
                      {new Date(
                        item.created_at,
                      ).toLocaleString()}
                    </small>
                  </div>

                  <div className="ark-admin-actions">
                    <button
                      type="button"
                      className="approve-button"
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
                  No pending submissions.
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'users' && (
          <section>
            <div className="ark-admin-title-row">
              <h2>Registered Users</h2>

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
                          <small>
                            @{user.username}
                          </small>
                        )}
                      </td>

                      <td>{user.role}</td>

                      <td>
                        {user.city ||
                          'Not provided'}
                      </td>

                      <td>
                        {user.verified
                          ? 'Yes'
                          : 'No'}
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
                  No registered users found.
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'investors' && (
          <section>
            <div className="ark-admin-title-row">
              <h2>Manage Investors</h2>

              <span>
                {investors.length} investors
              </span>
            </div>

            <form
              className="ark-investor-form"
              onSubmit={saveInvestor}
            >
              <h3>
                {editingInvestorId
                  ? 'Update Investor'
                  : 'Add Investor'}
              </h3>

              <div className="ark-investor-form-grid">
                <label>
                  <span>Investor Name *</span>

                  <input
                    value={investorForm.name}
                    onChange={(event) =>
                      setInvestorForm(
                        (current) => ({
                          ...current,
                          name: event.target.value,
                        }),
                      )
                    }
                    required
                  />
                </label>

                <label>
                  <span>Firm *</span>

                  <input
                    value={investorForm.firm}
                    onChange={(event) =>
                      setInvestorForm(
                        (current) => ({
                          ...current,
                          firm: event.target.value,
                        }),
                      )
                    }
                    required
                  />
                </label>

                <label>
                  <span>Role / Title</span>

                  <input
                    value={
                      investorForm.role_title
                    }
                    onChange={(event) =>
                      setInvestorForm(
                        (current) => ({
                          ...current,
                          role_title:
                            event.target.value,
                        }),
                      )
                    }
                  />
                </label>

                <label>
                  <span>City</span>

                  <input
                    value={investorForm.city}
                    onChange={(event) =>
                      setInvestorForm(
                        (current) => ({
                          ...current,
                          city: event.target.value,
                        }),
                      )
                    }
                  />
                </label>

                <label>
                  <span>Website</span>

                  <input
                    type="url"
                    value={investorForm.website}
                    onChange={(event) =>
                      setInvestorForm(
                        (current) => ({
                          ...current,
                          website:
                            event.target.value,
                        }),
                      )
                    }
                  />
                </label>

                <label>
                  <span>Status</span>

                  <select
                    value={investorForm.status}
                    onChange={(event) =>
                      setInvestorForm(
                        (current) => ({
                          ...current,

                          status:
                            event.target
                              .value as Status,
                        }),
                      )
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
                  <span>Investor Bio</span>

                  <textarea
                    rows={5}
                    value={investorForm.bio}
                    onChange={(event) =>
                      setInvestorForm(
                        (current) => ({
                          ...current,
                          bio: event.target.value,
                        }),
                      )
                    }
                  />
                </label>
              </div>

              <div className="ark-form-buttons">
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={busy}
                >
                  {editingInvestorId
                    ? 'Update Investor'
                    : 'Add Investor'}
                </button>

                {editingInvestorId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="ark-admin-list">
              {investors.map((investor) => (
                <article
                  className="ark-admin-card"
                  key={investor.id}
                >
                  <div className="ark-admin-card-content">
                    <div className="ark-admin-tags">
                      <span>
                        {investor.status}
                      </span>

                      {investor.city && (
                        <span>
                          {investor.city}
                        </span>
                      )}
                    </div>

                    <h3>{investor.name}</h3>

                    <strong>
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
                      >
                        Open Website
                      </a>
                    )}
                  </div>

                  <div className="ark-admin-actions">
                    <button
                      type="button"
                      onClick={() =>
                        editInvestor(investor)
                      }
                    >
                      Edit
                    </button>

                    {investor.status !==
                      'approved' && (
                      <button
                        type="button"
                        className="approve-button"
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

                    {investor.status !==
                      'rejected' && (
                      <button
                        type="button"
                        className="reject-button"
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
                      onClick={() =>
                        void deleteInvestor(
                          investor,
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}

              {!investors.length && (
                <div className="ark-admin-empty">
                  No investors added yet.
                </div>
              )}
            </div>
          </section>
        )}
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .admin-access-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background: #f4f6fb;
        }

        .admin-access-card {
          width: min(500px, 100%);
          padding: 40px;
          border-radius: 22px;
          background: white;
          text-align: center;
        }

        .admin-access-card p {
          color: #667085;
          line-height: 1.7;
        }

        .admin-home-link {
          display: block;
          margin-top: 16px;
          color: #21377d;
        }

        .admin-primary-button {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          border: 0;
          border-radius: 9px;
          background: #21377d;
          color: white;
          font-weight: 800;
          text-decoration: none;
        }

        .ark-admin-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 260px 1fr;
          background: #f4f6fb;
          color: #161b33;
        }

        .ark-admin-sidebar {
          min-height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 30px 22px;
          background: #111a3a;
          color: white;
        }

        .ark-admin-logo {
          display: flex;
          align-items: baseline;
          gap: 8px;
          color: white;
          text-decoration: none;
        }

        .ark-admin-logo span {
          color: #e1b83f;
          font-size: 24px;
          font-weight: 950;
        }

        .ark-admin-logo strong {
          font-size: 21px;
        }

        .ark-admin-sidebar > div > p {
          color: #9da8cc;
          font-size: 11px;
        }

        .ark-admin-navigation {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 35px;
        }

        .ark-admin-navigation button {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 15px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #c4cbe4;
          font-weight: 750;
        }

        .ark-admin-navigation button.active,
        .ark-admin-navigation button:hover {
          background: #26396f;
          color: white;
        }

        .ark-admin-navigation button span {
          min-width: 28px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          font-size: 11px;
        }

        .ark-admin-bottom-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
        }

        .ark-admin-bottom-links a {
          color: #c4cbe4;
          font-size: 13px;
          text-decoration: none;
        }

        .ark-admin-content {
          min-width: 0;
          padding: 32px;
        }

        .ark-admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .ark-admin-header p {
          margin: 0;
          color: #7a829c;
          font-size: 11px;
          text-transform: uppercase;
        }

        .ark-admin-header h1 {
          margin: 4px 0 0;
        }

        .admin-refresh-button {
          min-height: 44px;
          padding: 0 18px;
          border: 1px solid #dce1ee;
          border-radius: 9px;
          background: white;
          color: #21377d;
          font-weight: 800;
        }

        .ark-admin-message {
          margin-bottom: 20px;
          padding: 14px;
          border-radius: 10px;
          background: #eef2ff;
          color: #243a7c;
        }

        .ark-admin-stat-grid {
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 15px;
        }

        .ark-admin-stat-grid article {
          min-height: 125px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          border: 1px solid #e3e6ef;
          border-radius: 15px;
          background: white;
        }

        .ark-admin-stat-grid span {
          color: #7b8296;
        }

        .ark-admin-stat-grid strong {
          font-size: 34px;
        }

        .ark-admin-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 20px;
        }

        .ark-admin-title-row span {
          padding: 7px 12px;
          border-radius: 999px;
          background: #e7ebf8;
          color: #243a7c;
          font-size: 12px;
          font-weight: 800;
        }

        .ark-admin-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .ark-admin-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 22px;
          border: 1px solid #e0e4ef;
          border-radius: 14px;
          background: white;
        }

        .ark-admin-card-content {
          min-width: 0;
          flex: 1;
        }

        .ark-admin-card h3 {
          margin: 8px 0;
        }

        .ark-admin-card p {
          color: #686f82;
          line-height: 1.6;
        }

        .ark-admin-card small {
          color: #8a91a2;
        }

        .ark-admin-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .ark-admin-tags span {
          padding: 5px 9px;
          border-radius: 999px;
          background: #e9edf9;
          color: #2e4688;
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .ark-admin-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ark-admin-actions button {
          min-width: 95px;
          min-height: 38px;
          border: 1px solid #d7dce7;
          border-radius: 8px;
          background: #f8f9fb;
          font-weight: 800;
        }

        .ark-admin-actions .approve-button {
          border-color: #a9ddba;
          background: #eaf8ef;
          color: #23723d;
        }

        .ark-admin-actions .reject-button {
          border-color: #f0bfc2;
          background: #fff0f1;
          color: #a33239;
        }

        .ark-admin-table-wrapper {
          overflow-x: auto;
          border: 1px solid #e0e4ee;
          border-radius: 14px;
          background: white;
        }

        .ark-admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .ark-admin-table th,
        .ark-admin-table td {
          padding: 16px 18px;
          border-bottom: 1px solid #edf0f5;
          text-align: left;
          white-space: nowrap;
        }

        .ark-admin-table th {
          background: #f7f8fc;
          color: #747c91;
          font-size: 11px;
          text-transform: uppercase;
        }

        .ark-admin-table td {
          color: #4e5569;
          font-size: 13px;
        }

        .ark-admin-table td strong,
        .ark-admin-table td small {
          display: block;
        }

        .ark-admin-table td small {
          margin-top: 4px;
          color: #9299a9;
        }

        .ark-investor-form {
          margin-bottom: 22px;
          padding: 22px;
          border: 1px solid #e2e5ee;
          border-radius: 15px;
          background: white;
        }

        .ark-investor-form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .ark-investor-form label {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .ark-investor-form label span {
          color: #60687c;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .ark-investor-form label.full-width {
          grid-column: 1 / -1;
        }

        .ark-investor-form input,
        .ark-investor-form select,
        .ark-investor-form textarea {
          width: 100%;
          padding: 12px 13px;
          border: 1px solid #dce1eb;
          border-radius: 8px;
        }

        .ark-form-buttons {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .ark-admin-empty {
          padding: 45px;
          border: 1px dashed #ccd2df;
          border-radius: 14px;
          background: white;
          color: #8b92a3;
          text-align: center;
        }

        @media (max-width: 1000px) {
          .ark-admin-stat-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          .ark-admin-layout {
            display: block;
          }

          .ark-admin-sidebar {
            min-height: auto;
            position: static;
          }

          .ark-admin-navigation {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .ark-admin-bottom-links {
            margin-top: 25px;
          }
        }

        @media (max-width: 650px) {
          .ark-admin-content {
            padding: 20px 14px;
          }

          .ark-admin-header,
          .ark-admin-title-row,
          .ark-admin-card {
            align-items: stretch;
            flex-direction: column;
          }

          .ark-admin-stat-grid,
          .ark-investor-form-grid {
            grid-template-columns: 1fr;
          }

          .ark-admin-actions {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .ark-admin-actions button {
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}
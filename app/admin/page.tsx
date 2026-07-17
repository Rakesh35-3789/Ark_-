/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, FileText, ShieldCheck, Users, XCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

type Status = 'pending' | 'approved' | 'rejected';
type AdminTab = 'overview' | 'users' | 'submissions';

type AdminUser = {
  id: string;
  full_name: string | null;
  username: string | null;
  role: string;
  city: string | null;
  created_at: string;
};

type AdminSubmission = {
  type: 'story' | 'research' | 'founder' | 'opportunity';
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  summary: string;
  label: string;
  status: Status;
  createdAt: string;
  publishedAt: string | null;
};

type AdminData = {
  users: AdminUser[];
  submissions: AdminSubmission[];
  stats: {
    users: number;
    submissions: number;
    pending: number;
    approved: number;
    rejected: number;
  };
};

const emptyData: AdminData = {
  users: [],
  submissions: [],
  stats: { users: 0, submissions: 0, pending: 0, approved: 0, rejected: 0 },
};

export default function AdminPage() {
  const { session, profile, loading } = useAuth();
  const [data, setData] = useState<AdminData>(emptyData);
  const [tab, setTab] = useState<AdminTab>('overview');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState('');
  const [message, setMessage] = useState('');
  const [fetching, setFetching] = useState(false);

  const load = useCallback(async () => {
    if (!session) return;
    setFetching(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Could not load admin data.');
      setData(result as AdminData);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load admin data.');
    } finally {
      setFetching(false);
    }
  }, [session]);

  useEffect(() => {
    if (session && profile?.role === 'admin') void load();
  }, [session, profile, load]);

  async function decide(item: AdminSubmission, status: 'approved' | 'rejected') {
    if (!session) return;
    const key = `${item.type}-${item.id}`;
    setBusyId(key);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/moderation/${item.type}/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update submission.');

      setMessage(`${item.title} was ${status}.`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update submission.');
    } finally {
      setBusyId('');
    }
  }

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.submissions.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesQuery = !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.ownerName.toLowerCase().includes(normalizedQuery) ||
        item.type.toLowerCase().includes(normalizedQuery) ||
        item.label.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [data.submissions, query, statusFilter]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.users.filter((user) => {
      if (!normalizedQuery) return true;
      return [user.full_name, user.username, user.role, user.city]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [data.users, query]);

  if (loading) {
    return <main className="section shell"><div className="empty">Checking admin access…</div></main>;
  }

  if (!session || profile?.role !== 'admin') {
    return (
      <main className="auth-page">
        <div className="form-card admin-denied-card">
          <ShieldCheck size={38} />
          <h1>Admin access only</h1>
          <p>This page requires a valid ARK account whose profile role is set to admin.</p>
          <Link className="button" href="/auth">Admin sign in</Link>
          <Link className="button secondary" href="/">Return home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section shell admin-dashboard">
      <div className="dashboard-head admin-dashboard-head">
        <div>
          <div className="eyebrow">ARK control centre</div>
          <h1>Admin dashboard</h1>
          <p className="lead">See registered users, every submission and its current review status.</p>
        </div>
        <button className="button secondary" onClick={() => void load()} disabled={fetching}>
          {fetching ? 'Refreshing…' : 'Refresh data'}
        </button>
      </div>

      {message && <div className="notice admin-notice">{message}</div>}

      <section className="admin-stat-grid" aria-label="Platform statistics">
        <div><Users /><span>Users</span><b>{data.stats.users}</b></div>
        <div><FileText /><span>All submissions</span><b>{data.stats.submissions}</b></div>
        <div><Clock3 /><span>Pending</span><b>{data.stats.pending}</b></div>
        <div><CheckCircle2 /><span>Approved</span><b>{data.stats.approved}</b></div>
        <div><XCircle /><span>Rejected</span><b>{data.stats.rejected}</b></div>
      </section>

      <div className="admin-toolbar">
        <div className="admin-tabs">
          {(['overview', 'users', 'submissions'] as AdminTab[]).map((item) => (
            <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>
        <input
          aria-label="Search admin records"
          placeholder={tab === 'users' ? 'Search users…' : 'Search submissions…'}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {(tab === 'overview' || tab === 'submissions') && (
        <section className="admin-section-block">
          <div className="section-head admin-section-title">
            <div>
              <div className="eyebrow">Moderation</div>
              <h2>{tab === 'overview' ? 'Recent submissions' : 'All submissions'}</h2>
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | Status)}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="admin-list">
            {(tab === 'overview' ? filteredSubmissions.slice(0, 8) : filteredSubmissions).map((item) => {
              const key = `${item.type}-${item.id}`;
              return (
                <article key={key} className="admin-submission-card">
                  <div className="admin-submission-content">
                    <div className="admin-card-topline">
                      <span className={`status ${item.status}`}>{item.status}</span>
                      <span>{item.type}</span>
                      <span>{item.label}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <small>
                      Submitted by <strong>{item.ownerName}</strong> · {new Date(item.createdAt).toLocaleString()}
                    </small>
                  </div>

                  <div className="admin-actions">
                    <button
                      className="button small"
                      disabled={busyId === key || item.status === 'approved'}
                      onClick={() => void decide(item, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="button danger small"
                      disabled={busyId === key || item.status === 'rejected'}
                      onClick={() => void decide(item, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              );
            })}

            {!filteredSubmissions.length && <div className="empty">No matching submissions.</div>}
          </div>
        </section>
      )}

      {(tab === 'overview' || tab === 'users') && (
        <section className="admin-section-block">
          <div className="section-head admin-section-title">
            <div>
              <div className="eyebrow">Accounts</div>
              <h2>{tab === 'overview' ? 'Newest users' : 'All registered users'}</h2>
            </div>
            <div className="count-chip">{filteredUsers.length} users</div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>User</th><th>Role</th><th>City</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {(tab === 'overview' ? filteredUsers.slice(0, 8) : filteredUsers).map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.full_name || user.username || 'ARK member'}</strong><small className="admin-user-id">{user.username ? `@${user.username}` : user.id.slice(0, 8)}</small></td>
                    <td><span className={`role-pill ${user.role}`}>{user.role}</span></td>
                    <td>{user.city || 'Not added'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!filteredUsers.length && <tr><td colSpan={4}>No matching users.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

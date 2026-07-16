'use client';
import { useEffect } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
export default function Callback(){useEffect(()=>{createBrowserSupabase().auth.getSession().finally(()=>location.href='/dashboard')},[]);return <main className="auth-page"><div className="form-card">Confirming your account…</div></main>}

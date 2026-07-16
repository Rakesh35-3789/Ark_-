'use client';
import { FormEvent, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
export default function Reset(){const[msg,setMsg]=useState('');async function save(e:FormEvent<HTMLFormElement>){e.preventDefault();const password=String(new FormData(e.currentTarget).get('password'));const{error}=await createBrowserSupabase().auth.updateUser({password});setMsg(error?.message||'Password updated. You can now sign in.')}return <main className="auth-page"><form className="form-card" onSubmit={save}><h1>Choose a new password</h1><label>New password<input type="password" name="password" minLength={8} required/></label>{msg&&<div className="notice">{msg}</div>}<button className="button">Update password</button></form></main>}

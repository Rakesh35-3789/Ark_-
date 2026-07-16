'use client';
import { FormEvent, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
export default function Forgot(){const[msg,setMsg]=useState('');async function send(e:FormEvent<HTMLFormElement>){e.preventDefault();const email=String(new FormData(e.currentTarget).get('email'));const{error}=await createBrowserSupabase().auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/auth/reset-password`});setMsg(error?.message||'Password reset email sent.')}return <main className="auth-page"><form className="form-card" onSubmit={send}><h1>Reset password</h1><label>Email<input type="email" name="email" required/></label>{msg&&<div className="notice">{msg}</div>}<button className="button">Send reset link</button></form></main>}

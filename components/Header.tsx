'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
const links=[['Explore','/explore'],['Research','/research'],['Founders','/founders'],['Opportunities','/opportunities'],['Submit','/submit']];
export function Header(){const[open,setOpen]=useState(false);const{user,profile,signOut,loading}=useAuth();return <header className="header"><div className="shell header-inner"><Link href="/" className="brand"><span>ARK</span><small>Innovation Network</small></Link><nav className={open?'nav open':'nav'}>{links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}{!loading&&(user?<>{profile?.role==='admin'&&<Link href="/admin">Admin</Link>}<Link href="/dashboard">Dashboard</Link><button className="link-button" onClick={async()=>{await signOut();location.href='/'}}>Sign out</button></>:<Link className="button small" href="/auth">Join ARK</Link>)}</nav><button className="menu" aria-label="Toggle navigation" onClick={()=>setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button></div></header>}

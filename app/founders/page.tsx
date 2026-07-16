'use client';
import { useEffect,useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import type { Founder } from '@/lib/types';
import { DirectoryCard } from '@/components/DirectoryCard';
import Link from 'next/link';
export default function Founders(){const[items,setItems]=useState<Founder[]>([]);const[loading,setLoading]=useState(true);useEffect(()=>{createBrowserSupabase().from('founders').select('*').eq('status','approved').order('published_at',{ascending:false}).then(({data})=>{setItems((data as Founder[])||[]);setLoading(false)})},[]);return <main className="section shell"><div className="section-head"><div><div className="eyebrow">Founder directory</div><h1>Meet the people building next</h1><p className="lead">Moderated profiles of founders and startup leaders.</p></div><Link className="button small" href="/submit?type=founder">Add founder</Link></div>{loading?<div className="empty">Loading founders…</div>:items.length?<div className="directory-grid">{items.map(i=><DirectoryCard key={i.id} eyebrow={i.role_title||'Founder'} title={`${i.name} · ${i.company}`} description={i.bio} meta={i.city||'India'} href={i.website||undefined}/>)}</div>:<div className="empty">No approved founder profiles yet.</div>}</main>}

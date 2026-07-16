'use client';
import { useEffect,useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import type { ResearchPaper } from '@/lib/types';
import { DirectoryCard } from '@/components/DirectoryCard';
import Link from 'next/link';
export default function Research(){const[items,setItems]=useState<ResearchPaper[]>([]);const[loading,setLoading]=useState(true);useEffect(()=>{createBrowserSupabase().from('research_papers').select('*, profiles(full_name,username)').eq('status','approved').order('published_at',{ascending:false}).then(({data})=>{setItems((data as ResearchPaper[])||[]);setLoading(false)})},[]);return <main className="section shell"><div className="section-head"><div><div className="eyebrow">Research hub</div><h1>Work worth understanding</h1><p className="lead">Approved papers from students, researchers and institutions.</p></div><Link className="button small" href="/submit?type=research">Submit research</Link></div>{loading?<div className="empty">Loading research…</div>:items.length?<div className="directory-grid">{items.map(i=><DirectoryCard key={i.id} eyebrow={i.field} title={i.title} description={i.abstract} meta={i.institution||i.profiles?.full_name||'Independent research'} href={i.paper_url||undefined}/>)}</div>:<div className="empty">No approved research yet.</div>}</main>}

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { createBrowserSupabase } from '@/lib/supabase-browser';

type Row = { id:string; title:string; type:string; status:string; created_at:string; secondary?:string|null };
type Note = { id:string; title:string; message:string; read:boolean; created_at:string };
type Saved = { story_id:string; stories:{ title:string; slug:string; category:string }|null };

export default function DashboardPage(){
  const { user, profile, loading } = useAuth();
  const [items,setItems]=useState<Row[]>([]);
  const [notes,setNotes]=useState<Note[]>([]);
  const [saved,setSaved]=useState<Saved[]>([]);
  const [error,setError]=useState('');

  useEffect(()=>{
    if(!user) return;
    const sb=createBrowserSupabase();
    Promise.all([
      sb.from('stories').select('id,title,status,created_at').eq('author_id',user.id),
      sb.from('research_papers').select('id,title,institution,status,created_at').eq('author_id',user.id),
      sb.from('founders').select('id,name,company,status,created_at').eq('owner_id',user.id),
      sb.from('investors').select('id,name,firm,status,created_at').eq('owner_id',user.id),
      sb.from('opportunities').select('id,title,organization,status,created_at').eq('owner_id',user.id),
      sb.from('notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(10),
      sb.from('bookmarks').select('story_id, stories(title,slug,category)').eq('user_id',user.id)
    ]).then(([a,b,c,inv,d,n,bm])=>{
      const firstError=a.error||b.error||c.error||inv.error||d.error||n.error||bm.error;
      if(firstError){ setError(firstError.message); return; }
      setItems([
        ...(a.data||[]).map(x=>({...x,type:'Story'})),
        ...(b.data||[]).map(x=>({...x,type:'Research',secondary:x.institution})),
        ...(c.data||[]).map(x=>({id:x.id,title:x.name,secondary:x.company,status:x.status,created_at:x.created_at,type:'Founder'})),
        ...(inv.data||[]).map(x=>({id:x.id,title:x.name,secondary:x.firm,status:x.status,created_at:x.created_at,type:'Investor'})),
        ...(d.data||[]).map(x=>({...x,type:'Opportunity',secondary:x.organization}))
      ].sort((x,y)=>new Date(y.created_at).getTime()-new Date(x.created_at).getTime()));
      setNotes((n.data as Note[])||[]);
      setSaved((bm.data as unknown as Saved[])||[]);
    });
  },[user]);

  const stats=useMemo(()=>({
    total:items.length,
    approved:items.filter(i=>i.status==='approved').length,
    pending:items.filter(i=>i.status==='pending').length,
    rejected:items.filter(i=>i.status==='rejected').length,
    investors:items.filter(i=>i.type==='Investor').length,
  }),[items]);

  if(loading) return <main className="section shell"><div className="empty">Loading dashboard…</div></main>;
  if(!user) return <main className="auth-page"><div className="form-card"><h1>Your ARK dashboard</h1><p>Sign in to track submissions.</p><Link className="button" href="/auth">Sign in</Link></div></main>;

  return <main className="dash-page">
    <section className="dash-hero"><div className="dash-shell dash-head"><div><div className="eyebrow">Member dashboard</div><h1>Welcome, {profile?.full_name||'Builder'}</h1><p>Track stories, research, founders, investors and opportunities.</p></div><div className="dash-actions"><Link href="/profile">Edit profile</Link><Link href="/submit">New submission</Link></div></div></section>
    <section className="dash-shell dash-content">
      {error&&<div className="dash-error">{error}</div>}
      <div className="dash-stats">{[['Total',stats.total],['Approved',stats.approved],['Pending',stats.pending],['Rejected',stats.rejected],['Investors',stats.investors],['Saved',saved.length]].map(([l,v])=><article key={String(l)}><span>{l}</span><b>{v}</b></article>)}</div>
      <div className="dash-grid"><section className="dash-card"><div className="dash-title"><h2>My submissions</h2><Link href="/submit">Submit Investor</Link></div><div className="table-wrap"><table><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th></tr></thead><tbody>{items.map(i=><tr key={`${i.type}-${i.id}`}><td><b>{i.title}</b>{i.secondary&&<small>{i.secondary}</small>}</td><td>{i.type}</td><td><span className={`status ${i.status}`}>{i.status}</span></td><td>{new Date(i.created_at).toLocaleDateString()}</td></tr>)}{!items.length&&<tr><td colSpan={4}>No submissions yet.</td></tr>}</tbody></table></div></section><aside><section className="dash-card"><h2>Notifications</h2>{notes.map(n=><article className="note" key={n.id}><b>{n.title}</b><p>{n.message}</p><small>{new Date(n.created_at).toLocaleString()}</small></article>)}{!notes.length&&<div className="empty">No notifications yet.</div>}</section><section className="dash-card"><h2>Saved stories</h2>{saved.map(s=><Link className="saved" key={s.story_id} href={`/stories/${s.stories?.slug||''}`}><b>{s.stories?.title}</b><small>{s.stories?.category}</small></Link>)}{!saved.length&&<div className="empty">No saved stories.</div>}</section></aside></div>
    </section>
    <style jsx global>{`
      .dash-page{min-height:100vh;background:#f5f2ea}.dash-shell{width:min(1200px,calc(100% - 40px));margin:auto}.dash-hero{padding:65px 0;background:linear-gradient(135deg,#faf8f2,#edf2ed);border-bottom:1px solid #d8ded9}.dash-head{display:flex;justify-content:space-between;align-items:end;gap:25px}.dash-head h1{font:700 clamp(42px,6vw,68px)/1 Georgia;margin:10px 0}.dash-head p{color:#68736c}.dash-actions{display:flex;gap:10px}.dash-actions a,.dash-title a{padding:11px 15px;border-radius:9px;background:#1f316f;color:white;text-decoration:none;font-weight:800}.dash-content{padding:35px 0 80px}.dash-error{padding:14px;background:#f8e2e2;color:#8c2929;border-radius:10px;margin-bottom:18px}.dash-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}.dash-stats article{background:white;border:1px solid #dfe4e0;border-radius:14px;padding:18px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between}.dash-stats span{font-size:10px;text-transform:uppercase;color:#6d7771;font-weight:900}.dash-stats b{font:700 32px Georgia}.dash-grid{display:grid;grid-template-columns:1fr 330px;gap:20px}.dash-card{background:white;border:1px solid #dfe4e0;border-radius:16px;padding:22px;margin-bottom:18px}.dash-title{display:flex;justify-content:space-between;align-items:center}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse}th,td{padding:14px 10px;border-bottom:1px solid #edf0ed;text-align:left}th{font-size:10px;text-transform:uppercase;color:#6d7771}td small{display:block;color:#7b847f;margin-top:4px}.status{padding:5px 9px;border-radius:20px;font-size:9px;font-weight:900;text-transform:uppercase;background:#edf0ed}.status.approved{background:#dcf1e5;color:#17613f}.status.pending{background:#fff1c7;color:#775c08}.status.rejected{background:#f6dddd;color:#8b2929}.note,.saved{display:block;padding:13px;border-radius:10px;background:#f4f6f3;margin-top:10px;color:inherit;text-decoration:none}.note p{color:#68726c;font-size:12px}.note small,.saved small{display:block;color:#7d8681;margin-top:5px}@media(max-width:1000px){.dash-stats{grid-template-columns:repeat(3,1fr)}.dash-grid{grid-template-columns:1fr}}@media(max-width:650px){.dash-head{align-items:flex-start;flex-direction:column}.dash-stats{grid-template-columns:repeat(2,1fr)}.dash-shell{width:min(100% - 24px,1200px)}}
    `}</style>
  </main>;
}

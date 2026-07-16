import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, createUserSupabase } from '@/lib/supabase-server';
async function admin(req:NextRequest){const token=req.headers.get('authorization')?.replace(/^Bearer\s+/,'');if(!token)return false;const sb=createUserSupabase(token);const{data:{user}}=await sb.auth.getUser();if(!user)return false;const{data}=await createAdminSupabase().from('profiles').select('role').eq('id',user.id).single();return data?.role==='admin'}
export async function GET(req:NextRequest){try{if(!await admin(req))return NextResponse.json({error:'Forbidden'},{status:403});const sb=createAdminSupabase();const [stories,research,founders,opportunities]=await Promise.all([
 sb.from('stories').select('id,title,excerpt,category,created_at').eq('status','pending').order('created_at',{ascending:false}),
 sb.from('research_papers').select('id,title,abstract,field,created_at').eq('status','pending').order('created_at',{ascending:false}),
 sb.from('founders').select('id,name,company,bio,created_at').eq('status','pending').order('created_at',{ascending:false}),
 sb.from('opportunities').select('id,title,organization,description,created_at').eq('status','pending').order('created_at',{ascending:false})
]);const error=stories.error||research.error||founders.error||opportunities.error;if(error)throw error;return NextResponse.json({items:[
 ...(stories.data||[]).map(x=>({type:'story',id:x.id,title:x.title,summary:x.excerpt,label:x.category,created_at:x.created_at})),
 ...(research.data||[]).map(x=>({type:'research',id:x.id,title:x.title,summary:x.abstract,label:x.field,created_at:x.created_at})),
 ...(founders.data||[]).map(x=>({type:'founder',id:x.id,title:`${x.name} · ${x.company}`,summary:x.bio,label:'Founder profile',created_at:x.created_at})),
 ...(opportunities.data||[]).map(x=>({type:'opportunity',id:x.id,title:x.title,summary:x.description,label:x.organization,created_at:x.created_at}))
].sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Server error'},{status:500})}}

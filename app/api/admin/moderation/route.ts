import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, createUserSupabase } from '@/lib/supabase-server';

async function getAdminUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/, '');
  if (!token) return null;

  const userSupabase = createUserSupabase(token);
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) return null;

  const adminSupabase = createAdminSupabase();
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  return profile?.role === 'admin' ? user : null;
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createAdminSupabase();
    const [profiles, stories, research, founders, opportunities] = await Promise.all([
      supabase
        .from('profiles')
        .select('id,full_name,username,role,city,created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('stories')
        .select('id,author_id,title,excerpt,category,status,created_at,published_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('research_papers')
        .select('id,author_id,title,abstract,field,status,created_at,published_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('founders')
        .select('id,owner_id,name,company,bio,status,created_at,published_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('opportunities')
        .select('id,owner_id,title,organization,description,status,created_at,published_at')
        .order('created_at', { ascending: false }),
    ]);

    const error = profiles.error || stories.error || research.error || founders.error || opportunities.error;
    if (error) throw error;

    const users = profiles.data ?? [];
    const nameByUserId = new Map(
      users.map((user) => [user.id, user.full_name || user.username || 'ARK member']),
    );

    const submissions = [
      ...(stories.data ?? []).map((item) => ({
        type: 'story',
        id: item.id,
        ownerId: item.author_id,
        ownerName: nameByUserId.get(item.author_id) ?? 'ARK member',
        title: item.title,
        summary: item.excerpt,
        label: item.category,
        status: item.status,
        createdAt: item.created_at,
        publishedAt: item.published_at,
      })),
      ...(research.data ?? []).map((item) => ({
        type: 'research',
        id: item.id,
        ownerId: item.author_id,
        ownerName: nameByUserId.get(item.author_id) ?? 'ARK member',
        title: item.title,
        summary: item.abstract,
        label: item.field,
        status: item.status,
        createdAt: item.created_at,
        publishedAt: item.published_at,
      })),
      ...(founders.data ?? []).map((item) => ({
        type: 'founder',
        id: item.id,
        ownerId: item.owner_id,
        ownerName: nameByUserId.get(item.owner_id) ?? 'ARK member',
        title: `${item.name} · ${item.company}`,
        summary: item.bio,
        label: 'Founder profile',
        status: item.status,
        createdAt: item.created_at,
        publishedAt: item.published_at,
      })),
      ...(opportunities.data ?? []).map((item) => ({
        type: 'opportunity',
        id: item.id,
        ownerId: item.owner_id,
        ownerName: nameByUserId.get(item.owner_id) ?? 'ARK member',
        title: item.title,
        summary: item.description,
        label: item.organization,
        status: item.status,
        createdAt: item.created_at,
        publishedAt: item.published_at,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      users,
      submissions,
      stats: {
        users: users.length,
        submissions: submissions.length,
        pending: submissions.filter((item) => item.status === 'pending').length,
        approved: submissions.filter((item) => item.status === 'approved').length,
        rejected: submissions.filter((item) => item.status === 'rejected').length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 },
    );
  }
}

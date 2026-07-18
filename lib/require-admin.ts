import { NextRequest } from 'next/server';

import {
  createAdminSupabase,
  createUserSupabase,
} from '@/lib/supabase-server';

export async function requireAdmin(request: NextRequest) {
  const authorization = request.headers.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return {
      error: 'You must log in first.',
      status: 401,
      user: null,
      admin: null,
    };
  }

  const accessToken = authorization.replace('Bearer ', '').trim();

  const userSupabase = createUserSupabase(accessToken);

  const {
    data: { user },
    error: userError,
  } = await userSupabase.auth.getUser(accessToken);

  if (userError || !user) {
    return {
      error: 'Your login session is invalid or expired.',
      status: 401,
      user: null,
      admin: null,
    };
  }

  const adminSupabase = createAdminSupabase();

  const { data: profile, error: profileError } = await adminSupabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return {
      error: 'Profile not found.',
      status: 403,
      user: null,
      admin: null,
    };
  }

  if (profile.role !== 'admin') {
    return {
      error: 'Admin access only.',
      status: 403,
      user: null,
      admin: null,
    };
  }

  return {
    error: null,
    status: 200,
    user,
    admin: adminSupabase,
  };
}
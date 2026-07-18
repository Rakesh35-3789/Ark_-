import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/require-admin';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);

    if (auth.error || !auth.admin) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status },
      );
    }

    const { data, error } = await auth.admin
      .from('profiles')
      .select(
        `
          id,
          full_name,
          username,
          role,
          city,
          avatar_url,
          verified,
          created_at
        `,
      )
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      users: data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not load users.',
      },
      { status: 500 },
    );
  }
}
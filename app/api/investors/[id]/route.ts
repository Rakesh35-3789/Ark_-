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
      .from('investors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      investors: data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not load investors.',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);

    if (auth.error || !auth.admin || !auth.user) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status },
      );
    }

    const body = await request.json();

    const name = String(body.name ?? '').trim();
    const firm = String(body.firm ?? '').trim();
    const roleTitle = String(body.role_title ?? '').trim();
    const city = String(body.city ?? '').trim();
    const bio = String(body.bio ?? '').trim();
    const website = String(body.website ?? '').trim();
    const status =
      body.status === 'pending' ||
      body.status === 'rejected'
        ? body.status
        : 'approved';

    if (!name) {
      return NextResponse.json(
        { error: 'Investor name is required.' },
        { status: 400 },
      );
    }

    if (!firm) {
      return NextResponse.json(
        { error: 'Investor firm or organisation is required.' },
        { status: 400 },
      );
    }

    const { data, error } = await auth.admin
      .from('investors')
      .insert({
        owner_id: auth.user.id,
        name,
        firm,
        role_title: roleTitle || null,
        city: city || null,
        bio,
        website: website || null,
        status,
        published_at:
          status === 'approved'
            ? new Date().toISOString()
            : null,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        message: 'Investor added successfully.',
        investor: data,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not add investor.',
      },
      { status: 500 },
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/require-admin';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const auth = await requireAdmin(request);

    if (auth.error || !auth.admin) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status },
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (typeof body.name === 'string') {
      updateData.name = body.name.trim();
    }

    if (typeof body.firm === 'string') {
      updateData.firm = body.firm.trim();
    }

    if (typeof body.role_title === 'string') {
      updateData.role_title =
        body.role_title.trim() || null;
    }

    if (typeof body.city === 'string') {
      updateData.city = body.city.trim() || null;
    }

    if (typeof body.bio === 'string') {
      updateData.bio = body.bio.trim();
    }

    if (typeof body.website === 'string') {
      updateData.website = body.website.trim() || null;
    }

    if (
      body.status === 'pending' ||
      body.status === 'approved' ||
      body.status === 'rejected'
    ) {
      updateData.status = body.status;
      updateData.published_at =
        body.status === 'approved'
          ? new Date().toISOString()
          : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields were provided.' },
        { status: 400 },
      );
    }

    const { data, error } = await auth.admin
      .from('investors')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Investor updated successfully.',
      investor: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not update investor.',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const auth = await requireAdmin(request);

    if (auth.error || !auth.admin) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status },
      );
    }

    const { id } = await context.params;

    const { error } = await auth.admin
      .from('investors')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Investor deleted successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not delete investor.',
      },
      { status: 500 },
    );
  }
}
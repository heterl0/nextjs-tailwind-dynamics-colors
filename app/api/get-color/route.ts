import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const color = params.get('color') || '#000000';
  const response = await fetch(`https://app.uibakery.io/api/painter/support?primary=${color}`);
  if (response.ok) {
    return NextResponse.json(await response.json());
  }
}

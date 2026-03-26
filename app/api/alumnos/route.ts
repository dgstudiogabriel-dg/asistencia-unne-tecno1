import { NextResponse } from 'next/server';
import { getAlumnos } from '@/lib/db';

export async function GET() {
  const alumnos = getAlumnos();
  return NextResponse.json(alumnos);
}

import { NextResponse } from 'next/server';
import { getAlumnosFromSheet } from '@/lib/googleSheets';

export async function GET() {
  try {
    const alumnos = await getAlumnosFromSheet();
    return NextResponse.json(alumnos);
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


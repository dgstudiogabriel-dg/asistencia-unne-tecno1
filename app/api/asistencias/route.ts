import { NextResponse } from 'next/server';
import { getAsistencias, addAsistencia, updateAsistencia, deleteAsistencia } from '@/lib/db';
import { recordAsistenciaInSheet, getAsistenciasFromSheet } from '@/lib/googleSheets';



export async function GET() {
  try {
    const asistencias = await getAsistenciasFromSheet();
    // Merge with local only in development for persistence testing
    if (process.env.NODE_ENV === 'development') {
      const localAsistencias = getAsistencias();
      // Simple merge or just return sheets
      return NextResponse.json(asistencias.length > 0 ? asistencias : localAsistencias);
    }
    return NextResponse.json(asistencias);
  } catch (error: any) {
    console.error('Error fetching attendance:', error);
    const localAsistencias = getAsistencias();
    return NextResponse.json(localAsistencias);
  }
}



export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // We still call addAsistencia for local tracking/fallback if needed, 
    // but the primary action is Google Sheets.
    const newAsistencia = addAsistencia(data);

    // Primary Sync to Google Sheets
    await recordAsistenciaInSheet(newAsistencia);

    return NextResponse.json(newAsistencia);
  } catch (error: any) {
    console.error('Error recording attendance:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function PUT(request: Request) {
  const { id, ...updates } = await request.json();
  const updated = updateAsistencia(id, updates);
  if (updated) {
    return NextResponse.json(updated);
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  deleteAsistencia(id);
  return NextResponse.json({ success: true });
}

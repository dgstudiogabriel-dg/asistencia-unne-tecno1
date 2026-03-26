import { NextResponse } from 'next/server';
import { getAsistencias, addAsistencia, updateAsistencia, deleteAsistencia } from '@/lib/db';

export async function GET() {
  const asistencias = getAsistencias();
  return NextResponse.json(asistencias);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newAsistencia = addAsistencia(data);

  // Background sync to Google Sheets (if URL configured)
  const gSheetsUrl = process.env.GOOGLE_SHEETS_URL;
  if (gSheetsUrl) {
    try {
      fetch(gSheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsistencia),
        mode: 'no-cors' // Google Script usually responds with CORS issues but still executes
      }).catch(err => console.error('Sync failed:', err));
    } catch (e) {
      console.error('Error initiating sync:', e);
    }
  }

  return NextResponse.json(newAsistencia);
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

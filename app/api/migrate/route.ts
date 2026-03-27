import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getAlumnos } from '@/lib/db';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PROJECT_ID) {
    throw new Error('Google Sheets credentials are not fully configured');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
      project_id: process.env.GOOGLE_PROJECT_ID,
    },
    scopes: SCOPES,
  });

  return auth;
}

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;

export async function GET() {
  try {
    const students = getAlumnos();
    console.log(`Starting migration of ${students.length} students...`);

    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const values = students.map((s, index) => [
      index + 1,
      s.nombre,
      s.dni,
      s.email
    ]);

    // Clear and Update
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'ALUMNOS!A2:E',
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'ALUMNOS!A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Migrated ${students.length} students successfully.` 
    });
  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

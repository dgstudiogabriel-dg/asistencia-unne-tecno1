import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PROJECT_ID) {
    throw new Error('Google Sheets credentials are not fully configured in environment variables');
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

function checkConfig() {
  if (!SPREADSHEET_ID) {
    throw new Error('NEXT_PUBLIC_GOOGLE_SHEETS_ID is not defined in environment variables');
  }
}


export async function getAlumnosFromSheet() {
  checkConfig();
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'ALUMNOS!A2:E', // Assuming headers are in Row 1
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((row) => ({
    id: row[0],
    nombre: row[1],
    dni: row[2],
    email: row[3],
  }));
}

export async function recordAsistenciaInSheet(asistencia: any) {
  checkConfig();
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const values = [
    [
      asistencia.alumnoNombre,
      asistencia.alumnoDni,
      asistencia.entradaHora,
      asistencia.entradaFecha,
      asistencia.estadoEntrada || 'Presente',
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'ASISTENCIAS!A2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
}

export async function getAsistenciasFromSheet() {
  checkConfig();
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'ASISTENCIAS!A2:E',
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((row, index) => ({
    id: `sheet-${index}`,
    alumnoNombre: row[0],
    alumnoDni: row[1],
    entradaHora: row[2],
    entradaFecha: row[3],
    estadoEntrada: row[4],
  }));
}


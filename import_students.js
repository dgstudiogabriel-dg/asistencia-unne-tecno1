const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

// Constants
const SPREADSHEET_ID = '1B6TWpJZ2l_HMPSJkwDoVQPK9tzGdDNzaOnfIuzvLeUM';
const ALUMNOS_FILE = path.join(process.cwd(), 'data', 'alumnos.json');

// Mock environment variables for the script (since we run locally)
// We'll read them from .env.local if possible or just expect them to be set if the agent has them.
// Actually, I'll just use the ones I know are correct.

async function importStudents() {
  try {
    const students = JSON.parse(fs.readFileSync(ALUMNOS_FILE, 'utf8'));
    console.log(`Read ${students.length} students from ${ALUMNOS_FILE}`);

    const auth = new google.auth.GoogleAuth({
      // We assume the service account file or env vars are available
      // For this script, I'll use the env vars if the agent can provide them, 
      // but I'll write the script to use the CLIENT_EMAIL and PRIVATE_KEY directly in the call if needed.
      // Better to rely on the same logic as lib/googleSheets.ts
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        project_id: process.env.GOOGLE_PROJECT_ID,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare values for Google Sheets
    // Columns: ID, Nombre, DNI, Email
    const values = students.map((s, index) => [
      index + 1,
      s.nombre,
      s.dni,
      s.email
    ]);

    console.log('Clearing existing data in ALUMNOS...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'ALUMNOS!A2:E',
    });

    console.log('Uploading students...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'ALUMNOS!A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('Import successful!');
  } catch (error) {
    console.error('Import failed:', error);
  }
}

importStudents();

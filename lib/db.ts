import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ALUMNOS_FILE = path.join(DATA_DIR, 'alumnos.json');
const ASISTENCIAS_FILE = path.join(DATA_DIR, 'asistencias.json');

export interface Alumno {
  nombre: string;
  dni: string;
  email: string;
}

export interface Asistencia {
  id: string;
  alumnoNombre: string;
  alumnoDni: string;
  entradaHora: string;
  entradaFecha: string;
  salidaHora?: string;
  salidaFecha?: string;
  estadoEntrada: 'Presente' | 'Ausente' | 'Tardío';
}

function readJsonFile(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  // Strip UTF-8 BOM if present
  const cleanContent = content.startsWith('\uFEFF') ? content.slice(1) : content;
  try {
    return JSON.parse(cleanContent);
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e);
    return null;
  }
}

export function getAlumnos(): Alumno[] {
  return readJsonFile(ALUMNOS_FILE) || [];
}

export function getAsistencias(): Asistencia[] {
  return readJsonFile(ASISTENCIAS_FILE) || [];
}

export function saveAsistencias(asistencias: Asistencia[]) {
  // Vercel filesystem is read-only. We skip local saving in production.
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    console.log('Skipping local save on Vercel/Production. Using Google Sheets as source of truth.');
    return;
  }
  
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    fs.writeFileSync(ASISTENCIAS_FILE, JSON.stringify(asistencias, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving local asistencias:', error);
  }
}


export function addAsistencia(asistencia: Omit<Asistencia, 'id'>) {
  const asistencias = getAsistencias();
  const newAsistencia = {
    ...asistencia,
    id: Math.random().toString(36).substring(2, 11),
  };
  asistencias.push(newAsistencia);
  saveAsistencias(asistencias);
  return newAsistencia;
}

export function updateAsistencia(id: string, updates: Partial<Asistencia>) {
  const asistencias = getAsistencias();
  const index = asistencias.findIndex(a => a.id === id);
  if (index !== -1) {
    asistencias[index] = { ...asistencias[index], ...updates };
    saveAsistencias(asistencias);
    return asistencias[index];
  }
  return null;
}

export function deleteAsistencia(id: string) {
  const asistencias = getAsistencias();
  const filtered = asistencias.filter(a => a.id !== id);
  saveAsistencias(filtered);
}

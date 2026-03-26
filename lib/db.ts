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

export function getAlumnos(): Alumno[] {
  if (!fs.existsSync(ALUMNOS_FILE)) return [];
  const content = fs.readFileSync(ALUMNOS_FILE, 'utf8');
  return JSON.parse(content);
}

export function getAsistencias(): Asistencia[] {
  if (!fs.existsSync(ASISTENCIAS_FILE)) return [];
  const content = fs.readFileSync(ASISTENCIAS_FILE, 'utf8');
  return JSON.parse(content);
}

export function saveAsistencias(asistencias: Asistencia[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  fs.writeFileSync(ASISTENCIAS_FILE, JSON.stringify(asistencias, null, 2), 'utf8');
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

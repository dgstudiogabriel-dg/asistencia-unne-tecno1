'use client';

import React, { useState, useEffect } from 'react';
import { Alumno, Asistencia } from '@/lib/db';
import { StudentDropdown } from './StudentDropdown';
import { GlassCard } from './GlassCard';
import { CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';

export function FormularioQR() {
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [dniSuffix, setDniSuffix] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumno) {
      setMessage('Por favor, selecciona tu nombre.');
      setStatus('error');
      return;
    }

    // Validate DNI suffix (exactly 6 digits)
    if (dniSuffix.length !== 6 || !/^\d+$/.test(dniSuffix)) {
      setMessage('El DNI debe tener exactamente 6 dígitos.');
      setStatus('error');
      return;
    }

    // Verify DNI matches (last 6 digits)
    const expectedSuffix = selectedAlumno.dni.slice(-6);
    if (dniSuffix !== expectedSuffix) {
      setMessage('Los últimos 6 dígitos del DNI no coinciden.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const resp = await fetch('/api/asistencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alumnoNombre: selectedAlumno.nombre,
          alumnoDni: selectedAlumno.dni,
          entradaHora: currentTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          entradaFecha: currentTime.toLocaleDateString('es-AR'),
          estadoEntrada: 'Presente', // Default
        }),
      });

      if (resp.ok) {
        setStatus('success');
        setMessage(`Asistencia registrada ✓ - ${currentTime.toLocaleTimeString()}`);
      } else {
        throw new Error('Error al registrar asistencia');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Hubo un problema al conectar con el servidor.');
    }
  };

  if (status === 'success') {
    return (
      <GlassCard className="max-w-md mx-auto text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 size={64} className="text-accent-green" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">¡Gracias, {selectedAlumno?.nombre.split(',')[1] || selectedAlumno?.nombre}!</h2>
        <p className="text-lg text-gray-300 mb-8">{message}</p>
        <button
          onClick={() => {
            setStatus('idle');
            setSelectedAlumno(null);
            setDniSuffix('');
            setMessage('');
          }}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all font-medium"
        >
          Registrar otro
        </button>
      </GlassCard>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4">
      {/* Header with UNNE Logo simulation */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center p-2">
           {/* UNNE Logo Placeholder */}
           <div className="w-full h-full bg-gradient-cyan-magenta rounded-xl flex items-center justify-center text-white font-bold text-xs">
             UNNE
           </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">TEC GRÁFICA 1</h1>
          <p className="text-gray-400">Sistema de Control de Asistencia</p>
        </div>
      </div>

      <GlassCard title={selectedAlumno ? "" : "Registro de Entrada"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!selectedAlumno ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Alumno</label>
              <StudentDropdown onSelect={setSelectedAlumno} selectedAlumno={selectedAlumno} />
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 animate-fade-up">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-magenta-400 to-yellow-400">
                  <div className="w-full h-full rounded-full bg-[#1f1342] flex items-center justify-center overflow-hidden">
                    <div className="w-16 h-16 bg-white rounded-full opacity-90 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#1f1342]">
                        {selectedAlumno.nombre.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1 right-1 w-6 h-6 bg-red-500 border-4 border-[#1f1342] rounded-full animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{selectedAlumno.nombre}</h2>
              <p className="text-sm text-cyan-400 font-medium mb-6">Estudiante</p>
              
              <button 
                type="button" 
                onClick={() => setSelectedAlumno(null)}
                className="text-xs text-gray-500 hover:text-white transition-colors underline decoration-dotted"
              >
                Cambiar de alumno
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Últimos 6 dígitos del DNI</label>
            <input
              type="text"
              maxLength={6}
              value={dniSuffix}
              onChange={(e) => setDniSuffix(e.target.value.replace(/\D/g, ''))}
              placeholder="Ej: 123456"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-white placeholder:text-gray-500"
            />
          </div>


          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center space-x-3 text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
              <Clock size={18} className="text-cyan-400" />
              <span className="text-sm font-mono">{currentTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
              <Calendar size={18} className="text-magenta-400" style={{ color: '#ff006e' }} />
              <span className="text-sm">{currentTime.toLocaleDateString('es-AR')}</span>
            </div>
          </div>

          {status === 'error' && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 animate-fade-up">
              <AlertCircle size={18} />
              <span className="text-sm">{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              status === 'submitting' 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:shadow-cyan-500/20'
            }`}
          >
            {status === 'submitting' ? 'Procesando...' : 'Confirmar Asistencia'}
          </button>
        </form>
      </GlassCard>

      <div className="text-center pb-8">
        <p className="text-xs text-gray-500">© 2026 UNNE - Tecno 1. Ventana de asistencia: 08:00 - 09:00 AM</p>
      </div>
    </div>
  );
}

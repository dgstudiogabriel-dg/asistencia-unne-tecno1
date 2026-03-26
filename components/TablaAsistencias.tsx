'use client';

import React, { useState } from 'react';
import { Asistencia } from '@/lib/db';
import { Edit2, Trash2, Check, X, Clock, AlertCircle } from 'lucide-react';

interface TablaAsistenciasProps {
  asistencias: Asistencia[];
  onUpdate: (id: string, updates: Partial<Asistencia>) => void;
  onDelete: (id: string) => void;
}

export function TablaAsistencias({ asistencias, onUpdate, onDelete }: TablaAsistenciasProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Asistencia>>({});

  const startEditing = (asistencia: Asistencia) => {
    setEditingId(asistencia.id);
    setEditValues({
      estadoEntrada: asistencia.estadoEntrada,
      entradaHora: asistencia.entradaHora,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editValues);
    setEditingId(null);
  };

  const isWindowMatch = (hora: string) => {
    const [h] = hora.split(':').map(Number);
    return h === 8; // Window 8:00 - 8:59 AM
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
          <tr>
            <th className="px-6 py-4 font-semibold">Alumno</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold">Hora Entrada</th>
            <th className="px-6 py-4 font-semibold">Fecha</th>
            <th className="px-6 py-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {asistencias.length > 0 ? (
            asistencias.map((asistencia) => (
              <tr 
                key={asistencia.id} 
                className={`group hover:bg-white/5 transition-colors ${isWindowMatch(asistencia.entradaHora) ? "bg-cyan-500/5" : ""}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-magenta-400 flex items-center justify-center text-[10px] font-bold">
                      {asistencia.alumnoNombre.split(',')[0].charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{asistencia.alumnoNombre}</div>
                      <div className="text-xs text-gray-500">{asistencia.alumnoDni}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingId === asistencia.id ? (
                    <select
                      value={editValues.estadoEntrada}
                      onChange={(e) => setEditValues({ ...editValues, estadoEntrada: e.target.value as any })}
                      className="bg-white/10 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Presente">Presente</option>
                      <option value="Tardío">Tardío</option>
                      <option value="Ausente">Ausente</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      asistencia.estadoEntrada === 'Presente' ? 'bg-green-500/20 text-green-400' :
                      asistencia.estadoEntrada === 'Tardío' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {asistencia.estadoEntrada}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                   {editingId === asistencia.id ? (
                    <input
                      type="text"
                      value={editValues.entradaHora}
                      onChange={(e) => setEditValues({ ...editValues, entradaHora: e.target.value })}
                      className="bg-white/10 border border-white/10 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:border-cyan-400"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Clock size={14} className={isWindowMatch(asistencia.entradaHora) ? "text-cyan-400" : "text-gray-500"} />
                      <span>{asistencia.entradaHora}</span>
                      {isWindowMatch(asistencia.entradaHora) && (
                        <span className="text-[10px] text-cyan-400 font-bold ml-1 px-1.5 py-0.5 border border-cyan-400/30 rounded">WINDOW</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{asistencia.entradaFecha}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {editingId === asistencia.id ? (
                      <>
                        <button onClick={() => saveEdit(asistencia.id)} className="p-1.5 hover:bg-green-500/20 rounded text-green-400 transition-colors">
                          <Check size={16} />
                        </button>
                        <button onClick={cancelEditing} className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-colors">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(asistencia)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(asistencia.id)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                No se registraron asistencias para el período seleccionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

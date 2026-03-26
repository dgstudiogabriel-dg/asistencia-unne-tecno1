'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { Alumno } from '@/lib/db';

interface StudentDropdownProps {
  onSelect: (alumno: Alumno) => void;
  selectedAlumno: Alumno | null;
}

export function StudentDropdown({ onSelect, selectedAlumno }: StudentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/alumnos')
      .then(res => res.json())
      .then(data => setAlumnos(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAlumnos = alumnos.filter(a =>
    a.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-left"
      >
        <span className={selectedAlumno ? "text-white" : "text-gray-400"}>
          {selectedAlumno ? selectedAlumno.nombre : "Selecciona tu nombre"}
        </span>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 glass-dropdown rounded-xl shadow-2xl overflow-hidden animate-fade-up">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar alumno..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400 text-sm"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredAlumnos.length > 0 ? (
              filteredAlumnos.map((alumno) => (
                <button
                  key={alumno.dni}
                  type="button"
                  onClick={() => {
                    onSelect(alumno);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 text-left text-sm transition-colors border-b border-white/5 last:border-none"
                >
                  <span>{alumno.nombre}</span>
                  {selectedAlumno?.dni === alumno.dni && <Check size={16} className="text-cyan-400" />}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">No se encontraron alumnos</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

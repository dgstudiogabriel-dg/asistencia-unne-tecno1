'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { GraficoAsistencias } from './GraficoAsistencias';
import { TablaAsistencias } from './TablaAsistencias';
import { Asistencia, Alumno } from '@/lib/db';
import { Download, Users, CheckCircle, Clock, XCircle, Search, RefreshCw, Activity, Zap } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

export function DashboardProfesor() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [filterDate, setFilterDate] = useState(new Date().toLocaleDateString('es-AR'));
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAsist, resAlum] = await Promise.all([
        fetch('/api/asistencias'),
        fetch('/api/alumnos')
      ]);
      const dataAsist = await resAsist.json();
      const dataAlum = await resAlum.json();
      setAsistencias(dataAsist);
      setAlumnos(dataAlum);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<Asistencia>) => {
    try {
      const res = await fetch('/api/asistencias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    try {
      const res = await fetch('/api/asistencias', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredAsistencias = asistencias.filter(a => a.entradaFecha === filterDate);
  
  // Stats
  const totalAlumnos = alumnos.length;
  const presentes = filteredAsistencias.filter(a => a.estadoEntrada === 'Presente').length;
  const tardios = filteredAsistencias.filter(a => a.estadoEntrada === 'Tardío').length;
  const ausentesCount = totalAlumnos - (presentes + tardios);

  const stats = [
    { label: 'Total Alumnos', value: totalAlumnos, icon: Users, color: 'text-cyan-400' },
    { label: 'Presentes', value: presentes, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Tardíos', value: tardios, icon: Clock, color: 'text-yellow-400' },
    { label: 'Ausentes', value: ausentesCount, icon: XCircle, color: 'text-red-400' },
  ];

  const exportCSV = () => {
    const headers = ['Alumno', 'DNI', 'Fecha', 'Hora', 'Estado'];
    const rows = filteredAsistencias.map(a => [
      a.alumnoNombre,
      a.alumnoDni,
      a.entradaFecha,
      a.entradaHora,
      a.estadoEntrada
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `asistencias_tecno1_${filterDate.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard Profesor</h1>
          <p className="text-gray-400 mt-1">Gestión de asistencias - Tecnología Gráfica I_2026</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-cyan-400 transition-colors" size={18} />
            <input
              type="text"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="dd/mm/aaaa"
              className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm w-44"
            />
          </div>
          <button
            onClick={fetchData}
            className="p-2.5 glass hover:bg-white/10 rounded-xl transition-all"
            title="Refrescar datos"
          >
            <RefreshCw size={20} className={loading ? "animate-spin text-cyan-400" : ""} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-orange-yellow rounded-xl font-bold text-black text-sm hover:shadow-lg hover:shadow-orange-500/20 transition-all transform hover:scale-[1.02]"
          >
            <Download size={18} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="flex items-center space-x-4 p-6 sm:p-6">
            <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-0.5">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <GlassCard className="lg:col-span-2" title="Flujo de Ingresos (Hoy)">
          <GraficoAsistencias asistencias={asistencias} />
        </GlassCard>

        {/* Info Card - Circular Gauges */}
        <GlassCard title="Estadísticas de Hoy">
          <div className="flex flex-wrap justify-around gap-8 py-6">
            <CircularProgress 
              value={Math.round((presentes/totalAlumnos)*100) || 0} 
              label="Presentismo" 
              color="#00d9ff" 
            />
            <CircularProgress 
              value={Math.round((tardios/totalAlumnos)*100) || 0} 
              label="Tardanza" 
              color="#ff006e" 
            />
            <CircularProgress 
              value={Math.round((ausentesCount/totalAlumnos)*100) || 0} 
              label="Ausencia" 
              color="#ff8c42" 
            />
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-400/20 text-cyan-400">
                  <Activity size={18} />
                </div>
                <span className="text-sm font-medium text-gray-300">Rendimiento</span>
              </div>
              <span className="text-sm font-bold text-white">Excelente</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-yellow-400/20 text-yellow-400">
                  <Zap size={18} />
                </div>
                <span className="text-sm font-medium text-gray-300">Actividad</span>
              </div>
              <span className="text-sm font-bold text-white">Alta</span>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Main Table */}
      <GlassCard title="Lista de Asistencia Detallada">
        <TablaAsistencias 
          asistencias={filteredAsistencias} 
          onUpdate={handleUpdate} 
          onDelete={handleDelete} 
        />
      </GlassCard>

      <div className="text-center pb-8">
        <p className="text-xs text-gray-600">FAU UNNE - Tecno 1 Admin Panel. Mostrando datos para {filterDate}</p>
      </div>
    </div>
  );
}

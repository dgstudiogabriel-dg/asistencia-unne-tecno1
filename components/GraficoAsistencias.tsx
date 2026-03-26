'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Asistencia } from '@/lib/db';

interface GraficoAsistenciasProps {
  asistencias: Asistencia[];
}

export function GraficoAsistencias({ asistencias }: GraficoAsistenciasProps) {
  // Aggregate data by hour for today
  const today = new Date().toLocaleDateString('es-AR');
  const hourlyData: { [key: string]: number } = {};
  
  // Initialize 8 AM to 12 PM slots
  for (let i = 8; i <= 12; i++) {
    hourlyData[`${i}:00`] = 0;
  }

  asistencias
    .filter(a => a.entradaFecha === today)
    .forEach(a => {
      const hour = a.entradaHora.split(':')[0];
      const slot = `${parseInt(hour)}:00`;
      if (hourlyData[slot] !== undefined) {
        hourlyData[slot]++;
      }
    });

  const data = Object.entries(hourlyData).map(([hour, count]) => ({
    hour,
    cantidad: count,
  }));

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00d9ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="hour" 
            stroke="#6b6b7a" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#6b6b7a" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(26, 15, 61, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}
            itemStyle={{ color: '#00d9ff' }}
          />
          <Area 
            type="monotone" 
            dataKey="cantidad" 
            stroke="#00d9ff" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCount)" 
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function QRCodeGenerator() {
  const qrRef = useRef<SVGSVGElement>(null);
  
  // In a real app, this would be the deployed URL.
  // We'll use a placeholder or relative URL.
  const appUrl = (typeof window !== 'undefined') ? window.location.origin : 'https://asistencia-tecno1.unne.edu.ar';

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'QR_Asistencia_Tecno1.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <GlassCard className="flex flex-col items-center space-y-6 max-w-sm mx-auto p-12 text-center" title="Código QR Estático">
      <div className="p-6 bg-white rounded-[32px] shadow-2xl">
        <QRCodeSVG
          ref={qrRef}
          value={appUrl}
          size={240}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: 'https://via.placeholder.com/60?text=UNNE', // Placeholder logo
            x: undefined,
            y: undefined,
            height: 48,
            width: 48,
            excavate: true,
          }}
        />
      </div>
      
      <div className="space-y-4 w-full">
        <p className="text-sm text-gray-400">
          Este QR es válido para todo el cuatrimestre.<br/>
          Los alumnos deben escanearlo para registrar su asistencia.
        </p>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={downloadQR}
            className="flex items-center justify-center space-x-2 w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-black font-bold transition-all"
          >
            <Download size={18} />
            <span>Descargar PNG (1000px)</span>
          </button>
          
          <button
            onClick={() => navigator.clipboard.writeText(appUrl)}
            className="flex items-center justify-center space-x-2 w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white text-sm transition-all"
          >
            <Share2 size={16} />
            <span>Copiar Link Directo</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

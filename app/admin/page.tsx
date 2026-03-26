import { DashboardProfesor } from "@/components/DashboardProfesor";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";

export default function AdminPage() {
  return (
    <main className="space-y-12">
      <DashboardProfesor />
      
      <section className="bg-black/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Generador de QR Académico</h2>
            <p className="text-gray-400">Descarga el código QR para proyectar en clase o imprimir. Los alumnos serán redirigidos al formulario de asistencia con este enlace único.</p>
          </div>
          <QRCodeGenerator />
        </div>
      </section>
    </main>
  );
}

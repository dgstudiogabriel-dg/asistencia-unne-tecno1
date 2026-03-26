/**
 * INSTRUCCIONES:
 * 1. Abre un Google Sheet nuevo.
 * 2. Ve a "Extensiones" > "Apps Script".
 * 3. Pega este código y guarda.
 * 4. Haz clic en "Implementar" > "Nueva implementación".
 * 5. Tipo: "Aplicación Web".
 * 6. Acceso: "Cualquier persona" (Esto es clave para que Next.js pueda escribir).
 * 7. Copia la URL de la aplicación web y pégala en tu archivo .env.local como GOOGLE_SHEETS_URL.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si la hoja está vacía, agregar encabezados
    if (sheet.getLastRow() == 0) {
      sheet.appendRow(["ID", "Alumno", "DNI", "Fecha", "Hora", "Estado"]);
    }
    
    // Agregar la fila de asistencia
    sheet.appendRow([
      data.id || "",
      data.alumnoNombre,
      data.alumnoDni,
      data.entradaFecha,
      data.entradaHora,
      data.estadoEntrada
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (f) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": f.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Servicio de Asistencia UNNE Activo.");
}

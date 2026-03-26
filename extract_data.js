const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbook = XLSX.readFile('Detalle de inscripción a cursada 2026.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Let's inspect the first row to map columns correctly
console.log('Sample Data Row:', data[0]);

// Map to: Alumno, Identificación (DNI), Email
const mappedData = data.map(item => {
    let nombre = item['Alumno'] || item['Apellido y Nombre'] || item['Nombre'];
    let dniRaw = String(item['Identificación'] || item['Documento'] || item['DNI'] || '');
    let emailRaw = item['Email'] || item['E-mail'] || item['Correo'] || '';

    // Clean DNI: Remove 'DNI ' prefix and spaces
    let dni = dniRaw.replace(/DNI\s*/i, '').replace(/\s/g, '');
    
    // Clean Email: Remove 'Email Principal: ' prefix
    let email = emailRaw.replace(/Email Principal:\s*/i, '').trim();

    return { nombre, dni, email };
}).filter(item => item.nombre && item.dni);


if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

fs.writeFileSync('data/alumnos.json', JSON.stringify(mappedData, null, 2));
console.log(`Extracted ${mappedData.length} students to data/alumnos.json`);

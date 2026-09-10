/* ============ BASE DE DATOS COMPARTIDA DE SOCIOS ============
   Usada por mockup2.js (panel interno) y perfil.html (landing pública).
   En la versión real esto vendría de la base de datos, no de un archivo estático. */

const SOCIOS_DB = {
  "juan-perez": {
    slug: "juan-perez",
    nombre: "Juan Pérez",
    email: "juan@tramitesjp.com",
    telefono: "300 123 4567",
    ciudad: "Bucaramanga",
    negocio: "Trámites JP",
    descripcion: "Especialistas en trámites de tránsito con más de 10 años de experiencia en el Área Metropolitana.",
    servicios: [
      { id: 1, nombre: "Traspaso de vehículo", precio: "Desde $150.000" },
      { id: 2, nombre: "Matrícula inicial", precio: "Desde $180.000" },
      { id: 3, nombre: "Duplicado de tarjeta", precio: "Desde $90.000" }
    ],
    redes: { facebook: "fb.com/tramitesjp", instagram: "@tramitesjp", whatsapp: "3001234567" },
    sedes: [
      { id: 1, nombre: "Sede Centro", dir: "Cra 15 #34-12, Bucaramanga", horario: "8am - 5pm" },
      { id: 2, nombre: "Sede Cabecera", dir: "Cl 45 #27-08, Bucaramanga", horario: "8am - 6pm" }
    ]
  }
};

if (typeof window !== 'undefined') window.SOCIOS_DB = SOCIOS_DB;

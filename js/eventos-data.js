/* ============ EVENTOS Y ENCUENTROS — DATOS COMPARTIDOS ============
   Usado por mockup2.js (panel de administración, donde se publican) y mockup1.js
   (portal público, donde se muestran). Persiste en localStorage para simular que
   lo publicado en el panel afecta la página pública, incluso en otra pestaña o
   tras recargar — en la versión real esto vendría de una base de datos, no del
   almacenamiento del navegador. */

const EVENTOS_STORAGE_KEY = 'asotransito_eventos_v1';

const EVENTOS_INICIALES = [
  {
    id: 1,
    titulo: "Encuentro Regional de Tramitadores 2025",
    categoria: "Encuentro",
    autor: "Administrador",
    fecha: "15/03/2025",
    vistas: 120,
    texto: "Más de 80 socios se reunieron para discutir nuevas normativas del RUNT y las mejoras del gremio.",
    imagenes: [
      "https://picsum.photos/seed/asotransito-encuentro-1/640/420",
      "https://picsum.photos/seed/asotransito-encuentro-2/640/420",
      "https://picsum.photos/seed/asotransito-encuentro-3/640/420"
    ],
    video: "",
    link: ""
  },
  {
    id: 2,
    titulo: "Capacitación Virtual sobre RUNT 2.0",
    categoria: "Capacitación",
    autor: "Administrador",
    fecha: "02/02/2025",
    vistas: 89,
    texto: "Jornada de formación para socios sobre las nuevas actualizaciones del sistema y buenas prácticas.",
    imagenes: [
      "https://picsum.photos/seed/asotransito-capacitacion-1/640/420"
    ],
    video: "",
    link: ""
  },
  {
    id: 3,
    titulo: "Asamblea General Ordinaria 2025",
    categoria: "Asamblea",
    autor: "Administrador",
    fecha: "20/01/2025",
    vistas: 145,
    texto: "Rendición de cuentas, elección de junta directiva y presentación del plan estratégico anual.",
    imagenes: [
      "https://picsum.photos/seed/asotransito-asamblea-1/640/420",
      "https://picsum.photos/seed/asotransito-asamblea-2/640/420"
    ],
    video: "",
    link: ""
  }
];

function cargarEventos() {
  try {
    const guardado = localStorage.getItem(EVENTOS_STORAGE_KEY);
    if (guardado) return JSON.parse(guardado);
  } catch (e) { /* localStorage no disponible o dato corrupto: se usa el valor inicial */ }
  guardarEventos(EVENTOS_INICIALES);
  return EVENTOS_INICIALES.slice();
}

function guardarEventos(lista) {
  try {
    localStorage.setItem(EVENTOS_STORAGE_KEY, JSON.stringify(lista));
  } catch (e) { /* almacenamiento lleno o bloqueado: los cambios solo viven en esta sesión */ }
}

if (typeof window !== 'undefined') {
  window.cargarEventos = cargarEventos;
  window.guardarEventos = guardarEventos;
}

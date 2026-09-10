/* ============ CONFIGURACIÓN ============ */
const WHATSAPP_ASOCIACION = "573193053012"; // +57 319 305 3012 (sin + ni espacios)

/* ============ DATOS SIMULADOS ============ */
const socios = [
  {
    id: 1, nombre: "Juan Pérez", negocio: "Trámites JP",
    ciudad: "Bucaramanga", rating: 4.8,
    tramites: ["Traspaso", "Matrícula", "Duplicados"],
    telefono: "300 123 4567",
    email: "juan@tramitesjp.com",
    redes: { facebook: "fb.com/tramitesjp", instagram: "@tramitesjp" },
    sedes: [
      { nombre: "Sede Centro", dir: "Cra 15 #34-12, Bucaramanga", horario: "8am - 5pm" },
      { nombre: "Sede Cabecera", dir: "Cl 45 #27-08, Bucaramanga", horario: "8am - 6pm" }
    ]
  },
  {
    id: 2, nombre: "María Gómez", negocio: "Gestoría MG",
    ciudad: "Floridablanca", rating: 4.9,
    tramites: ["Traspaso", "Licencia", "Comparendos"],
    telefono: "315 987 6543",
    email: "maria@gestoriamg.co",
    redes: { facebook: "fb.com/gestoriamg", instagram: "@gestoriamg" },
    sedes: [{ nombre: "Sede Principal", dir: "Cra 8 #12-45, Floridablanca", horario: "8am - 5pm" }]
  },
  {
    id: 3, nombre: "Carlos Ruiz", negocio: "AutoTrámites CR",
    ciudad: "Girón", rating: 4.7,
    tramites: ["Matrícula", "Comparendos"],
    telefono: "320 555 1212",
    email: "carlos@autotramites.com",
    redes: { facebook: "fb.com/autotramites", instagram: "@autotramitescr" },
    sedes: [{ nombre: "Sede Girón", dir: "Cl 30 #22-10, Girón", horario: "9am - 6pm" }]
  },
  {
    id: 4, nombre: "Ana Martínez", negocio: "Soluciones Viales AM",
    ciudad: "Piedecuesta", rating: 5.0,
    tramites: ["Traspaso", "Matrícula", "Licencia"],
    telefono: "317 444 8899",
    email: "ana@solucionesviales.co",
    redes: { facebook: "fb.com/solucionesviales", instagram: "@solucionesviales" },
    sedes: [
      { nombre: "Sede Norte", dir: "Cra 6 #8-20, Piedecuesta", horario: "8am - 5pm" },
      { nombre: "Sede Centro", dir: "Cl 12 #5-30, Piedecuesta", horario: "9am - 4pm" }
    ]
  },
  {
    id: 5, nombre: "Luis Rodríguez", negocio: "Trámites LR Express",
    ciudad: "Bucaramanga", rating: 4.6,
    tramites: ["Traspaso", "Comparendos"],
    telefono: "310 777 2233",
    email: "luis@lrexpress.com",
    redes: { facebook: "fb.com/lrexpress", instagram: "@lrexpress" },
    sedes: [{ nombre: "Sede Centro", dir: "Cl 35 #18-22, Bucaramanga", horario: "8am - 5pm" }]
  },
  {
    id: 6, nombre: "Paola Herrera", negocio: "Asesoría Vial PH",
    ciudad: "Floridablanca", rating: 4.9,
    tramites: ["Matrícula", "Licencia", "Duplicados"],
    telefono: "318 222 4455",
    email: "paola@asesoriavh.co",
    redes: { facebook: "fb.com/asesoriavh", instagram: "@asesoriavh" },
    sedes: [{ nombre: "Sede Cañaveral", dir: "Cl 30 #21-15, Floridablanca", horario: "8am - 6pm" }]
  }
];

/* ============ FILTROS ACTIVOS ============ */
let filtrosActivos = { ciudad: '', tramite: '', texto: '' };

/* ============ WHATSAPP INSTITUCIONAL ============ */
function generarMensajeWhatsApp(socio, tramitePersonalizado = null) {
  const tramite = tramitePersonalizado || filtrosActivos.tramite || socio.tramites[0];
  const ciudad = filtrosActivos.ciudad || socio.ciudad;

  const mensaje =
    `Hola buen día, vengo desde la página web de ASOTRÁNSITO AMB. 👋\n\n` +
    `📋 Estoy interesado(a) en el trámite de: *${tramite}*\n` +
    `📍 Ciudad: *${ciudad}*\n` +
    `👤 Quisiera contactar al socio: *${socio.nombre}* (${socio.negocio})\n\n` +
    `¿Me podrían ayudar, por favor?`;

  return `https://wa.me/${WHATSAPP_ASOCIACION}?text=${encodeURIComponent(mensaje)}`;
}

function abrirWhatsApp(e, socioId, tramite = null) {
  if (e) e.stopPropagation();
  const socio = socios.find(s => s.id === socioId);
  if (!socio) return;
  window.open(generarMensajeWhatsApp(socio, tramite), '_blank');
}

/* ============ AVATAR ============ */
function avatarUrl(nombre) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=0a7d3e&color=fff&size=300&bold=true&font-size=0.4`;
}

/* ============ RENDER CARDS ============ */
function renderSocios(lista) {
  const grid = document.getElementById('gridSocios');
  const sin = document.getElementById('sinResultados');
  const contador = document.getElementById('contadorResultados');

  contador.textContent = `${lista.length} socio${lista.length !== 1 ? 's' : ''}`;

  if (lista.length === 0) {
    grid.innerHTML = '';
    sin.style.display = 'block';
    return;
  }
  sin.style.display = 'none';

  grid.innerHTML = lista.map(s => `
    <article class="card-socio" onclick="abrirModal(${s.id})">
      <div class="card-socio-img" style="background-image: url('${avatarUrl(s.nombre)}');">
        <span class="card-ciudad"><i class="fa-solid fa-location-dot"></i> ${s.ciudad}</span>
        <span class="card-verified" title="Socio verificado"><i class="fa-solid fa-check"></i></span>
        <span class="card-rating"><i class="fa-solid fa-star"></i> ${s.rating}</span>
      </div>
      <div class="card-socio-body">
        <h3>${s.nombre}</h3>
        <p class="card-socio-negocio">${s.negocio}</p>
        <div class="card-tramites">
          ${s.tramites.slice(0, 3).map(t => `<span class="badge badge-green">${t}</span>`).join('')}
        </div>
        <div class="card-info">
          <span><i class="fa-solid fa-building"></i> ${s.sedes.length} sede${s.sedes.length !== 1 ? 's' : ''}</span>
          <span><i class="fa-solid fa-phone"></i> ${s.telefono}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); abrirModal(${s.id})">
            <i class="fa-solid fa-eye"></i> Ver
          </button>
          <button class="btn btn-whatsapp btn-sm" onclick="abrirWhatsApp(event, ${s.id})">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

/* ============ FILTROS ============ */
function filtrar() {
  filtrosActivos.ciudad = document.getElementById('filtroCiudad').value;
  filtrosActivos.tramite = document.getElementById('filtroTramite').value;
  filtrosActivos.texto = document.getElementById('filtroTexto').value.toLowerCase();

  const filtrados = socios.filter(s => {
    const okCiudad = !filtrosActivos.ciudad || s.ciudad === filtrosActivos.ciudad;
    const okTramite = !filtrosActivos.tramite || s.tramites.includes(filtrosActivos.tramite);
    const okTexto = !filtrosActivos.texto
      || s.nombre.toLowerCase().includes(filtrosActivos.texto)
      || s.negocio.toLowerCase().includes(filtrosActivos.texto);
    return okCiudad && okTramite && okTexto;
  });

  renderSocios(filtrados);
}

/* ============ MODAL ============ */
function abrirModal(id) {
  const s = socios.find(x => x.id === id);
  if (!s) return;

  const tramiteSugerido = filtrosActivos.tramite || s.tramites[0];
  const ciudadSugerida = filtrosActivos.ciudad || s.ciudad;

  document.getElementById('modalContenido').innerHTML = `
    <div class="modal-hero" style="background-image: url('${avatarUrl(s.nombre)}');">
      <button class="modal-close" onclick="cerrarModal()" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-hero-info">
        <h2>${s.nombre}</h2>
        <p>${s.negocio} · ${s.ciudad}</p>
      </div>
    </div>

    <div class="modal-body">
      <div class="modal-quick-actions">
        <a href="tel:${s.telefono}" class="quick-btn">
          <i class="fa-solid fa-phone"></i>
          <span>Llamar</span>
        </a>
        <a href="mailto:${s.email}" class="quick-btn">
          <i class="fa-solid fa-envelope"></i>
          <span>Email</span>
        </a>
        <a href="https://${s.redes.facebook}" target="_blank" rel="noopener" class="quick-btn">
          <i class="fa-brands fa-facebook"></i>
          <span>Facebook</span>
        </a>
        <a href="https://instagram.com/${s.redes.instagram.replace('@','')}" target="_blank" rel="noopener" class="quick-btn">
          <i class="fa-brands fa-instagram"></i>
          <span>Instagram</span>
        </a>
      </div>

      <div class="modal-section">
        <h3><i class="fa-solid fa-screwdriver-wrench"></i> Servicios ofrecidos</h3>
        <div class="card-tramites">
          ${s.tramites.map(t => `<span class="badge badge-green">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h3><i class="fa-solid fa-location-dot"></i> Sedes (${s.sedes.length})</h3>
        ${s.sedes.map(sd => `
          <div class="sede-item">
            <i class="fa-solid fa-building"></i>
            <div>
              <strong>${sd.nombre}</strong>
              <small>${sd.dir}</small><br>
              <small><i class="fa-regular fa-clock"></i> ${sd.horario}</small>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="modal-section whatsapp-box">
        <h3><i class="fa-brands fa-whatsapp" style="color:var(--accent-dark);"></i> Contactar por WhatsApp</h3>
        <p class="wa-help">
          <i class="fa-solid fa-circle-info"></i>
          Tu mensaje se enviará a la línea oficial de la asociación.
          Allí lo dirigirán directamente a <b>${s.nombre}</b>.
        </p>

        <div class="wa-preview">
          <label>Trámite de interés</label>
          <select id="waTramite">
            ${s.tramites.map(t => `<option ${t === tramiteSugerido ? 'selected' : ''}>${t}</option>`).join('')}
          </select>

          <label>Ciudad</label>
          <input id="waCiudad" type="text" value="${ciudadSugerida}">

          <div class="wa-message-preview">
            <i class="fa-solid fa-comment-dots"></i>
            <p id="waPreviewText"></p>
          </div>
        </div>

        <button class="btn btn-whatsapp btn-block"
                onclick="abrirWhatsApp(event, ${s.id}, document.getElementById('waTramite').value)">
          <i class="fa-brands fa-whatsapp"></i> Enviar solicitud a la central
        </button>
      </div>
    </div>
  `;

  const actualizarPreview = () => {
    const tramite = document.getElementById('waTramite').value;
    const ciudad = document.getElementById('waCiudad').value;
    document.getElementById('waPreviewText').textContent =
      `Hola buen día, vengo desde la página web de ASOTRÁNSITO AMB. 👋 Estoy interesado(a) en el trámite de ${tramite} en la ciudad de ${ciudad}. Quisiera contactar al socio ${s.nombre} (${s.negocio}). ¿Me podrían ayudar, por favor?`;
  };
  document.getElementById('waTramite').addEventListener('change', actualizarPreview);
  document.getElementById('waCiudad').addEventListener('input', actualizarPreview);
  actualizarPreview();

  document.getElementById('modalSocio').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modalSocio').classList.remove('active');
  document.body.style.overflow = '';
}

/* ============ EVENTOS ============ */
document.getElementById('btnBuscar').addEventListener('click', filtrar);
document.getElementById('filtroCiudad').addEventListener('change', filtrar);
document.getElementById('filtroTramite').addEventListener('change', filtrar);
document.getElementById('filtroTexto').addEventListener('input', filtrar);

document.getElementById('modalSocio').addEventListener('click', e => {
  if (e.target.id === 'modalSocio') cerrarModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarModal();
});

/* ============ INIT ============ */
renderSocios(socios);
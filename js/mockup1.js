/* ============ CONFIGURACIÓN ============ */
const WHATSAPP_ASOCIACION = "573193053012"; // +57 319 305 3012 (sin + ni espacios)

/* ============ DATOS SIMULADOS ============ */
const socios = [
  {
    id: 1, nombre: "Juan Pérez", negocio: "Trámites JP",
    ciudad: "Bucaramanga",
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
    ciudad: "Floridablanca",
    tramites: ["Traspaso", "Licencia", "Comparendos"],
    telefono: "315 987 6543",
    email: "maria@gestoriamg.co",
    redes: { facebook: "fb.com/gestoriamg", instagram: "@gestoriamg" },
    sedes: [{ nombre: "Sede Principal", dir: "Cra 8 #12-45, Floridablanca", horario: "8am - 5pm" }]
  },
  {
    id: 3, nombre: "Carlos Ruiz", negocio: "AutoTrámites CR",
    ciudad: "Girón",
    tramites: ["Matrícula", "Comparendos"],
    telefono: "320 555 1212",
    email: "carlos@autotramites.com",
    redes: { facebook: "fb.com/autotramites", instagram: "@autotramitescr" },
    sedes: [{ nombre: "Sede Girón", dir: "Cl 30 #22-10, Girón", horario: "9am - 6pm" }]
  },
  {
    id: 4, nombre: "Ana Martínez", negocio: "Soluciones Viales AM",
    ciudad: "Piedecuesta",
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
    ciudad: "Bucaramanga",
    tramites: ["Traspaso", "Comparendos"],
    telefono: "310 777 2233",
    email: "luis@lrexpress.com",
    redes: { facebook: "fb.com/lrexpress", instagram: "@lrexpress" },
    sedes: [{ nombre: "Sede Centro", dir: "Cl 35 #18-22, Bucaramanga", horario: "8am - 5pm" }]
  },
  {
    id: 6, nombre: "Paola Herrera", negocio: "Asesoría Vial PH",
    ciudad: "Floridablanca",
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

/* ============ MAPA DE GOOGLE (embed público por dirección, sin API key) ============ */
function mapaEmbedUrl(direccion) {
  return `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;
}
function mapaSedeHTML(direccion) {
  return `
    <div class="mapa-sede">
      <iframe src="${mapaEmbedUrl(direccion)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Ubicación: ${direccion}"></iframe>
    </div>
  `;
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
          <div class="sede-item" style="flex-direction:column;align-items:stretch;">
            <div style="display:flex;gap:14px;align-items:flex-start;">
              <i class="fa-solid fa-building"></i>
              <div>
                <strong>${sd.nombre}</strong>
                <small>${sd.dir}</small><br>
                <small><i class="fa-regular fa-clock"></i> ${sd.horario}</small>
              </div>
            </div>
            ${mapaSedeHTML(sd.dir)}
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
  if (e.key !== 'Escape') return;
  cerrarModal();
  cerrarModalEvento();
});

/* ============ BANNER DE NOTICIAS DE TRÁNSITO Y MOVILIDAD ============
   Fuente: Google News RSS (público, sin API key) filtrado por Colombia + tránsito/movilidad,
   convertido a JSON vía rss2json.com (capa gratuita) para poder consumirlo desde el navegador
   sin backend propio — compatible con hosting estático (GitHub Pages). */
const NOTICIAS_RSS_URL = 'https://news.google.com/rss/search?q=transito%20movilidad%20Colombia&hl=es-419';
const NOTICIAS_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(NOTICIAS_RSS_URL)}`;

function formatearFechaNoticia(fechaISO) {
  const d = new Date(fechaISO);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

async function cargarNoticiasTransito() {
  const track = document.getElementById('noticiasTrack');
  if (!track) return;
  try {
    const res = await fetch(NOTICIAS_API);
    if (!res.ok) throw new Error('Respuesta no válida del servicio de noticias');
    const data = await res.json();
    if (data.status !== 'ok' || !data.items || !data.items.length) throw new Error('Sin noticias disponibles');

    track.innerHTML = data.items.slice(0, 8).map(item => `
      <a class="noticia-card" href="${item.link}" target="_blank" rel="noopener noreferrer">
        <span class="noticia-fuente"><i class="fa-solid fa-satellite-dish"></i> ${(item.author || 'Noticias Colombia')}</span>
        <h3>${item.title}</h3>
        <span class="noticia-fecha"><i class="fa-regular fa-calendar"></i> ${formatearFechaNoticia(item.pubDate)}</span>
      </a>
    `).join('');
  } catch (err) {
    track.innerHTML = `<p class="noticias-error"><i class="fa-solid fa-circle-info"></i> No se pudieron cargar las noticias en este momento. Intenta recargar la página.</p>`;
  }
}

/* ============ EVENTOS Y ENCUENTROS ============
   Los datos vienen de js/eventos-data.js (cargarEventos), publicados desde el panel
   de administración — lo que el admin publica ahí aparece aquí automáticamente. */
function renderEventos() {
  const grid = document.getElementById('gridEventos');
  if (!grid) return;
  const eventos = cargarEventos();

  if (!eventos.length) {
    grid.innerHTML = '<p class="sin-resultados"><i class="fa-solid fa-circle-info"></i> Aún no hay eventos publicados.</p>';
    return;
  }

  grid.innerHTML = eventos.map((e, idx) => {
    const fotos = e.imagenes && e.imagenes.length ? e.imagenes : null;
    return `
    <article class="blog-card" onclick="abrirModalEvento(${e.id})">
      <div class="blog-img-carrusel" data-evento-idx="${idx}">
        ${fotos ? `
          <div class="carrusel-track">
            ${fotos.map(url => `<img src="${url}" alt="" loading="lazy">`).join('')}
          </div>
          ${fotos.length > 1 ? `
            <button class="carrusel-btn carrusel-prev" onclick="moverCarrusel(event, ${idx}, -1)" aria-label="Foto anterior"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="carrusel-btn carrusel-next" onclick="moverCarrusel(event, ${idx}, 1)" aria-label="Foto siguiente"><i class="fa-solid fa-chevron-right"></i></button>
            <div class="carrusel-dots">${fotos.map((_, i) => `<span class="carrusel-dot ${i === 0 ? 'active' : ''}"></span>`).join('')}</div>
          ` : ''}
        ` : `<div class="blog-img" style="background: linear-gradient(135deg,#0a7d3e,#05602c);"><i class="fa-solid fa-calendar-check"></i></div>`}
      </div>
      <div class="blog-body">
        <span class="badge badge-orange">${e.categoria || 'Noticia'}</span>
        <h3>${e.titulo}</h3>
        <p>${e.texto || ''}</p>
        <span class="blog-date"><i class="fa-regular fa-calendar"></i> ${e.fecha}</span>
      </div>
    </article>
  `;
  }).join('');
}

function moverCarrusel(evt, idx, direccion) {
  evt.stopPropagation();
  const carrusel = document.querySelector(`.blog-img-carrusel[data-evento-idx="${idx}"]`);
  if (!carrusel) return;
  const track = carrusel.querySelector('.carrusel-track');
  const dots = carrusel.querySelectorAll('.carrusel-dot');
  const total = dots.length;
  let actual = parseInt(carrusel.dataset.pos || '0', 10);
  actual = (actual + direccion + total) % total;
  carrusel.dataset.pos = actual;
  track.style.transform = `translateX(-${actual * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === actual));
}

function abrirModalEvento(id) {
  const eventos = cargarEventos();
  const e = eventos.find(x => x.id === id);
  if (!e) return;

  e.vistas = (e.vistas || 0) + 1;
  guardarEventos(eventos);

  const fotos = e.imagenes && e.imagenes.length ? e.imagenes : [];

  document.getElementById('modalEventoContenido').innerHTML = `
    ${fotos.length ? `
      <div class="modal-hero modal-hero-galeria">
        <button class="modal-close" onclick="cerrarModalEvento()" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
        <img src="${fotos[0]}" alt="" id="modalEventoImgPrincipal">
      </div>
      ${fotos.length > 1 ? `
        <div class="modal-galeria-thumbs">
          ${fotos.map((url, i) => `<img src="${url}" alt="" class="${i === 0 ? 'active' : ''}" onclick="cambiarFotoModal('${url}', this)">`).join('')}
        </div>
      ` : ''}
    ` : `
      <div class="modal-hero" style="background:linear-gradient(135deg,#0a7d3e,#05602c);">
        <button class="modal-close" onclick="cerrarModalEvento()" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `}

    <div class="modal-body">
      <span class="badge badge-orange">${e.categoria || 'Noticia'}</span>
      <h2 style="margin:12px 0 6px;">${e.titulo}</h2>
      <span class="blog-date"><i class="fa-regular fa-calendar"></i> ${e.fecha} · Por ${e.autor} · 👁 ${e.vistas} vistas</span>
      <p style="margin-top:16px; color:var(--gray); line-height:1.6;">${e.texto || ''}</p>
      ${e.video ? `<p style="margin-top:14px;"><a href="${e.video}" target="_blank" class="btn btn-outline btn-sm"><i class="fa-solid fa-circle-play"></i> Ver video</a></p>` : ''}
      ${e.link ? `<p style="margin-top:10px;"><a href="${e.link}" target="_blank" class="btn btn-outline btn-sm"><i class="fa-solid fa-link"></i> Enlace relacionado</a></p>` : ''}
    </div>
  `;

  document.getElementById('modalEvento').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cambiarFotoModal(url, thumbEl) {
  document.getElementById('modalEventoImgPrincipal').src = url;
  thumbEl.parentElement.querySelectorAll('img').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
}

function cerrarModalEvento() {
  document.getElementById('modalEvento').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modalEvento').addEventListener('click', e => {
  if (e.target.id === 'modalEvento') cerrarModalEvento();
});

/* ============ INIT ============ */
renderSocios(socios);
renderEventos();
cargarNoticiasTransito();
/* ============ ESTADO ============ */
/* SOCIOS_DB viene de js/socios-data.js (compartido con perfil.html) */
let usuarioActual = null;

/* Slug del socio que ha iniciado sesión (usado para su link público) */
const SOCIO_SLUG = 'juan-perez';
const datosSocio = SOCIOS_DB[SOCIO_SLUG];

const usuariosAdmin = [
  { nombre: "Juan Pérez", email: "juan@tramitesjp.com", estado: "Activo" },
  { nombre: "María Gómez", email: "maria@gestoriamg.co", estado: "Activo" },
  { nombre: "Carlos Ruiz", email: "carlos@autotramites.com", estado: "Pendiente" },
  { nombre: "Ana Martínez", email: "ana@solucionesviales.co", estado: "Activo" }
];

/* Eventos y Encuentros: viven en js/eventos-data.js (cargarEventos/guardarEventos),
   persistidos en localStorage para que lo publicado aquí se refleje en el portal público. */
let nextServicioId = 4;
let nextSedeId = 3;

/* Clientes y cotizaciones: cada cuenta (admin o socio) tiene su propia base privada,
   sin vista consolidada entre cuentas — ni el admin ve los clientes de los socios. */
const clientesPorUsuario = {
  socio: [
    { id: 1, nombre: "Laura Ramírez", telefono: "3012223344", interes: "Traspaso de vehículo", notas: "Contactó por Instagram", fecha: "28/02/2025" },
    { id: 2, nombre: "Pedro Suárez", telefono: "3187654321", interes: "Matrícula inicial", notas: "", fecha: "10/03/2025" }
  ],
  admin: []
};
const cotizacionesPorUsuario = { socio: [], admin: [] };
let nextClienteId = 3;
let nextCotizacionId = 1;
let itemsCotizacionActual = [];

function clientesDB_() { return clientesPorUsuario[usuarioActual] || (clientesPorUsuario[usuarioActual] = []); }
function cotizacionesDB_() { return cotizacionesPorUsuario[usuarioActual] || (cotizacionesPorUsuario[usuarioActual] = []); }

/* ============ LOGIN ============ */
const credenciales = { admin: 'admin123', socio: 'socio123' };

function login(e) {
  e.preventDefault();
  const u = document.getElementById('usuario').value.trim().toLowerCase();
  const p = document.getElementById('password').value.trim();

  if (!['admin', 'socio'].includes(u)) {
    alert('Usa "admin" o "socio" como usuario');
    return false;
  }
  if (credenciales[u] !== p) {
    alert(`Contraseña incorrecta. Usa "${credenciales[u]}" para el usuario "${u}"`);
    return false;
  }
  usuarioActual = u;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  const nombre = u === 'admin' ? 'Administrador' : 'Juan Pérez';
  document.getElementById('nombreTop').textContent = nombre;
  document.getElementById('avatarTop').src =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=0a7d3e&color=fff`;
  document.getElementById('rolBadge').textContent = u === 'admin' ? 'Admin' : 'Socio';

  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = u === 'admin' ? 'flex' : 'none';
  });
  document.querySelectorAll('.socio-only').forEach(el => {
    el.style.display = u === 'socio' ? 'flex' : 'none';
  });

  if (u === 'socio') mostrarChatSoporteSocio(); else ocultarChatSoporteSocio();

  renderView('dashboard');
  return false;
}

function logout() {
  usuarioActual = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginForm').reset();
  ocultarChatSoporteSocio();
}

/* ============ CHAT DE SOPORTE (Tawk.to) — para que cada socio atienda a sus propios clientes ============
   El script de Tawk.to ya está insertado en mockup2.html (oculto por defecto vía Tawk_API.onLoad).
   Aquí solo se controla su visibilidad: se muestra al iniciar sesión como socio, se oculta para
   admin o al cerrar sesión. Es una herramienta de atención al cliente de cada asociado, no
   soporte técnico de la plataforma. */
function mostrarChatSoporteSocio() {
  if (window.Tawk_API && typeof window.Tawk_API.showWidget === 'function') {
    window.Tawk_API.showWidget();
  } else if (window.Tawk_API) {
    window.Tawk_API.onLoad = function () { window.Tawk_API.showWidget(); };
  }
}

function ocultarChatSoporteSocio() {
  if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
    window.Tawk_API.hideWidget();
  }
}

/* ============ NAVEGACIÓN ============ */
document.querySelectorAll('.sidebar-nav a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.sidebar-nav a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    renderView(a.dataset.view);
  });
});

function renderView(view) {
  const cont = document.getElementById('viewContent');
  const titles = {
    dashboard: 'Panel de Control',
    perfil: 'Mi Perfil',
    negocio: 'Mi Negocio',
    servicios: 'Mis Servicios',
    sedes: 'Mis Sedes',
    blog: 'Eventos y Encuentros',
    clientes: 'Clientes',
    cotizaciones: 'Cotizaciones',
    usuarios: 'Gestión de Usuarios',
    previsualizar: 'Así se ve tu negocio'
  };
  document.getElementById('viewTitle').textContent = titles[view] || 'Panel';

  switch(view) {
    case 'dashboard': cont.innerHTML = viewDashboard(); break;
    case 'perfil': cont.innerHTML = viewPerfil(); break;
    case 'negocio': cont.innerHTML = viewNegocio(); break;
    case 'servicios': cont.innerHTML = viewServicios(); break;
    case 'sedes': cont.innerHTML = viewSedes(); break;
    case 'blog': cont.innerHTML = viewBlog(); break;
    case 'clientes': cont.innerHTML = viewClientes(); break;
    case 'cotizaciones': cont.innerHTML = viewCotizaciones(); break;
    case 'usuarios': cont.innerHTML = viewUsuarios(); break;
    case 'previsualizar': cont.innerHTML = viewPrevisualizar(); break;
  }
}

/* ============ VISTAS ============ */
function viewDashboard() {
  const esAdmin = usuarioActual === 'admin';
  return `
    <div class="stats-grid">
      <div class="stat-card"><div><div class="stat-num">245</div><div class="stat-label">Visitas al perfil</div></div><i class="fa-solid fa-eye"></i></div>
      <div class="stat-card"><div><div class="stat-num">8</div><div class="stat-label">Mensajes nuevos</div></div><i class="fa-solid fa-envelope"></i></div>
      <div class="stat-card"><div><div class="stat-num">${datosSocio.sedes.length}</div><div class="stat-label">Sedes activas</div></div><i class="fa-solid fa-location-dot"></i></div>
      <div class="stat-card"><div><div class="stat-num">${datosSocio.servicios.length}</div><div class="stat-label">Servicios</div></div><i class="fa-solid fa-screwdriver-wrench"></i></div>
      <div class="stat-card"><div><div class="stat-num">${clientesDB_().length}</div><div class="stat-label">Clientes registrados</div></div><i class="fa-solid fa-address-book"></i></div>
      <div class="stat-card"><div><div class="stat-num">${cotizacionesDB_().length}</div><div class="stat-label">Cotizaciones enviadas</div></div><i class="fa-solid fa-file-invoice-dollar"></i></div>
    </div>

    <div class="panel panel-highlight">
      <h3><i class="fa-solid fa-file-invoice-dollar"></i> Cotiza y registra clientes al instante</h3>
      <p style="color:var(--gray);margin-bottom:14px;">
        Registra los datos de tus clientes y arma cotizaciones de tus servicios listas para enviar directo por WhatsApp, sin salir de la plataforma.
      </p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="irAVista('clientes')"><i class="fa-solid fa-address-book"></i> Ver clientes</button>
        <button class="btn btn-whatsapp" onclick="irAVista('cotizaciones')"><i class="fa-brands fa-whatsapp"></i> Nueva cotización</button>
      </div>
    </div>

    ${!esAdmin ? `
    <div class="panel">
      <h3><i class="fa-solid fa-comments"></i> Chat de soporte en vivo activo</h3>
      <p style="color:var(--gray);">
        Tienes un chat en vivo activo en la esquina de tu pantalla para responder en tiempo real a los clientes que visitan tu página o tu panel — sin depender solo de WhatsApp.
      </p>
    </div>` : ''}

    <div class="panel">
      <h3><i class="fa-solid fa-circle-info"></i> Bienvenido, ${esAdmin ? 'Administrador' : datosSocio.nombre}</h3>
      <p style="color:var(--gray);">
        ${esAdmin
          ? 'Como administrador puedes gestionar usuarios, publicar eventos en el blog y moderar el contenido de los socios.'
          : 'Desde aquí puedes personalizar tu perfil, actualizar tu negocio, servicios, sedes y ver los eventos de la asociación.'}
      </p>
    </div>

    ${!esAdmin ? `
    <div class="panel panel-highlight">
      <h3><i class="fa-solid fa-link"></i> Tu página personal ya está lista</h3>
      <p style="color:var(--gray);margin-bottom:14px;">
        Esta plataforma te da tu propia página web de negocio. Compártela como si fuera tu página personal — tus clientes verán tu información, servicios y sedes actualizados en tiempo real, sin depender de nadie más.
      </p>
      <button class="btn btn-primary" onclick="irAVista('previsualizar')">
        <i class="fa-solid fa-eye"></i> Ver y compartir mi página
      </button>
    </div>` : ''}
  `;
}

function irAVista(view) {
  document.querySelectorAll('.sidebar-nav a').forEach(x => x.classList.remove('active'));
  const link = document.querySelector(`.sidebar-nav a[data-view="${view}"]`);
  if (link) link.classList.add('active');
  renderView(view);
}

function viewPerfil() {
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-user"></i> Datos personales</h3>
      <div class="form-grid">
        <div class="form-row"><label>Nombre completo</label><input id="f_nombre" value="${datosSocio.nombre}"></div>
        <div class="form-row"><label>Email</label><input id="f_email" value="${datosSocio.email}"></div>
        <div class="form-row"><label>Teléfono</label><input id="f_telefono" value="${datosSocio.telefono}"></div>
        <div class="form-row"><label>Ciudad</label>
          <select id="f_ciudad">
            <option ${datosSocio.ciudad === 'Bucaramanga' ? 'selected' : ''}>Bucaramanga</option>
            <option ${datosSocio.ciudad === 'Floridablanca' ? 'selected' : ''}>Floridablanca</option>
            <option ${datosSocio.ciudad === 'Girón' ? 'selected' : ''}>Girón</option>
            <option ${datosSocio.ciudad === 'Piedecuesta' ? 'selected' : ''}>Piedecuesta</option>
          </select>
        </div>
      </div>
      <div class="form-row"><label>Foto de perfil</label><input type="file"></div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="guardarPerfil()"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button>
      </div>
    </div>
  `;
}

function guardarPerfil() {
  datosSocio.nombre = document.getElementById('f_nombre').value.trim() || datosSocio.nombre;
  datosSocio.email = document.getElementById('f_email').value.trim() || datosSocio.email;
  datosSocio.telefono = document.getElementById('f_telefono').value.trim() || datosSocio.telefono;
  datosSocio.ciudad = document.getElementById('f_ciudad').value;
  guardar();
}

function viewNegocio() {
  const coloresDisponibles = ['#0a7d3e', '#0066cc', '#7c3aed', '#e11d48', '#d68910', '#0f172a'];
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-store"></i> Información del negocio</h3>
      <div class="form-row"><label>Nombre del negocio</label><input id="f_negocio" value="${datosSocio.negocio}"></div>
      <div class="form-row"><label>Descripción</label><textarea id="f_descripcion">${datosSocio.descripcion}</textarea></div>
      <div class="form-row"><label>Logo del negocio</label><input type="file"></div>

      <h3 style="margin-top:25px;"><i class="fa-solid fa-share-nodes"></i> Redes sociales</h3>
      <div class="form-grid">
        <div class="form-row"><label>Facebook</label><input id="f_facebook" value="${datosSocio.redes.facebook}"></div>
        <div class="form-row"><label>Instagram</label><input id="f_instagram" value="${datosSocio.redes.instagram}"></div>
        <div class="form-row"><label>WhatsApp</label><input id="f_whatsapp" value="${datosSocio.redes.whatsapp}"></div>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" onclick="guardarNegocio()"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button>
      </div>
    </div>

    <div class="panel panel-highlight">
      <h3><i class="fa-solid fa-id-card"></i> Personalizar mi página / tarjeta de presentación</h3>
      <p style="color:var(--gray);margin-bottom:14px;">
        Así se ve tu página pública ante tus clientes. Personalízala con una frase corta y un color propio para diferenciarte.
      </p>
      <div class="form-row"><label>Frase de presentación (bio corta)</label><input id="f_bio" maxlength="140" value="${datosSocio.bio || ''}" placeholder="Ej: Te ayudo a resolver tu trámite rápido y sin filas"></div>

      <div class="form-row">
        <label>Color de acento de tu página</label>
        <div class="color-picker-row" id="colorPickerRow">
          ${coloresDisponibles.map(c => `
            <button type="button" class="color-swatch ${c === (datosSocio.colorAcento || '#0a7d3e') ? 'selected' : ''}" style="background:${c};" data-color="${c}" onclick="seleccionarColorAcento('${c}')" aria-label="Color ${c}"></button>
          `).join('')}
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" onclick="guardarPersonalizacion()"><i class="fa-solid fa-floppy-disk"></i> Guardar personalización</button>
        <a class="btn btn-outline" href="perfil.html?socio=${datosSocio.slug}" target="_blank"><i class="fa-solid fa-eye"></i> Ver mi página</a>
      </div>
    </div>
  `;
}

function guardarNegocio() {
  datosSocio.negocio = document.getElementById('f_negocio').value.trim() || datosSocio.negocio;
  datosSocio.descripcion = document.getElementById('f_descripcion').value.trim() || datosSocio.descripcion;
  datosSocio.redes.facebook = document.getElementById('f_facebook').value.trim();
  datosSocio.redes.instagram = document.getElementById('f_instagram').value.trim();
  datosSocio.redes.whatsapp = document.getElementById('f_whatsapp').value.trim();
  guardar();
}

function seleccionarColorAcento(color) {
  datosSocio.colorAcento = color;
  document.querySelectorAll('#colorPickerRow .color-swatch').forEach(el => {
    el.classList.toggle('selected', el.dataset.color === color);
  });
}

function guardarPersonalizacion() {
  datosSocio.bio = document.getElementById('f_bio').value.trim();
  if (!datosSocio.colorAcento) datosSocio.colorAcento = '#0a7d3e';
  guardar();
}

/* ============ SERVICIOS (crear / editar / eliminar) ============ */
function viewServicios() {
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-screwdriver-wrench"></i> Servicios ofrecidos (${datosSocio.servicios.length})</h3>
      <div class="item-list" id="listaServicios">
        ${datosSocio.servicios.map(s => `
          <div class="item-row">
            <i class="fa-solid fa-screwdriver-wrench" style="font-size:1.5rem;color:var(--primary);"></i>
            <div class="item-row-info">
              <strong>${s.nombre}</strong>
              <small>${s.precio}</small>
            </div>
            <button class="btn btn-outline btn-sm" onclick="editarServicio(${s.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-outline btn-sm" onclick="eliminarServicio(${s.id})"><i class="fa-solid fa-trash"></i></button>
          </div>
        `).join('') || '<p style="color:var(--gray);">Aún no has agregado servicios.</p>'}
      </div>

      <h3 style="margin-top:25px;"><i class="fa-solid fa-plus"></i> Agregar servicio nuevo</h3>
      <div class="form-grid">
        <div class="form-row"><label>Nombre del servicio</label><input id="ns_nombre" placeholder="Ej: Traspaso de vehículo"></div>
        <div class="form-row"><label>Precio (opcional)</label><input id="ns_precio" placeholder="Ej: Desde $150.000"></div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="crearServicio()"><i class="fa-solid fa-plus"></i> Agregar servicio</button>
      </div>
    </div>
  `;
}

function crearServicio() {
  const nombre = document.getElementById('ns_nombre').value.trim();
  const precio = document.getElementById('ns_precio').value.trim() || 'Precio a consultar';
  if (!nombre) { showToast('Escribe el nombre del servicio', false); return; }
  datosSocio.servicios.push({ id: nextServicioId++, nombre, precio });
  renderView('servicios');
  showToast('Servicio agregado ✓', true);
}

function editarServicio(id) {
  const s = datosSocio.servicios.find(x => x.id === id);
  if (!s) return;
  const nuevoNombre = prompt('Nombre del servicio:', s.nombre);
  if (nuevoNombre === null) return;
  const nuevoPrecio = prompt('Precio (ej: Desde $150.000):', s.precio);
  if (nuevoPrecio === null) return;
  s.nombre = nuevoNombre.trim() || s.nombre;
  s.precio = nuevoPrecio.trim() || s.precio;
  renderView('servicios');
  showToast('Servicio actualizado ✓', true);
}

function eliminarServicio(id) {
  if (!confirm('¿Eliminar este servicio?')) return;
  datosSocio.servicios = datosSocio.servicios.filter(x => x.id !== id);
  renderView('servicios');
  showToast('Servicio eliminado', true);
}

/* ============ SEDES (crear / editar / eliminar) ============ */
function viewSedes() {
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-location-dot"></i> Mis sedes (${datosSocio.sedes.length})</h3>
      <div class="item-list">
        ${datosSocio.sedes.map(s => `
          <div class="item-row">
            <i class="fa-solid fa-building" style="font-size:1.5rem;color:var(--primary);"></i>
            <div class="item-row-info">
              <strong>${s.nombre}</strong>
              <small>${s.dir} · ${s.horario}</small>
            </div>
            <button class="btn btn-outline btn-sm" onclick="editarSede(${s.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-outline btn-sm" onclick="eliminarSede(${s.id})"><i class="fa-solid fa-trash"></i></button>
          </div>
        `).join('') || '<p style="color:var(--gray);">Aún no has agregado sedes.</p>'}
      </div>

      <h3 style="margin-top:25px;"><i class="fa-solid fa-plus"></i> Agregar sede nueva</h3>
      <div class="form-grid">
        <div class="form-row"><label>Nombre de la sede</label><input id="nsd_nombre" placeholder="Ej: Sede Norte"></div>
        <div class="form-row"><label>Horario</label><input id="nsd_horario" placeholder="Ej: 8am - 5pm"></div>
      </div>
      <div class="form-row"><label>Dirección</label><input id="nsd_dir" placeholder="Ej: Cra 10 #20-30, Bucaramanga"></div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="crearSede()"><i class="fa-solid fa-plus"></i> Agregar sede</button>
      </div>
    </div>
  `;
}

function crearSede() {
  const nombre = document.getElementById('nsd_nombre').value.trim();
  const horario = document.getElementById('nsd_horario').value.trim() || 'Horario a confirmar';
  const dir = document.getElementById('nsd_dir').value.trim();
  if (!nombre || !dir) { showToast('Completa nombre y dirección de la sede', false); return; }
  datosSocio.sedes.push({ id: nextSedeId++, nombre, dir, horario });
  renderView('sedes');
  showToast('Sede agregada ✓', true);
}

function editarSede(id) {
  const s = datosSocio.sedes.find(x => x.id === id);
  if (!s) return;
  const nuevoNombre = prompt('Nombre de la sede:', s.nombre);
  if (nuevoNombre === null) return;
  const nuevaDir = prompt('Dirección:', s.dir);
  if (nuevaDir === null) return;
  const nuevoHorario = prompt('Horario:', s.horario);
  if (nuevoHorario === null) return;
  s.nombre = nuevoNombre.trim() || s.nombre;
  s.dir = nuevaDir.trim() || s.dir;
  s.horario = nuevoHorario.trim() || s.horario;
  renderView('sedes');
  showToast('Sede actualizada ✓', true);
}

function eliminarSede(id) {
  if (!confirm('¿Eliminar esta sede?')) return;
  datosSocio.sedes = datosSocio.sedes.filter(x => x.id !== id);
  renderView('sedes');
  showToast('Sede eliminada', true);
}

/* ============ BLOG (texto, imagen, video, link) — admin y socio pueden publicar ============ */
function viewBlog() {
  const esAdmin = usuarioActual === 'admin';
  const eventos = cargarEventos();
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-newspaper"></i> Eventos y Encuentros</h3>
      <p style="color:var(--gray);margin-bottom:18px;">
        ${esAdmin
          ? 'Lo que publiques aquí aparece automáticamente en la sección "Eventos y Encuentros" del portal público.'
          : 'Comparte novedades de tu negocio: promociones, horarios especiales o noticias. El administrador modera las publicaciones.'}
      </p>

      <h3><i class="fa-solid fa-pen-to-square"></i> Nueva publicación</h3>
      <div class="form-grid">
        <div class="form-row"><label>Título</label><input id="nb_titulo" placeholder="Ej: Encuentro Regional 2026"></div>
        <div class="form-row"><label>Categoría</label><input id="nb_categoria" placeholder="Ej: Encuentro, Capacitación, Asamblea"></div>
      </div>
      <div class="form-row"><label>Texto</label><textarea id="nb_texto" placeholder="Escribe el contenido de la publicación..."></textarea></div>
      <div class="form-row"><label>Fotos del evento (una URL por línea, puedes agregar varias)</label><textarea id="nb_imagenes" placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"></textarea></div>
      <div class="form-grid">
        <div class="form-row"><label>Video (URL de YouTube/enlace)</label><input id="nb_video" placeholder="https://youtube.com/..."></div>
        <div class="form-row"><label>Enlace relacionado (opcional)</label><input id="nb_link" placeholder="https://..."></div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="crearPublicacion()"><i class="fa-solid fa-upload"></i> Publicar</button>
      </div>

      <h3 style="margin-top:30px;"><i class="fa-solid fa-list"></i> Publicaciones (${eventos.length})</h3>
      <div class="item-list">
        ${eventos.map(e => `
          <div class="item-row blog-item-row">
            <div class="blog-item-icon">
              ${e.imagenes && e.imagenes.length ? `<img src="${e.imagenes[0]}" alt="" onerror="this.style.display='none'">` : `<i class="fa-solid ${e.video ? 'fa-circle-play' : (e.link ? 'fa-link' : 'fa-calendar-check')}"></i>`}
            </div>
            <div class="item-row-info">
              <strong>${e.titulo}</strong>
              <small><i class="fa-regular fa-calendar"></i> ${e.fecha} · Por ${e.autor} · 👁 ${e.vistas} vistas</small>
              ${e.texto ? `<p class="blog-item-texto">${e.texto}</p>` : ''}
              <div class="blog-item-tags">
                ${e.imagenes && e.imagenes.length ? `<span class="tag-media"><i class="fa-solid fa-images"></i> ${e.imagenes.length} foto(s)</span>` : ''}
                ${e.video ? '<span class="tag-media"><i class="fa-solid fa-video"></i> Video</span>' : ''}
                ${e.link ? `<a class="tag-media" href="${e.link}" target="_blank"><i class="fa-solid fa-link"></i> Enlace</a>` : ''}
              </div>
            </div>
            ${(esAdmin || e.autor === datosSocio.nombre) ? `
              <button class="btn btn-outline btn-sm" onclick="eliminarPublicacion(${e.id})"><i class="fa-solid fa-trash"></i></button>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function crearPublicacion() {
  const titulo = document.getElementById('nb_titulo').value.trim();
  const categoria = document.getElementById('nb_categoria').value.trim() || 'Noticia';
  const texto = document.getElementById('nb_texto').value.trim();
  const imagenes = document.getElementById('nb_imagenes').value.split('\n').map(s => s.trim()).filter(Boolean);
  const video = document.getElementById('nb_video').value.trim();
  const link = document.getElementById('nb_link').value.trim();

  if (!titulo) { showToast('Escribe un título para la publicación', false); return; }

  const eventos = cargarEventos();
  const nextId = (eventos.reduce((max, e) => Math.max(max, e.id), 0)) + 1;
  eventos.unshift({
    id: nextId,
    titulo, categoria,
    autor: usuarioActual === 'admin' ? 'Administrador' : datosSocio.nombre,
    fecha: new Date().toLocaleDateString('es-CO'),
    vistas: 0,
    texto, imagenes, video, link
  });
  guardarEventos(eventos);
  renderView('blog');
  showToast('Publicación creada — ya está visible en el portal público ✓', true);
}

function eliminarPublicacion(id) {
  if (!confirm('¿Eliminar esta publicación?')) return;
  guardarEventos(cargarEventos().filter(x => x.id !== id));
  renderView('blog');
  showToast('Publicación eliminada', true);
}

/* ============ CLIENTES (registro tipo CRM) ============ */
function viewClientes() {
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-address-book"></i> Clientes registrados (${clientesDB_().length})</h3>
      <div class="item-list">
        ${clientesDB_().map(c => `
          <div class="item-row">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.nombre)}&background=0a7d3e&color=fff" alt="">
            <div class="item-row-info">
              <strong>${c.nombre}</strong>
              <small><i class="fa-solid fa-phone"></i> ${c.telefono} · ${c.interes || 'Sin trámite definido'}</small>
              ${c.notas ? `<small>📝 ${c.notas}</small>` : ''}
              <small><i class="fa-regular fa-calendar"></i> Registrado el ${c.fecha}</small>
            </div>
            <button class="btn btn-whatsapp btn-sm" onclick="whatsappCliente(${c.id})" title="Escribir por WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
            <button class="btn btn-outline btn-sm" onclick="cotizarParaCliente(${c.id})" title="Generar cotización"><i class="fa-solid fa-file-invoice-dollar"></i></button>
            <button class="btn btn-outline btn-sm" onclick="eliminarCliente(${c.id})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
          </div>
        `).join('') || '<p style="color:var(--gray);">Aún no has registrado clientes.</p>'}
      </div>

      <h3 style="margin-top:25px;"><i class="fa-solid fa-user-plus"></i> Registrar cliente nuevo</h3>
      <div class="form-grid">
        <div class="form-row"><label>Nombre completo</label><input id="nc_nombre" placeholder="Ej: Laura Ramírez"></div>
        <div class="form-row"><label>Teléfono (WhatsApp)</label><input id="nc_telefono" placeholder="Ej: 3001234567"></div>
      </div>
      <div class="form-grid">
        <div class="form-row"><label>Trámite de interés</label><input id="nc_interes" placeholder="Ej: Traspaso de vehículo"></div>
        <div class="form-row"><label>Notas (opcional)</label><input id="nc_notas" placeholder="Ej: Contactó por Instagram"></div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="crearCliente()"><i class="fa-solid fa-plus"></i> Registrar cliente</button>
      </div>
    </div>
  `;
}

function crearCliente() {
  const nombre = document.getElementById('nc_nombre').value.trim();
  const telefono = document.getElementById('nc_telefono').value.trim().replace(/\D/g, '');
  const interes = document.getElementById('nc_interes').value.trim();
  const notas = document.getElementById('nc_notas').value.trim();
  if (!nombre || !telefono) { showToast('Completa nombre y teléfono del cliente', false); return; }
  clientesDB_().push({ id: nextClienteId++, nombre, telefono, interes, notas, fecha: new Date().toLocaleDateString('es-CO') });
  renderView('clientes');
  showToast('Cliente registrado ✓', true);
}

function eliminarCliente(id) {
  if (!confirm('¿Eliminar este cliente?')) return;
  clientesPorUsuario[usuarioActual] = clientesDB_().filter(c => c.id !== id);
  renderView('clientes');
  showToast('Cliente eliminado', true);
}

function whatsappCliente(id) {
  const c = clientesDB_().find(x => x.id === id);
  if (!c) return;
  const msg = `Hola ${c.nombre}, te escribo de parte de ${datosSocio.negocio} respecto a tu trámite de ${c.interes || 'interés'}.`;
  window.open(`https://wa.me/57${c.telefono}?text=${encodeURIComponent(msg)}`, '_blank');
}

function cotizarParaCliente(id) {
  const c = clientesDB_().find(x => x.id === id);
  if (!c) return;
  irAVista('cotizaciones');
  setTimeout(() => {
    document.getElementById('cot_cliente').value = c.nombre;
    document.getElementById('cot_telefono').value = c.telefono;
  }, 0);
}

/* ============ COTIZACIONES (generador con envío a WhatsApp) ============ */
function viewCotizaciones() {
  itemsCotizacionActual = [];
  return `
    <div class="panel panel-highlight">
      <h3><i class="fa-solid fa-file-invoice-dollar"></i> Nueva cotización</h3>
      <p style="color:var(--gray);margin-bottom:14px;">
        Arma la cotización con tus servicios y agrega el total. Puedes enviarla como mensaje directo a WhatsApp, o descargarla como imagen tipo recibo para adjuntarla en el chat.
      </p>

      <div class="form-grid">
        <div class="form-row"><label>Cliente</label><input id="cot_cliente" placeholder="Nombre del cliente"></div>
        <div class="form-row"><label>Teléfono (WhatsApp)</label><input id="cot_telefono" placeholder="Ej: 3001234567"></div>
      </div>

      <h3 style="margin-top:20px;"><i class="fa-solid fa-list-check"></i> Servicios a cotizar</h3>
      <div class="form-grid">
        <div class="form-row">
          <label>Servicio</label>
          <select id="cot_servicio_select">
            ${datosSocio.servicios.map(s => `<option value="${s.nombre}" data-precio="${s.precio}">${s.nombre}</option>`).join('')}
            <option value="__otro__">Otro (escribir manualmente)</option>
          </select>
        </div>
        <div class="form-row"><label>Valor (COP)</label><input id="cot_item_valor" type="text" placeholder="Ej: 150000"></div>
      </div>
      <div class="form-row" id="cot_otro_row" style="display:none;"><label>Nombre del servicio</label><input id="cot_item_nombre_otro" placeholder="Escribe el nombre del servicio"></div>
      <div class="form-actions">
        <button class="btn btn-outline" type="button" onclick="agregarItemCotizacion()"><i class="fa-solid fa-plus"></i> Agregar ítem</button>
      </div>

      <div class="item-list" id="listaItemsCotizacion" style="margin-top:16px;">
        <p style="color:var(--gray);">Aún no has agregado servicios a esta cotización.</p>
      </div>

      <div class="form-row" style="margin-top:16px;"><label>Notas / condiciones (opcional)</label><input id="cot_notas" placeholder="Ej: Cotización válida por 15 días"></div>

      <div class="form-actions">
        <button class="btn btn-whatsapp" onclick="enviarCotizacionWhatsApp()"><i class="fa-brands fa-whatsapp"></i> Enviar cotización por WhatsApp</button>
        <button class="btn btn-outline" onclick="descargarImagenCotizacion()"><i class="fa-solid fa-image"></i> Descargar como imagen</button>
      </div>
    </div>

    <!-- Plantilla del recibo, fuera de pantalla — se captura como imagen con html2canvas -->
    <div id="reciboCotizacionCaptura" style="position:absolute; left:-9999px; top:0;"></div>

    <div class="panel">
      <h3><i class="fa-solid fa-clock-rotate-left"></i> Historial de cotizaciones (${cotizacionesDB_().length})</h3>
      <div class="item-list">
        ${cotizacionesDB_().map(c => `
          <div class="item-row">
            <i class="fa-solid fa-file-invoice-dollar" style="font-size:1.5rem;color:var(--primary);"></i>
            <div class="item-row-info">
              <strong>${c.cliente}</strong>
              <small>${c.items.length} ítem(s) · Total: $${c.total.toLocaleString('es-CO')}</small>
              <small><i class="fa-regular fa-calendar"></i> ${c.fecha}</small>
            </div>
            <button class="btn btn-whatsapp btn-sm" onclick="reenviarCotizacion(${c.id})" title="Reenviar por WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
            <button class="btn btn-outline btn-sm" onclick="descargarImagenCotizacion(${c.id})" title="Descargar como imagen"><i class="fa-solid fa-image"></i></button>
          </div>
        `).join('') || '<p style="color:var(--gray);">Todavía no has generado cotizaciones.</p>'}
      </div>
    </div>
  `;
}

document.addEventListener('change', e => {
  if (e.target && e.target.id === 'cot_servicio_select') {
    const otroRow = document.getElementById('cot_otro_row');
    const valorInput = document.getElementById('cot_item_valor');
    if (e.target.value === '__otro__') {
      otroRow.style.display = 'block';
      valorInput.value = '';
    } else {
      otroRow.style.display = 'none';
      const opt = e.target.selectedOptions[0];
      const precioTexto = (opt.dataset.precio || '').replace(/[^\d]/g, '');
      valorInput.value = precioTexto;
    }
  }
});

function agregarItemCotizacion() {
  const select = document.getElementById('cot_servicio_select');
  const esOtro = select.value === '__otro__';
  const nombre = esOtro ? document.getElementById('cot_item_nombre_otro').value.trim() : select.value;
  const valor = parseInt(document.getElementById('cot_item_valor').value.replace(/\D/g, ''), 10);

  if (!nombre) { showToast('Indica el nombre del servicio', false); return; }
  if (!valor || valor <= 0) { showToast('Indica un valor válido para el servicio', false); return; }

  itemsCotizacionActual.push({ nombre, valor });
  renderListaItemsCotizacion();
  document.getElementById('cot_item_valor').value = '';
  if (esOtro) document.getElementById('cot_item_nombre_otro').value = '';
}

function quitarItemCotizacion(index) {
  itemsCotizacionActual.splice(index, 1);
  renderListaItemsCotizacion();
}

function renderListaItemsCotizacion() {
  const cont = document.getElementById('listaItemsCotizacion');
  if (!itemsCotizacionActual.length) {
    cont.innerHTML = '<p style="color:var(--gray);">Aún no has agregado servicios a esta cotización.</p>';
    return;
  }
  const total = itemsCotizacionActual.reduce((sum, i) => sum + i.valor, 0);
  cont.innerHTML = `
    ${itemsCotizacionActual.map((i, idx) => `
      <div class="item-row">
        <i class="fa-solid fa-check-circle" style="font-size:1.3rem;color:var(--primary);"></i>
        <div class="item-row-info">
          <strong>${i.nombre}</strong>
          <small>$${i.valor.toLocaleString('es-CO')}</small>
        </div>
        <button class="btn btn-outline btn-sm" onclick="quitarItemCotizacion(${idx})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('')}
    <div class="item-row" style="background:var(--primary-light);border-radius:10px;">
      <div class="item-row-info"><strong>Total</strong></div>
      <strong style="color:var(--primary);font-size:1.1rem;">$${total.toLocaleString('es-CO')}</strong>
    </div>
  `;
}

function armarMensajeCotizacion(cliente, items, notas) {
  const total = items.reduce((sum, i) => sum + i.valor, 0);
  const lineas = items.map(i => `• ${i.nombre}: $${i.valor.toLocaleString('es-CO')}`).join('\n');
  return `Hola ${cliente}, te comparto la cotización de *${datosSocio.negocio}*:\n\n${lineas}\n\n*Total: $${total.toLocaleString('es-CO')}*\n${notas ? `\n${notas}\n` : ''}\nCualquier duda, quedo atento. ¡Gracias por confiar en nosotros!`;
}

function enviarCotizacionWhatsApp() {
  const cliente = document.getElementById('cot_cliente').value.trim();
  const telefono = document.getElementById('cot_telefono').value.trim().replace(/\D/g, '');
  const notas = document.getElementById('cot_notas').value.trim();

  if (!cliente || !telefono) { showToast('Indica el nombre y el teléfono del cliente', false); return; }
  if (!itemsCotizacionActual.length) { showToast('Agrega al menos un servicio a la cotización', false); return; }

  const total = itemsCotizacionActual.reduce((sum, i) => sum + i.valor, 0);
  const mensaje = armarMensajeCotizacion(cliente, itemsCotizacionActual, notas);

  cotizacionesDB_().unshift({
    id: nextCotizacionId++,
    cliente, telefono, notas,
    items: [...itemsCotizacionActual],
    total,
    fecha: new Date().toLocaleDateString('es-CO')
  });

  window.open(`https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  renderView('cotizaciones');
  showToast('Cotización generada y lista para enviar ✓', true);
}

function reenviarCotizacion(id) {
  const c = cotizacionesDB_().find(x => x.id === id);
  if (!c) return;
  const mensaje = armarMensajeCotizacion(c.cliente, c.items, c.notas);
  window.open(`https://wa.me/57${c.telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

/* ============ IMAGEN DE COTIZACIÓN (recibo descargable, vía html2canvas) ============ */
function reciboHTML(cliente, items, notas, total) {
  const acento = datosSocio.colorAcento || '#0a7d3e';
  const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  return `
    <div style="width:480px; font-family:'Segoe UI',system-ui,sans-serif; background:#fff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">
      <div style="background:${acento}; padding:22px 28px; color:#fff;">
        <div style="font-size:.72rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; opacity:.85; margin-bottom:4px;">ASOTRÁNSITO AMB · Miembro acreditado</div>
        <div style="font-size:1.3rem; font-weight:800;">${datosSocio.negocio}</div>
        <div style="font-size:.85rem; opacity:.9;">${datosSocio.nombre} · ${datosSocio.ciudad}</div>
      </div>
      <div style="padding:24px 28px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:18px; font-size:.85rem; color:#64748b;">
          <div><strong style="color:#0f172a;">Cotización para:</strong><br>${cliente}</div>
          <div style="text-align:right;"><strong style="color:#0f172a;">Fecha:</strong><br>${fecha}</div>
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:.9rem;">
          ${items.map(i => `
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:10px 0; color:#0f172a;">${i.nombre}</td>
              <td style="padding:10px 0; text-align:right; color:#0f172a; font-weight:600;">$${i.valor.toLocaleString('es-CO')}</td>
            </tr>
          `).join('')}
        </table>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding:14px 16px; background:#f8fafc; border-radius:10px;">
          <strong style="color:#0f172a;">Total</strong>
          <strong style="color:${acento}; font-size:1.25rem;">$${total.toLocaleString('es-CO')}</strong>
        </div>
        ${notas ? `<p style="margin-top:14px; font-size:.82rem; color:#64748b; font-style:italic;">${notas}</p>` : ''}
      </div>
      <div style="padding:14px 28px; background:#f8fafc; border-top:1px solid #e2e8f0; font-size:.75rem; color:#94a3b8; text-align:center;">
        Contacto: ${datosSocio.redes.whatsapp} · Cotización generada a través de ASOTRÁNSITO AMB
      </div>
    </div>
  `;
}

function descargarImagenCotizacion(cotizacionId) {
  let cliente, items, notas, total;

  if (cotizacionId) {
    const c = cotizacionesDB_().find(x => x.id === cotizacionId);
    if (!c) return;
    ({ cliente, items, notas, total } = c);
  } else {
    cliente = document.getElementById('cot_cliente').value.trim();
    notas = document.getElementById('cot_notas').value.trim();
    items = itemsCotizacionActual;
    if (!cliente) { showToast('Indica el nombre del cliente', false); return; }
    if (!items.length) { showToast('Agrega al menos un servicio a la cotización', false); return; }
    total = items.reduce((sum, i) => sum + i.valor, 0);
  }

  if (typeof html2canvas === 'undefined') { showToast('No se pudo cargar el generador de imágenes, revisa tu conexión', false); return; }

  const captura = document.getElementById('reciboCotizacionCaptura');
  captura.innerHTML = reciboHTML(cliente, items, notas, total);
  showToast('Generando imagen…', true);

  html2canvas(captura.firstElementChild, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
    const link = document.createElement('a');
    link.download = `cotizacion-${cliente.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    captura.innerHTML = '';
    showToast('Imagen descargada ✓', true);
  }).catch(() => {
    captura.innerHTML = '';
    showToast('No se pudo generar la imagen', false);
  });
}

function viewUsuarios() {
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-users-gear"></i> Socios registrados (${usuariosAdmin.length})</h3>
      <div class="item-list">
        ${usuariosAdmin.map(u => `
          <div class="item-row">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(u.nombre)}&background=0a7d3e&color=fff" alt="">
            <div class="item-row-info">
              <strong>${u.nombre}</strong>
              <small>${u.email}</small>
            </div>
            <span class="badge ${u.estado === 'Activo' ? 'badge-green' : 'badge-orange'}">${u.estado}</span>
            <button class="btn btn-outline btn-sm" onclick="guardar()"><i class="fa-solid fa-pen"></i></button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ============ PREVISUALIZACIÓN DE LA PÁGINA PERSONAL DEL SOCIO ============ */
function viewPrevisualizar() {
  const link = `perfil.html?socio=${datosSocio.slug}`;
  return `
    <div class="panel panel-highlight">
      <h3><i class="fa-solid fa-link"></i> Tu página personal</h3>
      <p style="color:var(--gray);margin-bottom:14px;">
        Este es el link único de tu negocio. Compártelo en tus redes o WhatsApp — tus clientes verán esta página aunque no conozcan el portal de la asociación.
      </p>
      <div class="link-copy-box">
        <input id="miLink" value="${location.origin}${location.pathname.replace(/[^/]*$/, '')}${link}" readonly>
        <button class="btn btn-primary btn-sm" onclick="copiarLink()"><i class="fa-solid fa-copy"></i> Copiar link</button>
        <a class="btn btn-outline btn-sm" href="${link}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir</a>
      </div>
    </div>

    <div class="panel">
      <h3><i class="fa-solid fa-desktop"></i> Vista previa</h3>
      <div class="preview-frame">
        <iframe src="${link}" title="Vista previa de tu página personal" loading="lazy"></iframe>
      </div>
    </div>
  `;
}

function copiarLink() {
  const input = document.getElementById('miLink');
  input.select();
  navigator.clipboard?.writeText(input.value).then(
    () => showToast('Link copiado ✓', true),
    () => showToast('No se pudo copiar automáticamente, cópialo manualmente', false)
  );
}

/* ============ UTILIDADES ============ */
function guardar() {
  showToast('Cambios guardados correctamente ✓', true);
}

function showToast(msg, success = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (success ? ' success' : '');
  setTimeout(() => t.classList.remove('show'), 2500);
}

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

/* Publicaciones del blog: texto, imagen, video o link — publicadas por admin o por el socio */
let eventosBlog = [
  { id: 1, titulo: "Encuentro Regional 2025", autor: "Administrador", fecha: "15/03/2025", vistas: 120, texto: "Encuentro anual del gremio con todos los socios del Área Metropolitana.", imagen: "", video: "", link: "" },
  { id: 2, titulo: "Capacitación RUNT 2.0", autor: "Administrador", fecha: "02/02/2025", vistas: 89, texto: "Jornada de capacitación sobre el nuevo sistema RUNT.", imagen: "", video: "", link: "" },
  { id: 3, titulo: "Asamblea General Ordinaria", autor: "Administrador", fecha: "20/01/2025", vistas: 145, texto: "Convocatoria a la asamblea general de socios.", imagen: "", video: "", link: "" }
];
let nextBlogId = 4;
let nextServicioId = 4;
let nextSedeId = 3;

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

  renderView('dashboard');
  return false;
}

function logout() {
  usuarioActual = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginForm').reset();
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
    blog: 'Blog de Eventos',
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
    </div>

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
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-newspaper"></i> Blog de eventos y noticias</h3>
      <p style="color:var(--gray);margin-bottom:18px;">
        ${esAdmin
          ? 'Como administrador puedes publicar noticias y eventos oficiales del gremio.'
          : 'Comparte novedades de tu negocio: promociones, horarios especiales o noticias. El administrador modera las publicaciones.'}
      </p>

      <h3><i class="fa-solid fa-pen-to-square"></i> Nueva publicación</h3>
      <div class="form-row"><label>Título</label><input id="nb_titulo" placeholder="Ej: Promoción de traspasos este mes"></div>
      <div class="form-row"><label>Texto</label><textarea id="nb_texto" placeholder="Escribe el contenido de la publicación..."></textarea></div>
      <div class="form-grid">
        <div class="form-row"><label>Imagen (URL)</label><input id="nb_imagen" placeholder="https://ejemplo.com/foto.jpg"></div>
        <div class="form-row"><label>Video (URL de YouTube/enlace)</label><input id="nb_video" placeholder="https://youtube.com/..."></div>
      </div>
      <div class="form-row"><label>Enlace relacionado (opcional)</label><input id="nb_link" placeholder="https://..."></div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="crearPublicacion()"><i class="fa-solid fa-upload"></i> Publicar</button>
      </div>

      <h3 style="margin-top:30px;"><i class="fa-solid fa-list"></i> Publicaciones (${eventosBlog.length})</h3>
      <div class="item-list">
        ${eventosBlog.map(e => `
          <div class="item-row blog-item-row">
            <div class="blog-item-icon">
              ${e.imagen ? `<img src="${e.imagen}" alt="" onerror="this.style.display='none'">` : `<i class="fa-solid ${e.video ? 'fa-circle-play' : (e.link ? 'fa-link' : 'fa-calendar-check')}"></i>`}
            </div>
            <div class="item-row-info">
              <strong>${e.titulo}</strong>
              <small><i class="fa-regular fa-calendar"></i> ${e.fecha} · Por ${e.autor} · 👁 ${e.vistas} vistas</small>
              ${e.texto ? `<p class="blog-item-texto">${e.texto}</p>` : ''}
              <div class="blog-item-tags">
                ${e.imagen ? '<span class="tag-media"><i class="fa-solid fa-image"></i> Imagen</span>' : ''}
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
  const texto = document.getElementById('nb_texto').value.trim();
  const imagen = document.getElementById('nb_imagen').value.trim();
  const video = document.getElementById('nb_video').value.trim();
  const link = document.getElementById('nb_link').value.trim();

  if (!titulo) { showToast('Escribe un título para la publicación', false); return; }

  eventosBlog.unshift({
    id: nextBlogId++,
    titulo,
    autor: usuarioActual === 'admin' ? 'Administrador' : datosSocio.nombre,
    fecha: new Date().toLocaleDateString('es-CO'),
    vistas: 0,
    texto, imagen, video, link
  });
  renderView('blog');
  showToast('Publicación creada ✓', true);
}

function eliminarPublicacion(id) {
  if (!confirm('¿Eliminar esta publicación?')) return;
  eventosBlog = eventosBlog.filter(x => x.id !== id);
  renderView('blog');
  showToast('Publicación eliminada', true);
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

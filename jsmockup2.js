/* ============ ESTADO ============ */
let usuarioActual = null;

const datosSocio = {
  nombre: "Juan Pérez",
  email: "juan@tramitesjp.com",
  telefono: "300 123 4567",
  ciudad: "Bucaramanga",
  negocio: "Trámites JP",
  descripcion: "Especialistas en trámites de tránsito con más de 10 años de experiencia en el Área Metropolitana.",
  servicios: ["Traspaso", "Matrícula", "Duplicados"],
  redes: { facebook: "fb.com/tramitesjp", instagram: "@tramitesjp", whatsapp: "3001234567" },
  sedes: [
    { nombre: "Sede Centro", dir: "Cra 15 #34-12, Bucaramanga", horario: "8am - 5pm" },
    { nombre: "Sede Cabecera", dir: "Cl 45 #27-08, Bucaramanga", horario: "8am - 6pm" }
  ]
};

const usuariosAdmin = [
  { nombre: "Juan Pérez", email: "juan@tramitesjp.com", estado: "Activo" },
  { nombre: "María Gómez", email: "maria@gestoriamg.co", estado: "Activo" },
  { nombre: "Carlos Ruiz", email: "carlos@autotramites.com", estado: "Pendiente" },
  { nombre: "Ana Martínez", email: "ana@solucionesviales.co", estado: "Activo" }
];

const eventosBlog = [
  { titulo: "Encuentro Regional 2025", fecha: "15/03/2025", vistas: 120 },
  { titulo: "Capacitación RUNT 2.0", fecha: "02/02/2025", vistas: 89 },
  { titulo: "Asamblea General Ordinaria", fecha: "20/01/2025", vistas: 145 }
];

/* ============ LOGIN ============ */
function login(e) {
  e.preventDefault();
  const u = document.getElementById('usuario').value.trim().toLowerCase();
  if (!['admin', 'socio'].includes(u)) {
    alert('Usa "admin" o "socio" como usuario');
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
    usuarios: 'Gestión de Usuarios'
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
  `;
}

function viewPerfil() {
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-user"></i> Datos personales</h3>
      <div class="form-grid">
        <div class="form-row"><label>Nombre completo</label><input value="${datosSocio.nombre}"></div>
        <div class="form-row"><label>Email</label><input value="${datosSocio.email}"></div>
        <div class="form-row"><label>Teléfono</label><input value="${datosSocio.telefono}"></div>
        <div class="form-row"><label>Ciudad</label>
          <select>
            <option ${datosSocio.ciudad === 'Bucaramanga' ? 'selected' : ''}>Bucaramanga</option>
            <option>Floridablanca</option><option>Girón</option><option>Piedecuesta</option>
          </select>
        </div>
      </div>
      <div class="form-row"><label>Foto de perfil</label><input type="file"></div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="guardar()"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button>
      </div>
    </div>
  `;
}

function viewNegocio() {
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-store"></i> Información del negocio</h3>
      <div class="form-row"><label>Nombre del negocio</label><input value="${datosSocio.negocio}"></div>
      <div class="form-row"><label>Descripción</label><textarea>${datosSocio.descripcion}</textarea></div>
      <div class="form-row"><label>Logo del negocio</label><input type="file"></div>

      <h3 style="margin-top:25px;"><i class="fa-solid fa-share-nodes"></i> Redes sociales</h3>
      <div class="form-grid">
        <div class="form-row"><label>Facebook</label><input value="${datosSocio.redes.facebook}"></div>
        <div class="form-row"><label>Instagram</label><input value="${datosSocio.redes.instagram}"></div>
        <div class="form-row"><label>WhatsApp</label><input value="${datosSocio.redes.whatsapp}"></div>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" onclick="guardar()"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button>
      </div>
    </div>
  `;
}

function viewServicios() {
  const todos = ['Traspaso', 'Matrícula', 'Licencia', 'Comparendos', 'Duplicados'];
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-screwdriver-wrench"></i> Servicios ofrecidos</h3>
      ${todos.map(s => `
        <div class="form-row" style="display:flex;align-items:center;gap:10px;">
          <input type="checkbox" id="serv_${s}" ${datosSocio.servicios.includes(s) ? 'checked' : ''} style="width:auto;">
          <label for="serv_${s}" style="margin:0;cursor:pointer;">${s}</label>
        </div>
      `).join('')}
      <div class="form-actions">
        <button class="btn btn-primary" onclick="guardar()"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
      </div>
    </div>
  `;
}

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
            <button class="btn btn-outline btn-sm" onclick="guardar()"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-outline btn-sm" onclick="guardar()"><i class="fa-solid fa-trash"></i></button>
          </div>
        `).join('')}
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="guardar()"><i class="fa-solid fa-plus"></i> Agregar nueva sede</button>
      </div>
    </div>
  `;
}

function viewBlog() {
  const esAdmin = usuarioActual === 'admin';
  return `
    <div class="panel">
      <h3><i class="fa-solid fa-newspaper"></i> Eventos y encuentros ${esAdmin ? '(modo admin)' : ''}</h3>
      ${esAdmin ? `
        <div class="form-row"><label>Título del evento</label><input placeholder="Ej: Encuentro Regional 2025"></div>
        <div class="form-row"><label>Descripción</label><textarea placeholder="Describe el evento..."></textarea></div>
        <div class="form-grid">
          <div class="form-row"><label>Fecha</label><input type="date"></div>
          <div class="form-row"><label>Imagen</label><input type="file"></div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" onclick="guardar()"><i class="fa-solid fa-upload"></i> Publicar evento</button>
        </div>
        <h3 style="margin-top:30px;"><i class="fa-solid fa-list"></i> Eventos publicados</h3>
      ` : ''}
      <div class="item-list">
        ${eventosBlog.map(e => `
          <div class="item-row">
            <i class="fa-solid fa-calendar-check" style="font-size:1.5rem;color:var(--primary);"></i>
            <div class="item-row-info">
              <strong>${e.titulo}</strong>
              <small><i class="fa-regular fa-calendar"></i> ${e.fecha} · 👁 ${e.vistas} vistas</small>
            </div>
            ${esAdmin ? `
              <button class="btn btn-outline btn-sm" onclick="guardar()"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-outline btn-sm" onclick="guardar()"><i class="fa-solid fa-trash"></i></button>
            ` : `
              <button class="btn btn-outline btn-sm">Leer <i class="fa-solid fa-arrow-right"></i></button>
            `}
          </div>
        `).join('')}
      </div>
    </div>
  `;
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
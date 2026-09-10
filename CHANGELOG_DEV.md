# Changelog de Desarrollo — ASOTRÁNSITO AMB

## [2026-09-10] - Tarea: CRUD real en Plataforma Interna, landing pública por socio, ocultar teléfono institucional y créditos de desarrollador

### Archivos modificados
- `js/mockup2.js` — Reescritura completa del panel de socio/admin.
- `js/socios-data.js` — **(Nuevo)** Base de datos compartida de socios (usada por el panel y por la landing pública).
- `perfil.html` — **(Nuevo)** Landing pública individual por socio (`perfil.html?socio=juan-perez`).
- `css/perfil.css` — **(Nuevo)** Estilos de la landing pública de socio.
- `css/mockup2.css` — Estilos nuevos: `panel-highlight`, `link-copy-box`, `preview-frame`, tarjetas de blog multimedia, `sidebar-dev-credit`.
- `css/comparacion.css` — Estilos nuevos: flujo de administración (`admin-flow-*`), tarjetas "web pública de la plataforma" (`web-publica-*`).
- `css/shared.css` — Estilos nuevos: banner identificador de propuesta (`propuesta-banner`), crédito de desarrollador (`dev-credit`).
- `mockup1.html` — Banner "PROPUESTA 1"; número de teléfono institucional retirado del footer (queda solo como enlace funcional de WhatsApp, sin texto visible); crédito de desarrollador agregado.
- `mockup2.html` — Banner "PROPUESTA 2" (login y panel); login ahora exige contraseña (`admin123` / `socio123`); nuevo ítem de menú "Mi página web" (solo socio); crédito de desarrollador agregado (pantalla de login y sidebar).
- `comparacion.html` — Nueva sección "¿Quién administra cada cambio?" (flujo comparado paso a paso); nueva sección "La Plataforma Interna también es una página web pública"; número institucional retirado de dos lugares; crédito de desarrollador agregado.
- `index.html` — Número institucional retirado de la barra de navegación; crédito de desarrollador agregado.

### Cambio técnico
**Panel de socio con CRUD real:** `js/mockup2.js` pasó de datos estáticos de solo lectura a un modelo con `servicios` y `sedes` como arrays de objetos con `id`, y funciones `crear/editar/eliminar` para cada uno (usando `prompt()`/`confirm()` como UI simplificada de mockup). El blog (`eventosBlog`) ahora guarda `texto`, `imagen` (URL), `video` (URL) y `link` por publicación, y tanto `admin` como `socio` pueden publicar — cada quien puede borrar solo lo propio (`e.autor === datosSocio.nombre`), el admin puede borrar cualquier publicación.

**Landing pública por socio:** se extrajo la información del socio a `js/socios-data.js` (objeto `SOCIOS_DB` indexado por `slug`), compartido entre el panel interno (`mockup2.js`) y la nueva página standalone `perfil.html`, que lee `?socio=<slug>` de la URL y renderiza una página de negocio completa (servicios, sedes, redes, botón de WhatsApp propio del socio) sin necesidad de iniciar sesión — es el link que cada socio comparte como su página personal. Dentro del panel, la vista `previsualizar` muestra esa misma página en un `<iframe>` más un campo de link con botón "Copiar".

**Login con credenciales reales:** se agregó un objeto `credenciales = { admin: 'admin123', socio: 'socio123' }` y la validación correspondiente en `login()`, reemplazando el login anterior que aceptaba cualquier contraseña.

**Ocultamiento del teléfono institucional:** se identificaron y corrigieron todos los puntos donde el número `319 305 3012` aparecía como texto plano visible (footers, nav, CTA). Se conservó únicamente dentro de atributos `href="https://wa.me/..."`, que abren WhatsApp sin exponer el número en pantalla. Los botones de WhatsApp de las tarjetas de socio (mockup1) ya no mostraban el número — no requirieron cambios.

### Cambio funcional (usuario final)
- **El socio ahora administra su negocio de verdad dentro del mockup**: puede agregar, editar y eliminar sus propios servicios y sedes, sin depender de nadie.
- **El blog admite contenido multimedia**: título, texto, imagen, video y enlace — tanto el administrador como cada socio pueden publicar sus propias novedades.
- **Cada socio tiene su propia página web para compartir**, con su negocio, servicios, sedes y botón de WhatsApp propio — accesible mediante un link único que puede pegar en redes sociales o WhatsApp, sin pasar por el portal general de la asociación. Desde su panel puede ver una vista previa en vivo y copiar el link con un clic.
- **El acceso a la Plataforma Interna ahora requiere contraseña real** (`admin` / `admin123` o `socio` / `socio123`), quedando visibles como pista en la propia pantalla de login.
- **Cada mockup indica en texto grande cuál propuesta es** (Propuesta 1 o Propuesta 2), evitando confusión al presentar al cliente.
- **El número de WhatsApp institucional de la asociación ya no aparece como texto en ningún lugar del sitio** — solo funciona como botón, protegiendo el dato mientras se mantiene 100% funcional.
- **Todas las páginas incluyen el crédito y contacto del desarrollador** (Jesus Zappa, Ingeniero de Sistemas) en el pie de página, con WhatsApp directo y enlace a kuantis.github.io/.dev.

### Dependencias afectadas
- `mockup2.html` ahora carga `js/socios-data.js` antes de `js/mockup2.js` (orden de scripts relevante: `SOCIOS_DB` debe existir antes de que `mockup2.js` lo consuma).
- `perfil.html` depende únicamente de `js/socios-data.js` — no requiere `mockup2.js` ni login, es una página pública independiente.
- Ningún backend ni base de datos real — los cambios hechos por el socio (servicios, sedes, blog) viven solo en memoria del navegador durante la sesión, tal como corresponde a un mockup de demostración.

## [2026-09-10] - Tarea: Estructuración del proyecto para GitHub Pages + página de comparación comercial

### Archivos modificados
- `index.html` — Se agregó tercera tarjeta de navegación "Análisis Comercial" y enlace en el menú principal.
- `mockup1.html` — Se agregaron enlaces de navegación a "Inicio" y "Comparación" en el header.
- `mockup2.html` — Se agregaron enlaces "Ver análisis comercial" e "Inicio" en la pantalla de login.
- `css/mockup2.css` — Ajuste de espaciado (`margin-top`) en `.login-back` para acomodar los 3 enlaces apilados de la pantalla de login.
- `comparacion.html` — **(Nuevo)** Página de análisis comercial completa: cuadro comparativo, desglose de costos, proyección de ROI, argumentos de venta, roadmap de fases y de integraciones futuras.
- `css/comparacion.css` — **(Nuevo)** Estilos de la página de comparación comercial.
- `css/shared.css`, `css/mockup1.css`, `css/mockup2.css` — Reubicados desde la raíz del proyecto (`cssshared.css`, `cssmockup1.css`, `cssmockup2.css`) a la carpeta `css/`, tal como los HTML ya los referenciaban.
- `js/mockup1.js`, `js/mockup2.js` — Reubicados desde la raíz (`jsmockup1.js`, `jsmockup2.js`) a la carpeta `js/`.
- `.gitignore` — **(Nuevo)** Excluye metadata local de herramientas (`.agents/`, `skills-lock.json`) del repositorio.

### Cambio técnico
El proyecto tenía los archivos CSS/JS sueltos en la raíz con nombres tipo `cssmockup1.css`, mientras que los HTML ya apuntaban a `css/mockup1.css` (rutas con subcarpeta). Se corrigió moviendo cada archivo a la estructura de carpetas esperada (`css/`, `js/`) para que las rutas relativas funcionen correctamente al servir el sitio como estático en GitHub Pages. Se creó `comparacion.html` como página independiente con su propio CSS (`css/comparacion.css`), consumiendo `css/shared.css` para mantener consistencia visual (header, botones, contenedor) con el resto del sitio. Se inicializó el repositorio Git en la raíz del proyecto.

### Cambio funcional (usuario final)
El sitio ahora tiene 3 páginas navegables entre sí desde el mismo repositorio/dominio de GitHub Pages:
1. **Inicio** (`index.html`) — portada con acceso a las 3 secciones.
2. **Portal Público** (`mockup1.html`) — mockup del directorio de tramitadores.
3. **Plataforma Interna** (`mockup2.html`) — mockup del panel con login simulado.
4. **Análisis Comercial** (`comparacion.html`) — página nueva con el cuadro comparativo completo (costos, ROI, argumentos de venta, roadmap de fases e integraciones futuras) para presentar al cliente y sustentar la decisión entre ambas opciones.

Todas las páginas están enlazadas entre sí mediante menús de navegación, permitiendo al cliente moverse libremente entre el contexto comercial y los mockups funcionales.

### Dependencias afectadas
- Ninguna base de datos ni servicio externo (proyecto 100% estático).
- Depende de Font Awesome vía CDN (`cdnjs.cloudflare.com`) para iconografía — ya en uso previamente en el proyecto.
- Hosting objetivo: GitHub Pages (branch `main` o carpeta `/docs`, a definir por el usuario al configurar el repositorio remoto).

/* ============================================================
   MUVEX — Medición de comportamiento (GA4)
   Compartido por la portada, /fletes/ y /tipos-de-mudanza/.
   Eventos:
   - scroll_profundidad  { porcentaje: 25|50|75|100 }
   - ver_seccion         { seccion: id de la <section> }
   - clic_interno        { destino: '/fletes/' | '/tipos-de-mudanza/...', ubicacion }
   Todos llevan además { pagina }. Cada evento se manda una sola vez por carga.
   ============================================================ */
(function () {
  if (typeof window.gtag !== 'function') return;

  var path = location.pathname.replace(/index\.html$/, '');
  var pagina = path === '/' ? 'inicio' : path.replace(/^\/|\/$/g, '') || 'inicio';

  function enviar(nombre, params) {
    params = params || {};
    params.pagina = pagina;
    try { window.gtag('event', nombre, params); } catch (e) {}
  }

  // ── 1. Profundidad de scroll ───────────────────────────────
  var marcas = [25, 50, 75, 100];
  var enviadas = {};
  var pendiente = false;
  function revisarScroll() {
    pendiente = false;
    var doc = document.documentElement;
    var alto = doc.scrollHeight - window.innerHeight;
    var pct = alto <= 0 ? 100 : ((window.scrollY || doc.scrollTop) / alto) * 100;
    for (var i = 0; i < marcas.length; i++) {
      var m = marcas[i];
      if (!enviadas[m] && pct >= m - 2) {
        enviadas[m] = true;
        enviar('scroll_profundidad', { porcentaje: String(m) });
      }
    }
    if (enviadas[100]) window.removeEventListener('scroll', alScroll);
  }
  function alScroll() {
    if (!pendiente) { pendiente = true; requestAnimationFrame(revisarScroll); }
  }
  window.addEventListener('scroll', alScroll, { passive: true });

  // ── 2. Secciones vistas ────────────────────────────────────
  // Cuenta cuando la sección cruza la línea media de la pantalla
  // (funciona igual con secciones cortas o muy largas).
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id || e.target.getAttribute('data-seccion');
        if (id) enviar('ver_seccion', { seccion: id });
        obs.unobserve(e.target);
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
    document.querySelectorAll('section[id], section [id="comparar"]').forEach(function (s) {
      obs.observe(s);
    });
  }

  // ── 3. Clics hacia las páginas internas ────────────────────
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;
    var url;
    try { url = new URL(a.getAttribute('href'), location.href); } catch (e) { return; }
    if (url.host !== location.host) return;
    if (!/^\/(fletes|tipos-de-mudanza)\//.test(url.pathname)) return;
    if (url.pathname === location.pathname) return; // ancla dentro de la misma página
    var sec = a.closest('section[id], nav, footer');
    enviar('clic_interno', {
      destino: url.pathname + (url.hash || ''),
      ubicacion: sec ? (sec.id || sec.tagName.toLowerCase()) : 'otro'
    });
  }, true);
})();

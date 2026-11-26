/*
  Animaciones de las páginas internas (fletes y tipos de mudanza), sin librerías.
  En vez de escuchar el evento "scroll" (falla en el navegador interno de WhatsApp y en algunos
  iPhone), la página se cubre con franjas invisibles de 24 px y un IntersectionObserver avisa
  cuáles están en pantalla. Con eso se sabe qué parte de la página está mirando la persona.
  Sin JS o con "menos movimiento" todo se ve quieto y completo.
*/
(function() {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('fl-anim');

  function $(s) { return document.querySelector(s); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function docTop(el) { return el.getBoundingClientRect().top + window.pageYOffset; }

  /* ---------- Sensor de vista ---------- */
  var probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:absolute;left:0;top:0;width:1px;opacity:0;pointer-events:none';
  document.body.appendChild(probe);
  var SL = 24, seen = new Map(), raf = 0;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && e.intersectionRect.height > 0) {
        var y = +e.target.getAttribute('data-y') + (e.intersectionRect.top - e.boundingClientRect.top);
        seen.set(e.target, [y, y + e.intersectionRect.height]);
      } else seen.delete(e.target);
    });
    if (!raf) raf = requestAnimationFrame(function() { raf = 0; update(); });
  }, { threshold: [0, .25, .5, .75, 1] });

  function buildProbe() {
    io.disconnect(); seen.clear(); probe.innerHTML = ''; probe.style.height = '0px';
    var H = document.documentElement.scrollHeight;
    probe.style.height = H + 'px';
    var frag = document.createDocumentFragment();
    for (var y = 0; y < H; y += SL) {
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;left:0;top:' + y + 'px;width:1px;height:' + SL + 'px';
      d.setAttribute('data-y', y);
      frag.appendChild(d);
    }
    probe.appendChild(frag);
    Array.prototype.forEach.call(probe.childNodes, function(d) { io.observe(d); });
  }
  function view() {
    if (!seen.size) return null;
    var a = Infinity, b = -Infinity;
    seen.forEach(function(r) { if (r[0] < a) a = r[0]; if (r[1] > b) b = r[1]; });
    return { top: a, h: b - a };
  }

  /* ---------- Hero: el camión se va cuando bajás ---------- */
  var hero = $('.fl-hero'), scene = $('.fl-scene');

  /* ---------- Ruta con el camioncito (solo en la página de fletes) ---------- */
  var route = $('#fl-route'), svg = $('#fl-map');
  var base = $('#fl-road-base'), line = $('#fl-road-line'), trail = $('#fl-road-trail');
  var van = $('#fl-van'), pinsG = $('#fl-pins');
  var stops = Array.prototype.slice.call(document.querySelectorAll('.fl-stop'));
  var NS = 'http://www.w3.org/2000/svg';
  var samples = [], total = 0, stopYs = [], H = 0, routeTop = 0, mobile = false;
  var cur = 40, target = 40, outCur = 0, outTarget = 0, loop = 0;

  function buildRoute() {
    if (!route) return;
    var W = route.clientWidth; H = route.clientHeight; routeTop = docTop(route);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    mobile = W < 760;
    var cx = mobile ? 44 : W / 2, A = mobile ? 16 : Math.min(W * 0.16, 170);
    var START = 40;
    var pts = [[cx, START]];
    stopYs = stops.map(function(s, i) { var y = s.offsetTop + s.offsetHeight / 2; pts.push([cx + (i % 2 ? A : -A), y]); return y; });
    pts.push([cx, H]);
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var x0 = pts[i - 1][0], y0 = pts[i - 1][1], x1 = pts[i][0], y1 = pts[i][1], m = (y1 - y0) / 2;
      d += ' C' + x0 + ',' + (y0 + m) + ' ' + x1 + ',' + (y1 - m) + ' ' + x1 + ',' + y1;
    }
    [base, line, trail].forEach(function(p) { p.setAttribute('d', d); });
    base.setAttribute('stroke-width', mobile ? 22 : 30);
    total = trail.getTotalLength();
    trail.style.strokeDasharray = total;
    samples = [];
    for (var k = 0, N = 600; k <= N; k++) { var l = total * k / N; samples.push({ l: l, y: trail.getPointAtLength(l).y }); }
    pinsG.innerHTML = '';
    pts.slice(1, -1).forEach(function(p, i) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(' + p[0] + ',' + p[1] + ')');
      g.innerHTML = '<g class="fl-pin"><circle r="' + (mobile ? 17 : 22) + '" fill="#fff" stroke="#0E1320" stroke-width="3"/>' +
        '<text text-anchor="middle" dy="6" font-family="Outfit, sans-serif" font-weight="800" font-size="' + (mobile ? 15 : 18) + '" fill="#0E1320">' + (i + 1) + '</text></g>';
      pinsG.appendChild(g);
    });
    placeVan(cur, true);
  }
  function lenAtY(y) {
    var lo = 0, hi = samples.length - 1;
    while (lo < hi) { var mid = (lo + hi) >> 1; if (samples[mid].y < y) lo = mid + 1; else hi = mid; }
    var b = samples[lo], a = samples[Math.max(lo - 1, 0)];
    return b.y === a.y ? b.l : a.l + (b.l - a.l) * (y - a.y) / (b.y - a.y);
  }
  function placeVan(y, force) {
    if (!samples.length) return;
    var l = clamp(lenAtY(y), 0, total);
    var p = trail.getPointAtLength(l), q = trail.getPointAtLength(Math.min(total, l + 2)), o = trail.getPointAtLength(Math.max(0, l - 2));
    var ang = Math.atan2(q.y - o.y, q.x - o.x) * 180 / Math.PI;
    van.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ') rotate(' + ang + ') scale(' + (mobile ? .7 : 1) + ')');
    trail.style.strokeDashoffset = total - l;
    var pins = pinsG.querySelectorAll('.fl-pin');
    stopYs.forEach(function(sy, i) {
      var on = y >= sy - 4, pin = pins[i];
      if (!pin || (pin._on === on && !force)) return;
      pin._on = on;
      pin.style.transform = on ? 'scale(1.25)' : 'scale(1)';
      pin.querySelector('circle').setAttribute('fill', on ? '#FF6C0E' : '#fff');
      pin.querySelector('circle').setAttribute('stroke', on ? '#FF6C0E' : '#0E1320');
      pin.querySelector('text').setAttribute('fill', on ? '#fff' : '#0E1320');
      stops[i].querySelector('.fl-card').classList.toggle('active', on);
    });
  }

  /* ---------- Apariciones ---------- */
  var reveals = [];
  stops.forEach(function(s) { reveals.push({ el: s, at: .78 }); });
  // Tarjetas y escenas que aparecen al bajar (páginas de mudanza)
  Array.prototype.forEach.call(document.querySelectorAll('.mz-reveal'), function(el) { reveals.push({ el: el, at: .85, once: true }); });
  var cta = $('.fl-cta');
  if (cta) reveals.push({ el: cta, at: .7, once: true });
  function measure() { reveals.forEach(function(r) { r.top = docTop(r.el); }); }

  /* ---------- Todo se mueve desde acá ---------- */
  function tick() {
    cur += (target - cur) * .16;
    outCur += (outTarget - outCur) * .2;
    if (Math.abs(target - cur) < .5) cur = target;
    if (Math.abs(outTarget - outCur) < .002) outCur = outTarget;
    placeVan(cur);
    if (scene) scene.style.setProperty('--out', outCur.toFixed(4));
    loop = (cur !== target || outCur !== outTarget) ? requestAnimationFrame(tick) : 0;
  }
  function update() {
    var v = view(); if (!v) return;
    outTarget = hero ? clamp((v.top - hero.offsetHeight * .15) / (hero.offsetHeight * .7), 0, 1) : 0;
    target = route ? clamp(v.top + v.h * .55 - routeTop, 40, H) : 40;
    reveals.forEach(function(r) {
      var show = r.top < v.top + v.h * r.at;
      if (r.once && r.on) return;
      if (show !== r.on) { r.on = show; r.el.classList.toggle('fl-in', show); }
    });
    if (!loop) loop = requestAnimationFrame(tick);
  }

  var sceneObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { e.target.classList.toggle('run', e.isIntersecting); });
  }, { threshold: .35 });
  Array.prototype.forEach.call(document.querySelectorAll('.mz-scene'), function(el) { sceneObs.observe(el); });

  function rebuild() { buildRoute(); measure(); buildProbe(); }
  rebuild();
  var rt;
  window.addEventListener('resize', function() { clearTimeout(rt); rt = setTimeout(rebuild, 200); });
  window.addEventListener('load', rebuild);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);
  // Si cambia el alto de la página (se abre una pregunta frecuente, carga una imagen) se recalcula
  if ('ResizeObserver' in window) {
    var lastH = 0;
    new ResizeObserver(function() {
      var h = document.body.offsetHeight;
      if (Math.abs(h - lastH) > 40) { lastH = h; clearTimeout(rt); rt = setTimeout(rebuild, 150); }
    }).observe(document.body);
  }
})();

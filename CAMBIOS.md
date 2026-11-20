# Cambios de la web Muvex

## 2026-11-20 — Iconos de cobertura

- Diseño aprobado: opción 1, línea moderna naranja sobre fondo naranja suave.
- Base Central: ubicación con casa. Zonas de Verano: sol y ondas. Rutas Nacionales: carretera con bordes inclinados y línea central discontinua, según la referencia de Freddy.
- Implementación en `index.html` mediante SVG en línea, sin dependencias ni imágenes adicionales.
- Iconos de 64 px en escritorio y 56 px en móvil; trazos redondeados y títulos alineados con los iconos.
- Se conservan las ciudades, las tarjetas y la disposición de una columna en móvil.
- SVG decorativos ocultos a lectores de pantalla porque el título contiguo identifica cada categoría.
- Verificación: `git diff --check` correcto; comparación automática contra HEAD confirma los mismos títulos y 28 ciudades.
- Revisión visual pendiente: el entorno impidió iniciar el servidor local y la política del navegador bloqueó abrir el archivo local. Cambios guardados en el proyecto; sin publicación.

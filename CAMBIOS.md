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

## 2026-11-20 — Iconos de «Por qué elegirnos»

- Se aplica el mismo estilo de línea moderna aprobado para cobertura: naranja, fondo naranja suave y trazos redondeados.
- Personal: equipo de personas. Puntualidad: reloj con verificación. Cuidado: caja con escudo. Maniobras: gancho de izamiento con caja suspendida. Formalidad: documento con tarjeta de pago.
- Contenedores de 64 px y SVG de 40 px en escritorio; 56 px y 36 px en móvil. Separación reducida en móvil para dar espacio a los textos.
- Se conservan todos los títulos, descripciones y la estructura de la sección. La cobertura no cambia.
- SVG decorativos en línea, sin dependencias ni descargas de imágenes.
- Verificación: cinco SVG XML válidos, comparación de textos y estructura con HEAD y `git diff --check` correctos.
- Se generó una propuesta visual orientativa; no es una captura del navegador. Revisión en navegador pendiente por las restricciones del entorno ya detectadas.
- Cambios guardados en `index.html` y este registro; pendientes de commit, push y deploy por parte de Freddy.

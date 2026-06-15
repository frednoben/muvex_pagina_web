document
  .getElementById('formulario')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const f = this;

    //--- Rellenamos la plantilla
    t_numero.textContent       = f.numero.value;
    t_fecha.textContent        = f.fecha.value;
    t_cliente.textContent      = f.cliente.value;
    t_telefono.textContent     = f.telefono.value;
    t_origen.textContent       = f.origen.value;
    t_destino.textContent      = f.destino.value;
    t_volumen.textContent      = f.volumen.value;
    t_fecha_mudanza.textContent= f.fecha_mudanza.value;

    const plantilla = document.getElementById('plantilla');

    /* 1️⃣  Mostrar la plantilla (fuera de la pantalla para que el usuario no la vea) */
    plantilla.style.display = 'block';
    plantilla.style.position = 'absolute';
    plantilla.style.left = '-9999px';

    /* 2️⃣  Generar el PDF */
    await html2pdf()
      .set({
        margin: 10,
        filename: `presupuesto_${f.cliente.value}.pdf`,
        image:   { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF:   { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(plantilla)
      .save();

    /* 3️⃣  Volver a ocultar la plantilla */
    plantilla.style.display = 'none';
  });
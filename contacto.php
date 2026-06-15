<?php
$nombre = $_POST['nombre'];
$direccion = $_POST['direccion'];
$ciudad = $_POST['ciudad'];
$datos = $_POST['datos'];
$correo = $_POST['correo'];
$mensaje = $_POST['mensaje'];
$para = 'info@muvexsa.com,';
$titulo = 'Desde el Formulario de Contactenos de MUVEX SA';
$msjCorreo = "Nombre: $nombre \n\n Direccion: $direccion \n\n Ciudad: $ciudad \n\n Datos de Contacto: $datos \n\n Correo: $correo \n\n Mensaje:\n $mensaje";
  
if ($_POST['submit']) {
if (mail($para, $titulo, $msjCorreo, $header)) {
echo "<script language='javascript'>
    // Esto le avisa a Google que la mudanza se cotizó con éxito
    gtag('event', 'conversion', {'send_to': 'AW-17824651050/tu_id_de_conversion'}); 
    
    alert('Mensaje enviado! Muchas gracias por contactarnos...');
    window.location.href = 'https://www.muvexsa.com/index.html';
    </script>";
} else {
echo 'Falló el envio';
}
}
?>

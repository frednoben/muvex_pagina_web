<?php
$nombre = $_POST['nombre'];
$direccion = $_POST['direccion'];
$ciudad = $_POST['ciudad'];
$datos = $_POST['datos'];
$correo = $_POST['correo'];
$mensaje = $_POST['mensaje'];
$para = 'roseliromero@gmail.com,info@muvexsa.com,';
$titulo = 'Desde el Formulario de Contactenos de MUVEX SA';
$msjCorreo = "Nombre: $nombre \n\n Direccion: $direccion \n\n Ciudad: $ciudad \n\n Datos de Contacto: $datos \n\n Correo: $correo \n\n Mensaje:\n $mensaje";
  
if ($_POST['submit']) {
if (mail($para, $titulo, $msjCorreo, $header)) {
echo "<script language='javascript'>
alert('Mensaje enviado!   Muchas gracias por contactarnos, en breve nos estaremos comunicando con usted.');
window.location.href = 'https://www.r2visual.com.py/muvex/index.html';
</script>";
} else {
echo 'Falló el envio';
}
}
?>

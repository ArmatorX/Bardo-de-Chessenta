const PantallaReproductor = require('./src/PantallaReproductor');
const PantallaABMCancion = require('./src/PantallaABMCancion');
const reproductor = new PantallaReproductor();
const abmCancion = new PantallaABMCancion();
const http = require('http');
const pantallas = {
	Nada: 0,
	PantallaReproductor: 1,
	PantallaRegistrar: 2,
	PantallaEditar: 3,
	PantallaConsultar: 4,
	Redireccionar: 5
}

http.createServer(function (req, res) {
	var pantallaAMostrar;
	
	// Si el archivo de canciones está vacío o no existe, escaneamos en busca de canciones.
	if (reproductor.archivoCancionesEstaVacio()) {
		reproductor.escaneoRapidoCanciones();
	}
	
	if (req.url.startsWith('/reproducir/')) {
		// Reproducir una canción.
		// Seteamos la pantalla a mostrar.
		pantallaAMostrar = pantallas.PantallaReproductor;
		
		// Obtenemos el id de la canción.
		var id = req.url.replace("/reproducir/id=", "");
		
		// Lo enviamos a la función del reproductor.
		reproductor.reproducirCancion(parseInt(id, 10));
	} else if (req.url.startsWith('/detener/')) {
		// Detener la reproducción actual.
		// Seteamos la pantalla a mostrar.
		pantallaAMostrar = pantallas.PantallaReproductor;
		
		reproductor.detenerReproducción();
	} else if (req.url.startsWith('/desconectar/')) {
		// Desconectar al bot del canal de voz.
		// Seteamos la pantalla a mostrar.
		pantallaAMostrar = pantallas.PantallaReproductor;
		
		reproductor.desconectarBot();
	} else if (req.url.startsWith('/editar/')) {
		// Editar una canción guardada.
		// Seteamos la pantalla a mostrar.
		pantallaAMostrar = pantallas.PantallaEditar;
		
		var id = req.url.replace("/editar/id=", "");
		
	} else if (req.url.startsWith('/consultar/')) {
		// Editar una canción guardada.
		// Seteamos la pantalla a mostrar.
		pantallaAMostrar = pantallas.PantallaConsultar;
		
		var id = req.url.replace("/consultar/id=", "");
		
	} else if (req.url.startsWith('/registrar/')) {
		// Registrar una canción.
		if (req.url.startsWith('/registrar/procesarDatos/')) {
			// Procesar el formulario de registro de canción.
			// Seteamos la pantalla a mostrar.
			pantallaAMostrar = pantallas.Redireccionar;
		} else {
			// Crear el formulario de registro y mostrarlo.			
			// Seteamos la pantalla a mostrar.
			pantallaAMostrar = pantallas.PantallaRegistrar;
		}
	} else {
		pantallaAMostrar = pantallas.PantallaReproductor;
	}
	
	// Creamos la página HTML, y la mostramos.
	res.writeHead(200, {'Content-Type': 'text/html; charset=latin1'});
	
	if (pantallaAMostrar == pantallas.Redireccionar) {
		// Redireccionamos a la consulta de la canción ya creada.
		// Obtenemos los datos de la canción.
		let datos = '';
		req.on('data', chunk => {datos += chunk.toString()});
		
		req.on('end', () => {
			id = abmCancion.registrarCancionDesdeFormulario(datos);
			res.writeHead(301, { "Location": `http://localhost:8080/consultar/id=${id}`});
			res.end();
		});
	} else {
		if (pantallaAMostrar == pantallas.PantallaReproductor) {
			// Mostramos la lista de canciones.
			res.write(reproductor.crearListaCancionesHtml());
			
			// Mostramos la barra de comandos.
			res.write(reproductor.crearBarraComandosHtml());
		} else if (pantallaAMostrar == pantallas.PantallaRegistrar) {
			// Mostramos la barra de navegación.
			
			// Mostramos el formulario.
			res.write(abmCancion.crearFormularioRegistrarHtml());
		} else if (pantallaAMostrar == pantallas.PantallaConsultar) {
			// Mostramos el formulario.
			res.write(abmCancion.mostrarCancionPorPantalla(id));
		} else if (pantallaAMostrar == pantallas.PantallaEditar) {
			// Mostramos el formulario.
			res.write(abmCancion.modificarCancion(id));
		}
		res.end();
	}
}).listen(8080); 


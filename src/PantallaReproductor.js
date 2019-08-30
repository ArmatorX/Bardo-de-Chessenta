const ControladorReproductor = require('./ControladorReproductor');
const gestor = new ControladorReproductor();
const BrokerHTML = require('./BrokerHTML');
const html = new BrokerHTML();

/**
 * Hace de interfaz entre el usuario y la aplicación para las funciones principales del reproductor.
 */
class PantallaReproductor {
	/**
	 * Obtiene la lista de canciones guardadas, y las formatea para ser mostradas por pantalla.
	 * @returns {string} Cadena con formato HTML que se va a mostrar.
	 */
	crearListaCancionesHtml() {
		// Obtener canciones guardadas.
		var listaCanciones = gestor.obtenerCancionesGuardadas();
		
		// Devolvemos la lista con formato html.
		// TODO: Cambiar este desastre ilegible.
		// TODO: Cambiar la descripción del método.
		return html.crearListaOrdenada(listaCanciones.map(cancion => 
		html.crearVinculo(cancion.nombrePersonalizado, `http://localhost:8080/reproducir/id=${cancion.id}`) + ' ' +
		html.crearVinculo('[Editar]', `http://localhost:8080/editar/id=${cancion.id}`) + ' ' +
		html.crearVinculo('[Ver]', `http://localhost:8080/consultar/id=${cancion.id}`)));
	}
	
	/**
	 * Crea una lista con links para navegar a través de la página, y dar los diferentes comandos al bot.
	 * @returns {string} Cadena con formato HTML que se va a mostrar.
	 */
	crearBarraComandosHtml() {
		// TODO: Resolver el vínculo de reproducir.
		// Creamos los botones.
		var btnReproducir = html.crearVinculo('Reproducir', '');
		var btnDetener = html.crearVinculo('Detener', 'http://localhost:8080/detener/');
		var btnDesconectarBot = html.crearVinculo('Desconectar Bot', 'http://localhost:8080/desconectar/');
		var btnAgregarCancion = html.crearVinculo('Agregar una canción', 'http://localhost:8080/registrar/');
		
		// Creamos la lista de botones.
		var listaBotones = [btnReproducir, btnDetener, btnDesconectarBot, btnAgregarCancion];
		
		// Devolvemos la lista en formato html.
		return html.crearSeccion('BarraComandos', html.crearListaNoOrdenada(listaBotones));
	}

	/**
	 * Reproduce una canción a partir del id.
	 * @param {number} id - Id de la canción que se quiere reproducir.
	 */
	reproducirCancion(id) {
		gestor.reproducirCancion(id);
	}

	/**
	 * Detiene la reproducción actual.
	 */
	detenerReproducción() {
		gestor.detenerReproducción();
	}

	/**
	 * Desconecta al bot del canal de voz al que está conectado.
	 */
	desconectarBot() {
		gestor.desconectarBot();
	}
	
	/**
	 * Verifica si el archivo de canciones está vacío/no fue creado.
	 * @returns {boolean} Verdadero si está vacío/no fue creado.
	 */
	archivoCancionesEstaVacio() {
		return gestor.archivoCancionesEstaVacio();
	}
	
	/**
	 * Crea/actualiza el archivo de canciones con las canciones que estén en la ruta por defecto en ese momento.
	 */
	escaneoRapidoCanciones() {
		gestor.escaneoRapidoCanciones();
	}
}

module.exports = PantallaReproductor;
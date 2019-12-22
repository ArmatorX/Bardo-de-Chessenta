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
		html.crearVinculo(cancion.nombrePersonalizado, `/reproducir/id=${cancion.id}`) + ' ' +
		html.crearVinculo('[Editar]', `/editar/id=${cancion.id}`) + ' ' +
		html.crearVinculo('[Ver]', `/consultar/id=${cancion.id}`)));
	}
	
	/**
	 * Obtiene la lista de efectos guardados, y los formatea para mostrarlos por pantalla.
	 * @returns {string} Cadena con formato HTML que se va a mostrar.
	 */
	crearListaEfectosHtml() {
		// Obtener canciones guardadas.
		var listaEfectos = gestor.obtenerEfectosGuardados();
		
		// Devolvemos la lista con formato html.
		// TODO: Cambiar este desastre ilegible.
		// TODO: Cambiar la descripción del método.
		return html.crearListaOrdenada(listaEfectos.map(efecto => 
		html.crearVinculo(efecto.nombrePersonalizado, `/reproducirEfecto/id=${efecto.id}`)));
		//  + ' ' +
		// html.crearVinculo('[Editar]', `/editar/id=${efecto.id}`) + ' ' +
		// html.crearVinculo('[Ver]', `/consultar/id=${efecto.id}`)));
	}
	
	/**
	 * Crea una lista con links para navegar a través de la página, y dar los diferentes comandos al bot.
	 * @returns {string} Cadena con formato HTML que se va a mostrar.
	 */
	crearBarraComandosHtml() {
		// TODO: Resolver el vínculo de reproducir.
		// Creamos los botones.
		var btnReproducir = html.crearVinculo('Reproducir', '');
		var btnDetener = html.crearVinculo('Detener', '/detener/');
		var btnDesconectarBot = html.crearVinculo('Desconectar Bot', '/desconectar/');
		var btnAgregarCancion = html.crearVinculo('Agregar una canción', '/registrar/');
		
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
	 * Reproduce un efecto de sonido a partir de un id.
	 * @param {number} id - Id del efecto que se quiere reproducir.
	 */
	reproducirFX(id) {
		gestor.reproducirFX(id);
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
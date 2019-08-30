const config = require('../config.json').carpetas;
const Cancion = require("./clases/Cancion");
const Bot = require('./Bot');
const bot = new Bot();
const fs = require('fs');

/**
 * Se encarga de realizar todas las funciones de la aplicación relacionadas con la reproducción de streams de audio.
 */
class ControladorReproductor {
	/**
	 * Escanea una carpeta en busca de archivos .mp3, y actualiza el archivo de canciones. Solo se llenan las propiedades {@link Cancion}.nombrePersonalizado, {@link Cancion}.ubicacion, y {@link Cancion}.esLocal. El resto se completan con cadenas/vectores vacíos.
	 * @param {string} [ruta=config.carpetas.musica] - La ruta que se desea escanear. Si no se coloca, se usa la ruta definida en el archivo de configuración.
	 */
	escaneoRapidoCanciones(ruta) {
		// Si no se pasó una ruta, usamos la ruta por defecto.
		if (!ruta) {
			ruta = config.musica;
		}
		
		// Obtenemos los archivos de la carpeta.
		var archivos = fs.readdirSync(ruta, {withFileTypes: true});
		
		// Filtramos los archivos, y dejamos los que tienen formato MP3.
		var archivosAudio = archivos.filter( archivo => archivo.name.endsWith(".mp3") );
		
		// Crear las canciones
		var canciones = archivosAudio.map( archivo => new Cancion(archivo.name.substring(0, archivo.name.length - 4), "default", true, archivo.name, "", "", [], "", "", "") );
		
		// Guardar las canciones
		canciones.forEach( c => c.materializar() );
	}

	/**
	 * Esta función busca las canciones guardadas y las devuelve en forma de un vector.
	 * @returns {Cancion[]} Un vector de objetos {@link Cancion}.
	 */
	obtenerCancionesGuardadas() {
		var canciones = [];
		var i = 0;
		
		do {
			canciones[i] = new Cancion();
			canciones[i].desmaterializar(i);
			i ++;
		} while (canciones[i - 1].id != undefined);
		
		canciones.pop();
		
		return canciones;
	}

	/**
	 * Realiza el pedido al bot para que reproduzca una canción a partir del id.
	 * @param {number} id - El número que identifica a la canción que se quiere reproducir.
	 */
	reproducirCancion(id) {
		// Obtenemos la ruta de la canción.
		var cancion = new Cancion();
		cancion.desmaterializar(id);
		
		// Verifica que la canción exista.
		if (cancion.id == undefined) {
			console.log("El id seleccionado no corresponde a ninguna cación. Se abortó la reproducción.");
			return;
		}
		
		// Enviamos la ruta de la canción al bot para que la reproduzca.
		bot.joinAndPlay(cancion.rutaCompleta, cancion.esLocal);
	}

	/**
	 * Detiene cualquier audio que esté reproduciendo el bot en este momento.
	 */
	detenerReproducción() {
		bot.stop();
	}

	/**
	 * Desconecta al bot del canal, y detiene la transmisión de audio si la hay.
	 */
	desconectarBot() {
		bot.desconectar();
	}
	
	/**
	 * Verifica si las canciones guardadas que son locales siguen existiendo en las rutas correspondientes, y borra las que no existan.
	 */
	verificarEstadoCancionesLocales() {
		// Obtenemos todas las canciones guardadas.
		var listaCanciones = this.obtenerCancionesGuardadas();
		
		// Filtramos las canciones para obtener las que están registradas, pero no existe el archivo.
		var listaFiltrada = listaFiltrada.filter(cancion => cancion.esLocal && !cancion.existeLocalmente());
		
		// Elimina los objetos de la lista.
		listaFiltrada.forEach(cancion => cancion.eliminar());
	}
	
	/**
	 * Verifica si el archivo de canciones está vacío, o no fue creado todavía.
	 * @returns {boolean} Verdadero si está vacío/el archivo no existe.
	 */
	archivoCancionesEstaVacio() {
		return (this.obtenerCancionesGuardadas().length == 0);
	}
}

module.exports = ControladorReproductor;
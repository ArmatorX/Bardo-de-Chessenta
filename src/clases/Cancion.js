const carpetas = require('../../config.json').carpetas;
const Persistencia = require('./Persistencia.js');

/**
 * Clase que representa a una canción que será utilizada para ambientar la partida.
 * <p>
 * <b>Nota</b>: Algunos atributos se pueden dejar "en blanco" (cadenas/vectores vacíos), pero no se pueden guardar de esa forma en el archivo JSON.
 * </p>
 * @param {string} nombrePersonalizado - El nombre establecido por el usuario para la canción.
 * @param {string} ubicacion - Directorio o URL donde se encuentra el audio a reproducir.
 * @param {boolean} esLocal - Indica si el audio a reproducir se encuentra almacenado de forma local, o en otro servidor.
 * @param {string} [nombreArchivo=""] - El nombre con el que está guardada la canción. Si no es local, queda en blanco.
 * @param {string} [nombreOriginal=""] - El nombre original de la canción.
 * @param {string} [origen=""] - La OST a la que pertenece la canción, o en caso de no tener, el autor.
 * @param {string[]} [tags=[]] - Tags para obtener y clasificar mejor las canciones.
 * @param {string} [descripcion=""] - Una breve descripción que indica para qué puede ser usada la canción.
 * @param {string} [usos=""] - Breve ayuda visual para ver en qué momento usar la canción. Similar a la descripción pero más breve, y orientado a un uso más específico. Por ejemplo, música del villano.
 * @param {number} [prioridad=""] - Ayuda visual. Dependiendo el número se asigna un color a la canción.
 */
class Cancion extends Persistencia {
	constructor(nombrePersonalizado, ubicacion, esLocal, nombreArchivo, nombreOriginal, origen, tags, descripcion, usos, prioridad) {
		super(carpetas.datos + "cancion.json");
		this.nombrePersonalizado = nombrePersonalizado;
		this.ubicacion = ubicacion;
		this.esLocal = esLocal;
		this.nombreArchivo = nombreArchivo;
		this.nombreOriginal = nombreOriginal;
		this.origen = origen; 
		this.tags = tags;
		this.descripcion = descripcion;
		this.usos = usos;
		this.prioridad = prioridad;
	}
	
	/**
	 * Obtiene la ruta donde se encuentra guardada la canción.
	 * Si la ubicación es la por defecto, la construye.
	 * @returns {string} La ubicación del archivo de audio.
	 */
	get rutaCompleta() {
		if (this.ubicacion == "default") {
			return carpetas.musica + this.nombreArchivo;
		} else {
			return this.ubicacion + this.nombreArchivo;
		}
	}
	
	/**
	 * Compara una instancia de un objeto {@link Cancion} con otra, sin tener en cuenta sus id, y devuelve si son iguales.
	 * @param {Cancion} cancion - La canción con que se quiere comparar.
	 * @returns {boolean} El resultado de la comparación.
	 */
	equals(cancion) {
		if (this.nombrePersonalizado === cancion.nombrePersonalizado && this.nombreOriginal === cancion.nombreOriginal && this.origen === cancion.origen && this.descripcion === cancion.descripcion && this.usos === cancion.usos && this.prioridad === cancion.prioridad && this.rutaCompleta === cancion.rutaCompleta && this.esLocal === cancion.esLocal) {
			for (var i = 0; i < cancion.tags.length; i ++) {
				if (!(this.tags[i] === cancion.tags[i])) {
					return false;
				}
			}
			
			return true;
		}
		
		return false;
	}
	
	/**
	 * Compara si dos intancias de {@link Cancion} tienen el mismo id.
	 * @param {Cancion} cancion - La canción con que se quiere comparar.
	 * @returns {boolean} El resultado de la comparación.
	 */
	compararPorId(cancion) {
		if (this.id == cancion.id) {
			return true;
		}
		return false;
	}

	/**
	 * Compara una instancia de un objeto {@link Cancion} con otra, teniendo en cuenta sus id, y devuelve si son iguales.
	 * @param {Cancion} cancion - La canción con que se quiere comparar.
	 * @returns {boolean} El resultado de la comparación.
	 */
	strictEquals(cancion) {
		if (this.id === cancion.id && this.nombrePersonalizado === cancion.nombrePersonalizado && this.nombreOriginal === cancion.nombreOriginal && this.origen === cancion.origen && this.descripcion === cancion.descripcion && this.usos === cancion.usos && this.prioridad === cancion.prioridad && this.rutaCompleta === cancion.rutaCompleta && this.esLocal === cancion.esLocal) {
			for (var i = 0; i < cancion.tags.length; i ++) {
				if (!(this.tags[i] === cancion.tags[i])) {
					return false;
				}
			}
			
			return true;
		}
		
		return false;
	}
	
	/**
	 * Convierte la instancia de la clase en una cadena JSON y la guarda en el archivo correspondiente.
	 */
	materializar() {
		// Se pueden agregar comprobaciones para evitar que haya campos en blanco cuando se guarda.
		this.guardarObjetoEnArchivo();
	}
	
	/**
	 * Obtiene los valores de un objeto almacenado en el archivo cancion.json, y los guarda en la instancia de la clase Cancion.
	 * @param {number} idObjeto - El id que identifica a la canción en el archivo JSON.
	 */
	desmaterializar(idObjeto) {
		var cancion = this.obtenerObjetoDesdeArchivo(idObjeto);
		
		if (!cancion) {
			// Setea todos los atributos en undefined para evitar que se siga usando el objeto cuando los datos no se puedan obtener. 
			this.id = undefined;
			this.nombrePersonalizado = undefined;
			this.nombreOriginal = undefined;
			this.nombreArchivo = undefined;
			this.origen = undefined; 
			this.tags = undefined;
			this.descripcion = undefined;
			this.usos = undefined; 
			this.prioridad = undefined; 
			this.ubicacion = undefined;
			this.esLocal = undefined;
			
			return;
		}
		
		this.id = cancion.id;
		this.nombrePersonalizado = cancion.nombrePersonalizado;
		this.nombreOriginal = cancion.nombreOriginal;
		this.nombreArchivo = cancion.nombreArchivo;
		this.origen = cancion.origen; 
		this.tags = cancion.tags;
		this.descripcion = cancion.descripcion;
		this.usos = cancion.usos; 
		this.prioridad = cancion.prioridad; 
		this.ubicacion = cancion.ubicacion;
		this.esLocal = cancion.esLocal;
	}
	
	/**
	 * Verifica si la ruta de la canción existe localmente.
	 * @returns {boolean} Verdadero si existe el archivo localmente.
	 */
	existeLocalmente() {
		return this.existeArchivoEnRuta(this.ubicacion);
	}
	
	/**
	 * Elimina una canción del archivo de canciones.
	 */
	eliminar() {
		// TODO: Se pueden agregar comprobaciones. Es necesario que se borre la canción?
		this.borrarObjetoDeArchivo();
	}
}

module.exports = Cancion;
const carpetas = require('../../config.json').carpetas;
const fs = require('fs');

/**
 * Clase que se encarga de manejar la persistencia de los objetos. Para ello se utiliza un archivo JSON. También se encarga de gestionar las funcionalidades relacionadas con el sistema de archivos.
 * @param {string} archivoDatos - La ruta donde se van a guardar los archivos de este objeto.
 * @param {number} [id=undefined] - El número que identifica únicamente al objeto una vez almacenado. Solo se define si el objeto se cargó desde la base de datos.
 */
class Persistencia {
	constructor (archivoDatos, id) {
		this.archivoDatos = archivoDatos;
		this.id = id;
	}
	
	/**
	 * Se encarga de guardar un objeto en el archivo json correspondiente. Si el archivo de destino no existe, lo crea.
	 */
	guardarObjetoEnArchivo() {
		// Verificamos si ya existe el archivo, y si no lo creamos.
		if (!fs.existsSync(this.archivoDatos)) {
			console.log('El archivo "' + this.archivoDatos + '" no existe. Se creará a continuación.');
			fs.writeFileSync(this.archivoDatos, "[]");
		}
		
		// Leemos los datos del archivo JSON.
		var datos = this.leerArchivoDatos();
		
		// Verificamos si el objeto ya está guardado.
		if (this.id != undefined) {
			// Obtenemos la posición en la que se encuentra guardado el objeto, si existiera.
			var posObjeto = datos.findIndex(this.compararPorId, this);
			
			// Si ya existe, modificamos el objeto existente.
			datos[posObjeto] = this;
		} else {
			// Si no existe, le asignamos un id, y lo guardamos.
			if (datos.length == 0) {
				this.id = 0;
			} else {
				this.id = datos[datos.length - 1].id + 1;
			}
			
			datos.push(this);
		}
		
		// Guardamos los cambios en el archivo JSON.
		this.escribirDatosEnArchivo(datos);
	}
	
	/**
	 * Se encarga de obtener un objeto almacenado en el archivo json correspondiente. Si el archivo de destino no existe, da error.
	 * @param {number} idObjeto - El id del objeto que se quiere obtener.
	 * @returns {Object} El objeto que se estaba buscando, o undefined si no se encontró.
	 */
	obtenerObjetoDesdeArchivo(idObjeto) {
		// Verificamos si existe el archivo.
		if (fs.existsSync(this.archivoDatos)) {
			// Declaramos el objeto donde vamos a guardar los datos.
			var objeto;
			
			// Leemos los datos del archivo.
			var datos = this.leerArchivoDatos();
			
			// Buscamos el objeto con el id correspondiente, y lo guardamos en el objeto que declaramos.
			objeto = datos.filter(o => o.id == idObjeto)[0];
			
			// Devolvemos el objeto.
			return(objeto);
		}
	}
	
	/**
	 * Verifica si existe el archivo en la ruta especificada.
	 * @param {string} ruta - La ubicación del archivo.
	 */
	existeArchivoEnRuta(ruta) {
		return fs.existsSync(ruta);
	}
	
	/**
	 * Borra del archivo JSON el objeto que sea igual a esta instancia.
	 */
	borrarObjetoDeArchivo() {
		// Leemos los datos del archivo JSON.
		var datos = this.leerArchivoDatos();
		
		// Buscamos el objeto en el vector de datos.
		var posObjeto = datos.findIndex(this.equals);
		
		if (posObjeto != -1) {
			// Eliminamos el objeto del vector.
			datos.splice(posObjeto, 1);
		
			// Guardamos los cambios en el archivo JSON.
			this.escribirDatosEnArchivo(datos);
		}
	}
	
	/**
	 * Lee los datos guardados en el archivo JSON correspondiente.
	 */
	leerArchivoDatos() {		
		var datos = fs.readFileSync(this.archivoDatos);
		
		return (JSON.parse(datos));
	}
	
	/**
	 * Sobreescribe los datos del archivo JSON correspondiente.
	 * @param {Object[]} nuevosDatos - Vector de objetos que se guardará en el archivo JSON.
	 */
	escribirDatosEnArchivo(nuevosDatos) {
		var cadenaDatos = JSON.stringify(nuevosDatos);
		
		fs.writeFileSync(this.archivoDatos, cadenaDatos);
	}
	
	/**
	 * Comprueba la igualdad de dos objetos, sin tener en cuenta el id. 
	 * <p>
	 * <b>Nota</b>: Es necesario que todos los objetos que usan persistencia, sobreescriban este método de comparación para evitar duplicados a la hora de guardar. 
	 * </p>
	 * @param {Object} objeto - Objeto con el que se quiere comparar.
	 */
	equals(objeto) {
		return false;
	}
	
	/**
	 * Elimina el objeto del archivo JSON.
	 * <p>
	 * <b>Nota</b>: Es necesario que todos los objetos que usan persistencia, sobreescriban este método. 
	 * </p>
	 */
	eliminar() {
		this.borrarObjetoDeArchivo();
	}
	
	/**
	 * Convierte la instancia de la clase en una cadena JSON y la guarda en el archivo correspondiente.
	 * <p>
	 * <b>Nota</b>: Es necesario que todos los objetos que usan persistencia, sobreescriban este método. 
	 * </p>
	 */
	materializar() {
		this.guardarObjetoEnArchivo();
	}
	
	/**
	 * Obtiene los valores de un objeto almacenado en el archivo JSON, y los guarda en la instancia de la clase.
	 * <p>
	 * <b>Nota</b>: Es necesario que todos los objetos que usan persistencia, sobreescriban este método. 
	 * </p>
	 * @param {number} idObjeto - El id que identifica al objeto en el archivo JSON.
	 */
	desmaterializar(idObjeto) {
		var objeto = this.obtenerObjetoDesdeArchivo(idObjeto);
		
		if (!objeto) {
			this.id = undefined;
			return;
		}
		
		this.id = objeto.id;
	}
}

module.exports = Persistencia;
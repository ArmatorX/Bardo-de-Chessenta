const config = require('../config.json').carpetas;
const Cancion = require("./clases/Cancion");
const fs = require('fs');
const { parse } = require('querystring');

/**
 * Se encarga de realizar todas las funciones de la aplicación relacionadas con la carga, modificación, eliminación y consulta de canciones.
 */
class ControladorABMCancion {	
	/**
	 * Convierte los datos del formulario html en un objeto canción.
	 * @param {string} datos - Cadena con formato POST HTTP que contiene los datos de la canción.
	 * @returns {Cancion} Devulve el objeto canción creado a partir de los datos.
	 */
	convertirDatosFormularioACancion(datos) {
		// Convertimos los datos a un objeto.
		var oDatos = parse(datos);
		
		// Convierto el atributo tags en una lista.
		oDatos.tags = oDatos.tags.split(/,\s+,/g);
		
		// Obtengo el nombre del archivo.
		if (oDatos.esLocal) {
			oDatos.nombreArchivo = oDatos.ubicacion.split('/').pop();
		} else {
			oDatos.nombreArchivo = '';
			oDatos.esLocal = false;
		}
		
		// Verifico si la canción ya existe.
		if (oDatos.id != undefined) {
			// Creo y obtengo la canción para modificar sus datos.
			var c = new Cancion();
			c.desmaterializar(oDatos.id);
			
			// Modificamos los atributos de la canción con los datos del formulario.
			c.nombrePersonalizado = oDatos.nombre;
			c.ubicacion = oDatos.ubicacion;
			c.esLocal = oDatos.esLocal;
			c.nombreOriginal = oDatos.nombreOriginal;
			c.origen = oDatos.origen;
			c.tags = oDatos.tags;
			c.descripcion = oDatos.descripcion;
			c.usos = oDatos.usos;
			c.prioridad = oDatos.prioridad;
		} else {
			// Creamos la canción a partir de los datos anteriores.
			var c = new Cancion(oDatos.nombre, oDatos.ubicacion, oDatos.esLocal, oDatos.nombreArchivo, oDatos.nombreOriginal, oDatos.origen, oDatos.tags, oDatos.descripcion, oDatos.usos, oDatos.prioridad);
		}
		
		// Devolvemos el objeto creado.
		return c;
	}
	
	/**
	 * Guarda una canción en el archivo de canciones, la cual es creada a partir de los datos de un formulario html.
	 * @param {string} datos - Cadena con formato POST HTTP que contiene los datos de la canción.
	 * @returns {number} El id de la canción creada.
	 */
	registrarCancionDesdeFormulario(datos) {
		// Creamos el objeto canción.
		var c = this.convertirDatosFormularioACancion(datos);
		
		// Guardamos la canción en el archivo.
		c.materializar();
		
		// Devolvemos el id de la canción.
		return c.id;
	}
	
	/**
	 * Modifica una canción del archivo de canciones, la cual es creada a partir de los datos de un formulario html.
	 * @param {string} datos - Cadena con formato POST HTTP que contiene los datos de la canción.
	 * @returns {number} El id de la canción creada.
	 */
	modificarCancionDesdeFormulario(datos) {
		// Creamos el objeto canción.
		var c = convertirDatosFormularioACancion(datos);
		
		// Guardamos la canción en el archivo.
		c.materializar();
		
		// Devolvemos el id de la canción.
		return c.id;
	}
	
	/**
	 * Obtiene y devuelve un objeto canción desde el archivo a partir de su id.
	 * @param {number} id - El id de la canción.
	 * @returns {Cancion} La canción que se obtuvo del archivo.
	 */
	obtenerCancionPorId(id) {
		// Creamos un objeto canción.
		var c = new Cancion();
		
		// Obtengo la canción del archivo.
		c.desmaterializar(id);
		
		// Devuelvo el objeto canción.
		return c;
	}
}

module.exports = ControladorABMCancion;
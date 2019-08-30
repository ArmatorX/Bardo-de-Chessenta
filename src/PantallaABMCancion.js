const ControladorABMCancion = require('./ControladorABMCancion');
const gestor = new ControladorABMCancion();
const BrokerHTML = require('./BrokerHTML');
const html = new BrokerHTML();

const ModoFormulario = {
	Consulta: 0,
	Modificacion: 1,
	Registro: 2 
}

/**
 * Hace de interfaz entre el usuario y la aplicación para cargar, modificar, eliminar y consultar los datos de una canción.
 */
class PantallaABMCancion {
	/**
	 * Devuelve el formulario para el registro de una canción.
	 * @returns {string} Formulario html del registro de canciones.
	 */
	crearFormularioRegistrarHtml() {
		return html.crearFormularioCancion(ModoFormulario.Registro);
	}
	
	/**
	 * Guarda una canción en el archivo de canciones, la cual es creada a partir de los datos de un formulario html.
	 * @param {string} datos - Cadena con formato POST HTTP que contiene los datos de la canción.
	 * @returns {number} El id de la canción creada.
	 */
	registrarCancionDesdeFormulario(datos) {
		return gestor.registrarCancionDesdeFormulario(datos);
	}
	
	/**
	 * Muestra por pantalla una canción con todos sus detalles.
	 * @param {number} id - El id de la canción que se quiere mostrar.
	 * @returns {string} El formulario html que se quiere mostrar.
	 */
	mostrarCancionPorPantalla(id) {
		return html.crearFormularioCancion(ModoFormulario.Consulta, gestor.obtenerCancionPorId(id));
	}
	
	/**
	 * Muestra por pantalla una canción con todos sus detalles, permitiendo su modificación.
	 * @param {number} id - El id de la canción que se quiere mostrar.
	 * @returns {string} El formulario html que se quiere mostrar.
	 */
	modificarCancion(id) {
		return html.crearFormularioCancion(ModoFormulario.Modificacion, gestor.obtenerCancionPorId(id));
	}
	
	/**
	 * Modifica una canción del archivo de canciones, la cual es creada a partir de los datos de un formulario html.
	 * @param {string} datos - Cadena con formato POST HTTP que contiene los datos de la canción.
	 * @returns {number} El id de la canción creada.
	 */
	modificarCancionDesdeFormulario(datos) {
		return gestor.modificarCancionDesdeFormulario(datos);
	}
}

module.exports = PantallaABMCancion;
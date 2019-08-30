const ModoFormulario = {
	Consulta: 0,
	Modificacion: 1,
	Registro: 2 
}

/**
 * Se encarga de convertir distintos tipos de objetos en un pedazo de código HTML.
 */
class BrokerHTML {
	/**
	 * Convierte un vector de cadenas, en una lista ordenada con formato html.
	 * @param {string[]} lista - Lista de cadenas a convertir.
	 * @returns {string} Lista ordenada html.
	 */
	crearListaOrdenada(lista) {
		// TODO: Ver qué pasa si le paso una lista con un único elemento.
		return `<ol><li>${lista.join('</li><li>')}</li></ol>`;
	}
	
	/**
	 * Convierte un vector de cadenas, en una lista no ordenada con formato html.
	 * @param {string[]} lista - Lista de cadenas a convertir.
	 * @returns {string} Lista no ordenada html.
	 */
	crearListaNoOrdenada(lista) {
		// TODO: Ver qué pasa si le paso una lista con un único elemento.
		return `<ul><li>${lista.join('</li><li>')}</li></ul>`;
	}

	/**
	 * Crea un vínculo html a partir de un texto y una referencia.
	 * @param {string} texto - El texto que se muestra.
	 * @param {string} vinculo - La ruta o referencia del hipervínculo.
	 * @returns {string} Vínculo html.
	 */
	crearVinculo(texto, vinculo) {
		return `<a href="${vinculo}">${texto}</a>`;
	}
	
	/**
	 * Crea una sección (<div>) html a partir de un nombre de clase y el contenido que debe ir dentro.
	 * @param {string} clase - El nombre de la clase.
	 * @param {string} contenido - El contenido que irá dentro de la sección.
	 * @returns {string} Sección html.
	 */
	crearSeccion(clase, contenido) {
		return `<div class="${clase}">${contenido}</div>`;
	}
	
	/**
	 * Crea un formulario básico para el registro, consulta y modificación de canciones.
	 * @param {ModoFormulario} modo - El modo en que se crea el formulario.
	 * @param {Cancion} [cancion] - La canción que se debe mostrar en el formulario (solo se usa en modo consulta y modificación).
	 * @returns {string} Formulario html de canción.
	 */
	crearFormularioCancion(modo, cancion) {
		// TODO: Esto tiene demasiada lógica encima.
		// Objetos dinámicos del formulario.
		// Opciones de los campos.
		var readonly = '';
		var disabled = '';
		var checked = '';
		
		// Botón registrar.
		var txtRegistrar = '';
		var btnRegistrar = '';
		
		switch (modo) {
			case ModoFormulario.Consulta:
				if (cancion) {
					if (cancion.esLocal) {
						checked = ' checked';
					} 
					
					// Id.
					var lblId = `<p>ID: `;
					var txtId = `<input type="text" name="id" value="${cancion.id}" readonly></p>`;
					
					// Convierto la lista de tags en un string para mostrarla.
					var strTags = cancion.tags.toString().replace(/[+]/g);
					
					readonly = ' readonly';
					disabled = ' disabled';
				} else {
					console.error("Se llamó al método crearFormularioCancion del BrokerHTML en modo CONSULTA, pero no recibió una canción.");
					return;
				}
				
				break;
			case ModoFormulario.Modificacion:
				if (cancion) {
					if (cancion.esLocal) {
						checked = ' checked';
					}
					
					// Id.
					var lblId = `<p>ID: `;
					var txtId = `<input type="text" name="id" value="${cancion.id}" readonly></p>`;
					
					// Convierto la lista de tags en un string para mostrarla.
					var strTags = cancion.tags.toString().replace(/[+]/g);
					
					txtRegistrar = 'Guardar cambios.';
					btnRegistrar = `<input type="submit" value="${txtRegistrar}"}>`;
				} else {
					console.error("Se llamó al método crearFormularioCancion del BrokerHTML en modo MODIFICACIÓN, pero no recibió una canción.");
					return;
				}
				
				break;
			case ModoFormulario.Registro:
				// Creamos un objeto canción con los datos que queremos mostrar en cada campo.
				var cancion = {
					nombrePersonalizado: 'Un nombre que me sirva para encontrar la canción en la partida.',
					ubicacion: 'La ruta del archivo/URL de la canción.',
					nombreOriginal: 'Nombre real de la canción.',
					origen: 'OST/Autor de la canción.',
					descripcion: 'Una descripción detallada de la canción y el sentimiento que transmite.',
					usos: 'Usos determinados de la canción en partidas específicas.',
					prioridad: '0'
				}
				
				var strTags = 'Identificadores para encontrar una canción más rápido.';
				
				lblId = '';
				txtId = '';
				
				txtRegistrar = 'Registrar.';
				btnRegistrar = `<input type="submit" value="${txtRegistrar}"}>`;
				
				break;
		}
		
		// Objetos estáticos del formulario.
		// Nombre.
		var lblNombre = `<p>Nombre personalizado:`;
		var txtNombre = `<input type="text" name="nombre" value="${cancion.nombrePersonalizado}" ${readonly}></p>`;
		
		// Ubicación.
		var lblUbicacion = `<p>Ubicación:`;
		var txtUbicacion = `<input type="text" name="ubicacion" value="${cancion.ubicacion}" ${readonly}></p>`;
		
		// Es local o url.
		var chbEsLocal = `<p><input type="checkbox" name="esLocal" value="true"${checked} ${disabled}>`;
		var lblEsLocal = `Es una ruta local.</p>`;
		
		// Nombre original.
		var lblNombreOriginal = `<p>Nombre original:`;
		var txtNombreOriginal = `<input type="text" name="nombreOriginal" value="${cancion.nombreOriginal}" ${readonly}></p>`;
		
		// Origen.
		var lblOrigen = `<p>Origen:`;
		var txtOrigen = `<input type="text" name="origen" value="${cancion.origen}" ${readonly}></p>`;
		
		// Tags.
		var lblTags = `<p>Tags (separadas por comas):`;
		var txtTags = `<input type="text" name="tags" value="${strTags}" ${readonly}></p>`;
		
		// Descripción.
		var lblDescripcion = `<p>Descripción:</p>`;
		var txtDescripcion = `<textarea name="descripcion" rows="50" cols="150" ${readonly}>${cancion.descripcion}</textarea>`;
		
		// Usos.
		var lblUsos = `<p>Usos:`;
		var txtUsos = `<input type="text" name="usos" value="${cancion.usos}" ${readonly}></p>`;
		
		// Prioridad.
		var lblPrioridad = `<p>Prioridad:`;
		var txtPrioridad = `<input type="number" name="prioridad" value="${cancion.prioridad}" ${readonly}></p>`;
		
		// Creación formulario.
		var formulario = `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
				</head>
				
				<body>
					<form action="http://localhost:8080/registrar/procesarDatos/" accept-charset="utf-8" method="post">
						${lblId} ${txtId}
						${lblNombre} ${txtNombre}
						${lblUbicacion} ${txtUbicacion}
						${chbEsLocal} ${lblEsLocal}
						${lblNombreOriginal} ${txtNombreOriginal}
						${lblOrigen} ${txtOrigen}
						${lblTags} ${txtTags}
						${lblDescripcion}
						${txtDescripcion}
						${lblUsos} ${txtUsos}
						${lblPrioridad} ${txtPrioridad}
						${btnRegistrar}
					</form>
				</body>
			</html>`;
			
		return formulario;
	}
}

module.exports = BrokerHTML;
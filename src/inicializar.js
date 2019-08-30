const fs = require('fs');
const config = `
	{
		"bot": {
			"voiceChannel": "",
			"token": "",
			"volumen": "0.05"
		},
		"carpetas": {
			"musica": "./musica/",
			"datos": "./datos/"
		}
	}
`;

exports.crearCarpetasYArchivosSiPrimeraVez = function() {
	if (!fs.existsSync('../config.js')) {
		console.log('Es la primera vez que se ejecuta la aplicación.');
		console.log('Se crearán los archivos de configuración, será necesario que los modifique antes de volver a abrir la aplicación.');
		fs.writeFileSync('../config.js', config);
		fs.writeFileSync('../datos/cancion.json', '[]');
		fs.mkdirSync('../musica/');
		return true;
	}
	return false;
}
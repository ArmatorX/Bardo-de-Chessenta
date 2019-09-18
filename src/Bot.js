const config = require('../config.json').bot;
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

var connected = false;
var dispatcher;
var looping = true;
var channel;

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('message', async message => {
	if (message.content.startsWith("!")) {
		var cadenaPedido = message.content.substr(1);
		
		var re = new RegExp("[0-9]*d(4|6|8|10|12|20|100)(\\+[0-9]+|)");
		
		if (re.test(cadenaPedido)) {
			var pedido = cadenaPedido.split(/[d+]/);
			
			if (pedido[0] == '') {
				pedido[0] = 1;
			} else {
				pedido[0] = parseInt(pedido[0], 10);
			}
			
			pedido[1] = parseInt(pedido[1], 10);
			
			if (pedido[2] == undefined) {
				pedido[2] = 0;
			} else {
				pedido[2] = parseInt(pedido[2], 10);
			}
			
			var msj = "";
			var total = 0;
			for (var i = 0; i < pedido[0]; i++) {
				var rDado = Math.floor(Math.random() * pedido[1]) + 1;
				
				total += rDado;
				
				if (i == pedido[0] - 1) {
					msj += rDado;
				} else {
					msj += rDado + " + ";
				}
			}
			
			if (!(pedido[0] == 1 && pedido[2] == 0)) {
				if (pedido[2] == 0) {
					msj += " = " + total;
				} else {
					total += pedido[2];
					msj += " + [" + pedido[2] + "] = " + total;
				}
			}
			
			message.reply("```fix\n" + msj + "\n```");			
		}
	}
});

/**
 * Se encarga de gestionar la comunicación con el bot.
 */
class Bot {
	/**
	 * Conecta el bot a un canal, e inmediatamente reproduce la canción de la url recibida (deteniendo cualquier otra reproducción anterior).
	 * @param {string} url - La dirección donde el bot debe buscar el stream de audio.
	 * @param {boolean} [esLocal=true] - Indica si es un archivo almacenado en el servidor. 
	 */
	async joinAndPlay(url, esLocal) {
		// Obtenemos la información del canal al que nos vamos a conectar.
		channel = client.channels.get(config.voiceChannel);
		
		// Detenemos cualquier reproducción que se esté haciendo.
		this.stop();
		
		// Nos conectamos al canal de voz.
		channel.join()
			.then(connection => {
				// Conexión exitosa.
				this.play(url, connection, esLocal);
				
				connected = true;
			})
			.catch(e => {
				// Error.
				console.error(e);
			});
	}

	/**
	 * Reproduce una canción en un canal de voz. Es necesario que previamente se establezca la conexión al mismo. Si la función de looping está activada, cuando termina el stream se reproduce nuevamente.
	 * @param {string} url - La dirección donde el bot debe buscar el stream de audio.
	 * @param {VoiceConnection} connection - La conexión de voz establecida para realizar el streaming de audio.
	 * @param {boolean} [esLocal=true] - Indica si es un archivo almacenado en el servidor. 
	 */
	play(url, connection, esLocal) {
		if (esLocal || esLocal == undefined) {
			// El archivo está guardado en el servidor.
			dispatcher = connection.playStream(url)
				.on('end', () => {
					if (looping) {
						// Si el looping está activado, se reproduce nuevamente.
						this.play(url, connection);
					}
				});
				
		} else {
			// El archivo es una url de un video de youtube.
			dispatcher = connection.playStream(ytdl(url, {filter: "audioonly"}))
				.on('end', () => {
					if (looping) {
						// Si el looping está activado, se reproduce nuevamente.
						this.play(url, connection, esLocal);
					}
				});
		}
		
		// Seteamos el volumen de reproducción al definido en el archivo de configuración.
		dispatcher.setVolume(config.volumen);
	}

	/**
	 * Detiene la transmisión de audio, si el bot está transmitiendo.
	 */
	stop() {
		if (connected && dispatcher != undefined) {
			// Está conectado a un canal de voz, y está transmitiendo.
			if (looping) {
				// Si la función de looping está activada, la desactiva momentaneamente para evitar un loop infinito.
				looping = false;
				dispatcher.end();
				looping = true;
			} else {
				dispatcher.end();
			}
		}
	}

	/**
	 * Detiene la transmisión de audio, y desconecta al bot del canal.
	 */
	desconectar() {
		if (channel != undefined) {
			this.stop();
			channel.leave();
		}
	}
}

module.exports = Bot;

client.login(config.token);
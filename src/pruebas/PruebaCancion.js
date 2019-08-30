var Cancion = require("../Cancion");
var c1 = new Cancion("Tensión raro triste", "Thornfelt Swamp", "Ori and the Blind Forest", ["Tensión", "Raro", "Triste"], "Música para momentos tensos particularmente tristes y relativamente tranquilos. No sirve para una pelea ni para cuando aparece el malo.", "-", 0, "./music/1.mp3", true);
var c2 = new Cancion("Tensión raro triste", "Thornfelt Swamp", "Ori and the Blind Forest", ["Tensión", "Raro", "Triste"], "Música para momentos tensos particularmente tristes y relativamente tranquilos. No sirve para una pelea ni para cuando aparece el malo.", "-", 0, "./music/1.mp3", true);
c2.id = 2;

console.log(c1);

var lista = [];

lista.push(c1);
lista.push(c2);

lista.forEach(function(e) {
	if (e.strictEquals(c2)) {
		console.log("Son exactamente iguales.");
	} else if (e.equals(c2)) {
		console.log("Son iguales, pero tienen distintos id.");
	} else {
		console.log("No son iguales.");
	}
});

c1.materializar();
c2.materializar();

var c3 = new Cancion();
c3.desmaterializar(0);
console.log(c3);

c3.desmaterializar(3);
console.log(c3);

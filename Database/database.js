//Database funktio kutsuu init-funktiota, joka käynnistää yhteyden MySQL:ään.
function Database(){
	if(typeof this.mysql == "undefined"){
		this.init();
	}
}

//Tämä funktioprototyyppi luo yhteyden MySQL:ään.
Database.prototype.init = function(){
	var mysql = require('mysql');
	
	this.connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'password',
		database : 'shortener'
	});
},

//shortenUrl-funktio lyhentää URL:n, ja "salaa" sen crypto-moduulia hyväksikäyttäen.
Database.prototype.shortenUrl = function(originalUrl){
	var crypto = require('crypto');
	var insertShortUrl = crypto.createHash('sha1').update(originalUrl).digest('hex').substring(0, 5);

	//Sekä alkuperäinen, että lyhennetty URL lisätään tietokantaan. Koska lyhennetty URL on Primary-key, tämä estää saman URL:n lisäämisen tietokantaan useita kertoja.
	var query = this.connection.query("REPLACE INTO linkki(alkuperainen, lyhennetty) VALUES ('"+originalUrl+"','"+insertShortUrl+"')", function(err, rows, fields) {
		if(err){
			console.log("Insert / Replace failed. ", err);
		}
		else{
			console.log("Insert / Replace successful.");
		}
	});
},

//returnShort-funktio palauttaa tietokannasta lyhennetyn URL:n
Database.prototype.returnShort = function(originalUrl, socket){
	
	var query = this.connection.query("SELECT lyhennetty FROM linkki WHERE alkuperainen = '"+originalUrl+"'", function(err, rows, fields) {
		if(err){
			console.log("Search failed. ", err);
		}else{
			socket.emit('returnShort', rows);
		}
	});
},

//fetchUrl hakee tietokannasta alkuperäisen URL:n, osoiteriville kirjoitetun lyhennetyn URL:n perusteella.
Database.prototype.fetchUrl = function(url, socket){
	
	var query = this.connection.query("SELECT alkuperainen FROM linkki WHERE lyhennetty = '"+url+"'", function(err, rows, fields) {
		if(err){
			console.log("Search failed. ", err);
		}else{
			socket.emit('redirect', rows);
		}
	});
},

module.exports = Database;

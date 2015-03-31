//Vaadittavat moduulit.
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Luodaan database-olio.
var Database = require('./Database/database');
var database = new Database();

//Ilmotetetaan käytettävä kansio ja käyttöliittymän etusivu.
app.use(express.static(__dirname + '/Client'));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/Client/index.html');
});

//Avataan socket.io yhteys.
io.on('connection', function(socket){
	var address = socket.handshake.address;
	console.log("New connection from " + address);

	//Kutsutaan funktioita databasen puolelta. Tarkempi selostus funktioiden toiminnallisuudesta löytyy sieltä.
	socket.on('shortenAndReturn', function(url){
		database.shortenUrl(url);
		database.returnShort(url, socket);
	});

	socket.on('fetchUrl', function(url){
		database.fetchUrl(url, socket);
	});
});

//Määritetään portti, minkä kautta tieto kulkee.
http.listen(3000, function(){
	console.log('listening on http://localhost:'+3000);
});
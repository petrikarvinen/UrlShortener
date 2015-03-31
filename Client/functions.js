var socket = io();

//Tämä funktio laukeaa, kun käyttöliittymän shortenUrl-nappia painetaan.
$("#shortenUrl").click(function(){

	//Haetaan tekstikentästä URL.
	var originalUrl = document.getElementById('originalUrl').value;
	
	//Lisätään URL:iin tarvittaessa http.
	var http = "http://";
	if ( originalUrl.indexOf(http) === -1 ){
		originalUrl = http.concat(originalUrl);
  	} 

  	//Lähetetään URL serverille.
	socket.emit('shortenAndReturn', originalUrl);
	return false;
});

//Haetaan osoiteriviltä URL, ja pilkotaan se "?" mukaan kahteen osaan. Jälkimmäinen osa, eli URL:n parametri lähetetään serverille.
function urlCheck(){
	var url = window.location.href;
	var shortened = url.split("?");

	socket.emit('fetchUrl', shortened[1]);
}

//Uudelleenohjaus.
socket.on('redirect', function(url){

	//Kirjoittaa osoiteriville tietokannasta haetun objektin "alkuperainen"-arvon.
	$.each(url, function (key, value){
		window.location.replace(value.alkuperainen);
	});
});

//Kirjotetaan alempaan tekstikenttään lyhennetty URL.
socket.on('returnShort', function(url){

	//Lisätään tietokannasta haettuun olioon tarvittava localhost-domain.
	$.each(url, function (key, value){
		document.getElementById('shortUrl').value = "http://localhost:3000/?"+value.lyhennetty;
	});
});
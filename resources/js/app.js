var positions = new Array();
var distance = 1;
function findMyCurrentLocation(){
	var geoService = navigator.geolocation;
	if (geoService) {
        navigator.geolocation.watchPosition(showCurrentLocation,errorHandler, geo_options);
	} else {
        $("#searchResults").html("Your Browser does not support GeoLocation.");
	}
}

function showCurrentLocation(position){
	positions.push(position);
	//$('#searchResults').html(positions[positions.lenght-1].coords.latitude);
	
	//if(positions.length>1)
	distance = distance + calculateDistance(positions[positions.length-2].coords.latitude,position.coords.latitude,positions[positions.length-2].coords.longitude,position.coords.longitude);
	$('#cLat').html(position.coords.latitude);
	$('#cLong').html(position.coords.longitude);
	$('#heading').html(position.coords.heading);
	$('#altitude').html(position.coords.altitude);
	$('#distance').html(distance);
}

function errorHandler(error){
	$('#searchResults').html(error.code);
}

var geo_options = {
	enableHighAccuracy: true, 
	maximumAge        : 30000, 
	timeout           : 27000
};

function writeTrack(){
	var sdcard = navigator.getDeviceStorage("sdcard");
	//var file_content = 
	var file   = new Blob(["<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?><gpx><trk><name>Example GPX Document</name><trkseg><trkpt lat=\""+1+"\" lon=\""+2+"\"></trkpt></trkseg></trk></gpx>"], {type: "text/xml"});

	var request = sdcard.addNamed(file, "my-file.gpx");

	request.onsuccess = function () {
	  var name = this.result;
	  console.log('File "' + name + '" successfully wrote on the sdcard storage area');
	}

	// An error typically occur if a file with the same name already exist
	request.onerror = function () {
	  console.warn('Unable to write the file: ' + this.error);
	}
}

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

function calculateDistance(lat1,lat2,lon1,lon2){
	var R = 6371; // km
	var dLat = (lat2-lat1).toRad();
	var dLon = (lon2-lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d;
}

window.addEventListener("devicelight", function (event) {
	var luminosity = event.value;
	$('#lux').html(luminosity);
	if(luminosity < 10)
		$('#content').addClass('night');
	else
		$('#content').removeClass('night');
});

$(document).ready(function(){
	$("#locate").click(function(){
	    findMyCurrentLocation();
	});
	$("#save").click(function(){
	    writeTrack();
	});
});
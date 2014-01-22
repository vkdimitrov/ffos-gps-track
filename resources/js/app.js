//raw positions from the GPS module
var positions = new Array();

//map markers to draw trail
var path = new Array();

//distance from start
var distance = 0;

//GPS settings
var geo_options = {
	enableHighAccuracy: true, 
	maximumAge        : 30000, 
	timeout           : 27000
};

//Check for GPS fix 
function findMyCurrentLocation(){
	var geoService = navigator.geolocation;
	if (geoService) {
        navigator.geolocation.watchPosition(showCurrentLocation,errorHandler, geo_options);
	} else {
        $("#searchResults").html("Your Browser does not support GeoLocation.");
	}
}

//update track on position change
function showCurrentLocation(position){
	positions.push(position);
	path.push(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
	
	if(positions.length>1)
	{
		var lat0 = positions[positions.length-2].coords.latitude;
		var lat1 = position.coords.latitude
		var long0 = positions[positions.length-2].coords.longitude;
		var long1 = position.coords.longitude;
		distance = distance + calculateDistance(lat0, lat1, long0, long1);
		//trail
	  	var polyline = new google.maps.Polyline({
            path: path,
            strokeColor: "#ff0000",
            strokeOpacity: 0.6,
            strokeWeight: 5
        });        
	}
	
	$('#cLat').html(position.coords.latitude);
	$('#cLong').html(position.coords.longitude);
	$('#heading').html(position.coords.heading);
	$('#altitude').html(position.coords.altitude);
	$('#distance').html(distance);

	//google map
	var latlng = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);
		
	//Set Google Map options
	var options = { 
	    zoom : 15, 
	    center : latlng, 
	    mapTypeId : google.maps.MapTypeId.ROADMAP 
    };

	//where to display the map	 
	var $content = $("#map");

	//set the height of the div containing the Map to rest of the screen
	$content.height(screen.height - 190);

	//display the Map
	var map = new google.maps.Map ($content[0], options);

	//create the marker and drop It
	new google.maps.Marker ({ map : map, 
	                        animation : google.maps.Animation.DROP,
	                        position : latlng  
	                      });  
  	//draw the trail
	polyline.setMap(map);
}

function errorHandler(error){
	alert("GPS ERROR:"+error.code);
}

//write track info to the sd card
function writeTrack(){
	//time in mileseconds to be apended to file name (unique)
	var cur_time = new Date().valueOf();

	var to_file = new Array();
	for (var i=0;i<positions.length;i++)
	{ 
		to_file.push(positions[i].coords.latitude+","+positions[i].coords.longitude+"\n");
	}
	var sdcard = navigator.getDeviceStorage("sdcard");
	
	var file   = new Blob([to_file], {type: "text/plain"});

	var request = sdcard.addNamed(file, "track"+cur_time+".txt");

	request.onsuccess = function () {
		var name = this.result;
		alert('File "' + name + '" successfully wrote on the sdcard storage area');
	}

	request.onerror = function () {
		alert('Unable to write the file: ' + this.error);
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
	
	return d
}
//watch for env light changes
window.addEventListener("devicelight", function (event) {
	var luminosity = event.value;
	if(luminosity < 10)
		$('#searchResults').toggleClass('night');
	else
		$('#searchResults').toggleClass('night');
});

$(document).ready(function(){
	//loch the screen 
	var lock = navigator.requestWakeLock('screen');
	$("#locate").click(function(){
	    findMyCurrentLocation();
	    $("#locate").hide();
	    $("#export").show();
	    $("#searchResults").show();
	});
	$("#export").click(function(){
	    writeTrack();
	});
});
function findMyCurrentLocation(){
	var geoService = navigator.geolocation;
	if (geoService) {
	        navigator.geolocation.getCurrentPosition(showCurrentLocation,errorHandler);
	} else {
	        $("#searchResults").html("Your Browser does not support GeoLocation.");
	}
}

function showCurrentLocation(position){
	$('#searchResults').html(position.coords.latitude+':'+position.coords.longitude);
}

function errorHandler(error){
	$('#searchResults').html(error.code);
}
$(document).ready(function(){
	$("#locate").click(function(){
	    findMyCurrentLocation();
	});
});
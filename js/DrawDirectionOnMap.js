/**
 * The initial Map center.
 * Expects a latitude and a longitude value.
 */
var mapCenter = [11.313430592259937, 21.402397366699233];

/**
 * The initial Map zoom level.
 */
var mapZoom = 2;

/**
 * Data for the markers consisting of a name, a latitude, longitude and address
 */
var locations = [];

/**
 * color of the marker on the map
 * the color is changeable, to change the color of the marker please add your icons to the images folder and replace name instead of default
 */
var markerColor = 'default';

/**
 * Line Color
 */
var polyLineColor = '#FFCC00'



function initialize() {

	var config = {
		zoom : mapZoom,
    	mapTypeControl: false,
  		streetViewControl: false,
  		disableDoubleClickZoom: true,
		center : new google.maps.LatLng(mapCenter[0], mapCenter[1])
	};
	var googleMap = new google.maps.Map(document.getElementById("map_canvas"), config);
	
	var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

	var types = document.getElementById('type-selector');
  	googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  	googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  	var autocomplete = new google.maps.places.Autocomplete(input);
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		
	var place = autocomplete.getPlace();
	if (!place.geometry) {
	  return;
	}
	
	var address = '';
	if (place.address_components) {
		place.address = [
			(place.address_components[1] && place.address_components[1].long_name || ''),
			(place.address_components[2] && place.address_components[2].long_name || '')
		].join(' ');
	}
	var loc = place.geometry.location;
	
	if(locations.length>0){
		locations.push([place.name, loc.A, loc.F, place.address]);	
		console.log(locations);
		makeMap(googleMap,place);
	}else{
		
		var marker = new google.maps.Marker({
			position : place.geometry.location,
			shadow : shadowImage(),
			icon : markerImage(0, locations.length),
			shape : markerShape(),
			zIndex : 0,
			map: googleMap
		});

		if (place.geometry.viewport) {
			googleMap.fitBounds(place.geometry.viewport);
		} else {
			googleMap.setCenter(place.geometry.location);
			googleMap.setZoom(17);
		}
			marker.setMap(googleMap);
			marker.setVisible(true);
			
			locations.push([place.name, loc.A, loc.F, address]);
		}
			
	});



	// Sets a listener on a radio button to change the filter type on Places Autocomplete.
	function setupClickListener(id, types) {
		var radioButton = document.getElementById(id);
		google.maps.event.addDomListener(radioButton, 'click', function() {
			autocomplete.setTypes(types);
		});
	}

	setupClickListener('changetype-all', []);
	setupClickListener('changetype-address', ['address']);
	setupClickListener('changetype-establishment', ['establishment']);
	setupClickListener('changetype-geocode', ['geocode']);
		
}


function makeMap(h,place){
	
	var lt = new google.maps.LatLngBounds();
	
	for (var d = 0; d < locations.length; d++) {
		var c = locations[d];
		var g = new google.maps.LatLng(c[1], c[2]);
		var a = new google.maps.Marker({
			position : g,
			shadow : shadowImage(),
			icon : markerImage(d, locations.length),
			shape : markerShape(),
			title : c[0],
			zIndex : d,
			map: h
		});
		a.setMap(h);
	}
	
	setPolyline(h, locations);
	
	for (var l = 0; l < locations.length; l++) {
		var cl = locations[l];
		var gl = new google.maps.LatLng(cl[1], cl[2]);
		lt.extend(gl);
	}
	h.fitBounds(lt);
	
}


function setPolyline(f, a) {
	var e = new Array();
	for (var d = 0; d < a.length; d++) {
		var c = a[d];
		e.push(new google.maps.LatLng(c[1], c[2]))
	}
	
	var b = new google.maps.Polyline({
		path : e,
		strokeColor : polyLineColor,
		strokeOpacity : 1,
		strokeWeight : 2,
		geodesic : true
	});
	b.setMap(f)
}


function markerImage(b, a) {
	var c = "stop";
	if (0 == b) {
		c = "start"
	} else {
		if (b == (a-1)) {
			c = "end"
		}
	}
	
	return new google.maps.MarkerImage("images/" + c + "_marker_" + markerColor + ".png", new google.maps.Size(19, 37), new google.maps.Point(0, 0), new google.maps.Point(9, 37))
	
}


function shadowImage() {
	return new google.maps.MarkerImage("images/marker_shadow.png", new google.maps.Size(37, 34), new google.maps.Point(0, 0), new google.maps.Point(9, 34))
}


function markerShape() {
	var a = {
		coord : [1, 1, 1, 20, 18, 20, 18, 1],
		type : "poly"
	}
}

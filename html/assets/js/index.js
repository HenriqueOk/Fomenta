var map;

var contentStringName = '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">';
var contentStringType = '</h1><div id="bodyContent"><p><b>Tipo: </b>';
var contentStringFoodTypes = '<br><b>Tipo de alimentos: </b>';
var contentStringEmail = '<br><b>Endereço de e-mail: </b>';
var contentStringTelephoneNumber = '<br><b>Número de telefone: </b>';
var contentStringAddress = '<br><b>Endereço: </b>';
var contentStringEnd = '</div></div>';
	

var name = "";
var showDonators = true;
var showOngs = true;
var foodIdList = [];

var iconBase = './assets/images/layout/';
var icons = {
	donator: {
		icon: iconBase + 'donator.png'
	},
	ong: {
		icon: iconBase + 'ong.png'
	}
};

$(function () {
	var b = $("#button");
	var w = $("#grow");
	var l = $("#form");

	w.height(l.outerHeight(false));

	b.click(function () {

		if (w.hasClass('open')) {
			w.removeClass('open');
			w.height(0);
			l.hide();
		} else {
			w.addClass('open');
			w.height(l.outerHeight(true));
			l.show();
		}

	});
});

function initAutocomplete() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: -23.4824396,
			lng: -46.501249
		},
		zoom: 15,
		mapTypeId: 'roadmap',
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);
		});
	}

	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	map.addListener('bounds_changed', function () {
		searchBox.setBounds(map.getBounds());
	});

	var markers = [];

	searchBox.addListener('places_changed', function () {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		var bounds = new google.maps.LatLngBounds();
		places.forEach(function (place) {
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			}));

			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});

	updateList();
}

function mountWindow(feature) {

	var contentString;
	contentString += contentStringName;
	contentString += feature.name;
	contentString += contentStringType;
	contentString += feature.type == 'donator' ? "Doador" : "ONG";
	contentString += contentStringFoodTypes;
	contentString += feature.foods;
	contentString += contentStringEmail;
	contentString += feature.email;
	contentString += contentStringTelephoneNumber;
	contentString += feature.telephone_number;
	contentString += contentStringAddress;
	contentString += feature.address_street + ',' + feature.address_number + ' - ' + feature.address_complement + '. ' + feature.address_city + ", " + feature.address_state;
	contentString += contentStringEnd;

	return contentString;
}

function updateList() {

    var type;

    if(showDonators && showOngs)
        type = "";
    else if(showDonators)
        type = "donator";
    else if(showOngs)
        type = "ong";

    var foodIDs = [];
    
    if($("#selectTypeFood").val()){
        $("#selectTypeFood").val().forEach(function(value){
            foodIDs.push(parseInt(value));
        });
    }

	$.ajax({
        method: "POST",
        data: {by_name: $("#name-filter").val(), 
               by_type: type,
               by_food_type_request_id: foodIDs},
		url: "https://fomenta-api.herokuapp.com/maps",
		success: function (data) {

            $(".fly").html("");

			data.forEach(function (feature) {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(feature.latitude, feature.longitude),
					icon: icons[feature.type].icon,
					map: map
				});
				marker.addListener('click', function () {
					var infowindow = new google.maps.InfoWindow({
						content: mountWindow(feature)
					});
					infowindow.open(map, marker);
				});
				$(".fly").append("<li>" + feature.name + "</li>");
			});
		}
	});
}

function loadSelectFood() {

	$.ajax({
		method: "GET",
		url: "https://fomenta-api.herokuapp.com/food_types",
		success: function (data) {

			$.each(data, function (key, foodType) {
				$("#selectTypeFood").append("<option value='" + foodType.id + "'>" + foodType.name + "</option>")
            });
            $("#selectTypeFood").chosen();
		}
	});
}
stroll.bind('.fly');
loadSelectFood();
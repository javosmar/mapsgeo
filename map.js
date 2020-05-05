var map;
var locations = [];
var locations2 = [];
var markers = [];
var markerClicked;
var infoDesplegada;
var centro = {lat:-34.5956145 ,lng: -58.4431949};
    // Planilla completa
var urlPlanilla = "https://sheets.googleapis.com/v4/spreadsheets/(id planilla)/values/mapa1!A2:H?key=(completar key)";
    // Planilla prueba
//var urlPlanilla = "https://sheets.googleapis.com/v4/spreadsheets/(id planilla)/values/mapa1!A2:H?key=(completar key)";

function initialiseMap() {
  $.getJSON(urlPlanilla, function(data) {
      var mapOptions = {
        zoom: 12,
        center: centro
      };
      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      recorreData(data.values);
      locations = locations2;
  });
}

function recorreData(locaciones){
    $(locaciones).each(function() {
        var location = {};
        location.id = this[2];
        location.latitude = parseFloat(this[0]);
        location.longitude = parseFloat(this[1]);
        location.dircompleto = this[3];
        location.nodo = this[4];
        location.direccion = this[5];
        location.direccionciudad = this[6];
        location.color = this[7];
        locations2.push(location);
    });
    compare(locations2);
}

function setLocations(map, locations) {
    var infowindow = new google.maps.InfoWindow({
        content: "Content String"
    });
    for (var i = 0; i < locations.length; i++) {
        var new_marker = createMarker(map, locations[i], infowindow);
        markers.push(new_marker);
    }
    setMapOnAll(map);
    infoDesplegada.open(map, markerClicked); // Aca no se actualiza la información del marcador
}

function createMarker(map, location, infowindow) {
    var position = {
        lat: parseFloat(location.latitude),
        lng: parseFloat(location.longitude)
    };

    var url = "http://maps.google.com/mapfiles/ms/icons/";
    url += location.color + "-dot.png";

    var marker = new google.maps.Marker({
        position: position,
        //map: map,
        title: location.id,
        icon: {
        url: url
        }
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div>'+
        '<p><strong>ID: </strong>' + location.id + '</p>' +
        ((location.nodo === undefined) ? "" : ('<p><strong>Nodo: </strong>' + location.nodo + '</p>')) +
        ((location.direccion === undefined) ? "" : ('<p><strong>Dirección: </strong>' + location.direccion + '</p>')) +
        ((location.color === undefined) ? "" : ('<p><strong>Color: </strong>' + location.color + '</p>')) +
        '</div>');
        markerClicked = marker;
        infoDesplegada = infowindow;
        infoDesplegada.open(map, markerClicked);
    });
    return marker;
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
    //locations = [];
}

function clearMarkers() {
    setMapOnAll(null);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var myVar = setInterval(ajax, 10000);

function ajax(){
    const http = new XMLHttpRequest();
    $.getJSON(urlPlanilla, function(data) {
        locations2 = [];
        recorreData(data.values);
    });
}

window.onload=function(){
    document.getElementById('boton').addEventListener('click',function(){
        ajax();
    })
  }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function compare(locations2){
    if(_.isEqual(locations, locations2)){

    }
    else{
        locations = locations2;
        deleteMarkers();
        setLocations(map, locations);
    }
}

var map;
var markerIcon = './images/markericon.png';

function initMap() {
    var myLatlng = new google.maps.LatLng(-41.24447674404542, 174.7618546);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: myLatlng,
        mapTypeId: 'terrain',
        scrollwheel: false
    });

    // Create a <script> tag and set the USGS URL as the source.
    var script = document.createElement('script');
    // This example uses a local copy of the GeoJSON stored at
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    // script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
    script.src = 'https://json2jsonp.com/?url=https://api.geonet.org.nz/intensity?type=measured&callback=eqfeed_callback';
    document.getElementsByTagName('head')[0].appendChild(script);
}

// Loop through the results array and place a marker for each
// set of coordinates.
window.eqfeed_callback = function (results) {
    for (var i = 0; i < results.features.length; i++) {
        var coords = results.features[i].geometry.coordinates;
        var latLng = new google.maps.LatLng(coords[1], coords[0]);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: markerIcon
        });
    }
}
var express = require('express');
var router = express.Router();
var NodeGeocoder = require('node-geocoder');
var request = require('request');

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAmETJsBnNIgRl9y36Lk7Av-zEUPOygdVw', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);


/* GET users listing. */
router.get('/', function (req, response, next) {
    // Reverse Geocoding

    

    var geoUrl = "https://api.geonet.org.nz/intensity?type=measured";

    request({url: geoUrl, json: true}, function (err, res, json) {
        if (err) {
            throw err;
        } else {


            var jsonData = (json.features);
            var allAddress = [];
            jsonData.forEach(function (value, index) {

                Object.keys(value).forEach(function (prop) {
                    if (value.hasOwnProperty("geometry")) {
                        if (value[prop].hasOwnProperty("coordinates")) {

                            let coordinatesData = [];
                            var geoData = value[prop].coordinates;

                            var latlng = {
                                lat: geoData[1],
                                lon: geoData[0]
                            };
                            //175.56166, -39.267914
                            console.log(latlng);
                            geocoder.reverse(latlng, function (err, res) {
                                console.log(res);
                                /*

                                 [ {
                                 formattedAddress: '180 McArthur Rd, Inchbonnie 7875, New Zealand',
                                 latitude: -42.7277414,
                                 longitude: 171.4493026,
                                 extra:
                                 { googlePlaceId: 'ChIJMViaJGgGL20Rg2jM-VsAlok',
                                 confidence: 1,
                                 premise: null,
                                 subpremise: null,
                                 neighborhood: null,
                                 establishment: null },
                                 administrativeLevels: { level1long: 'West Coast', level1short: 'West Coast' },
                                 streetNumber: '180',
                                 streetName: 'McArthur Road',
                                 city: 'Inchbonnie',
                                 country: 'New Zealand',
                                 countryCode: 'NZ',
                                 zipcode: '7875',
                                 provider: 'google' } ]
                                 */
                                console.log(res[0].formattedAddress);
                            });


                        }

                    }

                })

            });


        }

    });


    // res.render('users', {title: 'test'});
    // res.send('respond with a resource');
});

function geoData() {
    var geoUrl = "https://api.geonet.org.nz/intensity?type=measured";

    request({url: geoUrl, json: true}, function (err, res, json) {
        if (err) {
            throw err;
        } else {


            var jsonData = (json.features);
            var allAddress = [];
            jsonData.forEach(function (value, index) {

                Object.keys(value).forEach(function (prop) {
                    if (value.hasOwnProperty("geometry")) {
                        if (value[prop].hasOwnProperty("coordinates")) {

                            let coordinatesData = [];
                            var geoData = value[prop].coordinates;
                            return geoData;


                        }

                    }

                })

            });


        }

    });
}
function getAddress(geoData) {

    var latlng = {
        lat: geoData[1],
        lon: geoData[0]
    };

    geocoder.reverse(latlng, function (err, res) {
        return res[0].formattedAddress;
    });
}



module.exports = router;

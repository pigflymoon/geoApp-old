var express = require('express');
var router = express.Router();
var NodeGeocoder = require('node-geocoder');
var request = require('request');
var Promise = require('bluebird'),
    bluebird_co = require('bluebird-co/manual');

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAmETJsBnNIgRl9y36Lk7Av-zEUPOygdVw', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

function geoData() {
    var geoUrl = "https://api.geonet.org.nz/intensity?type=measured";
    console.log('hi data');
    request({url: geoUrl, json: true}, function (err, res, json) {
        if (err) {
            throw err;
        } else {

            console.log('called');
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
function getAddress(lnglat) {

    var latlng = {
        lat: lnglat[1],
        lon: lnglat[0]
    };

    console.log('called address');
    geocoder.reverse(latlng, function (err, res) {
        return res[0].formattedAddress;
    });
}

console.log("hello");

router.get('/', function(req, res, next) {
    var geoUrl = "https://api.geonet.org.nz/intensity?type=measured";
    console.log('hi data');
    Promise.coroutine(function* () {

        var profile = yield geoData();
        // var address = yield getAddress(profile);
        console.log(profile);


    })().catch(function(errs) {
        //handle errors on any events
        console.log(errs);
    })


});
/* GET users listing. */





module.exports = router;

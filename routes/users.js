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

                            // allAddress.push(geoData);
                            getAddress(geoData);
                            // return geoData;


                        }

                    }

                })

            });
            // console.log(allAddress);
            // return allAddress;


        }

    });
}
function getAddress(geoData) {



    var promise = new Promise(function(resolve, reject) {
        var geo = getLatlng();
        if (geo){
            resolve(value);
        } else {
            reject(error);
        }
    });

    promise.then(function(value) {
        // success
        console.log('return value is ' +value);
    }, function(value) {
        // failure
        console.log('false ');
    });

    console.log('hello' +all);
    var latlng = {
        lat: geoData[1],
        lon: geoData[0]
    };

    geocoder.reverse(latlng, function (err, res) {
        let address = res[0].formattedAddress;
        return address
        // return res[0].formattedAddress;
    });
}

function getLatlng(){
    var geoUrl = "https://api.geonet.org.nz/intensity?type=measured";
    var allLatlng = [];

    request({url: geoUrl, json: true}, function (err, res, json) {
        if (err) {
            throw err;
        } else {

            console.log('called');
            var jsonData = (json.features);

            jsonData.forEach(function (value, index) {

                Object.keys(value).forEach(function (prop) {
                    if (value.hasOwnProperty("geometry")) {
                        if (value[prop].hasOwnProperty("coordinates")) {

                            let coordinatesData = [];
                            var geoData = value[prop].coordinates;


                            allLatlng.push(geoData);


                            // response.render('users', {title: address});
                            // // return geoData;


                        }

                    }

                })

            });
            return allLatlng;
            // response.send(allAddress);
        }

    });

}


router.get('/', function (req, res, next) {
    // return geoData();
    console.log('hi');
    // res.send('hi');
    var promise = new Promise(function(resolve, reject) {
        var geo = getAddress();
        if (geo){
            resolve(value);
        } else {
            reject(error);
        }
    });
    return promise;

    promise.then(function(value) {
        // success
        console.log('address return value is ' +value);
    }, function(value) {
        // failure
        console.log('address false ');
    });
    // getAddress();


});


module.exports = router;

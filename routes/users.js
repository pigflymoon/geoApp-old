var express = require('express');
var router = express.Router();
var NodeGeocoder = require('node-geocoder');
var request = require('request');


var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    //AIzaSyAcnccCGHGJkq3VF6SWZNwyPV7mov8YRMU
    apiKey: 'AIzaSyAcnccCGHGJkq3VF6SWZNwyPV7mov8YRMU',
    // apiKey: 'AIzaSyAmETJsBnNIgRl9y36Lk7Av-zEUPOygdVw', // for Mapquest, OpenCage, Google Premier
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


var getLatlng = function () {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
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
                    resolve(allLatlng);

                }

            });


        }, 2000);
    });
    return promise;
};
var getLngLat = function (allLatlng) {


    var promise = new Promise(function (resolve, reject) {
        for (let value of allLatlng) {
            var location = value.toString().split(',').reverse().join(',');
            console.log(location);
            // let location = Object.create({}, {lat: {value: value[0]}, lon: {value: value[1]}});
            resolve(location);

        }

    });
    return promise;
};

var getAddress = function (lnglat) {
    var allLocation = [];

    var promise = new Promise(function (resolve, reject) {
        //
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lnglat + "&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAcnccCGHGJkq3VF6SWZNwyPV7mov8YRMU";

        request({
            url: url,
            json: true
        }, function (error, response, data) {

            if (data.status == 'OK') {
                var address = data.results[0].formatted_address;
                console.log(address);
                return address;
            }

        });

        /*
        geocoder.reverse(lnglat)
            .then(function (res) {
                console.log(res);
                if (res.status == 'OK') {
                    var address = data.results[0].formatted_address;
                    console.log(address);

                } else {
                    console.log(res.status);
                }
            })
            .catch(function (err) {
                console.log("error is " + err);
            });

        */
    });

    return promise;

};

router.get('/', function (req, res, next) {

    console.log('hi');
    var address = getLatlng().then(getLngLat).then(getAddress);
    console.log(address);
});


module.exports = router;

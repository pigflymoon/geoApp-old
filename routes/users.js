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
            let location = Object.create({}, {lat: {value: value[0]}, lon: {value: value[1]}});
            resolve(location);
            // allLocation.push(location);
            // console.log(location.lat);
            //
            // geocoder.reverse(location, function (err, res) {
            //     console.log(res);
            //     allLocation.push(res[0].formattedAddress);
            // });
        }
        // resolve(allLocation);
        // var latlng = {
        //     lat: geoData[1],
        //     lon: geoData[0]
        // };
        //
        // geocoder.reverse(latlng, function (err, res) {
        //     let address = res[0].formattedAddress;
        //     resolve(address);
        //     // return res[0].formattedAddress;
        // });
    });
    return promise;
};

var getAddress = function (lnglat) {
    var allLocation = [];
    console.log(lnglat.lat)
    var promise = new Promise(function (resolve, reject) {
        geocoder.reverse({lat:172.73265, lon:-43.557934})
            .then(function(res) {
                console.log(res);
            })
            .catch(function(err) {
                console.log(err);
            });
        // geocoder.reverse({lat:45.767, lon:4.833}, function (err, res) {
        //     console.log('res'+res);
            // var address = res[0].formattedAddress;
            // resolve(address);
            //{lat:45.767, lon:4.833}
            //{lat:172.73265, lon:-43.557934}
            // allLocation.push(res[0].formattedAddress);
        // });
        // resolve(allLocation);
    })

    return promise;

};

router.get('/', function (req, res, next) {

    console.log('hi');
    var address = getLatlng().then(getLngLat).then(getAddress);
    console.log(address);
});


module.exports = router;

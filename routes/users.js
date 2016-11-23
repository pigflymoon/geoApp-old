var express = require('express');
var router = express.Router();
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
                                    var geoData = value[prop].coordinates;
                                    var location = geoData.toString().split(',').reverse().join(',');
                                    allLatlng.push(location);
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


var getAddress = function (allLnglat) {


    var promise = new Promise(function (resolve, reject) {
        var allLocation = [];
        setTimeout(function () {
            for (let lnglat of allLnglat) {
                var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lnglat + "&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAcnccCGHGJkq3VF6SWZNwyPV7mov8YRMU";

                request({
                    url: url,
                    json: true
                }, function (error, response, data) {

                    if (data.status == 'OK') {
                        var address = data.results[0].formatted_address;
                        // console.log(address);
                        allLocation.push(address);

                        // console.log(allLocation);
                    }

                });
            }


            resolve(allLocation);
        }, 5000);

        //


    });

    return promise;

};

router.get('/', function (req, res, next) {

    console.log('hi');
    getLatlng().then(getAddress).then(function (allLocation) {
        res.render('users', { title: allLocation });
    });
});


module.exports = router;

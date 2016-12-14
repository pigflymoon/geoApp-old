var express = require('express');
var router = express.Router();
var request = require('request');
var apicache = require('apicache');


let cache = apicache.middleware

var getLatlng = function () {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            var geoUrl = "https://api.geonet.org.nz/intensity?type=measured";
            var allLatlng = [];

            request({url: geoUrl, json: true}, function (err, res, json) {
                if (err) {
                    throw err;
                } else {
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

router.get('/', cache('1 day'), function (req, res) {
    var allAddress = [];
    getLatlng().then(function (allLnglat) {
        allLnglat.reduce(function (p, lnglat) {

            return p.then(function () {
                return new Promise(function (resolve, reject) {

                    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lnglat + "&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAcnccCGHGJkq3VF6SWZNwyPV7mov8YRMU";
                    //
                    request({
                        url: url,
                        json: true
                    }, function (error, response, data) {

                        if (data.status == 'OK') {
                            var address = data.results[0].formatted_address;

                            allAddress.push(address);
                        }
                        resolve(allAddress)

                    });


                });
            });
        }, Promise.resolve()).then(function (result) {
            res.render('intensity', {title: result});
        }, function (error) {
            res.render('intensity', {title: 'Oops,wait for a minute'});
        });

    });


});

module.exports = router;
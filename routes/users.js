var express = require('express');
var router = express.Router();
var request = require('request');
var mcache = require('memory-cache');

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

var cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        console.log('key is ' + key);
        let cachedBody = mcache.get(key)
        console.log('cacheBody is ' + cachedBody)
        if (cachedBody) {
            res.send(cachedBody)
            console.log('cacheBody is cached!!!!')
            res.render('users', {title: result});
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                console.log('##### saved ####')
                console.log(body)
                console.log("value is " + mcache.get(key));
                res.sendResponse(body)
            }
            next()
        }
    }
}

// router.get('/', cache(10), function (req, res) {
router.get('/', function (req, res, next) {
    /**
     setTimeout(() => {
        res.render('users', {title: 'hello'});
    }, 5000) //setTimeout was used to simulate a slow processing request
     **/
    setTimeout(() => {
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
                res.render('users', {title: result});
            }, function (error) {
                res.render('users', {title: 'Oops,wait for a minute'});
            });

        });
    }, 5000)

});


module.exports = router;

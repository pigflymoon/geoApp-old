var express = require('express');
var router = express.Router();
var request = require('request');
var apicache = require('apicache');


let cache = apicache.middleware;
let apiUrl = 'https://api.geonet.org.nz/quake?MMI=4';
var allProperties = [];

var getMMI = function () {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            request({url: apiUrl, json: true}, function (err, res, json) {
                if (err) {
                    throw err;
                } else {
                    var jsonData = (json.features);

                    jsonData.forEach(function (value, index) {

                        Object.keys(value).forEach(function (prop) {

                            if (value.hasOwnProperty("properties")) {
                                var properties = value.properties;
                                console.log(properties);
                                allProperties.push(properties);
                            }
                        })
                    });
                    resolve(allProperties);
                }

            });


        }, 2000);
    });
    return promise;
};

router.get('/', cache('1 day'), function (req, res) {
    getMMI().then(function (properties) {
        res.render('mmi', {properties: properties});
    }, function (error) {
        res.render('mmi', {news: 'Oops,wait for a minute'});
    });


});

module.exports = router;
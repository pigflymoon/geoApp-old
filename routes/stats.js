var express = require('express');
var router = express.Router();
var request = require('request');
var apicache = require('apicache');


let cache = apicache.middleware;
let apiUrl = 'https://api.geonet.org.nz/quake/stats';

var getNews = function () {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            request({url: apiUrl, json: true}, function (err, res, json) {
                if (err) {
                    throw err;
                } else {
                    console.log('called');
                    var rate = (json.rate.perDay);
                    
                    console.log('hi jsonData' + rate);
                    resolve(rate);
                }

            });


        }, 2000);
    });
    return promise;
};

router.get('/', cache('1 day'), function (req, res) {
    console.log('hi called');
    getNews().then(function (allNews) {

        res.render('stats', {news: allNews});
    }, function (error) {
        res.render('stats', {news: 'Oops,wait for a minute'});
    });


});

module.exports = router;
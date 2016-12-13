var express = require('express');
var router = express.Router();
var request = require('request');
var apicache = require('apicache');


let cache = apicache.middleware;
let apiUrl = 'https://api.geonet.org.nz/news/geonet';

var getNews = function () {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            request({url: apiUrl, json: true}, function (err, res, json) {
                if (err) {
                    throw err;
                } else {
                    console.log('called');
                    var jsonData = (json.feed);
                    console.log('hi jsonData' + jsonData);
                    resolve(jsonData);
                }

            });


        }, 2000);
    });
    return promise;
};

router.get('/', cache('1 day'), function (req, res) {
    console.log('hi called');
    getNews().then(function (allNews) {

        res.render('news', {news: allNews});
    }, function (error) {
        res.render('news', {news: 'Oops,wait for a minute'});
    });


});

module.exports = router;
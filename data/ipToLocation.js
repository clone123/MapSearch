var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var jsonfile = require('jsonfile');

function translate(ips, callback) {
    var result = [];

    function req() {
        var ip = ips.pop();

        if (ip) {
            request({
                url: 'http://ditu.amap.com/service/pl/pl.json',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
                    'X-Forwarded-For': ip
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    if(data.code == 1){
                        result.push({
                            ip: data.cip,
                            lng: data.lng,
                            lat: data.lat
                        });
                    }
                    req();
                }
            });

            // request('http://qiwoo.org/msearch/amap_test.php?ip=' + ip, function(error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         var $ = cheerio.load(body);

            //         var lng = null,
            //             lat = null;

            //         $('body table').find("td").each(function(i) {
            //             if (i == 5) {
            //                 lng = $(this).text();
            //             } else if (i == 3) {
            //                 lat = $(this).text();
            //             }
            //         });

            //         if (lat != 2) {
            //             console.log({
            //                 ip: ip,
            //                 lng: lng,
            //                 lat: lat
            //             });

            //             result.push({
            //                 ip: ip,
            //                 lng: lng,
            //                 lat: lat
            //             })
            //         }

            //         req();
            //     }
            // })

        } else {
            if (ips.length == 0) {
                console.log(result);
                callback(result);
            } else {
                req();
            }
        }
    }

    req();
}


// readFile
var fileName = "ips";

fs.readFile(fileName + ".txt", 'utf-8', function(err, data) {
    if (err) {
        console.log(data);
    } else {
        var ips = data.split("\n");

        translate(ips, function(res) {
            jsonfile.writeFile("./" + fileName + "-result.json", {
                data: res
            });
        })
    }
})

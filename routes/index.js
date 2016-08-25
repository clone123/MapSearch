'use strict'

var express = require('express')
var router = express.Router()
var request = require('request')
var jsonfile = require('jsonfile')
var path = require('path')
var fs = require('fs')
var Co = require('co')
var json2csv = require('json2csv')
var iconv = require('iconv-lite')
var upload = require('./fileUtil')
var ipInterface = require('./ipSearch')

function getWebpackAssets () {
    var assetsPath = path.join(__dirname, '../webpack-assets.json')

    if (!fs.existsSync(assetsPath))
        throw new Error('webpack 还未打包完成')
    return require(assetsPath)
}

/* var multer = require('multer');
 var storage = multer.diskStorage({
 destination: function (req, file, cb){
 cb(null, "data/");
 },
 filename: function (req, file, cb){
 cb(null, file.originalname)
 }
 });
 var upload = multer({storage:storage});*/

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.hbs', {
        webpackAssets: getWebpackAssets()
    })
})
router.get('/poi', function (req, res, next) {
    res.render('index.hbs', {
        webpackAssets: getWebpackAssets()
    })
})
router.get('/ip', function (req, res, next) {
    res.render('index.hbs', {
        webpackAssets: getWebpackAssets()
    })
})

router.get('/search/:ip', function (req, res, next) {
    var ip = req.params.ip
    request({
        url: 'http://ditu.amap.com/service/pl/pl.json',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
            'X-Forwarded-For': ip
        }
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body))
        } else {
            res.json(error)
        }
    })
})

router.get('/getIps', function (req, res, next) {
    res.json(jsonfile.readFileSync(path.join(path.resolve('./'), 'data/ips-result.json')))
})

let ipLoad = upload.single('fileIp')
router.post('/file/ipFileUpload', function (req, res, next) {
    ipLoad(req, res, function (err) {
        if (err) { return console.log(err) }
        console.log('req.file+++++++' + JSON.stringify(req.file))
        let ipSrc = path.join(req.file.destination, req.file.originalname)
        fs.readFile(ipSrc, 'utf-8', function (err, data) {
            console.log('Data++++' + data)
            if (err) {
                console.log(err)
            } else {
                let dt = data.split(',')
                Co(function * () {
                    let obj = [], ii, len = dt.length
                    for (ii = 0; ii < len; ii++) {
                        try {
                            let ip = dt[ ii ].trim()
                            if (!ip) continue
                            /*let lnglat = yield ipInterface.getIpforLngLat(ip)
                            let info = yield ipInterface.getIpInfos(lnglat)
                            console.log('info++++' + JSON.stringify(info))*/
                            let info = yield  ipInterface.getIpInfoByIp(ip)
                            console.log('info+++2+' + JSON.stringify(info))
                            obj.push(Object.assign(info, { 'cip': ip }))
                        } catch (e) { console.log(e) }
                    }
                    return obj
                }).then(function (obj) {
                    res.format({
                        'json': function () {
                            res.send({ message: obj })
                        }
                    })
                }).catch(function (e) { console.log(e.stack) })
            }
        })
    })
})

router.post('/file/readfilecontent', function (req, res, next) {
    ipLoad(req, res, function (err) {
        if (err) { return console.log(err) }
        console.log('req.file+++++++' + JSON.stringify(req.file))
        let ipSrc = path.join(req.file.destination, req.file.originalname)
        fs.readFile(ipSrc, 'utf-8', function (err, data) {
            if (err) {
                console.log(err)
            } else {
                res.format({
                     'json':function () {
                           res.send({message:data})
                     }
                })
            }
        })
    })
})


router.post('/createCVSfiles', function (req, res, next) {
    var fields = [ 'ip', 'address' ],
        csv = json2csv({ data: JSON.parse(req.body.data), fields: fields }),
        newCSV = iconv.encode(csv, 'UTF-8')
    fs.writeFile('./data/file.csv', newCSV, function (err) {
        if (err) throw err
        console.log('file saved')
    })
})

router.post('/createCityInfo', function (req, res, next) {
    request({
        url:'http://restapi.amap.com/v3/config/district?subdistrict=2&key=38435f770f1aa5186d4ea8980bbe982a'
    },function (error , response ,body) {
        if (!error && response.statusCode === 200) {
            console.log('body++++++++'+JSON.parse(body))
        } else {
           // res.json(error)
            console.log('error---'+error)
        }
    })
    /*console.log('data---1------' + JSON.stringify(req))
    fs.writeFile('./data/cityInfo.js', req.body.data)*/
})

router.get('/searchAreaIP', function (req, res, next) {

})

module.exports = router

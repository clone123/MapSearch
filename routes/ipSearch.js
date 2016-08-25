/**
 * Created by huanghuanhuan on 2016/8/4.
 */

'use strict'

let request = require('request')

let ipInterface = {

  getIpforLngLat: function (ip) {
    return new Promise(function (resolve, reject) {
      try {
        request({
          url: 'http://ditu.amap.com/service/pl/pl.json',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
            'X-Forwarded-For': ip
          }
        }, function (err, res, body) {
          if (!err && res.statusCode === 200) {
            resolve(JSON.parse(body))
          } else {
            return reject(null)
          }
        })
      } catch (e) {
        console.log(e.stack)
      }
    })
  },

  getIpInfos: function (ipObj) {
    return new Promise(function (resolve, reject) {
      try {
        request({
          url: 'http://restapi.amap.com/v3/geocode/regeo?location=' + ipObj.lng + ',' + ipObj.lat + '&key=38435f770f1aa5186d4ea8980bbe982a'
        }, function (err, res, body) {
          if (!err && res.statusCode === 200) {
            resolve(JSON.parse(body))
          } else {
            return reject(null)
          }
        })
      } catch (e) {
        console.log(e.stack)
      }
    })
  },

  getIpInfoByIp : function (ip) {
      return new Promise(function (resolve , reject) {
               try {
                  request({
                      url:'http://220.181.159.76:8000/?ip=' + ip
                  },function (err , res , body) {
                        if(!err && res.statusCode === 200){
                            resolve(JSON.parse(body))
                        }else{
                          reject(null)
                        }
                  })
               }catch (e){
                    console.log(e.stack)
               }
      })
  },

  getAreaIP: function (lnglatStr) {
    try {
      request({
        url: 'http://220.181.159.76:8000/geo?' + lnglatStr
      }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          return reject(null)
        }
      })
    } catch (e) {
      console.log(e.stack)
    }
  }

}

module.exports = ipInterface


<template>

    <div id="online-map" class="col-md-8"></div>
</template>
<script>
    import qs from 'querystring'
    import {updateIpList,updateMap,updateIpsArr,setCityCode,setCountryHtml} from '../../vuex/action'
    import {
      getKey ,getIpsArr,getMap,getTabPoiStrArr,getCountryHtml,
      getIpList,getCityCode,getLocationObj,
      getPoiStr,getFormData , getOffObj,getTabLocationList
    }  from '../../vuex/getters'

    export default{
        vuex: {
            actions: {
                updateIpList,
                updateMap,
                updateIpsArr,
                setCityCode,
                setCountryHtml
            },
            getters: {
                map:getMap,
                key:getKey,
                ipsArr:getIpsArr,
                ipList: getIpList,
                tabPoiStrArr:getTabPoiStrArr,
                poiStr: getPoiStr,
                formData:getFormData,
                cityCode:getCityCode,
                locationObj:getLocationObj,
                offObj:getOffObj,
                tabLocationList:getTabLocationList
            }
        },
        data: function () {
            return {
                ipNum:10,
                pathArr:[],
                ipListArr:[],
                poiId:'searchContent',
                mouseTool:null,
                ipsArrBase:[],
                circleMarkerList:[],
                poiMarkerList:[]
            }
        },
        watch: {

            ipsArr () {
                if(this.ipsArrBase.length){ return false}
                this.searchIPArr()
            },
            tabPoiStrArr () {
                this.searchTabTrPOIArr()
            },
            poiStr (){
                this.searchPOI()
            },
            formData () {
                this.uploadFrom()
            },
            offObj (){
                this.updateOff()
            }
        },
        methods: {
            // 注册 鼠标操作地图 ， 文本输入提示
            initMapPlugin: function () {
                let _this = this
                try {
                    _this.initMouseTool()
                } catch (e) {
                    console.log(e)
                }
                _this.initAutoComplete()
            },
            initMouseTool: function () {
                let _this = this,map = _this.map
                map.plugin([ "AMap.MouseTool" ], function () {
                    _this.mouseTool = new AMap.MouseTool(map);
                    AMap.event.addListener(_this.mouseTool, "draw", function callback (e) {
                        _this.pathArr = e.obj.getPath();  //经纬度数组集合
                        _this.searchAreaIP(_this.pathArr)
                    });
                    _this.mouseTool.polygon({
                        zIndex: 10
                    })
                })

                _this.updateMap(map)
            },
            initAutoComplete: function () {
                let _this = this,map = _this.map
                map.plugin([ "AMap.Autocomplete" ], function () {
                    //输入提示
                    var autoOptions = { input: _this.poiId };
                    var auto = new AMap.Autocomplete(autoOptions);
                    map.plugin([ "AMap.PlaceSearch" ], function () {
                        _this.placeSearch = new AMap.PlaceSearch({
                            map: map
                        });  //构造地点查询类
                        /* AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
                         function select(e) {
                         /!* _this.placeSearch.setCity(e.poi.adcode);
                         _this.placeSearch.search(e.poi.name);  //关键字查询查询*!/
                         console.info(e)
                         //  _this.poiInput = e.poi.name
                         }*/
                    });

                });
                _this.updateMap(map)
            },

            updateOff : function () {
                  let _this = this, offObj = _this.offObj
                 //console.log('flag==='+offObj.flag+'------value'+offObj.value)
                  if(offObj.flag){
                        _this.initMouseTool()
                  }else{
                      _this.mouseTool.close()
                  }
            },

            searchIP: function (ip) {
                let _this = this,map = _this.map, ips = ip
                $.ajax({
                    url: 'http://220.181.159.76:8000/?ip=' + ips,
                    tyle: 'get',
                    data: [],
                    success: function (result) {
                        if (result.info == 'OK') {
                            let d = result.location
                            let marker = new AMap.Marker({
                                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                                position: [ d.lng, d.lat ],
                                ip: ips.replace(/\./g, '')
                            });

                            marker.setMap(map);
                            marker.setTitle(result.regeocode.formatted_address); // result.regeocode.addressComponent.neighborhood.name
                            marker.setLabel({
                                offset: new AMap.Pixel(20, 20),
                                content: result.regeocode.formatted_address
                            });
                            map.setCenter(new AMap.LngLat(d.lng, d.lat))
                            AMap.event.addListener(marker, 'click', function (e) {
                                _this.clickTr(e)
                            });

                            let ipObj = Object.assign(result, {
                                'cip': ips,
                                'tip': ips.replace(/\./g, ''),
                                'location': d.lng + ',' + d.lat
                            })
                            _this.ipListArr.push(ipObj)
                            _this.updateMap(map)
                        }
                    }, error: function (e) {
                        console.log(e);
                    }
                })
            },

            searchIPArr:function () {
                 this.ipListArr = []
                 let _this = this,
                    ipArr = _this.ipsArr
                    _this.clearMaps()
                    ipArr.forEach(function (ip) {
                        _this.searchIP(ip)
                    })

                   _this.updateIpList(_this.ipListArr);
            },

            // 获取区域内的IP
            searchAreaIP: function () {
                let _this = this;
                let lnglatStr = this.getAreaLngLat();
                // var lnglatStr = 'point=110.490671,30.983529&point=117.490671,38.983529&point=118.490671,40.983529&size=5'

                $.ajax({
                    url: 'http://220.181.159.76:8000/geo?' + lnglatStr,
                    type: 'get',
                    data: [],
                    success: function (result) {
                        if (result.status == 1) {
                            let lnglatArr = result.data;
                            _this.searchLngLatToAddress(lnglatArr);
                        }
                    }, error: function (e) {console.log(e)}
                })

            },

            // 获取多边形区域的经纬度
            getAreaLngLat: function () {
                let pathArr = this.pathArr, str = '';
                pathArr.forEach(function (_el) {
                    str += 'point=' + _el.lng + ',' + _el.lat + '&';
                });
                return str + 'size=' + this.ipNum;
            },

            // 通过经纬度获取IP地址的详细信息
            searchLngLatToAddress: function (obj) {
                let _this = this, data = obj;
                _this.clearMaps()
                data.forEach(function (el, index) {
                    _this.tranLocation_AreaIP(el, index);
                })
                _this.updateIpsArr(_this.ipsArrBase)
            },

            //获取多边形区域内的IP详细信息
            tranLocation_AreaIP: function (d, index) {
                let _this = this ;
                $.getJSON("http://restapi.amap.com/v3/geocode/regeo?location=" + d.location[ 0 ] + "," + d.location[ 1 ] + "&key=" +this.key, function (result) {
                    _this.createIPMarker(d, result)
                    let ipArr = Array.prototype.slice.apply(_this.ipList) //_this.ipList.slice()
                    _this.ipsArrBase.push(d.ip)
                    ipArr.push(Object.assign(result, {
                        'cip': d.ip,
                        'tip': d.ip.replace(/\./g, ''),
                        'location': d.location[ 0 ] + ',' + d.location[ 1 ]
                    }))
                     _this.updateIpList(ipArr)
                });
            },

            // POI 查询
            searchPOI: function () {
                let _this = this,map = _this.map ;

                _this.clearPoiMarker()

                if (_this.cityCode == '100000') {
                    _this.searchChinaPOI()
                } else {
                    let poiStr = _this.poiStr + '&key=' + _this.key + '&city=' + _this.cityCode
                    // keywords=' + this.poiInput + '&types=' + this.selectType + '&key=' + this.key + '&city=' + this.cityCode
                    map.setZoom(10)
                    $('#' + _this.cityCode).addClass('adcode_cls').hide()
                    $.ajax({
                        url: 'http://restapi.amap.com/v3/place/text?'+poiStr,
                        type: 'get',
                        success: function (result) {
                            if (result.info == 'OK') {
                                let data = result.pois;
                                data.forEach(function (el) {
                                    _this.createPOIMarker(el);
                                })
                                setTimeout(function () {
                                    _this.initMouseTool()
                                },1000)
                            }
                        }, error: function (e) {
                            console.info(e)
                        }
                    })
                }
                _this.updateMap(map)
            },

            // 全国 POI 查询
            searchChinaPOI: function () {
                let _this = this,
                  qsstr = qs.stringify({
                      query_type: 'TQUERY',
                      pagesize: '20',
                      pagenum: '1',
                      qii: 'true',
                      cluster_state: '5',
                      need_utd: 'true',
                      utd_sceneid: '1000',
                      div: 'PC1000',
                      addr_poi_merge: 'true',
                      is_classify: 'true',
                      city: '100000',
                      geoobj: '56.339028|21.132002|176.397621|54.677863',
                      keywords: _this.poiStr
                  })
                $.ajax({
                    url: '/gaode/service/poiInfo?' + qsstr,
                    type: 'get',
                    success: function (result) {
                         _this.clearMaps()
                        if (result.status == 1 && result.data.length) {
                            let data = result.data[ 0 ].list,
                              countryHtml = result.html
                            _this.setCountryHtml(countryHtml)
                            data.forEach(function (el) {
                                _this.createChinaMarker(el)
                            })
                        } else {
                            _this.searchChinaPOI_Base()
                        }
                    }, error: function (e) {
                        console.info(e)
                    }
                })
            },

            // 创建地图全国marker信息  POI marker
            createChinaMarker: function (data) {
                try{

                        let _this = this, map = _this.map, loc = data.location
                        let div = document.createElement('div')
                        div.className = 'circle'
                        div.style.backgroundColor = 'red'
                        div.id = data.adcode
                        div.innerHTML = data.total || 0
                        let marker = new AMap.Marker({
                            content: div,
                            title: data.name + '共' + data.total + '个结果',
                            position: [ loc.lng, loc.lat ],
                            offset: new AMap.Pixel(-24, 5),
                            zIndex: data.total,
                            cityCode: data.name,
                            adcode: data.adcode
                        });
                        marker.setMap(map)

                        AMap.event.addListener(marker, 'click', function (e) {
                            let adcode = e.target.G.adcode
                            _this.mouseTool.close()
                            _this.setCityCode( e.target.tf.cityCode)
                            map.setZoom(10)
                            _this.searchPOI()
                            $('#' + adcode).addClass('adcode_cls').hide()
                        })
                        AMap.event.addListener(map, 'zoomend', function () {
                            if (map.getZoom() < 7) {
                                $('div.amap-marker-label').parents('div.amap-marker').empty()
                                $('div.adcode_cls').show()
                            }
                        });
                        _this.updateMap(map)
                }catch (e){
                    console.log(e)
                }
            },

            // 防止代理高德接口不好使， 备份接口
            searchChinaPOI_Base: function () {

                let _this = this
                let str = _this.poiStr + '&key=' + _this.key + '&city=' + _this.cityCode
                $.ajax({
                    url: 'http://restapi.amap.com/v3/place/text?' + str ,
                    type: 'get',
                    success: function (result) {
                        if (result.info == 'OK') {
                            let data = result.suggestion.cities , locationObj = _this.locationObj ;
                            _this.clearMaps()
                            data.forEach(function (el) {
                                let locObj = locationObj[el.adcode]
                                let loc = locObj.center.split(',')
                                Object.assign(el, {
                                    total: el.num,
                                    location: {
                                        lng: loc[ 0 ],
                                        lat: loc[ 1 ]
                                    }
                                })
                                _this.createChinaMarker(el);
                            })
                        }
                    }, error: function (e) {
                        console.info(e)
                    }
                })
            },

            //  tr内 Ip的POI信息
            searchTabTrPOI: function (poiStr) {
                let _this = this
                $.ajax({
                    url: 'http://restapi.amap.com/v3/place/around?'+ poiStr, //'http://restapi.amap.com/v3/geocode/regeo?' + poiStr + '',
                    type: 'get',
                    success: function (result) {
                        if (result.info == 'OK') {
                            let data = result.pois;

                            data.forEach(function (el) {
                                _this.createPOIMarker(el);
                            })
                        }
                    }, error: function (e) {
                        console.info(e)
                    }
                })
            },

            searchTabTrPOIArr: function () {
                let _this = this, poiArr = _this.tabPoiStrArr , map = _this.map,
                  tabList = _this.tabLocationList
                _this.clearCircleMarker()
                _this.clearPoiMarker()
                poiArr.forEach(function (el) {
                       _this.searchTabTrPOI(el)
                })

                tabList.forEach(function (t) {
                        let loc = t.location.split(',')
                        let circle = new AMap.Circle({
                            center: new AMap.LngLat(loc[ 0 ], loc[ 1 ]),// 圆心位置
                            radius: 500, //半径
                            strokeColor: "#F33", //线颜色
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 3, //线粗细度
                           // fillColor: "#ee2200", //填充颜色
                            fillOpacity: 0.35//填充透明度
                        })
                        circle.setMap(map)
                        _this.circleMarkerList.push(circle)
                })
            },

            // 创建IP maerker
            createIPMarker: function (d, result) {
                let _this = this, map = _this.map

                let marker = new AMap.Marker({
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                    position: [ d.location[ 0 ], d.location[ 1 ] ],
                    ip: d.ip.replace(/\./g, '')
                });
                marker.setMap(map);
                marker.setTitle(result.regeocode.formatted_address);
                marker.setLabel({
                    offset: new AMap.Pixel(20, 20),
                    content: result.regeocode.formatted_address
                });
                AMap.event.addListener(marker, 'click', function (e) {
                    _this.clickTr(e)
                })
                _this.updateMap(map)
            },

            // 创建地图marker信息  POI marker
            createPOIMarker: function (obj) {
                let _this = this , map = _this.map
                let loc = obj.location.split(',');
                let marker = new AMap.Marker({
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                    position: [ loc[ 0 ], loc[ 1 ] ]
                });

                marker.setTitle(obj.name);
                marker.setLabel({
                    offset: new AMap.Pixel(20, 20),
                    content: obj.name
                });
                marker.setMap(map);
                _this.poiMarkerList.push(marker)
                map.setCenter(new AMap.LngLat(loc[ 0 ], loc[ 1 ]))
                _this.updateMap(map)

            },

            //点击地图上IP的marker,关联table的对应行
            clickTr: function (o) {
                let ip = 'ip' + o.target.tf.ip,tr =  $("#" + ip)
                if(tr.hasClass('trClick')) return false
                tr.addClass('trClick')
                tr.click()
            },

            clearMaps:function () {
                let _this = this, map = _this.map
                map.clearMap()
                _this.updateMap(map)
            },

            clearPoiMarker:function () {
                let poiMarkerList = this.poiMarkerList
                if(!poiMarkerList.length) return false
                poiMarkerList.forEach(function (pm) {
                         pm.setMap(null)
                })
                this.poiMarkerList = []
            },

            clearCircleMarker:function () {
                let circleMarkerList = this.circleMarkerList
                if(!circleMarkerList.length) return false
                circleMarkerList.forEach(function (cm) {
                        cm.setMap(null)
                })
                this.circleMarkerList = []
            },

            uploadFrom:function () {
                let _this = this
                $.ajax({
                    url: '/file/readfilecontent',
                    type: 'POST',
                    data: _this.formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        try {
                            let msgArr = data[ 'message' ],ipsArr = []
                            if (data && msgArr.length) {
                                ipsArr = msgArr.split(',')
                                /*for (let i = 0, len = msgArr.length; i < len; i++) {
                                        ipsArr.push(msgArr[i].cip)
                                        if(msgArr[ i ].info == 'OK'){
                                            let lnglatObj = msgArr[ i ][ 'regeocode' ][ 'addressComponent' ][ 'streetNumber' ][ 'location' ].split(',');
                                            let lng = lnglatObj[ 0 ], lat = lnglatObj[ 1 ];
                                            let marker = new AMap.Marker({
                                                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                                position: [ lng, lat ]
                                            });
                                            marker.setMap(_this.map);
                                        }
                                }*/
                            }
                            _this.updateIpsArr(ipsArr);
                        } catch (e) { console.log(e)}
                    },
                    error: function (err) {console.log(err);}
                });
            }

        },
        ready: function () {
            let _this = this,map
            map = new AMap.Map("online-map", {
                resizeEnable: true,
                zoom: 11
            })
            map.setMapStyle('blue_night')  // light , fresh , dark
            _this.updateMap(map)
            _this.initMapPlugin()



        }
    }
</script>
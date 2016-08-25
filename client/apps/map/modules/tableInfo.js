import {updateMap, updateIpList, setTabLocation, setCityCode} from '../../..//vuex/action'
import {
    getKey, getMap, getIps, getIpsArr,
    getPoi, getIpList, getCityCode,
    getPoiStr, getTabPoiStr, getFormData
}  from '../../../vuex/getters'

export default {
    vuex: {
        actions: {
            updateMap
        },
        getters: {
            map: getMap,
            tabPoiStr: getTabPoiStr
        }
    },
    watch: {
        tabPoiStr () {
            this.searchToTabTrPOI()
        }
    },

    methods: {
        //  tr内 Ip的POI信息
        searchToTabTrPOI: function () {
            let _this = this
            let location = _this.tabPoiStr
            $.ajax({
                url: 'http://restapi.amap.com/v3/geocode/regeo?' + location + '',
                type: 'get',
                success: function (result) {
                    if (result.info == 'OK') {
                        var data = result.regeocode.pois;
                        data.forEach(function (el, index) {
                            _this.createPOIMarker(el, index);
                        })
                    }
                }, error: function (e) {
                    console.info(e)
                }
            })
        },

        // 创建地图marker信息  POI marker
        createPOIMarker: function (obj, index) {
            let _this = this, map = _this.map //marker-poi marker marker-normal marker-16
            let loc = obj.location.split(',');
            let marker = new AMap.Marker({
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                position: [ loc[ 0 ], loc[ 1 ] ]
            });
            marker.setMap(map);
            marker.setTitle(obj.name);
            marker.setLabel({
                offset: new AMap.Pixel(20, 20),
                content: obj.name
            });
            AMap.event.addListener(marker, 'click', function (e) {
                console.info(e)
            })

            map.setCenter(new AMap.LngLat(loc[ 0 ], loc[ 1 ]))

            AMap.event.addListener(map, 'zoomend', function () {
                console.log('++++' + map.getZoom())
                if (map.getZoom() <= 7) {$('div.amap-marker-label').parents('div.amap-marker').empty()}
            });

            _this.updateMap(map)
        }
    }
}
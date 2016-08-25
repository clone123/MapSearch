
import {updateMap, updateIpList, setTabLocation, setCityCode} from '../../../vuex/action'
import {
    getKey, getMap, getIps, getIpsArr,
    getPoi, getIpList, getCityCode,
    getPoiStr, getTabPoiStr, getFormData
}  from '../../../vuex/getters'

export default{

    vuex:{
        actions:{
            updateIpList,
            updateMap,
            setTabLocation

        },
        getters:{
            map: getMap,
            ips: getIps,
            ipList: getIpList
        }
    },

    watch:{
        ips () {
            this.searchIP2()
        }
    },

    methods:{
        searchIP2: function (ip) {
            let _this = this, ips = ip || this.ips
            $.ajax({
                url: 'http://220.181.159.76:8000/?ip=' + ips,
                tyle: 'get',
                data: [],
                success: function (result) {
                    if (result.info == 'OK') {
                        let d = result.location , map = _this.map
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
                        AMap.event.addListener(marker, 'click', function (e) {
                                _this.clickTr(e)
                        });

                        let ipList = Array.prototype.slice.apply(_this.ipList);
                        ipList.push(Object.assign(result, {
                            'cip': ips,
                            'tip': ips.replace(/\./g, ''),
                            'location': d.lng + ',' + d.lat
                        }));
                      //  console.info(_this.ipList[0])
                        map.setCenter(new AMap.LngLat(d.lng, d.lat))
                        _this.updateIpList(ipList)
                       // _this.updateMap(map)
                    }
                }, error: function (e) {
                    console.log(e);
                }
            })
        },

        //点击地图上IP的marker,关联table的对应行
        clickTr: function (o) {
            let _this = this
            let trs = $('table tr'), ip = 'ip' + o.target.tf.ip
            trs.removeClass('trClick')
            $("#" + ip).addClass('trClick');
            let tabLocation = o.lnglat.lng + ',' + o.lnglat.lat;
            _this.setTabLocation(tabLocation)
        }
    }
}

import {updateMap, updateIpList, setTabLocation, setCityCode} from '../../..//vuex/action'
import {
    getKey, getMap, getIps, getIpsArr,
    getPoi, getIpList, getCityCode,
    getPoiStr, getTabPoiStr, getFormData
}  from '../../../vuex/getters'

import searchIp from './searchIp'

export default{

    mixins: [ searchIp ],

    vuex: {
        actions: {
            updateIpList,
            updateMap
        },
        getters: {
            map: getMap,
            ipList: getIpList,
            formData: getFormData,
        }
    },
    watch: {
        ipsArr () {
            this.searchIPArr()
        },
        formData () {
            this.uploadFrom()
        }
    },

    methods: {

        searchIPArr: function () {
            let _this = this,
                ipArr = _this.ipsArr
            ipArr.forEach(function (ip) {
                console.log('ip+++++++' + ip)
                _this.searchIP(ip)
            })
        },

        uploadFrom: function () {
            let _this = this
            $.ajax({
                url: '/ipFileUpload',
                type: 'POST',
                data: _this.formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    try {
                        let msgArr = data[ 'message' ];
                        if (data && msgArr.length) {
                            let ipArr = [], map = _this.map
                            for (let i = 0, len = msgArr.length; i < len; i++) {
                                ipArr.push(msgArr[ i ]);
                                let lnglatObj = msgArr[ i ][ 'regeocode' ][ 'addressComponent' ][ 'streetNumber' ][ 'location' ].split(',');
                                let lng = lnglatObj[ 0 ], lat = lnglatObj[ 1 ];
                                let marker = new AMap.Marker({
                                    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                    position: [ lng, lat ]
                                });
                                marker.setMap(map);
                            }
                            let ipListBase = Array.prototype.slice.apply(_this.ipList)
                            ipArr = ipArr.concat(ipListBase)
                            _this.updateIpList(ipArr)
                            _this.updateMap(map)
                        }
                    } catch (e) { console.log(e)}
                },
                error: function (err) {console.log(err);}
            });
        }
    }
}

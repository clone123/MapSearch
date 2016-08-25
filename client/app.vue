<template>
    <map></map>
    <div id="list">
        <search-poi></search-poi>

        <table-Info></table-Info>
    </div>
</template>

<script>


    import map from './apps/map/map.vue'
    import tableInfo from './apps/tableInfo/tableInfo.vue'
    import searchPoi from './apps/search/search.vue'
    import {setLocationObj, setToken} from './vuex/action'
    import {getKey} from './vuex/getters'
    import page from 'page';
    import global from './commons/global'
    export default {
        vuex: {
            actions: {
                setLocationObj,
                setToken
            },
            getters:{
                key:getKey
            }
        },
        data: function () {
            return {
                locationObj: {}
            }
        },
        methods: {

            // 获取IP token
            getIPtoken: function () {
                let _this = this;
                $.get('http://220.181.159.76:8000/token', function (result) {
                    if (result.token) {
                        _this.setToken(result.token)
                    }
                })
            },

            // 得到全国各省市的经纬度数据，adcode为key
            getProvinceCityLocation: function () {
                let _this = this
                $.ajax({
                    url: 'http://restapi.amap.com/v3/config/district?subdistrict=2&key=' + _this.key + '',
                    type: 'get',
                    success: function (result) {
                        if (result.info == 'OK' && result.districts.length) {
                            _this.formatProvinceCityData(result.districts[0].districts)
                        }
                    }, error: function (e) { console.log(e)}
                })
            },

            // 二次封装数据格式
            formatProvinceCityData: function (data) {
                let _this = this, arr = data

                let EachCity = function (dt) {
                        dt.forEach(function (el) {
                            _this.locationObj[ el.adcode ] = {
                                center: el.center,
                                level: el.level,
                                name: el.name,
                                citycode: el.citycode,
                                adcode: el.adcode
                            }
                            if (el.districts.length) {
                                EachCity(el.districts)
                            }
                        })
                }
                EachCity(arr)
               // _this.setLocationObj(_this.locationObj)
            },
            router: function (ctx) {
                var searchType = ctx.params.searchType;
                global.url.uri = searchType;
                global.url.queryString = ctx.querystring;
            }


        },
        components: {
            map: map,
            tableInfo: tableInfo,
            searchPoi: searchPoi
        },
        created: function () {
            let _this = this;
            _this.getIPtoken();
            page.base('/');
            page('/',  this.router)
            page(':searchType',  this.router)
            page.start();
          //  _this.getProvinceCityLocation()
        }
    }

</script>

<template>
    <div class="panel-default" id="search-table-info" v-show="!!ipList.length">
        <div class="panel-heading">IP 列表</div>
        <div class="panel-body">
            <div class="form-inline clearfix sti-opts">
                <select class="form-control" v-model="selectTab">
                    <option selected value="">POI 类别</option>
                    <option v-for="poi in poiTypes" value="{{poi.value}}">POI: {{poi.name}}</option>
                </select>
                <select class="form-control" v-model="tabRadius">
                    <option value="500" selected>500米</option>
                    <option value="1000">1000米</option>
                    <option value="3000">3000米</option>
                    <option value="5000">5000米</option>
                </select>
                <button class="btn btn-default" type="button" @click="searchTabPOI" id="searchBtnTabPOI">搜 索</button>
                <a @click="ipAddressDown" download="ipAddress.csv"
                   href="javascript:" class="btn btn-default btn-sti-download">下载</a>
            </div>
            <div class="sti-label">
                <span class="label label-primary" v-for="tabLocation in tabLocationList">{{tabLocation.ip}}</span>&nbsp;
            </div>
            <div class="sti-view">
                <table class="table table-bordered">
                    <tr>
                        <th>ip</th>
                        <th colspan="2">address</th>
                    </tr>
                    <template v-for="ipObj in ipList">
                        <tr id="ip{{ipObj.tip}}" data-location="{{ipObj.location}}" @click="tabClick({location:ipObj.location,ip:ipObj.cip},$event)">
                            <td>{{ipObj.cip}}</td>
                            <td>{{ipObj.regeocode.formatted_address}}</td>
                            <td width='70'>
                                <a href="https://ti.360.com/search?q={{ipObj.cip}}&token={{token}}" target="_blank">TI</a>&nbsp;&nbsp;
                                <a href="http://101.199.126.121:9172/viz?k=ip&v={{ipObj.cip}}" target="_blank">VIZ</a>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
        </div>
    </div>

</template>

<script>
    import './style.css'
    import {updateTabPoiStrArr, setTabLocationList} from '../../vuex/action'
    import {
      getKey, getToken,getMap,
      getPoiTypeArr, getTabLocation,
      getTabLocationList, getIpList
    } from '../../vuex/getters'

    export default {

        vuex: {
            actions: {
                updateTabPoiStrArr,
                setTabLocationList
            },
            getters: {
                map:getMap,
                key: getKey,
                tabLocationList:getTabLocationList,
                ipList: getIpList,
                poiTypes: getPoiTypeArr,
                token: getToken
            }
        },

        data: function () {
            return {
                selectTab: '',
                tabRadius: '500',
                tabPoiStrArr:[],
                marker:null
            }
        },

        methods: {

            // 选择tr时 搜索POI
            searchTabPOI: function () {
                let _this = this;
                let trs = $('tr.trClick'), len = trs.length
                _this.tabPoiStrArr = []
                for (let i = 0; i < len; i++) {
                    let tr = trs[ i ], loc = $(tr).data('location')
                    _this.searchTabTrPOI(loc)
                }
                if(!len){
                    _this.searchTabTrPOI('')
                }

            },
            // 文件下载
            ipAddressDown: function (event) {
                let _this = this
                if (!_this.ipList.length) { return false;}
                let data = _this.getTrInfosForA()
                let str = "\ufeff" + data,
                  blob = new Blob([ str ], { type: 'text/csv,charset=UTF-8' }),
                  csvUrl = URL.createObjectURL(blob);
                event.target.href = csvUrl
            },
            //拼接下载文件的数据字符串
            getTrInfosForA: function () {
                let trs = $('table tr'), thStr = '', tdStr = '';
                for (let i = 0, len = trs.length; i < len; i++) {
                    let tr = $(trs[ i ]), tds = tr.find('td'),
                      ip = tds.eq(0).text(), address = tds.eq(1).text()
                    if (i < 1) {
                        let ip = tr.find('th').eq(0).html(), address = tr.find('th').eq(1).html()
                        thStr += ip + ',' + address + '\n'
                    } else {
                        tdStr += ip + ',' + address + '\n'
                    }
                }
                return thStr + tdStr
            },
            //  tr内 Ip的POI信息
            searchTabTrPOI: function (loc) {
                let _this = this
                let str = 'location=' + loc + '&types=' + _this.selectTab + '&key=' + _this.key + '&radius=' + _this.tabRadius + '&extensions=all'
                _this.tabPoiStrArr.push(str)
                _this.updateTabPoiStrArr(_this.tabPoiStrArr)
                if(_this.marker){
                    _this.marker.setMap(null);
                }
            },

            // 点击table的每行tr
            tabClick: function (trObj,event) {
                let _this = this,map = _this.map,
                  tabLocationList = _this.tabLocationList
                let obj = $(event.target).parent('tr')

                if (obj.hasClass('trClick')) {
                    obj.removeClass('trClick')
                    tabLocationList = tabLocationList.filter(function (el) {
                               return  trObj.ip != el.ip
                    })
                    _this.marker.setMap(null)
                } else {
                    obj.addClass('trClick');
                    tabLocationList.push(trObj)
                    let loc = trObj.location.split(',')

                    if(_this.marker){
                         _this.marker.setMap(null);
                    }
                    _this.marker = new AMap.Marker({
                           icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                           position:[loc[0] , loc[1]]
                    })
                    _this.marker.setAnimation('AMAP_ANIMATION_DROP')
                    _this.marker.setMap(map);
                }
                _this.setTabLocationList(tabLocationList)
            }

        },
        ready() {
            let $table = $(this.$el).find('.sti-view');
            let offsetTop = $table.offset().top;
            function resize(){
                let winHei = $(window).height();
                let tbHei = winHei - offsetTop - 40;
                $table.css('max-height',tbHei + 'px');
            }
            resize();
            $(window).resize(resize);
        }

    }

</script>
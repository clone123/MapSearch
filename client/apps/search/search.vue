<template>
    <div id="search-input">
        <div class="btn-group">
            <button class="btn btn-default dropdown-toggle" type="button" style="width: 65px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{selected}} <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li @click="selectSearchType('POI')">
                    <a href="javascript:">POI</a>
                </li>
                <li @click="selectSearchType('IP')">
                    <a href="javascript:">IP</a>
                </li>
            </ul>
        </div>
        <input type="text" id="searchContent" placeholder="{{selected}} 搜索" v-model="searchContent" @keyup.enter="search"/>
        <label for="fileIp" id="upload-ip-file" title="上传IP文件" v-show="selected == 'IP'">
            <span class="glyphicon glyphicon-upload"></span>
            <form id="uploadForm" style="display:none;">
                <input type="file" @change='fileSelected' id="fileIp" name="fileIp" accept="text/plain">
            </form>
        </label>
        <i class="icon" title="搜索" @click.stop.prevent="search">&#xe80d;</i>
    </div>
    <area-select v-ref:area-select v-show="selected == 'POI'"></area-select>
    <div class="btn-group" id="search-type" v-show="selected=='POI'">
        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{selectedPoi.name}} <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
            <li @click="typeSelected({name: '全部类别', value: ''})">
                <a href="javascript:">全部类别</a>
            </li>
            <li  v-for="poi in poiTypes" @click="typeSelected(poi)">
                <a href="javascript:">{{poi.name}}</a>
            </li>
        </ul>
    </div>

    <div class="btn-group">
        <button type="button"  @click="openPaint" class="btn btn-primary btn-lg">{{offObj.value}}</button>
    </div>
    <area-filter v-if="showFilter"></area-filter><!---->
</template>


<script>

    import {updatePoiStr,updateIpList, updatePoi, updateIpsArr, updateFormData,setOffObj} from '../../vuex/action'
    import {getMap,getLocationObj,getPoiTypeArr,getIpsArr,getCityCode,getAreaInfo,getOffObj,getCountryHtml} from '../../vuex/getters'
    import areaSelect from './area.vue'
    import areaFilter from './areaFilter.vue'
    import page from 'page'
    import global from '../../commons/global'
    import _ from 'lodash'
    export default {

        vuex : {
            actions: {
                updatePoiStr,
                updatePoi,
                updateFormData,
                updateIpsArr,
                setOffObj,
                updateIpList
            },
            getters: {
                locationObj:getLocationObj,
                poiTypes:getPoiTypeArr,
                ipsArr: getIpsArr,
                cityCode:getCityCode,
                area: getAreaInfo,
                offObj:getOffObj,
                map:getMap
            }
        },
        watch: {
            ipsArr: function(ips){
                this.searchContent = ips.join(',');
                page('/ip?content=' + this.searchContent);
            },
            searchContent: function(){
                if(!this.searchContent){
                    this.showFilter = false;
                }
            }
        },

        data: function () {
            return {
                selected: 'POI',
                searchContent: '',
                selectType: '',
                global,
                showFilter: false,
                selectedPoi: {
                    name: '全部类别',
                    value: ''
                }
            }
        },

        methods: {

            // POI 查询
            selectSearchType: function(type){
                let _this = this , map = _this.map
                _this.selected = type;
                _this.searchContent = '';
                map.clearMap()
                _this.updateIpList([])
                page('/');
            },
            fileSelected: function(event){
                if (!event.target.value) {
                    return;
                }
                let _this = this,
                    formData = new FormData(document.querySelector("#uploadForm"));
                _this.updateFormData(formData)
            },
            search: function () {
                let _this = this ,poiStr;
                let uri = '/poi';
                let txt = _this.searchContent

            //    _this.showFilter = false;

                if(!_this.searchContent && !_this.selectType){ return false}

                if(_this.selected == 'POI'){
                    if(_this.cityCode == '100000'){
                         poiStr = txt;
                    }else{
                         poiStr = 'keywords=' + _this.searchContent + '&types=' + _this.selectType +'&r='+ new Date().getTime()
                    }
                    uri = '/poi?content=' + txt + '&type=' + _this.selectType + '&area=' + _this.cityCode;

                    _this.updatePoiStr(poiStr);

                    if(_this.cityCode == '100000'){
                        _this.showFilter = true;
                    }
                }else{
                    let ipArr = []
                    uri = 'ip';
                    if (txt) {
                        ipArr = txt.split(',')
                    }
                    _this.updateIpsArr(ipArr);
                    uri = '/ip?content=' + txt;
                }
                page(uri);
            },
            typeSelected(poi){
                this.selectedPoi = poi;
                this.selectType = poi.value;
            },

            openPaint:function () {
                let _this = this , off = _this.offObj
                if(off.flag){
                    _this.setOffObj({
                           flag:false,
                            value:'已关闭鼠标绘画'
                    })
                }else{
                    _this.setOffObj({
                        flag:true,
                        value:'已开启鼠标绘画'
                    })
                }
            }
        },
        ready: function(){
            if(this.global.url.uri){
                this.selected = this.global.url.uri.toLocaleUpperCase();
            }
            let query = {};
            this.global.url.queryString.split('&').forEach(function(que){
                que = que.split('=');
                query[que[0]] = que[1];
            });
            if(query.content){
                this.searchContent = query.content;
            }
            if(query.type){
                let poi = _.find(this.poiTypes, function(po){
                    return po.value == query.type
                });
                if(poi){
                    this.selectedPoi = poi;
                    this.selectType = poi.value
                }
            }

            if(query.city){
                let city = null;
                this.area.districts[0].districts.forEach(function(province){
                    let c = _.find(province.districts, function(area){
                        return area.adcode == query.city
                    })
                    if(c){
                        city = c;
                    }
                });
                if(city){
                    this.$refs.areaSelect.selectCity(city);
                }
            }


        },
        components: {
            areaSelect,
            areaFilter

        }
    }

</script>
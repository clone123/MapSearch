<template>
    <div id="area-figure">
        <div id="area-selected" @click.stop="showCity=!showCity">{{current.name }}<i class="icon"
                                                                                     :class="{ 'active': showCity}">
            &#xe804;</i></div>
        <div id="area-float" v-show="showCity" @click.stop>
            <i class="icon icon-close" @click="showCity=false">&#xe80c;</i>
            <figure>
                <div class="area-figcation">当前城市: {{current.name }}</div>
                <div class="area-dl">
                    <dl>
                        <dt>全国：</dt>
                        <dd>
                            <li @click="selectCity(area.districts[0])">全国</li>
                        </dd>
                    </dl>
                    <dl v-for="province in area.districts[0].districts" v-if="province.districts.length">
                        <dt>{{province.name}}：</dt>
                        <dd>
                            <li v-for="city in province.districts" @click="selectCity(city)">{{city.name}}</li>
                        </dd>
                    </dl>
                </div>
            </figure>
        </div>
    </div>
</template>
<script>

    import {setCityCode, updateMap} from '../../vuex/action'
    import {getCityCode, getMap,getAreaInfo} from '../../vuex/getters'
    import './style.css';
    export default{
        vuex: {
            actions: {
                setCityCode,
                updateMap
            },
            getters: {
                cityCode: getCityCode,
                map: getMap,
                area: getAreaInfo
            }
        },
        data(){
            return {
                current: {
                    "citycode": [],
                    "adcode": "100000",
                    "name": "全国",
                    "center": "116.3683244,39.915085",
                    "level": "country"
                },
                showCity: false,
                msg: 'hello vue'
            }
        },
        methods: {
            selectCity(city,flag){
                let vm = this, map = this.map,
                  loc = city.center.split(',')

                vm.showCity = false;
                vm.current = city;
                vm.setCityCode(city.adcode);
                if(!flag)map.clearMap()
                if(city.adcode =='100000'){
                      vm.setCityCode(city.adcode)
                      map.setZoom(5)
                      return false
                }else{
                    vm.$parent.showFilter = false;
                    map.setZoom(10)
                }
                map.setCenter(new AMap.LngLat(loc[ 0 ], loc[ 1 ]))
                vm.updateMap(map)
                if(!flag){vm.setMapCity()}
            },
            setMapCity:function () {
                let vm = this, map = vm.map, zoom = map.getZoom()
                map.getCity(function (result) {
                    vm.setCityCode(result.citycode)
                    if (zoom <= 7) {
                        if(!result.citycode && !result.city) {
                            vm.current.name = '全国'
                            vm.setCityCode('100000')
                        }else{
                            vm.current.name = result.province
                        }
                    }else{
                        vm.current.name = result.city || result.province
                    }
                })
            }
        },
        ready() {
            let vm = this, map = vm.map;
            vm.setMapCity()
            $(document).on('click', function () {
                 vm.showCity = false;
                 if(vm.cityCode !='100000'){
                      vm.setMapCity()
                 }
            });
            AMap.event.addListener(map, 'zoomend', function () {
                if(vm.cityCode !='100000'){
                    vm.setMapCity()
                }
            });
        }
    }
</script>

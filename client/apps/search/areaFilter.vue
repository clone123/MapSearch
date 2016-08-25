<template>
    <div id="area-filter" v-show="countryHtml">
        {{{countryHtml}}}
    </div>
</template>
<script>

    import {setCityCode, updateMap,setCountryHtml} from '../../vuex/action'
    import {getCityCode, getMap,getAreaInfo, getCountryHtml,getLocationObj} from '../../vuex/getters'
    import './style.css';
    export default{
        vuex: {
            actions: {
                setCityCode,
                updateMap,
                setCountryHtml
            },
            getters: {
                cityCode: getCityCode,
                map: getMap,
                area: getAreaInfo,
                countryHtml: getCountryHtml,
                locationObj:getLocationObj
            }
        },

        methods: {
             bindEvent:function () {
                let _this = this , serp = $(this.$el), map = _this.map
                serp.delegate(".province-name", 'click', function(){
                    let province = $(this).parents('.sug-province');
                    if(province.hasClass('sug_cities_show')){
                        province.removeClass('sug_cities_show');
                    }else{
                        serp.find('.sug_cities_show').removeClass('sug_cities_show');
                        province.addClass('sug_cities_show');
                    }
                    return false
                })

                serp.delegate('div.sug_cities a','click',function () {
                    let parentComp = _this.$parent , obj = $(this),
                      cityCode = obj.attr('adcode'), city = _this.locationObj[cityCode]

                    _this.setCityCode(cityCode)
                    parentComp.search()
                    parentComp.$refs.areaSelect.selectCity(city,1);
                    return false
                })

                serp.delegate('.serp-return','click',function () {
                    map.clearMap()
                    _this.setCountryHtml('')
                })

                 let offsetTop = serp.offset().top;
                 function resize(){
                     let winHei = $(window).height();
                     let tbHei = winHei - offsetTop - 50;
                     serp.css('max-height',tbHei + 'px');
                 }
                 resize();
                 $(window).resize(resize);
            }
        },
        ready() {
            this.bindEvent()
        }
    }
</script>

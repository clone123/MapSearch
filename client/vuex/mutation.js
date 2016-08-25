
import * as types from './mutation-types'

export  default {

    [types.UPDATE_IP_LIST](state, ipList) {
        state.ipList = ipList;
    },
    [types.UPDATE_IPS](state, ips) {
        state.ips = ips;
    },
    [types.UPDATE_IPS_ARR](state, ipsArr) {
        state.ipsArr = ipsArr;
    },

    [types.UPDATE_TAB_POI_STR_ARR](state, tabPoiStrArr){
        state.tabPoiStrArr = tabPoiStrArr
    },

    [types.UPDATE_POI_STR](state, poiStr){
        state.poiStr = poiStr
    },

    [types.UPDATE_POI](state, poi){
        state.poi = poi
    },

    [types.UPDATE_FORM_DATA](state, formDate){
        state.formData = formDate;
    },

    [types.UPDATE_MAP](state, map){
        state.map = map
    },

    [types.SET_TAB_LOCATION](state, tabLocation){
        state.tabLocation = tabLocation
    },

    [types.SET_TAB_LOCATION_LIST](state, tabLocationList){
        state.tabLocationList = tabLocationList
    },

    [types.SET_LOCATION_OBJ](state, locationObj){
        state.locationObj = locationObj
    },

    [types.SET_AREA_INFO](state , areaInfo){
        state.areaInfo = areaInfo
    },

    [types.SET_POI_TYPE_ARR](state, poiTypeArr){
        state.poiTypeArr = poiTypeArr
    },

    [types.SET_CITY_CODE](state, cityCode){
        state.cityCode = cityCode
    },

    [types.SET_OFF_OBJ](state , offObj){
        state.offObj = offObj
    },

    [types.SET_COUNTRY_HTML](state , countryHtml){
        state.countryHtml = countryHtml
    },

    [types.SET_TOKEN](state, token){
        state.token = token
    }
}
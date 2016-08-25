const updateIpList = makeAction('UPDATE_IP_LIST')
const updateIps = makeAction('UPDATE_IPS')
const updateIpsArr = makeAction('UPDATE_IPS_ARR')
const updatePoi = makeAction('UPDATE_POI')
const updateTabPoiStrArr = makeAction('UPDATE_TAB_POI_STR_ARR')
const updateMapMarker = makeAction('UPDATE_MAP_MARKER')
const updatePoiStr = makeAction('UPDATE_POI_STR')
const updateFormData = makeAction('UPDATE_FORM_DATA')
const updateMap = makeAction('UPDATE_MAP')


const setTabLocation = makeAction('SET_TAB_LOCATION')
const setLocationObj = makeAction('SET_LOCATION_OBJ')
const setToken = makeAction('SET_TOKEN')
const setPoiTypeArr = makeAction('SET_POI_TYPE_ARR')
const setCityCode = makeAction('SET_CITY_CODE')
const setTabLocationList = makeAction('SET_TAB_LOCATION_LIST')
const setAreaInfo = makeAction('SET_AREA_INFO')
const setOffObj = makeAction('SET_OFF_OBJ')
const setCountryHtml = makeAction('SET_COUNTRY_HTML')


function makeAction (type) {
	return ({ dispatch }, ...args) => dispatch(type, ...args)
}

export {
	updateIpList,
  updateIps,
	updateIpsArr,
	updatePoi,
	updateTabPoiStrArr,
	updatePoiStr,
	updateMapMarker,
	updateFormData,
	updateMap,
	setTabLocation,
	setLocationObj,
	setToken,
	setPoiTypeArr,
	setCityCode,
	setTabLocationList,
	setAreaInfo,
	setOffObj,
	setCountryHtml
}

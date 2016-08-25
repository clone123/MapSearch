import Vue from 'vue'
import Vuex from 'vuex'
import mutations from  './mutation'
import cityInfo from '../data/cityInfo'
import areaInfo from  '../data/areaInfo'

Vue.use(Vuex)

const state = {
    map: '',
    key: '38435f770f1aa5186d4ea8980bbe982a', // 高德地图的key钥匙
    token: '',  // TI url需要
    ipList: [], // 存储ip列表
    locationObj: cityInfo, // 存储 全国各省市的经纬度信息，
    areaInfo:areaInfo,
    tabLocationList: [], // 点击地图上IP的marker和table的tr的时候，对应这个IP的经纬度
    cityCode: '', // 城市 adcode
    ipsArr: [], //单个/多个/批量上传ip
  //  poi: '', // poi input
    poiStr: '', // /*poi 查询字符串——keyword+type*/
  //  tabPoiStr: '',
    tabPoiStrArr:[], /*table列表里面的 poi查询字符串——location+type+radius+key*/
    formData: '', // 上传file
    countryHtml:'',
    offObj:{
        flag:true,
        value:'已开启鼠标绘画'
    },
    poiTypeArr: [
        { value: '01', name: '汽车服务' }, { value: '02', name: '汽车销售' },
        { value: '03', name: '汽车维修' }, { value: '04', name: '摩托车服务' },
        { value: '05', name: '餐饮服务' }, { value: '06', name: '购物服务' },
        { value: '07', name: '生活服务' }, { value: '08', name: '体育休闲服务' },
        { value: '09', name: '医疗保健服务' }, { value: '10', name: '住宿服务' },
        { value: '11', name: '风景名胜' }, { value: '12', name: '商务住宅' },
        { value: '13', name: '政府机构及社会团体' }, { value: '14', name: '科教文化服务' },
        { value: '141201', name: '学校;高等院校' }, { value: '141300', name: '科研机构' },
        { value: '15', name: '公交设施服务' }, { value: '16', name: '金融保险服务' },
        { value: '17', name: '公司企业' }, { value: '18', name: '道路附属设施' },
        { value: '19', name: '地名地址信息' }, { value: '20', name: '公共设施' }
    ]   // poi 的类型分类
}


export default new Vuex.Store({
    state,
    mutations
})
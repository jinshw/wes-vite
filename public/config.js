/**
 * 安保配置---S
 */

var mapIp =  'http://172.19.250.35' // 地图服务地址-本机地址
//var mapIp =  'http://192.168.1.5:9111' // 地图服务地址-本机地址

var anbaoConfig = {
  mapUrl: {
    yingxiangUrl : mapIp+"/img/zhuchenqu/Image/{z}/{x}/{y}.jpg",// 主城区影像地址
    qxsyUrl : mapIp+"/ntqx/tileset.json",// 南通体育馆倾斜摄影地址
    //hadUrl : mapIp+"/ntroad-WUJIANTOU/tileset.json",//南通高精路网数据
    //hadUrl : mapIp+"/ntroad-WUJIANTOUONLY/tileset.json",//南通高精路网数据
    hadNoArrowLightUrl : mapIp+"/roadmodel20240524/3DT_0619工农南路无监控杆无箭头/tileset.json",//无箭头、无灯杆路网数据
    hadUrl : mapIp+"/roadmodel20240524/工农路-虹桥路-工农南路/tileset.json",//南通高精路网数据
    wmsIPUrl: mapIp+":8080/geoserver/nantong/wms", //南通行政路网
  }
}


  
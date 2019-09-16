//wxpay.js
//获取应用实例
const app = getApp()
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key 


Page({
  data: {
    motto: '企帐通',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    qztUrl: ''
  },
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var tempUrl = "";
    var params = "";
    for (var p in options) {//遍历json对象的每个key/value对,p为key
      if("qztUrl" == p){
        tempUrl = options[p];
      }else{
        params += (p + "=" + options[p] + "&");
      }
    }
    params = params.substring(0, params.length -1);
    console.log(tempUrl + "?" + params);
    this.setData({
      qztUrl: tempUrl + "?" + params
    });
  }
})

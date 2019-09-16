// pages/register/step2/step2.js
const http = require('../../../utils/http.js');
const validata = require("../../../utils/validata.js")
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: '2', //登录类型1：账号密码登录，2：微信，3：验证码登录
    role: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {method} = options;
    this.setData({
      method: method|| '2'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  handleChangeRole(e){
    let { role } = e.currentTarget.dataset;
    this.setData({
      role
    })
  },

  handleNext(){
    let {role} = this.data;
    this.jumpPage(role);
    return;
    let title = role=='1'? '门店老板':'门店员工';
    wx.showModal({
      title: title,
      content: '请核对角色，一旦确认不可修改',
      success:(res)=> {
        if (res.confirm) {
          this.jumpPage(role);
        } else if (res.cancel) {
          
        }
      }
    })
  },
  jumpPage(role){
    wx.navigateTo({
      url: '../step3/step3?role=' + role,
    })
  },
  getPhoneNumber: function (e) {
    let { encryptedData, iv } = e.detail;
    if (!encryptedData){
      return
    }
    let upData = { encryptedData, iv, openid: wx.getStorageSync('openid') };
    wx.showLoading({ title: '加载中' });
    http.post({
      url: '/WeiXinAction/phoneNumber',
      data: upData,
      header:{
        'Content-Type':'application/json'
      },
      success: (res) => {
        let result = res.data.result;
        let {phoneNumber} = result;
        let wxuserInfo = wx.getStorageSync('wxuserinfo')
        let upData = { ...wxuserInfo, mobile: phoneNumber, method: '2',openid: wx.getStorageSync('openid')}
        this.loginApi(upData)
      }
    })
  },
  loginApi(upData) {
    http.post({
      url: '/LoginAction/login',
      data: upData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result;
        wx.setStorageSync('useinfo', result);
        wx.setStorageSync('token', result.token);
        if (result.role == 0){
          let { role } = this.data;
          this.jumpPage(role);
          return
        }
        
        switch (result.accountState) {
          case '1':
            if (result.qztUserState == 'AUTH_OK' || result.qztUserState == 'ENABLE') {
              this.jumpPage('../../webPage/webPage')
            } else if (result.qztUserState == 'AUTH_ING' || result.qztUserState == 'AUTH_FAIL') {
              this.jumpPage('../../qztRegister/qztAuthIng?qztUserState=' + result.qztUserState);
            } else {
              this.jumpPage('../../qztRegister/qztRegister')
            }
            break;
          case '2':
          case '3':
            this.jumpPage('../../vipMember/vipMember')
            break;
          default:
            return;
        }

      }
    })
  }
})
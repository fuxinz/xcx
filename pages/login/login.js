// pages/login/login.js
const http = require('../../utils/http.js');
const validata = require("../../utils/validata.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: 1,
    mobile: '',
    password: '',
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync('token');
    let openid = wx.getStorageSync('openid');
    this.setData({
      openid
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jumpPage() {
    wx.reLaunch({
      url: '../qztRegister/qztCheck'
    })
  },
  
  handleLogin(e) {
    let { mobile, password } = e.detail.value;
    let phoneTip = validata.checkTel(mobile);
    if (phoneTip !== '') {
      http.showToast(phoneTip);
      return;
    }
    let passWordTip = validata.checkPassWord(password);
    if (passWordTip !== '') {
      http.showToast(passWordTip);
      return;
    }
    let {method, openid} = this.data;
    http.post({
      url: '/LoginAction/getLogin?mobile=' + mobile + '&method=' + method + '&password=' + password + '&openid=' + openid,
      // data: upData,
      success: (res) => {
        let useinfo = res.data.result;
        wx.setStorageSync('useinfo', useinfo);
        wx.setStorageSync('token',useinfo.token);
        this.jumpPage();
      }
    })
  },

  handleClear(e){
    let {type} = e.currentTarget.dataset;
    this.setData({
      [type]: ''
    })
  }
})
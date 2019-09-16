// pages/register/step3/step3.js
const http = require('../../../utils/http.js');
const validata = require("../../../utils/validata.js")
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: '1',
    method: '2',
    sellerPhone: '',
    inviterInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { method} = options;
    this.setData({
      method: method || '2'
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

  checkSellerPhone(){
    let { sellerPhone, role } = this.data;
    http.post({
      url: '/LoginAction/sellerVerify?mobile=' + sellerPhone + '&role=' + role,
      success: (res) => {
        let data = res.data;
        this.setData({
          inviterInfo: data.result
        })
      }
    })
  },

  bindInput(e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      [type]: e.detail.value
    })
  },
  //完成注册
  handleComplete(){
    let { role, sellerPhone } = this.data;
    let upData={
      role: role,
      openid: wx.getStorageSync('openid'),
      fid: wx.getStorageSync('useinfo').ownerid,
      sellerPhone: sellerPhone
    }
    wx.showLoading({ title: '加载中' });
    console.log(upData)
    this.registerApi(upData);
  },

  registerApi(upData){

    http.post({
      url: '/LoginAction/register?' + util.qsStringify(upData),
      success: (res)=>{
        wx.hideLoading();
        let useinfo = res.data.result;
        wx.setStorageSync('useinfo', useinfo);
        wx.setStorageSync('token', useinfo.token)
       
        if (upData.role=='1'){
          this.jumpPage('../../vipMember/vipMember?type=1');
        }else{
          this.jumpPage('../../webPage/webPage');
        }
      }
    })
  },
  jumpPage(page) {
    wx.reLaunch({
      url: page
    })
  },
  handleClear(e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      [type]: ''
    })
  },
  jumpAgreement() {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },

  getPhoneNumber: function (e) {
    let { encryptedData, iv } = e.detail;
    if (!encryptedData) {
      return
    }
    let upData = { encryptedData, iv, openid: wx.getStorageSync('openid') };
    wx.showLoading({ title: '加载中' });
    http.post({
      url: '/WeiXinAction/phoneNumber',
      data: upData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        let result = res.data.result;
        let { phoneNumber } = result;
        let wxuserInfo = wx.getStorageSync('wxuserinfo')
        let upData = { ...wxuserInfo, mobile: phoneNumber, method: '2', openid: wx.getStorageSync('openid') }
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
        this.handleComplete();
      }
    })
  }
})
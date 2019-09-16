// pages/register/step1/step1.js
const http = require('../../../utils/http.js');
const validata = require("../../../utils/validata.js")
const util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    code: '',
    codeTxt: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  handleNext(e){
    let { mobile, code } = this.data;
    let phoneTip = validata.checkTel(mobile);
    if (phoneTip !== '') {
      http.showToast(phoneTip);
      return;
    }
    let userInfo = e.detail.userInfo;
    let { avatarUrl, province, nickName, gender } = userInfo;
    let openid = wx.getStorageSync('openid');
    if (!openid) return;
    let upData = {
      method: '3',
      mobile: mobile,
      vcode: code,
      openid: openid
    }
    if (userInfo) {
      upData.avatarUrl = avatarUrl;
      upData.nickName = nickName
      upData.gender = gender;
      upData.address = province;
    }
    wx.showLoading({title: '加载中'});
    this.loginAction(upData);
  },

  loginAction(upData){
    http.post({
      url: '/LoginAction/login',
      data: upData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res)=>{
        wx.hideLoading();
        let result = res.data.result;
        wx.setStorageSync('useinfo', result);
        wx.setStorageSync('token', result.token);
        switch (result.accountState) {
          case '-1':
            wx.navigateTo({
              url: '../step3/step3?method=3',
            })
            break;
          case '1':
            if (result.qztUserState == 'AUTH_OK' || result.qztUserState == 'ENABLE') {
              // this.jumpPage('../../webPage/webPage');
              this.jumpPage('../../workspace/workspace');
            } else if (result.qztUserState == 'AUTH_ING' || result.qztUserState == 'AUTH_FAIL') {
              this.jumpPage('../../qztRegister/qztAuthIng?qztUserState=' + result.qztUserState);
            } else {
              this.jumpPage('../../qztRegister/qztRegister');
            }
            break;
          case '2':
          case '3':
            this.jumpPage('../../vipMember/vipMember');
            break;
          default:
            return;
        }
      }
    })
  },

  bindInput(e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      [type]: e.detail.value
    })
  },

  handleClear(e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      [type]: ''
    })
  },
  handleGetCode() {
    let { codeTxt ,mobile } = this.data;
    if(codeTxt != '获取验证码') return;
    let phoneTip = validata.checkTel(mobile);
    if (phoneTip !== '') {
      http.showToast(phoneTip);
      return;
    }
    
    http.post({
      url: '/LoginAction/sendValidateCode?mobile=' + mobile + '&type=2',
      success: (res) => {
        this.codeTimeOut();
        this.setData({
          codeTxt: '60S'
        })
      }
    })
  },
  //验证码倒计时
  codeTimeOut () {
    let m = 60;
    this.setData({
      codeTxt: m + 'S',
    })
    let Interval = setInterval(()=> {
      if (m <= 0) {
        clearInterval(Interval);
        this.setData({
          codeTxt: '获取验证码'
        })
      } else {
        m--;
        this.setData({
          codeTxt: m + 'S'
        })
      }
    }, 1000)
  },
  jumpPage(page) {
    wx.reLaunch({
      url: page
    })
  },
  jumpAgreement(){
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  }
})
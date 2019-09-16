// pages/qztRegister/qztRegister1.js
const http = require('../../utils/http.js');
const validata = require("../../utils/validata.js")
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    qztRegisterInfo:{},
    mobile: '',
    captcha : '',
    captchaTxt: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let qztRegisterInfo = app.globalData.qztRegisterInfo;
    let enterpriseArea = qztRegisterInfo.enterpriseArea;
    enterpriseArea = enterpriseArea && enterpriseArea.split(',') || [];
    console.log(enterpriseArea)
    let useinfo = wx.getStorageSync('useinfo')
    this.setData({
      qztRegisterInfo,
      region: enterpriseArea,
      mobile: useinfo.mobile
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
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindInput(e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      [type]: e.detail.value
    })
  },
  handleSubmit(e){
    console.log(e.detail.value)
    let updata = e.detail.value;
    let { mobile, captcha, legalPersonIdcard } = updata;
    for(let key in updata){
      if(updata[key]==''){
        http.showToast('请认真核对信息');
        return;
      }
    }
    let peopleIdTip = validata.checkPeopelId(legalPersonIdcard);
    if (peopleIdTip !== '') {
      http.showToast(peopleIdTip);
      return;
    }
    let phoneTip = validata.checkTel(mobile);
    if (phoneTip !== '') {
      http.showToast(phoneTip);
      return;
    }
    let codeTip = validata.checkCode(captcha)
    if (codeTip !== '') {
      http.showToast(codeTip);
      return;
    }
    updata.enterpriseArea = updata.enterpriseArea.join(',');
    // updata.enterpriseAreaId = this.data.qztRegisterInfo.enterpriseAreaId;
    wx.showLoading({ title: '加载中' });
    http.post({
      url: '/QztAction/qztRegisterData',
      data: util.qsStringify(updata),
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result;
        wx.reLaunch({
          url: './qztAuthIng?qztUserState=AUTH_ING&qztId=' + result,
        })
      }
    })
  },
  handleGetCode() {
    let { captchaTxt, mobile } = this.data;
    if (captchaTxt != '获取验证码') return;
    let phoneTip = validata.checkTel(mobile);
    if (phoneTip !== '') {
      http.showToast(phoneTip);
      return;
    }
    http.post({
      url: '/QztAction/smsCapthaSend?mobile=' + mobile,
      success: (res) => {
        this.codeTimeOut();
        this.setData({
          codeTxt: '60S'
        })
      }
    })
  },
  //验证码倒计时
  codeTimeOut() {
    let m = 60;
    this.setData({
      captchaTxt: m + 'S',
    })
    let Interval = setInterval(() => {
      if (m <= 0) {
        clearInterval(Interval);
        this.setData({
          captchaTxt: '获取验证码'
        })
      } else {
        m--;
        this.setData({
          captchaTxt: m + 'S'
        })
      }
    }, 1000)
  }
})
// pages/drawBill/cashier/EStaging.js
const http = require('../../../utils/http.js');
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankFlag: false,
    bankArray: [],
    bankObjArray: [],
    payMetArray: [6, 12],
    bankId: '',
    orderId: '',
    payMet: '',
    amount: '',
    periods: '请选择分期数',
    bankName: '请选择银行类别'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      amount,
      payMet,
      orderId
    } = options;
    this.setData({
      amount: amount,
      payMet: payMet,
      orderId: orderId
    })
    http.get({
      url: '/order/creditPayApply/banks',
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result;
        if (result.length > 0) {
          let newArr = []
          result.forEach((item) => {
            newArr.push(item.bankName)
          })
          this.setData({
            bankObjArray: result,
            bankArray: newArr
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bankPickerChange: function(e) {
    let {
      bankObjArray
    } = this.data
    let payMetArray = bankObjArray[e.detail.value].suportNpers.filter(item => {
      return item <= 12
    })
    this.setData({
      bankName: bankObjArray[e.detail.value].bankName,
      bankId: bankObjArray[e.detail.value].bankId,
      payMetArray: payMetArray
    })
  },
  NumPickerChange: function(e) {
    let {
      payMetArray
    } = this.data
    this.setData({
      periods: payMetArray[e.detail.value]
    })
  },
  handleConfirm() {
    let {
      amount,
      payMet,
      orderId,
      bankId,
      periods
    } = this.data
    if (!bankId) {
      http.showToast('请选择银行类别!')
      return;
    }
    if (periods == '请选择分期数') {
      http.showToast('请选择分期数!')
      return;
    }
    let upData = util.qsStringify({
      orderId,
      payMet,
      bankId,
      periods
    })
    wx.showLoading({ title: '加载中' });
    http.post({
      url: '/order/payOrder?' + upData,
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result;
        util.qsStringify({ amount, payMet, orderId })
        wx.setStorageSync('tempUrl', result.payUrl)
        let title = '车云e分期';
        wx.navigateTo({
          url: './qrcode?' + util.qsStringify({ amount, payMet, orderId, title }),
        })
      }
    })
  }
})
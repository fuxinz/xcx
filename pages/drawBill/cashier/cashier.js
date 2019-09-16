const http = require('../../../utils/http.js');
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    amount: '0',
    payMet: '',
    periods: '6'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { orderId, amount} = options;
    this.setData({
      orderId: orderId,
      amount: amount,
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
  changePayMethod(e){
    this.setData({
      payMet: e.detail.value
    })

  },
  selectBank(){
    let { orderId, payMet, periods, amount } = this.data;
      wx.navigateTo({
        url: './EStaging?' + util.qsStringify({ amount, payMet, orderId }),
      })
  },
  changePeriods(e){
    let { periods} = e.currentTarget.dataset;
    this.setData({
      periods: periods
    })
  },
  handleConfirm(){
    let { orderId, payMet, periods, amount } = this.data;
    if (payMet==''){
      http.showToast('请选择支付方式！')
      return;
    }
    let upData = util.qsStringify({
      orderId,
      payMet,
      periods: payMet == '3' ? periods: ''
    })
    wx.showLoading({ title: '加载中' });
    http.post({
      url: '/order/payOrder?' + upData,
      success: (res)=>{
        wx.hideLoading();
        let result = res.data.result;
        if (payMet == '0'){
          wx.reLaunch({
            url: '../../workspace/workspace',
          })
          return;
        }
        util.qsStringify({ amount, payMet, orderId})
        wx.setStorageSync('tempUrl', result.payUrl)
        let title = '';
        switch (payMet) {
          case '1': 
            title = 'POS支付'
            break;
          case '2':
            title = '微信支付'
            break;
          case '3':
            title = '车云e分期'
            break;
          default:
            title = '扫描支付'
        }
        wx.navigateTo({
          url: './qrcode?' + util.qsStringify({ amount, payMet, orderId, title }),
        })
      }
    })
  }
})
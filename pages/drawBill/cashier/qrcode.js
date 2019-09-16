const http = require('../../../utils/http.js');
const drawQrcode = require("../../../utils/weapp.qrcode.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '0',
    orderId: '',
    payMet: '',
    intervalTime: 0,
    payUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { amount, orderId, payMet, title} = options;
    let payUrl = wx.getStorageSync('tempUrl');

    if (payMet != '2') {
      this.drawQrcodeAction(payUrl);
    }

    let intervalTime = setInterval(()=>{
      this.searchOrderById(orderId)
    },10000)
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      amount,
      orderId,
      payMet,
      intervalTime,
      payUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let { payMet, payUrl} = this.data;
    if (payMet != '2') {
      this.drawQrcodeAction(payUrl);
    }
  },

  onUnload: function () {
    let { intervalTime } = this.data;
    clearInterval(intervalTime)
  },

  drawQrcodeAction(payUrl){
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: payUrl
    })
  },
  goWorkSpace(){
    this.jumpPage('/pages/workspace/workspace');
  },
  //INIT:初始状态 PROCESSING:支付中 SUCCESS:交易成功 FAIL:交易失败 CANCEL:交易撤销 REFUND:交易退款 REFUND_PROCESSING:交易退款中 CLOSE:交易关闭
  searchOrderById(orderId){
    http.get({
      url: '/order/searchOrderById?id=' + orderId,
      success: (res) => {
        let result = res.data.result;
        if(result.qztTradeStatus=='SUCCESS'){
          this.jumpPage('./success');
        }
      }
    })
  },
  jumpPage(url){
    let { intervalTime } = this.data;
    clearInterval(intervalTime)
    wx.reLaunch({
      url: url
    })
  }
})
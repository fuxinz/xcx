const http = require('../../../utils/http.js');
const drawQrcode = require("../../../utils/weapp.qrcode.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ownerid:'',
    src2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { ownerid } = options;
    this.setData({
      ownerid
    })
    // this.getAccessToken()
    this.getQrcode();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getQrcode(accessToken){
    
    let { ownerid } = this.data;
    
    let page = "pages/my/team/phoneInvite";
    http.post({
      url: '/WeiXinAction/share?page=' + page + '&scene='+ ownerid,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          src2: result
        })
      }
    })
  }
})
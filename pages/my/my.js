// pages/my/my.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useinfo: {}
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
    let useinfo = wx.getStorageSync('useinfo');
    this.setData({
      useinfo
    })
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

  jumpPage(e) {
    console.log(e)
    let { page } = e.currentTarget.dataset;
    console.log(e)
    wx.navigateTo({
      url: page
    })
  },
  quitAction(){
    wx.reLaunch({
      url: '../register/step1/step1'
    })
  },

  qztWalletRedirect(){
    http.post({
      url: '/QztAction/qztWalletRedirect',
      success: (res) => {
        let result = res.data.result;
        wx.setStorageSync('storageUrl', result)
        wx.setStorageSync('title', '钱包');
        wx.navigateTo({
          url: '../webPage/webPage?url=storageUrl',
        })
      }
    })
  },
  /**
   * 财富中心
   */
  financialSupermarket(){
    let { useinfo } = this.data;
    http.post({
      url: '/financialAction/financialSupermarket?entType=2&userId=' + useinfo.ownerid,
      success: (res) => {
        let result = res.data.result;
        wx.navigateTo({
          url: '../webPage/webPage?url=' + result,
        })
      }
    })
  },
  /**
   * 帮助中心
   */
  help() {
    wx.setStorageSync('title', '帮助中心');
    wx.setStorageSync('storageUrl', http.baseUrl+'/help.html')
    wx.navigateTo({
      url: '../webPage/webPage?url=storageUrl',
    })
  }
})
// pages/webPage/webPage.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    web_src: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = wx.getStorageSync('openid');
    let { url } = options;
    if (url == 'storageUrl'){
      url = wx.getStorageSync('storageUrl');
      let title = wx.getStorageSync('title');
      wx.setNavigationBarTitle({
        title: title
      });
    }
    console.log(url)
    this.setData({
      // web_src: 'http://113.204.6.165:16501/chejiemeng-small-program/LoginAction/loginIndex.do?openid=' + openid
      web_src: url || (http.otherUrl+'/LoginAction/loginIndex.do?openid=' + openid) 
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

  }
})
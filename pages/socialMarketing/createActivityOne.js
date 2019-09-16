const http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markCreateList: [],
    vCRMActivityId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMarkCreateList();
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

  createActivity: function () {
    let { vCRMActivityId } = this.data;
    if (vCRMActivityId){
      wx.redirectTo({
        url: 'createAcitivityTwo?vCRMActivityId=' + vCRMActivityId,
      })
    }
  },

  getMarkCreateList(){
    http.get({
      url: '/MarketingAction/markCreateList',
      success: (res => {
        let result = res.data.result;
        this.setData({
          markCreateList: result
        })
      })
    })
  },

  checkMark(e){
    this.setData({
      vCRMActivityId: e.detail.value
    })
  },

  jumpDetail(e){
    let { id } = e.currentTarget.dataset;
    console.log(id)
    wx.navigateTo({
      url: 'detail?vCRMActivityId='+id,
    })
  }
})
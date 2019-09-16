// pages/storeChain/storeChain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarData: [
      {
        id: '1',
        txt: '行业新闻1'
      },
      {
        id: '2',
        txt: '行业新闻2'
      },
      {
        id: '3',
        txt: '行业新闻3'
      },
      {
        id: '4',
        txt: '行业新闻4'
      },
      {
        id: '5',
        txt: '行业新闻5'
      },
    ],
    indexId: '1'
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeTabbarAction(e) {
    console.log(e.currentTarget.id)
    let id = e.currentTarget.id; 
    this.setData({
      indexId: id
    })
  }
})
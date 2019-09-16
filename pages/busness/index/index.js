const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabItem: 0,
    busnessData: {},
    insuranceData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getBusnessData(); // 获取现场商机数据
      this.getInsuranceData(); //获取保养返厂数据
  },
  getInsuranceData: function () {
    // http.get({
    //   url: '/BusinessController/busiInit',
    //   success: (res => {
    //     let data = res.data;
    //     if (data.code == 0) {
    //       this.setData({
    //         busnessData: data.result
    //       })
    //     }
    //   })
    // })
  },
  getBusnessData: function () {
    http.get({
      url: '/BusinessController/busiInit',
      success: (res => {
        let data = res.data;
        if (data.code == 0) {
          this.setData({
            busnessData: data.result
          })
        }
      })
    })
  },
  changeTab: function (e) {
    var index = e.currentTarget.dataset.index;
    if (index==1){
      http.showToast('功能完善中！')
      return;
    }
    this.setData({
      tabItem: index
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
  
  }
})
// pages/drawBill/cashier/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 10,
    intervalTime: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let intervalTime = setInterval(()=>{
      let {time} = this.data;
      time = time-1;
      this.setData({
        time: time
      })
      if (time==0){
        this.jumpPage();
      }
    },1000)
    this.setData({
      intervalTime
    })
  },

  onUnload: function () {
    let { intervalTime } = this.data;
    clearInterval(intervalTime)
  },

  jumpPage(){
    let { intervalTime } = this.data;
    clearInterval(intervalTime);
    wx.reLaunch({
      url: '/pages/workspace/workspace'
    })
  }  
})
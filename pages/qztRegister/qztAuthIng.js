// pages/qztRegister/qztAuthIng.js
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qztUserState: 'AUTH_ING',
    txt: '',
    timer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { qztUserState, qztId } = options;
    this.setData({
      qztUserState: qztUserState,
      txt: ''
    })
    let useinfo = wx.getStorageSync('useinfo');
    let tempQztId = qztId || useinfo.qztId;
    console.log('---------------------------------',tempQztId)
    this.getQztStatus(tempQztId, (res) => {
      let result = res.data.result;
      this.callBackAction(result)
    });
    if (qztUserState =='AUTH_ING'){
      let timer = setInterval(()=>{
        this.getQztStatus(tempQztId,(res)=>{
          let result = res.data.result;
          this.callBackAction(result)
        });
      },20000);
      this.setData({
        timer: timer
      })
    }
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
    clearInterval(this.data.timer);
  },

  jumpPage(){
    wx.reLaunch({
      url: './qztRegister',
    })
  },
  getQztStatus(qztId,fn){
    http.post({
      url: '/QztAction/qztStatus?outUserId=' + qztId,
      success: (res)=>{
        fn&& fn(res);
      }
    })
  },
  callBackAction(result){
    if (result.qztRealStatus == 'AUTH_OK') {
      this.updatauserInfo();
    } else {
      this.setData({
        qztUserState: result.qztRealStatus,
        txt: result.qztMemo
      })
    }
  },
  updatauserInfo(){
    http.get({
      url: '/LoginAction/userInfo',
      success: (res) => {
        let result = res.data.result;
        wx.setStorageSync('useinfo', result);
        wx.reLaunch({
          url: '/pages/workspace/workspace',
        })
      }
    })
  }
})
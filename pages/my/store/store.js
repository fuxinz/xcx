const http = require('../../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStoreInfo();
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
  getStoreInfo(){
    http.get({
      url: '/StoreAction/storeInfo',
      success: (res) => {
        let result = res.data.result;
        this.setData({
          storeInfo: result
        })
      }
    })
  },
  chooseImage(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.fileUpload(res.tempFilePaths[0]);
      }
    })
  },
  fileUpload(path) {
    wx.showLoading({ title: '加载中' });
    let TOKEN = wx.getStorageSync('token');
    wx.uploadFile({
      url: http.baseUrl + '/FileController/STORE',
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        "Cookie": 'JSESSIONID=' + TOKEN
      },
      success: (res) => {
        wx.hideLoading();
        let data = JSON.parse(res.data);
        if (data.code == '0') {
          let result = data.result;
          this.setData({
            ['storeInfo.image']: result.fullUrl
          })
        }
      }
    })
  },
  handleSubmit(e){
    let updata = e.detail.value;
    let {storeInfo} = this.data;
    console.log(updata)
    updata.id = storeInfo.id;
    updata.image = storeInfo.image;
    http.post({
      url: '/StoreAction/storeInfo',
      data: updata,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res)=>{
        
      }
    })
  }
})
// pages/qztRegister/qztRegister.js
const http = require('../../utils/http.js');
const validata = require("../../utils/validata.js")
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    legalPersonIdcardPositive: null,
    legalPersonIdcardBack: null,
    openingPermitPic: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getqztRegisterInfo();
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

  handleNext(e){
    let { legalPersonIdcardPositive, legalPersonIdcardBack, openingPermitPic} = this.data;
    if (legalPersonIdcardPositive == null || legalPersonIdcardBack == null || openingPermitPic == null){
      http.showToast('请上传图片！');
      return;
    }
    
    let updata = { legalPersonIdcardPositive, legalPersonIdcardBack, openingPermitPic };
    console.log(updata)
    this.qztRegister1(updata);
  },
  chooseImage(e){
    let { type } = e.currentTarget.dataset;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=>{
        this.fileUpload(res.tempFilePaths[0],type);
      }
    })
  },

  qztRegister1(updata){
    wx.showLoading({ title: '加载中' });
    http.post({
      url: '/QztAction/qztRegisterPic',
      data: updata,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result;
        app.globalData.qztRegisterInfo = result;
        wx.navigateTo({
          url: './qztRegister1'
        })
      }
    })
  },

  fileUpload(path,type) {
    wx.showLoading({ title: '加载中' });
    let TOKEN = wx.getStorageSync('token');
    wx.uploadFile({
      url: http.baseUrl +'/FileController/QZT',
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        "Cookie": 'JSESSIONID=' + TOKEN
      },
      success:(res) => {
        wx.hideLoading();
        let data = JSON.parse(res.data);
        if (data.code == '0'){
          let result = data.result;
          this.setData({
            [type]: result.fullUrl
          })
        }
      }
    })
  },

  getqztRegisterInfo(){
    http.get({
      url: '/QztAction/qztRegisterInfo',
      success: (res)=>{
        let result = res.data.result;
        let { legalPersonIdcardPositive, legalPersonIdcardBack, openingPermitPic} = result;
        
        this.setData({
          legalPersonIdcardPositive,
          legalPersonIdcardBack,
          openingPermitPic
        })
        app.globalData.qztRegisterInfo = result;
      }
    })
  }
})
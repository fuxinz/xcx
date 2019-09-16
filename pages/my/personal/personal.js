const http = require('../../../utils/http.js');
const validata = require("../../../utils/validata.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useinfo: {},
    mobile: '',
    name: '',
    headimgurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let useinfo = wx.getStorageSync('useinfo');
    this.setData({
      mobile: useinfo.mobile,
      name: useinfo.nick,
      headimgurl: useinfo.headimgurl,
      useinfo: useinfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  bindInput(e) {
    let {
      type
    } = e.currentTarget.dataset;
    this.setData({
      [type]: e.detail.value
    })
  },
  handleSubmit() {
    let {
      mobile,
      name,
      useinfo
    } = this.data;
    if (name.length >0 &&name< 10){
      http.showToast('请1-10长度的用户名')
      return
    }
    let phoneTip = validata.checkTel(mobile);
    if (phoneTip !== '') {
      http.showToast(phoneTip);
      return;
    }
    http.post({
      url: '/LoginAction/userInfo?mobile=' + mobile + '&name=' + name,
      success: (res) => {
        useinfo.nick = name;
        useinfo.mobile = mobile;
        wx.setStorageSync('useinfo', useinfo)
        wx.navigateBack({
          
        })
      }
    })
  }
})
const http = require('../../../utils/http.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useinfo:{},
    team: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let useinfo = wx.getStorageSync('useinfo');
    this.setData({
      useinfo
    })
    this.getTeamMsgs();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let { useinfo, team } = this.data;
    return {
      title: '邀请同事',
      imageUrl: team.logo || '../../../img/icon-01.png',
      path: '/pages/my/team/phoneInvite?ownerid=' + useinfo.ownerid,
      success: function (res) {
        console.log(res)
      }
    }
  },

  getTeamMsgs() {
    http.get({
      url: '/TeamController/getTeamMsgs',
      success: (res) => {
        let result = res.data.result;
        this.setData({
          team: result
        })
      }
    })
  },

  jumpUpdatePage(){

    wx.redirectTo({
      url: './updateTeam',
    })
  },
  jumpQrcode(){
    let { useinfo} = this.data;
    wx.navigateTo({
      url: './qrcode?ownerid=' + useinfo.ownerid,
    })
  },
  jumpColleaguePage(){
    wx.navigateTo({
      url: './colleague?type=1',
    })
  },
  handleTransfer(){
    wx.showModal({
      title: '团队转让',
      content: '您是团队创建者，更换门店前需要转让团队，是否确认转让团队？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: './colleague?type=2',
          })
        } 
      }
    })
  }
})
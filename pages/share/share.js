//获取应用实例
const http = require('../../utils/http.js');

Page({
  data: {
    motto: '企帐通',
    shareUrl: ''
  },
  onLoad: function (options) {
    var tempUrl = '';
    let otherUrl = http.otherUrl
    if ('activity' == options.type){
      //活动分享详情
      tempUrl = otherUrl + '/MarketingAction/marketingShare.do?salesmanPhone=' + options.salesmanPhone + '&smId=' + options.smId
    } else if ('team' == options.type){
      //团队邀请注册
      tempUrl = otherUrl + '/TeamAction/myTeam-invitation.do?teamId=' + options.teamId + '&invitationId=' + options.invitationId
    } else {
      //没有类型的，全部跳到首页
      tempUrl = '/pages/index/index' ;
    }
    
    this.setData({
      shareUrl: tempUrl
      
    }, function () {

    });
    wx.showShareMenu({
      withShareTicket: true
    });
    
  }
})
const http = require('../../../utils/http.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useinfo: {},
    type: '1', //1.同事管理，2.转让团队
    members: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { type } = options;
    let useinfo = wx.getStorageSync('useinfo');
    this.setData({
      useinfo
    })
    this.setData({
      type: type || '1'
    })
    this.getTeamMember();
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

  confimSearch(e) {
    let value = e.detail.value;
    this.getTeamMember(value);
  },
  
  getTeamMember(param){
    param = param || '';
    http.get({
      url: '/TeamController/getTeamMember?param=' + param,
      success:(res) => {
        let result = res.data.result;
        this.setData({
          members: result
        })
      }
    })
  },

  handleCheckColleague(e){
    let { useinfo } = this.data;
    if(useinfo.role == 2){
      return;
    }
    let { item, i } = e.currentTarget.dataset;
    let {type} = this.data;
    if(type==1){
      wx.showModal({
        title: '删除团队成员',
        content: '确认是否要删除团队成员？',
        success: (res) => {
          if (res.confirm) {
            this.deleteTeamMember(item.userid, i);
          }
        }
      })
    }else if(type==2){
      wx.showModal({
        title: '团队转让',
        content: '确认是否要转让团队？',
        success: (res) => {
          if (res.confirm) {
            this.transferTeam(item);
          }
        }
      })
    }
  },

  deleteTeamMember(id, i){
    http.delete({
      url: '/TeamController/myTeamMemberDel?teamMemberIds='+id,
      success: (res)=>{
        let { members } = this.data;
        members.splice(i, 1);
        this.setData({
          members
        })
      }
    })
  },

  transferTeam(item){
    let updata = {
      newOwner: item.mobile,
      newOwnerId: item.userid,
    }
    updata = util.qsStringify(updata)
    http.post({
      url: '/TeamController/myTeamTransfer?' + updata,
      success: (res)=>{
        wx.redirectTo({
          url: '../../register/step1/step1',
        })
      }
    })
  }
})
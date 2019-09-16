const http = require('../../../utils/http.js');
const { AREA } = require('../../../utils/area.js');
const teamsizeObj = {
  '0': '请选择',
  '1': '0-10',
  '2': '10-20',
  '3': '>20' ,
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: '2',
    areaList: AREA,
    team: {},
    logo: '',
    name: '',
    area: '',
    teamsize: 1,
    teamsizeTxt: '0-10'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  getTeamMsgs() {
    http.get({
      url: '/TeamController/getTeamMsgs?timestamp=' + new Date().getTime(),
      success: (res) => {
        let result = res.data.result;
        let { area, name, logo, id, teamsize } = result;
        this.setData({
          area: area,
          name,
          logo,
          id,
          teamsize: teamsize || 1,
          teamsizeTxt: teamsizeObj[teamsize || 1]
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
      url: http.baseUrl + '/FileController/TEAM',
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
            logo: result.fullUrl
          })
        }
      }
    })
  },
  handleInputChange(e){
    let value = e.detail.value;
    let { type } = e.currentTarget.dataset;
    this.setData({
      [type]: value
    })
  },
  handleCheckScale(){
    wx.showActionSheet({
      itemList: ['0-10', '10-20', '>20'],
      success:(res) => {
        let index = res.tapIndex;
        let teamsize;
        switch (index){
          case 0:
            teamsize = 1;
          break;
          case 1:
            teamsize = 2;
            break;
          case 2:
            teamsize = 3;
            break;
          default:
            teamsize = 0;
        }
        this.setData({
          teamsize: teamsize,
          teamsizeTxt: teamsizeObj[teamsize]
        })
      }
    })
  },
  handleChangeArea(e){
    let value = e.detail.value;
    this.setData({
      area: this.data.areaList[value].province
    })
  },

  handleModify(){
    let { logo, name, teamsize, area, id} = this.data;
    let upData = { logo, name, teamsize, area, id}
    console.log(upData)
    http.post({
      url: '/TeamController/createTeam',
      data: upData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res)=>{
        wx.redirectTo({
          url: 'seeTeam'
        })
      }
    })
  }
})
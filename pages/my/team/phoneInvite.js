const http = require('../../../utils/http.js');
const validata = require("../../../utils/validata.js")
const util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    team: {},
    invitationId: '',
    mobile: '',
    vcode:'',
    codeTxt: '获取验证码',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { ownerid } = options;
    console.log(options)
    // let obj = wx.getLaunchOptionsSync();
    // let query = obj.query;
    console.log('===============>', decodeURIComponent(options.scene))
    ownerid = ownerid || decodeURIComponent(options.scene);
    console.log(ownerid)
    this.getOpenID();
    this.getTeamByFid(ownerid);
   
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
  handleInputChange(e) {
    let value = e.detail.value;
    let { type } = e.currentTarget.dataset;
    this.setData({
      [type]: value
    })
  },

  getTeamByFid(id){
    http.get({
      url: '/TeamController/getTeamByFid?fid='+id,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          team: result,
          invitationId: id
        })
      }
    })
  },

  sendValidateCode(){
    let { codeTxt, mobile } = this.data;
    if (codeTxt != '获取验证码') return;
    let phoneTip = validata.checkTel(mobile);
    if (phoneTip !== '') {
      http.showToast(phoneTip);
      return;
    }

    http.post({
      url: '/LoginAction/sendValidateCode?mobile=' + mobile + '&type=1',
      success: (res) => {
        this.codeTimeOut();
        this.setData({
          codeTxt: '60S'
        })
      }
    })
  },
  //验证码倒计时
  codeTimeOut() {
    let m = 60;
    this.setData({
      codeTxt: m + 'S',
    })
    let Interval = setInterval(() => {
      if (m <= 0) {
        clearInterval(Interval);
        this.setData({
          codeTxt: '获取验证码'
        })
      } else {
        m--;
        this.setData({
          codeTxt: m + 'S'
        })
      }
    }, 1000)
  },

  getUserInfo(e){
    let userInfo = e.detail.userInfo;
    if (userInfo) {
      let { avatarUrl, province, nickName, gender } = userInfo;
      wx.setStorageSync('wxuserinfo', { avatarUrl, province, nickName, gender });
      let { openid, invitationId, mobile, vcode, password, team} = this.data;
      let phoneTip = validata.checkTel(mobile);
      if (phoneTip !== '') {
        http.showToast(phoneTip);
        return;
      }
      let codeTip = validata.checkCode(vcode);
      if (codeTip !== '') {
        http.showToast(codeTip);
        return;
      }
      let passwordTip = validata.checkPassWord(password);
      if (passwordTip !== '') {
        http.showToast(passwordTip);
        return;
      }
      let teamId = team.id;
      this.handleSubmit({
        openid,
        invitationId,
        mobile,
        vcode,
        password,
        teamId,
        avatarUrl,
        province,
        nickName,
        gender
      })
    } else {
      http.showToast('请授权登录！！');
    }
  },

  handleSubmit(updata) {
    wx.showLoading({ title: '加载中' });
    http.post({
      url: '/TeamController/teamInvitation',
      data: updata,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result;
        wx.setStorageSync('useinfo', result);
        wx.setStorageSync('token', result.token);

        wx.reLaunch({
          url: '../../workspace/workspace',
        })
      }
    })
  },

  getOpenID() {
    wx.login({
      success: res => {
        http.post({
          url: '/WeiXinAction/getJsapiTicket?scode=' + res.code,
          success: (res) => {
            let openid = res.data.result;
            wx.setStorageSync('openid', openid);
            this.setData({
              openid
            })
          }
        })
      }
    })
  },
  
})
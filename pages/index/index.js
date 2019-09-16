//index.js
const http = require('../../utils/http.js');
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (options) {
    this.getOpenID();
  },

  jumpPage(page){
    wx.reLaunch({
      url: page,
    })
  },
  getOpenID() {
    wx.showLoading({title: '加载中'});
    wx.login({
      success: res => {
        // console.log(res.code)
        // return
        http.post({
          url: '/WeiXinAction/getJsapiTicket?scode=' + res.code,
          success: (res) => {
            let openid = res.data.result;
            wx.setStorageSync('openid', openid);
            this.setData({
              openid
            })
            this.loginApi({
              method: '2',
              openid,
            });
          }
        })
      }
    })
  },
  // getPhoneNumber: function (e) {
  //   let { encryptedData, iv } = e.detail;
  //   let upData = { encryptedData, iv, openid: wx.getStorageSync('openid') };
  //   http.post({
  //     url: '/WeiXinAction/phoneNumber?' + util.qsStringify(upData),
  //     success: (res) => {

  //     }
  //   })
  // },
  getUserInfo(e){
    let { action } = e.currentTarget.dataset;
    let userInfo = e.detail.userInfo;
    if(action=='phone'){
      wx.navigateTo({
        url: '../register/step1/step1',
      })
    }else{
      if (userInfo) {
        let { avatarUrl, province, nickName, gender } = userInfo;
        wx.setStorageSync('wxuserinfo', { avatarUrl, province, nickName, gender })
        wx.navigateTo({
          url: '../register/step3/step3',
        })
      }else{
        http.showToast('请授权登录！！');
      }
      // if (userInfo) {
      //   let { avatarUrl, province, nickName, gender } = userInfo;
      //   wx.setStorageSync('wxuserinfo', { avatarUrl, province, nickName, gender })
      //   let openid = wx.getStorageSync('openid');
      //   if (!openid) return;
      //   let upData = {
      //     method: '2',
      //     avatarUrl, 
      //     nickName, 
      //     gender, 
      //     openid,
      //     address: province
      //   }
      //   this.loginApi(upData);
      // }else{
      //   http.showToast('请授权登录！！');
      // }
    }
  },
  loginApi(upData){
    http.post({
      url: '/LoginAction/login',
      data: upData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result;
        wx.setStorageSync('useinfo', result);
        wx.setStorageSync('token', result.token);
        switch (result.accountState){
          case '-1':
            wx.navigateTo({
              url: '../register/step3/step3?method=2',
            })
            break;
          case '1':
            if (result.qztUserState == 'AUTH_OK' || result.qztUserState == 'ENABLE'){
              // this.jumpPage('../webPage/webPage')
              this.jumpPage('../workspace/workspace')
            } else if (result.qztUserState == 'AUTH_ING' || result.qztUserState == 'AUTH_FAIL'){
              this.jumpPage('../qztRegister/qztAuthIng?qztUserState=' + result.qztUserState);
            } else {
              this.jumpPage('../qztRegister/qztRegister')
            }
            break;
          case '2':
          case '3':
            this.jumpPage('../vipMember/vipMember')
            break;
          default:
            return;
        }
        
      }
    })
  }
})

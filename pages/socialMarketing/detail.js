const WxParse = require('../../wxParse/wxParse.js');
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
const validata = require("../../utils/validata.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFormShow: false,
    salesmanPhone: '',
    smId: '',
    activity:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('----------------',options)
    let { smId, vCRMActivityId, mobile } = options;
    if (vCRMActivityId) {
      this.getTemplateDetail(vCRMActivityId);
    } else if (smId) {
      this.getSocialMarketDetail(smId, mobile)
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

  },

  getSocialMarketDetail(id, mobile) {
    http.get({
      url: '/MarketingAction/socialMarket?smId=' + id,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          activity: result,
          isFormShow: true,
          salesmanPhone : mobile,
          smId: id
        })
        WxParse.wxParse('article', 'html', result.content, this, 5);
      }
    })
  },
  getTemplateDetail(id) {
    http.get({
      url: '/MarketingAction/template?vCRMActivityId=' + id,
      success: (res => {
        let result = res.data.result;
        result.exeType = result.type;
        this.setData({
          activity: result,
          isFormShow: false,
        })
        WxParse.wxParse('article', 'html', result.content, this, 5);
      })
    })
  },
  handleSubmit(e){
    let { socialUserName, socialUserPhone } = e.detail.value;
    let { salesmanPhone, smId } = this.data;
    if (socialUserName.length <= 0) {
      http.showToast('姓名不能为空！');
      return
    }
    let phoneTip = validata.checkTel(socialUserPhone);
    if (phoneTip !== '') {
      http.showToast(phoneTip);
      return;
    }
    let updata = { socialUserName, socialUserPhone, salesmanPhone, smId}
    http.post({
      url: '/MarketingAction/saveSocialDetails',
      data: util.qsStringify(updata),
      success: (res)=> {
        wx.showModal({
          title: '提示',
          content: '领取成功！',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  }
})
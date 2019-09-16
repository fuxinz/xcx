const http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    socialMarketId: '',
    searchContent: '',
    customerList: [],
    selectIds:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id } = options;
    this.setData({
      socialMarketId: id
    })
    this.getCustomerList();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  confimSearch(e){
    let value = e.detail.value;
    this.getCustomerList(value);
  },
  getCustomerList(searchContent){
    searchContent = searchContent || '';
    http.get({
      url: '/CustomerController/markClientSeleFill?searchContent=' + searchContent,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          customerList: result
        })
      }
    })
  },
  checkboxChange(e){
    let value = e.detail.value;
    this.setData({
      selectIds: value
    })
  },
  confirmAction(){
    let { selectIds, socialMarketId } = this.data;
    if (!selectIds || selectIds.length<=0){
      http.showToast('请选择客户！');
      return
    }
    http.post({
      url: '/MarketingAction/markSendClient',
      data: 'socialMarketId=' + socialMarketId + '&socialUserIds=' + selectIds.join(','),
      success:(res)=>{
        http.showToast('发劵成功！');
      }
    })
  }
})
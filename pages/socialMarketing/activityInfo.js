const http = require('../../utils/http.js');
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sheetTitle: '领券总张数',
    showCeng: false,
    iconDown: '../../img/icon-down.png',
    iconUp: '../../img/icon-up.png',
    selectIcon: '../../img/icon-selected.png',
    currentSelectStatus: '',
    total: 0,
    upData: {
      smId: '',
      pageNum: 1,
      searchContent: '',
      source: 1,
      status: ''
    },
    records:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id, source} = options;
    let title = '发券给客户';
    if (source!=1){
      title = '发券给朋友';
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      ['upData.smId']: id,
      ['upData.source']: source
    })
    this.getMarkClientFill();
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

  showCengFun: function () {
    this.setData({
      showCeng: !this.data.showCeng
    })
  },
  selectedFun: function (e) {
    let { status} = e.currentTarget.dataset;
    let text = '';
    switch (status) {
      case '':
        text = '领券总张数';
        break;
      case '1':
        text = '券使用张数';
        break;
      case '0':
        text = '券未用张数';
        break;
      case '2':
        text = '券已过期';
        break;
    }
    this.setData({
      sheetTitle: text,
      showCeng: false,
      currentSelectStatus: status,
      ['upData.status']: status,
      ['upData.pageNum']: 1
    })
    this.getMarkClientFill();
  },

  getMarkClientFill(){
    let {upData} = this.data;
    http.get({
      url: '/MarketingAction/markClientFill?' + util.qsStringify(upData),
      success: (res)=>{
        let result = res.data.result;
        this.setData({
          records: result.records,
          total: result.total,
          ['upData.pageNum']: result.current+1
        })
      }
    })
  },

  confimSearch(e) {
    let value = e.detail.value;
    this.setData({
      ['upData.pageNum']: 1,
      ['upData.searchContent']: value
    })
    this.getMarkClientFill();
  },
})
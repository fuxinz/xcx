const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
Page({
  data: {
    useinfo: {},
    activeStatus: 1,
    markList: [],
    activeId: '',
    activeTitle: '',
    activeFilepath: '',
    actionSheetHidden: false, // 控制分享弹窗modal
    isLoadMore: false,
    pageNum: 1
  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    let useinfo = wx.getStorageSync('useinfo');
    this.setData({
      useinfo
    })
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
    this.setData({
      markList:[],
      pageNum: 1
    })
    this.getMarkList(this.data.activeStatus);
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
    let { activeStatus, pageNum, isLoadMore } = this.data;
    if (isLoadMore){
      this.setData({
        pageNum: pageNum+1
      })
      this.getMarkList(activeStatus, pageNum + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let { activeId, activeTitle, activeFilepath, useinfo } = this.data;
    return {
      title: activeTitle,
      imageUrl: activeFilepath,
      path: '/pages/socialMarketing/detail?smId=' + activeId + '&mobile=' + useinfo.mobile,
      success: function (res) {
        console.log(res)
      }
    }
  },

  changeTab(e) {
    let { status } = e.currentTarget.dataset;
    this.setData({
      activeStatus: status,
      markList: [],
      pageNum: 1
    })
    this.getMarkList(status)
  },

  createActivity() {
    if (this.data.useinfo.role == '2') {
      wx.showToast({
        title: '员工不可创建优惠券，请门店老板创建',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: 'createActivityOne',
    })
  },

  getMarkList(activeStatus, pageNum){
    pageNum = pageNum || 1;
    http.get({
      url: '/MarketingAction/markList?pageNum=' + pageNum +'&status=' + activeStatus,
      success: (res => {
        let result = res.data.result;
        let { markList } = this.data;
        let isLoadMore = false;
        if (result.size == result.records.length){
          isLoadMore = true
        }
        this.setData({
          markList: markList.concat(result.records),
          isLoadMore: isLoadMore
        })
      })
    })
  },
  handleEdit(e){
    let { id } = e.currentTarget.dataset;
    this.setData({
      activeId: id
    })
    wx.navigateTo({
      url: 'createAcitivityTwo?smId=' + id,
    })
  },
  handleAnalysis(e){
    console.log(e.currentTarget.dataset)
    let dataset = e.currentTarget.dataset;
    let updata = util.qsStringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: 'activityAna?' + updata,
    })
  },
  handleShareVolume(e){
    let { item } = e.currentTarget.dataset;
    this.setData({
      activeId: item.id,
      activeTitle: item.exeName,
      activeFilepath: item.filepath
    })
    this.actionSheetChange();
  },

  shareCustomer(e){
    let { activeId } =this.data;
    wx.navigateTo({
      url: 'customer?id=' + activeId,
    })
  },

  // 改变 action-sheet状态。
  actionSheetChange(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  }
})

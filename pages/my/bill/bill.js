const http = require('../../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeStatus: 1,
    tabList:[
      { txt: '待付款', status: 1 },
      { txt: '已完成', status: 2 },
      { txt: '已取消', status: 3 },
    ],
    orderList: [],
    pageNum: 1,
    isLoadMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { activeStatus, pageNum} = this.data;
    this.getOrderList(activeStatus, pageNum);
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
    let { activeStatus, pageNum, isLoadMore } = this.data;
    if (isLoadMore) {
      this.setData({
        pageNum: pageNum + 1
      })
      this.getOrderList(activeStatus, pageNum + 1);
    }
  },

  changeTab(e){
    let { status } = e.currentTarget.dataset;
    let pageNum = 1;
    this.setData({
      activeStatus: status,
      orderList: [],
      pageNum: pageNum
    })
    this.getOrderList(status, pageNum);
  },

  getOrderList(status, pageNum){
    wx.showLoading({ title: '加载中' });
    http.get({
      url: '/order/searchOrder?pageSize=10&pageNum=' + pageNum +'&status=' + status,
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result;
        let { orderList} = this.data;
        let isLoadMore = false;
        if (result.size == result.records.length) {
          isLoadMore = true
        }
        
        this.setData({
          orderList: orderList.concat(result.records),
          isLoadMore: isLoadMore
        })
      }
    })
  },

  handleReceivable(e){
    console.log(e.currentTarget)
    let { id, amount } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '../../drawBill/cashier/cashier?orderId=' + id + '&amount=' + amount,
    })
  },

  handleCancel(e){
    let { id, i } = e.currentTarget.dataset;
    http.post({
      url:'/order/cancelOrder?orderId='+id,
      success: (res)=>{
        let result = res.data.result;
        let { orderList } = this.data;
        orderList.splice(i,1);
        this.setData({
          orderList
        })
      }
    })
  }
})
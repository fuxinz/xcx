const http = require('../../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id } = options;
    this.searchOrderById(id);
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
  searchOrderById(id){
    http.get({
      url: '/order/searchOrderById?id='+id,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          orderInfo: result
        })
      }
    })
  },

  handleBusiClosed() {
    let { orderInfo } = this.data;
    http.post({
      url: '/BusinessController/busiClosed?saleNo=' + orderInfo.saleNo,
      success: (res) => {
        let data = res.data;
        if (data.code == '0') {
          this.setData({
            [`orderInfo.orderOpStatus`]: '4'
          });
        }
      }
    })
  },
  
  jumpPage(url) {
    wx.navigateTo({
      url: url,
    })
  },

  showActionSheet() {
    let { orderInfo } = this.data;
    wx.showActionSheet({
      itemList: ['拨打电话回访', '编辑回访记录', '查看回访记录'],
      success: (res) => {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            wx.makePhoneCall({
              phoneNumber: orderInfo.tel
            })
            break;
          case 1:
            this.jumpPage('../editVisit/editVisit?saleNo=' + orderInfo.saleNo);
            break;
          case 2:
            this.jumpPage('../visit/visit?saleNo=' + orderInfo.saleNo);
            break;
          default:
            break;
        }
      }
    })
  },
  handleTurn(){
    let { orderInfo } = this.data;
    wx.redirectTo({
      url: '/pages/drawBill/service/service?type=turn&id=' + orderInfo.id,
    })
  }
})
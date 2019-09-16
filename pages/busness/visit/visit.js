const http = require('../../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    saleNo: '',
    recordList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { saleNo } = options;
    this.setData({
      saleNo
    })
    this.getVisitRecord(saleNo);
  },
  getVisitRecord(saleNo){
    http.get({
      url: '/BusinessController/busiFillVisitRecord?saleNo=' + saleNo,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          recordList: result || []
        })
      }
    })
  },
})
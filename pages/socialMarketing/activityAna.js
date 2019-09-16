const http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title:'',
    startTime: '',
    endTime: '',
    recordResult: {
      dx_total:0,
      dx_unused:0,
      dx_used:0,
      dx_usedzb: 0,
      lq_total:0,
      lq_unused:0,
      lq_used:0,
      lq_usedzb:0,
      total:0,
      unused:0,
      used: 0,
      usedzb:0
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id, title, startTime, endTime } = options;
    this.setData({
      title, startTime, endTime, id
    })
    this.getMarkRecordFill(id);
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

  getMarkRecordFill(id){
    http.get({
      url: '/MarketingAction/markRecordFill?smId='+id,
      success: (res => {
        let result = res.data.result;
        this.setData({
          recordResult: result
        })
      })
    })
  },

})
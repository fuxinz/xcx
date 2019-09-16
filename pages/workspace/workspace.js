// pages/workspace/workspace.js
const wxCharts = require('../../utils/wxcharts.js');
let lineChart = null;
const http = require('../../utils/http.js');
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useinfo: {},
    bannerList: [],
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    systemMsgNum: 0,
    nowTime: util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
    customerData: {},
    mySaleOrder: {},
    saleOrder: {},
    monthRankList: [],
    bannerImg: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBanners();
    this.getSystemMsg(); // 获取系统消息
    this.getCustomerCountData(); //获取客户全貌
    this.getMySaleOrderCountData(); //我的销售开单
    this.getStoreSaleData(); //门店销售开单
    this.getMonthRankList(); //销售排名
    // this.getGzzBannerImg(); //获取社群营销

  },
  getwxuserinfo: function() {
    wx.getUserInfo({
      lang: 'zh_CN',
      success: (res) => {
        let {
          avatarUrl,
          province,
          nickName,
          gender
        } = res.userInfo;
        wx.setStorageSync('wxuserinfo', {
          avatarUrl,
          province,
          nickName,
          gender
        })
      }
    })
  },

  getBanners() {
    http.get({
      url: '/yZMBGWordsController/banners',
      success: (res => {
        let result = res.data.result;
        this.setData({
          bannerList: result
        })
      })
    })
  },
  getWChart: function() {
    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      console.log(windowWidth)
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    let simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '成交量1',
        data: simulationData.data,
        format: function(val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        // title: '成交金额 (万元)',
        format: function(val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth - 60,
      height: 180,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  getGzzBannerImg: function() {
    http.get({
      url: '/GzzAction/gzzBanner',
      success: (res => {
        let data = res.data;
        if (data.code == 0) {
          this.setData({
            bannerImg: data.result
          })
        }
      })
    })
  },
  getMonthRankList: function() {
    http.get({
      url: '/GzzAction/getMonthRankList',
      success: (res => {
        let data = res.data;
        if (data.result.length>5){
          data.result.length = 5;
        }
        if (data.code == 0) {
          this.setData({
            monthRankList: data.result
          })
        }
      })
    })
  },
  getStoreSaleData: function() {
    http.get({
      url: '/GzzAction/getStoreSaleData',
      success: (res => {
        let data = res.data;
        if (data.code == 0) {
          this.setData({
            saleOrder: data.result
          })
        }
      })
    })
  },
  getMySaleOrderCountData: function() {
    http.get({
      url: '/GzzAction/getMySaleOrderCountData',
      success: (res => {
        let data = res.data;
        if (data.code == 0) {
          this.setData({
            mySaleOrder: data.result
          });
          this.getWChart()
        }
      })
    })
  },
  getCustomerCountData: function() {
    http.get({
      url: '/GzzAction/getCustomerCountData',
      success: (res => {
        let data = res.data;
        if (data.code == 0) {
          this.setData({
            customerData: data.result
          })
        }
      })
    })
  },
  getSystemMsg: function() {
    http.get({
      url: '/GzzAction/getNoReadPlatMsgCount',
      success: (res => {
        let data = res.data;
        if (data.code == 0) {
          this.setData({
            systemMsgNum: data.result[0].noreads
          })
        }
      })
    })
  },
  goToNextView: function(e) {
    var type = e.currentTarget.dataset.type;
    switch (type) {
      case 'busness':
        wx.navigateTo({
          url: '../busness/index/index',
        })
        break;
      case 'socialMarketing':
        wx.navigateTo({
          url: '../socialMarketing/index',
        })
        break;
      case 'bill':
        wx.navigateTo({
          url: '../drawBill/addCar/addCar',
        })
        break;
      case 'service':
        wx.navigateTo({
          url: '../drawBill/service/service?type=quick',
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let useinfo = wx.getStorageSync('useinfo');
    this.setData({
      useinfo
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  createSimulationData: function() {
    var categories = [];
    var data = [];
    var len = this.data.mySaleOrder.aWeekSaleData.length;
    for (var i = 0; i < len; i++) {
      categories.push(i + 1);
      data.push(this.data.mySaleOrder.aWeekSaleData[i]);
    }
    return {
      categories: categories,
      data: data
    }
  },

  handleHeaderClick(e) {
    console.log(e)
    let {
      item
    } = e.currentTarget.dataset;
    
    wx.setStorageSync('title', item.title);
    if (item.type == 1) {
      wx.setStorageSync('storageUrl', item.url)
      wx.navigateTo({
        url: '/pages/webPage/webPage?url=storageUrl',
      })
    } else if (item.type == 3) {//需要拼接用户id
      let { useinfo } = this.data;
      wx.setStorageSync('storageUrl', item.url + useinfo.ownerid);
      wx.navigateTo({
        url: '/pages/webPage/webPage?url=storageUrl',
      })
    }
  }
})
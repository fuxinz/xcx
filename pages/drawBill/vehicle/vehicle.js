// pages/drive/vehicle/vehicle.js
const http = require('../../../utils/http.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    siderList: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','W','X','Y','Z'],
    hotList: [],
    brandList: [],
    activeBrand: {},

    carType: [],
    activeType: {},

    carsList: [],
    activeCar: {},
    typeModal: false,
    carModal: false,
    toView:'',
    systemInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    wx.getSystemInfo({
      success: function(res) {
        me.setData({
          systemInfo: res
        });
      },
    })
    this.getBrand();
  },
  clickScroll: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      toView: id
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

  getCartype: function (brandId) {
    http.get({
      url: '/CarAction/mgc/getCarSeriesList?brand_id=' + brandId,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          carType: result
        })
      }
    })
  },

  closeTypeModal: function () {
    this.setData({
      typeModal: false,
    })
  },
  closeCarModal: function () {
    this.setData({
      carModal: false,
    })
  },
  handleHeaderBrand: function (e){
    let { index } = e.currentTarget.dataset;
    let activeBrand = this.data.hotList[index];
    this.setData({
      activeBrand,
      typeModal: true,
      carType: [],
      carsList: [],
    })
    this.getCartype(activeBrand.brand_id);
  },
  handleSelectBrand: function (e) {
    let {i,j} = e.currentTarget.dataset;
    let activeBrand = this.data.brandList[i].subList[j];
    this.setData({
      activeBrand,
      typeModal: true,
      carType: [],
      carsList: [],
    })
    this.getCartype(activeBrand.brand_id);
  },

  handleSelectType: function (e) {
    let { i, j } = e.currentTarget.dataset;
    let activeType = this.data.carType[i].list[j];
    this.setData({
      activeType,
      carsList: [],
      carModal: true
    })
    this.getCars(activeType.carstype_id);
  },
  handleSelectCar: function (e) {
    let { i, j } = e.currentTarget.dataset;
    let activeCar = this.data.carsList[i].list[j];
    this.setData({
      activeCar
    })
    let { activeBrand, activeType } = this.data;

    let vehicle = {
      brandIco: activeBrand.brand_logoimg,
      brandId: activeBrand.brand_id,
      brandName: activeBrand.brand_name,
      familyId: activeType.carstype_id,
      familyName: activeType.carstype_name,
      vehicle: activeCar.cars_name,
      vehicleId: activeCar.cars_id,
      vehicleName: activeCar.cars_sortname,
    }
    app.globalData.orderDto = Object.assign(app.globalData.orderDto, vehicle)
    wx.navigateTo({
      url: '../service/service',
    })
  },
  getBrand () {
    http.get({
      url: '/CarAction/mgc/xekdCarModels',
      success: (res) => {
        let { list, hotList} = res.data.result;
        let { siderList } = this.data;
        let tempArr = [];
        tempArr = siderList.map((value, index)=>{
          let subList = [];
          for(let i=0,len=list.length;i<len;i++){
            if (value == list[i].brand_letter){
              subList.push(list[i])
            }
          }
          return {
            title: value,
            subList: subList
          }
        })
        this.setData({
          brandList: tempArr,
          hotList: hotList
        })
      }
    })
  },
  getCartype (brandId) {
    http.get({
      url: '/CarAction/mgc/getCarSeriesList?brand_id=' + brandId,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          carType: result
        })
      }
    })
  },

  getCars: function (typeId) {
    http.get({
      url: '/CarAction/mgc/getCarModelList?carstype_id=' + typeId,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          carsList: result
        })
      }
    })
  }
})
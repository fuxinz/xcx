// pages/drawBill/addCar/addCar.js
const http = require('../../../utils/http.js');
// const validata = require('../../../utils/validata.js');
const { AREA } = require('../../../utils/area.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: AREA,
    province: '',
    plateNum: [],
    isShow: false,
    keyBoardType: 1,
    licenseNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let useinfo = wx.getStorageSync('useinfo');
    let { address: province } = useinfo;
    province = province || '重庆';
    let { plateNum, area } = this.data;
    area.forEach((item)=>{
      if(item.province.startsWith(province)){
        let word = item.word;
        plateNum[0]= word;
        return
      }
    })
    this.setData({
      province: province,
      plateNum: plateNum,
      keyBoardType: plateNum.length>0? 2: 1
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
  changeProvince(e){
    let value = e.detail.value;
    let { plateNum, area} = this.data;
    plateNum=[area[value].word];
    this.setData({
      province: area[value].province,
      plateNum: plateNum,
      keyBoardType: 2
    })
  },
  showPanelAction(){
    this.setData({
      isShow: true
    })
  },

  inputOk(){
    this.setData({
      isShow: false
    })
  },

  inputdelete(){
    
  },

  inputChange(val){

    let { plateNum, keyBoardType} = this.data;
    let value = val.detail;
    if (value){
      if (plateNum.length <= 0) {
        keyBoardType = 2;
        plateNum.push(value)
      } else if (plateNum.length > 0 && plateNum.length < 8){
        plateNum.push(value)
      }else{

      }
    }else{
      plateNum.pop();
    }
    
    this.setData({
      plateNum: plateNum,
      keyBoardType: plateNum.length <= 0 ? 1 : 2 
    })
  },
  clearAction(){
    this.setData({
      plateNum: [],
      keyBoardType: 1
    })
  },
  confirmAction(){
    let { plateNum } = this.data;
    plateNum = plateNum.join('')
    this.checkLicenceNo(plateNum)
  },

  chooseImage(e) {
    let { type } = e.currentTarget.dataset;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.ocrPlate(res.tempFilePaths[0]);
        this.setData({
          licenseNo: res.tempFilePaths[0]
        })
      }
    })
  },

  ocrPlate(path){
    wx.showLoading({ title: '加载中' });
    let TOKEN = wx.getStorageSync('token');
    wx.uploadFile({
      url: http.baseUrl + '/ocr/plate',
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        "Cookie": 'JSESSIONID=' + TOKEN
      },
      success: (res) => {
        wx.hideLoading();
        let data = JSON.parse(res.data);
        console.log(data)
        if (data.code == '0') {
          let result = data.result;
          result = JSON.parse(result)
          this.setData({
            plateNum: result['车牌号'].split(''),
            keyBoardType: 2
          })
        }
      }
    })
  },

  checkLicenceNo(plate) {
    http.post({
      url: '/CarAction/plate',
      data: {plate: plate},
      success: (res) => {
        let result = res.data.result;
        if (result){
          this.searchCustomer(plate);
        }
      }
    })
  },

  searchCustomer(plateNum){
    http.get({
      url: '/order/searchCustomer',
      data: { licenceNo: plateNum},
      success: (res) => {
        let result = res.data.result;

        if (result) {
          let { brandIco, brandId, brandName, customerName, customerId, customerPhone, familyId, familyName, vehicleId, vehicleName, mileage, remark } = result;
          app.globalData.orderDto = {
            licenceNo: plateNum,
            brandIco,
            brandId,
            brandName,
            customerName,
            customerId: customerId,
            tel: customerPhone,
            familyId,
            familyName,
            vehicleId,
            vehicleName,
            mileage,
            remark
          }
          wx.navigateTo({
            url: '../service/service',
          })
        } else {
          app.globalData.orderDto = { licenceNo: plateNum }
          wx.navigateTo({
            url: '../vehicle/vehicle',
          })
        }
      }
    })
  }
})
// pages/vipMember/vipMember.js
const http = require('../../utils/http.js');
const validata = require("../../utils/validata.js");
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '1',
    productList: [],
    activeProduct: 0,
    salePrice: 0,
    paymentPrice: 0,
    discountPrice: 0,
    useinfo: {},
    couponType: '',
    face: null,
    couponState: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    this.setData({
      type: type || '1'
    });
    let useinfo = wx.getStorageSync('useinfo')
    // console.log(useinfo)
    this.setData({
      useinfo
    })
    this.getProductList();
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

  getProductList() {
    http.get({
      url: '/BuyAction/productList',
      success: (res) => {
        let result = res.data.result;
        this.setData({
          productList: result,
          activeProduct: 0,
          paymentPrice: result[0].salePrice,
          salePrice: result[0].salePrice,
        })
        this.getcouponNew();
      }
    })
  },
  //
  getcouponNew(){
    http.get({
      url: '/BuyAction/couponNew',
      success: (res)=>{
        let result = res.data.result;
        this.afterGetCoupon(result);
      }
    })
  },

  handleChangeProduct(e){
    let { index, salePrice} = e.currentTarget.dataset;
    let { couponType, face} = this.data;
    let discountPrice = this.returnDiscountPrice(couponType, face, salePrice);
    let paymentPrice = salePrice - discountPrice;
    if (paymentPrice){
      paymentPrice = paymentPrice.toFixed(2);
    }
    console.log(discountPrice)
    if (discountPrice){
      discountPrice = discountPrice.toFixed(2)
    }
    this.setData({
      activeProduct: index,
      paymentPrice: paymentPrice,
      salePrice: salePrice,
      discountPrice: discountPrice
    })
  },

  ///BuyAction/saveOrder
  handleBuyAction(){
    let activeProduct = this.data.activeProduct;
    let { price, id, productName, description, salePrice } = this.data.productList[activeProduct];
    let num = 1;
    let upData = {
      amountTotal: salePrice * num,
      num: num,
      productId: id,
      productName: productName,
      productSpec: description,
      salePrice: salePrice,
      type: this.data.type
    }
    http.post({
      url: '/BuyAction/saveOrder',
      data: util.qsStringify(upData),
      header:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        let map = res.data;
        
        if (map.code=='3'){
          wx.setStorageSync('useinfo', map.result);
          wx.setStorageSync('token', map.result.token);
          if (this.data.type == '1') {
            let timer = setTimeout(() => {
              this.jumpPage();
              clearTimeout(timer);
            }, 100)
          } else {
            wx.navigateBack();
          }
          return
        }
        
        this.handleWxPay(map);
      }
    })
  },
  handleWxPay(map) {
    wx.requestPayment({
      timeStamp: map.timeStamp,
      nonceStr: map.nonceStr,
      package: 'prepay_id=' + map.prepay_id,
      signType: map.signType,
      paySign: map.paySign,
      success: (res) => {
        if (this.data.type=='1'){
          let timer= setTimeout(()=>{
            this.jumpPage();
            clearTimeout(timer);
          },100)
        }else{
          wx.navigateBack();
        }
        
      },
      fail: (res) => {

      }
    })
  },
  jumpPage(){
    wx.reLaunch({
      url: '../qztRegister/qztRegister',
    })
  },

  handleScanCode(){
    wx.scanCode({
      onlyFromCamera: true,
      success:(res) => {
        let result = res.result;
        this.getCoupon(result);
      }
    })
  },

  getCoupon(url){
    http.get({
      url:url,
      success: (res)=>{
        let result = res.data.result;
        this.afterGetCoupon(result);
      }
    })
  },

  afterGetCoupon(result){
    let { type, face } = result;
    let { salePrice } = this.data;
    let discountPrice = this.returnDiscountPrice(type, face, salePrice);
    let paymentPrice = salePrice - discountPrice;
    if (paymentPrice) {
      paymentPrice = paymentPrice.toFixed(2);
    }
    if (discountPrice) {
      discountPrice = discountPrice.toFixed(2)
    }
    this.setData({
      couponType: type,
      couponState: true,
      face: face,
      discountPrice: discountPrice,
      paymentPrice: paymentPrice
    })
  },

  returnDiscountPrice(type, face, paymentPrice){
    switch (type) {
      case 1:
        return paymentPrice;
      case 2:
        return paymentPrice - face > 0 ? face : paymentPrice;
      case 3:
        return (paymentPrice * (10 - face) / 10);
      default:
        return 0;
    }
  }

})
// pages/drawBill/input/input.js
const http = require('../../../utils/http.js');
const validata = require("../../../utils/validata.js");
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    startTime: util.dateFormat(new Date(), 'yyyy-MM-dd'),
    projectsNum: 0,
    mobile: '',
    orderDto: {},
    customer:{
      reserveTime: ''
    },
    isBusiness: false,
    couponList: [],
    activeCoupon: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { projectsNum, type} = options;
    let orderDto = app.globalData.orderDto;
    this.setData({
      type: type,
      projectsNum: projectsNum,
      orderDto: orderDto,
    })
    if (orderDto.tel) {
      this.getCouponList(orderDto.tel);
    }
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

  handleSubmit(e){
    let formData = e.detail.value;
    let { isBusiness, orderDto, type, activeCoupon } = this.data;

    orderDto = Object.assign(orderDto, formData)
    if (activeCoupon.id){
      orderDto.couponId = activeCoupon.id
    }
    if (type == 'quick'){
      this.createQuickOrder(orderDto);
    }else{
      if (formData.clientName == '') {
        http.showToast('请填写车主姓名');
        return;
      }
      let phoneTip = validata.checkTel(formData.tel);
      if (phoneTip !== '') {
        http.showToast(phoneTip);
        return;
      }
      
      if (isBusiness) {
        console.log('是')
        if (!orderDto.reserveTime){
          http.showToast('请选择预约时间');
          return;
        }
        this.createBusinessOrder(orderDto);
      } else {
        console.log('否')
        this.createOrder(orderDto);
      }
    }
    
  },

  handleChangeReserveTime(e){
    this.setData({
      ['customer.reserveTime']: e.detail.value
    })
  },
  handleSwitchChange(e){
    this.setData({
      isBusiness: e.detail.value,
      ['customer.reserveTime']: ''
    })
  },
  changeTelAction(e){
    console.log(e.detail)
    let tel = e.detail.value;
    let phoneTip = validata.checkTel(tel);
    if (phoneTip == '') {
      this.getCouponList(tel);
    }
  },
  pickerCouponChange(e){
    let { value } = e.detail;
    let { couponList, orderDto } = this.data;
    let activeCoupon = couponList[value];
    //orderDto.amount = orderDto.totleAmount;
    let amount = orderDto.amount;
    switch (activeCoupon.exe_type){
      case 1: //优惠劵
        if (orderDto.totleAmount >= activeCoupon.useThreshold){
          amount = orderDto.totleAmount - activeCoupon.exe_facevalue
        }
        break;
      case 2: //折扣劵
        if (orderDto.totleAmount >= activeCoupon.useThreshold) {
          amount = orderDto.totleAmount * activeCoupon.exe_facevalue/100;
        }
        break;
      case 3: //次数劵
        http.showToast('次数劵暂不能使用！');
        break;
    }
    this.setData({
      activeCoupon: activeCoupon,
      ['orderDto.amount']: amount
    })

  },

  getCouponList(mobile){
    let { orderDto } = this.data;
    wx.showLoading({ title: '加载中' });
    http.get({
      url: '/order/getPhoneCoupon?phone=' + mobile,
      success: (res) => {
        wx.hideLoading();
        let result = res.data.result || [];
        let couponList =[];
        for (let i = 0; i < result.length;i++){
          if (result[i].useThreshold && result[i].useThreshold <= orderDto.totleAmount){
            couponList.push(result[i])
          }
        }
        this.setData({
          couponList: couponList,
        })
      }
    })
  },

  createOrder(data){
    http.post({
      url: '/order/create',
      header: {
        'Content-Type': 'application/json'
      },
      data: data,
      success: (res)=>{
        let result = res.data.result;
        this.jumpCashierPage(result, data.amount);
      }
    })
  },
  createBusinessOrder(data){
    http.post({
      url: '/order/create/business',
      header: {
        'Content-Type': 'application/json'
      },
      data: data,
      success: (res)=>{
        let result = res.data.result;
        http.showToast('商机订单创建成功！')
        wx.switchTab({
          url: '/pages/workspace/workspace'
        })
      }
    })
  },
  createQuickOrder(data){
    http.post({
      url: '/order/create/quick',
      header: {
        'Content-Type': 'application/json'
      },
      data: data,
      success: (res)=>{
        let result = res.data.result;
        this.jumpCashierPage(result, data.amount);
      }
    })
  },
  jumpCashierPage(orderId, amount){
    wx.navigateTo({
      url: '../cashier/cashier?orderId=' + orderId + '&amount=' + amount,
    })
  }
})
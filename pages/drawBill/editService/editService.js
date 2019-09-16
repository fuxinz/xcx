// pages/drawBill/editService/editService.js
const http = require('../../../utils/http.js');
const app  = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    activeIndex: -1,
    projects:[],
    projectsNum: 0,
    projectsPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.orderDto)
    let { type} = options;
    this.getserviceGoodsListTemp(type);
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
  handleEdit(e){
    let { i } = e.currentTarget.dataset;
    this.setData({
      activeIndex: i
    })
    this.calculatedAction();
  },
  handleConserve(e){
    this.setData({
      activeIndex: -1
    })
    this.calculatedAction();
  },
  handleReduce(e){
    let { i, j, quantity } = e.currentTarget.dataset;
    let { projects } = this.data;
    if (quantity<=1){
      return;
    }
    this.setData({
      [`projects[${i}].projectItem[${j}].quantity`]: --quantity
    })
  },
  handleAdd(e){
    let { i, j, quantity } = e.currentTarget.dataset;
    let { projects } = this.data;
    this.setData({
      [`projects[${i}].projectItem[${j}].quantity`]: ++quantity
    })
  },
  handelNumBlur(e){
    console.log(e)
    let { i, j } = e.currentTarget.dataset;
    let value = e.detail.value;
    this.setData({
      [`projects[${i}].projectItem[${j}].quantity`]: value
    })
  },
  handelPriceBlur(e){
    let { i, j } = e.currentTarget.dataset;
    let value = e.detail.value;
    console.log(typeof value, value)
    if (value && value.length>0 && value.split('.').length>2){
      http.showToast('请输入正确的价格')
      return
    }
    this.setData({
      [`projects[${i}].projectItem[${j}].price`]: value
    })
  },
  handleDelete(e){
    let { i, j } = e.currentTarget.dataset;
    let { projects, activeIndex } = this.data;
    if (projects[i].projectItem && projects[i].projectItem.length<=1){
      projects.splice(i,1);
      activeIndex = -1;
    }else{
      projects[i].projectItem.splice(j, 1);
    }
    this.setData({
      projects: projects,
      activeIndex: activeIndex
    })
    this.calculatedAction();
  },
  checkboxChange(e){
    let { i, nochecked } = e.currentTarget.dataset;
    let { projects } = this.data;
    this.setData({
      [`projects[${i}].noChecked`]: !nochecked
    })
    this.calculatedAction();
  },
  calculatedAction(){
    let { projects} = this.data;
    let allPrice = 0;
    let projectsNum = 0;
    projects.forEach((val1, i)=>{
      if (!val1.noChecked){
        projectsNum +=1;
        val1.projectItem.forEach((val2,j)=>{
          if (!val2.price){
            val2.price = 0;
          }
          allPrice += val2.price * val2.quantity;
        })
      }
    })
    this.setData({
      projectsPrice: allPrice,
      projectsNum
    })
  },
  getserviceGoodsListTemp(type){
    let projectIds = wx.getStorageSync('projectIds');
    http.get({
      url: '/order/serviceGoodsListTemp?projectIds=' + projectIds,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          projects: result.project,
          type: type || ''
        })
        this.calculatedAction();
      }
    })
  },
 
  handelNext(){
    let { projects, projectsPrice, projectsNum, type } = this.data;
    if (projectsPrice<=0){
      http.showToast('订单金额不能小于等于0！');
      return;
    }
    let orderDetails =[];
    projects.forEach((val1, i) => {
      if (!val1.noChecked) {
        val1.projectItem.forEach((val2, j) => {
          let { price, projectName, projectId, productName, productId, quantity} = val2;
          orderDetails.push({
            price: price,
            projectId: projectId,
            projectName: projectName,
            productId: productId,
            productName: productName,
            saleNum: quantity,
            total: price*quantity,
            type: val1.type
          })
        })
      }
    })
    app.globalData.orderDto.orderDetails = orderDetails;
    app.globalData.orderDto.totleAmount = projectsPrice;
    app.globalData.orderDto.amount = projectsPrice;
    wx.navigateTo({
      url: '../input/input?type=' + type +'&projectsNum=' + projectsNum,
    })
  },
})
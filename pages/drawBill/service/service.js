// pages/drawBill/service/service.js
const http = require('../../../utils/http.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    serviceList: [],
    selectItems:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { type, id } = options;
    this.getServiceList(type, id);
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

  getServiceList(type,id){
    http.get({
      url: '/order/serviceList',
      success: (res)=>{
        let result = res.data.result;
        this.setData({
          serviceList: result,
          type: type || ''
        })
        if (type) { //type: quick, turn
          app.globalData.orderDto = {};
          if(id){
            app.globalData.orderDto.id = id;
            this.searchOrderById(id, result)
          }
        }
      }
    })
  },

  handelConfirm(){
    let { selectItems, type } = this.data;
    if (selectItems.length<=0) return;
    wx.setStorageSync('projectIds', selectItems.join(','))
    wx.navigateTo({
      url: '../editService/editService?type='+type,
    })
  },

  checkServiceItem(e){
    let { i, j, item } = e.currentTarget.dataset;
    let { serviceList, selectItems } = this.data;
    let {checked, id} = item;
    if (checked){
      selectItems.forEach((val,index)=>{
        if(id==val){
          selectItems.splice(index,1);
          return;
        }
      })
    }else{
      selectItems = [...selectItems, id];
    }

    this.setData({
      [`serviceList[${i}].projectLibs[${j}].checked`]: !checked,
      selectItems: selectItems
    })
  },

  searchOrderById(id, serviceList) {
    http.get({
      url: '/order/searchOrderById?id=' + id,
      success: (res) => {
        let result = res.data.result;
        let projects = result.projects;
        let selectItems = [];
        for (let i = 0; i < serviceList.length;i++){
          for (let j = 0; j < serviceList[i].projectLibs.length;j++){
            for (let k = 0; k < projects.length;k++){
              if (serviceList[i].projectLibs[j].id == projects[k].projectId){
                selectItems.push(projects[k].projectId);
                serviceList[i].projectLibs[j].checked = true;
              }
            }
          }
        }
        let { licenceNo, brandIco, brandId, brandName, customerName, customerId, customerPhone, familyId, familyName, vehicleId, vehicleName, mileage, remark } = result.vehicleInfo;
        app.globalData.orderDto = {
          id,
          licenceNo,
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
        this.setData({
          selectItems: selectItems,
          serviceList: serviceList
        })
        
      }
    })
  },
})
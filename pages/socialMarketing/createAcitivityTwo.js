const http = require('../../utils/http.js');
const dateTimePicker = require('./dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},
    updata: {
      templateId: '',
      status: '1', //营销状态 状态（0.草稿 1.有效 2.活动结束）
      isdistribute: '0', //分享后是否公开领券(0: 是，1：否)
      activityStartTime: '',
      activityEndTime: '',
      exeType: '',
      filepath: ''
    },
    dateTimeArray: null,
    dateTime: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { vCRMActivityId, smId } = options;
    
    if (vCRMActivityId){
      this.getTemplateDetail(vCRMActivityId);
    }else{
      this.getSocialMarketDetail(smId)
    }
    // 获取完整的年月日 时分秒，以及默认显示的数组
    let obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
    });
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

  switchChange: function (e) {
    console.log(e.detail.value)

  },
  switchChangeStatus(e){
    this.setData({
      [`updata.status`]: e.detail.value? '1': '0'
    })
  },
  switchChangeIsdistribute(e){
    this.setData({
      [`updata.isdistribute`]: e.detail.value ? '0' : '1'
    })
  },

  bindDateChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      date: e.detail.value
    })
  },
  getTemplateDetail(id){
    http.get({
      url: '/MarketingAction/template?vCRMActivityId='+id,
      success: (res => {
        let result = res.data.result;
        let { id, startTsp, endTsp, picURL, type } = result;
        result.isdistribute = '0';
        this.setData({
          activity: result,
          updata: {
            templateId: id,
            status: '1',
            isdistribute: '0',
            activityStartTime: startTsp,
            activityEndTime: endTsp,
            exeType: type,
            filepath: picURL
          },
        })
      })
    })
  },
  getSocialMarketDetail(id){
    http.get({
      url: '/MarketingAction/socialMarket?smId='+id,
      success: (res)=>{
        let result = res.data.result;
        let { id, templateId, activityStartTime, activityEndTime, status, isdistribute, filepath, exeType } = result;
        this.setData({
          activity: result,
          updata: {
            id: id,
            templateId: templateId,
            status: status,
            isdistribute: isdistribute,
            activityStartTime: activityStartTime,
            activityEndTime: activityEndTime,
            exeType: exeType,
            filepath: filepath
          },
        })
      }
    })

  },

  handleSubmit(e){
    let formData = e.detail.value;
    let { updata} = this.data;
    let exeType = updata.exeType;
    //activity.type==1 || activity.exeType==1
    if (updata.exeType == 1 && Number(formData.useThreshold) < Number(formData.exeFacevalue)){
      http.showToast('满减金额必须大于优惠金额')
      return
    }
    if (updata.exeType == 2){
      formData.exeFacevalue = formData.exeFacevalue*10;
    }
    console.log(formData, formData.totalNum < formData.upperlimit)
    if (Number(formData.totalNum) < Number(formData.upperlimit)){
      http.showToast('预算张数必须大于领券上限')
      return;
    }
    updata = Object.assign({},updata, formData)
    console.log(updata)

    http.post({
      url: '/MarketingAction/markSave',
      data: updata,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res)=>{
        wx.navigateBack();
      } 
    })

  },

  changeDateTime(e) {
    let { type } = e.currentTarget.dataset;
    let { dateTimeArray, dateTime} = this.data;
    console.log(e.detail.value, type)
    let timeTxt = dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[1][dateTime[1]] + '-' + dateTimeArray[2][dateTime[2]] + ' ' + dateTimeArray[3][dateTime[3]] + ':' + dateTimeArray[4][dateTime[4]] + ':' + dateTimeArray[5][dateTime[5]];

    if (type=='start'){
      this.setData({ 
        ['updata.activityStartTime']: timeTxt
      });
    }else if(type=='end'){
      this.setData({
        ['updata.activityEndTime']: timeTxt
      });
    }
  },
  changeDateTimeColumn(e) {
    let arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.fileUpload(res.tempFilePaths[0]);
      }
    })
  },
  fileUpload(path) {
    wx.showLoading({ title: '加载中' });
    let TOKEN = wx.getStorageSync('token');
    wx.uploadFile({
      url: http.baseUrl + '/FileController/ACTIVITY',
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        "Cookie": 'JSESSIONID=' + TOKEN
      },
      success: (res) => {
        wx.hideLoading();
        let data = JSON.parse(res.data);
        if (data.code == '0') {
          let result = data.result;
          this.setData({
            ['updata.filepath']: result.fullUrl
          })
        }
      }
    })
  },
})
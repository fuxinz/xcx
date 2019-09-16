const http = require('../../../utils/http.js');
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: util.dateFormat(new Date(), 'yyyy-MM-dd'),
    resultList: ['会准时过来', '最近有点忙需另约时间', '已经在别的地方消费了', '还在考虑中'],
    saleNo: '',
    formatmsg: '',
    inputDate: '',
    context: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { saleNo} = options;
    this.setData({
      saleNo
    })
  },
  handleChangeResult(e){
    let {value} = e.detail;
    let { resultList } = this.data;
    this.setData({
      formatmsg: resultList[value]
    })
  },
  handleChangeDate(e){
    let { value } = e.detail;
    this.setData({
      inputDate: value
    })
  },
  handldeChangeContext(e){
    let { value } = e.detail;
    console.log(e)
    this.setData({
      context: value
    });
  },

  handleSubmit(){
    let { saleNo, formatmsg, inputDate, context} = this.data;
    let updata = { saleNo, formatmsg, inputDate, context };
    for (let k in updata){
      if (!updata[k]){
        http.showToast('提交内容不完整，请检查！');
        return;
      }
    }
    http.post({
      url: '/BusinessController/saveCallLog',
      data: util.qsStringify(updata),
      success: (res) => {
        wx.redirectTo({
          url: '../visit/visit?saleNo=' + saleNo,
        })
      }
    })
  }
})
const http = require('../../../utils/http.js');
const util = require('../../../utils/util.js')

const selectList1 = [{ txt: '全部服务提醒', state: '' }, { txt: '本月服务提醒', state: 'BY' }, {txt:'本周服务提醒', state: 'BZ'}];
const selectList2 = [{txt: '已回访车主',state: '1'},{txt: '待回访车主', state: '0'}]
Page({

  data: {
    type: '1', //1.商机状态,2.服务提醒, 3.回访
    sheetTitle: '',
    showCeng: false,
    iconDown: '../../../img/icon-down.png',
    iconUp: '../../../img/icon-up.png',
    selectIcon: '../../../img/icon-selected.png',
    selectIndex: 0,
    selectList: [],
    busiFillList: [],
    updata: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { type, orderOpStatus, reserveTime, callStatus} = options;
    let updata = {};
    let sheetTitle = '';
    let selectIndex = 0;
    switch (type){
      case '1':
        updata = { orderOpStatus: orderOpStatus || ''}
        this.setData({
          type,
          updata
        })
        this.getBusiFillList(updata);
        break;
      case '2':
        updata = { reserveTime: reserveTime || '' }

        selectList1.map((item,index)=>{
          if (reserveTime == item.state){
            sheetTitle = item.txt;
            selectIndex = index;
          }
        })
        this.setData({
          type,
          updata,
          selectList: selectList1,
          sheetTitle: sheetTitle,
          selectIndex: selectIndex
        })
        this.getBusiFillList(updata);
        break;
      case '3':
        updata = { callStatus: callStatus || '1' }
        selectList2.map((item,index) => {
          if (callStatus == item.state) {
            sheetTitle = item.txt;
            selectIndex = index;
          }
        })
        this.setData({
          type,
          updata,
          selectList: selectList2,
          sheetTitle: sheetTitle,
          selectIndex: selectIndex
        })
        this.getBusiFillList(updata);
        break;
      default:
        this.getBusiFillList();
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
  
  confimSearch(e) {
    let value = e.detail.value;
    let {updata} = this.data;
    updata.searchContent = value
    this.getBusiFillList(updata);
  },

  showCengFun: function () {
    this.setData({
      showCeng: !this.data.showCeng
    })

  },

  showCengFun: function () {
    this.setData({
      showCeng: !this.data.showCeng
    })
  }, 
  selectedFun: function (e) {
    let { item, index } = e.currentTarget.dataset;
    let { type, updata } = this.data;
    
    if (type == 2) {
      this.setData({
        sheetTitle: item.txt,
        selectIndex: index,
        showCeng: false,
        ['updata.reserveTime']: item.state
      })
    }else{
      this.setData({
        sheetTitle: item.txt,
        selectIndex: index,
        showCeng: false,
        ['updata.callStatus']: item.state
      })
    }
    this.getBusiFillList(updata);
  },

  getBusiFillList(updata){
    updata = updata || {}
    updata = util.qsStringify(updata);
    http.get({
      url: '/BusinessController/busiFillList?' + updata,
      success: (res) => {
        let result = res.data.result;
        this.setData({
          busiFillList: result|| []
        })
      }
    })
  },
  handleBusiClosed(e){
    let { saleNo, index } = e.currentTarget.dataset;
    http.post({
      url: '/BusinessController/busiClosed?saleNo=' + saleNo,
      success: (res)=>{
        let data = res.data;
        if (data.code=='0'){
          this.setData({
            [`busiFillList[${index}].orderOpStatus`]: '4'
          });
        }
      }
    })
  },
  seeDetailPage(e){
    let { url } = e.currentTarget.dataset;
    this.jumpPage(url)
  },

  jumpPage(url){
    wx.navigateTo({
      url: url,
    })
  },

  showActionSheet(e){
    let { item } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['拨打电话回访', '编辑回访记录', '查看回访记录'],
      success:(res) => {
        console.log(res.tapIndex)
        switch (res.tapIndex){
          case 0: 
            wx.makePhoneCall({
              phoneNumber: item.tel
            })
            break;
          case 1:
            this.jumpPage('../editVisit/editVisit?saleNo=' + item.saleNo);
            break;
          case 2:
            this.jumpPage('../visit/visit?saleNo=' + item.saleNo);
            break;
          default:
            break;
        }
      }
    })
  },

  handleTurn(e){
    let { id } = e.currentTarget.dataset;
    wx.redirectTo({
      url: '/pages/drawBill/service/service?type=turn&id=' + id,
    })
  }
})
const http = {
  baseUrl: 'http://113.204.6.165:16588',
  otherUrl: 'http://113.204.6.165:16501/chejiemeng-small-program',
  // baseUrl: 'https://waiter.cartechfin.com/cartechfin-waiter-api',
  // otherUrl: 'https://waiter.cartechfin.com/chejiemeng-small-program',
  urlFilter: function(url) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url
    } else {
      return this.baseUrl + url;
    }
  },
  showToast: function(title, icon) {
    wx.showToast({
      title: title,
      icon: icon || "none",
      duration: 2000
    })
  },
  request: function(obj) {
    let headerData = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    let token = wx.getStorageSync('token');
    if (token) {
      headerData.Cookie = 'JSESSIONID=' + token;
      headerData.token = token
    }
    headerData = Object.assign({}, headerData, obj.header);
    let that = this;
    console.log('================>', obj.url)
    wx.request({
      url: this.urlFilter(obj.url),
      data: obj.data,
      method: obj.method || 'GET',
      header: headerData,
      success: function(res) {
        console.log(res)
        wx.hideLoading();
        if (res.statusCode == 200) {
          let data = res.data;
          if (data.code == '0') {
            obj.success && obj.success(res);
          } else if (data.code == '2') {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } else if (data.code == '3') {
            obj.success && obj.success(res);
          } else {
            that.showToast(data.message || '未知错误，请联系客服！');
          }
        } else {
          that.showToast('服务器繁忙,请稍后再试！');
        }
      },
      fail: function(e) {
        wx.hideLoading();
        console.log('网络请求失败!')
        that.showToast('网络请求失败!');
      },
      complete: function() {

        obj.complete && obj.complete();
      }
    })
  },
  get: function(obj) {
    obj.method = 'GET';
    return this.request(obj);
  },
  post: function(obj) {
    obj.method = 'POST';
    return this.request(obj);
  },
  put: function(obj) {
    obj.method = 'PUT';
    return this.request(obj);
  },
  delete: function(obj) {
    obj.method = 'DELETE';
    return this.request(obj);
  }
}

module.exports = http;
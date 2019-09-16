/**
 * a=1&b=2转json
 */
const qsParse = (qs) => {
  let args = {};
  let items = qs.split('&');
  for (let i = 0, len = items.length; i < len; i++) {
    let item = items[i].split("=");
    let name = decodeURIComponent(item[0]);
    let value = decodeURIComponent(item[1]);
    if (name.length) {
      args[name] = value;
    }
  }
  return args;
}

/**
 * 简单的json转a=1&b=2
 */
const qsStringify = (json) => {
  let str = '';
  for (let k in json) {
    str += `${k}=${json[k] || ''}&`;
  }
  return str.slice(0, str.length - 1);
}

//把时间格式成自己想要的格式   yyyy/MM/dd hh:mm:ss.S
const dateFormat = (value, fmt) => {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
  let date = isNaN(Number(value)) ? new Date(value) : new Date(Number(value));
  if (date.toString() == 'Invalid Date') {
    return value;
  }
  let o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
const formatMoney = data => {
  if (data != null) {
    return data.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  } else {
    return;
  }
}

module.exports = {
  qsParse: qsParse,
  qsStringify: qsStringify,
  dateFormat: dateFormat,
  formatMoney: formatMoney
}
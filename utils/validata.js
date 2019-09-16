//电话号码验证
const checkTel = (value) => {
  let mobile = /^1[3|5|7|8|9]\d{9}$/,
    phone = /^0\d{2,3}-?\d{7,8}$/;
  //let status = mobile.test(value) || phone.test(value);
  let status = mobile.test(value); //本次电话号码只能输入手机号
  if (!value) {
    return '请输入手机号码!';
  } else if (!status) {
    return '请输入正确的手机号!';
  } else {
    return '';
  }
}
//密码验证6-12位
const checkPassWord = (value) => {
  let passWord = /^[0-9A-Za-z]{6,12}$/;
  let status = passWord.test(value);
  if (!value) {
    return '请输入密码!';
  } else if (!status) {
    return '密码输错啦，请输入6-12位的数字或字母！';
  } else {
    return '';
  }
}

const checkCode = (value) => {
  let code = /^[0-9]{6}$/;
  let status = code.test(value);
  if (!value) {
    return '请输入验证码！';
  } else if (!status) {
    return '验证码错误，请输入6位数字的验证码！';
  } else {
    return '';
  }
}

const checkPeopelId = (value) => {
  let code = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  let status = code.test(value);
  if (!value) {
    return '请输入验证码！';
  } else if (!status) {
    return '请输入正确的身份证！';
  } else {
    return '';
  }
}
const checkLicenceNo = (value) => {
  let code = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
  let status = code.test(value);
  if (!value) {
    return '请输入车牌号！';
  } else if (!status) {
    return '请输入正确的车牌号！';
  } else {
    return '';
  }
}

module.exports = {
  checkPassWord: checkPassWord,
  checkTel: checkTel,
  checkCode: checkCode,
  checkPeopelId: checkPeopelId,
  checkLicenceNo: checkLicenceNo
}
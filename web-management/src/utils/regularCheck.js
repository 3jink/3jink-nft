// 自定义校验方法，整数或小数
export function checkNull(rule, value, callback) {
  if (value) {
    if (!(/^(\d|[1-9]\d+)(\.\d+)?$/g.test(value))) {
      callback(new Error('只能输入整数或小数!'));
    }
  }
  callback();
}
export function socialCreditCode(rule, value, callback) {
  //统一社会信用代码检查
  if (value) {
    if (!(/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/g.test(value))) {
      callback(new Error('社会信用代码格式错误!'));
    }
  }
  callback();
}

// 自定义校验方法，整数或小数
export function isNumber(rule, value, callback) {
  if (value) {
    if (!(/^[0-9]*$/g.test(value))) {
      callback(new Error('只能输入整数!'));
    }
  }
  callback();
}
//自定义校验身份证
export function checkIdCard(rule, value, callback) {
  if (value) {
    if (!(/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/g.test(value))) {
      callback(new Error('请输入正确的身份证号!'));
    }
  }
  callback();
}
//自定义校验电话号码
export function checkPhone(rule, value, callback) {
  if (value) {
    if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/g.test(value))) {
      callback(new Error('请输入11位手机号码!'));
    }
  }
  callback();
}
//自定义校验电话号码和座机
export function checkPhoneOrTel(rule, value, callback) {
  if (value) {
    if (!(/^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/g.test(value))) {
      callback(new Error('请正确的手机号或座机号!'));
    }
  }
  callback();
}
//自定义校验银行卡号
export function checkBankCode(rule, value, callback) {
  if (value) {
    if (!(/^[1-9]\d{9,29}$/g.test(value))) {
      callback(new Error('请输入正确的银行账户账号!'));
    }
  }
  callback();
}
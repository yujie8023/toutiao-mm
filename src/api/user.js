// 用户相关请求模块
// @代表当前文件的根路径
import request from '@/utils/request.js'
import store from '@/store'

export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    // data: data es6中属性名和属性值相同可以简写
    data
  })
}


// 发送验证码,每手机号每分钟1次
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`,
    // 没有请求体 不需要 data
  })
}
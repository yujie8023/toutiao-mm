// 用户相关请求模块
// @代表当前src文件的根路径
import request from '@/utils/request.js'
// import store from '@/store'

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


// 获取用户自己信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: `/app/v1_0/user`
    // 对请求头进行配置
    // headers: {
    //   // 注意:该接口需要授权才能访问
    //   // token的数据格式 Bearer token数据 Bearer 后有个空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
// 获取频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}



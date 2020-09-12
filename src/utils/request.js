// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'


// JSON.parse
// JSON.stringify
// JSONBig 可以处理超出js安全证书范围的大数据
// JSONBig .parse() //吧json格式的字符串转为js对象
// 使用的时候需要把BigNumber 类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString());
// JSONBig .stringify() //吧js对象转为json格式的字符串
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', //接口的基准路径


  // 自定义后端返回的数据

  // transformResponse 允许自定义原始的响应数据（字符串）
  // data:后端返回的原始数据,说白了就是JSON格式的字符串
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return JSONBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return data
    }
    // axios默认在内部这样来处理后端返回的数据
    // return JSON.parse(data)

  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config 本次请求的请求配置对象
  const {
    user
  } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log(config)
  // 注意:这里务必要返回config配置对象,否则请求就停在这里出不去了
  return config
}, function (error) {
  // 如果请求出错了(还没有发出去)会进入这里
  return Promise.reject(error)
});
// 响应拦截器

export default request
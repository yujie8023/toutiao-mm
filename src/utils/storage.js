// 封装本地存储模块

// 存储数据  定义setItem方法  key,value两个参数
export const setItem = (key, value) => {
  // 对于数组或者对象这样的数据,转成JSON格式的字符串再来存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取数据
// 要让外部能访问到,需要暴露出去
// 在定义的同时直接导出
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }

}


// 删除数据
export const removeItem = key => {

  window.localStorage.removeItem(key)

}
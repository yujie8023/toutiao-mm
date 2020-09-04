import Vue from 'vue'
import Vuex from 'vuex'
import {
  getItem,
  setItem
} from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象,存储当前登录用户信息(token等)
    // json 对象
    // 获取数据的代码
    user: getItem(TOKEN_KEY)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    // user: null
  },
  mutations: { //永远通过mutations,修改state数据
    setUser(state, data) {
      state.user = data
      // 为了防止刷新丢失,我们需要把数据备份到本地存储,json格式的字符串
      setItem(TOKEN_KEY, state.user)
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
    }

  },
  actions: {},
  modules: {}
})

//通过容器,存储token相关的数据,在state中声明一个user容器来存储他,容器只是为了访问方便,还有一个好处就是数据是响应式的,容器中的数据一旦发生改变,绑定这些数据的视图,也会随之更新,但是容器中的数据不是持久化的,为了持久化要结合本地存储
<template>
  <div class="search-suggestion">
    <van-cell icon="search"
              v-for="(text, index) in suggestions"
              :key="index"
              @click="$emit('search', text)">
      <div slot="title"
           v-html="highlight(text)"></div>
      <!-- {{}}双大括号绑定会直接输出纯文本内容 -->
      <!-- <div>{{ htmlStr }}</div> -->
      <!-- 使用v-html指令可以绑定渲染带有HTML标签的字符串 -->
      <!-- <div v-html="htmlStr"></div> -->
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
// 按需加载有好处,只会把使用到的成员打包到结果中
// 按需加载，减小打包体积
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      suggestions: [], //联想数据建议列表
      // htmlStr: 'Hello<span style="color:red">Word</span>',
    }
  },
  computed: {},
  // 监视谁就写谁
  watch: {
    searchText: {
      // 当searchText发生变化的时候就会调用handler函数
      // 注意handler函数函数名称是固定的
      // handler(value) {
      //   console.log(value)
      // },
      // debounce函数
      // 参数1:一个函数
      // 参数2:延迟时间,单位是毫秒
      // 返回值:防抖之后的函数
      handler: debounce(function (value) {
        // console.log(value)
        this.loadSearchSuggestions(value)
      }, 200),
      // handler(value) {
      //   // console.log(value);
      //   this.loadSearchSuggestions(value)
      // },
      // 该回调将会在侦听开始之后被立即调用
      immediate: true,
    },
  },
  created () { },
  mounted () { },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestion(q)
        // console.log(data);
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败,请稍后重试')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 //中间的内容都会当做匹配字符来使用,而不是数据变量
      // 如果需要根据数据变量动态的创建政策表达是,则手动new RegExp
      // RegExp 正则表达式构造函数
      // 参数1: 匹配模式,他会根据这个字符串创建正则对象
      // 参数2:匹配模式,要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    },
  },
}
</script>
<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
    // color: red;/
  }
}
</style>

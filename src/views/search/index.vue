<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <!-- tips:在van-search外层增加from标签,且action不为空,即可 -->
    <form class="search-form"
          action="/">
      <van-search v-model="searchText"
                  show-action
                  placeholder="请输入搜索关键词"
                  background="#3296fa"
                  @search="onSearch"
                  @cancel="onCancel"
                  @focus="isResultShow=false" />
    </form>
    <!-- /顶部搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow"
                   :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText"
                       :search-text="searchText"
                       @search="onSearch" />
    <!--/ 联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-else
                    :search-histories="searchHistories"
                    @clear-search-histories="searchHistories=[]"
                    @search="onSearch" />
    <!-- /搜索历史记录 -->

  </div>
</template>>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
// 操作本地存储
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  props: {

  },
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []// 搜索的历史记录数据
    }
  },
  computed: {},
  watch: {
    // 被监视时,直接调用
    searchHistories (value) {
      // console.log('haha');
      // value  是监视到最新的数据
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
    // searchHistories:{
    //   handler(){}
    // }
  },
  created () {

  },
  mounted () { },
  methods: {
    onSearch (val) {
      // 更新文本框内容
      // console.log(val)
      this.searchText = val
      // 存储搜索历史记录
      // 要求:不要有重复历史纪录,最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 找到
        this.searchHistories.splice(index, 1)
      }

      // unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()

    },
  }
}
</script>
<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
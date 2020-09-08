<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <!-- tips:在van-search外层增加from标签,且action不为空,即可 -->
    <form action="/">
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
    <search-result v-if="isResultShow" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText"
                       :search-text="searchText" />
    <!--/ 联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-else />
    <!-- /搜索历史记录 -->

  </div>
</template>>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'

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
      isResultShow: false//控制搜索结果的展示
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () { },
  methods: {
    onSearch (val) {
      console.log(val)
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
  .van-search__action {
    color: #fff;
  }
}
</style>
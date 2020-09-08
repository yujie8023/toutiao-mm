<template>
  <div class="search-result">
    <van-list v-model="loading"
              :finished="finished"
              finished-text="Finished"
              @load="onLoad">
      <van-cell v-for="item in list"
                :key="item"
                :title="item" />
    </van-list>

  </div>
</template>>

<script>
export default {
  name: 'SearchResult',
  components: {},
  props: {},
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () { },
  methods: {
    onLoad () {
      // 异步更新数据

      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
  },
}

</script>
<style lang="less" scoped>
</style>
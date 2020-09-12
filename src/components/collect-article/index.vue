<template>
  <!--   :color="value ? '#ffa500' : '#777'" -->
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{ collected: value }"
    :loading="loading"
    @click="onCollect"
  />
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏,取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏 ,添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图,传给父组件 让父组件更新  
        // 自定义事件修改参数不是立即的,  取反!
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败,请重试!')
      }
      this.loading = false
    },
  },
}
</script>
<style lang="less" scoped>
.collected {
  color: #ffa500;
}
</style>

<template>
  <!-- :color="value === 1 ? '#e5645f' : '#777'" -->
  <van-button :icon="value === 1 ? 'good-job' : 'good-job-o'"
              :class="{ liked: value === 1 }"
              :loading="loading"
              @click="onLike" />
</template>
<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data () {
    return {
      loading: false,
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onLike () {
      this.loading = true
      try {
        let status = -1
        if (this.value === -1) {
          // 没有点赞,添加点赞

          await addLike(this.articleId)
          status = 1
        } else {
          // 以点赞,取消点赞

          await deleteLike(this.articleId)
        }
        console.log(this.value);

        // 更新视图  单独定义一个变量
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '取消点赞' : '点赞成功')
      } catch (err) {
        this.$toast.fail('操作失败,请重试!')
      }
      this.loading = false
    },
  },
}
</script>
<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>

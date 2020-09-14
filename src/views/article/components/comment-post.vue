<template>
  <div class="comment-post">
    <van-field class="post-field"
               v-model.trim="message"
               rows="2"
               autosize
               type="textarea"
               maxlength="50"
               placeholder="请输入留言"
               show-word-limit />

    <van-button class="post-btn"
                @click="onPost"
                :disabled="!message.length"
                :loading="isPostLoading">发布</van-button>
  </div>
</template>
<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  inject: {
    articleId: {
      type: [String, Number, Object],
      dafault: null
    }
  },

  props: {
    target: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data () {
    return {
      message: '',
      isPostLoading: false,
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, //禁用背景点击
        duration: 0, //持续时间,默认为2000,0表示持续展示不关闭
      })

      try {
        const { data } = await addComment({
          target: this.target.toString(), //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, //评论内容
          art_id: this.articleId ? this.articleId.toString() : this.articleId //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // console.log(data)
        // 关闭弹出层
        // 将发布内容显示到列表顶部
        this.message = '' // 清空文本框  在子组件内部 直接清空
        this.$emit('post-success', data.data) // 发布成功之后.发布一个自定义事件post-success,把子组件传递给父组件
        this.$toast.success('发布成功')
      } catch (err) {
        this.$toast.fail('发布失败')
      }
      this.isPostLoading = false
    },
  },
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  padding: 15px;
  align-items: flex-end;
  .post-field {
    // background: #f5f7f9;
    color: #f5f7f9;
    margin-right: 15px;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>

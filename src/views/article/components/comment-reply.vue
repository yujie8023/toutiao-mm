comment<template>
  <div class="comment-reply">
    <van-nav-bar :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      ">
      <van-icon slot="left"
                name="cross"
                @click="$emit('close')"></van-icon>
    </van-nav-bar>
    <div class="scoll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment"></comment-item>
      <!-- 评论的回复列表 -->
      <van-cell title="全部回复"></van-cell>
      <comment-list :list="commentList"
                    :source="comment.com_id"
                    type="c"></comment-list>
    </div>
    <!-- 底部区域 -->
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button size="small"
                  class="post-btn"
                  round
                  @click="isPostShow = true">写评论</van-button>
    </div>

    <van-popup v-model="isPostShow"
               position="bottom">
      <comment-post :target="comment.com_id"
                    @post-success="onPostSuccess">
      </comment-post>
    </van-popup>
  </div>
</template>
<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'


export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: []//评论的回复列表
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onPostSuccess (data) {
      // console.log(data)
      // 更新恢复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  },
}
</script>
<style lang="less" scoped>
.scoll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  .post-btn {
    width: 60%;
    border-top: 1px solid #d8d8d8;
  }
}
</style>

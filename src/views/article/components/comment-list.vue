<template>
  <!-- 只有list 在可视范围内才会检查滚动位置触发 onLoad-->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error.sync="error"
    error-text="加载失败,请点击重试"
    :immediate-check="false"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],

      // function() {return{}}, // 不是必须的,需要传过去,不需要自己用  数组对象需要用函数来给默认值
    },
    type: {
      type: String,
      // 自定义Prop数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a', //默认值
    },
  },
  data() {
    return {
      // list: [], //原来在子组件内部
      loading: false,
      finished: false,
      offset: null, //获取下一页的标记
      limit: 10,
      error: false,
    }
  },
  computed: {},
  watch: {},
  created() {
    // 当你手动初始 onLoad 的话, 不会自动开始初始的loading
    // 所以需要手动 开启 loading
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 区别是 接口参数不一样
        // type  a-对文章(article)的评论，c-对评论(comment)的回复
        // source  文章id或评论id
        //  1.请求获取数据
        const { data } = await getComments({
          type: this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), //源id，文章id或评论id
          offset: this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        //  2.将数据添加到列表中
        const { results, total_count: totalCount } = data.data
        this.list.push(...results)

        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)
        // console.log(data)
        // 3.将loading设为false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          //有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          //    没有就将finished设置结束

          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
  },
}
</script>
<style lang="less" scoped></style>

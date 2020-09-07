<template>
  <div class="article-list">
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
    -->
    <van-pull-refresh v-model="isRefreshLoading"
                      @refresh="onRefresh"
                      :success-text="refreshSuccessText"
                      success-duration="1500">
      <!-- 使用success-text设置成功提示后刷新成功 -->
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :error.sync="error"
                error-text="请求失败，点击重新加载"
                @load="onLoad">

        <article-item v-for="(article,index) in list"
                      :key="index"
                      :article="article"></article-item>
        <!-- <van-cell v-for="(article,index) in list"
                  :key="index"
                  :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from '@/components/article-item'
export default {
  name: "ArticleList",
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false, // 控制失败的提示状态
      isRefreshLoading: false, // 下拉刷新当前状态
      refreshSuccessText: "刷新成功", // 刷新后的文本
      timestamp: null // 获取下一页数据的时间戳
    };
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        const { data } = await getArticles({
          // 1，请求数据
          channel_id: this.channel.id, // 频道id

          // 你可以把 timestamp 理解为页码
          // 如果请求第1页数据：当前最新时间戳 Date.now
          // 如果请求之后的数据，使用本次接口返回的数据中的 pre_timestamp
          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        });

        // 模拟随机抛出一个错误
        // if(Math.random() > 0.6) {
        //   JSON.parse('asdlfajl')
        // }

        // console.log("请求成功", data);

        // 2，把请求结果放到 list 数组中
        const { results } = data.data;
        // 数组的展开操作符，它会把数组元素一个一个拿出来
        this.list.push(...results)

        // 3，本次数据加载结束之后要把加载状态设置为结束
        this.loading = false

        // 4，判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将 finished 设置为 true，不再 load 加载更多了
          this.finished = true
        }
      } catch (err) {
        // console.log("请求出错了", err);
        // 如果出现错误
        this.error = true

        // 既然失败了，就关闭加载状态，这样错误提示才会显示
        this.loading = false
      }

      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     // 2，把请求结果放到 list 数组中
      //     this.list.push(this.list.length + 1);
      //   }

      //   // 3，本次数据加载结束之后要把加载状态设置为结束
      //   // 只有 loading 关闭以后才能触发下一次加载
      //   this.loading = false;

      //   // 4，判断数据是否全部加载完成
      //   if (this.list.length >= 40) {
      //     // finished 为 true 之后，不再触发加载更多
      //     this.finished = true;
      //   }
      // }, 1000);
    },

    // 触发下拉刷新
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now(), // 下拉刷线，每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('dsnajndjsa')
        // }

        // 2. 将数据追加到列表的顶部
        const { result } = data.data
        this.list.unshift(...esults)
        // unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
        // 3. 关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
};
</script>

<style scoped lang="less">
.article-list {
  // // 百分比单位是相对父元素的
  // height: 100%;
  height: 79vh;
  overflow: auto;
}
</style>

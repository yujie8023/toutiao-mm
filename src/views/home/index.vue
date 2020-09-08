<template>
  <div class="home-container">
    <div class="login-container">
      <!-- 导航栏 -->
      <van-nav-bar class="page-nav-bar"
                   fixed>
        <van-button class="search-btn"
                    slot="title"
                    type="info"
                    size="small"
                    icon="search"
                    round>搜索</van-button>
      </van-nav-bar>
      <!-- 导航栏 -->

      <!-- 频道列表 -->
      <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
      <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
      <!-- 通过 swipeable 属性可以开启滑动切换标签页。 滑动区域受内容区域影响 -->
      <van-tabs class="channel-tabs"
                v-model="active"
                animated
                swipeable>
        <van-tab :title="channel.name"
                 v-for="channel in channels"
                 :key="channel.id">
          <!-- 文章列表 -->
          <article-list :channel="channel"> </article-list>
          <!-- 文章列表/ -->
        </van-tab>

        <div slot="nav-right"
             class="placeholder"></div>
        <div slot="nav-right"
             class="hamburger-btn"
             @click="isChannelEditShow = true">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
      </van-tabs>
      <!-- 频道列表 -->

      <!-- 频道编辑弹出层 -->
      <van-popup v-model="isChannelEditShow"
                 closeable
                 close-icon-position="top-left"
                 position="bottom"
                 :style="{ height: '100%' }">
        <channel-edit :my-channels="channels"
                      :active="active"
                      @update-active="onUpdateActive"></channel-edit>
      </van-popup>
      <!-- 频道编辑弹出层 -->
    </div>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/chennel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit,
  },
  props: {

  },
  data () {
    return {
      active: 0,
      channels: [], //频道列表
      isChannelEditShow: false, //控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () { },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []
        if (this.user) {
          // 已登录,请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录,判断是否有本地频道的列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')

          //    有,拿来使用
          if (localChannels) {
            channels = localChannels
          } else {
            //    没有,请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive (index, isChannelEditShow = true) {
      // console.log('home', index);
      // 更新激活的频道项
      this.active = index
      // 关闭编辑频道弹层
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;

    .van-icon {
      font-size: 32px;
    }
  }
  //   /deep/ 深度作用操作符
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      padding-right: 66px;
    }
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 8px;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
      // flex-shrink 属性指定了 flex 元素的收缩规则。 0 不参与计算
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;

      i.toutiao {
        font-size: 33px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url("~@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>

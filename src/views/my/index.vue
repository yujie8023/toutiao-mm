<template>
  <div class="my-containe">
    <!-- 已登录头部 -->
    <div v-if="user"
         class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar"
                     :src="userInfo.photo"
                     round
                     fit="cover" />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini"
                      round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <div class="count">{{userInfo.art_count}}</div>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <div class="count">{{userInfo.follow_count}}</div>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <div class="count">{{userInfo.fans_count}}</div>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <div class="count">{{userInfo.like_count}}</div>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 已登录头部/ -->

    <!-- 未登录头部 -->
    <div v-else
         class="header not-login"
         @click="$router.push('/login')">
      <div class="login-btn">
        <img class="mobile-img"
             src="~@/assets/mobile.png"
             alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 未登录头部/ -->

    <!-- 导航 -->
    <van-grid class="grid-nav mb-9"
              :column-num="2"
              clickable>
      <van-grid-item class="grid-item">
        <i slot="icon"
           class="toutiao toutiao-shoucang"></i>
        <!-- slot="text"具名插槽 默认插槽会覆盖所有内容   -->
        <span slot="text"
              class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon"
           class="toutiao toutiao-lishi"></i>
        <span slot="text"
              class="text">历史</span>
      </van-grid-item>

    </van-grid>
    <!-- 导航 /-->
    <van-cell title="消息通知"
              is-link />
    <van-cell class="mb-9"
              title="小智同学"
              is-link />
    <van-cell v-if="user"
              class="logout-cell"
              clickable
              title="退出登录"
              @click="onLogout" />

  </div>
</template>>

<script>

import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'MyIndex',
  component: {},
  props: {},
  data () {
    return {
      userInfo: {}//用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {//调用加载
    // 如果用户登录了,则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo()

    }

  },
  mounted () { },
  methods: {
    onLogout () {
      // 退出提示
      // 在组件中需要使用this.$dislog来调用弹框组件
      this.$dialog.confirm({
        title: '确认退出吗?',
      })
        .then(() => {
          // on confirm
          // 确认退出,清除登录状态(容器中的user+本地存储中的user)
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('取消执行这里')
        });
    },
    // 获取自己的信息
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败,请稍后重试')
      }
    }
  }
}
</script>
<style lang="less">
.my-containe {
  .header {
    height: 361px;
    // @指向src路径  ~@
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column; // 设置 <div> 元素内弹性盒元素的方向为相反的顺序： column	灵活的项目将垂直显示
      justify-content: center;
      align-items: center;

      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;

        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 3px solid #fff;
        }

        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      // height: 130px;
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;

        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;

        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d !important ;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .mb-9 {
    margin-bottom: 9px;
  }
  .logout-cell {
    text-align: center;
    color: red;
  }
}
</style>"
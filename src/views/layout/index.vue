<<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view></router-view>
      <!-- 子路由出口 -->

<!-- 标签导航栏 -->
<!-- route开启路由模式 -->
<!-- 开启路由跳转路径,active就不管用了   v-model="active"-->
<van-tabbar class="layout-tabber"   route>
  <van-tabbar-item  to="/">
    <i slot='icon' class="toutiao toutiao-shouye"></i>
    <span class="text">首页</span> </van-tabbar-item>
  <van-tabbar-item to="/qa" >
    <i slot='icon' class="toutiao toutiao-wenda"></i>
    <span class="text">问答</span>
    </van-tabbar-item>
  <van-tabbar-item  to="/video">
    <i slot='icon' class="toutiao toutiao-shipin"></i>
    <span class="text">视频</span>  
    </van-tabbar-item>
  <van-tabbar-item  to="/my">
    <i slot='icon' class="toutiao toutiao-wode"></i> 
    <span class="text">{{$store.state.user ? '我的':'未登录'}}</span>

    </van-tabbar-item>
</van-tabbar>
<!-- 标签导航栏 /-->

    
  </div>
</template>>

<script>
export default {
  name: 'LayoutIndex',
  component: {},
  props: {},
  data () {
    return {
      // active: 0,
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () { },
  methods: {}
}
</script>
<style lang="less">
.layout-container {
  .layout-tabber {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>

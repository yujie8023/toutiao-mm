<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 title="登录">
      <van-icon slot="left"
                name="cross"
                @click="$router.back()">
      </van-icon>
    </van-nav-bar>
    <!--/ 导航栏 -->

    <!-- 登录表单 -->
    <!-- 表单验证:
    1.给van-field组件配置rules验证规则
    参考文档  https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
    2.当表单提交的时候会自动触发表单验证,如验证通过,会自动通过submit事件,如失败不会触发
     -->
    <van-form ref="loginForm"
              @submit="onSubmit">
      <van-field v-model="user.mobile"
                 name="mobile"
                 placeholder="请输入手机号"
                 :rules="userFormRules.mobile"
                 type="number"
                 maxlength="11">
        <i slot="left-icon"
           class="toutiao i-shouji"></i>
      </van-field>
      <van-field v-model="user.code"
                 name="code"
                 placeholder="请输入验证码"
                 :rules="userFormRules.code"
                 type="number"
                 maxlength="6">
        <i slot="left-icon"
           class="toutiao i-yanzhengma"></i>
        <template #button>
          <!-- time 倒计时时间  ss 秒 s 字符格式-->
          <van-count-down v-if="isCountDownShow"
                          :time="1000 * 60"
                          format="ss s"
                          @finish="isCountDownShow = false" />
          <van-button v-else
                      class="send-msg"
                      round
                      size="small"
                      type="default"
                      @click="onSendSms"
                      native-type="button">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn"
                    block
                    type="info"
                    native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<!--/ 登录表单 -->

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|6|7|8]\d{9}$/, message: '手机号格式错误' },
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' },
        ],
      },
      isCountDownShow: false, //是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onSubmit (values) {
      // 1获取表单数据
      const user = this.user
      // 2.表单验证
      // 在组件中必须通过this.$toast 来调用Toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, //禁用背景点击
        duration: 0, //持续时间,默认2000,如果为0则持续展示
      })
      // 3.提交表单请求登录

      // 进行验证，相关文档 https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
      // 发起请求，万能账密：13911111111 246810
      try {
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')

        // 登陆成功,跳转回原来页面
        // back方式不严谨 功能优化
        this.$router.back()
        // 返回原来的页面
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          // console.log('登录失败,请稍后重试', err)
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
      // 4.根据请求响应结果处理后续操作
    },
    // <!-- validate	验证表单，支持传入name来验证单个表单项 -->
    // * try {
    // *可能出现异常的代码
    // *} catch（异常类名A e）{
    // *如果出现了异常类A类型的异常，那么执行该代码
    // *} ...（catch可以有多个）
    // * finally {
    // *最终肯定必须要执行的代码（例如释放资源的代码）
    // *}
    // *代码执行的顺序：
    // * 1.try内的代码从出现异常的那一行开始，中断执行
    // * 2.执行对应的catch块内的代码
    // * 3.继续执行try catch结构之后的代码
    async onSendSms () {
      console.log('onSendSma')
      // 1.校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2.验证通过,限时倒计时
      this.isCountDownShow = true
      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        console.log('发送成功')
      } catch (err) {
        // 发送失败,关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了,请稍后重试!')
        } else {
          this.$toast('发送失败,请稍后重试!')

        }
      }
    },
  },
}
</script>

<style lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 162px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    background-color: #ededed;
    color: #666666;
  }
  .login-btn-warp {
    padding: 53px 33px;
  }
  .login-btn {
    background-color: #6db4fb;
    border: none;
  }
}
</style>

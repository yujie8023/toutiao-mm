<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 left-arrow
                 title="黑马头条"
                 @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading"
           class="loading-wrap">
        <van-loading color="#3296fa"
                     vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title"
           class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info"
                  center
                  :border="false">
          <van-image class="avatar"
                     slot="icon"
                     round
                     fit="cover"
                     :src="article.aut_photo" />
          <div slot="title"
               class="user-name">{{ article.aut_name }}</div>
          <!-- 管道符|  过滤器名字 -->
          <div slot="label"
               class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- 模板中的$event是事件参数 是子组件中this.isFollowed传的数据-->
          <!-- 当我们传递给子组件的数据既要使用还要修改 
               传递:props 
                :is-followed="article.is_followed"
               修改:自定义事件
            @update-is_followed="article.is_followed = $event"

               简写方式:在组件上使用  v-model   ==
               会传递一个 名为value的props  
               value="article.is_followed"
               自动监听一个input事件      
               @input="article.is_followed=$event"
               -->
          <!-- 如果要修改v-model的规则名称,可以通过子组件的model属性来配置修改 -->
          <!-- 一个组件只能使用一次v-model -->
          <!-- 如果有多个数据需要实现类似于v-model的效果   可以使用属性的 .sync修饰符-->
          <follow-user class="follow-btn"
                       v-model="article.is_followed"
                       :user-id="article.aut_id"></follow-user>
        </van-cell>

        <!-- <follow-user
            class="follow-btn"
            :is-followed="article.is_followed"
            :user-id="article.aut_id"
            @update-is_followed="article.is_followed = $event"
          ></follow-user> -->
        <!-- <van-button v-if="article.is_followed"
                      class="follow-btn"
                      round
                      size="small"
                      :loading="followLoading"
                      @click="onFollow">已关注</van-button>
          <van-button v-else
                      class="follow-btn"
                      type="info"
                      color="#3296fa"
                      round
                      size="small"
                      icon="plus"
                      :loading="followLoading"
                      @click="onFollow">关注</van-button> -->
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body"
             v-html="article.content"
             ref="article-content"></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表 -->
        <!-- $event事件参数 -->
        <comment-list :source="article.art_id"
                      :list="commentList"
                      @onload-success="totalCommentCount = $event.total_count"
                      @reply-click="onReplyClick"></comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn"
                      type="default"
                      round
                      size="small"
                      @click="isPostShow = true">写评论</van-button>
          <van-icon class="comment-icon"
                    name="comment-o"
                    :info="totalCommentCount"
                    color="#777" />
          <!-- 父组件控制样式class="btn-item" -->
          <!-- 收藏文章 -->
          <collect-article class="btn-item"
                           v-model="article.is_collected"
                           :article-id="article.art_id"></collect-article>
          <!-- 父组件中有文章的id -->

          <!-- <van-icon class="btn-item" color="#777" name="star-o" /> -->
          <!-- <van-icon class="btn-item" color="#777" name="good-job-o" />
           -->
          <!-- 点赞按钮 -->
          <like-article v-model="article.attitude"
                        :article-id="article.art_id">
          </like-article>
          <van-icon name="share"
                    color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论的弹出层 -->
        <van-popup v-model="isPostShow"
                   position="bottom">
          <comment-post :target="article.art_id"
                        @post-success="onPostSuccess"></comment-post>
          <!-- 在父组件中监听自定义事件 -->
        </van-popup>
        <!-- /发布评论的弹出层 -->
      </div>

      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404"
           class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else
           class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn"
                    @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 ------------------->
    <!-- 在父组件中监听自定义事件 -->
    <!-- 弹出层是懒渲染,只有在第一次加载的时候才会渲染里面的内容,之后他的关闭和显示都是在切换内容的显示和隐藏 -->
    <van-popup v-model="isReplyShow"
               position="bottom"
               style="height:100%;">
      <!-- v-if 条件渲染  true :渲染元素节点   false:不渲染 -->
      <comment-reply v-if="isReplyShow"
                     :comment="currentComment"
                     @close="isReplyShow = false"></comment-reply>
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
// ------加载
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
// ImagePreview 是一个函数，调用函数后会直接在页面中展示图片预览界面。需要先导入进来
// ImagePreview 和其他组件不同，不是通过html结构的形式使用，而是以函数的形式，所以使用前先引入
// ImagePreview({
//   images: [
//     'https://img.yzcdn.cn/vant/apple-1.jpg',
//     'https://img.yzcdn.cn/vant/apple-2.jpg',
//   ],
//   // 起始位置,从0开始
//   startPosition: 1,
//   onClose () {
//     //do something
//     console.log('onClose');
//   }
// });
export default {
  // 组件名称
  name: 'ArticleIndex',
  //   // 局部注册的组件
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply,
  },
  // 给所有后代组件提供数据
  // 注意:不要滥用
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object], //可能是数字,字符串
      required: true,
    },
  },
  data () {
    return {
      article: {}, //文章详情
      loading: true, //加载中的loading状态
      //xhr.status:获取当前服务器的响应状态  200=>成功
      errStatus: 0, //失败的状态码
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false, //控制发布评论的显示状态
      commentList: [], //评论列表  传给子组件
      isReplyShow: false, //
      currentComment: {}, //当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {
    async loadArticle () {
      // 展示loading加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)

        // // 随机失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdfghjkl;')
        // }
        // console.log(data);
        // 数据驱动视图这件事不是立即的

        this.article = data.data
        // 请求成功,关闭loading
        // this.loading = false
        // 初始化图片,点击预览
        // console.log(this.$refs['article-content']);
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.errStatus === 404) {
          this.errStatus = 404
        }
        // this.loading = false
        console.log('获取数据失败', err)
      }
      // 无论成功还是失败,都需要关闭loading
      this.loading = false
    },
    previewImage () {
      // 得到所有的image节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs);
      // 获取所有img地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个img注册点击事件,在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置,从0开始
            startPosition: index,
          })
        }
      })
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      // console.log(comment)
      this.currentComment = comment

      // 显示评论回复弹出层
      this.isReplyShow = true
    },
  },
}
</script>
<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>

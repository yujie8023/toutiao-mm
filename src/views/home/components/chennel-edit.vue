<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title"
           class="title-text">我的频道</div>
      <!-- plain普通按钮 -->
      <van-button type="danger"
                  plain
                  round
                  size="mini"
                  class="edit-btn"
                  @click="isEdit = !isEdit">
        {{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid"
              :gutter="10">
      <van-grid-item class="grid-item"
                     v-for="(channel, index) in myChannels"
                     :key="index"
                     @click="onMyChannelClick(channel, index)">
        <!-- 
          v-bind:class 语法回顾
          一个对象，对象中的 key 表示要作用的 css 类名
                   对象中的 value 表示要计算的布尔值
                   true：则作用该类名
                   false：不作用该类名
       -->
        <van-icon slot="icon"
                  name="clear"
                  v-show="isEdit && !flexdChannels.includes(channel.id)"></van-icon>
        <span slot="text"
              class="text"
              :class="{ active: active === index }">
          {{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title"
           class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid"
              :gutter="10">
      <van-grid-item class="grid-item"
                     v-for="(channel, index) in recommendChannels"
                     :key="index"
                     icon="plus"
                     :text="channel.name"
                     @click="onAddChannel(channel)" />
    </van-grid>
    <!-- 频道推荐 /-->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'

import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data () {
    return {
      allChannels: [], //所有频道
      isEdit: false, //控制编辑状态的显示
      flexdChannels: [0], //固定推荐频道不允许删除
    }
  },
  computed: {
    ...mapState(['user']),  //映射user
    // 计算属性会观测内部依赖数据的变化
    // 如果以来的数据发生变化,则计算属性会重新执行
    // _____________________________________________
    // recommendChannels() {
    // 数组的filter方法,遍历数组,蝙蝠和条件的数组存储到新数组中,并返回

    //  fitter方法相当于 在内部创建一个数组const channels = [] true放到数组中

    //   return this.allChannels.filter((channel) => {

    // 数组的find方法,遍历数组,把符合条件的第一个元素返回
    //     return !this.myChannels.find((myChannel) => {
    //       return myChannel.id === channel.id
    //     })
    //   })
    // },
    recommendChannels () {
      const channels = []
      this.allChannels.forEach((channel) => {
        // find 遍历数组，找到满足条件的元素项
        const ret = this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
        // 如果我的频道中不包括该频道项，则收集到推荐频道中
        if (!ret) {
          channels.push(channel)
        }
      })

      // 把计算结果返回
      return channels
    },
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () { },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    // 添加频道
    async onAddChannel (channel) {
      // console.log(channel)
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录,把数据请求接口放到线上
          await addUserChannel({
            id: channel.id,  //频道ID
            seq: this.myChannels.length  //序号
          })
        } catch (err) {
          this.$toast('保存失败,请稍后重试')
        }
      } else {
        // 未登录,把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 删除更新频道
    onMyChannelClick (channel, index) {
      // console.log(channel, index);
      if (this.isEdit) {
        // 1.如果是固定频道,则不删除
        if (this.flexdChannels.includes(channel.id)) {
          return
        }
        //2. 如果是编辑状态,则执行删除频道
        this.myChannels.splice(index, 1)
        // 3.如果删除的激活之前的频道,则更新激活的频道项
        // 参数1. 要删除元素的开始索引(包括该索引)
        // 参数2. 删除的个数,如果不指定,则从参数1开始,一直删除到最后
        if (index <= this.active) {
          // 让激活频道的索引-1
          this.$emit('update-active', this.active - 1, true)
        }
        // 4.处理持久化
        this.deleteChannel(channel)
      } else {
        // 4.非编辑状态,执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {

      try {
        if (this.user) {
          // 已登录,将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录,将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)

        }
      } catch (err) {
        this.$toast('操作失败,请稍后重试')
      }

    }
  }
}
</script>
<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;

      .van-grid-item__text {
        font-size: 28px;
        color: #222;
      }
    }
  }

  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;

        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }

  /deep/.my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
      .van-grid-item__text {
        margin-top: 0;
      }
      .text {
        font-size: 28px;
        color: #222;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
}
</style>

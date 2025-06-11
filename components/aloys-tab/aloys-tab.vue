<template>
  <view style="width: 100%; height: 100%;">
    <view class="tabs">
      <view v-for="(tab, index) in tabs" class="tab-item" :class="current==index&&'active'" @click="current = index">
		  <view class="text">{{tab.title}}</view>
		  <view class="line"></view>
      </view>
    </view>
    <swiper :current="current" class="swiper-box" @change="onChange">
        <swiper-item v-for="(item ,index) in tabs" :key="index">
          <scroll-view scroll-y="true" style="height: 100%;">
            <!-- #ifdef MP -->
            <slot name="{{'content' + index}}"></slot>    
            <!-- #endif -->
            <!-- #ifndef MP -->
            <slot :name="'content'+index"></slot>
            <!-- #endif -->
          </scroll-view>
        </swiper-item>
    </swiper>
  </view>
</template>

<script>
	export default {
    name: 'swiperTab',
    props: {
      currentTab: {
        type: Number,
        default: 0
      },
      tabs: {
        type: Array,
        default: []
      }
    },
		data() {
			return {
				current: this.currentTab
			};
		},
    methods: {
      onChange(e) {
        this.current = e.detail.current;
        this.$emit('change', e.detail.current);
      }
    }
	}
</script>
<style>
swiper-tab{
  display: block;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.tabs{
  width: 750rpx;
  height: 88rpx;
  display: flex;
  .tab-item {
    flex: 1;
    text-align: center;
    color: grey;
    line-height: 88rpx;
    font-size: 28rpx;
    font-weight: 500;
    height: 100%;
    box-sizing: border-box;
    &.active{
	  color: rgba(48, 96, 251, 1);
	  font-size: 30rpx;
	  position: relative;
	  .line{
		  position: absolute;
		  bottom: 10rpx;
		  left: 50%;
		  transform: translateX(-50%);
		  display: inline-block;
		  width: 40rpx;
		  height: 8rpx;
		  background: #3060FB;
		  border-radius: 4rpx;
	  }
    }
  }
}
.swiper-box{
  width: 100%;
  height: calc(100% - 75rpx);
  overflow: auto;
}
</style>

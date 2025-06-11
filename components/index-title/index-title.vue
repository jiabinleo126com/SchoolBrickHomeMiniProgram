<template>
	<view class="container">
		<div class="title">{{title}}</div>
		<view class="src" @click.stop="topage(src,totab,tabIndex)">更多<image :src="src1"
				mode="aspectFit">
			</image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "indextitle",
		props: {
			title: {
				type: String,
				default: () => "标题"
			},
			src: {
				type: String,
				default: () => ""
			},
			totab: {
				type: Boolean,
				default: () => false
			},
			tabIndex: {
				type: Number,
				default: () => 0
			}
		},
		data() {
			return {
				src1:require(`@/static/组 1669@2x.png`)
			};
		},
		methods: {
			topage(page, totab, tabIndex) {
				if (tabIndex) {
					getApp().globalData.tabIndex = 1
					uni.switchTab({
						url: page
					})
				} else if (totab) {
					uni.switchTab({
						url: page
					})
				} else {
					uni.$u.route(page);
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 76rpx;
		padding-top: 40rpx;

		.title {
			font-size: 36rpx;
			font-weight: 500;
			color: #333333;
			position: relative;
			padding-left: 16rpx;

			&:before {
				position: absolute;
				left: 0;
				top: 8rpx;
				z-index: 10;
				content: "";
				width: 8rpx;
				height: 34rpx;
				background: #3060FB;
				border-radius: 4rpx;
			}
		}

		.src {
			font-size: 26rpx;
			font-weight: 400;
			color: #666666;

			image {
				width: 24rpx;
				height: 24rpx;
				vertical-align: -3rpx;
			}
		}
	}
</style>

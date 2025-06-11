<template>
	<view style="padding: 10rpx 5rpx 0rpx 5rpx;">
		<view style="padding: 10rpx;border-radius: 10rpx;background: white;" @click="topage(item.id)">
			<image :src="item.shipin_cover" mode="widthFix" style="width: 100%;"></image>
			<view class="title">
				<view class="p">{{item.shipin_name}}</view>
			</view>
			<view class="tools">
				<view class="num">
					<view class="view"></view>{{item.views}}
				</view>
				<view class="num">
					<view class="zan"></view>{{item.likes}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["item"],
		data() {
			return {

			}
		},
		methods: {
			topage(id) {
			}
		}
	}
</script>

<style lang="less" scoped>
	image{
		height: 440rpx;
	}
	.title {
		text-align: justify;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
		line-height: 34rpx;
		margin: 4rpx 0 10rpx;
	}

	.tools {
		display: flex;
		width: 80%;

		.num {
			flex: 1;
			font-size: 24rpx;
			font-weight: 400;
			color: #666666;

			view {
				display: inline-block;
				width: 20rpx;
				height: 20rpx;
				background-position: center;
				background-repeat: no-repeat;
				background-size: contain;
				margin-right: 10rpx;

				&.view {
					background-image: url("@/static/运行 (1)@2x.png");
				}

				&.zan {
					background-image: url("@/static/赞@2x.png");
				}
			}

			image {
				width: 20rpx;
				height: 20rpx;
				margin-right: 10rpx;
			}
		}
	}
</style>

<template>
	<view class="container">
		<view class="box">
			<image class="logo" src="@/static/logo.png" mode="aspectFit"></image>
			<view class="name">{{name}}</view>
			<div class="text">
				<view v-html="text"></view>
			</div>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: "",
				name: "选校砖家"
			};
		},
		onLoad() {
			let than = this;
			uni.request({
				url: "https://www.ieduchina.com/api.php?op=xc&do=aboutus",
				method: "GET",
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success(res) {
					if (res.data.status == 1) {
						than.text = res.data.data.aboutus;
					}
				}
			})
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: rgba(243, 243, 247, 1);
		min-height: 100vh;
		box-sizing: border-box;
		padding: 24rpx 32rpx 66rpx;

		.box {
			background-color: white;
			text-align: center;
			height: calc(100vh - 90rpx);
			border-radius: 16rpx;

			.logo {
				width: 144rpx;
				height: 144rpx;
				box-sizing: border-box;
				border-radius: 16rpx;
				margin-top: 92rpx;
			}

			.name {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				padding: 20rpx 0 80rpx;
			}

			.text {
				width: 590rpx;
				height: 412rpx;
				margin: 0 auto;
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
				line-height: 32rpx;
				text-align: justify;
				line-height: 46rpx;
				view{
					text-indent: 2em;
				}
			}
		}
	}
</style>

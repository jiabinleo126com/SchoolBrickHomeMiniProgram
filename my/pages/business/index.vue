<template>
	<view class="container">
		<view class="box">
			<image class="logo" src="@/static/组 782@2x.png" mode="aspectFit"></image>
			<view class="name">{{name}}</view>
			<div class="text">
				<u-divider text="联系方式" textSize="28rpx" textColor="rgba(102, 102, 102, 1)"
					lineColor="rgba(221, 221, 221, 1)"></u-divider>
			</div>
			<view class="tel" @click="call(phoneNumber)">
				官方电话：{{phoneNumber}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "商务合作",
				phoneNumber: "400-822-1988"
			};
		},
		methods: {
			call(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				})
			}
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
				padding: 20rpx 0 144rpx;
			}

			.text {
				margin: -30rpx auto 0;
				width: 568rpx;
				font-weight: 400;
				padding-bottom: 70rpx;
			}

			.tel {
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				text-align: center;
			}
		}
	}
</style>

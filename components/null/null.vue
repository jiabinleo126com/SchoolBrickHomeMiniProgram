<template>
	<view class="container">
		<image class="img" src="@/static/null.png" mode="aspectFit"></image>
		<view class="text">暂时还没有信息呢~</view>
	</view>
</template>

<script>
	export default {
		name: "null",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.container {
		text-align: center;

		.img {
			width: 312rpx;
			height: 240rpx;
			margin-top: 240rpx;
		}

		.text {
			padding-top: 64rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
		}
	}
</style>

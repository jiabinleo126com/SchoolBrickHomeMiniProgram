<template>
	<view class="container">
		<view class="box">
			<image class="logo" :src="src1" mode="aspectFit"></image>
			<view class="name">{{name}}</view>
			<view class="contact">
				<u-button open-type="contact">在线客服</u-button>
			</view>
		</view>
		<view class="list">
			<view class="lis" v-for="(item,index) in list" :key="index">
				<image class="img" :src="item.img" mode="aspectFit"></image>
				<view class="name">{{item.name}}</view>
				<view class="tel" @click="call(item.tel)">{{item.tel}}</view>
				<view class="bt" @click="call(item.tel)">拨打</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "选校砖家",
				phoneNumber: "400-822-1988",
				src1:require(`@/static/logo.png`),
				list:[
					{
						img:require(`@/static/组1672@2x.png`),
						name:"家长咨询",
						tel:"400-900-8516"
					},{
						img:require(`@/static/组1672@2x1.png`),
						name:"商务合作",
						tel:"19928755861"
					}
				]
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
			box-sizing: border-box;
			font-size: 0;
			background-color: white;
			text-align: center;
			// height: calc(100vh - 90rpx);
			height: 612rpx;
			border-radius: 16rpx;

			.logo {
				width: 144rpx;
				height: 144rpx;
				box-sizing: border-box;
				border-radius: 16rpx;
				margin-top: 114rpx;
			}

			.name {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				padding: 24rpx 0 104rpx;
			}

			.contact {
				width: 600rpx;
				margin: 0 auto;
				height: 80rpx;
				background: #3060FB;
				border-radius: 44rpx;

				::v-deep button {
					border-radius: 44rpx;
					height: 100%;
					width: 100%;
					box-shadow: 0 6rpx 20rpx 2rpx rgba(48, 96, 251, 0.502);
					border: none;
					background: #3060FB;
					font-size: 30rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}
		.list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.lis{
				background-color: white;
				width: 328rpx;
				text-align: center;
				padding: 52rpx 0 36rpx;
				margin-top: 30rpx;
				border-radius: 16rpx;
				.img{
					width: 110rpx;
					height: 110rpx;
				}
				.name{
					font-size: 30rpx;
					font-weight: 400;
					color: #666666;
					padding: 28rpx 0 36rpx;
				}
				.tel{
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
				}
				.bt{
					width: 132rpx;
					height: 48rpx;
					background: #F2F5F5;
					border-radius: 8rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #3060FB;
					text-align: center;
					line-height: 48rpx;
					margin: 52rpx auto 0;
				}
			}
		}
	}
</style>

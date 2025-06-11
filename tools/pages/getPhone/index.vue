<template>
	<view class="container">
		<image class="banner" width="100%" height="370" src="https://www.ieduchina.com/statics/image/20250328aaa.jpg"
			:fade="true" duration="450" mode="aspectFill"></image>
		<view class="tip">面试解析|考情分析|估分预测|入学衔接|同步课程</view>
		<view class="btn">
			<button class="getmobile" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">点击自动登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: {
					mobile: "",
					tgfrom: "",
					mark: "选校砖家小程序_安托山地推"
				}
			};
		},
		onLoad(option) {
			this.msg.tgfrom = option.tg;
			uni.setNavigationBarTitle({
				title: "世界名校，从这里启航"
			});
		},
		methods: {
			getPhoneNumber(e) {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=get_mobile",
					method: 'POST',
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						code: e.detail.code
					},
					success: (res) => {
						if (res.data.status == 1) {
							than.msg.mobile = res.data.data.phone_info.phoneNumber
							than.topage(than.msg)
						} else {
							wx.showToast({
								title: "登录失败，请稍后再试！！！",
								icon: "none"
							})
						}
					},
					error(err) {
						wx.showToast({
							title: "登录失败，请稍后再试！！！",
							icon: "none"
						})
					}
				})
			},
			topage(msg) {
				uni.$u.route(`/tools/pages/getUsername/index?msg=${JSON.stringify(msg)}`);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		// background-color: rgb(24, 70, 156);
		background-color: white;
		min-height: 100vh;
		padding-bottom: 30rpx;
		box-sizing: border-box;

		.banner {
			width: 100%;
			height: 335rpx;
			object-fit: contain;
		}

		.tip {
			padding: 20rpx;
			color: white;
		}

		// .form {
		// position: relative;
		// padding: 20rpx;

		// /deep/.u-form-item__body__left {
		// 	width: 150rpx !important;
		// }

		// /deep/.getmobile {
		// 	position: absolute;
		// 	z-index: 100;
		// 	right: 40rpx;
		// 	top: 117rpx;
		// 	width: 210rpx;
		// 	height: 69rpx;
		// 	font-size: 32rpx;
		// 	line-height: 72rpx;
		// }

		// }
		.btn {
			text-align: center;

			.getmobile {
				width: 300rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 4rpx;
				margin-top: 500rpx;
				font-weight: bold;
				font-size: 32rpx;
				color: white;
				border: 1rpx solid rgb(27, 37, 90);
				background-color: rgb(27, 37, 90);
			}
		}

		::v-deep.u-image__image,
		.u-image {
			width: 100%;
		}
	}
</style>
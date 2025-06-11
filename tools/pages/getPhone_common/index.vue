<template>
	<view class="container" :style="{ background:active.color3}">
		<image class="banner" width="100%" height="370" :src="active.thumb1" :fade="true" duration="450"
			mode="widthFix">
		</image>
		<view class="tip"></view>
		<view class="btn">
			<button :style="{ background:active.color1}" class="getmobile" open-type="getPhoneNumber"
				@getphonenumber="getPhoneNumber">点击自动登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				active: {},
				msg: {
					mobile: "",
					tgfrom: "",
					mark: "",
					id: ""
				}
			};
		},
		onLoad(option) {
			this.msg.tgfrom = option.tg;
			this.msg.id = option.id;
			this.getActiveMsg(option.id)
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
							than.getStatus(than.msg.mobile, than.msg.mark);
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
			getActiveMsg(id) {
				let than = this;
				uni.request({
					url: `https://www.ieduchina.com/api.php?op=xc&do=ditui&id=${id}`,
					method: 'POST',
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data.status == 1) {
							than.active = res.data.data;
							than.msg.mark = res.data.data.laiyuan

							uni.setNavigationBarTitle({
								title: res.data.data.name
							});
							// than.msg.mobile = res.data.data.phone_info.phoneNumber
						} else {
							wx.showToast({
								title: "活动获取失败，请稍后再试！！！",
								icon: "none"
							})
						}
					},
					error(err) {
						wx.showToast({
							title: "活动获取失败，请稍后再试！！！",
							icon: "none"
						})
					}
				})
			},
			getStatus(mobile, mark) {
				const than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=check_mobile",
					method: 'POST',
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						mobile,
						mark,
						flags: "xcx"
					},
					success: (res) => {
						if (res.data.status == 1) {
							uni.$u.route(
								`/tools/pages/getStatus_common/index?activeid=${than.active.id}`);
						} else {
							uni.$u.route(
								`/tools/pages/getUsername_common/index?msg=${JSON.stringify(than.msg)}`);
						}
					},
					error(err) {
						wx.showToast({
							title: "获取报名状态失败！！！",
							icon: "none"
						})
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: white;
		min-height: 100vh;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		position: relative;

		.banner {
			width: 100%;
			height: 335rpx;
			object-fit: contain;
		}

		.tip {
			padding: 20rpx;
			color: white;
		}

		.btn {
			position: absolute;
			bottom: 250rpx;
			width: 100%;
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
				// border: 1rpx solid rgb(27, 37, 90);
				// background-color: rgb(27, 37, 90);
			}
		}

		::v-deep.u-image__image,
		.u-image {
			width: 100%;
		}
	}
</style>
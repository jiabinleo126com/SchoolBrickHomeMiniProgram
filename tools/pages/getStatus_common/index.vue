<template>
	<view class="container">
		<template v-if="active.thumb4">
			<image :show-menu-by-longpress="true" @tap="preview" class="banner" width="100%" height="370"
				:src="active.thumb4" :fade="true" duration="450" mode="widthFix"></image>
		</template>
		<template v-else>
			<view class="null"></view>
		</template>
		<view class="success">
			<image :show-menu-by-longpress="true" @tap="preview" class="ewm" width="50%" height="370"
				:src="active.thumb3" :fade="true" duration="450" mode="widthFix"></image>
			<view class="text">家长您好，您已成功提交本表单!<br>
				请长按二维码添加微信，了解更多国际教育资讯!</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: {},
				result: ""
			};
		},
		onLoad(option) {
			debugger
			var activeid = +option.activeid;
			// console.log(options)
			// debugger
			// let options = {
			// 	id: "3",
			// 	info: "您已报名成功，谢谢您的参与！",
			// 	msg: "您已报名成功，谢谢您的参与！",
			// 	status: 1,
			// 	url: ""
			// }
			this.getActiveMsg(activeid)
		},
		methods: {

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
							uni.setNavigationBarTitle({
								title: res.data.data.name
							});
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
			}
		},
		previewImage() {
			wx.previewImage({
				urls: [this.data.qrcodeUrl], // 需为合法业务域名下的图片
				current: this.data.qrcodeUrl
			});
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F3F3F7;
		background-color: #FFF;
		// background-color: rgb(24,70,156);
		min-height: 100vh;
		padding-bottom: 30rpx;
		box-sizing: border-box;

		.banner {
			width: 100%;
			height: 713rpx;
			object-fit: contain;
		}

		.tip {
			padding: 20rpx;
			word-break: break-word;
		}

		.null {
			height: 200rpx;
		}

		.success {
			padding: 40rpx 40rpx 40rpx 40rpx;
			// font-size: 26rpx;
			text-align: center;
			line-height: 80rpx;

			.text {
				text-align: text;
				word-break: break-word;
				font-size: 28rpx;
				line-height: 42rpx;
			}

			.ewm {
				width: 60%;
				margin-top: 20rpx;
			}
		}

		::v-deep.u-image__image,
		.u-image {
			width: 100%;
		}
	}
</style>
<template>
	<view class="container">
		<image :show-menu-by-longpress="true" @tap="preview" class="banner" width="100%" height="370"
			:src="active.thumb2" :fade="true" duration="450" mode="widthFix"></image>
		<view class="form">
			<view class="tip" v-html="active.content"></view>
			<u--form labelPosition="left" :model="user" rule="user.name" ref="uForm">
				<u-form-item label="学生姓名" prop="user.name" borderBottom ref="item1">
					<u--input v-model="user.name" type="text" placeholder="请输入学生姓名" border="none"></u--input>
				</u-form-item>
				<button :style="{ background:active.color1}" class="submit" @click="submit">提交报名</button>
			</u--form>
		</view>
		<!-- <view v-else class="success">
			 
			<view class="text" v-html="result"></view>
			<image :show-menu-by-longpress="true" @tap="preview" class="ewm" width="50%" height="370" :src="active.thumb3"
				:fade="true" duration="450" mode="widthFix"></image>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeId:"",
				active: {},
				user: {
					name: '',
					mobile: '',
					mark: '',
					tgfrom: "",
					flags: "xcx"
				},
				result: "",
				rules: {
					'user.name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
				},
			};
		},
		onLoad(option) {
			// option = {
			// 	msg: {
			// 		mobile: 18516239367,
			// 		tgfrom: 测试,
			// 		mark: 升学
			// 	}
			// }
			var option = JSON.parse(option.msg);
			console.log(option)

			this.user.mark = option.mark;
			this.user.mobile = option.mobile;
			this.user.tgfrom = option.tgfrom;
			this.activeId = option.id
			uni.setNavigationBarTitle({
				title: "世界名校，从这里启航"
			});
			this.getActiveMsg(option.id)
			// this.getStatus(this.user.mobile, this.user.mark);
		},
		methods: {
			submit() {
				if (!this.user.name) {
					wx.showToast({
						title: "请输入学生姓名",
						icon: "none"
					})
					return false;
				}
				// const data = this.user
				// this.$refs.uForm.validate().then(res => {
				const data = this.user;
				const than = this;
				uni.request({
					url: "https://www.ieduchina.com/index.php?m=college&c=index&a=collegereg&dopost=reg",
					method: 'POST',
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: (res) => {
						// if (res.data.status == 1) {
						// 	// wx.showToast({
						// 	// 	title: res.data.info,
						// 	// 	icon: "none",
						// 	// 	// duration: 999999999
						// 	// })
						// 	than.user.name = "";
						// 	than.result = res.data.info
						// } else {
						// 	wx.showToast({
						// 		title: res.data.info,
						// 		icon: "none"
						// 	})
						// 	than.result = res.data.info
						// }
						uni.$u.route(`/tools/pages/getStatus_common/index?activeid=${than.active.id}`);
					},
					error(err) {
						wx.showToast({
							title: "报名失败，请稍后再试！！！",
							icon: "none"
						})
					}
				})
				// }).catch(errors => {
				// 	console.log(errors)
				// 	uni.$u.toast('校验失败')
				// })
			},
			// https://www.ieduchina.com/api.php?op=xc&do=get_mobile
			// getStatus(mobile, mark) {
			// 	const than = this;
			// 	uni.request({
			// 		url: "https://www.ieduchina.com/api.php?op=xc&do=check_mobile",
			// 		method: 'POST',
			// 		dataType: "json",
			// 		header: {
			// 			'Content-Type': 'application/x-www-form-urlencoded'
			// 		},
			// 		data: {
			// 			mobile,
			// 			mark,
			// 			flags: "xcx"
			// 		},
			// 		success: (res) => {
			// 			if (res.data.status == 1) {
			// 				than.result = res.data.info
			// 			} else {
			// 				than.result = ""
			// 			}
			// 		},
			// 		error(err) {
			// 			wx.showToast({
			// 				title: "获取报名状态失败！！！",
			// 				icon: "none"
			// 			})
			// 		}
			// 	})
			// },
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
							than.user.mark = res.data.data.laiyuan;
							uni.setNavigationBarTitle({
								title: res.data.data.name
							});
							// than.msg.mobile = res.data.data.phone_info.phoneNumber
							// than.topage(than.msg)
						} else {
							wx.showToast({
								title: "活动获取失败，请稍后再试！！！",
								icon: "none"
							})
						}
					},
					error(err) {
						// wx.showToast({
						// 	title: "登录失败，请稍后再试！！！",
						// 	icon: "none"
						// })
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

		.form {
			position: relative;
			padding: 20rpx;

			::v-deep.u-form-item__body__left {
				width: 150rpx !important;
			}

			::v-deep.getmobile {
				position: absolute;
				z-index: 100;
				right: 40rpx;
				top: 117rpx;
				width: 210rpx;
				height: 69rpx;
				font-size: 32rpx;
				line-height: 72rpx;
			}

			.submit {
				width: 300rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 4rpx;
				margin-top: 60rpx;
				font-weight: bold;
				font-size: 32rpx;
				color: white;
				// border: 1rpx solid rgb(27, 37, 90);
				// background-color: rgb(27, 37, 90);
			}
		}

		.success {
			padding: 40rpx;
			// font-size: 26rpx;
			text-align: center;
			line-height: 60rpx;

			.text {
				text-align: left;
				word-break: break-word;
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
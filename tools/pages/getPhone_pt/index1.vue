<template>
	<view class="container">
		<image class="banner" width="100%" height="370"
			src="https://forms.ieduchina.com/Upload/images/quest/2025-03-12/67d15cbaade67.jpg" :fade="true"
			duration="450" mode="aspectFill"></image>
		<view class="tip">面试解析|考情分析|估分预测|入学衔接|同步课程</view>
		<view class="form">
			<u--form labelPosition="left" :model="user" :rules="rules" ref="uForm">
				<u-form-item label="姓名" prop="user.name" borderBottom ref="item1">
					<u--input v-model="user.name" type="nickname" placeholder="请输入姓名" border="none"></u--input>
				</u-form-item>
				<u-form-item label="手机号" prop="user.mobile" borderBottom ref="item2">
					<u--input open-type="getPhoneNumber" placeholder="请输入手机号" @getphonenumber="getPhoneNumber"
						v-model="user.mobile" border="none"></u--input>
				</u-form-item>
				<button class="getmobile" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
				<button class="submit" @click="submit">提交</button>
			</u--form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					name: '',
					mobile: '',
					mark: '选校砖家小程序'
				},
				rules: {
					'userInfo.name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'userInfo.mobile': {
						type: 'string',
						required: true,
						message: '请填写手机号',
						trigger: ['blur', 'change']
					}
				},
				openid: "",
			};
		},
		onLoad(option) {
			var tg = `选校砖家小程序&&tg=${option.tg}`;
			if (!tg) {
				tg = `选校砖家小程序`
			}
			this.user.mark = tg;
			uni.setNavigationBarTitle({
				title: "3.16深国交考试"
			});
		},
		methods: {
			getPhoneNumber(e) {
				let than = this;
				console.log('获取手机号事件触发', e.detail);
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
							than.user.mobile = res.data.data.phone_info.phoneNumber
						} else {
							wx.showToast({
								title: "手机号获取失败",
								icon: "none"
							})
						}
					},
					error(err) {
						wx.showToast({
							title: "手机号获取失败",
							icon: "none"
						})
					}
				})
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
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
							if (res.data.status == 1) {
								wx.showToast({
									title: "提交成功",
									icon: "none"
								})
							} else {
								wx.showToast({
									title: "手机号获取失败",
									icon: "none"
								})
							}
						},
						error(err) {
							wx.showToast({
								title: "手机号获取失败",
								icon: "none"
							})
						}
					})
				}).catch(errors => {
					console.log(errors)
					uni.$u.toast('校验失败')
				})
			}
		},
		onShareAppMessage() {
			return {
				title: "3.16深国交考试",
				path: "/tools/pages/getPhone/index",
				query: `mark=${JSON.stringify(this.user.mark)}`,
				success() {
					uni.showToast({
						title: "分享成功"
					})
				},
				fail() {
					uni.showToast({
						title: "分享失败",
						icon: "none"
					})
				}
			}
		},
		onShareTimeline() {
			return {
				title: "3.16深国交考试",
				path: "/tools/pages/getPhone/index",
				query: `mark=${JSON.stringify(this.user.mark)}`,
				success() {
					uni.showToast({
						title: "分享成功"
					})
				},
				fail() {
					uni.showToast({
						title: "分享失败",
						icon: "none"
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F3F3F7;
		min-height: 100vh;
		padding-bottom: 30rpx;
		box-sizing: border-box;

		.banner {
			width: 100%;
			height: 740rpx;
			object-fit: contain;
		}

		.tip {
			padding: 20rpx;
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
				border: 1rpx solid #479DE6;
				background-color: #479DE6;
			}
		}

		::v-deep.u-image__image,
		.u-image {
			width: 100%;
		}
	}
</style>
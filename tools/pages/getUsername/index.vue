<template>
	<view class="container">
		<image class="banner" width="100%" height="370" src="https://www.ieduchina.com/statics/image/20250328aab.jpg"
			:fade="true" duration="450" mode="aspectFill"></image>
		<view class="tip">面试解析|考情分析|估分预测|入学衔接|同步课程</view>
		<view class="form" v-if="!result">
			<u--form labelPosition="left" :model="user" rule="user.name" ref="uForm">
				<u-form-item label="学生姓名" prop="user.name" borderBottom ref="item1">
					<u--input v-model="user.name" type="text" placeholder="请输入学生姓名" border="none"></u--input>
				</u-form-item>
				<button class="submit" @click="submit">提交报名</button>
			</u--form>
		</view>
		<view v-else class="success">
			{{result}}
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
					mark: '选校砖家小程序_安托山地推',
					tgfrom: "",
					flags: "xcx1"
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
			var option = JSON.parse(option.msg);
			console.log(option)

			this.user.mark = option.mark;
			this.user.mobile = option.mobile;
			this.user.tgfrom = option.tgfrom;
			uni.setNavigationBarTitle({
				title: "世界名校，从这里启航"
			});
			this.getStatus(this.user.mobile)
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
						if (res.data.status == 1) {
							// wx.showToast({
							// 	title: res.data.info,
							// 	icon: "none",
							// 	// duration: 999999999
							// })
							than.user.name = "";
							than.result = res.data.info
						} else {
							wx.showToast({
								title: res.data.info,
								icon: "none"
							})
							than.result = res.data.info
						}
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
			getStatus(mobile) {
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
						flags: "xcx1"
					},
					success: (res) => {
						if (res.data.status == 1) {
							than.result = res.data.info
						} else {
							than.result = ""
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
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F3F3F7;
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
				border: 1rpx solid rgb(27, 37, 90);
				background-color: rgb(27, 37, 90);
			}
		}

		.success {
			padding: 40rpx;
			// font-size: 26rpx;
			text-align: center;
			line-height: 60rpx;
		}

		::v-deep.u-image__image,
		.u-image {
			width: 100%;
		}
	}
</style>
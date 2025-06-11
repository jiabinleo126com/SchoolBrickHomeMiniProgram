<template>
	<view class="container">
		<image class="banner" width="100%" height="370" src="https://www.ieduchina.com/statics/image/1742289706522.png"
			:fade="true" duration="450" mode="aspectFill"></image>
		<!-- <view class="tip">面试解析|考情分析|估分预测|入学衔接|同步课程</view> -->
		<view class="btn">
			<button class="getmobile" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">点击自动登录</button>
		</view>
		<!-- <view class="form">
			<u--form labelPosition="left" :model="user" :rules="rules" ref="uForm">
				<u-form-item label="姓名" prop="user.name" borderBottom ref="item1">
					<u--input v-model="user.name" type="nickname" placeholder="请输入姓名" border="none"></u--input>
				</u-form-item>
				<u-form-item label="手机号" prop="user.mobile" borderBottom ref="item2">
					<u--input open-type="getPhoneNumber" placeholder="请输入手机号" @getphonenumber="getPhoneNumber"
						v-model="user.mobile" border="none"></u--input>
				</u-form-item>
				
				<button class="submit" @click="submit">提交</button>
			</u--form>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: {
					mobile: "",
					tgfrom: "",
					mark: "小程序平台市场地推"
				}
			};
		},
		onLoad(option) {
			// var tg = `选校砖家小程序&&tg=${option.tg}`;
			// if (!tg) {
			// 	tg = `选校砖家小程序`
			// }
			this.msg.tgfrom = option.tg;
			uni.setNavigationBarTitle({
				title: "深圳培侨 新一轮插班密训"
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
							than.msg.mobile = res.data.data.phone_info.phoneNumber
							// than.submit()
							// wx.showToast({
							// 	title: "登录成功！！！",
							// 	icon: "none",
							// 	duration: 3000
							// })
							// setTimeout(()=>{
							than.topage(than.msg)
							// },1000)
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
				// if (page) {
				// 	if (page == "video" && id) {
				// 		uni.$u.route(`/video/pages/video/index?id=${id}`);
				// 	} else if (page == "school" && id) {
				uni.$u.route(`/tools/pages/getUsername_pt/index?msg=${JSON.stringify(msg)}`);
				// 		setTimeout(() => {
				// 			this.ad.showAd = false
				// 		}, 2000)
				// 	} else {
				// 		uni.$u.route(page);
				// 	}
				// }
			},
			// submit(mobile) {
			// 	// this.$refs.uForm.validate().then(res => {
			// 		const data = this.user;
			// 		const than = this;
			// 		uni.request({
			// 			url: "https://www.ieduchina.com/index.php?m=college&c=index&a=collegereg&dopost=reg",
			// 			method: 'POST',
			// 			dataType: "json",
			// 			header: {
			// 				'Content-Type': 'application/x-www-form-urlencoded'
			// 			},
			// 			data,
			// 			success: (res) => {
			// 				if (res.data.status == 1) {
			// 					wx.showToast({
			// 						title: "提交成功",
			// 						icon: "none"
			// 					})
			// 				} else {
			// 					wx.showToast({
			// 						title: res.data.info,
			// 						icon: "none"
			// 					})
			// 				}
			// 			},
			// 			error(err) {
			// 				wx.showToast({
			// 					title: "登录失败，请稍后再试",
			// 					icon: "none"
			// 				})
			// 			}
			// 		})
			// 	// }).catch(errors => {
			// 	// 	console.log(errors)
			// 	// 	uni.$u.toast('校验失败')
			// 	// })
			// }
		},
		// onShareAppMessage() {
		// 	return {
		// 		title: "3.16深国交考试",
		// 		path: "/tools/pages/getPhone/index",
		// 		query: `mark=${JSON.stringify(this.user.mark)}`,
		// 		success() {
		// 			uni.showToast({
		// 				title: "分享成功"
		// 			})
		// 		},
		// 		fail() {
		// 			uni.showToast({
		// 				title: "分享失败",
		// 				icon: "none"
		// 			})
		// 		}
		// 	}
		// },
		// onShareTimeline() {
		// 	return {
		// 		title: "3.16深国交考试",
		// 		path: "/tools/pages/getPhone/index",
		// 		query: `mark=${JSON.stringify(this.user.mark)}`,
		// 		success() {
		// 			uni.showToast({
		// 				title: "分享成功"
		// 			})
		// 		},
		// 		fail() {
		// 			uni.showToast({
		// 				title: "分享失败",
		// 				icon: "none"
		// 			})
		// 		}
		// 	}
		// },
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: rgb(24, 70, 156);
		min-height: 100vh;
		padding-bottom: 30rpx;
		box-sizing: border-box;

		.banner {
			width: 100%;
			height: 410rpx;
			object-fit: contain;
		}

		// .tip {
		// 	padding: 20rpx;
		// }

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
				border: 1rpx solid rgb(246, 149, 5);
				background-color: rgb(246, 149, 5);
			}
		}

		::v-deep.u-image__image,
		.u-image {
			width: 100%;
		}
	}
</style>
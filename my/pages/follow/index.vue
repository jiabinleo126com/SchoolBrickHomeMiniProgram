<template>
	<view class="content">
		<view>
			<schoolProfile :schoolProfile="school" schoolid="collegeid" name="school_name" thumb="school_logo"></schoolProfile>
		</view>
	</view>
</template>

<script>
	import schoolProfile from "@/components/school-profile/school-profile.vue";
	export default {
		components: {
			schoolProfile
		},
		data() {
			return {
				formdata: {
					openid: "",
					page: 1,
					types: 1,//1关注 2收藏
				},
				school: [],
				zixun: [],
				scrollview: false,
				loadover: false
			}
		},
		onLoad(e) {
			let than = this;
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.formdata.openid = res.data;
						than.openid = res.data;
						than.getList();
					}
				},
				fail() {
					uni.showModal({
						content: '请登录',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: `/pages/my/index`
								})
							}
						}
					});
				}
			});
		},
		onShow() {},
		onPageScroll(e) {

		},
		methods: {
			getList() {
				let than = this;
				console.log(this.formdata)
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=user_gzc_list",
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: than.formdata,
					success(res) {
						if (res.data.status == 1) {
							if (res.data.data.count == 0 || res.data.data == "") {
								let title = ""
								than.loadover = true;
								than.school = [];
								title = "暂时没有关注的学校"
								wx.showToast({
									title,
									icon: "none"
								})
							} else if (res.data.data.list.length == 0) {
								than.loadover = true;
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
							} else if (than.formdata.page == 1) {
								than.school = res.data.data.list;
							} else {
								than.school.push(...res.data.data.list);
							}
						}else{
							
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			change2(e) {
				console.log(e)
				if (!e.show) {
					this.scrollview = false
				}
			},
			upper: function(e) {
				console.log(e)
			},
			lower: function(e) {
				console.log(e)
			}
		},
		onReachBottom() {
			if (!this.loadover) {
				this.formdata.page++
				this.getList()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.p {
		// overflow: hidden;
		position: fixed;
		height: 100vh;
		width: 100vw;
	}

	.content {
		background-color: #F3F3F7;
		min-height: 100vh;

		&>view {
			padding-top: 1rpx;
		}

		.tabs {
			background-color: white;
			height: 88rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.tab {
				text-align: center;
				position: relative;
				display: inline-block;
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);

				&.active {
					color: #3060FB;

					.text {
						background-color: #3060FB;
					}
				}

				.text {
					position: absolute;
					bottom: -14rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 8rpx;
					border-radius: 4rpx;
				}
			}
		}
	}
</style>

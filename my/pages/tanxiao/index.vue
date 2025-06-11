<template>
	<view class="content">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view class="tabs">
				<view :class="{'tab':true,active:index==tabsIndex}" @click="tabfun(tab,index)" v-for="(tab,index) in tabs"
					:key="index">
					{{tab.name}}
					<text class="text"></text>
				</view>
			</view>
		</u-sticky>

		<view style="margin-top: 24rpx;">
			<tanxiaoItem :tanxiaoItem="school" pagelink="/my/pages/tanxiaodetail/index" address="school_address"
				schoolid="id"></tanxiaoItem>
		</view>
	</view>
</template>

<script>
	import tanxiaoItem from "@/components/tanxiao-item/tanxiao-item.vue";
	export default {
		components: {
			tanxiaoItem
		},
		data() {
			return {
				tabs: [{
						name: "待处理",
						id: 5
					},
					{
						name: "确认预约",
						id: 1
					},
					{
						name: "预约待定",
						id: 2
					},
					{
						name: "取消预约",
						id: 3
					}
				],
				tabsIndex: 0,
				school: [],
				scrollview: false,
				formdata: {
					openid: "",
					apply: "apply",
					types: 2,
					status: 5,
					page: 1,
				}
			}
		},
		onLoad() {
			let than = this;
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.formdata.openid = res.data;
						than.getData()
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
			getData() {
				let than = this;
				let {
					formdata
				} = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=user_yuyue_tanxiao",
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: formdata,
					success(res) {
						if (res.data.status == 1) {
							let data = res.data.data.list
							// than.tabsIndex = than.formdata.status - 1;
							if (res.data.data.count == 0) {
								than.loadover = true;
								than.school = [];
								wx.showToast({
									title: "暂时没有符合条件的预约",
									icon: "none"
								})
							} else if (res.data.data.list.length == 0) {
								than.loadover = true;
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
							} else {
								if (than.formdata.page == 1) {
									than.school = [];
								}
								than.school = than.school.concat(data)
							}
						} else if (than.formdata.page != 1) {
							wx.showToast({
								title: "数据加载完成",
								icon: "none"
							})
						} else {
							wx.showToast({
								title: "暂时没有符合条件的探校",
								icon: "none"
							})
							than.school = [];
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			tabfun(tab,index) {
				this.tabsIndex = index;
				this.formdata.status = tab.id;
				this.formdata.page = 1
				this.getData()
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (!this.loadover) {
				this.formdata.page++
				this.getData()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.p {
		position: fixed;
		height: 100vh;
		width: 100vw;
	}

	.content {
		background-color: #F3F3F7;
		min-height: 100vh;

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

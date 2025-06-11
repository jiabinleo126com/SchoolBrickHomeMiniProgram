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
			<huodongItem :huodongItem="list" pagelink="/my/pages/huodongdetail/index" title="activity_name"
				price="activity_price" image="activity_logo" activityid="id" schoolname="school_name" label="label_name"></huodongItem>
		</view>

	</view>
</template>

<script>
	import huodongItem from "@/components/huodong-item/huodong-item.vue";
	export default {
		components: {
			huodongItem
		},
		data() {
			return {
				tabs:[
					{
						name:"待处理",
						id:5
					},
					{
						name:"确认预约",
						id:1
					},
					{
						name:"预约待定",
						id:2
					},
					{
						name:"取消预约",
						id:3
					}
				],
				tabsIndex: 0,
				list: [],
				scrollview: false,
				formData: {
					openid: "",
					apply: "apply",
					types: 2,
					status: 5,
					page: 1
				}
			}
		},
		onLoad(e) {
			let than = this;
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.formData.openid = res.data;
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
					formData
				} = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=user_yuyue_activity",
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: formData,
					success(res) {
						if (res.data.status == 1) {
							let data = res.data.data.list
							// than.tabsIndex = than.formData.status;
							if (res.data.data.count == 0) {
								than.loadover = true;
								than.list = [];
								wx.showToast({
									title: "暂时没有符合条件的活动",
									icon: "none"
								})
							} else if (res.data.data.list.length == 0) {
								than.loadover = true;
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
							} else {
								if (than.formData.page == 1) {
									than.list = [];
								}
								than.list = than.list.concat(data)
							}
						} else if(than.formData.page != 1) {
							wx.showToast({
								title: "数据加载完成",
								icon: "none"
							})
						}else{
							wx.showToast({
								title: "暂时没有符合条件的活动",
								icon: "none"
							})
							than.list = [];
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			tabfun(tab,index) {
				this.tabsIndex = index;
				this.formData.status = tab.id;
				this.formData.page = 1
				this.getData()
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (!this.loadover) {
				this.formData.page++
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

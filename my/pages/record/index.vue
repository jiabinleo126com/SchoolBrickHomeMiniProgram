<template>
	<view class="content">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view class="tabs">
				<view :class="{'tab':true,active:index==(formdata.type-1)}" @click="tabfun(index)"
					v-for="(tab,index) in tabs" :key="index">
					{{tab.title}}
					<text class="text"></text>
				</view>
			</view>
		</u-sticky>
		<view v-if="!!(formdata.type-1)">
			<view class="ul" v-for="(item,time) in list" :key="item.schoolid" v-if="item">
				<view class="time">{{time}}</view>
				<schoolZixun :schoolZixun="item" updatetime="inputtime"></schoolZixun>
			</view>
		</view>
		<view v-else>
			<view class="ul" v-for="(item,time) in list" :key="item.schoolid"  v-if="item">
				<view class="time2">{{time}}</view>
				<schoolProfile :schoolProfile="item" schoolid="collegeid" thumb="school_logo" name="school_name"></schoolProfile>
			</view>
		</view>
	</view>
</template>

<script>
	import schoolProfile from "@/components/school-profile/school-profile.vue";
	import schoolZixun from "@/components/school-zixun/school-zixun.vue";
	export default {
		components: {
			schoolProfile,
			schoolZixun
		},
		data() {
			return {
				formdata: {
					openid: "",
					type:1,
					page: 1
					// state: 1,
					// limit: 30
				},
				loadover: false,
				tabs: [{
					title: '学校'
				}, {
					title: '资讯'
				}],
				list: {}
			}
		},
		onLoad() {
			let than = this;
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.formdata.openid = res.data;
						than.getdata()
					}
				},
				fail: err => {
					uni.showModal({
						content: '请先登录',
						showCancel: true,
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: `/pages/my/index`
								})
							}
						}
					});
					return false;
				}
			});
		},
		onShow() {},
		onPageScroll(e) {

		},
		methods: {
			getdata() {
				let data = this.formdata;
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=views",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: (res) => {
						if (res.data.status == 1) {
							if (!res.data || !res.data.data.list || res.data.data.list.length==0) {
								than.loadover = true;
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
								return false;
							}
							if(res.data.data){
								
							}
							if (than.formdata.page == 1) {
								than.list = {};
								than.list = res.data.data.list;
								than.formdata.page++
							} else if (res.data.pages == 0) {
								than.loadover = true;
								than.list = {};
								wx.showToast({
									title: `暂时没有${than.formdata.type==1?'学校':'资讯'}浏览记录`,
									icon: "none"
								})
							} else {
								this.formdata.page++
								for (let time in res.data.data.list) {
									if (res.data.data.list[time].length == 0) {
										than.loadover = true;
										wx.showToast({
											title: "数据加载完成",
											icon: "none"
										})
									} else {
										if (!(than.list[time] && than.list[time].length)) {
											than.list[time] = []
										}
										than.list[time].push(...res.data.data.list[time])
									}
								}
							}
							than.$forceUpdate()
						}
					},
					fail: () => {}
				})
			},
			tabfun(index) {
				console.log(index)
				this.formdata.type = index + 1
				this.school = [];
				this.zixun = [];
				this.formdata.page = 1;
				this.loadover = false;
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.getdata()
			},
			topage(page) {
				console.log("/")
				uni.$u.route(`/pages/${page}/index`);
			},
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (!this.loadover) {
				this.getdata()
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
		box-sizing: border-box;
		padding-bottom: 60rpx;

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

		.ul {
			&:first-of-type {
				.time {
					padding-top: 24rpx;
				}
			}

			.time {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				padding: 24rpx 0 24rpx 32rpx;

			}
			.time2 {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				padding:24rpx 0 0rpx 32rpx;
			
			}
		}


	}
</style>

<template>
	<view class="content">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view class="tabs">
				<view :class="{'tab':true,active:index==tabsIndex}" @click="tabfun(index)" v-for="(tab,index) in tabs"
					:key="index">
					{{tab.title}}
					<text class="text"></text>
				</view>
			</view>
		</u-sticky>
		<uni-popup :animation="false" ref="popup123" type="bottom" @change="change2" @touchmove.stop.prevent="">
		</uni-popup>
		<view v-if="tabsIndex" style="margin-top: 24rpx;">
			<schoolZixun :schoolZixun="zixun" updatetime="inputtime"></schoolZixun>
		</view>
		<view v-else>
			<schoolProfile :schoolProfile="school" name="school_name" thumb="school_logo" schoolid="collegeid"></schoolProfile>
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
					page: 1
				},
				tabs: [{
					title: '学校'
				}, {
					title: '资讯'
				}],
				school: [],
				zixun: [],
				scrollview: false,
				loadover: false,
				tabsIndex: 0
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
				let url="";
				if(this.tabsIndex){
					url="https://www.ieduchina.com/api.php?op=xc&do=news_collect_list"
				}else{
					url="https://www.ieduchina.com/api.php?op=xc&do=user_gzc_list"
				}
				uni.request({
					url,
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: than.formdata,
					success(res) {
						if (res.data.status == 1) {
							if (res.data.data.count == 0) {
								let title = ""
								than.loadover = true;
								than.school = [];
								if (than.tabsIndex == 0) {
									title = "暂时没有收藏的学校"
								} else if (than.tabsIndex == 1) {
									title = "暂时没有收藏的资讯"
								}
								wx.showToast({
									title,
									icon: "none"
								})
							} else if (res.data.data.list && res.data.data.list.length == 0) {
								than.loadover = true;
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
							} else if (than.formdata.page == 1) {
								if (than.tabsIndex == 0) {
									than.school = res.data.data.list;
								} else if (than.tabsIndex == 1) {
									than.zixun = res.data.data.list;
								}
								than.formdata.page += 1;
							} else {
								if (than.tabsIndex == 0) {
									than.school.push(...res.data.data.list);
								} else if (than.tabsIndex == 1) {
									than.zixun.push(...res.data.data.list);
								}
								than.formdata.page += 1;
							}
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			tabfun(index) {
				this.tabsIndex = index
				this.formdata.page = 1;
				this.loadover = true;
				this.getList()
			},
			change2(e) {
				console.log(e)
				if (!e.show) {
					this.scrollview = false
				}
			},
			setColor(color) {
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: color
				})
			},
			upper: function(e) {
				console.log(e)
			},
			lower: function(e) {
				console.log(e)
			},
			scroll: function(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			}
		},
		onReachBottom() {
			this.getList()
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

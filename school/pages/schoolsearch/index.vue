<template>
	<view class="content">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view class="search">
				<u-search height="64" actionText="搜索" animation=true placeholder="搜索升学择校等内容" bgColor="#F3F3F7"
					searchIconSize=46 placeholderColor="#999999" clearabled="false" v-model="title" @input="getDate"
					@search="getDate"></u-search>
			</view>
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
			<block v-if="zixun.length">
				<schoolZixun :schoolZixun="zixun"></schoolZixun>
			</block>
			<block v-else>
				<u-empty
				icon="http://cdn.uviewui.com/uview/empty/car.png"
				>
				</u-empty>
			</block>
		</view>
		<view v-else>
			<block v-if="school.length">
				<schoolProfile :schoolProfile="school"></schoolProfile>
			</block>
			<block v-else>
				<u-empty
				icon="http://cdn.uviewui.com/uview/empty/car.png"
				>
				</u-empty>
			</block>
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
				tabs: [{
					title: '学校'
				}, {
					title: '资讯'
				}],
				tabsIndex: 0,
				title: '',
				school: [],
				zixun: [],
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				scrollview: false,
				formdata: {
					state: 1,
					page: 1,
					limit: 10
				}
			}
		},
		onLoad(option) {
			if (option.title) {
				this.title = option.title;
				this.getDate()
			}
		},
		onShow() {},
		onPageScroll(e) {

		},
		methods: {
			getDate() {
				let than = this;
				let data = this.formdata;
				data.title = this.title;
				if (!data.title) {
					return false;
				}
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=search",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: (res) => {
						if (res.data.code == 200) {
							if (than.formdata.state == 1) {
								than.school = res.data.data
							} else {
								than.zixun = res.data.data
							}
						}
					},
					fail: () => {}
				})
			},
			tabfun(index) {
				this.tabsIndex = index
				this.formdata.state = index + 1
				this.getDate()
			},
			topage(page) {
				uni.$u.route(`/pages/${page}/index`);
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
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			console.log("加载更多")
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

		.search {
			height: 88rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12rpx 32rpx;
			background-color: rgba(255, 255, 255, 1);
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

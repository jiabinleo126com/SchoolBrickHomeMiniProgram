<template>
	<view class="container">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view class="head">
				<view @click="changeTab(1)" :class="{active:!!tabIndex}">最新资讯</view>
			</view>
			<view class="top-search">
				<u-search height="64" bgColor="#F3F3F7" searchIconSize=46 placeholderColor="#999999"
					:placeholder="placeholder" @search="search" @custom="search" v-model="keyword" @clear="clear"
					:clearabled="true">
				</u-search>
			</view>
		</u-sticky>
		<view class="tab2" v-if="tabIndex">
			<view class="more" v-if="htList.length">
				<view class="left" @click="topage(0)">查看更多</view>
				<view class="right">
					<view class="uni-margin-wrap">
						<swiper class="swiper" :display-multiple-items="topicleng" duration="200" acceleration="true">
							<swiper-item v-for="(item,index) in htList" :key="index">
								<view class="swiper-item" @click="topage(item.keywords.keyword)">
									<view class="item-con">
										<view class="name"># {{item.keywords.keyword}}</view>
										<view class="num">{{item.num}}条内容</view>
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<view class="list">
				<schoolZixun :schoolZixun="zixun" newsid="id"></schoolZixun>
			</view>
		</view>
	</view>
</template>

<script>
	import schoolZixun from "@/components/school-zixun/school-zixun.vue";
	export default {
		components: {
			schoolZixun
		},
		data() {
			return {
				tabIndex: 1,
				loading: true,
				topicleng: 0,
				keyword: "",
				htList: [],
				zixun: [],
				formdata: {
					page: 1,
					keyword: ""
				},
				formdata1: {
					page: 1
				},
				list1: [],
				placeholder: "搜索关键字",
			}
		},
		onLoad() {
			this.getht();
			if (getApp().globalData.tabIndex) {
				getApp().globalData.tabIndex = 0;
				if(getApp().globalData.keywords){
					this.keyword = this.formdata.keyword = getApp().globalData.keywords|| "";
				}
				this.tabIndex = 1;
				this.formdata.page = 1
				this.placeholder = "搜索资讯关键字";
				this.getList();
			} else {
				this.getDate();
			}
		},
		onShow() {
			if (getApp().globalData.tabIndex) {
				getApp().globalData.tabIndex = 0;
				if (getApp().globalData.keywords) {
					this.keyword = this.formdata.keyword = getApp().globalData.keywords || "";
				}
				this.tabIndex = 1;
				this.placeholder = "搜索资讯关键字";
				this.formdata.page = 1
			}
				this.getList();
		},
		methods: {
			// 切换tab
			changeTab(num) {
				this.tabIndex = num;
				this.list1 = [];
				this.keyword = "";
				this.formdata.keyword = "";
				if (num) {
					this.formdata.page = 1;
					this.placeholder = "搜索资讯关键字"
					this.getList()
				} else {
					this.formdata1.page = 1;
					this.placeholder = "搜索关键字"
					this.getDate();
				}
			},
			clear() {
				if (this.tabIndex) {
					this.formdata.page = 1
					this.zixun = [];
					this.formdata.keyword = ""
					this.getList()
				} else {
					this.page = 1;
					this.list1 = [];
					this.formdata1.keyword = ""
					this.getDate(value)
				}
			},
			getDate() {
				uni.showToast({
					title: "加载中...",
					icon: "loading"
				})
				let than = this;
				let keyword = "";
				if (this.keyword) {
					keyword = this.keyword
				}
				let page = this.formdata1.page;
				let data = {
					keyword,
					page
				}
			},
			// 资讯列表
			getht() {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=news_more",
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						page: 1
					},
					success(res) {
						if (res.data.status == 1) {
							than.htList = res.data.data;
							if (res.data.data.length > 3) {
								than.topicleng = 3
							} else {
								than.topicleng = res.data.data.length
							}
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			getList() {
				if (this.formdata.page == 1) {
					uni.showToast({
						title: "加载中...",
						icon: "loading"
					})
				}
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=news_list",
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: than.formdata,
					success(res) {
						if (res.data.status == 1) {
							if (res.data.data.count == 0) {
								than.zixun = [];
								wx.showToast({
									title: "暂时没有资讯",
									icon: "none"
								})
							} else if (res.data.data.list.length == 0) {
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
							} else if (than.formdata.page == 1) {
								than.zixun = [];
								for (let i = 0; i < res.data.data.list.length; i++) {
									than.zixun.push(res.data.data.list[i])
								}
								than.formdata.page++
								uni.hideToast()
							} else {
								than.zixun.push(...res.data.data.list);
								than.formdata.page++
								uni.hideToast()
							}
						} else if (than.formdata.page != 1) {
							wx.showToast({
								title: "数据加载完成",
								icon: "none"
							})
						} else {
							than.zixun = [];
							wx.showToast({
								title: "暂时没有符合条件的资讯",
								icon: "none"
							})
						}
					},
					fail(err) {
						console.log(err)
					},
					complete() {

					}
				})
			},
			search(value) {
				if (this.tabIndex) {
					this.formdata.page = 1
					this.zixun = [];
					this.formdata.keyword = value
					this.getList()
				} else {
					this.formdata1.page = 1
					this.list1 = [];
					this.formdata1.keyword = value
					this.getDate()
				}
			},
			topage(keyword) {
				if (keyword) {
					this.placeholder = "搜索资讯关键字";
					this.keyword = this.formdata.keyword = keyword
					this.formdata.page = 1;
					this.getList()
				} else {
					uni.$u.route(`/info/pages/topic/index`)
				}
			},
			setKeyWord(topics) {
				this.formdata.keyword = this.keyword = topics;
				this.formdata.page = 1;
				this.zixun = [];
				this.getList()
			}
		},
		onReachBottom() {
			if (this.tabIndex == 0) {
				this.getDate()
			} else {
				this.getList()
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: rgba(243, 243, 247, 1);
		min-height: calc(100vh - 50rpx);

		.head {
			width: 100%;
			padding: 0 32rpx;
			box-sizing: border-box;
			height: 88rpx;
			background: #FFFFFF;
			display: flex;

			view {
				text-align: center;
				flex: 1;
				line-height: 74rpx;
				padding: 0 48rpx 0 40rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #666666;

				&.active {
					font-size: 34rpx;
					font-weight: 500;
					color: #000000;
					position: relative;

					&::after {
						position: absolute;
						content: "";
						width: 64rpx;
						height: 6rpx;
						bottom: 18rpx;
						left: 50%;
						transform: translateX(-50%);
						background: #3A68FB;
						border-radius: 3rpx;
					}
				}
			}
		}

		.top-search {
			padding: 12rpx 32rpx;
			background-color: white;
			height: 64rpx;
		}

		.tab1 {
			padding: 0 30rpx;
			background-color: white;
			min-height: calc(100vh - 60rpx);

			.item {
				.title {
					text-align: justify;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
					line-height: 34rpx;
					margin: 4rpx 0 10rpx;
				}

				.tools {
					display: flex;
					width: 80%;

					.num {
						flex: 1;
						font-size: 24rpx;
						font-weight: 400;
						color: #666666;

						view {
							display: inline-block;
							width: 20rpx;
							height: 20rpx;
							background-position: center;
							background-repeat: no-repeat;
							background-size: contain;
							margin-right: 10rpx;

							&.view {
								background-image: url("../../static/运行 (1)@2x.png");
							}

							&.zan {
								background-image: url("../../static/运行 (1)@2x.png");
							}
						}

						image {
							width: 20rpx;
							height: 20rpx;
							margin-right: 10rpx;
						}
					}
				}
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 0 32rpx 32rpx;

			.left {
				width: 88rpx;
				height: 112rpx;
				background: linear-gradient(315deg, rgba(48, 96, 251, 0.9) 0%, rgba(48, 96, 251, 0.5) 100%);
				border-radius: 8rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFFFF;
				box-sizing: border-box;
				padding: 22rpx 20rpx;
			}

			.right {
				height: 112rpx;
				width: 600rpx;

				.uni-margin-wrap {
					width: 100%;
					height: 112rpx;
					border-radius: 8rpx;

					.swiper {
						height: 112rpx;

						.swiper-item {
							height: 112rpx;
							width: 100%;

							.item-con {
								background-color: chartreuse;
								background-color: white;
								border-radius: 8rpx;
								margin-right: 16rpx;
								height: 112rpx;
								padding-left: 20rpx;
								box-sizing: border-box;

								.name {
									font-size: 24rpx;
									font-weight: 400;
									color: #333333;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
									padding-top: 22rpx;
								}

								.num {
									font-size: 20rpx;
									font-weight: 400;
									color: #999999;
									padding-top: 10rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>

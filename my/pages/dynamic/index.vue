<template>
	<view class="content">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view class="tabs" v-if="tabs.length">
				<view :class="{'tab':true,active:index==tabsIndex}" @click="tabfun(index)" v-for="(tab,index) in tabs"
					:key="index">
					{{tab.title}}
					<text class="text"></text>
				</view>
			</view>
		</u-sticky>
		<uni-popup :animation="false" ref="popup123" type="bottom" @change="change2" @touchmove.stop.prevent="">
		</uni-popup>
		<view class="list">
			<view v-if="tabsIndex==0">
				<view v-for="(item,index) in list" class="li" :key="index" @click="topage(item.newsid)">
					<view class="usermsg">
						<image class="portrait" :src="item.user_thumb" mode="aspectFill"></image>
						<view class="msg">
							<view class="name">{{item.user_name}}</view>
							<view class="time">{{item.addtime}}</view>
						</view>
					</view>
					<view class="behavior">
						<!-- <text v-if="item.wz.pl">赞了我的评论</text> -->
						<!-- <text v-else-if="item.behavior=='dz'">赞了我的文章</text> -->
						<text>赞了</text>
					</view>
					<view class="wrap">
						<view v-if="item.wz" class="pl">
							<text class="form">{{item.form}}:</text>
							<text class="con">{{item.wz.pl}}</text>
						</view>
						<view class="wz">
							<image class="img" v-if="item.thumb" :src="item.thumb" mode="aspectFill"></image>
							<view class="right">
								<view class="title">{{item.title}}</view>
								<view class="b">
									<text>{{item.views}}人阅读</text>
									<text>{{item.inputtime}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else>
				<view v-for="(item,index) in list" class="li" :key="index">
					<view class="usermsg">
						<image class="portrait" :src="item.portrait" mode="aspectFill"></image>
						<view class="msg">
							<view class="name">{{item.user}}</view>
							<view class="time">{{item.time}}</view>
						</view>
					</view>
					<view class="behavior">
						<text v-if="item.behavior=='pl'">{{item.pl}}</text>
						<text v-else-if="item.behavior=='hf'">
							<text>回复</text>
							<text class="form">{{item.form}}:</text>
							<text class="con">{{item.pl}}</text>
						</text>
					</view>
					<view class="wrap">
						<view v-if="item.behavior=='hf'" class="pl">
							<text class="form">{{item.form}}:</text>
							<text class="con">{{item.wz.pl}}</text>
						</view>
						<view class="wz">
							<image class="img" v-if="item.wz.thumb" :src="item.wz.thumb" mode="aspectFill"></image>
							<view class="right">
								<view class="title">{{item.wz.title}}</view>
								<view class="b">
									<text>{{item.wz.read}}人阅读</text>
									<text>{{item.wz.time}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [
				// {
				// 	title: '赞'
				// }
				// , {
				// 	title: '评论'
				// },
				],
				tabsIndex: 0,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				scrollview: false,
				formdata: {
					openid: "",
					page: 1
				},
				loadover: false,
				list:[]
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
			getdata() {
				let than = this;
				let data = this.formdata;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=user_news_zans",
					method: "GET",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success(res) {
						if (res.data.status == 1) {
							if(res.data.pages == 0){
								than.loadover = true;
								than.list = [];
								wx.showToast({title:"暂时没有符合条件的数据",icon:"none"})
							}else if(!res.data.data || res.data.data.list.length == 0){
								than.loadover = true;
								wx.showToast({title:"数据加载完成",icon:"none"})
							}else if (than.formdata.page == 1) {
								than.list = res.data.data.list;
							} else {
								than.list.push(...res.data.data.list);
							}
						}
					},
					error(res) {
						console.log(res)
					}
				})
			},
			// tabfun(index) {
				// this.tabsIndex = index
				// if (index) {
				// 	this.formdata.do = 'usercomment'
				// } else {
				// 	this.formdata.do = 'userzan'
				// }
				// this.getdata()
			// },
			topage(newsid) {
				uni.$u.route(`/info/pages/detail/index?id=${newsid}`);
			},
			change2(e) {
				console.log(e)
				if (!e.show) {
					this.scrollview = false
				}
			},
			scroll: function(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (!this.loadover) {
				this.formdata.page++
				this.getdata()
			}
		},
	}
</script>

<style lang="scss" scoped>
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

		.list {
			padding-top: 24rpx;

			.li {
				background-color: white;
				padding: 24rpx;
				box-sizing: border-box;
				margin: 24rpx 32rpx 0;
				border-radius: 16rpx;

				&:first-of-type {
					margin-top: 0;
				}

				.usermsg {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.portrait {
						width: 84rpx;
						height: 84rpx;
						border-radius: 50%;
						margin-right: 16rpx;
					}

					.msg {
						flex: 1;

						.name {
							font-size: 28rpx;
							font-weight: 400;
							color: #333333;
							padding-bottom: 18rpx;
						}

						.time {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
						}
					}
				}

				.behavior {
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
					padding: 32rpx 0 24rpx;

					.form {
						color: #3060FB;
						padding-right: 10rpx;
					}

					.con {
						flex: 1;
					}
				}

				.wrap {
					background-color: #F3F3F7;
					border-radius: 16rpx;
					padding: 16rpx;

					.pl {
						font-size: 28rpx;
						font-weight: 400;
						color: #333333;
						line-height: 44rpx;
						display: flex;
						justify-content: space-between;

						.form {
							color: #3060FB;
							padding-right: 10rpx;
						}

						.con {
							flex: 1;
						}
					}

					.wz {
						background: #FFFFFF;
						border-radius: 16rpx;
						padding: 20rpx;
						box-sizing: border-box;
						position: relative;
						display: flex;
						justify-content: space-between;

						.img {
							width: 160rpx;
							height: 160rpx;
							border-radius: 16rpx;
							margin-right: 16rpx;
						}

						.right {
							flex: 1;

							.title {
								height: 80rpx;
								font-size: 28rpx;
								font-weight: 500;
								color: #333333;
								line-height: 40rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
							}

							.b {
								padding-top: 50rpx;
								font-size: 24rpx;
								font-weight: 400;
								color: #999999;
								display: flex;
								justify-content: space-between;
							}
						}
					}
				}
			}
		}
	}
</style>

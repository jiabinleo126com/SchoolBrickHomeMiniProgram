<template>
	<view class="container">
		<view class="list">
			<view class="li" v-for="(item,index) in list" :key="index" @click="topage(item.keyword)">
				<view class="line"></view>
				<view class="title">
					<text class="blue">#</text>{{item.keyword}}
				</view>
				<view class="num">{{item.num}}条内容</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				formdata: {
					page: 1
				},
				loadover: false
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			topage(topics) {
				if (topics) {
					let pages = getCurrentPages();
					let prevPage = pages[pages.length - 2];
					prevPage.$vm.setKeyWord(topics);
					uni.navigateBack({
						delta: 1
					})
					return false;
				}
			},
			getList() {
				let than = this;
				if (than.formdata.page == 1) {
					uni.showToast({
						title: "加载中...",
						icon: "loading"
					})
				}
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=news_keywords",
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: than.formdata,
					success(res) {
						if (res.data.status == 1) {
							if (res.data.pages == 0) {
								than.loadover = true;
								than.list = [];
								wx.showToast({
									title: "暂时没有符合条件的话题",
									icon: "none"
								})
							} else if (res.data.data.length == 0) {
								than.loadover = true;
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
							} else if (than.formdata.page == 1) {
								than.list = res.data.data.list;
							} else {
								than.list.push(...res.data.data.list);
							}
						}
					},
					fail(err) {
						console.log(err)
					},
					complete() {
						uni.hideToast()
					}
				})
			},
		},
		onReachBottom() {
			if (!this.loadover) {
				this.formdata.page++
				this.getList()
			}
		},
	}
</script>

<style lang="scss">
	.container {
		background-color: rgba(243, 243, 247, 1);
		padding-bottom: 50rpx;
		padding-top: 24rpx;
		box-sizing: border-box;
		min-height: 100vh;

		.list {
			.li {
				position: relative;
				width: 686rpx;
				height: 120rpx;
				background: #FFFFFF;
				border-radius: 16rpx;
				margin: 24rpx auto;
				color: #999999;
				font-weight: 400;
				padding: 24rpx 44rpx;
				font-size: 24rpx;
				box-sizing: border-box;
				overflow: hidden;

				&:first-of-type {
					margin-top: 0;
				}

				.line {
					position: absolute;
					width: 12rpx;
					background-color: #3060FB;
					top: 0;
					bottom: 0;
					left: 0;
				}

				.title {
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;

					.blue {
						color: #3060FB;
						padding-right: 10rpx;
						font-weight: bolder;
					}
				}

				.num {
					padding-top: 6rpx;
				}
			}
		}
	}
</style>

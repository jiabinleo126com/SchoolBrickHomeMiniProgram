<template>
	<view class="container">
		<u-sticky offset-top="0">
			<view class="tabs" v-if="tabs.length">
				<view :class="{'tab':true,active:index==tabsIndex}" @click="tabfun(tab,index)"
					v-for="(tab,index) in tabs" :key="index">
					{{tab}}
					<text class="text"></text>
				</view>
			</view>
		</u-sticky>
		<view class="album">
			<image class="img" lazy-load @click="preview(item)" :src="item" mode="aspectFill"
				v-for="(item,index) in images" :key="index"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [],
				tabsIndex: 0,
				images: [],
				formData: {
					page: 1,
					limit: 14
				},
				loadover: false
			};
		},
		onLoad(option) {
			this.formData.schoolid = option.schoolid
			this.getList()
		},
		onReachBottom() {
			if (!this.loadover) {
				this.formData.page++
				this.getList()
			}
		},
		methods: {
			getList() {
				let data = this.formData;
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=album_list",
					method: "GET",
					data,
					success(res) {
						if (res.data.status == 1) {
							if(res.data.data.typeConfig && typeof res.data.data.typeConfig == 'object' ){
								than.tabs = res.data.data.typeConfig
							}
							let images = res.data.data.list
							if (res.data.data.count == 0) {
								than.loadover = true;
								than.images = [];
								wx.showToast({
									title: "暂无照片",
									icon: "none"
								})
							} else if (res.data.data.list.length == 0) {
								than.loadover = true;
								wx.showToast({
									title: "照片加载完毕",
									icon: "none"
								})
							} else if (data.page == 1) {
								than.tabs.unshift("全部")
								than.images = [];
								for (let i = 0; i < images.length; i++) {
									than.images.push(images[i].thumb)
								}
							} else {
								for (let i = 0; i < images.length; i++) {
									than.images.push(images[i].thumb)
								}
							}
						} else {
							wx.showToast({
								title: "暂无照片",
								icon: "none"
							})
						}
					},
					error(res) {
						console.log(res)
					},
					complete(response) {}
				})
			},
			tabfun(tab, index) {
				this.tabsIndex = index;
				// this.formData.type = this.tabs[index]
				this.formData.page = 1
				if (tab == "全部") {
					tab = ""
				}
				this.formData.type = tab
				this.images = [];
				this.getList()
			},
			preview(url) {
				let _this = this;
				wx.previewImage({
					current: url,
					urls: _this.images
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F3F3F7;
		min-height: 100vh;
		padding-bottom: 30rpx;
		box-sizing: border-box;

		.tabs {
			background-color: white;
			height: 88rpx;
			padding: 0 32rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			overflow-x: auto;

			.tab {
				text-align: center;
				position: relative;
				display: inline-block;
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				white-space: nowrap;
				padding: 0 10rpx;

				&.active {
					color: #3060FB;

					.text {
						background-color: #3060FB;
					}
				}

				.text {
					position: absolute;
					bottom: -20rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 8rpx;
					border-radius: 4rpx;
				}
			}
		}

		.album {
			width: 686rpx;
			margin: 0 auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding-bottom: 100rpx;

			.img {
				margin-top: 24rpx;
				width: 332rpx;
				height: 220rpx;
				border-radius: 16rpx;
			}
		}
	}
</style>

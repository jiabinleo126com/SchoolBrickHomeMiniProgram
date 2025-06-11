<template>
	<view class="container">
		<view class="top-search">
			<u-search height="64" bgColor="#F3F3F7" searchIconSize=46 placeholderColor="#999999" placeholder="搜索升学择校等内容" actionText="搜索" @input="searchChange" @search="topage" @custom="topage">
			</u-search>
		</view>
		<view class="history" v-if="history.length && !list.length">
			<view class="title">历史搜索</view>
			<view class="ul">
				<view v-for="(item,index) in history" @click="topage(item)" class="li" :key="index">{{item}}</view>
			</view>
		</view>
		<view class="history" v-if="hotsearch.length && !list.length">
			<view class="title">热门搜索</view>
			<view class="ul">
				<view v-for="(item,index) in hotsearch" class="li" @click="topage(item.school_name)" :key="index">{{item.school_name}}</view>
			</view>
		</view>
		<view class="list">
			<view v-for="(item,index) in list"  @click="topage(item)" class="li">{{item}}</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				history: [],
				hotsearch: [],
				list: []
			}
		},
		onLoad() {
			let than = this;
			uni.getStorage({
				key: 'history',
				success: res => {
					if (res.data) {
						than.history = res.data;
					}
				},
				fail: err => {}
			});
			this.getpopular()
		},
		methods: {
			getpopular(){
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=popular",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if(res.data.code == 200){
							than.hotsearch = res.data.data
						}
					},
					fail: () => {}
				})
			},
			topage(value) {
				let than = this;
				if (!value) {
					uni.showToast({
						title: "请输入搜索关键字",
						icon: "none"
					})
					return false;
				}
				setTimeout(()=>{
					if(value){
						than.history.unshift(value);
						if(than.history.length>6){
							than.history.length = 6;
						}
						uni.setStorage({
							key: 'history',
							data: than.history,
							success: r => {
							}
						});
					}
				},2000)
				uni.$u.route(`/school/pages/schoolsearch/index?title=${value}`);
			},
			searchChange(val) {
				if (val) {
					this.getDate(val)
				} else {
					this.list = []
				}
			},
			getDate(value){
				let data = {
					state:"",
					title:value,
					page:1,
					limit:10
				}
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=search",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: (res) => {
						if(res.data.code == 200){
							than.list = res.data.data
						}
					},
					fail: () => {}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 32rpx
	}

	.history {
		.title {
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
		}

		.ul {
			.li {
				display: inline-block;
				padding: 0 24rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: #F3F3F7;
				border-radius: 30rpx;
				margin: 0 24rpx 24rpx 0;
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
			}
		}
	}

	.list {
		.li {
			height: 92rpx;
			line-height: 90rpx;
			background-color: white;
			border-bottom: 2rpx solid #EEEEEE;
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
		}
	}
</style>

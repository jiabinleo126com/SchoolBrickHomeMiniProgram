<template>
	<view class="container">
		<view class="topic">
			<image class="bg" src="@/static/蒙版组 18@2x.png" mode="aspectFill"></image>
			<view class="title">{{topic.topics}}</view>
			<view class="subtitle">{{topic.title||""}}</view>
			<view class="num">{{topic.topcount}}条内容</view>
		</view>
		<view class="list">
			<schoolZixun :schoolZixun="zixun"></schoolZixun>
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
				zixun: [],
				topic:{},
				formdata:{
					page:1,
					limit:10,
					topic:""
				},
				loadover:false
			}
		},
		onLoad(option) {
			this.formdata.topic = option.topic
			this.getList()
		},
		onReachBottom() {
			if(!this.loadover){
				this.formdata.page++
				this.getList()
			}
		},
		methods: {
			getList(){
				let than = this;
				uni.request({
					url:"https://www.ieduchina.com/api.php?op=xc&do=articlesindex",
					method:"GET",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: than.formdata,
					success(res) {
						if (res.data.code == 200) {
							than.topic = res.data.data[0].tops
							if(res.data.pages == 0){
								than.loadover = true;
								than.zixun = [];
								wx.showToast({title:"暂时没有资讯",icon:"none"})
							}else if(res.data.data.length == 0){
								than.loadover = true;
								wx.showToast({title:"数据加载完成",icon:"none"})
							}else if (than.formdata.page == 1) {
								than.zixun = res.data.data[0].news;
							} else {
								than.zixun.push(...res.data.data[0].news);
							}
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: rgba(243, 243, 247, 1);
		padding-bottom: 50rpx;
		padding-top: 24rpx;
		min-height: calc(100vh - 74rpx)	;
		.topic {
			position: relative;
			width: 686rpx;
			height: 220rpx;
			margin: 0 32rpx 24rpx;
			border-radius: 16rpx;
			color: #FFFFFF;
			font-weight: 400;
			padding: 24rpx;
			box-sizing: border-box;

			.title {
				position: inherit;
				z-index: 10;
				font-size: 36rpx;
				font-weight: 500;
			}

			.subtitle {
				position: inherit;
				z-index: 10;
				font-size: 24rpx;
				padding-top: 14rpx;
				height: 74rpx;
				line-height: 34rpx;

			}

			.num {
				position: inherit;
				z-index: 10;
				font-size: 24rpx;
			}

			.bg {
				width: 686rpx;
				height: 220rpx;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 0;
			}
		}
	}
</style>

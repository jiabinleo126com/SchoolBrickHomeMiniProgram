<template>
	<view class="list">
		<view v-for="(item,index) in schoolZixun" class="li" :key="index" @click="topage(item[newsid])">
			<image class="img" v-if="item['thumb']" :src="item['thumb']" mode="aspectFill"></image>
			<view class="right">
				<view class="title">{{item['title']}}</view>
				<view class="b">
					<text v-if="item['public_name']">{{item['public_name']}}</text>
					<text v-else>{{item['views']}}人阅读</text>
					<text>{{item[updatetime]}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "school-zixun",
		props: {
			schoolZixun: {
				type: Array,
				default: () => []
			},
			updatetime: {
				type: String,
				default: () => "updatetime"
			},
			newsid:{
				type:String,
				default: () => "newsid"
			}
		},
		data() {
			return {};
		},
		methods: {
			topage(id) {
				uni.$u.route(`/info/pages/detail/index?id=${id}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		.li {
			width: 686rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			padding: 24rpx;
			margin: 24rpx auto;
			box-sizing: border-box;
			position: relative;
			display: flex;
			justify-content: space-between;

			&:first-of-type {
				margin-top: 0;
			}

			.img {
				width: 160rpx;
				height: 160rpx;
				border-radius: 8rpx;
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
					text{
						&:first-of-type{
							display: inline-block;
							width: calc(100% - 144rpx);
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
					}
				}
			}
		}
	}
</style>

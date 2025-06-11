<template>
	<view class="list">
		<view v-for="(item,index) in schoolHuodong" class="li" :key="index" @click="topage(item[activityid],false)">
			<view class="titles" v-if="item[title]">{{item[title]}}</view>
			<view class="con">
				<image class="image" :src="item[image]" mode="aspectFill"></image>
				<view class="center">
					<view class="title">{{item[name]}}</view>
					<view class="labes" v-if="item['label_name']['length']">
						<view class="lab" v-for="(lab,i) in item['label_name']" :key="i">
							{{lab}}
						</view>
					</view>
					<view class="price">
						{{item['join_form']}}
					</view>
				</view>
				<div class="right">
					<button class="btn" @click.stop="topage(item[activityid],item.apply)">预约</button>
				</div>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "school-huodong",
		props: {
			schoolHuodong: {
				type: Array,
				default: () => []
			},
			image: {
				type: String,
				default: () => "logo"
			},
			title: {
				type: String,
				default: () => "title"
			},
			name: {
				type: String,
				default: () => "title"
			},
			activityid: {
				type: String,
				default: () => "activityid"
			}
		},
		data() {
			return {
				id: null
			};
		},
		methods: {
			topage(id, flag) {
				let isTrue = !!(flag == "1");
				if (isTrue) {
					this.$parent.showMask(id)
				} else {
					uni.$u.route(`/huodong/pages/detail/index?activityid=${id}`);
				}
			},
			strSplit(str) {
				return str.split(",")
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
			padding: 0 24rpx;
			margin: 24rpx auto;
			box-sizing: border-box;

			&:first-of-type {
				margin-top: 0;
			}

			.titles {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				border-bottom: solid 2rpx #EEEEEE;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.con {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx 0;

				.image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 8rpx;
					margin-right: 16rpx;
				}

				.center {
					width: 360rpx;

					.title {
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.labes {
						padding: 15rpx 0;
						display: flex;
						flex-wrap: nowrap;
						overflow: hidden;

						.lab {
							margin-right: 8rpx;
							font-size: 20rpx;
							font-weight: 400;
							color: #2C75F3;
							height: 36rpx;
							line-height: 36rpx;
							padding: 0 8rpx;
							background-color: rgba(44, 117, 243, .1);
							border-radius: 8rpx;
							white-space: nowrap;
						}
					}

					.price {
						font-size: 28rpx;
						font-weight: 500;
						color: #FF3030;
					}
				}

				.right {
					.btn {
						height: 52rpx;
						line-height: 52rpx;
						background: #3060FB;
						border-radius: 32rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>

<template>
	<view class="school">
		<view :class="{'li':true,top:firstTop,c:item.status=='已过期'}" v-for="(item,index) in huodongItem" :key="index"
			@click="topage(item[activityid],pagelink,item[ids])">
			<image class="img" lazy-load :src="item[image]" mode="aspectFill"></image>
			<view class="text">
				<view class="title">{{item[title]}}</view>
				<view class="schoolname">{{item[schoolname]}}</view>
				<view class="label">
					<text v-for="(lab,i) in item[label]" class="lab" :key="i">{{lab}}</text>
				</view>
				<view v-if="item.address">
					<view class="address">
						<image class="icon" src="@/static/组 745@2x.png" mode="aspectFit"></image>
						<text class="text">{{item.address}}</text>
					</view>
				</view>
				<view v-else-if="item[price ]">
					<view class="price">{{item[price]}}</view>
				</view>
				<view
					:class="{'status':true,'a':(item.status=='1'),'b':(item.status=='2'),'c':(item.status=='3'),'d':(item.status=='5')}">
					{{setStatus(item.status)}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "huodong-item",
		props: {
			huodongItem: {
				type: Array,
				default: () => []
			},
			pagelink: {
				type: String,
				default: () => ""
			},
			title: {
				type: String,
				default: () => "title"
			},
			price: {
				type: String,
				default: () => "price"
			},
			image: {
				type: String,
				default: () => "image"
			},
			activityid:{
				type:String,
				default:()=>"id"
			},
			schoolname:{
				type:String,
				default:()=>"schoolname"
			},
			label:{
				type:String,
				default:()=>"label"
			},
			firstTop:{
				type:Boolean,
				default:()=>false
			},
			ids:{
				type:String,
				default:()=>"id"
			}
		},
		data() {
			return {};
		},
		methods: {
			topage(activityid, page,id) {
				if (page) {
					uni.$u.route(`${page}?activityid=${activityid}&id=${id}`);
				}
			},
			setStatus(status) {
				switch (status) {
					case "5":
						return "待处理";
					case "1":
						return "确认预约";
					case "2":
						return "预约待定"
					case "3":
						return "取消预约";
					default:
						status
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.school {
		padding-bottom: 30rpx;

		.li {
			margin: 24rpx auto 0;
			width: 686rpx;
			background: #FFFFFF;
			border-radius: 16px;
			display: flex;
			justify-content: space-between;
			padding: 24rpx;
			box-sizing: border-box;
			overflow: hidden;
			&.top{
				&:first-of-type{
					margin-top: 0;
				}
			}

			&.c {
				.img {
					filter: brightness(0.7);
				}

				.text {
					.title {
						color: rgba(102, 102, 102, 1);
					}

					.schoolname {
						color: rgba(153, 153, 153, 1);
					}

					.label {
						.lab {
							background-color: rgba(102, 102, 102, .1);
							color: rgba(102, 102, 102, 1);
						}
					}

					.price {
						color: rgba(102, 102, 102, 1);
					}
				}

			}

			.img {
				width: 176rpx;
				min-width: 176rpx;
				height: 176rpx;
				border-radius: 8rpx;
				margin-right: 24rpx;
			}

			.text {
				flex: 1;
				position: relative;
				overflow: hidden;

				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					padding-right: 80rpx;
				}

				.schoolname {
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
					line-height: 28rpx;
					padding: 12rpx 12rpx 12rpx 0;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.label {
					padding-bottom: 10rpx;

					.lab {
						font-size: 20rpx;
						font-weight: 400;
						color: #2C75F3;
						height: 36rpx;
						display: inline-block;
						line-height: 36rpx;
						padding: 0 8rpx;
						border-radius: 8rpx;
						margin-right: 8rpx;
						background-color: rgba(44, 117, 243, .1);
					}
				}

				.price {
					font-size: 28rpx;
					font-weight: 500;
					color: #FF3030;
				}

				.address {
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;

					.icon {
						width: 28rpx;
						height: 28rpx;
						vertical-align: -3rpx;
					}
				}

				.status {
					position: absolute;
					right: 0;
					top: 2rpx;
					font-size: 24rpx;
					font-weight: 400;

					&.a {
						color: #00AA2D;
					}

					&.b {
						color: #3060fb;
					}

					&.c {
						color: rgba(252, 57, 57, 1);
					}
					&.d {
						color: rgba(252, 57, 57, 1);
					}
				}
			}
		}
	}
</style>

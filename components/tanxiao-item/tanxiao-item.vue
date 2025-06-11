<template>
	<view class="school">
		<view :class="{'li':true,top:firstTop,c:item.status=='已过期'}" v-for="(item,index) in tanxiaoItem" :key="index"
			@click="topage(item[schoolid],pagelink,item[ids])">
			<image class="img" lazy-load :src="item.school_logo" mode="aspectFit"></image>
			<view class="text">
				<view class="title">{{item.school_name}}</view>
				<view class="label">
					<text v-for="(lab,i) in item.label_name||[]" class="lab"
						:style="{'color':item.label_color[i],'backgroundColor':setBgColor(item.label_color[i])}"
						:key="i">{{lab}}</text>
				</view>
				<view v-if="item.school_address">
					<view class="address">
						<image class="icon" :src="src1" mode="aspectFit"></image>
						<text class="text">{{item.school_address}}</text>
					</view>
				</view>
				<view v-else-if="item.price">
					<view class="price">{{item.price}}</view>
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
			tanxiaoItem: {
				type: Array,
				default: () => []
			},
			pagelink: {
				type: String,
				default: () => ""
			},
			address: {
				type: String,
				default: () => "address"
			},
			schoolid: {
				type: String,
				default: () => "schoolid"
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
			return {
				src1:require(`@/static/组 745@2x.png`)
			};
		},
		methods: {
			topage(schoolid, page,id) {
				if (page) {
					uni.$u.route(`${page}?schoolid=${schoolid}&id=${id}`);
				}
			},
			setBgColor(web_color) {
				if (web_color && web_color.indexOf("#") != -1) {
					return "rgba(" + parseInt("0x" + web_color.slice(1, 3)) + "," + parseInt("0x" + web_color.slice(3,
						5)) + "," + parseInt("0x" + web_color.slice(5, 7)) + "," + 0.1 + ")";
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

					.label {
						.lab {
							&.a {
								background-color: rgba(153, 153, 153, .1);
								color: rgba(102, 102, 102, 1);
							}

							&.b {
								background-color: rgba(153, 153, 153, .1);
								color: rgba(102, 102, 102, 1);
							}

							&.c {
								background-color: rgba(153, 153, 153, .1);
								color: rgba(102, 102, 102, 1);
							}

							&.d {
								background-color: rgba(153, 153, 153, .1);
								color: rgba(102, 102, 102, 1);
							}
						}
					}

					.address {
						color: rgba(153, 153, 153, 1);
					}

					.status {
						color: rgba(102, 102, 102, 1);
					}
				}

			}

			.img {
				width: 140rpx;
				min-width: 140rpx;
				height: 140rpx;
				border-radius: 8rpx;
				margin-right: 24rpx;
			}

			.text {
				flex: 1;
				position: relative;

				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					padding-bottom: 10rpx;
					max-width: 400rpx;
				}

				.label {
					padding-top: 0rpx;
					display: flex;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 100%;

					.lab {
						padding: 8rpx;
						font-size: 20rpx;
						font-weight: 400;
						border-radius: 8rpx;
						margin-right: 16rpx;

						&.a {
							color: rgba(0, 170, 45, 1);
							background-color: rgba(0, 170, 45, .1);
						}

						&.b {
							color: rgba(241, 135, 14, 1);
							background-color: rgba(241, 135, 14, .1);
						}

						&.c {
							color: rgba(252, 57, 57, 1);
							background-color: rgba(252, 57, 57, .1);
						}

						&.d {
							color: rgba(44, 117, 243, 1);
							background-color: rgba(44, 117, 243, .1);
						}
					}
				}

				.address {
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
					padding-top: 10rpx;

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

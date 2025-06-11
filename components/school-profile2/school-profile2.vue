<template>
	<view :class="['school',{'isIndex':isIndex}]">
		<view class="li" @click="topage('schooldetail',school.id||school.schoolid)">
			<image class="img" :src="school.school_logo" mode="aspectFill"></image>
			<view class="text">
				<view class="title">{{school.school_name||""}}</view>
				<view class="label">
					<text v-for="(lab,i) in (school.school_label || school.school_labelid)" class="lab" :style="{'color':lab.color,'backgroundColor':setBgColor(lab.color)}" :key="i">{{lab.name}}</text>
				</view>
			</view>
			<image class="arr" src="@/static/组 176@2x.png" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "school-profile2",
		props: {
			school: {
				type: Object,
				default: () => {}
			},
			isIndex:{
				type: Boolean,
				default:()=>false
			}
		},
		data() {
			return {};
		},
		methods: {
			topage(page,schoolid) {
				uni.$u.route(`/school/pages/schooldetail/index?schoolid=${schoolid}`);
			},
			setBgColor(web_color){
				if(web_color && web_color.indexOf("#")!=-1){
					return "rgba(" + parseInt("0x" +web_color.slice(1, 3)) + "," + parseInt("0x" +  web_color.slice(3, 5)) + "," + parseInt("0x" + web_color.slice(5, 7)) + "," + 0.1 + ")";
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.school {
		padding-top: 1rpx;
		&.isIndex{
			min-height: 80vh;
		}

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
			align-items: center;

			.img {
				width: 96rpx;
				height: 96rpx;
				border-radius: 8rpx;
				margin-right: 24rpx;
			}
			.arr{
				width: 48rpx;
				height: 48rpx;
			}

			.text {
				flex: 1;
				overflow: hidden;

				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					// padding-bottom: 10rpx;
				}

				.gk {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
					padding-top: 8rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					// width: 100%;
				}

				.address {
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
					padding-top: 34rpx;

					.icon {
						width: 28rpx;
						height: 28rpx;
						vertical-align: -3rpx;
					}
				}

				.label {
					padding-top: 8rpx;
					display: flex;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 100%;

					.lab {
						padding: 4rpx 8rpx;
						font-size: 20rpx;
						font-weight: 400;
						border-radius: 8rpx;
						margin-right: 16rpx;
					}
				}
			}
		}
	}
</style>

<template>
	<view :class="['school',{'isIndex':isIndex}]">
		<view :class="['li',{top:firstTop}]" v-for="(item,index) in schoolProfile" :key="item.id"
			@click="topage('schooldetail',item[schoolid])">
			<image class="img" :src="item[thumb]" mode="aspectFit"></image>
			<view class="text">
				<view class="title">{{item[name]||""}}</view>
				<view class="label">
					<text v-for="(lab,i) in (item.label_name||[])" class="lab"
						:style="{'color':item.label_color[i],'backgroundColor':setBgColor(item.label_color[i])}"
						:key="i">{{lab}}</text>
				</view>
				<view v-if="item.address">
					<view class="address">
						<image class="icon" src="@/static/组 745@2x.png" mode="aspectFit"></image>
						<text class="text">{{item.address}}</text>
					</view>
				</view>
				<view v-else-if="item[grade_name] || item[kechen_name]">
					<view v-if="item[grade_name]" class="gk">开设年级：{{item[grade_name]}}</view>
					<view v-if="item[kechen_name]" class="gk">课程：{{item[kechen_name]}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "school-profile",
		props: {
			thumb: {
				type: String,
				default: () => 'thumb'
			},
			schoolProfile: {
				type: Array,
				default: () => []
			},
			isIndex: {
				type: Boolean,
				default: () => false
			},
			firstTop: {
				type: Boolean,
				default: () => false
			},
			schoolid: {
				type: String,
				default: () => "id"
			},
			grade_name: {
				type: String,
				default: () => "grade_name"
			},
			kechen_name: {
				type: String,
				default: () => "kechen_name"
			},
			name: {
				type: String,
				default: () => "name"
			}
		},
		data() {
			return {};
		},
		methods: {
			topage(page, schoolid) {
				uni.$u.route(`/school/pages/schooldetail/index?schoolid=${schoolid}`);
			},
			setBgColor(web_color) {
				if (web_color && web_color.indexOf("#") != -1) {
					return "rgba(" + parseInt("0x" + web_color.slice(1, 3)) + "," + parseInt("0x" + web_color.slice(3,
						5)) + "," + parseInt("0x" + web_color.slice(5, 7)) + "," + 0.1 + ")";
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.school {
		padding-bottom: 30rpx;

		&.isIndex {
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

			&.top {
				&:first-of-type {
					margin-top: 0;
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
					// overflow: hidden;
					// text-overflow: ellipsis;
					width: 100%;
					overflow-x: auto;

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

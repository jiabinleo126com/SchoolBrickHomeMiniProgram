<template>
	<view class="container">
		<schoolProfile :schoolProfile="[school]" name="title"></schoolProfile>
		<view class="block">
			<view class="title"><text class="line"></text>学校简介</view>
			<view class="text">{{school['description']}}</view>
		</view>

		<view class="block">
			<view class="title"><text class="line"></text>学校信息</view>
			<view class="text">所在地区：{{school['city_name']||''}}</view>
			<view class="text">办学类型：{{school['school_type_name']||''}}</view>
			<view class="text">开设年级：{{school['grade_name']||''}}</view>
			<view class="text">所学课程：{{school['kechen_name']||''}}</view>
			<view class="text">留学国家：{{school['country_name']||''}}</view>
			<view class="text">学费区间：{{school['xuefei']||''}}</view>
			<view class="text">国籍要求：{{school['gj_name']||''}}</view>
		</view>
		<view class="block" v-if="school['college_zs']">
			<view class="title"><text class="line"></text>招生信息</view>
			<view class="title2">
				<image class="icon" src="@/static/1.png" mode="aspectFit"></image>招生对象
			</view>
			<view class="text">{{school['college_zs'][0]}}</view>
			<view class="title2">
				<image class="icon" src="@/static/2.png" mode="aspectFit"></image>招生计划
			</view>
			<view class="text">{{school['college_zs'][1]}}</view>
			<view class="title2">
				<image class="icon" src="@/static/3.png" mode="aspectFit"></image>招生时间
			</view>
			<view class="text">{{school['college_zs'][2]}}</view>
		</view>
	</view>
</template>

<script>
	import schoolProfile from "@/components/school-profile/school-profile.vue";
	export default {
		components: {
			schoolProfile
		},
		data() {
			return {
				school: {},
				profile: [{}]
			}
		},
		onLoad(option) {
			let schoolid = option.id;
			let than = this;
			uni.request({
				url: "https://www.ieduchina.com/api.php?op=xc&do=school_info",
				method: "GET",
				data: {
					schoolid
				},
				success(res) {
					if (res.data.status == 1) {
						than.school = res.data.data
					}
					console.log(res)
				},
				error(res) {
					console.log(res)
				}
			})
		},
		methods: {
			topage(id) {
				uni.$u.route(`/school/pages/schooldetail/index?schoolid=${id}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F3F3F7;
		min-height: 100vh;
		padding-bottom: 60rpx;
		box-sizing: border-box;
		padding-top: 1rpx;

		.school {
			padding: 32rpx;
			background: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;

			.img {
				width: 96rpx;
				height: 96rpx;
				border-radius: 8rpx;
				margin-right: 16rpx;
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
			}

			.right {
				.arr {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}

		.block {
			background-color: white;
			border-radius: 16rpx;
			width: 686rpx;
			margin: 24rpx auto 0;
			padding: 32rpx 24rpx;
			box-sizing: border-box;

			&:first-of-type {
				margin-top: 0;
			}

			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				padding-bottom: 28rpx;

				.line {
					display: inline-block;
					width: 8rpx;
					height: 32rpx;
					background: #3060FB;
					border-radius: 4rpx;
					margin-right: 16rpx;
					vertical-align: -4rpx;
				}
			}

			.title2 {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				padding: 40rpx 0 10rpx;

				&:nth-of-type(2) {
					padding-top: 0;
				}


				.icon {
					width: 32rpx;
					height: 32rpx;
					vertical-align: -4rpx;
					margin-right: 16rpx;
				}
			}

			.text {
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;
				padding-bottom: 4rpx;
			}
		}
	}
</style>

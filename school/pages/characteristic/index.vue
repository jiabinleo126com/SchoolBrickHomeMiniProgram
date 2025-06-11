<template>
	<view class="container">
		<schoolProfile :schoolProfile="[school]" name="title"></schoolProfile>
		<view class="card" v-for="(item,index) in features" :key="index">
			<image class="img" :src="item.thumb" mode="aspectFill"></image>
			<view class="con">
				<view class="title">{{item.title}}</view>
				<block v-if="item.content">
					<view :class="['text']">
						<!-- ,{'show':item.text.length<=70&&!item.show} -->
						{{item.content}}<text style="color: transparent;">。。。</text>
					</view>
					<!-- <template v-if="item.text.length>70">
						<view @click="show(item.show,index)" v-if="item.show" class="btn">收起</view>
						<view @click="show(item.show,index)" v-else class="btn">展开</view>
					</template> -->
				</block>
			</view>
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
				formdata:{
					state:1,
					schoolid:''
				},
				school: {},
				features: []
			};
		},
		onLoad(option) {
			console.log(option)
			let title = ""
			this.formdata.schoolid = option.schoolid;
			this.formdata.state = option.state;
			if (option.state == 1) {
				title = "学校特色"
			} else if (option.state == 2) {
				title = "课程特色"
			}
			this.getSchool()
			this.getlist()
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			getlist(){
				let data = this.formdata;
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=features_list",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: (res) => {
						if(res.data.status == 1){
							than.features = res.data.data.list
						}
					},
					fail: () => {}
				})
			},
			show(flag, index) {
				this.features[index]['show'] = !flag
				console.log(this.features)
				this.$forceUpdate();
			},
			topage(id) {
				uni.$u.route(`/school/pages/schooldetail/index?id=${id}`)
			},
			getSchool(){
				let than = this;
				let data = {
					schoolid:this.formdata.schoolid
				}
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=school_info",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: (res) => {
						if(res.data.status == 1){
							than.school = res.data.data
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
		background-color: #F3F3F7;
		min-height: 100vh;
		padding-bottom: 60rpx;
		box-sizing: border-box;
		padding-top: 1rpx;

		.card {
			width: 686rpx;
			margin: 24rpx auto 0;
			border-radius: 16rpx;
			overflow: hidden;
			background-color: white;
			padding-bottom: 32rpx;
			&:first-of-type{
				margin-top: 0;
			}

			.img {
				border-radius: 16rpx 16rpx 0 0;
				width: 100%;
				height: 396rpx;
			}

			.con {
				position: relative;

				.title {
					padding: 32rpx 24rpx 18rpx;
				}

				.text {
					font-size: 28rpx;
					font-weight: 400;
					color: #666666;
					line-height: 37rpx;
					padding: 0 26rpx;

					&.show {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
					}
				}

				.btn {
					position: absolute;
					right: 24rpx;
					bottom: -4rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #3060FB;
					padding: 7rpx;
					background-color: white;
				}
			}
		}
	}
</style>

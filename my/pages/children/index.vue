<template>
	<view class="content">
		<view v-if="childrenInfo && childrenInfo.length" class="ul">
			<view v-for="(item,index) in childrenInfo" :class="{'li':true,'active':item.state==1,'border':change}"
				:key="index" @click.stop="update(item.id,item.birthday)">
				<image v-if="change && item.state==1" class="image" :src="src1" mode="aspectFit"></image>
				<image v-else-if="item.state==1" class="defaultimage" :src="src2" mode="aspectFit">
				</image>
				<view class="left">
					<view class="top">
						<text class="name">{{item.name}}</text>
						<text v-if="item.sex=='1'" class="sex">男孩</text>
						<text v-else class="sex g">女孩</text>
					</view>
					<view class="else">年龄：{{item.birthday}}周岁</view>
					<view class="else">在读年级：{{gradeIndex[item.grade]}}</view>
				</view>
				<view class="right" @click.stop="update(item.id,null)">
					<image class="img" mode="aspectFit" :src="src3"></image>
				</view>
			</view>
		</view>
		<view v-else>
			<Null></Null>
		</view>
		<view class="btn">
			<u-button type="primary" text="添加信息" shape="circle" color="#3060FB" @click="update"></u-button>
		</view>
	</view>
</template>

<script>
	import Null from "@/components/null/null.vue";
	export default {
		components: {
			Null
		},
		data() {
			return {
				src1: require(`@/static/选中@2x.png`),
				src2: require(`@/static/选中@2x (2).png`),
				src3: require(`@/static/组 766@2x.png`),
				openid: "",
				change: false,
				childrenInfo: [],
				gradeIndex: [],
				isgetgrade:true,
				isgetdata:true,
			}
		},
		onLoad(option) {
			let than = this;
			if (option.type == "change") {
				this.change = true
			}
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.openid = res.data;
						than.getGrade();
						than.getData()
					}
				},
				fail() {
					uni.showModal({
						content: '请登录',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: `/pages/my/index`
								})
							}
						}
					});
				}
			});
		},
		onShow() {
			let than = this;
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.openid = res.data;
						than.getGrade();
						than.getData()
					}
				},
				fail() {
					uni.showModal({
						content: '请登录',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: `/pages/my/index`
								})
							}
						}
					});
				}
			});
		},
		methods: {
			update(id, birthday) {
				if (this.change && birthday != null) {
					let pages = getCurrentPages();
					let prevPage = pages[pages.length - 2];
					prevPage.$vm.setChild(id, birthday)
					uni.navigateBack({
						delta: 1
					})
					return false;
				}
				if (id) {
					uni.$u.route(`/my/pages/childrenupdate/index?id=${id}`);
				} else {
					uni.$u.route(`/my/pages/childrenupdate/index`);
				}
			},
			getData() {
				if(this.isgetdata){
					this.isgetdata = false;
					setTimeout(()=>{
						this.isgetdata = true;
					},1000)
					let {
						openid
					} = this;
					let than = this;
					uni.request({
						url: "https://www.ieduchina.com/api.php?op=xc&do=child",
						method: 'GET',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							openid
						},
						success(res) {
							if (res.data.status == 1) {
								than.childrenInfo = res.data.data
							}
						},
						fail(err) {
							console.log(err)
						}
					})
				}
			},
			getGrade() {
				if(this.isgetgrade){
					this.isgetgrade = false;
					setTimeout(()=>{
						this.isgetgrade = true;
					},1000)
					let than = this;
					uni.request({
						url: "https://www.ieduchina.com/api.php?op=xc&do=grades",
						method: 'GET',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success(res) {
							if (res.data.status == 1) {
								than.gradeIndex = res.data.data;
							}
						},
						fail(err) {
							console.log(err)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: #F3F3F7;
		min-height: 100vh;
		padding-bottom: 204rpx;
		box-sizing: border-box;

		.ul {
			padding-top: 24rpx;

			.li {
				background-color: white;
				border-radius: 16rpx;
				padding: 0 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 44rpx 24rpx;
				box-sizing: border-box;
				height: 220rpx;
				margin: 24rpx auto 0;
				width: 686rpx;

				&.active {
					position: relative;
					overflow: hidden;

					&.border {
						border: solid #2C75F3 2rpx;
					}

					.image {
						position: absolute;
						right: -1rpx;
						top: -1rpx;
						z-index: 10;
						width: 48rpx;
						height: 48rpx;
					}

					.defaultimage {
						position: absolute;
						right: -1rpx;
						top: -1rpx;
						z-index: 10;
						width: 72rpx;
						height: 36rpx;
					}
				}

				&:first-of-type {
					margin-top: 0;
				}

				.left {
					.top {
						display: flex;
						align-items: center;

						.name {
							font-size: 32rpx;
							font-weight: 500;
							color: #333333;
						}

						.sex {
							font-size: 20rpx;
							font-weight: 400;
							color: #2C75F3;
							padding: 0 18rpx;
							background: rgba(44, 117, 243, .1);
							border-radius: 8rpx;
							margin-left: 24rpx;

							&.g {
								background-color: rgba(252, 57, 57, .1);
								color: rgba(252, 57, 57, 1);
							}
						}
					}

					.else {
						font-size: 24rpx;
						font-weight: 400;
						color: #333333;
						padding-top: 24rpx;
					}
				}

				.right {
					width: 100rpx;
					height: 100rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					.img {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}

		.btn {
			position: fixed;
			bottom: 0;
			width: 100%;
			left: 0;
			box-sizing: border-box;
			padding: 16rpx 32rpx 84rpx;
			background-color: white;
		}
	}
</style>

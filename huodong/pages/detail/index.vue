<template>
	<view class="container">
		<schoolProfile v-if="getStatus(info['userid'])" :schoolProfile="[school]"></schoolProfile>
		<view :class="{block:true,m0:getStatus(info['userid'])}">
			<view class="images" v-if="[info['logo']].length">
				<u-swiper imgMode="aspectFill" height="396rpx" :list="[info['thumb']]" autoplay indicator indicatorMode="dot"
					circular>
				</u-swiper>
			</view>
			<view class="message">
				<view class="title">{{info.title}}</view>
				<view class="labels">
					<view class="left">
						<text v-for="(lab,i) in info.label_name" class="lab" :key="i">{{lab}}</text>
					</view>
					<view class="price">{{info.join_form}}</view>

				</view>
				<view class="li">
					<image class="icon" :src="img1" mode="aspectFit"></image>
					<text v-if="info.start_time && info.start_time">{{info.start_time}}  ~ {{info.end_time}}</text>
				</view>
				<view class="li">
					<image class="icon" :src="img2" mode="aspectFit"></image>
					<text>{{info.age_name}}</text>
				</view>
				<view class="address">
					<view class="left">
						<view class="text">{{(info.province_name||"")+(info.city_name||"")+(info.area_name||"")+(info.address||"")}}</view>
						<view class="text2" v-if="info.distance">距您{{info.distance}}</view>
					</view>
					<div class="center right" @click="goMap()"  v-if="info.distance">
						<image class="img" src="@/static/组 235@2x.png" mode="scaleToFill"></image>
						<view class="text">导航</view>
					</div>
					<div class="right" v-if="info['school_tel']" @click="call(info['school_tel'])">
						<image class="img" src="@/static/组 236@2x.png" mode=""></image>
						<view class="text">电话</view>
					</div>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="txt">
				<u-parse :content="info['content']"></u-parse>
			</view>
			<view v-for="(img,index) in labelArr(info['picture'])" class="imgs" :key="index">
				<image class="img" :src="img" mode="widthFix"></image>
			</view>
		</view>
		<view class="btn">
			<u-button type="primary" text="立即预约" shape="circle" color="#3060FB" @click="update"></u-button>
		</view>
		<u-modal @confirm="confirm" width="580rpx" @cancel="cancel" @close="close" :show="show" :title="title"
			showConfirmButton="true" showCancelButton="true" :confirmText="confirmText" :closeOnClickOverlay="true"
			:content='content'></u-modal>
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
				img1:require(`@/static/组 245@2x.png`),
				img2:require(`@/static/组 246@2x.png`),
				show: false,
				title: '您已预约该活动',
				content: '',
				confirmText: "查看详情",
				cancelText: "关闭",
				info: {},
				banner: [],
				ad_info:{},
				formData:{
				},
				openid:"",
				school:{}
			}
		},
		onLoad(option) {
			let than = this;
			this.formData.activityid = option.activityid
			this.share = option.share;
			this.ad_info = getApp().globalData.ad_info;
			if(option.ad_info){
				this.ad_info = JSON.parse(option.ad_info)
				this.ad_info.location = {}
			}
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.openid = res.data;
						than.getData()
						than.views_add(option.activityid,than.openid)
					}
				},
				fail:err=>{
					than.getData()
				}
			});
		},
		methods: {
			getStatus(str){
				return !!+str;
			},
			views_add(activityid,openid){
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=views_add",
					method: "POST",
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{activityid,openid},
					success(res) {
					},
					error(err) {
						console.log(err)
					}
				})
			},
			setBgColor(web_color){
				if(web_color && web_color.indexOf("#")!=-1){
					return "rgba(" + parseInt("0x" +web_color.slice(1, 3)) + "," + parseInt("0x" +  web_color.slice(3, 5)) + "," + parseInt("0x" + web_color.slice(5, 7)) + "," + 0.1 + ")";
				}
			},
			topage(schoolid) {
				uni.$u.route(`/school/pages/schooldetail/index?schoolid=${schoolid}`);
			},
			call(tel) {
				uni.makePhoneCall({
					phoneNumber: tel
				})
			},
			update() {
				if(!this.openid){
					uni.showModal({
						content: '请登录',
						showCancel: false,
						success:function(){
							uni.switchTab({
								url: `/pages/my/index`
							})
						}
					});
					return false
				}
				let isTrue = !!(this.info.apply == "1");
				if (isTrue) {
					this.show = true;
				} else {
					uni.$u.route(`/huodong/pages/form/index?activityid=${this.info.id}&schoolid=${this.info.schoolid}`);
				}
			},
			confirm() {
				this.show = false;
				uni.$u.route(`/my/pages/huodongdetail/index?activityid=${this.info.id}`);
			},
			cancel() {
				this.show = false;
			},
			close() {
				this.show = false;
			},
			getSchoolinfo(){
				// https://www.ieduchina.com/api.php?op=xc&do=school_info
				uni.request({
					url:"https://www.ieduchina.com/api.php?op=xc&do=activity_info",
					method:"POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					dataType:"json",
					data,
					success(res){
						if(res.data.status == 1){
							than.info = res.data.data;
						}else{
							uni.showToast({
								"title":"数据加载失败",
								"icon":"none"
							})
						}
					},
					error(err){
						console.log(err)
						uni.showToast({
							"title":"数据加载失败",
							"icon":"none"
						})
					},
					complete(res) {
						console.log(res)
					}
				})
			},
			// getInfo(schoolid){
				// let than = this;
				// uni.request({
				// 	url: "https://www.ieduchina.com/api.php?op=xc&do=school_info",
				// 	method: "GET",
				// 	data: {
				// 		schoolid
				// 	},
				// 	success(res) {
				// 		if (res.data.status == 1) {
				// 			than.school = res.data.data
				// 		}
				// 		console.log(res)
				// 	},
				// 	error(res) {
				// 		console.log(res)
				// 	}
				// })
			// },
			getSchoolMsg(){
				let data = this.formData
				let than = this;
				this.formData.latitude = this.ad_info.location.lat||""
				this.formData.longitude = this.ad_info.location.lng||""
				if(this.openid){
					this.formData.openid = this.openid
				}
				uni.request({
					url:"https://www.ieduchina.com/api.php?op=xc&do=activity_info",
					method:"POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					dataType:"json",
					data,
					success(res){
						if(res.data.status == 1){
							than.info = res.data.data;
							// than.getInfo(res.data.data.schoolid);
							than.school = {
								"thumb":res.data.data.school_logo,
								"imgname1":res.data.data.school_name
							}
						}else{
							uni.showToast({
								"title":"数据加载失败",
								"icon":"none"
							})
						}
					},
					error(err){
						console.log(err)
						uni.showToast({
							"title":"数据加载失败",
							"icon":"none"
						})
					},
					complete(res) {
						console.log(res)
					}
				})
			},
			labelArr(string){
				if(string){
					return string.split(",")
				}else{
					return ""
				}
			},
			formTime(time) {
				if(time){
					time = Number(time+"000");
					let date = new Date(time);
				return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
				}
			},
			goMap() {
				wx.openLocation({
					latitude: this.info.latitude,
					longitude: this.info.longitude,
					name: this.info.school_name,
					address: this.info.address,
					scale: 28
				})
			},
			getData(){
				let than = this;
				if(this.ad_info){
					if(this.share==1){
						this.ad_info.location = {};
					}
					this.getSchoolMsg()
				}else{
					uni.getSystemInfo({ // 获取系统信息
						success(res) {
							let locationEnabled = res.locationEnabled; //判断手机定位服务是否开启
							let locationAuthorized = res.locationAuthorized; //判断定位服务是否允许微信授权
							if (locationEnabled == false || locationAuthorized == false) {
								// GPS 未授权
								callBack("GPSunauthorized");
							} else {
								// GPS 已授权 判断微信定位是否授权
								uni.authorize({
									scope: 'scope.userLocation',
									success() {
										uni.$u.config.qqmapsdk.reverseGeocoder({
											success(res) {
												if (res.result.ad_info) {
													getApp().globalData.ad_info = res.result.ad_info;
													than.ad_info = getApp().globalData.ad_info;
													than.getSchoolMsg()
												}
											},
											fail(err) {}
										})
									},
									fail() {
										// GPS已授权 微信定位未授权
										callBack("WENXINunauthorized");
										uni.showModal({
											title: '未打开小程序定位',
											content: '找不到您的位置，请开启定位',
											confirmText: '开启定位',
											showCancel: false,
											success: (res) => {
												if (res.confirm) {
													uni.openSetting(); // 打开地图权限设置
												}
											}
										});
									}
								});
							}
						}
					})
				}
			}
		},
		onShareAppMessage() {
			return {
				title: this.info.activity_name,
				path: `/huodong/pages/detail/index?activityid=${this.formData.activityid}&ad_info=${JSON.stringify(this.ad_info)}`,
				imageUrl:this.info.logo,
				success() {
					uni.showToast({
						title: "分享成功"
					})
				},
				fail() {
					uni.showToast({
						title: "分享失败",
						icon: "none"
					})
				}
			}
		},
		onShareTimeline() {
			return {
				title: this.info.activity_name,
				path: `/huodong/pages/detail/index`,
				query:`share=1&activityid=${this.formData.activityid}&ad_info=${JSON.stringify(this.ad_info)}`,
				imageUrl:this.info.logo,
				success() {
					uni.showToast({
						title: "分享成功"
					})
				},
				fail() {
					uni.showToast({
						title: "分享失败",
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: rgba(243, 243, 247, 1);
		min-height: 100vh;
		padding-bottom: 200rpx;
		padding-top: 1rpx;

		.school {
			margin: 0 auto;
			background: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx;
			box-sizing: border-box;
			overflow: hidden;

			&:first-of-type {
				margin-top: 0;
			}

			.img {
				width: 96rpx;
				height: 96rpx;
				border-radius: 8rpx;
				margin-right: 16rpx;
			}

			.text {
				flex: 1;

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

				.price {
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
					padding-top: 34rpx;
				}

				.label {
					padding-top: 4rpx;
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
			margin: 24rpx 32rpx 0;
			background: #FFFFFF;
			overflow: hidden;
			border-radius: 0 0 16rpx 16rpx;
			&.m0{
				margin-top: 0;
			}
			&:nth-of-type(2) {
				border-radius: 16rpx;
			}

			.images {
				border-radius: 16rpx 16rpx 0 0;
			}

			.message {
				padding: 24rpx;

				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.labels {
					padding-bottom: 10rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
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
						font-size: 36rpx;
						font-weight: 500;
						color: #FF3030;
					}
				}

				.li {
					font-size: 28rpx;
					font-weight: 400;
					color: #666666;
					line-height: 52rpx;

					.icon {
						width: 28rpx;
						height: 28rpx;
						vertical-align: -3rpx;
						margin-right: 16rpx;
					}
				}

				.address {
					margin-top: 24rpx;
					box-sizing: border-box;
					width: 638rpx;
					height: 112rpx;
					background: rgba(48, 96, 251, .05);
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						box-sizing: border-box;
						padding-left: 24rpx;
						width: 426rpx;

						.text {
							font-size: 24rpx;
							font-weight: 500;
							height: 38rpx;
							line-height: 38rpx;
							color: #666666;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 400;
							height: 38rpx;
							line-height: 38rpx;
							color: #999999;
						}
					}

					.right {
						text-align: center;
						margin: 0 28rpx;

						.img {
							width: 40rpx;
							height: 40rpx;
						}

						.text {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
							line-height: 20rpx;
						}
					}
				}
			}

			.txt {
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;
				padding: 32rpx 24rpx 32rpx;
			}

			.imgs {
				padding-top: 16rpx;
				text-align: center;

				&:last-of-type {
					padding-bottom: 32rpx;
				}

				.img {
					border-radius: 16rpx;
					width: 638rpx;
					height: 396rpx;
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

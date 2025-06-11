<template>
	<view class="container">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view :class="['search',hide?'hide':'']">
				<view @click="topage('/school/pages/location/index',null)" class="address">
					{{ad_info.city||ad_info.district||ad_info.province ||'···'}}
					<image :src="src1" mode="aspectFill"></image>
				</view>
				<view class="input" @click="totab('/pages/school/index')">
					<image :src="src2" mode="aspectFill"></image>
					<text>搜索学校</text>
				</view>
			</view>
		</u-sticky>
		<view class="background">
			<view class="banner" v-if="!!banner.length">
				<u-swiper imgMode="aspectFill" height="300" :list="banner" @click="bannerTo($event)"
					@change="e => current = e.current" :autoplay="true" radius="16" circular="true" keyName="picture">
					<view slot="indicator" class="indicator">
						<view class="indicator__dot" v-for="(item, index) in banner" :key="index"
							:class="[index === current && 'indicator__dot--active']">
						</view>
					</view>
				</u-swiper>
			</view>
			<view class="menu">
				<view v-for="(item,index) in menu" :key="index">
					<block v-if="item.link">
						<image class="img" @click="topage(item.link,null)" :src="item.image" mode="aspectFill"></image>
						<view class="title" @click="topage(item.link,null)">{{item.title}}</view>
					</block>
					<block v-else-if="item.tab">
						<image class="img" @click="totab(item.tab)" :src="item.image" mode="aspectFill"></image>
						<view class="title" @click="totab(item.tab)">{{item.title}}</view>
					</block>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="list" v-if="huodong.length">
				<indexTitle title="活动" src="/huodong/pages/huodong/index"></indexTitle>
				<view class="list-swiper">
					<swiper display-multiple-items=1 @change="swiperChange" style="height: 312rpx;">
						<block v-for="(item,index) in huodong" :key="index">
							<swiper-item>
								<schoolHuodong :schoolHuodong="[item]" image="thumb" title="host_unit" activityid="id">
								</schoolHuodong>
							</swiper-item>
						</block>
					</swiper>
					<view class="indicator-wrap">
						<view class="indicator-inner" :style="{width:widthStyle}"></view>
					</view>
				</view>
			</view>
			<view class="list" v-if="school.length">
				<indexTitle title="学校" src="/pages/school/index" totab=true></indexTitle>
				<schoolProfile class="school" :schoolProfile="school" firstTop=true name="title"></schoolProfile>
			</view>
			<view class="list" v-if="zixun.length" style="padding-bottom: 50rpx;">
				<indexTitle title="资讯" src="/pages/info/index" totab=true tabIndex=1></indexTitle>
				<schoolZixun :schoolZixun='zixun' updatetime="inputtime" newsid="id"></schoolZixun>
			</view>
		</view>
		<u-modal @confirm="confirm" width="580rpx" @cancel="cancel" @close="close" :show="show" :title="title"
			showConfirmButton="true" showCancelButton="true" :confirmText="confirmText" :closeOnClickOverlay="true"
			:content='content'></u-modal>
		<u-popup :show="ad.showAd" @close="closeAd" mode="center">
			<view @click="closeAd">
				<image class="adPicture" :src="ad.adPicture" mode="widthFix" @click.stop="topage('school',ad.schoolid)">
				</image>
				<view>
					<image class="adPictureClose" :src="ad.adPictureClose" mode="scaleToFill"></image>
				</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
	import indexTitle from "@/components/index-title/index-title.vue";
	import schoolProfile from "@/components/school-profile/school-profile.vue";
	import schoolZixun from "@/components/school-zixun/school-zixun.vue";
	import schoolHuodong from "@/components/school-huodong/school-huodong.vue";
	export default {
		components: {
			indexTitle,
			schoolProfile,
			schoolZixun,
			schoolHuodong
		},
		data() {
			return {
				current: 0,
				ad: {
					adPictureClose: require(`@/static/联合 5@2x.png`),
					adPicture: "",
					schoolid: null,
					showAd: false
				},
				src1: require(`@/static/组 5@2x.png`),
				src2: require(`@/static/组 6@2x.png`),
				ad_info: {
					city: "深圳市",
					province: "",
					district: ""
				},
				widthStyle: "100%",
				displaymultipleitems: 1,
				banner: [],
				school: [],
				zixun: [],
				huodong: [],
				hide: false,
				show: false,
				title: '您已预约该活动',
				content: '',
				confirmText: "查看详情",
				cancelText: "关闭",
				activityid: null,
				menu: [{
					image: require(`@/static/组 962@2x.png`),
					title: "地图找校",
					tab: "/pages/choose/index",
				}, {
					image: require(`@/static/组 990@2x.png`),
					title: "活动专区",
					link: "/huodong/pages/huodong/index",
				}, {
					image: require(`@/static/组 991@2x.png`),
					title: "新手教程",
					link: "/guide/pages/guide/index",
				}],
				menu2: {
					image: require(`@/static/最新资讯.png`),
					title: "最新资讯",
					tab: "/pages/info/index",
				},
				isFirstIn: true,
				share: null,
				firstToPage: true
			}
		},
		onLoad(option) {
			this.share = option.share;
			this.ad_info = getApp().globalData.ad_info;
			if (option.ad_info) {
				this.ad_info = JSON.parse(option.ad_info)
				this.ad_info.location = {}
			}
			this.authorizedPositioning()
		},
		onShow() {
			this.ad_info = getApp().globalData.ad_info;
			this.authorizedPositioning();
		},
		methods: {
			getad() {
				let than = this;
				let data = {};
				if (this.ad_info.chenshi_id) {
					data = {
						chenshi_id: this.ad_info.chenshi_id
					}
				} else {
					data = {}
					if (this.ad_info.province) {
						data.province_name = this.ad_info.province
					}
					if (this.ad_info.city) {
						data.city_name = this.ad_info.city
					} else if (this.ad_info.district) {
						data.area_name = this.ad_info.district
					}
				}
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=home_ad",
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success(res) {
						if (res.data.status == 1) {
							if (res.data.data && (res.data.data.status == 1)) {
								than.ad.adPicture = res.data.data.picture;
								than.ad.schoolid = res.data.data.schoolid;
								than.ad.showAd = true
							}
						}
					},
					error() {
						uni.switchTab({
							url: `/pages/index/index`
						})
					},
					complete() {
						than.btnshow = true
					}
				})
			},
			closeAd() {
				this.ad.showAd = false
			},
			// 接口请求
			getData() {
				let than = this;
				let data = {};
				if (this.ad_info.chenshi_id) {
					if (this.ad_info.class == 4) {
						data = {
							chenshi_areaid: this.ad_info.chenshi_id
						}
					} else if (this.ad_info.class == 3) {
						data = {
							chenshi_cityid: this.ad_info.chenshi_id
						}
					} else if (this.ad_info.class == 2) {
						data = {
							chenshi_provinceid: this.ad_info.chenshi_id
						}
					}
				} else {
					data = {}
					if (this.ad_info.province) {
						data.province_name = this.ad_info.province
					}
					if (this.ad_info.city) {
						data.city_name = this.ad_info.city
					} else if (this.ad_info.district) {
						data.area_name = this.ad_info.district
					}
				}
				uni.request({
					url: `https://www.ieduchina.com/api.php?op=xc&do=home&t=${Math.random()}`,
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: res => {
						if (res.data.status == 1) {
							than.huodong = res.data.data.activityArr;
							than.school = res.data.data.schoolArr;
							than.zixun = res.data.data.newsArr;
							than.widthStyle = `${(1 / res.data.data.activityArr.length) * 100}%`
							if (than.firstToPage) {
								than.firstToPage = false
								than.menu.splice(1, 0, than.menu2);
							}
						}
					},
					fail: () => {
						uni.showToast({
							title: "数据加载失败，请稍后再试"
						})
					}
				});
			},
			getBanner() {
				let than = this;
				let data = {};
				if (this.ad_info.chenshi_id) {
					if (this.ad_info.class == 4) {
						data = {
							chenshi_areaid: this.ad_info.chenshi_id
						}
					} else if (this.ad_info.class == 3) {
						data = {
							chenshi_cityid: this.ad_info.chenshi_id
						}
					} else if (this.ad_info.class == 2) {
						data = {
							chenshi_provinceid: this.ad_info.chenshi_id
						}
					}
				} else {
					data = {}
					if (this.ad_info.province) {
						data.province_name = this.ad_info.province
					}
					if (this.ad_info.city) {
						data.city_name = this.ad_info.city
					} else if (this.ad_info.district) {
						data.area_name = this.ad_info.district
					}
				}
				uni.request({
					url: 'https://www.ieduchina.com/api.php?op=xc&do=banner',
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: res => {
						if (res.data.status == 1) {
							if (res.data.data.length) {
								than.banner = res.data.data
							} else {
								than.banner = []
							}
						} else {
							than.banner = []
						}
					},
					fail: err => {
						than.banner = []
					}
				});
			},
			bannerTo(index) {
				if (this.banner[index].schoolid) {
					uni.$u.route(`/school/pages/schooldetail/index?schoolid=${this.banner[index].schoolid}`);
				}
			},
			topage(page, id) {
				if (page) {
					if (page == "video" && id) {

					} else if (page == "school" && id) {
						uni.$u.route(`/school/pages/schooldetail/index?schoolid=${id}`);
						setTimeout(() => {
							this.ad.showAd = false
						}, 2000)
					} else {
						uni.$u.route(page);
					}
				}
			},
			totab(page) {
				uni.switchTab({
					url: page
				})
			},
			setColor(color) {
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: color
				})
			},
			confirm() {
				this.show = false;
				uni.$u.route(`/my/pages/huodongdetail/index?activityid=${this.activityid}`);
			},
			cancel() {
				this.show = false;
			},
			close() {
				this.show = false;
			},
			showMask(id) {
				this.activityid = id;
				this.show = true;
			},
			swiperChange(event) {
				this.widthStyle = `${((event.detail.current + 1) / this.huodong.length) * 100}%`
			},
			authorizedPositioning() {
				if (this.isFirstIn) {
					this.isFirstIn = false;
					setTimeout(() => {
						this.isFirstIn = true;
					}, 1000)
					let _this = this;
					if (this.ad_info || this.share == 1) {
						if (this.share == 1) {
							this.ad_info.location = {}
						}
						this.getData();
						this.getBanner();
					} else {
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
														getApp().globalData.ad_info = res.result
															.ad_info;
														_this.ad_info = getApp().globalData
															.ad_info;
														_this.getad()
														_this.getData();
														_this.getBanner();
													}
												},
												fail(err) {
													console.log(err)
												}
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
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 0) {
				this.setColor("#FFFFFF");
				this.hide = true
				this.searchcolor = "#F3F3F7"
			} else {
				this.setColor("#C2D4FF")
				this.hide = false
				this.searchcolor = "#FFFFFF"
			}
		},
		onShareAppMessage() {
			return {
				title: "选校砖家",
				path: "/pages/index/index",
				query: `ad_info=${JSON.stringify(this.ad_info)}`,
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
				title: "选校砖家",
				path: "/pages/index/index",
				query: `share=1&ad_info=${JSON.stringify(this.ad_info)}`,
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
		onPullDownRefresh() {
			this.authorizedPositioning();
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		.search {
			height: 88rpx;
			display: flex;
			padding: 0 32rpx;
			justify-content: space-between;
			align-items: center;
			background-color: rgba(255, 255, 255, 0);

			&.hide {
				background-color: rgba(255, 255, 255, 1);

				.input {
					background-color: #F3F3F7;
				}
			}

			.address {
				display: flex;
				align-items: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-left: 4rpx;
				}
			}

			.input {
				margin-left: 24rpx;
				flex: 1;
				height: 64rpx;
				background: #FFFFFF;
				border-radius: 32rpx;
				display: flex;
				align-items: center;
				box-sizing: border-box;

				image {
					width: 32rpx;
					height: 32rpx;
					margin-left: 24rpx;
					vertical-align: 1rpx;
				}

				text {
					margin-left: 16rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
				}
			}
		}

		.background {
			margin-top: -88rpx;
			padding-top: 88rpx;
			box-sizing: border-box;
			width: 100%;
			background: linear-gradient(180deg, #C2D4FF 0%, #FFFFFF 100%);

			.banner {
				width: 686rpx;
				height: 300rpx;
				margin: 24rpx auto 0;

				.indicator {
					@include flex(row);
					justify-content: center;

					&__dot {
						height: 12rpx;
						width: 12rpx;
						border-radius: 100rpx;
						background-color: rgba(255, 255, 255, 1);
						margin: 0 8rpx;
						transition: background-color 0.3s;

						&--active {
							background-color: #3060FB;
						}
					}
				}
			}

			.menu {
				text-align: center;
				display: flex;
				justify-content: space-evenly;
				padding-top: 60rpx;
				padding-bottom: 60rpx;
				font-size: 0;

				.img {
					width: 132rpx;
					height: 132rpx;
				}

				.title {
					margin-top: 0;
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
				}
			}
		}

		.content {
			background-color: #F9FBFF;
			padding: 0 32rpx;

			.list {
				font-size: 0;
				margin-top: -20rpx;

				&:first-of-type {
					margin-top: -45rpx;
				}

				.list-swiper {
					position: relative;
					margin: 0 -32rpx;

					.u-swiper {
						width: 630rpx;
						height: 268rpx;
						border-radius: 16rpx;
					}

					.indicator-wrap {
						position: absolute;
						left: 50%;
						bottom: 0rpx;
						transform: translateX(-50%);
						width: 70rpx;
						height: 12rpx;
						background: #D6E6FF;
						border-radius: 6rpx;

						.indicator-inner {
							background-color: #3060FB;
							height: 100%;
							border-radius: 6rpx;
						}
					}
				}
			}
		}

		::v-deep .u-popup__content {
			background-color: transparent;
			text-align: center;

			.adPicture {
				padding-top: 80rpx;
				width: 568rpx;
				max-height: 86vh;
			}

			.adPictureClose {
				width: 48rpx;
				height: 48rpx;
				margin-top: 20rpx;
			}
		}
	}
</style>
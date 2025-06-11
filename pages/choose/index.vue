<template>
	<view class="container">
		<view class="menu">
			<view class="top">
				<view @click="topage('location')" class="address">
					<text class="name">{{ad_info.city||ad_info.district||ad_info.province ||'···'}}</text>
					<image class="img" :src="arr"></image>
				</view>
				<view class="center">
					<liuyuno-tabs :tabData="tabs" :defaultIndex="defaultIndex" @tabClick='tabClick' />
				</view>
				<view class="all" @click="topage('school')">
					<image class="img" :src="all" mode="aspectFit">
					</image>
				</view>
			</view>
			<view v-show="bottomshow" class="bottom">
				<view class="bottom-inner">
					<text @click="menus(index)" :class="['button',{'active':typeIndex==index}]" v-for="(item,index) in types" :key="index">{{item.name}}
					</text>
				</view>
			</view>
		</view>
		<map id="mapId" class="map" :longitude="longitude" :latitude="latitude" :scale="scale" @markertap="marktap"
			slot="callout" @regionchange="regionchange" @tap="controltap" @labeltap="labeltap" @callouttap="marktap">
		</map>
		<u-toast ref="uToast"></u-toast>
		<u-popup :show="show" @close="close" :round="32">
			<school-profile :schoolProfile="school" name="title"></school-profile>
		</u-popup>
	</view>
</template>

<script>
	import liuyunoTabs from "@/components/liuyuno-tabs/liuyuno-tabs.vue";
	import schoolProfile from "@/components/school-profile/school-profile.vue";
	export default {
		components: {
			liuyunoTabs,
			schoolProfile
		},
		data() {
			return {
				ad_info: {
					city: "",
					district:"",
					province:""
				},
				formdata: {
					city: "",
					gradeid: "",
					school_type: ""
				},
				typeIndex: 0,
				longitude: "",
				latitude: "",
				scale: 10,
				mapCtx: null,
				show: false,
				school: [],
				arr: require(`@/static/组 5@2x.png`),
				iconPath: `/static/学校.png`,
				all: require(`@/static/组 702@2x.png`),
				defaultIndex: 0,
				tabs: [],
				views: true,
				sec: 0,
				schoollist: [],
				types: [{
					name: "全部",
					id: 0
				}, {
					name: "公立学校",
					id: 1
				}, {
					name: "民办学校",
					id: 2
				}, {
					name: "私立学校",
					id: 3
				}, {
					name: "中外合作",
					id: 4
				}, {
					name: "外籍人员子女学校",
					id: 5
				}],
				bottomshow: false,
				form: {
					types: ""
				},
				isFirstIn: true
			}
		},
		onLoad() {
			this.mapCtx = wx.createMapContext('mapId')
			this.mapCtx.on('markerClusterClick', res => {})
			this.mapCtx.on('markerClusterCreate', res => {})
			this.getGrade()
		},
		watch: {
			ad_info: {
				deep: true,
				handler() {
					if (this.isFirstIn) {
						this.authorizedPositioning()
					}
				}
			},
			views() {
				this.getData(false)
			},
		},
		onReady() {

		},
		onShow() {
			this.ad_info = getApp().globalData.ad_info;
			// if (!this.ad_info.city && !this.ad_info.province && !this.ad_info.district) {
			if(this.isFirstIn){
				this.authorizedPositioning()
			}
		},
		methods: {
			menus(index) {
				this.typeIndex = index;
				this.formdata.school_type = this.types[index].id
				this.getData(false)
			},
			labeltap() {
				let than = this;
				this.mapCtx.getScale({
					success(e) {
						console.log(e.scale)
						than.scale = e.scale + 1
					}
				})
			},
			regionchange(e) {
				if (e.detail.scale) {
					if (e.detail.scale > 11) {
						this.views = false
					} else {
						this.views = true
					}
				}
			},
			controltap() {},
			tabClick(index) {
				this.formdata.gradeid = this.tabs[index].id;
				this.getData();
				this.bottomshow = true;
			},
			topage(page) {
				if (page == "school") {
					uni.switchTab({
						url: "/pages/school/index"
					})
				} else if (page == "location") {
					uni.$u.route(`/school/pages/location/index`);
				}
			},
			getGrade() {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=grade",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data.status == 1) {
							let grade = [{
								id: 0,
								name: "不限"
							}];
							for (let key in res.data.data) {
								grade.push({
									name: res.data.data[key],
									id: key
								})
							}
							than.tabs = grade
						}
					},
					fail: () => {}
				})
			},
			getData(flag) {
				uni.showToast({
					title: "加载中...",
					icon: "loading"
				})
				delete this.formdata.chenshi_provinceid;
				delete this.formdata.chenshi_cityid;
				delete this.formdata.chenshi_areaid;
				delete this.formdata.province_name;
				delete this.formdata.city_name;
				if (this.ad_info.class) {
					if (this.ad_info.chenshi_id) {
						if (this.ad_info.class == 4) {
							this.formdata.chenshi_areaid = +this.ad_info.chenshi_id
						} else if (this.ad_info.class == 3) {
							this.formdata.chenshi_cityid = +this.ad_info.chenshi_id
						} else if (this.ad_info.class == 2) {
							this.formdata.chenshi_provinceid = +this.ad_info.chenshi_id
						}
					} else {
						this.formdata.province_name = this.ad_info.province;
						if (this.ad_info.class == 3) {
							this.formdata.city_name = this.ad_info.city;
						}
						if (this.ad_info.class == 4) {
							this.formdata.city_name = this.ad_info.city;
							this.formdata.area_name = this.ad_info.district;
						}
					}
				} else {
					this.formdata.province_name = this.ad_info.province;
					this.formdata.city_name = this.ad_info.city;
				}
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=map",
					method: "GET",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:this.formdata,
					success(res) {
						if (res.data.status == 1) {
							than.schoollist = res.data.data;
							than.addMarks(flag)
						} else {
							than.$refs.uToast.show({
								message: "没有符合条件的学校",
								type: "default"
							})
							than.schoollist = [];
							than.addMarks(flag)
							than.addressToLatLng()
						}
						uni.hideToast()
					},
					error() {
						than.latitude = than.ad_info.location.lat
						than.longitude = than.ad_info.location.lng
						uni.hideToast()
					}
				})
			},
			authorizedPositioning() {
				this.isFirstIn = false;
				setTimeout(() => {
					this.isFirstIn = true;
				}, 1000)
				let than = this;
				this.ad_info = getApp().globalData.ad_info;
				if (this.ad_info) {
					this.getData();
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
													getApp().globalData.ad_info = res.result.ad_info;
													than.ad_info = res.result.ad_info;
													than.getData();
												}
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
			},
			addressToLatLng() {
				let than = this;
				let address = (this.ad_info.province||'')+(this.ad_info.city||'')+(this.ad_info.district||'')
				uni.$u.config.qqmapsdk.geocoder({
					address,
					success(res) {
						if (res && res.result && res.result.location) {
							than.latitude = res.result.location.lat
							than.longitude = res.result.location.lng
							than.scale = 10
						}else{
							than.$refs.uToast.show({
								message: res.message,
								type: "default"
							})
						}
					}
				})
			},
			addMarks(flag) {
				let points = []
				let than = this;
				let iconPath = this.iconPath;
				let markers = [];
				if (this.views) {
					// 聚合
					var defaultPoint = {
						latitude: "",
						longitude: "",
						id: 0,
						iconPath,
						width: 20,
						height: 20,
						joinCluster: false,
						label: {
							id: 0,
							content: "用户",
							color: "#3060fb",
							padding: 5,
							textAlign: "center",
							anchorY: "-4",
							fontSize: "14",
							borderColor: "#3060fb",
							borderWidth: 1,
							borderRadius: 10,
							bgColor: "#ffffff",
							display: "ALWAYS"
						}
					}
					this.schoollist.map((o, i) => {
						let center0 = []
						if (o.list) {
							for (let i = 0; i < o.list.length; i++) {
								if (o.list[i].longitude && o.list[i].latitude) {
									center0.push({
										longitude: o.list[i].longitude,
										latitude: o.list[i].latitude
									})
								}
							}
						}
						if (center0.length) {
							var center = this.getPointsCenter(center0);

							markers.push({
								latitude: center[0],
								longitude: center[1],
								id: i,
								iconPath,
								width: 20,
								height: 20,
								joinCluster: false,
								label: {
									id: i,
									content: ' ' + o.name + ' ' + '\r\n' + '(' + center0.length + ')',
									color: "#fff",
									padding: 5,
									textAlign: "center",
									anchorY: "-20",
									fontSize: "14",
									borderColor: "#3060fb",
									borderWidth: 1,
									borderRadius: 10,
									bgColor: "#3060fb",
									display: "ALWAYS"
								}
							})
							points.push({
								latitude: center[0],
								longitude: center[1]
							})
						}
					})
				} else {
					// 不聚合
					var defaultPoint = {
						latitude: "",
						longitude: "",
						iconPath,
						width: 20,
						height: 20,
						joinCluster: false,
						callout: {
							id: 0,
							content: "用户",
							color: "#3060fb",
							padding: 5,
							textAlign: "center",
							anchorY: "-4",
							fontSize: "14",
							borderColor: "#3060fb",
							borderWidth: 1,
							borderRadius: 10,
							bgColor: "#ffffff",
							display: "ALWAYS"
						}
					}
					this.schoollist.map((o, i) => {
						if (o.list) {
							o.list.map((w, j) => {
								if (w.longitude && w.latitude) {
									points.push({
										longitude: w.longitude,
										latitude: w.latitude
									})
									w.callout = {
										...defaultPoint.callout,
										...w.callout
									}
									markers.push({
										...defaultPoint,
										...w
									})
								}
							})
						}
					})
				}
				var center = this.getPointsCenter(points);
				if (center) {
					than.longitude = center[1]
					than.latitude = center[0]
				}
				setTimeout(() => {
					this.mapCtx.addMarkers({
						markers,
						clear: true,
						complete() {
							if (flag) {
								than.mapCtx.includePoints({
									points,
									padding: [200, 20, 200, 20],
									success(res) {}
								})
							}
						}
					})
				}, 300)
			},
			getPointsCenter(points) {
				var point_num = points.length;
				var X = 0,
					Y = 0,
					Z = 0;
				for (let i = 0; i < points.length; i++) {
					var lat, lng, x, y, z;
					lat = parseFloat(points[i].latitude) * Math.PI / 180;
					lng = parseFloat(points[i].longitude) * Math.PI / 180;
					x = Math.cos(lat) * Math.cos(lng);
					y = Math.cos(lat) * Math.sin(lng);
					z = Math.sin(lat);
					X += x;
					Y += y;
					Z += z;
				}
				X = X / point_num;
				Y = Y / point_num;
				Z = Z / point_num;

				var tmp_lng = Math.atan2(Y, X);
				var tmp_lat = Math.atan2(Z, Math.sqrt(X * X + Y * Y));

				return [tmp_lat * 180 / Math.PI, tmp_lng * 180 / Math.PI];
			},
			marktap(e) {
				let schoolid = e.detail.markerId
				if (!schoolid) {
					console.warn("缺少schoolid")
					return false
				}
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=school_info",
					method: "GET",
					data: {
						schoolid,
					},
					success(res) {
						if (res.data.status == 1) {
							than.school[0] = res.data.data
							than.show = true;
						}
						console.log(res)
					},
					error(res) {
						console.log(res)
					}
				})
			},
			close() {
				this.show = false;
			}
		}
	}
</script>
<style lang="scss">
	.container {
		.map {
			width: 100vw;
			height: 100vh;
		}

		.u-safe-bottom {
			padding-bottom: 0;
		}

		.menu {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;

			.top {
				width: 100%;
				height: 88rpx;
				background-color: white;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.address {
					width: 148rpx;
					margin-right: 24rpx;
					height: 40rpx;
					line-height: 64rpx;
					font-size: 28rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-right: solid 2rpx #eeeeee;

					.name {
						display: inline-block;
						max-width: 100rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					.img {
						width: 32rpx;
						height: 32rpx;
						vertical-align: -6rpx;
						margin-left: 0rpx;
					}
				}

				.center {
					width: 524rpx;
				}

				.all {
					width: 98rpx;
					height: 88rpx;
					border-left: solid 2rpx #eeeeee;
					display: flex;
					justify-content: center;
					align-items: center;

					.img {
						width: 36rpx;
						height: 36rpx;
					}
				}
			}

			.bottom {
				width: 100%;
				height: 88rpx;
				background-color: white;
				overflow-y: hidden;
				overflow-x: auto;
				box-sizing: border-box;
				padding: 24rpx 20rpx;
				.bottom-inner{
					white-space: nowrap;
					.button {
						display: inline-block;
						height: 40rpx;
						box-sizing: border-box;
						padding: 0 20rpx;
						border-radius: 24rpx;
						font-size: 24rpx;
						font-weight: 400;
						margin-left: 12rpx;
						color: rgba(102, 102, 102, 1);
						line-height: 40rpx;
						text-align: center;
					
						&.active {
							background-color: rgba(48, 96, 251, 1);
							color: #FFFFFF;
						}
					}
				}
			}
		}

		.detail {
			height: 232rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 32rpx 32rpx 24rpx 32rpx;
			display: flex;
			justify-content: space-between;

			.img {
				width: 176rpx;
				height: 176rpx;
				margin-right: 24rpx;
			}

			.right {
				flex: 1;

				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
				}
			}
		}
	}
</style>

<template>
	<view class="container">
		<view class="banner">
			<template v-if="datas['img_num']==0">
				<u-swiper height="380" :list="banner_thumb" keyName="thumb" imgMode="aspectFit">
				</u-swiper>
			</template>
			<template v-else>
				<u-swiper height="380" :list="banner" @change="bannerchange"
					@click="bannerchange" :autoplay="false" keyName="thumb">
				</u-swiper>
			</template>
			<view class="sc" @click="isflow('collect')">
				<image class="img" v-if="datas['is_collect']" :src="src1"
					mode="aspectFit">
				</image>
				<image class="img" v-else :src="src2" mode="aspectFit">
				</image>
			</view>
			<view class="num" @click="toimages" v-if="datas['img_num']!=0">
				<image class="img" :src="src3" mode="aspectFill"></image>
				<text class="text">{{datas['img_num']}}</text>
			</view>
		</view>
		<view class="schooljj">
			<view class="top">
				<view class="left">
					<view class="title">{{datas['title']}}</view>
					<view class="label">
						<text v-for="(lab,i) in datas['label_name']" class='lab'
							:style="{'color':datas['label_color'][i],'backgroundColor':setBgColor(datas['label_color'][i])}"
							:key="i">{{lab}}</text>
					</view>
				</view>
				<div class="right">
					<button @click="isflow('guanzhu')" class="btn is" v-if="datas['is_follow']">已关注</button>
					<button @click="isflow('guanzhu')" class="btn" v-else><text class="text">+</text>关注</button>
				</div>
			</view>
			<view class="link" @click="topage('profile',null,null)">查看学校简介
				<image class="img" :src="src7" mode="aspectFit"></image>
			</view>
			<view class="address" v-if="datas['college_address'] || datas['distance'] || datas['mobile'] ">
				<view class="left">
					<view class="text" v-if="datas['college_address']">{{datas['college_address']}}</view>
					<view class="text2" v-if="datas['distance']">距您{{datas['distance']}}</view>
				</view>
				<div class="center right" v-if="datas['college_address']" @click=goMap>
					<image class="img" :src="src4" mode=""></image>
					<view class="text">导航</view>
				</div>
				<div class="right" v-if="datas['mobile']" @click="call(datas['mobile'])">
					<image class="img" :src="src5" mode=""></image>
					<view class="text">电话</view>
				</div>
			</view>
		</view>
		<u-sticky offset-top="0">
			<view class="tabs">
				<view :class="{'tab':true,active:index==tabsIndex}" @click="tabfun(index)" v-for="(tab,index) in tabs"
					:key="index">
					{{tab.title}}
					<text class="text"></text>
				</view>
			</view>
		</u-sticky>
		<view class="list">
			<view v-if="tabsIndex==0" class="list1">
				<schoolHuodong :schoolHuodong="list1" image="thumb" name="school_name" activityid="id"></schoolHuodong>
			</view>
			<view v-if="tabsIndex==1" class="list2">
				<view v-for="(item,index) in list2" class="li" :key="index">
					<view class="top">
						<image class="img" :src="item.thumb" mode="aspectFill"></image>
						<view class="right">
							<view class="name">{{item.name}}</view>
							<view class="teach">{{item.job}}</view>
						</view>
					</view>
					<view :class="{'jj':true,show:!!item.iszk}">
						{{item.content}}
						<!-- <text style="color: transparent;">展开</text> -->
					</view>
					<!-- <view @click="show(!item.iszk,index)" v-if="item.iszk" class="btn">收起</view>
					<view @click="show(!item.iszk,index)" v-else class="btn">展开</view> -->
				</view>
			</view>
			<view v-if="tabsIndex==2" class="list3">
				<view v-for="(item,index) in list3" class="li" :key="index"
					v-if="(index==0&&schoolfeatures) || index==1&&teachingfeatures"
					@click="topage('characteristic',item['id'],index)" v-show="item.list.length">
					<block>
						<view class="title">
							<view class="name">{{item.title}}</view>
							<view class="else">
								<text>更多</text>
								<image class="img" :src="src6" mode="aspectFit"></image>
							</view>
						</view>
						<view class="ul">
							<view class="lis" v-for="(li,i) in item.list" :key="i">
								<image class="img" :src="li.thumb" mode="aspectFill"></image>
								<view class="text">{{li.title}}</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<!-- <view v-if="tabsIndex==2" class="list3">
				<view v-for="(item,index) in list3" class="li" :key="index"
					@click="topage('characteristic',item.id,index)">
					<block>
						<view class="title">
							<view class="name">{{item.title}}</view>
							<view class="else">
								<text>更多</text>
								<image class="img" src="@/static/组 176@2x.png" mode="aspectFit"></image>
							</view>
						</view>
						<view class="ul">
							<view class="lis" v-for="(li,i) in item.list" :key="i" v-if="i<2">
								<image class="img" :src="li.imgurl" mode="aspectFill"></image>
								<view class="text">{{li.title}}</view>
							</view>
						</view>
					</block>
				</view>
			</view> -->
			<view v-if="tabsIndex==3" class="list4">
				<schoolZixun :schoolZixun="list4" isUserid=true newsid="id"></schoolZixun>
			</view>
		</view>
		<view class="bottom">
			<button class="btn" @click="update()">预约探校</button>
		</view>
		<u-modal @confirm="confirm" width="580rpx" @cancel="cancel" @close="close" :show="isshow" :title="title"
			showConfirmButton="true" showCancelButton="true" :confirmText="confirmText" :closeOnClickOverlay="true"
			:content='content'></u-modal>
	</view>
</template>
<script>
	import aloysTab from "@/components/aloys-tab/aloys-tab.vue"
	import schoolHuodong from "@/components/school-huodong/school-huodong.vue";
	import schoolZixun from "@/components/school-zixun/school-zixun.vue";
	export default {
		components: {
			aloysTab,
			schoolHuodong,
			schoolZixun
		},
		data() {
			return {
				src1:require(`@/static/收藏选中@2x2.png`),
				src2:require(`@/static/收藏选中@2x.png`),
				src3:require(`@/static/图片@2x.png`),
				src4:require(`@/static/组 235@2x.png`),
				src5:require(`@/static/组 236@2x.png`),
				src6:require(`@/static/组 176@2x.png`),
				src7:require(`@/static/组 176@2x.png`),
				schoolfeatures: false,
				teachingfeatures: false,
				isshow: false,
				title: '您已预约该活动',
				content: '',
				confirmText: "查看详情",
				cancelText: "关闭",
				ad_info: {},
				schoolid: "",
				banner:[],
				banner_thumb:[],
				tabs: [{
					title: '校园活动'
				}, {
					title: '师资力量'
				}, {
					title: '特色教学'
				}, {
					title: '最新资讯'
				}],
				info: {
					school: {},
					activity: {
						labelid: "",
						start_time: "",
						end_time: ""
					}
				},
				tabsIndex: 0,
				list1: [],
				list2: [],
				list3: [{
					title: "学校特色",
					list: []
				}, {
					title: "课程特色",
					list: []
				}],
				list4: [],
				banner: [],
				datas: {
					schoolid: null,
					is_collect:0
				},
				distance: "",
				openid: "",
				formData: [{}, {}, {}, {}],
				loadover: false
			}
		},
		onLoad(option) {
			let than = this;
			this.schoolid = option.schoolid
			this.datas.schoolid = +option.schoolid
			this.ad_info = getApp().globalData.ad_info;
			this.share = option.share;
			if(option.ad_info){
				this.ad_info = JSON.parse(option.ad_info)
				this.ad_info.location = {}
			}
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.openid = res.data;
						than.getadinfo()
					}
				},
				fail: () => {
					than.getadinfo()
				}
			});
		},
		methods: {
			views_add(schoolid, openid) {
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=views_add",
					method: "POST",
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						schoolid,
						openid
					},
					success(res) {},
					error(err) {
						console.log(err)
					}
				})
			},
			update() {
				if (!this.openid) {
					uni.showModal({
						content: '请登录',
						showCancel: false,
						success: function() {
							uni.switchTab({
								url: `/pages/my/index`
							})
						}
					});
					return false
				}
				let isTrue = !!(this.datas.apply == "1");
				if (isTrue) {
					this.isshow = true;
				} else {
					uni.$u.route(`/school/pages/form/index?schoolid=${this.datas.id}`);
				}
			},
			setBgColor(web_color) {
				if (web_color && web_color.indexOf("#") != -1) {
					return "rgba(" + parseInt("0x" + web_color.slice(1, 3)) + "," + parseInt("0x" + web_color.slice(3,
						5)) + "," + parseInt("0x" + web_color.slice(5, 7)) + "," + 0.1 + ")";
				}
			},
			getadinfo() {
				let than = this;
				if (this.ad_info || than.share==1) {
					if ((this.ad_info.city_code + "").indexOf(this.ad_info.nation_code) != -1) {
						this.ad_info.city_code = +this.ad_info.city_code.split(this.ad_info.nation_code)[1] / 100
					}
					than.getMsg()
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
													than.ad_info = getApp().globalData.ad_info;
													if ((than.ad_info.city_code + "").indexOf(than
															.ad_info.nation_code) != -1) {
														than.ad_info.city_code = +than.ad_info
															.city_code.split(than.ad_info
																.nation_code)[1] / 100
													}
													than.getMsg()
												}
											},
											fail() {}
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
			topage(page, id, state) {
				// if (!openid && page == "form") {
				// 	uni.showModal({
				// 		content: '请先登录',
				// 		showCancel: true,
				// 		success(res) {
				// 			if (res.confirm) {
				// 				uni.switchTab({
				// 					url: `/pages/my/index`
				// 				})
				// 			}
				// 		}
				// 	});
				// 	return false;
				// }
				if (page == 'characteristic') {
					uni.$u.route(`/school/pages/characteristic/index?schoolid=${this.datas.id}&state=${state+1}`);
				} else if (page == "form") {
					uni.$u.route(`/school/pages/form/index?schoolid=${this.datas.id}`);
				} else if (page == "profile") {
					uni.$u.route(`/school/pages/profile/index?id=${this.datas.id}`);
				}
			},
			bannerchange(e) {
				if (e.current == 2) {
					uni.$u.route(`/school/pages/album/index?schoolid=${this.schoolid}`);
				} else if (typeof e == 'number') {
					uni.$u.route(`/school/pages/album/index?schoolid=${this.schoolid}`);
				}
			},
			toimages(){
				uni.$u.route(`/school/pages/album/index?schoolid=${this.schoolid}`);
			},
			confirm() {
				this.isshow = false;
				uni.$u.route(`/my/pages/tanxiaodetail/index?schoolid=${this.schoolid}`);
			},
			cancel() {
				this.isshow = false;
			},
			close() {
				this.isshow = false;
			},
			isflow(doStr) {
				let {
					schoolid,
					openid
				} = this;
				let than = this;
				if (!openid) {
					uni.showModal({
						content: '请先登录',
						showCancel: true,
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: `/pages/my/index`
								})
							}
						}
					});
					return false;
				}
				uni.request({
					url: `https://www.ieduchina.com/api.php?op=xc&do=school_${doStr}`,
					method: "POST",
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						schoolid: +schoolid,
						openid
					},
					success(res) {
						if (res.data.status == 1) {
							if (doStr == 'guanzhu') {
								than.datas.is_follow = !than.datas.is_follow
							} else if (doStr == 'collect') {
								than.datas.is_collect = !than.datas.is_collect
							}
							than.$forceUpdate()
						} else if (res.data.code == 5001) {
							uni.showModal({
								content: '请先登录',
								showCancel: false
							});
						}
					},
					error(err) {
						console.log(err)
					},
					complete(res) {
						console.log(res)
					}
				})
			},
			call(tel) {
				uni.makePhoneCall({
					phoneNumber: tel
				})
			},
			tabfun(index) {
				console.log(index)
				this.tabsIndex = index
				this.getList()
				const query = uni.createSelectorQuery().in(this);
				query.select(".select").boundingClientRect((data) => {
					uni.pageScrollTo({
						scrollTop: 332,
						duration: 0
					})
				}).exec()
			},
			show(flag, index) {
				this.list2[index]['iszk'] = flag
			},
			// getLocal() {
			// 	// let _this = this;
			// 	wx.getLocation({
			// 		type: "gcj02",
			// 		isHighAccuracy: true,
			// 		highAccuracyExpireTime: 3000,
			// 		success(res) {
			// 			console.log(res)
			// 		},
			// 		fail() {},
			// 		complete() {}
			// 	})
			// },
			goMap() {
				wx.openLocation({
					latitude: +this.datas.latitude,
					longitude: +this.datas.longitude,
					name: this.datas.title,
					address: this.datas.college_address,
					scale: 28
				})
			},
			getMsg() {
				let than = this;
				let schoolid = this.schoolid;
				let longitude = this.ad_info.location.lng || "";
				let latitude = this.ad_info.location.lat || "";
				let openid = this.openid;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=school_info",
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					dataType: "json",
					data: {
						schoolid,
						longitude,
						latitude,
						openid
					},
					success(res) {
						if (res.data.status == 1) {
							than.banner = [];
							than.datas = res.data.data;
							if (res.data.data.is_follow == undefined) {
								than.datas.is_follow = 0
							}
							if (res.data.data.is_collect == undefined) {
								than.datas.is_collect = 0
							}
							if(res.data.data.imgs && res.data.data.imgs.length){
								than.banner = res.data.data.imgs
							}
							if(res.data.data.thumb){
								than.banner_thumb = [{thumb:res.data.data.thumb}]
							}
							than.views_add(than.schoolid, than.openid)
							setTimeout(() => {
								than.getList()
							}, 100)
						}
					},
					error(err) {
						console.log(err)
					},
					complete(res) {
						console.log(res)
					}
				})
			},
			getList() {
				if(!this.datas.id){
					uni.showToast({
						title:"没有学校信息"
					})
					return false;
				}
				let tabsIndex = this.tabsIndex
				let formData = this.formData[tabsIndex],
					than = this,
					url = "",
					str = "";
				if (!formData.page) {
					this.formData[tabsIndex].page = 1
					this.formData[tabsIndex].loadover = false
				}
				let data = {
					schoolid: +this.datas.id,
					page: this.formData[tabsIndex].page,
					limit: 10,
					userid: +this.datas.userid||-1
				}
				if (tabsIndex == 0) {
					delete data.schoolid
					url = "https://www.ieduchina.com/api.php?op=xc&do=activity_list"
					str = "校园活动"
				} else if (tabsIndex == 1) {
					delete data.userid
					url = "https://www.ieduchina.com/api.php?op=xc&do=teacher_list"
					str = "师资力量"
				} else if (tabsIndex == 2) {
					delete data.userid
					// url = "https://www.ieduchina.com/api.php?op=xc&do=features_list"
					url = "https://www.ieduchina.com/api.php?op=xc&do=features&schoolid"
					str = "特色教学"
				} else if (tabsIndex == 3) {
					delete data.schoolid
					url = "https://www.ieduchina.com/api.php?op=xc&do=news_list"
					str = "最新资讯"
				}
				uni.request({
					url,
					method: "GET",
					data: data,
					success(res) {
						if (formData.page == 1) {
							if (tabsIndex == 2) {
								than.list3[0].list = []
								than.list3[1].list = []
							} else {
								than["list" + [tabsIndex + 1]] = [];
							}
						}

						if (res.data.status == 1) {
							if (res.data.data.count == 0) {
								than.formData[tabsIndex].loadover = true
								than["list" + [tabsIndex + 1]] = [];
								wx.showToast({
									title: `暂时没有${str}`,
									icon: "none"
								})
							} else if (res.data.data.list && res.data.data.list.length == 0) {
								than.formData[tabsIndex].loadover = true
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
							} else if (res.data.data.count == 1) {
								than["list" + [tabsIndex + 1]] = res.data.data.list;
							} else {
								if (tabsIndex == 2) {
									than.formData[2].loadover = true
									if (res.data.data.ts_school) {
										than.schoolfeatures = true;
									}
									if (res.data.data.ts_kechen) {
										than.teachingfeatures = true;
									}
									than.list3[0].list = res.data.data.ts_school
									than.list3[1].list = res.data.data.ts_kechen
									if (res.data.data.ts_school.length == 0 && res.data.data.ts_kechen.length ==
										0) {
										wx.showToast({
											title: `暂时没有${str}`,
											icon: "none"
										})
									}
								} else {
									than["list" + [tabsIndex + 1]].push(...res.data.data.list);
								}
							}
						} else {
							wx.showToast({
								title: `暂时没有${str}`,
								icon: "none"
							})
						}
					},
					error(res) {
						console.log(res)
					},
					complete() {}
				})
			}
		},
		onReachBottom() {
			if (!this.formData[this.tabsIndex].loadover) {
				this.formData[this.tabsIndex].page++
				this.getList()
			}
		},
		onShareAppMessage() {
			return {
				title: this.datas.school_name,
				path: `/school/pages/schooldetail/index?schoolid=${this.datas.id}&ad_info=${JSON.stringify(this.ad_info)}`,
				imageUrl:this.datas.school_logo,
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
				title: this.datas.school_name,
				path: `/school/pages/schooldetail/index`,
				query:`share=1&schoolid=${this.datas.id}&ad_info=${JSON.stringify(this.ad_info)}`,
				imageUrl:this.datas.school_logo,
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
		background-color: #F3F3F7;
		min-height: 100vh;

		.banner {
			width: 100%;
			height: 380rpx;
			position: relative;

			.sc {
				position: absolute;
				right: 32rpx;
				top: 24rpx;
				width: 44rpx;
				height: 44rpx;

				.img {
					width: 44rpx;
					height: 44rpx;
				}
			}

			.num {
				position: absolute;
				right: 32rpx;
				top: 274rpx;
				height: 36rpx;
				background: rgba(0, 0, 0, 0.7);
				border-radius: 18rpx;
				text-align: center;
				line-height: 36rpx;
				padding: 0 14rpx;

				.img {
					width: 24rpx;
					height: 24rpx;
				}

				.text {
					margin-left: 2rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #FFFFFF;
					vertical-align: 3rpx;
				}
			}
		}

		.schooljj {
			position: relative;
			z-index: 10;
			width: 686rpx;
			border-radius: 16rpx;
			margin: -50rpx auto 6rpx;
			background-color: white;
			padding: 32rpx 24rpx 24rpx;
			box-sizing: border-box;

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				min-height: 88rpx;

				.left {
					flex: 1;
					max-width: 500rpx;

					.title {
						font-size: 36rpx;
						font-weight: bold;
						color: #333333;
						// white-space: nowrap;
						// overflow: hidden;
						// text-overflow: ellipsis;
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
					width: 200rpx;

					.btn {
						width: 140rpx;
						height: 52rpx;
						background-color: rgba(48, 96, 251, 1);
						border-radius: 32rpx;
						font-size: 28rpx;
						line-height: 52rpx;
						font-weight: 400;
						color: #FFFFFF;

						&.is {
							background-color: rgba(48, 96, 251, .7);
							color: #FFFFFF;
						}

						.text {
							font-size: 30rpx;
							vertical-align: 0;
						}
					}
				}
			}

			.link {
				font-size: 24rpx;
				font-weight: 400;
				height: 24rpx;
				line-height: 24rpx;
				color: #999999;
				padding: 20rpx 0 28rpx 0;

				.img {
					width: 24rpx;
					height: 24rpx;
					vertical-align: -3rpx;
				}
			}

			.address {
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
					width: 420rpx;

					.text {
						font-size: 24rpx;
						font-weight: 500;
						height: 38rpx;
						line-height: 38rpx;
						color: #666666;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
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

		.tabs {
			background-color: #F3F3F7;
			height: 116rpx;
			margin: 0 32rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.tab {
				text-align: center;
				position: relative;
				display: inline-block;
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);

				&.active {
					color: #3060FB;

					.text {
						background-color: #3060FB;
					}
				}

				.text {
					position: absolute;
					bottom: -20rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 8rpx;
					border-radius: 4rpx;
				}
			}
		}

		.list {
			min-height: 100vh;
			padding-bottom: 200rpx;

			.list2 {
				.li {
					width: 686rpx;
					background: #FFFFFF;
					border-radius: 16rpx;
					padding: 24rpx;
					margin: 24rpx auto;
					box-sizing: border-box;
					position: relative;

					&:first-of-type {
						margin-top: 0;
					}

					.top {
						display: flex;
						align-items: center;

						.img {
							width: 88rpx;
							height: 88rpx;
							border-radius: 50%;
						}

						.right {
							margin-left: 24rpx;

							.name {
								height: 40rpx;
								font-size: 30rpx;
								font-weight: 500;
								color: #333333;
								line-height: 40rpx;
							}

							.teach {
								height: 40rpx;
								font-size: 24rpx;
								font-weight: 400;
								color: #999999;
								line-height: 40rpx;
							}
						}
					}

					.jj {
						font-size: 28rpx;
						font-weight: 400;
						color: #666666;
						line-height: 44rpx;
						padding-top: 28rpx;

						&.show {
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
					}

					.btn {
						position: absolute;
						right: 24rpx;
						bottom: 24rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #3060FB;
						padding: 7rpx;
						background-color: white;
					}
				}
			}

			.list3 {
				.li {
					width: 686rpx;
					background: #FFFFFF;
					border-radius: 16rpx;
					padding: 24rpx;
					margin: 24rpx auto;
					box-sizing: border-box;
					position: relative;

					&:first-of-type {
						margin-top: 0;
					}

					.title {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.name {
							font-size: 28rpx;
							font-weight: 500;
							color: #333333;
						}

						.else {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;

							.img {
								width: 24rpx;
								height: 24rpx;
								vertical-align: -2rpx;
							}
						}
					}

					.ul {
						display: flex;
						justify-content: space-between;

						.lis {
							padding-top: 32rpx;

							.img {
								width: 308rpx;
								height: 200rpx;
								border-radius: 8rpx;
							}

							.text {
								padding-top: 20rpx;
								font-size: 28rpx;
								font-weight: 400;
								color: #333333;
							}
						}
					}
				}
			}
		}

		.bottom {
			padding: 16rpx 0 84rpx;
			background-color: white;
			position: fixed;
			width: 100%;
			bottom: 0;

			.btn {
				width: 686rpx;
				height: 80rpx;
				background: #3060FB;
				border-radius: 44rpx;
				font-size: 30rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
				line-height: 80rpx;
				margin: 0 auto;
			}
		}
	}
</style>

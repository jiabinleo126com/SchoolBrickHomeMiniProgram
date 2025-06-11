<template>
	<view class="content">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view class="search">
				<view @click="topage" class="address">{{ad_info.city||ad_info.province ||'···'}}
					<image class="img" :src="arr"></image>
				</view>
				<u-search height="64" actionText="搜索" animation=true placeholder="搜索校园活动等内容" bgColor="#F3F3F7"
					searchIconSize=46 placeholderColor="#999999" clearabled="false" @input="searchChange"
					@search="search" @custom="search" v-model="keyword"></u-search>
			</view>
			<view class="select" ref="select">
				<view class="option" v-for="(item,index) in selectOption" @click="selectFun(index)" :key="index">
					<text
						:class="['text',selectIndex==index?'active':'']">{{(form.select[index].is>0)?selectOption[index].list[form.select[index]['is']]['name']:item.title}}</text>
					<image v-if="selectIndex==index" class="img" :src="arrb" mode="aspectFill">
					</image>
					<image v-else class="img" :src="arrt" mode="aspectFill"></image>
				</view>
			</view>
			<view class="sx">
				<view :class='{"btn":true,"active":item.is}' v-for="(item,index) in sx" :key="index"
					@click="sxfun(index,item.is)">{{item.name}}
				</view>
			</view>
			<view v-if="scrollview" class="options">
				<scroll-view :class="['scroll-Y',selectOption[selectIndex].type=='button'?'mh':'']"
					:scroll-top="scrollTop" scroll-y="true" @scrolltoupper="upper" @scrolltolower="lower"
					@scroll="scroll">
					<view>
						<view v-for="(item,index) in selectOption[selectIndex].list"
							@click="que(item,selectIndex,index)"
							:class="['scroll-view-item',{'active':form.select[selectIndex].is==index}]" :key="index">
							<view>{{item.name}}</view>
							<image v-show="form.select[selectIndex].is==index" class="img" src="@/static/组 134@2x.png"
								mode="aspectFit">
							</image>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-sticky>
		<view class="list">
			<schoolHuodong :schoolHuodong="list1" title="host_unit" image="thumb" activityid="id"></schoolHuodong>
		</view>
		<uni-popup :animation="false" ref="popup123" type="bottom" @change="change2" @touchmove.stop.prevent="">
		</uni-popup>

	</view>
</template>

<script>
	import schoolHuodong from "@/components/school-huodong/school-huodong.vue";
	export default {
		components: {
			schoolHuodong
		},
		data() {
			return {
				moreselect: [],
				sx: [
					// 	{
					// 	name: "距离最近",
					// 	value: 1,
					// 	is: false
					// }, 
					{
						name: "免费活动",
						value: 2,
						is: false
					}
				],
				sxIndex: null,
				show: true,
				ispopup: true,
				keyword: '',
				close: require(`@/static/联合 5@2x.png`),
				current: 0,
				arr: require(`@/static/组 5@2x.png`),
				arrb: require(`@/static/组 8@2x2.png`),
				arrt: require(`@/static/组 8@2x.png`),
				selectOption: [{
						title: "区域",
						list: []
					},
					{
						title: "年龄",
						list: []
					},
					{
						title: "方式",
						list: [{
							"name": "所有",
							id: ""
						}, {
							"name": "线上",
							id: 1
						}, {
							"name": "线下",
							id: 2
						}]
					}
				],
				searchcolor: "#FFFFFF",
				form: {
					select: [{
						"name": "区域",
						"is": 0
					}, {
						"name": "年龄",
						"is": 0
					}, {
						"name": "方式",
						"is": 0
					}]
				},
				selectIndex: null,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				scrollview: false,
				list1: [],
				ad_info: {
					city: "深圳市"
				},
				formdata: {
					page: 1,
					limit: 10,
					activity_price: "",
					target_population: "",
					// latitude: "",
					// longitude: "",
					areaid: "",
					title: "",
					type: "",
					openid: ""
				},
				loadover: false
			}
		},
		onShow() {
			// let than = this;
			// uni.getStorage({
			// 	key: 'openid',
			// 	success: res => {
			// 		if (res.data) {
			// 			// than.formdata.openid = res.data;
			// 			than.authorizedPositioning()
			// 		}
			// 	},
			// 	fail: () => {
			this.authorizedPositioning()
			// 	}
			// });
		},
		onLoad() {
			// let than = this;
			// uni.getStorage({
			// 	key: 'openid',
			// 	success: res => {
			// 		if (res.data) {
			// 			than.formdata.openid = res.data;
			// 			// this.getList()
			// 			console.log("3")
			// 			than.authorizedPositioning()
			// 		}
			// 	},
			// 	fail: err => {
			// 		console.log("4")
			// 		this.getList()
			// 	}
			// });
		},
		onPageScroll(e) {
			if (e.scrollTop > 0) {}
		},
		onReachBottom() {
			if (!this.loadover) {
				this.formdata.page++
				this.getList()
			}
		},
		methods: {
			search(value) {
				console.log(this.keyword)
				this.formdata.page = 1
				this.formdata.title = this.keyword
				this.getList()
			},
			searchChange(val) {
				if (!val) {
					this.formdata.title = val
					this.getList()
				}
			},
			sxfun(index, flag) {
				this.sx[index].is = !this.sx[index].is
				// if(index==0){
				// 	this.formdata.sort = this.sx[index].is?0:1
				// }else if(index == 1){
				this.formdata.activity_price = this.sx[index].is ? "免费" : ""
				// }
				this.getList(false,true)
			},
			topage() {
				uni.$u.route(`/school/pages/location/index`);
			},
			totab(page) {
				console.log("/")
				uni.switchTab({
					url: `/pages/${page}/index`
				})
			},
			change2(e) {
				console.log(e)
				if (!e.show) {
					this.selectIndex = null
					this.scrollview = false
				}
			},
			que(item, selectIndex, index) {
				if (selectIndex == 0) {
					this.form.select[selectIndex].is = index;
					delete this.formdata.chenshi_areaid
					delete this.formdata.chenshi_cityid
					delete this.formdata.chenshi_provinceid
					delete this.formdata.province_name
					delete this.formdata.city_name
					delete this.formdata.area_name
					if(item && item.id==0){
						this.formdata.province_name = this.ad_info.province;
						if(this.ad_info.city){
							this.formdata.city_name = this.ad_info.city;
						}
						delete this.ad_info.class
					}
					if(item.class==4){
						this.formdata.chenshi_areaid = +item.id
					}else if(item.class==3){
						this.formdata.chenshi_cityid = +item.id
					}else if(item.class==2){
						this.formdata.chenshi_provinceid = +item.id
					}
				} else if (selectIndex == 1) {
					this.moreselect.push(index)
					this.form.select[selectIndex].is = index;
					this.formdata.target_population = item.id
				} else if (selectIndex == 2) {
					this.form.select[selectIndex].is = index;
					this.formdata.type = item.id
				}
				this.loadover = true;
				this.getList(true,true)
			},
			cancel() {
				for (let j = 0; j < this.form.select[3].list.length; j++) {
					this.form.select[3].list[j]["is"] = 0;
				}
			},
			setColor(color) {
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: color
				})
			},
			selectFun(index) {
				// const query = uni.createSelectorQuery().in(this);
				// query.select(".select").boundingClientRect((data) => {
				// 	uni.pageScrollTo({
				// 		scrollTop: 0,
				// 		duration: 0
				// 	})
				// }).exec()
				if (index == this.selectIndex) {
					this.selectIndex = null
					this.scrollview = false
					this.$refs.popup123.close()
				} else {
					this.selectIndex = index
					this.scrollview = true
					this.$refs.popup123.open('top')
				}
			},
			upper: function(e) {},
			lower: function(e) {},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			authorizedPositioning(callBack = () => {}) {
				this.getAge()
				let ad_info = getApp().globalData.ad_info;
				let _this = this;
				if (ad_info) {
					this.ad_info = ad_info;

					if ((ad_info.city_code + "").indexOf(ad_info.nation_code) != -1) {
						ad_info.city_code = +ad_info.city_code.split(ad_info.nation_code)[1] / 100
					}
					// this.formdata.latitude = ad_info.location.lat
					// this.formdata.longitude = ad_info.location.lng
					this.formdata.cityid = ad_info.city
					this.getList()
					this.getCity(ad_info.city || ad_info.province)
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
													let ad_info = res.result.ad_info;
													getApp().globalData.ad_info = ad_info;
													_this.ad_info = ad_info;
													if (ad_info.city_code.indexOf(ad_info
															.nation_code) != -1) {
														ad_info.city_code = +ad_info.city_code
															.split(ad_info.nation_code)[1] / 100
													}
													// _this.formdata.latitude = ad_info.location.lat
													// _this.formdata.longitude = ad_info.location.lng
													_this.formdata.cityid = ad_info.city
													_this.getList()
													_this.getCity(ad_info.city)
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
			},
			getCity(code) {
				let than = this;
				uni.request({
					url: `https://www.ieduchina.com/api.php?op=xc&do=city_info&id=${code}`,
					method: "GET",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.status == 1) {
							let data = res.data.data;
							data.unshift({
								name: "不限",
								id: than.ad_info.chenshi_id||0,
								class:than.ad_info.class||0
							})
							than.selectOption[0]['list'] = data
						}
					},
					error(res) {
						console.log(res)
					}
				})
			},
			getAge() {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=age",
					method: "GET",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.status == 1) {
							let age = [];
							for (let id in res.data.data) {
								age.push({
									id,
									name: res.data.data[id]
								})
							}
							than.selectOption[1]['list'] = age
						}
					},
					error(res) {
						console.log(res)
					}
				})
			},
			getList(flag,flag2) {
				let data = this.formdata,
					than = this;
				if (flag) {
					this.formdata.page = 1
					this.loadover = false;
				}
				if(!flag2){
					if (this.ad_info.chenshi_id) {
						delete data.chenshi_areaid
						delete data.chenshi_cityid
						delete data.chenshi_provinceid
						if(this.ad_info.class==4){
							data.chenshi_areaid = +this.ad_info.chenshi_id
						}else if(this.ad_info.class==3){
							data.chenshi_cityid = +this.ad_info.chenshi_id
						}else if(this.ad_info.class==2){
							data.chenshi_provinceid = +this.ad_info.chenshi_id
						}
						delete data.province_name
						delete data.city_name
						delete data.area_name
					} else {
						if(this.ad_info.province){
							data.province_name = this.ad_info.province
						}
						if(this.ad_info.city){
							data.city_name = this.ad_info.city
						}else if(this.ad_info.district){
							data.area_name = this.ad_info.district
						}
						delete data.chenshi_id
					}
				}
				delete data.cityid
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=activity_list",
					method: "POST",
					data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.status == 1) {
							if (res.data.data.page == 0) {
								than.loadover = true;
								than.list1 = [];
								wx.showToast({
									title: "暂时没有符合条件的活动",
									icon: "none"
								})
							} else if (res.data.data.length == 0) {
								than.loadover = true;
								wx.showToast({
									title: "数据加载完成",
									icon: "none"
								})
							} else if (res.data.data.page == 1) {
								than.list1 = res.data.data.list;
							} else {
								than.list1.push(...res.data.data.list);
							}
						} else {
							than.loadover = true;
							than.list1 = [];
							wx.showToast({
								title: "暂时没有符合条件的活动",
								icon: "none"
							})
						}
					},
					error(res) {
						console.log(res)
					},
					complete(response) {
						console.log("提交删选条件")
						than.$refs.popup123.close()
						than.selectIndex = null
						than.scrollview = false
					}
				})
			}
		},
		onPullDownRefresh() {
			for (let i = 0; i < this.form.select.length; i++) {
				this.form.select[i]["is"] = 0;
				if (this.form.select[i].list) {
					for (let j = 0; j < this.form.select[i].list.length; j++) {
						this.form.select[i].list[j]["is"] = 0;
					}
				}
			}
			uni.stopPullDownRefresh();
		}
	}
</script>

<style lang="scss" scoped>
	.p {
		// overflow: hidden;
		position: fixed;
		height: 100vh;
		width: 100vw;
	}

	.content {
		background-color: #F3F3F7;
		min-height: 100vh;

		.search {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12rpx 32rpx;
			background-color: rgba(255, 255, 255, 1);

			.address {
				margin-right: 24rpx;
				height: 64rpx;
				line-height: 64rpx;
				font-size: 28rpx;

				.img {
					width: 32rpx;
					height: 32rpx;
					vertical-align: -6rpx;
					margin-left: 8rpx;
				}
			}
		}

		.select {
			height: 88rpx;
			width: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			background-color: white;

			.option {
				text-align: center;

				.text {
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;

					&.active {
						color: rgba(48, 96, 251, 1);
					}
				}

				.img {
					width: 28rpx;
					height: 28rpx;
					vertical-align: -4rpx;
					margin-left: 4rpx;
				}
			}
		}

		.sx {
			display: flex;
			height: 88rpx;
			align-items: center;
			width: 100%;
			background-color: white;

			.btn {
				background: white;
				border-radius: 24rpx;
				padding: 0 20rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				height: 40rpx;
				line-height: 40rpx;
				border: 0;
				margin-right: 12rpx;

				&:first-of-type {
					margin-left: 32rpx;
				}

				&.active {
					color: white;
					background: #3060FB;
				}
			}
		}

		.list {
			width: 100%;
			margin-top: 24rpx;
		}

		.options {
			position: relative;
			margin-top: -88rpx;
			background-color: white;
		}

		.scroll-Y {
			max-height: 650rpx;
			background-color: white;
			padding: 0 32rpx;
			width: 100%;
			box-sizing: border-box;
			overflow-scrolling: touch;

			&.mh {
				max-height: inherit;
				padding-bottom: 32rpx;
			}

			.scroll-view-item {
				height: 92rpx;
				line-height: 92rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				border-bottom: solid 2rpx rgba(238, 238, 238, 1);

				&.active {
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #3060FB;

					.img {
						width: 44rpx;
						height: 44rpx;
					}
				}
			}

			.scroll-view-item_H {
				display: inline-block;
				width: 100%;
				height: 300rpx;
				line-height: 300rpx;
				text-align: center;
				font-size: 36rpx;
			}

			.else {
				margin-top: 30rpx;

				&:nth-of-type(n+2) {
					.listtitle {
						margin-top: 60rpx;
					}
				}


				.listwrap {
					display: flex;
					flex-wrap: wrap;
					padding-bottom: 20rpx;

					.lis {
						box-sizing: border-box;
						margin-right: 20rpx;
						width: 156rpx;
						height: 60rpx;
						border-radius: 30rpx;
						border: 2rpx solid #DDDDDD;
						font-size: 28rpx;
						font-weight: 400;
						color: #666666;
						text-align: center;
						line-height: 60rpx;
						margin-top: 24rpx;

						&.active {
							background-color: rgba(48, 96, 251, 1);
							border-color: rgba(48, 96, 251, 1);
							color: white;
						}

						&:nth-of-type(4n) {
							margin-right: 0;
						}
					}
				}
			}

			.btns {
				display: flex;
				justify-content: space-around;
				margin-top: 44rpx;

				::v-deep .u-button {
					width: 332rpx;
					height: 80rpx;
					background: #E5E5E5;
					border-radius: 40rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: #666666;

					&:last-of-type {
						background-color: #3060FB;
						color: white;
					}
				}
			}
		}
	}
</style>

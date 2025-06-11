<template>
	<view class="content">
		<u-sticky @touchmove.stop.prevent="" offset-top="0" zIndex="2000">
			<view class="search">
				<view @click="topage" class="address">{{ad_info.city || ad_info.province || '···'}}
					<image class="img" :src="arr"></image>
				</view>
				<u-search height="64" animation=true placeholder="搜索学校" bgColor="#F3F3F7" searchIconSize=46
					placeholderColor="#999999" @search="search" @custom="search" v-model="formdata.keyword" @clear="clear"
					:clearabled="true"></u-search>
			</view>
			<view class="select" ref="select">
				<view class="option" v-for="(item,index) in selectOption" @click="selectFun(index)" :key="index">
					<text :class="['text',selectIndex==index?'active':'']">
						{{(form.select[index].is>0)?selectOption[index].list[form.select[index]['is']]['name']:item.title}}
					</text>
					<image v-if="selectIndex==index" class="img" :src="arrb" mode="aspectFill">
					</image>
					<image v-else class="img" :src="arrt" mode="aspectFill"></image>
				</view>
			</view>
			<view v-if="scrollview" class="options">
				<scroll-view :class="['scroll-Y',selectOption[selectIndex].type=='button'?'mh':'']"
					:scroll-top="scrollTop" scroll-y="true" @scroll="scroll">
					<view v-if="selectOption[selectIndex].type=='button'">
						<view v-for="(el,index) in selectOption[selectIndex].list" class="else" :key="index">
							<view class="listtitle">{{el.name}}</view>
							<view class="listwrap">
								<view v-for="(ee,i) in el.list"
									:class="['lis',{'active':form.select[selectIndex]['list'][index]['is']==i}]"
									@click="que(selectIndex,i,index)">{{ee.name}}</view>
							</view>
						</view>
						<view class="btns">
							<u-button shape="circle" @click="cancel" text="重置"></u-button>
							<u-button shape="circle" @click="save" text="完成"></u-button>
						</view>
					</view>
					<view v-else>
						<view v-for="(item,index) in selectOption[selectIndex].list"
							@click="que(selectIndex,index,item)"
							:class="['scroll-view-item',{'active':form.select[selectIndex].is==index}]" :key="index">
							<view>{{item.name}}</view>
							<image v-show="form.select[selectIndex].is==index" class="img"
								src="../../static/组 134@2x.png" mode="aspectFit">
							</image>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-sticky>
		<uni-popup :animation="false" ref="popup123" type="bottom" @change="change2" @touchmove.stop.prevent="">
		</uni-popup>
		<schoolProfile :schoolProfile="school" gradeid="grade_name" name="title" curriculumid="kechen_name"
			isUserid=true>
		</schoolProfile>
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
				formdata: {
					curriculumid: "",
					gradeid: "",
					school_labelid: "",
					school_type: "",
					tuition_range: "",
					page: 1,
					keyword:""
				},
				arr: require(`@/static/组 5@2x.png`),
				arrb: require(`@/static/组 8@2x2.png`),
				arrt: require(`@/static/组 8@2x.png`),
				selectOption: [{
						title: "区域",
						list: [{
							"name": "所有",
							id: 0
						}]
					},
					{
						title: "课程",
						list: [{
							"name": "所有",
							id: 0
						}]
					},
					{
						title: "学段",
						list: []
					},
					{
						title: "更多",
						type: "button",
						list: [{
							"name": "学校状态",
							"list": []
						}, {
							"name": "办学性质",
							"list": [{
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
							}]
						}, {
							"name": "学费范围",
							"type": "button",
							"list": []
						}]
					},
				],
				ad_info: {
					city: "..."
				},
				form: {
					select: [{
						"name": "区域",
						"is": 0
					}, {
						"name": "课程",
						"is": 0
					}, {
						"name": "学段",
						"is": 0
					}, {
						"name": "更多",
						"list": [{
							"name": "学校状态",
							"is": 0
						}, {
							"name": "办学性质",
							"is": 0
						}, {
							"name": "学费范围",
							"is": 0
						}]
					}]
				},
				school: [],
				selectIndex: null,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				scrollview: false,
				isFirst: true
			}
		},
		onShow() {
			if (this.isFirst) {
				this.authorizedPositioning();
			}

		},
		onLoad() {
			this.getGrade();
			this.getKechen();
			this.xuefeilet();
			if (this.isFirst) {
				this.authorizedPositioning();
			}
		},
		watch: {
			ad_info: {
				deep: true,
				handler() {
					if (this.isFirst) {
						this.authorizedPositioning();
					}
				}
			}
		},
		methods: {
			clear() {
				this.formdata.keyword = "";
				this.formdata.page = 1
				this.getdata()
			},
			search(value) {
				this.formdata.keyword = value;
				this.formdata.page = 1
				this.getdata()
			},
			getdata() {
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
					url: "https://www.ieduchina.com/api.php?op=xc&do=school_list",
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: this.formdata,
					success: (res) => {
						if (res.data.data.count == 0 || res.data.data == "") {
							than.loadover = true;
							than.school = [];
							wx.showToast({
								title: "暂时没有相关学校信息",
								icon: "none"
							})
						} else if (res.data.data.list.length == 0) {
							than.loadover = true;
							wx.showToast({
								title: "数据加载完成",
								icon: "none"
							})
						} else if (than.formdata.page == 1) {
							than.school = [];
							for (let i = 0; i < res.data.data.list.length; i++) {
								than.school.push(res.data.data.list[i])
							}
							than.formdata.page++
						} else {
							than.school.push(...res.data.data.list);
							than.formdata.page++
						}
					},
					fail: () => {}
				})
			},
			getCity(city) {
				let than = this;
				uni.request({
					url: `https://www.ieduchina.com/api.php?op=xc&do=city_info&id=${city}`,
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data.status == 1) {
							let data = res.data.data;
							data.unshift({
								name: "不限",
								id: than.ad_info.chenshi_id || 0,
								class: than.ad_info.class || 0
							})
							than.selectOption[0].list = data;
							this.form.select[0].is = 0;
						}
					},
					fail: () => {}
				})
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
							let data = [{
								id: 0,
								name: "不限",
								id: ""
							}];
							for (let var1 in res.data.data) {
								data.push({
									id: var1,
									name: res.data.data[var1]
								})
							}
							than.selectOption[2].list = data;
						}
					},
					fail: () => {}
				})
			},
			xuefeilet() {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=xuefei",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data.status == 1) {
							let label = [{
									id: 0,
									name: "不限"
								}],
								xuefei = [{
									id: 0,
									name: "不限"
								}];
							for (let var1 in res.data.data.label) {
								label.push({
									id: var1,
									name: res.data.data.label[var1]
								})
							}
							for (let var1 in res.data.data.xuefei) {
								xuefei.push({
									id: var1,
									name: res.data.data.xuefei[var1]
								})
							}
							than.selectOption[3].list[0].list = label;
							than.selectOption[3].list[2].list = xuefei;
						}
					}
				})
			},
			getKechen() {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=kechen",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data.status == 1) {
							let data = [{
								id: 0,
								name: "不限"
							}];
							for (let var1 in res.data.data) {
								data.push({
									id: var1,
									name: res.data.data[var1]
								})
							}
							than.selectOption[1].list = data;
						}
					}
				})
			},
			topage() {
				uni.$u.route(`/school/pages/location/index`);
			},
			authorizedPositioning() {
				this.ad_info = getApp().globalData.ad_info;
				this.isFirst = false;
				setTimeout(() => {
					this.isFirst = true
				}, 1000)
				let than = this;
				this.formdata.page = 1
				if (this.ad_info) {
					this.getdata()
					this.getCity(this.ad_info.city || this.ad_info.province)
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
													getApp().globalData.ad_info = than.ad_info = res.result.ad_info;;
													than.getdata()
													than.getCity(than.ad_info.city)
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
			change2(e) {
				console.log(e)
				if (!e.show) {
					this.selectIndex = null
					this.scrollview = false
				}
			},
			que(selectIndex, index, num) {
				if (num) {
					if (num.class) {
						this.ad_info.class = num.class;
					}
					if (num.id) {
						this.ad_info.chenshi_id = num.id;
					} else if (num.id == 0) {
						this.formdata.province_name = this.ad_info.province;
						if (this.ad_info.city) {
							this.formdata.city_name = this.ad_info.city;
						}
						delete this.ad_info.class
					}
				}
				if (num >= 0) {
					this.form.select[selectIndex]['list'][num].is = index;
				} else {
					this.form.select[selectIndex].is = index;
					this.formdata.page = 1
					this.subform()
				}
			},
			subform() {
				this.formdata.curriculumid = this.selectOption[1].list[this.form.select[1].is].id
				this.formdata.gradeid = this.selectOption[2].list[this.form.select[2].is].id
				this.formdata.school_labelid = this.selectOption[3].list[0].list[this.form.select[3].list[0].is].id
				this.formdata.school_type = this.selectOption[3].list[1].list[this.form.select[3].list[1].is].id
				this.formdata.tuition_range = this.selectOption[3].list[2].list[this.form.select[3].list[2].is].id
				this.$refs.popup123.close()
				this.selectIndex = null
				this.scrollview = false
				this.getdata()
			},
			save() {
				this.formdata.page = 1
				this.subform()
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
				const query = uni.createSelectorQuery().in(this);
				query.select(".select").boundingClientRect((data) => {
					uni.pageScrollTo({
						scrollTop: 270,
						duration: 0
					})
				}).exec()
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
			scroll: function(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
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
		},
		onReachBottom() {
			this.getdata()
		},
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
			height: 88rpx;
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
			justify-content: space-evenly;
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

		.scroll-Y {
			max-height: 650rpx;
			background-color: white;
			padding: 0 32rpx;
			width: 100%;
			box-sizing: border-box;

			&.mh {
				max-height: inherit;
				padding-bottom: 32rpx;
			}

			// .scroll-view_H {
			// 	white-space: nowrap;
			// 	width: 100%;
			// }

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
						min-width: 136rpx;
						padding: 0 10rpx;
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

				::v-deep.u-button {
					width: 332rpx;
					height: 80rpx;
					background: #E5E5E5;
					border-radius: 40rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: #666666;

					&:last-of-type {
						background: #3060FB;
						color: white;
					}
				}
			}
		}
	}
</style>

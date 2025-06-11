<template>
	<view class="container">
		<!-- 城市列表 -->
		<view v-show="!isReach">
			<view class="top-search">
				<u-search height="64" :showAction="false" animation=true bgColor="#F3F3F7" searchIconSize=46
					placeholderColor="#999999" clearabled="false" :inputValue="inputValue" placeholder="输入城市名"
					:focus="searchFocus" @input="searchChange"></u-search>
			</view>
			<scroll-view class="scroll-view" scroll-y scroll-with-animation="true" enable-back-to-top="true"
				:scroll-into-view="toIndex" @scroll="scrollHandle">
				<view class="top" v-if="!searchData.length">
					<view class="title">定位地址</view>
					<view class="btns">
						<button class="btn" type="default" style="width: auto;" @click="selectCity(position_ad_info)">
							<image class="img" src="@/static/组 167@2x.png" mode="aspectFit"></image>
							{{position_ad_info.city || position_ad_info.district || position_ad_info.province||"···"}}
						</button>
					</view>
					<view class="title">热门城市</view>
					<view class="btns">

						<button v-for="(item,index) in hotcity" class="btn" type="default" @click="selectCity(item)" :key="index">{{item.name}}</button>
					</view>
				</view>
				<!-- 城市列表  -->
				<view class="city-list" v-if="!searchData.length">
					<view class="list list-item" v-for="(item, key) of cityes " :key="key" :id="key">
						<view class="title">{{ key }}</view>
						<view class="item borderBottom" hover-class="hover" v-for="innerItem in item"
							:key="innerItem.id" @click="selectCity(innerItem)">
							{{ innerItem.name }}
						</view>
					</view>
				</view>
				<view class="city-list" v-else>
					<view class="list list-item" v-for="(item, key) of searchData " :key="key" :id="key">
						<view class="item borderBottom" hover-class="hover" :key="innerItem.id" @click="selectCity(item)">
							{{ item.name }}
						</view>
					</view>
				</view>
			</scroll-view>

			<!-- 字母列表 -->
			<view v-if="!searchData.length" class="alphabet" @touchstart="touchStart" @touchend="touchEnd" @touchmove.stop="touchMove">
				<view v-for="(item, index) in alphabet" :key="index" @touchstart="getLetter" @touchend="setLetter"
					:id="item">
					<view class="item" :class="{ active: currentLetter == item }">
						{{ item }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isIPX: null,
				regionId: null, //区域ID
				isToggle: true,
				isReach: false,
				inputValue: "",
				searchData: [], //搜索的数据
				isClearBtn: false,

				// regionList: City.data.area, //区域列表,模拟数据请自行修改
				cityName: null, //城市名
				areaName: '东城区', //区域名,模拟数据请自行修改

				cityes: [], //城市列表,拟数据请自行修改
				alphabet: [], //字母列表
				toIndex: "", //跳转的索引的字母
				tipsLetter: "", //滑动显示字母
				timer: null,
				hasNoData: false,
				searchFocus: false,
				letterDetails: [],
				currentLetter: "area", //默认选择hot
				city:"",
				hotcity: [],
				citys:{},
				ad_info:{},
				position_ad_info:{}
			};
		},
		watch: {
			// 城市搜索输入框
			inputValue(newVal) {
				this.isClearBtn = newVal ? true : false;

				if (this.timer) {
					clearTimeout(this.timer);
				}

				if (!this.inputValue) {
					this.searchData = [];
					return;
				}
				this.timer = setTimeout(() => {
					const result = [];
					for (let i in this.cityes) {
						this.cityes[i].forEach(item => {
							if (
								item.spell.includes(this.inputValue) ||
								item.name.includes(this.inputValue)
							) {
								result.push(item);
							}
						});
					}
					this.searchData = result;
					if (this.searchData.length === 0) {
						this.hasNoData = true;
					} else {
						this.hasNoData = false;
					}
				}, 500);
			},
			isReach(val) {
				this.searchFocus = val;
			}
		},
		created() {
			let than = this;
			// if(getApp().globalData.ad_info){
			// 	than.citys = getApp().globalData.ad_info;
			// 	than.hotcity=than.citys.hotcity;
			// 	than.cityes=than.citys.cityes;
			// 	than.alphabet=than.citys.alphabet;
			// }else{
				uni.showToast({
					title:"加载中...",
					icon:"loading"
				})
				uni.request({
					method: "GET",
					url: "https://www.ieduchina.com/api.php?op=xc&do=city",
					dataType: "json",
					success(res) {
						if (res.data.status == 1) {
							than.citys =res.data.data;
							// getApp().globalData.ad_info = than.citys
							than.hotcity=than.citys.hotcity;
							than.cityes=than.citys.cityes;
							than.alphabet=than.citys.alphabet;
						}
					},
					error() {
						
					},
					complete() {
						setTimeout(()=>{
							uni.hideToast()
						},2000)
					}
				})
			// }
			
		},
		onLoad() {
				this.ad_info = getApp().globalData.ad_info;
				this.authorizedPositioning();
		},
		methods: {
			//列表滚动，和右边字母表对应
			scrollHandle(e) {
				let view = uni.createSelectorQuery().in(this).selectAll(".list-item");
				view.boundingClientRect(d => {
					let top = d[0].top;
					d.forEach(item => {
						item.top = item.top - top;
						item.bottom = item.bottom - top;
						this.letterDetails.push({
							id: item.id,
							top: item.top,
							bottom: item.bottom
						});
					});
				}).exec();

				const scrollTop = e.detail.scrollTop;
				this.letterDetails.some(item => {
					if (scrollTop >= item.top && scrollTop <= item.bottom - 20) {
						this.currentLetter = item.id;
						//当前固定用的是粘性定位，如果不用粘性定位，在这里设置
						return true;
					}
				});
			},


			//搜索
			searchChange(value) {
				this.searchData = [];
				let cityes = this.cityes;
				let trimvalue = ""
				if (value) {
					trimvalue = value.trim();
				}
				if (trimvalue) {
					for (let key in cityes) {
						for (let i = 0; i < cityes[key].length; i++) {
							if ((cityes[key][i].name+"").indexOf(trimvalue) != -1 || (cityes[key][i].id+"").indexOf(trimvalue) != -1 || (cityes[key][i].spell+"").indexOf(trimvalue) != -1) {
								this.searchData.push(cityes[key][i])
							}
						}
					}
				}
			},

			//搜索结果列表数据
			citySearchList(item) {
				console.log('选择的城市：', item)
			},
			selectCity(item) {
				// getApp().globalData.ad_info.city = item.name;
				// getApp().globalData.ad_info.city_code = item.id;
				// if(item.chengshiid){
				// 	getApp().globalData.ad_info.chenshi_id = 0
				// }else{
				// 	getApp().globalData.ad_info.class = item.class
				// 	getApp().globalData.ad_info.chenshi_id = item.id
				// }
				if(item.class==2 || item.class==3 || item.class==4){
					delete getApp().globalData.ad_info.province;
					delete getApp().globalData.ad_info.city;
					delete getApp().globalData.ad_info.district;
					getApp().globalData.ad_info.class = item.class
					getApp().globalData.ad_info.chenshi_id = item.id
					if(item.class==2){
						getApp().globalData.ad_info.province = item.name
					}else if(item.class==3){
						getApp().globalData.ad_info.city = item.name
					}else if(item.class==4){
						getApp().globalData.ad_info.district = item.name
					}
				}else{
					getApp().globalData.ad_info = item
				}
				//当前项目是需要选择到区域，所以选择城市后回到区县的地方
				this.toIndex = "";
				uni.navigateBack({
					delta:1
				})
			},

			//区域选择
			selectRegion(item) {
				console.log('选择的区域是：', item)
			},

			//触发开始
			touchStart(e) {
				// console.log(e);
			},
			//移动时
			touchMove(e) {
				uni.vibrateShort();
				let y = e.touches[0].clientY;
				let offsettop = e.currentTarget.offsetTop;

				//判断选择区域,只在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 15); //右边每个字母元素的高度
					let letter = this.alphabet[num];
					this.tipsLetter = letter;

					let curentLetter = this.letterTransform(letter);
					uni.showToast({
						title: curentLetter,
						icon: "none",
						duration: 1000
					});
				}
			},
			//触发结束
			touchEnd() {
				this.toIndex = this.tipsLetter;
			},
			//移动开始获取字母，并放大提示
			getLetter(e) {
				uni.vibrateShort();
				let {
					id
				} = e.currentTarget;
				this.tipsLetter = id;

				let curentLetter = this.letterTransform(id);
				uni.showToast({
					title: curentLetter,
					icon: "none",
					duration: 1000
				});
			},
			//移动结束设置字母，赋值到toIndex
			setLetter() {
				this.toIndex = this.tipsLetter;
			},

			//提示字母转换
			letterTransform(letter) {
				let str = "";
				if (letter == "area") {
					str = "区县";
				} else if (letter == "hot") {
					str = "热门";
				} else {
					str = letter;
				}

				return str;
			},
			authorizedPositioning(callBack = () => {}) {
				let than = this;
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
												than.position_ad_info = res.result.ad_info
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
			},
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F3F3F7;
	}

	.borderBottom {
		position: relative;
		background-color: white;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 1px;
			background: #c1c2cd;
			transform: scaleY(0.5);
		}
	}

	.top {
		text-align: left;
		padding-left: 32rpx;
		padding-bottom: 40rpx;

		.title {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			padding-top: 64rpx;

			&:first-of-type {
				padding-top: 28rpx;
			}

		}

		.btns {
			display: flex;
			justify-content: flex-start;
			margin-top: 28rpx;

			.btn {
				box-sizing: border-box;
				width: 156rpx;
				height: 60rpx;
				background: #FFFFFF;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				margin-left: 14rpx;
				margin-right: 0;
				line-height: 60rpx;
				text-align: center;

				.img {
					width: 32rpx;
					height: 32rpx;
					vertical-align: -6rpx;
					margin-left: -20rpx;
				}

				&:first-of-type {
					margin-left: 0;
				}
			}
		}
	}

	.reach-content {
		padding-top: 60rpx;

		.li {
			font-size: 32rpx;
			color: #333;
			padding: 20rpx 0;
			position: relative;
		}
	}

	.block {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.borderBottom {
		position: relative;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: calc(100% - 50rpx);
			height: 1px;
			background: #c1c2cd;
			transform: scaleY(0.5);
		}
	}

	.top-search {
		height: 88rpx;
		line-height: 88rpx;
		box-sizing: border-box;
		padding: 0 32rpx;
		background-color: rgba(255, 255, 255, 1);
	}

	.scroll-view {
		width: 100%;
		height: calc(100vh - 80rpx);
		box-sizing: border-box;
	}

	.area {
		padding-bottom: 40rpx;
		margin-bottom: 44rpx;

		.title-wrapp {
			position: sticky;
			top: 0;
			left: 0;
			background: #fff;
		}

		.title {
			width: 100%;
			box-sizing: border-box;
			font-size: 40rpx;
			font-weight: 500;
			color: #222;
			font-size: 30rpx;
			font-weight: 500;
			margin-bottom: 14rpx;
			display: inline-flex;
			justify-content: space-between;
			align-items: center;

			.r {
				font-size: 24rpx;
				color: #8e8f97;
				display: inline-block;
				align-items: center;

				.iconfont {
					font-size: 24rpx;
				}
			}
		}

		.ul {
			display: flex;
			flex-wrap: wrap;

			.li {
				width: 202rpx;
				padding: 0 10rpx;
				box-sizing: border-box;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				font-size: 26rpx;
				color: #222;
				border-radius: 10rpx;
				margin: 20rpx 20rpx 0 0;
				background: #f4f5f9;

				&.active {
					font-weight: 500;
					background: #ffde45;
				}
			}

			.hover {
				background: #ffde45;
			}
		}
	}

	.city-list {
		width: 100%;
		padding-bottom: 50rpx;

		.title {
			height: 92rpx;
			line-height: 92rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			background-color: #F3F3F7;
			padding-left: 32rpx;
			position: sticky;
			top: 0;
			left: 0;
			z-index: 2;
		}

		.item {
			padding: 0 32rpx;
			color: #333;
			font-size: 32rpx;
			height: 92rpx;
			line-height: 92rpx;
			font-weight: 500;
			background-color: white;

			&::after {
				left: 30rpx;
				width: calc(100% - 30rpx);
				background: #d2d2d2;
			}
		}

		.hover {
			background: #f4f5f9;

			&::after {
				background: #f4f5f9;
			}
		}
	}

	.alphabet {
		position: fixed;
		right: 0;
		bottom: 20%;
		z-index: 20;
		width: calc(750rpx - 680rpx);
		text-align: center;
		font-size: 20rpx;
		font-weight: 700;
		color: #8e8f97;

		.item {
			height: 15px;
			line-height: 15px;
		}

		.active {
			color: #222;
		}
	}

	.has-no-data {
		font-size: 24rpx;
		text-align: center;
		color: #8e8f97;
		margin-top: 50rpx;
	}
</style>

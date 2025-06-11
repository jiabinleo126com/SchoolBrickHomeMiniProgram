<template>
	<view class="content">
		<view>
			<tanxiaoItem :tanxiaoItem="[info]" address="school_address" schoolid="collegeid" pagelink="/school/pages/schooldetail/index"></tanxiaoItem>
		</view>
		<view class="block">
			<view class="li">
				<view class="left">预约手机号</view>
				<view class="right" v-text="info['mobile']||''"></view>
			</view>
		</view>
		<view class="block">
			<view class="li">
				<view class="left">姓名</view>
				<view class="right">{{info["name"]||''}}</view>
			</view>
			<!-- <view class="li">
				<view class="left">性别</view>
				<view class="right">{{setsex(info["sex"]||'')}}</view>
			</view>
			<view class="li">
				<view class="left">生日</view>
				<view class="right">{{setbirthday(info["birthday"]||'')}}</view>
			</view> -->
			<view class="li">
				<view class="left">目前在读年级</view>
				<view class="right">{{info["grade"]||''}}</view>
			</view>
		</view>
		<view class="block">
			<view class="li">
				<view class="left">创建时间</view>
				<view class="right">{{info["addtime"]||''}}</view>
			</view>
		</view>
		<view class="btns" v-if="btnsShow">
			<view class="del">
				<u-button type="primary" text="取消预约" shape="circle" plain=true color="rgba(102, 102, 102, 1)"
					space="2rpx" @click="submit(4)"></u-button>
			</view>
			<view class="submit">
				<u-button type="primary" text="确定到校" shape="circle" color="#3060FB" space="2rpx" @click="submit(2)">
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import tanxiaoItem from "@/components/tanxiao-item/tanxiao-item.vue";
	export default {
		components: {
			tanxiaoItem
		},
		data() {
			return {
				info: [],
				message: {},
				btnsShow: false,
				openid:null
			}
		},
		onLoad(option) {
			this.id = Number(option.id);
			let than = this;
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.openid = res.data;
						than.getData()
					}
				},
				fail: err => {
					uni.showModal({
						content: '请先登录',
						showCancel: true,
						success(res) {
							uni.switchTab({
								url: `/pages/my/index`
							})
						}
					});
					return false;
				}
			});
		},
		onShow() {},
		onPageScroll(e) {

		},
		methods: {
			formTime(time) {
				if (time) {
					time = Number(time + "000")
					let year = new Date(time).getFullYear();
					let month = new Date(time).getMonth() + 1;
					let date = new Date(time).getDate();
					let hour = new Date(time).getHours();
					let minutes = new Date(time).getMinutes();
					if (month < 10) {
						month = "0" + month
					}
					if (date < 10) {
						date = "0" + date
					}
					if (hour < 10) {
						hour = "0" + hour
					}
					if (minutes < 10) {
						minutes = "0" + minutes
					}
					return year + "年" + month + "月" + date + "日 " + hour + ":" + minutes
				} else {
					return ""
				}
			},
			topage(page) {
				console.log("/")
				uni.$u.route(`/pages/${page}/index`);
			},
			getData() {
				let {
					openid,
					id
				} = this;
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=user_yuyue_tanxiao",
					method: "POST",
					data: {
						openid,
						id
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.status == 1) {
							than.info = res.data.data.list[0];
							// than.btnsShow = than.info.status == 1
						}
					},
					error(res) {
						console.log(res)
					}
				})
			},
			submit(status) {
				let than = this;
				if (status == 4) {
					uni.showModal({
						content: '确认取消预约？',
						showCancel: true,
						confirmText: "确认",
						cancelText: "取消",
						success(result) {
							if (result.confirm) {
								than.postdata(4)
							}
						}
					});
				} else {
					than.postdata(2)
				}
			},
			postdata(status) {
				let {
					openid
				} = this;
				let schoolid = this.info.schoolid;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=applyedit",
					method: "POST",
					data: {
						openid,
						schoolid,
						status
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.code == 200) {
							uni.$u.route(`/my/pages/tanxiao/index`);
						}
					},
					error(res) {
						console.log(res)
					}
				})
			},
			setbirthday(time) {
				if (time) {
					time = Number(time + "000")
					return new Date(time).getFullYear() + "年" +
						(new Date(time).getMonth() + 1) + "月" +
						new Date(time).getDate() + "日"
				} else {
					return ""
				}
			},
			setparent_sex(val) {
				switch (val + "") {
					case "1":
						return "先生";
					case "2":
						return "女士";
					default:
						return "";
				}
			},
			setsex(val) {
				switch (val + "") {
					case "1":
						return "男";
					case "2":
						return "女";
					default:
						return "";
				}
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			console.log("加载更多")
		},
	}
</script>

<style lang="scss" scoped>
	.p {
		position: fixed;
		height: 100vh;
		width: 100vw;
	}

	.content {
		background-color: #F3F3F7;
		min-height: 100vh;
		padding-top: 1rpx;

		.block {
			margin: 24rpx 32rpx 0 32rpx;
			background-color: white;
			border-radius: 16rpx;
			padding: 16rpx 0;

			&:nth-of-type(2) {
				margin-top: -6rpx;
			}

			.li {
				padding: 0 24rpx;
				display: flex;
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
				line-height: 60rpx;

				.left {
					width: 220rpx;
				}

				.right {
					color: rgba(51, 51, 51, 1);
					flex: 1;
				}
			}
		}

		.btns {
			position: fixed;
			bottom: 0;
			width: 100%;
			left: 0;
			box-sizing: border-box;
			padding: 16rpx 32rpx 84rpx;
			background-color: white;
			display: flex;
			justify-content: space-between;

			.del {
				width: 216rpx;
				padding-right: 42rpx;
			}

			.submit {
				flex: 1;
			}
		}
	}
</style>

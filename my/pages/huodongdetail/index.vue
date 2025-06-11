<template>
	<view class="content">
		<view>
			<huodongItem :huodongItem="[info]" pagelink="/huodong/pages/detail/index" image="activity_logo"
				title="activity_name" price="activity_price" schoolname="school_name" activityid="activity_id" label="label_name">
			</huodongItem>
		</view>
		<view class="block">
			<view class="li">
				<view class="left">预约手机号</view>
				<view class="right">{{info.tel||""}}</view>
			</view>
		</view>
		<view class="block">
			<view class="li">
				<view class="left">姓名</view>
				<view class="right">{{info.name||""}}</view>
			</view>
			<!-- <view class="li">
				<view class="left">性别</view>
				<view class="right">{{setsex(info.sex)}}</view>
			</view>
			<view class="li">
				<view class="left">生日</view>
				<view class="right">{{setbirthday(info.birthday)}}</view>
			</view> -->
			<view class="li">
				<view class="left">目前在读年级</view>
				<view class="right">{{info.grade||""}}</view>
			</view>
		</view>
		<view class="block">
			<view class="li">
				<view class="left">创建时间</view>
				<view class="right">{{info.addtime||""}}</view>
			</view>
		</view>
		<!-- <view class="btns" v-if="btnsShow">
			<view class="del">
				<u-button type="primary" text="取消预约" shape="circle" plain=true color="rgba(102, 102, 102, 1)"
					space="2rpx" @click="submit(4)"></u-button>
			</view>
			<view class="submit">
				<u-button type="primary" text="确定到校" shape="circle" color="#3060FB" space="2rpx" @click="submit(2)">
				</u-button>
			</view>
		</view> -->
	</view>
</template>

<script>
	import huodongItem from "@/components/huodong-item/huodong-item.vue";
	export default {
		components: {
			huodongItem
		},
		data() {
			return {
				btnsShow: false,
				tabs: [{
					title: '待参加'
				}, {
					title: '已参加'
				}, {
					title: '已过期'
				}],
				tabsIndex: 0,
				list: [],
				info: {},
				openid: "",
				id: ""
			}
		},
		onLoad(option) {
			if (option.id) {
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
				});
			}
		},
		onShow() {},
		onPageScroll(e) {

		},
		methods: {
			topage(page) {
				uni.$u.route(`/pages/${page}/index`);
			},
			getData() {
				let {
					openid,
					id
				} = this;
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=user_yuyue_activity",
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						openid,id
					},
					success(res) {
						if (res.data.status == 1) {
							than.info = res.data.data.list[0];
							than.btnsShow = than.info.status == 1
						}
					},
					error(res) {
						console.log(res)
					}
				})
			},
			formTime(time) {
				if (time) {
					time = Number(time + "000")
					return new Date(time).getFullYear() + "年" +
						(new Date(time).getMonth() + 1) + "月" +
						new Date(time).getDate() + "日 " +
						new Date(time).getHours() + ":" +
						new Date(time).getMinutes()
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
					openid,
					activityid
				} = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=applyedit",
					method: "POST",
					data: {
						openid,
						activityid,
						status
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.code == 200) {
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2];
							prevPage.$vm.getData()
							uni.navigateBack({
								delta: 1
							})
							return false;
						}
					},
					error(res) {
						console.log(res)
					}
				})
			}
		}
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

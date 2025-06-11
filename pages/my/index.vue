<template>
	<view class="container">
		<view class="top">
			<view class="user" @click="showLogin">
				<view v-if="islogin" class="msg">
					<image class="image" :src="users.avatarUrl" mode="aspectFill"></image>
					<view class="name">{{ users.nickName }}</view>
					<image class="idet" @click="topage('usermsg',null)" :src="idetImg" mode="aspectFill"></image>
				</view>
				<view v-else class="msg">
					<image class="image" :src="userimg" mode="aspectFill"></image>
					<view class="name">点击登录</view>
				</view>
			</view>
			<!-- <view class="users">
				<button class="avatar-wrapper" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar">
					<image class="avatar" :src="avatarUrl"></image>
				</button>
				<input type="nickname" class="weui-input" placeholder="请输入昵称" />
			</view> -->
			<view class="ul">
				<view v-for="(item,index) in menu" class="li" @click="topage(item.link,null)" :key="index">
					<image class="img" :src="item.img" mode=""></image>
					<view class="text">{{item.title}}</view>
				</view>
			</view>
		</view>
		<view class="list">
			<u-cell-group border=false :customStyle="customStyle1">
				<block v-for="(item,index) in list" :key="index">
					<u-cell @click="topage(item.link,item.login)" :title="item.title" :isLink=true
						arrow-direction="right" :rightIconStyle="rightIconStyle1"></u-cell>
				</block>
			</u-cell-group>
		</view>
		<u-popup :show="show" @close="close" :round="32">
			<view class="login-wrap">
				<button @click="login" type="default">一键登录</button>
				<button @click="close" type="default">取消</button>
			</view>
		</u-popup>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				show: false,
				islogin: false,
				users: {
					nickName: "",
					avatarUrl: ""
				},
				session: '',
				openid: '',
				idetImg: require(`@/static/组1685@2x.png`),
				avatarUrl: "",
				defaultAvatarUrl: require(`@/static/图像 57@2x.png`),
				defaultNickName: "微信用户",
				userimg: require(`@/static/默认头像.png`),
				customStyle1: {
					"font-size": "28rpx",
					"font-weight": "400",
					"color": "#333333",
					"text-indent": "-1em"
				},
				rightIconStyle1: {
					"font-size": "28rpx",
					"font-weight": "400",
					"color": "#333333",
				},
				menu: [{
						title: "活动预约",
						img: require(`@/static/组 1681@2x.png`),
						link: "huodong"
					},
					{
						title: "探校预约",
						img: require(`@/static/组 1682@2x.png`),
						link: "tanxiao"
					}
				],
				list: [{
					title: "孩子信息",
					link: "children"
				}, {
					title: "我的关注",
					link: "follow"
				}, {
					title: "我的收藏",
					link: "collection"
				}, {
					title: "我的动态",
					link: "dynamic"
				}, {
					title: "浏览记录",
					link: "record"
				}, {
					title: "关于我们",
					link: "about",
					login: 1
				}, {
					title: "联系我们",
					link: "contact",
					login: 1
				}, ]
			}
		},
		onShow() {
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						this.islogin = true;
						this.openid = res.data;
					}
				}
			});
			uni.getStorage({
				key: 'users',
				success: res => {
					if (res.data) {
						this.users = res.data;
					}
				}
			});
		},
		methods: {
			close() {
				this.show = false;
			},
			topage(page, login) {
				if (login) {
					uni.$u.route(`/my/pages/${page}/index`);
				} else {
					if (this.islogin) {
						if (page) {
							uni.$u.route(`/my/pages/${page}/index`);
						}
					} else {
						this.showLogin()
					}
				}
			},
			// onChooseAvatar(e) {
			// 	const {
			// 		avatarUrl
			// 	} = e.detail
			// 	this.avatarUrl = avatarUrl;
			// 	this.GetUserInfo()
			// },
			showLogin() {

				// uni.getUserProfile({
				// 	desc: '正在获取',
				// 	success: res => {
				// 		console.log('user');
				// 		console.log(res);
				if (!this.islogin) {
					this.show = true
				}
				// 	},
				// 	fail: err => {
				// 		console.log('获取失败: ', err);
				// 	}
				// });
			},
			login() {
				uni.showToast({
					icon: "loading"
				})
				uni.login({
					success: res => {
						if (res.code) {
							this.getOpenid(res.code);
						}
					}
				});
			},
			getOpenid(code) {
				let than = this;
				uni.request({
					url: 'https://www.ieduchina.com/api.php?op=xc&do=get_openid',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						code
					},
					success: res => {
						if (res.data.status == 1) {
							than.islogin = true;
							than.show = false;
							uni.setStorage({
								key: 'openid',
								data: res.data.data.openid,
								success: () => {
									this.openid = res.data.data.openid;
								}
							});
							let users = {
								nickName: res.data.data.name || (this.defaultNickName + this
									.randomCoding()),
								avatarUrl: res.data.data.avatarUrl || this.defaultAvatarUrl,
								mobile: res.data.data.mobile||""
							}
							if (!res.data.data.name || !res.data.data.avatarUrl) {
								than.saveUserInfo(users)
							}
							uni.setStorage({
								key: 'users',
								data: users,
								success: () => {
									this.users = users
								}
							});
							uni.hideToast()
							// userInfo.openid = res.data.data.openid;
							// than.saveUserInfo(userInfo)
						} else {
							uni.showModal({
								content: '登录失败，请重新登录',
								showCancel: false
							});
						}
					},
					fail: () => {
						uni.showModal({
							content: '登录失败，请重新登录',
							showCancel: false
						});
					}
				});
			},
			randomCoding() {
				//创建26个字母数组
				var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
					'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
				];
				var idvalue = '';
				let n = 6; //这个值可以改变的，对应的生成多少个字母，根据自己需求所改
				for (var i = 0; i < n; i++) {
					idvalue += arr[Math.floor(Math.random() * 26)];
				}
				return idvalue;
			},
			saveUserInfo(userInfo) {
				let {
					nickName,
					avatarUrl,
					mobile
				} = userInfo;
				let openid = this.openid
				if (!mobile) {
					mobile = ""
				}
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=user_edit",
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						name: nickName,
						avatarUrl,
						mobile,
						openid
					},
					success: () => {},
					fail: () => {}
				})
			},
			// saveUserInfo(userInfo) {
			// 	console.log(userInfo)
			// 	uni.request({
			// 		url: "https://www.ieduchina.com/api.php?op=xc&do=user_edit",
			// 		method: 'POST',
			// 		header: {
			// 			'Content-Type': 'application/x-www-form-urlencoded'
			// 		},
			// 		data: userInfo,
			// 		success: () => {},
			// 		fail: () => {}
			// 	})
			// },
			getPhoneNumber(e) {
				console.log(e.detail.code)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		background-color: #F3F3F7;
		min-height: 100vh;

		.top {
			background: linear-gradient(180deg, #C2D4FF 0%, #F3F3F7 100%);

			.user {
				.msg {
					display: flex;
					align-items: center;
					box-sizing: border-box;
					width: 100%;
					padding: 48rpx 32rpx 70rpx;
				}

				.image {
					width: 112rpx;
					height: 112rpx;
					border-radius: 50%;
				}

				.name {
					margin-left: 32rpx;
					height: 112rpx;
					line-height: 112rpx;
					font-size: 36rpx;
					font-weight: 500;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: 500rpx;
					flex: 1;
				}

				.idet {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.ul {
				padding: 0 30rpx;
				box-sizing: border-box;
				margin: 0 auto;
				display: flex;
				justify-content: space-around;
				font-size: 0;

				.li {
					text-align: center;
					width: 333rpx;
					height: 160rpx;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					padding: 0 34rpx;

					&:first-of-type {
						background: linear-gradient(141deg, #A4C3FF 0%, #7A90FB 100%);
					}

					&:last-of-type {

						background: linear-gradient(143deg, #BCAFFE 0%, #A797FF 60%, #A797FF 60%, #9A88FF 100%);
					}

					.img {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}

					.text {
						font-size: 36rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
			}
		}

		.users {
			button {
				width: 100%;
				height: 40rpx;
			}
		}

		.list {
			padding: 30rpx 32rpx 30rpx;
			width: 100%;
			box-sizing: border-box;

			::v-deep .u-cell-group {
				padding: 0 24rpx;
				border-radius: 16rpx;
				background-color: white;

				::v-deep .u-cell-group__wrapper {
					::v-deep .u-cell {
						height: 92rpx;

						::v-deep .u-line {
							border-color: transparent;
						}
					}
				}
			}

			.contact {
				position: absolute;
				left: 0;
				opacity: 0;
				width: 100%;
			}
		}

		.login-wrap {
			height: 360rpx;
			background: linear-gradient(180deg, #DAE3FB 0%, #FFFFFF 100%);
			border-radius: 30rpx 30rpx 0 0;
			padding-top: 44rpx;
			box-sizing: border-box;

			button {
				margin-top: 40rpx;
				width: 626rpx;
				height: 88rpx;
				background: #3060FB;
				border-radius: 44rpx;
				font-size: 36rpx;
				font-weight: 400;
				color: #FFFFFF;
				overflow: hidden;
				border: solid 2rpx #3060FB;

				&:last-of-type {
					border-color: #999999;
					color: #999999;
					background-color: white;
				}
			}
		}
	}
</style>

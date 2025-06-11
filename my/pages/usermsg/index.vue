<template>
	<view class="container">
		<view class="ul">
			<view class="li">
				<view class="title">头像</view>
				<view class="text">
					<image :src="users.avatarUrl" mode="aspectFill"></image>
					<!-- <button open-type="chooseAvatar" @chooseavatar="onChooseAvatar"></button> -->
					<u-upload :fileList="fileList1" @afterRead="afterRead" name="1" :maxCount="1"></u-upload>
				</view>
			</view>
			<view class="li">
				<view class="title">昵称</view>
				<view class="text">
					<input type="nickname" placeholder="请输入用户昵称" @blur="getnickname" :value="users.nickName">
				</view>
			</view>
			<view class="li">
				<view class="title">手机号</view>
				<view class="text">
					<input type="text" placeholder="请输入手机号" v-model="users.mobile">
				</view>
			</view>
		</view>
		<button class="submit" @click="submit">确定</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList1: [],
				users: {
					mobile: "",
					nickName: "",
					avatarUrl: ""
				},
				openid: ""
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'users',
				success: res => {
					if (res.data) {
						this.users = res.data;
						if (!this.users.mobile) {
							this.users.mobile = ""
						}
					}
				}
			});
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						this.openid = res.data;
					}
				}
			});
		},
		methods: {
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				let than = this;
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'https://www.ieduchina.com/api.php?op=xc&do=upload_img',
						filePath: url,
						name: 'file',
						sizeType:"compressed",
						formData: {
							user: 'test'
						},
						success: (res) => {
							if(res.data){
								than.users.avatarUrl = res.data;								
							}
						}
					});
				})
			},
			onChooseAvatar(e) {
				// const {
				// 	avatarUrl
				// } = e.detail
				// console.log(avatarUrl)
				// this.users.avatarUrl = avatarUrl;
			},
			getnickname(e) {
				debugger
				this.users.nickName = e.detail.value;
			},
			submit() {
				this.saveUserInfo(this.users)
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
					success: () => {
						uni.setStorage({
							key: 'users',
							data: this.users,
							success: () => {
								uni.showToast({
									title: "修改成功"
								})
								uni.navigateBack({
									delta: 1
								})
							}
						});
					},
					fail: () => {
						uni.showToast({
							title: "修改失败"
						})
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		background-color: #F3F3F7;
		min-height: 100vh;
		padding-top: 1rpx;
		box-sizing: border-box;

		.ul {
			width: 686rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin: 24rpx auto;
			padding: 10rpx 24rpx;

			.li {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 92rpx;
				border-bottom: solid 2rpx #EEEEEE;

				&:last-of-type {
					border-bottom: none;
				}

				.title {
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
				}

				.text {
					flex: 1;
					text-align: right;
					position: relative;

					image {
						width: 76rpx;
						height: 76rpx;
						border-radius: 50%;
					}

					button {
						position: absolute;
						right: 0;
						top: 0;
						z-index: 10;
						opacity: 0;
						width: 76rpx;
						height: 76rpx;
						border-radius: 50%;
					}

					input {
						width: 100%;
						text-align: right;
					}

					::v-deep .u-upload {
						position: absolute;
						right: 0;
						top: 0;
						z-index: 10;
						opacity: 0;
						width: 76rpx;
						height: 76rpx;
						border-radius: 50%;
					}
				}
			}
		}

		.submit {
			width: 686rpx;
			margin: 60rpx auto;
			height: 80rpx;
			background: #3060FB;
			border-radius: 44rpx;
			font-size: 30rpx;
			font-weight: 500;
			color: #FFFFFF;
			letter-spacing: 4rpx;
		}
	}
</style>

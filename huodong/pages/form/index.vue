<template>
	<view class="container">
		<view class="school" @click="topage('huodong')">
			<image class="img" lazy-load :src="activity.thumb" mode="aspectFill"></image>
			<view class="text">
				<view class="title">{{ activity.title }}</view>
				<view class="label" v-if="activity.label_name">
					<text v-for="(lab, i) in activity.label_name" class="lab" :key="i">{{ lab }}</text>
				</view>
				<view v-if="activity.join_form">
					<view class="price">{{ activity.join_form }}</view>
				</view>
			</view>
		</view>
		<view class="form">
			<u--form labelPosition="left" :model="model1" ref="form1" errorType="toast">
				<view class="block">
					<u-form-item label="手机号" labelWidth="auto" prop="userInfo.phone" ref="item3">
						<u--input disableDefaultPadding="true" type="number" inputAlign="right" border="none"
							fontSize="28rpx" color="#333333" placeholderStyle="color:#999999" placeholder="请输入手机号"
							v-model="model1.userInfo.phone"></u--input>
					</u-form-item>
				</view>

				<template v-if="child.id">
					<view class="block children">
						<view class="left">
							<view class="top">
								<text class="name">{{ child.name }}</text>
								<text v-if="child.sex == '1'" class="sex">男孩</text>
								<text v-else class="sex g">女孩</text>
							</view>
							<view class="else">年龄：{{ child.age }}周岁</view>
							<view class="else">在读年级：{{ gradeObj[child.gradeid] }}</view>
						</view>
						<view class="right">
							<view class="change" @click="topage">
								<text class="text">更换</text>
								<image class="img" mode="aspectFit" src="@/static/组 176@2x.png"></image>
							</view>
						</view>
					</view>
				</template>
				<template v-if="!child.id">
					<view class="block">
						<u-form-item label="姓名" borderBottom labelWidth="auto" prop="userInfo.child_name" ref="item4">
							<u--input disableDefaultPadding="true" inputAlign="right" border="none" fontSize="28rpx"
								color="#333333" placeholder="请输入姓名" placeholderStyle="color:#999999"
								v-model="model1.userInfo.child_name"></u--input>
						</u-form-item>
						<u-form-item label="性别" borderBottom prop="sex" labelWidth="500rpx" ref="item5">
							<u-radio-group v-model="model1.sex">
								<u-radio :customStyle="{ marginRight: '16rpx', color: '#333333' }" size="28rpx"
									iconSize="28rpx" labelSize="28rpx" v-for="(item, index) in sexList" :key="index"
									:label="item.name" :name="item.name" :value="item.value">
								</u-radio>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="生日" borderBottom labelWidth="auto" prop="userInfo.birthday"
							@click="showBirthday = true; hideKeyboard()" ref="item6">
							<u--input v-model="model1.userInfo.birthday" inputAlign="right" fontSize="28rpx" disabled
								disabledColor="#ffffff" placeholder="请选择出生年月日" border="none"
								placeholderStyle="color:#999999">
							</u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="目前在读年级" borderBottom labelWidth="auto" prop="userInfo.grade_name"
							@click="showGrade = true; hideKeyboard()" ref="item7">
							<u--input v-model="model1.userInfo.grade_name" inputAlign="right" fontSize="28rpx" disabled
								disabledColor="#ffffff" placeholder="请选择在读年级" border="none"
								placeholderStyle="color:#999999">
							</u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</view>
				</template>
			</u--form>
			<view class="btn">
				<view class="price">{{ activity.activity_price || "" }}</view>
				<u-button type="primary" text="确定预约" shape="circle" color="#3060FB" @click="submit"></u-button>
			</view>
			<u-datetime-picker :show="showBirthday" :value="birthday" mode="date" closeOnClickOverlay
				@confirm="birthdayConfirm" @cancel="birthdayClose" @close="birthdayClose" :minDate="minDate"
				:maxDate="maxDate"></u-datetime-picker>
			<u-picker :show="showGrade" :columns="gradeList" keyName="name" closeOnClickOverlay @confirm="gradeConfirm"
				@cancel="gradeClose" @close="gradeClose"></u-picker>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			styles: {
				"color": "red"
			},
			activity: {},
			showBirthday: false,
			showTime: false,
			showTime2: false,
			showGrade: false,
			model1: {
				userInfo: {
					activityid: null,
					schoolid: "",
					// state: 2,
					sex: 1,
					birthday: '',
					// age: "",
					phone: "",
					child_name: "",
					gradeid: "",
					grade_name: "",
					openid: "",
					types: 2 //1探校2活动
				},
				sex: '男',
			},
			minDate: Number(new Date("1971/01/01")),
			maxDate: Number(new Date()),
			birthday: Number(new Date()),
			grade_name: "",
			gradeList: [],
			regionList: [],
			child: {},
			rules: {
				'userInfo.birthday': {
					type: 'string',
					required: true,
					message: '请选择出生年月日',
					trigger: ['change']
				},
				'userInfo.phone': {
					type: 'number',
					required: true,
					message: '请输入手机号',
					trigger: ['change']
				},
				'userInfo.child_name': {
					type: 'string',
					required: true,
					message: '请输入姓名',
					trigger: ['change']
				},
				'userInfo.gradeid': {
					type: 'string',
					required: true,
					message: '请选择在读年级',
					trigger: ['change']
				},
			},
			sexList: [{
				name: '男',
				disabled: false,
				value: 1
			},
			{
				name: '女',
				disabled: false,
				value: 2
			}
			],
			scene: null,
			gradeIndex: [],
			gradeObj: {}
		};
	},
	onReady() {
		// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
		this.$refs.form1.setRules(this.rules)
	},
	onLoad(option) {
		let than = this;
		if (uni.getLaunchOptionsSync().scene) {
			this.scene = uni.getLaunchOptionsSync().scene;
		}
		this.model1.userInfo.activityid = option.activityid;
		this.model1.userInfo.schoolid = (option.schoolid || "");

		uni.getStorage({
			key: 'openid',
			success: res => {
				if (res.data) {
					than.openid = res.data;
					than.model1.userInfo.openid = than.openid
					than.getMsg()
				}
			},
			fail: err => {
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
		});
		uni.getStorage({
			key: 'users',
			success: res => {
				if (res.data &&res.data.mobile) {
					than.model1.userInfo.phone = res.data.mobile;
				}
			},
			fail: () => {
			}
		});
		this.getGrade();
	},
	methods: {
		setChild(id, age) {
			this.getChildInfo(id, this.openid, age);
		},
		getChild() {
			let {
				openid
			} = this;
			let than = this;
			uni.request({
				url: "https://www.ieduchina.com/api.php?op=xc&do=child",
				method: 'GET',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					openid
				},
				success(res) {
					if (res.data.status == 1 && res.data.data && res.data.data.length) {
						for (var i = 0; i < res.data.data.length; i++) {
							if (res.data.data[i].state == 1) {
								than.getChildInfo(res.data.data[i]["id"], openid, res.data.data[i]["birthday"])
							}
						}
					}
				},
				fail(err) {
					console.log(err)
				}
			})
		},
		getChildInfo(id, openid, age) {
			let than = this;
			uni.request({
				url: "https://www.ieduchina.com/api.php?op=xc&do=childinfo",
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					id,
					openid
				},
				success(res) {
					if (res.data.status == 1) {
						let data = res.data.data;
						than.child = {
							id,
							name: data.name,
							age,
							gradeid: data.grade,
							sex: data.sex,
						}
						than.model1.userInfo.child_name = data.name
						than.model1.userInfo.birthday = data.birthday
						than.model1.userInfo.gradeid = data.grade
						than.model1.userInfo.sex = data.sex
						than.model1.sex = data.sex == 2 ? '女' : '男'
					}
				},
				fail(err) {
					console.log(err)
				}
			})
		},
		getGrade() {
			let than = this;
			uni.request({
				url: "https://www.ieduchina.com/api.php?op=xc&do=grades",
				method: 'GET',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success(res) {
					if (res.data.status == 1) {
						// than.gradeIndex = res.data.data;
						than.gradeList[0] = [];
						for (let id in res.data.data) {
							than.gradeList[0].push({
								id,
								name: res.data.data[id]
							})
						}
						than.gradeObj = res.data.data
					}
				},
				fail(err) {
					console.log(err)
				}
			})
		},
		topage(huodong) {
			if (huodong == "huodong") {
				uni.$u.route(`/huodong/pages/detail/index?activityid=${this.model1.userInfo.activityid}`);
			} else {
				uni.$u.route(`/my/pages/children/index?type=change`);
			}
		},
		birthdayClose() {
			this.showBirthday = false
			this.$refs.form1.validateField('userInfo.birthday')
		},
		birthdayConfirm(e) {
			this.showBirthday = false
			this.model1.userInfo.birthday = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
			this.$refs.form1.validateField('userInfo.birthday')
		},
		gradeClose() {
			this.showGrade = false
			this.$refs.form1.validateField('userInfo.grade_name')
		},
		gradeConfirm(e) {
			this.showGrade = false
			this.model1.userInfo.grade_name = e.value[0].name
			this.model1.userInfo.gradeid = e.value[0].id
			this.$refs.form1.validateField('userInfo.grade_name')
		},
		submit() {
			let than = this;
			this.$refs.form1.validate().then(res => {
				if (than.model1.sex == "男") {
					than.model1.userInfo.sex = 1
				} else {
					than.model1.userInfo.sex = 2
				}
				than.model1.userInfo.seene = than.scene
				than.model1.userInfo.grade = than.gradeObj[than.model1.userInfo.gradeid]
				delete than.model1.userInfo.grade_name
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=yuyue_apply",
					method: "POST",
					data: than.model1.userInfo,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.status == 1) {
							uni.$u.route(
								`/huodong/pages/status/index?id=${res.data.data}&activityid=${than.model1.userInfo.activityid}`
							);
						} else {
							uni.showToast({
								title: res.data.info,
								icon: "none"
							})
							return false;
						}
					},
					error(res) {
						console.log(res)
					}
				})

				return false;
			}).catch(errors => {
				console.log(errors)
				uni.$u.toast(errors[0].message)
			})
		},
		hideKeyboard() {
			uni.hideKeyboard()
		},
		getMsg() {
			let than = this;
			let activityid = this.model1.userInfo.activityid
			let openid = this.openid;
			this.getChild();
			uni.request({
				url: "https://www.ieduchina.com/api.php?op=xc&do=activity_info",
				method: "POST",
				data: {
					activityid,
					openid
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success(res) {
					if (res.data.status == 1) {
						than.activity = res.data.data;
						if (res.data.data.sex) {
							if (res.data.data.sex == 1) {
								than.model1.sex == "男"
								than.sex == 1
							} else {
								than.model1.sex == "女"
								than.sex == 2
							}
							than.model1.userInfo.sex = res.data.data.sex;
						}
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

<style lang="scss">
.container {
	background-color: #F3F3F7;
	min-height: 100vh;
	padding-bottom: 204rpx;
	box-sizing: border-box;
	padding-top: 24rpx;

	.school {
		margin: 24rpx auto 0;
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 16px;
		display: flex;
		justify-content: space-between;
		padding: 24rpx;
		box-sizing: border-box;
		overflow: hidden;

		&:first-of-type {
			margin-top: 0;
		}

		.img {
			width: 140rpx;
			min-width: 140rpx;
			height: 140rpx;
			border-radius: 8rpx;
			margin-right: 16rpx;
		}

		.text {
			flex: 1;
			position: relative;

			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}

			.label {
				padding-bottom: 10rpx;
				padding-top: 10rpx;

				.lab {
					font-size: 20rpx;
					font-weight: 400;
					color: #2C75F3;
					height: 36rpx;
					display: inline-block;
					line-height: 36rpx;
					padding: 0 8rpx;
					border-radius: 8rpx;
					margin-right: 8rpx;
					background-color: rgba(44, 117, 243, .1);
				}
			}

			.price {
				font-size: 28rpx;
				font-weight: 500;
				color: #FF3030;
			}
		}
	}

	.form {
		margin: 24rpx 32rpx 0 32rpx;

		.block {
			margin-top: 24rpx;
			background-color: white;
			border-radius: 16rpx;
			padding: 0 24rpx;

			&:first-of-type {
				margin-top: 0;
			}

			&:last-of-type {
				padding-bottom: 16rpx;
			}

			&.children {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 44rpx 24rpx;
				box-sizing: border-box;
				height: 220rpx;

				.left {
					.top {
						display: flex;
						align-items: center;

						.name {
							font-size: 32rpx;
							font-weight: 500;
							color: #333333;
						}

						.sex {
							font-size: 20rpx;
							font-weight: 400;
							color: #2C75F3;
							padding: 0 18rpx;
							background: rgba(44, 117, 243, .1);
							border-radius: 8rpx;
							margin-left: 24rpx;

							&.g {
								background-color: rgba(252, 57, 57, .1);
								color: rgba(252, 57, 57, 1);
							}
						}
					}

					.else {
						font-size: 24rpx;
						font-weight: 400;
						color: #333333;
						padding-top: 24rpx;
					}
				}

				.right {
					.change {
						padding: 50rpx 0;

						.text {
							font-size: 28rpx;
							font-weight: 400;
							color: #666666;
						}

						.img {
							width: 28rpx;
							height: 28rpx;
						}
					}
				}
			}
		}

		.children-info {
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			padding-top: 32rpx;
		}

		.btn {
			position: fixed;
			bottom: 0;
			width: 100%;
			left: 0;
			z-index: 10;
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 16rpx 32rpx 84rpx;
			background-color: white;

			.price {
				font-size: 36rpx;
				font-weight: 500;
				color: #FF3030;
				display: inline-block;
				width: 324rpx;
				line-height: 80rpx;
				height: 80rpx;
			}

			.u-button {
				flex: 1;
			}
		}
	}
}
</style>

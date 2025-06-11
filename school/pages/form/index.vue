<template>
	<view class="container">
		<school-profile :schoolProfile="[school]" schoolid="id" name="title"></school-profile>
		<view class="form">
			<u--form labelPosition="left" :model="model1" ref="form1" errorType="toast">
				<view class="block">
					<u-form-item label="手机号" labelWidth="auto" prop="userInfo.phone" ref="item2">
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
						<u-form-item label="姓名" borderBottom labelWidth="auto" prop="userInfo.child_name" ref="item3">
							<u--input disableDefaultPadding="true" inputAlign="right" border="none" fontSize="28rpx"
								color="#333333" placeholder="请输入姓名" placeholderStyle="color:#999999"
								v-model="model1.userInfo.child_name"></u--input>
						</u-form-item>
						<u-form-item label="性别" borderBottom prop="sex" labelWidth="500rpx" ref="item4">
							<u-radio-group v-model="model1.sex">
								<u-radio :customStyle="{ marginRight: '16rpx', color: '#333333' }" size="28rpx"
									iconSize="28rpx" labelSize="28rpx" v-for="(item, index) in sexList" :key="index"
									:label="item.name" :name="item.name" :value="item.value">
								</u-radio>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="生日" borderBottom labelWidth="auto" prop="userInfo.birthdayName"
							@click="showBirthday = true; hideKeyboard()" ref="item5">
							<u--input v-model="model1.userInfo.birthdayName" inputAlign="right" fontSize="28rpx"
								disabled disabledColor="#ffffff" placeholder="请选择出生年月日" border="none"
								placeholderStyle="color:#999999">
							</u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="目前在读年级" borderBottom labelWidth="auto" prop="userInfo.grade_name"
							@click="showGrade = true; hideKeyboard()" ref="item6">
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
				<u-button type="primary" text="确定预约" shape="circle" color="#3060FB" @click="submit"></u-button>
			</view>
			<u-datetime-picker :show="showBirthday" :value="birthdayName" mode="date" closeOnClickOverlay
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
			school: {},
			info: [{}],
			styles: {
				"color": "red"
			},
			showBirthday: false,
			showGrade: false,
			model1: {
				userInfo: {
					activityid: null,
					schoolid: null,
					// state: 1,
					sex: 1,
					birthdayName: '',
					// age: "",
					phone: "",
					child_name: "",
					grade: "",
					gradeid: "",
					grade_name: "",
					openid: "",
					types: 1 //1探校2活动
				},
				sex: '男',
			},
			minDate: Number(new Date("1971/01/01")),
			maxDate: Number(new Date()),
			birthdayName: Number(new Date()),
			time: Number(new Date()),
			grade: "",
			region: "",
			gradeList: [],
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
				}
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
		this.model1.userInfo.schoolid = option.schoolid;

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
							sex: data.sex
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
		getAge(time) {
			let dateTime = time.split("年").join("/").split("月").join("/").split("日")[0];
			return new Date((new Date().getTime()) - (new Date(dateTime).getTime())).getFullYear() - 1970
		},
		topage(pages) {
			uni.$u.route(`/my/pages/children/index?type=change`);
		},
		labels(str) {
			return str.split(",")
		},
		birthdayClose() {
			this.showBirthday = false
			this.$refs.form1.validateField('userInfo.birthdayName')
		},
		birthdayConfirm(e) {
			this.showBirthday = false
			this.model1.userInfo.birthdayName = uni.$u.timeFormat(e.value, 'yyyy年mm月dd日')
			this.model1.userInfo.birthday = this.model1.userInfo.birthdayName.split("年").join("/").split("月").join("/")
				.split("日")
			this.$refs.form1.validateField('userInfo.birthdayName')
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
					than.model1.userInfo.sex = "男"
				} else {
					than.model1.userInfo.sex = "女"
				}
				than.model1.userInfo.seene = than.scene
				than.model1.userInfo.grade = than.gradeObj[than.model1.userInfo.gradeid]
				delete than.model1.userInfo.grade_name
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=college_apply",
					method: "POST",
					data: than.model1.userInfo,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.status == 1) {
							uni.$u.route(
								`/huodong/pages/status/index?schoolid=${than.model1.userInfo.schoolid}&id=${res.data.data}`
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
			let schoolid = this.model1.userInfo.schoolid;
			let openid = this.model1.userInfo.openid;
			this.getChild();
			uni.request({
				url: "https://www.ieduchina.com/api.php?op=xc&do=school_info",
				method: "POST",
				data: {
					schoolid,
					openid
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success(res) {
					if (res.data.status == 1) {
						than.school = res.data.data;
						// than.school=res.data.data
						// than.info[0].schoolid = res.data.data.schoolid;
						// than.info[0].school_logo = res.data.data.school_logo;
						// than.info[0].school_name = res.data.data.school_name;
						// than.info[0].school_label = res.data.data.school_labelid;
						// than.info[0].address = res.data.data.school_address;
						// than.model1.userInfo.grade = res.data.data.grade;
						// than.model1.userInfo.grade_name = than.gradeIndex[res.data.data.grade];
						// than.model1.userInfo.child_name = res.data.data.name;
						// than.model1.userInfo.birthday = res.data.data.birthday;
						// than.model1.userInfo.age = than.getAge(res.data.data.birthday);
						// than.model1.userInfo.birthdayName = res.data.data.birthday;
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
	padding-top: 1rpx;

	.form {
		margin: 0 32rpx;

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
			z-index: 100;
			box-sizing: border-box;
			padding: 16rpx 32rpx 84rpx;
			background-color: white;
		}
	}
}
</style>

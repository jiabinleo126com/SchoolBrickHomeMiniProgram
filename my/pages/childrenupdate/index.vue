<template>
	<view class="container">
		<view class="form">
			<u--form labelPosition="left" :model="model1" ref="form1" errorType="toast">
				<view class="block">
					<u-form-item label="姓名" borderBottom labelWidth="auto" prop="userInfo.name" ref="item1">
						<u--input disableDefaultPadding="true" inputAlign="right" border="none" fontSize="28rpx"
							color="#333333" placeholder="请输入姓名" placeholderStyle="color:#999999"
							v-model="model1.userInfo.name"></u--input>
					</u-form-item>
					<u-form-item label="性别" borderBottom prop="sex" labelWidth="500rpx" ref="item2">
						<u-radio-group v-model="model1.userInfo.sexName">
							<u-radio :customStyle="{marginRight: '16rpx',color:'#333333'}" size="28rpx" iconSize="28rpx"
								labelSize="28rpx" v-for="(item, index) in sexList" :key="index" :label="item.name"
								:name="item.name">
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="生日" borderBottom labelWidth="auto" prop="userInfo.birthday"
						@click="showBirthday = true; hideKeyboard()" ref="item3">
						<u--input v-model="model1.userInfo.birthday" inputAlign="right" fontSize="28rpx" disabled
							disabledColor="#ffffff" placeholder="请选择出生年月日" border="none"
							placeholderStyle="color:#999999">
						</u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="目前在读年级" labelWidth="auto" prop="userInfo.gradeName"
						@click="showGrade = true; hideKeyboard()" ref="item4">
						<u--input v-model="model1.userInfo.gradeName" inputAlign="right" fontSize="28rpx" disabled
							disabledColor="#ffffff" placeholder="请选择在读年级" border="none"
							placeholderStyle="color:#999999">
						</u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
				</view>
				<view class="block">
					<u-form-item label="设为默认孩子信息" labelWidth="530rpx" prop="userInfo.default" ref="item5">
						<u-switch v-model="defaultMsg" asyncChange activeColor="#5ac725"
							inactiveColor="rgba(120, 120, 128, 0.1)" size="56" @change="updateDefault"></u-switch>
					</u-form-item>
				</view>
			</u--form>
			<view class="btns">
				<view v-show="hideDelBtn" class="del">
					<u-button type="primary" text="删除信息" shape="circle" plain=true color="rgba(102, 102, 102, 1)"
						space="2rpx" @click="del"></u-button>
				</view>
				<view class="submit">
					<u-button type="primary" text="保存并使用" shape="circle" color="#3060FB" space="2rpx" @click="submit">
					</u-button>
				</view>
			</view>
			<u-datetime-picker :show="showBirthday" v-model="defaultTime" mode="date" closeOnClickOverlay
				:minDate="minDate" :maxDate="maxDate" @confirm="birthdayConfirm" @cancel="birthdayClose"
				@close="birthdayClose" :key="itemKey"></u-datetime-picker>
			<u-picker :show="showGrade" value="二年级" :columns="gradeList" keyName="name" closeOnClickOverlay
				@confirm="gradeConfirm" @cancel="gradeClose" @close="gradeClose"></u-picker>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showBirthday: false,
				showGrade: false,
				hideDelBtn: false,
				model1: {
					userInfo: {
						birthday: '',
						name: "",
						gradeName: "",
						grade: "",
						state: 2,
						sexName: "男",
						openid: ""
					}
				},
				openid: "",
				itemKey: Math.random(),
				defaultTime: Number(new Date()),
				defaultMsg: false,
				minDate: Number(new Date("1971/01/01")),
				maxDate: Number(new Date()),
				birthday: Number(new Date()),
				gradeList: [],
				gradeIndex: [],
				rules: {
					'userInfo.birthday': {
						type: 'string',
						required: true,
						message: '请选择出生年月日',
						trigger: ['change']
					},
					'userInfo.name': {
						type: 'string',
						required: true,
						message: '请输入姓名',
						trigger: ['change']
					},
					radiovalue1: {
						type: 'string',
						min: 1,
						max: 2,
						trigger: ['change']
					},
					'userInfo.gradeName': {
						type: 'string',
						required: true,
						message: '请选择在读年级',
						trigger: ['change']
					}
				},
				sexList: [{
						name: '男',
						disabled: false
					},
					{
						name: '女',
						disabled: false
					}
				]
			};
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.form1.setRules(this.rules)
		},
		onLoad(option) {
			let than = this;
			this.id = option.id;
			if (this.id) {
				this.hideDelBtn = true;
			}
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.openid = res.data;
						than.model1.userInfo.openid = res.data;
						than.getGrade(than.openid, than.id)
					}
				},
				fail() {
					uni.showModal({
						content: '请登录',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: `/pages/my/index`
								})
							}
						}
					});
				}
			});
		},
		methods: {
			getData(openid, id) {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=childinfo",
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						openid,
						id
					},
					success(res) {
						if (res.data.status == 1) {
							than.model1.userInfo = res.data.data
							than.defaultMsg = (res.data.data.state == 1)
							than.model1.userInfo.sexName = (res.data.data.sex == 1 ? "男" : "女");
							than.model1.userInfo.gradeName = than.gradeIndex[res.data.data.grade];
							than.model1.userInfo.grade = res.data.data.grade;
							if (than.model1.userInfo.birthday) {
								than.defaultTime = than.setTime(than.model1.userInfo.birthday)
							}
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			getGrade(openid, id) {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=grades",
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.status == 1) {
							than.gradeIndex = res.data.data;
							than.gradeList = [
								[]
							];
							for (let key in than.gradeIndex) {
								than.gradeList[0].push({
									id: key,
									name: than.gradeIndex[key]
								})
							}
							if (id) {
								than.getData(openid, id)
							}
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			setTime(time) {
				if (time) {
					return Number(new Date(time.replaceAll("-", "/")).getTime());
				}
			},
			birthdayClose() {
				this.itemKey = Math.random();
				this.showBirthday = false
				this.$refs.form1.validateField('userInfo.birthday')
			},
			birthdayConfirm(e) {
				this.showBirthday = false
				this.model1.userInfo.birthday = uni.$u.timeFormat(e.value, 'yyyy年mm月dd日')
				this.$refs.form1.validateField('userInfo.birthday')
			},
			gradeClose() {
				this.showGrade = false
				this.$refs.form1.validateField('userInfo.gradeName')
			},
			gradeConfirm(e) {
				this.showGrade = false
				console.log(e.value[0].name)
				this.model1.userInfo.gradeName = e.value[0].name
				this.model1.userInfo.grade = e.value[0].id

				this.$refs.form1.validateField('userInfo.gradeName')
			},
			updateDefault(e) {
				this.defaultMsg = !this.defaultMsg
				this.model1.userInfo.state = this.defaultMsg ? 1 : 2
				console.log('updateDefault', e);
			},
			submit() {
				this.$refs.form1.validate().then(res => {
					let data = this.model1.userInfo;
					data.openid = this.openid
					if (data.sexName == "女") {
						data.sex = 2
					} else {
						data.sex = 1
					}
					if (data.birthday) {
						data.birthday = data.birthday.replace("年", "-").replace("月", "-").split("日")[0]
					}
					let than = this;
					uni.request({
						url: "https://www.ieduchina.com/api.php?op=xc&do=childadd",
						method: 'POST',
						data,
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success(res) {
							if (res.data.status == 1) {
								uni.navigateBack({
									delta: 1,
									success() {
										const pages = getCurrentPages()
										let page = pages[Math.max(pages.length - 1, 0)]
										page.onLoad(page.options)
									}
								})
							} else {
								uni.$u.toast(res.data.info)
							}
						},
						fail(err) {
							console.log(err)
						}
					})
				}).catch(errors => {
					console.log(errors)
					uni.$u.toast(errors[0].message)
				})
			},
			del() {
				let {
					openid,
					id
				} = this;
				uni.showModal({
					content: '确定要删除孩子信息吗？',
					showCancel: true,
					success: function(result) {
						if (result.confirm) {
							uni.request({
								url: "https://www.ieduchina.com/api.php?op=xc&do=childdel",
								method: 'POST',
								data: {
									openid,
									id
								},
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								success(res) {
									if (res.data.status == 1) {
										uni.navigateBack({
											delta: 1,
											success() {
												uni.$u.toast("删除成功")
												const pages = getCurrentPages()
												let page = pages[Math.max(pages.length - 1, 0)]
												page.onLoad(page.options)
											}
										})
									} else {
										uni.$u.toast(res.data.info)
									}
								},
								fail(err) {
									console.log(err)
								}
							})
						}
					}
				});
			},
			hideKeyboard() {
				uni.hideKeyboard()
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

		.form {
			margin: 0 32rpx;
			padding-top: 24rpx;

			.block {
				margin-top: 24rpx;
				background-color: white;
				border-radius: 16rpx;
				padding: 0 24rpx;

				&:first-of-type {
					margin-top: 0;
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
	}
</style>

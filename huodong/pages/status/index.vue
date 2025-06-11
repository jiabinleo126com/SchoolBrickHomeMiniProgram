<template>
	<view class="container">
		<image class="status" :src="img1" mode="aspectFit"></image>
		<view class="text">预约成功</view>
		<view class="btns">
			<view class="btn">
				<u-button type="primary" plain="true" v-text="btnText" :customStyle="bgColor" hairline="true" color="#999999"
					shape="circle" @click="toPage('schoolorhuodong')"></u-button>
			</view>
			<view class="btn">
				<u-button type="primary" color="#3060FB" shape="circle" text="预约详情" @click="toPage('detail')"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img1:require(`@/static/成功@2x.png`),
				bgColor:{
					"background-color":"transparent"
				},
				activityid:null,
				type:null,
				btnText:"",
				id:null
			}
		},
		onLoad(option) {
			console.log(option)
			this.activityid = option.activityid
			this.id = option.id
			this.schoolid = option.schoolid
			if(this.activityid){
				uni.setNavigationBarTitle({
				　　title:"活动预约"
				})
				this.type = "activity"
				this.btnText = "返回活动"
			}else if(this.schoolid){
				uni.setNavigationBarTitle({
				　　title:"预约探校"
				})
				this.type = "school"
				this.btnText = "返回学校"
			}
			let than = this;
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.openid = res.data;
						than.getData()
					}
				},
				fail:err=>{
					uni.showModal({
						content: '请先登录',
						showCancel: true,
						success(res) {
							if(res.confirm){
								uni.switchTab({
									url: `/pages/my/index`
								})
							}
						}
					});
					return false;
				}
			});
		},
		methods: {
			toPage(page){
				if(page == "detail"){
					if(this.type=="school"){
						uni.$u.route(`/my/pages/tanxiaodetail/index?id=${this.id}`);
					}else if(this.type=="activity"){
						uni.$u.route(`/my/pages/huodongdetail/index?id=${this.id}`);
					}
				}else if(page == "schoolorhuodong"){
					if(this.type=="school"){
						uni.$u.route(`/school/pages/schooldetail/index?schoolid=${this.schoolid}`);
					}else if(this.type=="activity"){
						uni.$u.route(`/huodong/pages/detail/index?activityid=${this.activityid}`);
					}
				}
			},
			getData(){
				let {openid,activityid} = this;
				uni.request({
					url: "",
					method: "GET",
					data: {openid,activityid},
					success(res) {
						if (res.data.code == 200) {
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
	.container {
		text-align: center;
		min-height: 100vh;
		box-sizing: border-box;
		background-color: rgba(243, 243, 247, 1);

		.status {
			min-width: 136rpx;
			height: 136rpx;
			margin-top: 88rpx;
		}

		.text {
			font-size: 32rpx;
			font-weight: 500;
			color: #099D44;
			text-align: center;
			padding: 37rpx 0 72rpx;
		}

		.btns {
			display: flex;
			justify-content: space-between;
			padding: 0 122rpx;

			.btn {
				width: 224rpx;
				height: 76rpx;
				border-radius: 44rpx;
			}
		}
	}
</style>

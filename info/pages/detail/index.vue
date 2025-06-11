<template>
	<view class="container">
		<view class="con">
			<view class="content">
				<view class="title">{{info.title}}</view>
				<view class="msg" @click="topage('school')" v-if="info.schoolid">
					<image class="schoolimg" :src="info.thumb" mode="aspectFill"></image>
					<view class="center">
						<view class="name">{{info.school_name}}</view>
						<view class="time">{{setTime(info.inputtime+"000")}}</view>
					</view>
					<view class="right" @click.stop="flow">
						<view v-if="!!info['is_follow']" class="btn is">已关注</view>
						<view v-else class="btn">+关注</view>
					</view>
				</view>
				<view class="topic" v-show="info.keywords" @click="topage('keywords')">
					<view class="top">
						<view class="l">话题合集</view>
						<view class="r" v-show="info.keywords_num">{{info.keywords_num}}条内容<image class="arr"
								src="@/static/组 176@2x.png" mode="aspectFit">
							</image>
						</view>
					</view>
					<view class="bottom">
						<text class="t">#</text><text>{{info.keywords}}</text>
					</view>
				</view>
				<view class="wrap">
					<view class="article">
						<u-parse :content="info.content"></u-parse>
					</view>
				</view>
				<view class="ul">
					<view class="li">
						<text class="s" v-show="info.views">{{info.views}}人阅读</text>
					</view>
					<view class="li" v-show="info.collect" @click="flow('collection',null,null,null)">
						<image v-if="!!info.collect" class="img" :src="img1" mode="aspectFit"></image>
						<image v-else class="img" :src="img1_" mode="aspectFit"></image>
						<text class="s">{{info.collect}}</text>
					</view>
					<view class="li" v-show="info.zan" @click="flow('thumbs',null,null,null)">
						<image v-if="!!info.zan" class="img" :src="img2" mode="aspectFit"></image>
						<image v-else class="img" :src="img2_" mode="aspectFit"></image>
						<text class="s">{{info.zan}}</text>
					</view>
				</view>
			</view>
			<view class="form" v-show="formshow">
				<div class="content">
					<view class="head">快速匹配适合您孩子的学校</view>
					<view class="title">
						<view class="li">
							<view class="img"></view>全国500所国际学校大全
						</view>
						<view class="li">
							<view class="img"></view>3分钟匹配5-8所
						</view>
						<view class="li">
							<view class="img"></view>1年名校升学备考托管服务
						</view>
					</view>
					<div class="inputs">
						<input type="text" v-model="data.name" placeholder="您的孩子姓名">
						<input type="text" v-model="data.want_school" placeholder="您的意向学校">
						<input type="text" v-model="data.mobile" placeholder="您的联系号码">
						<button @click="submit">为您匹配</button>
					</div>
				</div>
			</view>
		</view>
		<!-- <view class="pllist" v-if="comment.length">
			<view class="title">评论</view>
			<view class="ul">
				<view class="li" v-for="(item,index) in comment" :key="item.id">
					<div class="top">
						<view class="left">
							<image :src="item.portrait" class="img" mode="aspectFill"></image>
							<text class="text">{{item.user}}</text>
						</view>
						<div class="right">
							<image v-if="!!item.iszan" @click="flow('comment',item.id,index)" class="img"
								src="@/static/点赞选中-1.png" mode="aspectFit"></image>
							<image v-else class="img" @click="flow('comment',item.id,index)" src="@/static/点赞选中.png"
								mode="aspectFit"></image>
							<text>{{item.praise}}</text>
						</div>
					</div>
					<view class="center">{{item.content}}</view>
					<view class="bottom">
						<view class="s">{{item.time}}</view>
						<view class="s" @click="hf(item.id,item.user)">回复</view>
					</view>
					<view class="ul">
						<view class="li" v-for="(li,i) in item.list" :key="li.id">
							<div class="top">
								<view class="left">
									<image :src="li.portrait" class="img" mode="aspectFill"></image>
									<text class="text">{{li.user}}</text>
								</view>
								<div class="right">
									<image v-if="!!li.iszan" @click="flow('comment',li.id,index,i)" class="img"
										src="@/static/点赞选中-1.png" mode="aspectFit">
									</image>
									<image v-else class="img" @click="flow('comment',li.id,index,i)"
										src="@/static/点赞选中.png" mode="aspectFit"></image>
									<text>{{li.praise}}</text>
								</div>
							</div>
							<view class="center">{{li.content}}</view>
							<view class="bottom">
								<view class="s">{{li.time}}</view>
								<view class="s" @click="hf(li.id,li.user)">回复</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- <view class="pl" v-if="false">
			<view class="left" @click="showpl">
				<image src="@/static/组679@2x.png" mode="aspectFit"></image>
				<text class="plstr" v-if="pl.length">{{pl}}</text>
				<text v-else>说点什么吧···</text>
			</view>
			<view class="right">
				<view class="li" @click="showpl">
					<button class="btn">
						<view class="icon">
							<image src="@/static/组680@2x.png" mode="aspectFit"></image>
						</view>
						<view class="text">
							评论
						</view>
						<div class="ul">
							<div class="li"></div>
						</div>
					</button>
				</view>
				<view class="li" @click="flow('collection')">
					<button class="btn">
						<view class="icon">
							<image v-if="!!info.iscollect" src="@/static/收藏选中-1.png" mode="aspectFit"></image>
							<image v-else src="@/static/收藏选中.png" mode="aspectFit"></image>
						</view>
						<view class="text">
							收藏
						</view>
					</button>
				</view>
				<view class="li" @click="flow('thumbs')">
					<button class="btn">
						<view class="icon">
							<image v-if="!!info.iszan" src="@/static/点赞选中-1.png" mode="aspectFit"></image>
							<image v-else src="@/static/点赞选中.png" mode="aspectFit"></image>
						</view>
						<view class="text">
							点赞
						</view>
					</button>
				</view>

				<view class="li">
					<button class="btn" open-type="share">
						<view class="icon">
							<image src="@/static/组685@2x.png" mode="aspectFit"></image>
						</view>
						<view class="text">
							分享
						</view>
					</button>
				</view>
			</view>
		</view> -->
		<!-- <u-popup :show="show" @close="close" mode="center">
			<view class="textarea-wrap">
				<u--textarea :show="show" class="textarea-con" :focus="focus" focus="isFocus" :formatter="formatter"
					autoHeight cursorSpacing=0 adjustPosition disableDefaultPadding showConfirmBar count
					v-model.lazy="pl" :placeholder="placeholder">
				</u--textarea>
				<button class="plbtn" @click="plbtn" type="default">评论</button>
			</view>
		</u-popup> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img1:require(`@/static/收藏选中-1.png`),
				img1_:require(`@/static/收藏选中.png`),
				img2:require(`@/static/点赞选中-1.png`),
				img2_:require(`@/static/点赞选中.png`),
				info: {},
				placeholder: "请输入内容",
				pl: "",
				show: false,
				focus: false,
				loadover: false,
				comment: [],
				openid: "",
				id: "",
				commentid: "",
				data: {
					name: "",
					want_school: "",
					mobile: "",
					newsid: ""
				},
				formshow:false
			};
		},
		onLoad(option) {
			this.id = option.id;
			let than = this;
			this.data.newsid = option.id;
			uni.getStorage({
				key: 'openid',
				success: res => {
					if (res.data) {
						than.openid = res.data;
						than.getMsg({
							openid: res.data,
							newsid: option.id
						})
					}
				},
				fail: err => {
					than.getMsg({
						newsid: option.id
					})
				}
			});
			// setTimeout(() => {
			// this.getcommentajax();
			// })
		},
		methods: {
			hf(id, user) {
				this.placeholder = `回复${user}:`
				this.commentid = id
				this.show = true;
				// this.focus = true;
			},
			showpl() {
				this.placeholder = `说点什么吧`
				this.commentid = ""
				this.show = true;
				// this.focus = true;
			},
			plbtn() {
				let than = this;
				let data = {
					openid: this.openid,
					newsid: +this.id,
					content: this.pl
				}
				if (this.commentid) {
					data.commentid = this.commentid
				}
				if (!data.openid) {
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
				if (!this.pl) {
					uni.showToast({
						title: "请输入内容",
						icon: "none"
					})
					return false;
				}
				uni.request({
					url: `https://www.ieduchina.com/api.php?op=xc&do=commentadd`,
					method: "GET",
					dataType: "json",
					data,
					success(res) {
						if (res.data.code == 200) {
							uni.showToast({
								title: "评论成功"
							})
							than.pl = "";
							than.getcommentajax();
							than.show = false;
						} else if (res.data.code == 5001) {
							uni.showModal({
								content: '请先登录',
								showCancel: false
							});
						} else {
							uni.showToast({
								title: res.data.info
							})
						}
					},
					error(err) {
						console.log(err)
					},
					complete(res) {
						console.log(res)
					}
				})
			},
			formatter(value) {
				// 让输入框只能输入数值，过滤其他字符
				// return value.replace(/[^0-9]/ig, "")
				return value;
			},
			close() {
				this.show = false;
			},
			setTime(time) {
				time = Number(time)
				if (time) {
					return `${new Date(time).getFullYear()}-${new Date(time).getMonth()+1}-${new Date(time).getDate()}`
				} else {
					return ""
				}
			},
			views_add(newsid,openid){
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=views_add",
					method: "POST",
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{newsid,openid},
					success(res) {
					},
					error(err) {
						console.log(err)
					}
				})
			},
			getMsg(data) {
				let than = this;
				uni.showToast({
					title:"加载中...",
					icon:'loading'
				})
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=news_info ",
					method: "POST",
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success(res) {
						if (res.data.status == 1) {
							than.info = res.data.data;
							than.views_add(than.id,than.openid)
							setTimeout(()=>{
								uni.hideToast()
							},500)
						}else{
							uni.showToast({
								title:"文章不存在",
								icon:"none"
							})
						}
						than.formshow = true
					},
					error(err) {
						console.log(err)
					}
				})
			},
			getcommentajax() {
				let than = this;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=commentajax",
					method: "POST",
					dataType: "json",
					data: {
						newsid: this.id,
						openid: this.openid
					},
					success(res) {
						if (res.data.code == 200) {
							than.comment = res.data.data
						}
					},
					error(err) {
						console.log(err)
					}
				})
			},
			flow(type, id, index, i) {
				let than = this;
				let data = {
					openid: this.openid,
					state: 1,
					articlesid: +this.id,
					newsid: +this.id,
					schoolid: +this.info.schoolid
				}
				let str = "&do=school_guanzhu";
				if (!data.openid) {
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
				if (type == "collection") {
					str = "&do=news_addcollect"
					delete data.schoolid
					delete data.state
					delete data.articlesid
				} else if (type == "thumbs") {
					str = "&do=news_addzan";
					delete data.articlesid;
					delete data.schoolid
					delete data.state
				} else if (type == "comment") {
					str = "&do=zanadd";
					delete data.articlesid
					delete data.schoolid
					data.commentid = id;
				} else {
					delete data.articlesid
					delete data.newsid
					delete data.state
				}
				uni.request({
					url: `https://www.ieduchina.com/api.php?op=xc${str}&t=${Math.random()}`,
					method: "POST",
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success(res) {
						if (res.data.status == 1) {
							if (type == "collection") {
								// than.info.iscollect = !than.info.iscollect;
								// if (than.info.iscollect) {
								// 	than.info.collect = +than.info.collect + 1
								// } else {
								// 	than.info.collect--
								// }
								if (res.data.status == 1) {
									than.info.collect = +than.info.collect + 1
								}
								than.info.iscollect = true
							} else if (type == "comment") {
								if (i >= 0) {
									than.comment[index].list[i].iszan = !than.comment[index].list[i].iszan
									if (than.comment[index].list[i].iszan) {
										than.comment[index].list[i].praise++
									} else {
										than.comment[index].list[i].praise--
									}
								} else {
									than.comment[index].iszan = !than.comment[index].iszan
									if (than.comment[index].iszan) {
										than.comment[index].praise++
									} else {
										than.comment[index].praise--
									}
								}

							} else if (type == "thumbs") {
								// than.info.iszan = !than.info.iszan;
								// if (than.info.iszan) {
								// 	than.info.zan++
								// } else {
								// 	than.info.zan--
								// }
								than.info.iszan = true
								than.info.zan = res.data.data.num
							} else {
								than.info.is_follow = !than.info.is_follow;
							}
							this.$forceUpdate();
						} else if (res.data.code == 5001) {
							uni.showModal({
								content: '请先登录',
								showCancel: false
							});
						} else {

						}
					},
					error(err) {
						console.log(err)
					},
					complete(res) {
						console.log(res)
					}
				})
			},
			topage(type) {
				if (type == "school") {
					uni.$u.route(`/school/pages/schooldetail/index?schoolid=${this.info.schoolid}`);
				} else if (type == "keywords") {
					getApp().globalData.keywords = this.info.keywords;
					getApp().globalData.tabIndex = 1;
					uni.switchTab({
						url: "/pages/info/index"
					})
				}
			},
			sharenum() {
				let id = this.info.id;
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=share",
					method: "GET",
					dataType: "json",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						id
					}
				})
			},
			submit() {
				let data = this.data
				let tip = ""
				if (!data.name) {
					tip = "请输入孩子姓名"
				} else if (!data.want_school) {
					tip = "请输入意向学校"
				} else if (!data.mobile) {
					tip = "请输入联系号码"
				}
				if (tip) {
					uni.showToast({
						title: tip,
						icon: "none"
					})
					return false;
				}
				uni.request({
					url: "https://www.ieduchina.com/api.php?op=xc&do=news_apply",
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data,
					success: (res) => {
						if (res.data.status == 1) {
							this.data.name = "";
							this.data.want_school = "";
							this.data.mobile = "";
							uni.showToast({
								title: "提交成功"
							})
						} else {
							uni.showToast({
								title: res.data.info,
								icon: 'error'
							})
						}
					},
					fail: () => {}
				})

			}
		},
		onShareAppMessage() {
			this.sharenum();
			return {
				title: this.info.title,
				path: `/info/pages/detail/index?id=${this.id}`,
				imageUrl:this.info.thumb,
				success() {
					uni.showToast({
						title: "分享成功"
					})
				},
				fail() {
					uni.showToast({
						title: "分享失败",
						icon: "none"
					})
				}
			}
		},
		onShareTimeline() {
			return {
				title: this.info.title,
				path: `/info/pages/detail/index?id=${this.id}`,
				imageUrl:this.info.thumb,
				success() {
					uni.showToast({
						title: "分享成功"
					})
				},
				fail() {
					uni.showToast({
						title: "分享失败",
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.texzt {
		width: 300rpx;
		height: 300rpx;
	}

	.container {
		background-color: #F3F3F7;
		min-height: 100vh;
		box-sizing: border-box;
		padding: 24rpx 32rpx 184rpx 32rpx;

		.con {
			// min-height: calc(100vh - 240rpx);

			.content {
				background-color: white;
				padding: 24rpx;
				box-sizing: border-box;
				border-radius: 16rpx;

				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
					line-height: 40rpx;
				}

				.msg {
					margin-top: 48rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.schoolimg {
						width: 80rpx;
						height: 80rpx;
						border-radius: 8rpx;
						margin-right: 16rpx;
					}

					.center {
						flex: 1;

						.name {
							font-size: 28rpx;
							font-weight: 500;
							color: #333333;
						}

						.time {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
						}
					}

					.right {
						.btn {
							width: 136rpx;
							height: 52rpx;
							background: rgba(48, 96, 251, 1);
							border-radius: 32rpx;
							text-align: center;
							font-size: 28rpx;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 52rpx;

							&.is {
								background: rgba(48, 96, 251, .7);
							}
						}
					}
				}

				.topic {
					background-color: rgba(243, 243, 247, 1);
					padding: 24rpx;
					border-radius: 16rpx;
					margin-top: 48rpx;

					.top {
						display: flex;
						justify-content: space-between;

						.l {
							font-size: 28rpx;
							font-weight: 500;
							color: #333333;
						}

						.r {
							font-size: 24rpx;
							font-weight: 400;
							color: #666666;

							.arr {
								width: 28rpx;
								height: 28rpx;
								margin-left: 6rpx;
								vertical-align: -4rpx;
							}
						}
					}

					.bottom {
						font-size: 28rpx;
						font-weight: 400;
						color: #3060FB;
						padding-top: 28rpx;

						.t {
							margin-right: 16rpx;
						}
					}
				}

				.wrap {
					margin: 48rpx 24rpx;

					.article {
						width: 100%;
						line-height: 1.6em;
						font-size: 26rpx;
					}
				}

				.ul {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.li {
						.img {
							width: 32rpx;
							height: 32rpx;
							margin-right: 6rpx;
							vertical-align: -6rpx;
						}

						.s {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
						}
					}
				}
			}
		}

		.pllist {
			background-color: white;
			padding: 24rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			margin-top: 24rpx;

			.title {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
			}

			.ul {
				margin-top: 20rpx;

				.li {
					.top {
						display: flex;
						justify-content: space-between;
						align-items: center;
						box-sizing: border-box;
						padding: 48rpx 0 10rpx;

						.left {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.img {
								width: 66rpx;
								height: 66rpx;
								margin-right: 24rpx;
							}

							.text {
								display: inline-block;
								line-height: 66rpx;
								font-size: 30rpx;
								font-weight: 500;
								color: #333333;
							}
						}

						.right {
							image {
								width: 28rpx;
								height: 28rpx;
								margin-right: 8rpx;
								vertical-align: -4rpx;
							}

							text {
								display: inline-block;
								min-width: 70rpx;
								font-size: 24rpx;
								font-weight: 400;
								color: #666666;
							}
						}
					}

					.center {
						font-size: 28rpx;
						font-weight: 400;
						color: #666666;
						line-height: 44rpx;
						margin: 10rpx 0;
					}

					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.s {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
						}
					}

					.ul {
						margin-left: 80rpx;
						margin-top: 20rpx;

						.li {
							.top {
								padding-top: 20rpx;

								.left {
									.img {
										width: 48rpx;
										height: 48rpx;
									}

									.text {
										font-size: 24rpx;
									}
								}
							}

							.center {
								margin: 6px 0;
							}
						}
					}
				}
			}
		}

		.pl {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 164rpx;
			background-color: white;
			margin-top: 26rpx;
			padding: 0 32rpx 64rpx 32rpx;
			box-sizing: border-box;

			.left {
				width: 332rpx;
				height: 72rpx;
				background: #F3F3F7;
				border-radius: 36rpx;
				margin-right: 48rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
				padding: 0 30rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;

				image {
					width: 44rpx;
					height: 44rpx;
					margin-right: 14rpx;
					vertical-align: 2rpx;
				}

				.plstr {
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					box-sizing: border-box;
				}
			}

			.right {
				flex: 1;
				display: flex;
				// justify-content: space-between;
				justify-content: space-evenly;
				align-items: center;

				.li {
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;

					.btn {
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						box-sizing: border-box;
						padding: 0;
						margin: 0;
						height: 70rpx;
						border: none;
						line-height: 1;
						background-color: transparent;

						&::after {
							border: 0;
						}

						&.button-hover {
							background: transparent;
						}

						.icon {
							margin-top: -8rpx;
							line-height: 1;
						}

						.text {
							line-height: 1;
						}
					}

					.icon {
						image {
							width: 44rpx;
							height: 44rpx;
						}
					}

					.text {
						width: 100%;
						font-size: 20rpx;
						font-weight: 400;
						color: #999999;
						margin-top: -10rpx;
					}
				}
			}
		}

		.textarea-wrap {
			width: 600rpx;
			background-color: white;
			padding: 32rpx;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			.textarea-con {
				border: solid 1rpx #333333;
				width: 100%;
				border-radius: 20rpx;
			}

			.plbtn {
				float: right;
				width: 100rpx;
				height: 60rpx;
				font-size: 22rpx;
				margin-top: 10rpx;
				margin-left: 20rpx;
			}
		}

		::v-deep .u-safe-area-inset-bottom {
			padding-bottom: 0;
		}

		.form {
			margin-top: 20rpx;
			background-color: white;
			padding: 30rpx 32rpx;
			text-align: center;

			.content {
				background-color: #F7F7F7;
				padding-bottom: 30rpx;
				border-radius: 12rpx;

				.head {
					font-size: 30rpx;
					font-weight: 500;
					color: #FFFFFF;
					width: 100%;
					height: 68rpx;
					line-height: 68rpx;
					background: rgba(48, 96, 251, 0.949);
					border-radius: 12rpx 12rpx 0 0;
					position: relative;

					&:before,
					&:after {
						content: "";
						position: absolute;
						top: 24rpx;
						z-index: 10;
						width: 20rpx;
						height: 20rpx;
						border-radius: 50%;
						background-color: white;
					}

					&:before {
						left: 20rpx;
					}

					&:after {
						right: 20rpx;
					}
				}

				.title {
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					padding: 10rpx 20rpx;

					.li {
						margin-top: 28rpx;
						font-size: 26rpx;
						font-weight: 500;
						color: #3A68FB;

						&:nth-of-type(2) {
							margin-left: 80rpx;
						}

						.img {
							display: inline-block;
							width: 31rpx;
							height: 36rpx;
							vertical-align: -4rpx;
							margin-right: 14rpx;
							background-position: center;
							background-repeat: no-repeat;
							background-size: contain;
							background-image: url("../../../static/组 234@2x.png");
						}
					}
				}

				.inputs {
					padding: 0 20rpx;
					text-align: left;
					margin-top: 20rpx;
					box-sizing: border-box;

					input {
						box-sizing: border-box;
						width: 100%;
						height: 80rpx;
						background: #FFFFFF;
						border-radius: 12rpx;
						margin-top: 20rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: #666666;
						padding: 0 30rpx;
					}

					button {
						margin-top: 30rpx;
						text-align: center;
						width: 100%;
						height: 80rpx;
						background: rgba(48, 96, 251, 0.949);
						border-radius: 12rpx;
						font-size: 30rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>

<template>
	<view class="content">
		<aloys-tab :tabs="tabs" @change="onTabChange">
			<view slot="content0" class="image">
				<image class="img" mode='widthFix' :src="tabs[0].image"></image>
			</view>
			<view slot="content1" class="image">
				<image class="img" mode='widthFix' :src="tabs[1].image"></image>
			</view>
		</aloys-tab>
	</view>
</template>

<script>
	import aloysTab from "@/components/aloys-tab/aloys-tab.vue"

	export default {
		components: {
			aloysTab
		},
		data() {
			return {
				tabs: [{
					title: '通过搜索查找',
					image: "https://www.ieduchina.com/statics/xc/images/1ee1e1a9.png"
				}, {
					title: '通过筛选查找',
					image: "https://www.ieduchina.com/statics/xc/images/1b756b3f.png"
				}]
			}
		},
		onLoad() {

		},
		methods: {
			onTabChange(index) {}
		}
	}
</script>

<style lang="scss">
	.content {
		position: absolute;
		height: 100%;
	}

	.image {
		width: 100%;
		padding: 24rpx 32rpx;
		box-sizing: border-box;
		background-color: rgba(243, 243, 247, 1);

		.img {
			width: 100%;
		}
	}
</style>

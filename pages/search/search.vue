<template>
	<view class="search-container">
		<!-- 页面导航 -->
		<uni-nav-bar left-icon="arrowleft" right-text="搜索" left-text="返回" @clickLeft="back" @clickRight="confirm">
			<view class="input-view">
				<uni-icons class="input-uni-icon" type="search" size="22" color="#666666" />
				<input v-model="inputVal" confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词" @confirm="confirm">
			</view>
		</uni-nav-bar>

		<!-- 最近搜索 -->
		<view class="search-his-conatiner">
			<view class="search-his-head v-f-s">
				<view style="font-size: 15px;line-height: 15px;">最近搜索</view>
				<view>
					<i class="iconfont icon-shanchu1-copy"></i>
				</view>
			</view>
			<view class="search-temp-container v-f">
				<span>好酒</span>
				<span>好123酒</span>
				<span>好23酒</span>
				<span>好21321酒</span>
				<span>好123酒</span>
				<span>好31酒</span>
				<span>好123酒</span>
			</view>
			<view class="search-his-foot v-f-s">
				<view style="font-size: 15px;line-height: 15px;">热门搜索</view>
				<view style="color: #999999;">隐藏</view>
			</view>
			<view class="search-temp-container v-f search-label">
				<span>好酒</span>
				<span>好酒</span>
				<span>好酒</span>
				<span>好酒</span>
				<span>好酒</span>
				<span>好酒</span>
				<span>好酒</span>
			</view>
		</view>
	</view>
</template>

<script>
	import UniNavBar from "@/components/uni-app/uni-nav-bar/uni-nav-bar.vue"
	import UniIcons from "@/components/uni-app/uni-icons/uni-icons.vue"
	export default {
		components: {
			UniNavBar,
			UniIcons
		},
		data() {
			return {
				inputVal: ""
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 搜索接口
			confirm() {
				console.log(this.inputVal);
			}
		}
	}
</script>

<style lang="scss">
	.search-container {
		.input-view {
			/* #ifndef APP-PLUS-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			/* width: 500rpx;
		*/
			flex: 1;
			background-color: #f8f8f8;
			height: 30px;
			border-radius: 15px;
			padding: 0 15px;
			flex-wrap: nowrap;
			margin: 7px 0;
			line-height: 30px;
		}

		.input-uni-icon {
			line-height: 30px;
		}

		.nav-bar-input {
			height: 30px;
			line-height: 30px;
			/* #ifdef APP-PLUS-NVUE */
			width: 370rpx;
			/* #endif */
			padding: 0 5px;
			font-size: 28rpx;
			background-color: #f8f8f8;
		}

		// 热搜历史部分
		.search-his-conatiner {
			padding: 20rpx;

			.search-his-head {
				color: #232326;
				height: 16px;
			}
		}

		.search-temp-container {
			margin-top: 10px;
			flex-wrap: wrap;

			span {
				display: block;
				color: #666;
				padding: 2px 10px;
				background-color: #F0F2F5;
				border-radius: 5px;
				margin-right: 10px;
				margin-bottom: 5px;
			}
			
			.hot-search{
				color: red;
			}
		}
		.search-his-foot{
			margin-top: 15px;
		}
		.search-label{
			:nth-child(1),:nth-child(2),:nth-child(3){
				color: red;
			}
		}
	}
</style>

<template>
	<view>
		<!-- 自定义导航 -->
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar :fixed="true" :border="false">
			<!-- 左边 -->
			<block slot="left">
				<view class="icon iconfont left-icon" :style="{'color':fontColor}" :class="[leftType]" @tap="clickLeftIcon"></view>
			</block>
			<block>
				<view class="center-icon" :class="{'icon-left':direction=='left','icon-right':direction=='right'}" @tap="clickInput">
					<input type="text" value="" v-model="inputModel" :placeholder="placeholder" class="placeholder-center"
					 placeholder-class="icon iconfont icon-sousuo center-icon-place" style="font-size: 16px;" :disabled="disabledFlag == 'true'" />
				</view>
			</block>
			<block slot="right">
				<view class="icon iconfont right-icon" :class="[rightType]" @tap="clickRightIcon"></view>
			</block>
		</uni-nav-bar>
	</view>
</template>

<script>
	import uniNavBar from "../uni-app/uni-nav-bar/uni-nav-bar.vue"
	export default {
		props: {
			direction: {
				type: String,
				default: 'center'
			},
			placeholder: {
				type: String,
				default: ' 搜索糗事'
			},
			leftType: {
				type: String,
				default: 'icon-qiandao'
			},
			rightType: {
				type: String,
				default: 'icon-bianji1'
			},
			rightText: {
				type: String,
				default: '取消'
			},
			disabledFlag: {
				type: String,
				default: "true"
			},
			fontColor: {
				type: String,
				default: '#FF9619'
			}
		},
		data() {
			return {
				inputModel: ""
			}
		},
		components: {
			uniNavBar
		},
		methods: {
			clickLeftIcon() {
				this.$emit("clickLeftIcon");
			},
			clickInput() {
				this.$emit("clickInput", this.inputModel);
			},
			clickRightIcon() {
				this.$emit("clickRightIcon");
			}
		}
	}
</script>

<style>
	/* 导航栏样式 start */
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.left-icon {
		width: 100%;
		font-size: 45upx;
		text-align: center;
	}

	.right-icon {
		width: 100%;
		font-size: 45upx;
		text-align: center;
	}

	.center-icon {
		width: 100%;
		height: 70upx;
		background-color: #F7F7F7;
		text-align: center;
		border-radius: 15upx;
	}

	.icon-left {
		text-align: left !important;
	}

	.icon-right {
		text-align: right !important;
	}

	.center-icon>input {
		width: 100%;
		height: 100%;
		font-size: 25upx;
	}

	.center-icon-place {
		font-size: 30upx;
		color: #CCCCCC;
		margin-left: 10upx;
	}

	.placeholder-center {
		margin-left: 10upx;
		/* font-size: 16px; */
		padding: 0 10upx;
	}

	/* 导航栏样式 end */
</style>

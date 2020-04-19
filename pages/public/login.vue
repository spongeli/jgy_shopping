<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view v-if="isLogin">
				<view class="left-top-sign">LOGIN</view>
				<view class="welcome">
					欢迎回来！
				</view>
				<view class="input-content">
					<view class="input-item">
						<text class="tit">手机号码/邮箱</text>
						<input type="number" :value="mobile" placeholder="请输入手机号码/邮箱" maxlength="11" data-key="mobile" @input="inputChange" />
					</view>
					<view class="input-item">
						<text class="tit">密码</text>
						<input type="mobile" value="" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
						 password data-key="password" @input="inputChange" @confirm="toLogin" />
					</view>
				</view>
				<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
				<view class="forget-section">
					忘记密码?
				</view>
			</view>
			<view v-else class="register-container">
				<view class="input-content">
					<view class="input-item">
						<text class="tit">手机号码/邮箱</text>
						<input type="number" :value="mobile" placeholder="请输入手机号码/邮箱" maxlength="11" data-key="mobile" @input="inputChange" />
					</view>
					<view class="input-item">
						<text class="tit">密码</text>
						<input type="mobile" value="" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
						 password data-key="password" @input="inputChange" @confirm="toLogin" />
					</view>
					<view class="input-item">
						<text class="tit">密码</text>
						<input type="mobile" value="" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
						 password data-key="password" @input="inputChange" @confirm="toLogin" />
					</view>
				</view>
			</view>
		</view>


		<view class="register-section">
			<view v-if="isLogin" class="v-f-c">
				<view>还没有账号?</view>
				<text @click="isLogin = !isLogin">马上注册</text>
			</view>
			<view v-else class="v-f-c">
				<view>我有账号了~</view>
				<text @click="isLogin = !isLogin">去登陆</text>
			</view>
		</view>

		<!-- 第三方登陆 -->
		<!-- #ifdef APP-PLUS || H5 -->
		<view class="other-login-container">
			<view class="dividing-container v-f-s">
				<view class="dividing"></view>
				<view>其他登陆方式</view>
				<view class="dividing"></view>
			</view>
			<view class="other-item-container v-f-c">
				<view class="v-fc-s">
					<view class="iconfont icon-QQ"></view>
					<view class="iconfont-text">QQ</view>
				</view>
				<view style="margin-left: 35px;" class="v-fc-s">
					<view class="iconfont icon-weixindenglu"></view>
					<view class="iconfont-text">微信</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="other-login-container">
			<view class="other-login-container">
				<view class="dividing-container v-f-s">
					<view class="dividing"></view>
					<view>其他登陆方式</view>
					<view class="dividing"></view>
				</view>
				<view class="other-item-container v-f-c">
					<view class="v-fc-s">
						<view class="iconfont icon-weixindenglu"></view>
						<view class="iconfont-text">微信</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<view class="login-footer">未注册的手机号验证后将自动创建账号, 登录即代表您已同意<span style="color: #4a90e2;">隐私政策</span>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				mobile: '',
				password: '',
				logining: false,

				isLogin: true
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			async toLogin() {
				this.logining = true;
				const {
					mobile,
					password
				} = this;
				/* 数据验证模块
				if(!this.$api.match({
					mobile,
					password
				})){
					this.logining = false;
					return;
				}
				*/
				const sendData = {
					mobile,
					password
				};
				const result = await this.$api.json('userInfo');
				if (result.status === 1) {
					this.login(result.data);
					uni.navigateBack();
				} else {
					this.$api.msg(result.msg);
					this.logining = false;
				}
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 100rpx;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		height: 820rpx;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		margin-left: 20rpx;
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin: 0 auto;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 100upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}

	.other-login-container {
		padding: 0 60rpx;

		.dividing-container {
			color: #CCCCCC;

			.dividing {
				width: 150upx;
				height: 2rpx;
				background-color: #CCCCCC;
				margin-top: 18rpx;
			}
		}

		.other-item-container {
			margin-top: 30rpx;

			.iconfont {
				font-size: 40px;
			}

			.icon-QQ {
				color: #4CAFE9;
			}

			.icon-weixindenglu {
				color: #09BA07;
			}

			.iconfont-text {
				margin-top: 10rpx;
				font-size: 12px;
				text-align: center;
				color: rgba(0, 0, 0, .4);
				;
			}
		}
	}

	.login-footer {
		padding: 0 80rpx;
		text-align: center;
		margin-top: 40rpx;
		color: grey;
	}
</style>

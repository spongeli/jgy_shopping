<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty === true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				<view>空空如也</view>
				<!-- #ifdef H5 -->
				<view class="navigator" @click="navToLogin">去登陆></view>
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<button class="login-button" type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN"
				 @getuserinfo="wxGetUserInfo">
					一键快捷登陆
				</button>
				<!-- #endif -->
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="index">
					<view class="cart-item b-b">
						<view class="image-wrapper">
							<image style="opacity: 1;" :src="getHeaderImgUrl(item.goodsHeaderImg)" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
							 @error="onImageError('cartList', index)" @click="toPublicDetail(item)"></image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{ item.goodsName }}</text>
							<text class="attr">{{ item.selectStyle }}</text>
							<text class="price" style="color: #fa436a;">¥{{ item.goodsPrice }}</text>
							<uni-number-box class="step" :min="1" :max="item.goodsCount" :value="item.number > item.goodsCount ? item.goodsCount : item.number"
							 :isMax="item.number >= item.goodsCount ? true : false" :isMin="item.number === 1" :index="index" @eventChange="numberChange"></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index,item.cardId)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked ? '/static/selected.png' : '/static/select.png'" mode="aspectFit" @click="check('all')"></image>
				</view>
				<view class="total-box">
					<text class="price">合计： ¥{{ total }}</text>
					<!-- 					<text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text> -->
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniPopup from "@/components/uni-app/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniNumberBox,
			uniPopup
		},
		data() {
			return {
				isLastPage: false,
				pageInfo: {
					pageSize: 10,
					pageCurrentPage: 1
				},

				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: []
			};
		},
		onShow() {
			this.pageInfo.pageCurrentPage = 1
			this.isLastPage = false;
			this.innitCardList(true);
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		computed: {
			hasLogin() {
				return this.$store.state.hasLogin
			}
		},
		methods: {
			innitCardList(first) {
				this.$post(`/card/list`, this.pageInfo).then(res => {
					if (res[1]) {
						let resData = res[1].data
						console.log(resData);
						if (resData.status == 200) {
							this.isLastPage = resData.data.isLastPage
							this.pageInfo.pageCurrentPage = resData.data.pageNum + 1
							if (first) {
								this.cartList = resData.data.list
							} else {
								this.cartList.push(...resData.data.list)
							}
						}
					} else {
						this.$util.showFail("服务器异常");
					}
				})
			},

			login() {
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						console.log(loginRes.code);
						this.$get("/wx/login", {
							token: loginRes.code
						}).then(res => {
							if (res[1]) {
								debugger
								this.$store.commit("submitToken", res[1].data)
							} else {
								this.$util.showFail(`服务器异常`)
							}
						})
					}
				});
			},
			wxGetUserInfo(val) {
				// 获取用户信息
				uni.getUserInfo({
					provider: 'weixin',
					withCredentials: true,
					success: infoRes => {
						let userInfo = infoRes.userInfo
						this.$post(`/user/wxlogin`, {
							nickname: userInfo.nickName,
							userpic: userInfo.avatarUrl
						}).then(res => {
							if (res[1]) {
								let resData = res[1].data
								console.log(resData);
								if (resData.status == 200) {
									this.$store.commit(`login`, resData.data)
								}
							} else {
								this.$util.showFail(`服务器异常`)
							}
						})
					}
				});
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked;
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					});
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data) {
				console.log(data);
				this.cartList[data.index].number = data.number;
				this.$get(`/card/update/${this.cartList[data.index].cardId}`, {
					number: data.number
				}).then(res => {
					if (res[1]) {
						let resData = res[1].data
					} else {
						this.$util.showFail("服务器异常");
					}
				})
				this.calcTotal();
			},
			//删除
			deleteCartItem(index, cardId) {
				uni.showModal({
					content: '从购物车里删除该商品?',
					success: e => {
						if (e.confirm) {
							this.$post(`/card/delete/${cardId}`).then(res => {
								if (res[1]) {
									let resData = res[1].data
									this.cartList.splice(index, 1);
									this.calcTotal();
									uni.hideLoading();
								} else {
									this.$util.showFail("服务器异常");
								}
							})
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						total += item.goodsPrice * item.number;
					} else if (checked === true) {
						checked = false;
					}
				});
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].goodsHeaderImg = '/static/errorImage.jpg';
			},
			//创建订单
			createOrder() {
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item => {
					if (item.checked) {
						goodsData.push({
							attr_val: item.attr_val,
							number: item.number
						});
					}
				});

				uni.navigateTo({
					url: `/pages/order/createOrder?data=${JSON.stringify({
					goodsData: goodsData
				})}`
				});
			},
			getHeaderImgUrl(item) {
				if (item.indexOf(",") > 1) {
					return item.split(',')[0]
				}
				return item
			},
			toPublicDetail(item) {
				console.log(item);
				uni.navigateTo({
					url: `/pages/product/product?id=${item.goodId}`
				})
			}
		},
		onReachBottom() {
			if (!this.isLastPage) {
				this.innitCardList()
			}
		}
	};
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm + 2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 180upx;
			height: 180upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 30upx;
				margin: 8rpx 0;
				line-height: 30upx;
			}

			.price {
				height: 30upx;
				line-height: 30upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: 0.2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72);
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}


	.auth-container {
		background-color: #FFFFFF;
		width: 700rpx;
		height: 300rpx;

		.header {
			margin: 90rpx 0 90rpx 50rpx;
			border-bottom: 1px solid #ccc;
			text-align: center;
			width: 650rpx;
			height: 300rpx;
			line-height: 450rpx;
		}

		.header image {
			width: 200rpx;
			height: 200rpx;
		}

		.content {
			margin-left: 50rpx;
			margin-bottom: 90rpx;
		}

		.content text {
			display: block;
			color: #9d9d9d;
			margin-top: 40rpx;
		}

		.bottom {
			border-radius: 80rpx;
			margin: 70rpx 50rpx;
			font-size: 35rpx;
		}
	}

	.login-button {
		width: 300rpx;
		color: #fa436a !important;
		border: 0px !important;
		font-size: 14px !important;
		height: auto !important;
		background-color: #FFFFFF !important;
	}
</style>

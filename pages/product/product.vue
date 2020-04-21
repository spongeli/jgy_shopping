<template>
	<view class="container">
		<!-- 产品轮播图 -->
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in getImgList" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 产品信息 -->
		<view class="introduce-section">
			<text class="title">{{productDetail.goodsName}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{productDetail.goodsPrice}}</text>
				<text class="m-price">¥{{productDetail.goodsOriginalPrice}}</text>
				<!-- <text class="coupon-tip">7折</text> -->
			</view>
			<view class="bot-row">
				<text>销量: {{productDetail.salesCount}}</text>
				<text>库存: {{productDetail.goodsCount}}</text>
				<text>浏览量: {{productDetail.scanCount}}</text>
			</view>
		</view>

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(item, index) in selectedCates" :key="index">
						{{item.attrName}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<!-- 			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view> -->
			<!-- 			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view> -->
			<view class="c-row b-b">
				<text class="tit">参数</text>
				<view class="con-list">
					<text v-for="(item,index) in staticsCates" :key="index">
						<span class="staticsKey">{{item.attrName}}</span>
						<span class="staticsValue" v-for="(item1,index1) in item.attrValue.split(',')" :key="index1">
							{{item1}}
						</span>
					</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>

				<view class="bz-list con">
					<block v-for="(item,index) in serviceCates" :key="index">
						<text v-for="(item1,index1) in item.attrValue.split(',')" :key="index1">
							{{item1}} ·
						</text>
					</block>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>(86)</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box">
				<image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					<view class="bot">
						<text class="attr">购买类型：XL 红色</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="zhImgDetail(productDetail.goodsDetail)"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<!-- 			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
 -->
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addCard">加入购物车</button>
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="getImgFirst"></image>
					<view class="right">
						<text class="price">¥{{productDetail.goodsPrice}}</text>
						<text class="stock">库存：{{productDetail.goodsCount}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(item, index) in selectedCates" :key="index">
								{{item.attrName}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in dynamicCates" :key="index" class="attr-list">
					<text>{{item.attrName}}</text>
					<view class="item-list">

						<text v-for="(childItem, childIndex) in item.attrValue.split(',')" :key="childIndex" class="tit" :class="{selected: validSelected(item.attrId,childItem)}"
						 @click="selectSpec(item.attrId, childItem)">
							{{childItem}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	export default {
		components: {
			share
		},
		data() {
			return {
				// 产品信息
				productDetail: {},
				staticsCates: [],
				dynamicCates: [],
				serviceCates: [],

				selectedCates: [],

				specClass: 'none',
				specSelected: [],

				favorite: true,
				shareList: []
			};
		},
		async onLoad(options) {
			// 获取商品详情
			this.gainGoodDetail(options.id);

			this.shareList = await this.$api.json('shareList');
			
			// 保存浏览历史
			this.saveScanGoods();
		},
		methods: {
			zhImgDetail(val) {
				if (val == null) {
					return;
				}
				// 正则匹配所有img标签
				// var regex0 = new RegExp("(i?)(\<img)([^\>]+\>)","gmi");
				// 正则匹配不含style="" 或 style='' 的img标签
				// eslint-disable-next-line no-useless-escape
				var regex1 = new RegExp("(i?)(\<img)(?!(.*?style=['\"](.*)['\"])[^\>]+\>)", 'gmi')
				// 给不含style="" 或 style='' 的img标签加上style=""
				val = val.replace(regex1, '$2 style=""$3')
				// 正则匹配含有style的img标签
				// eslint-disable-next-line no-useless-escape
				var regex2 = new RegExp("(i?)(\<img.*?style=['\"])([^\>]+\>)", 'gmi')
				// 在img标签的style里面增加css样式(这里增加的样式：display:block;max-width:100%;height:auto;border:5px solid red;)
				val = val.replace(regex2, '$2max-width:100%;height:auto;$3')
				return val
			},
			// 获取商品详情
			gainGoodDetail(goodId) {
				this.$get(`/goods/${goodId}`).then(res => {
					if (res[0]) {
						this.$util.showFail("服务器异常")
					} else {
						let resData = res[1].data
						console.log(resData);
						if (resData.status == 200) {
							this.productDetail = resData.data.goods
							this.dynamicCates = resData.data.dynamicCates
							this.staticsCates = resData.data.staticsCates
							this.serviceCates = resData.data.serviceCates
							this.innitCateParam();
						}
					}
				})
			},
			innitCateParam() {
				//规格 默认选中第一条
				this.dynamicCates.forEach(item => {
					let selectedCate = {}
					selectedCate.attrId = item.attrId
					selectedCate.attrName = item.attrValue.split(",")[0]
					this.selectedCates.push(selectedCate)
				})
			},
			validSelected(attrId, item) {
				for (let i = 0; i < this.selectedCates.length; i++) {
					if (this.selectedCates[i].attrId == attrId) {
						return item == this.selectedCates[i].attrName
					}
				}
				return false;
			},
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(attrId, attrName) {
				this.selectedCates.forEach(item => {
					if (item.attrId == attrId) {
						item.attrName = attrName
					}
				})
			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			buy() {
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			stopPrevent() {},
			// 加入购物车
			addCard() {
				console.log(this.$store.state.hasLogin);
				if (!this.$store.state.hasLogin) {
					uni.showModal({
						title: '提示',
						content: '还没登陆呢，快去登录~',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: `/pages/public/login`
								})
							} else if (res.cancel) {

							}
						}
					});
					return;
				}

				let selectStyle = '';
				this.selectedCates.forEach(item => {
					selectStyle += item.attrName + " "
				})

				this.$post(`/card/add`, {
					goodsId: this.productDetail.goodsId,
					number: 1,
					selectStyle: selectStyle
				}).then(res => {
					if (res[0]) {
						this.$util.showFail("服务器异常")
					} else {
						let resData = res[1].data
						console.log(resData);
						if (resData.status == 200) {
							this.$util.showSuccess("添加成功，在购物车等亲~");
						}
					}
				})
			},
			saveScanGoods(){
				if(!this.$store.state.hasLogin){
					// 记录用户浏览历史
					this.$store.commit(`submitScanGoods`,this.productDetail.goodsId)
				}
			}
		},
		computed: {
			getImgList() {
				if (this.productDetail.goodsHeaderImg) {
					return this.productDetail.goodsHeaderImg.split(",")
				}
				return []
			},
			getImgFirst() {
				if (this.productDetail.goodsHeaderImg) {
					return this.productDetail.goodsHeaderImg.split(",")[0]
				}
				return ""
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			min-height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;

			.staticsKey {
				color: #999;
				margin-right: 15px;
			}

			.staticsValue {
				color: #333;
				margin-left: 5px;
			}
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 50upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 650upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
</style>

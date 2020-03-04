<template>
	<view class="content">
		<!-- 页面导航 -->
		<uni-nav-bar fixed left-icon="arrowleft" right-text="搜索" left-text="返回" @clickLeft="back" @clickRight="confirm">
			<view class="input-view">
				<uni-icons class="input-uni-icon" type="search" size="22" color="#666666" />
				<input v-model="searchInparam.search" confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词"
				 @confirm="confirm">
			</view>
		</uni-nav-bar>

		<!-- 导航栏 -->
		<view class="navbar">
			<view class="nav-item" :class="{current: searchInparam.orderRule == '1'}" @click="tabClick('1')">
				综合排序
			</view>
			<view class="nav-item" :class="{current:  searchInparam.orderRule == '2'}" @click="tabClick('2')">
				销量优先
			</view>
			<view class="nav-item" :class="{current: (searchInparam.orderRule == '3' || searchInparam.orderRule == '4') }"
			 @click="tabClick('3')">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: searchInparam.orderRule == '3'}" class="yticon icon-shang"></text>
					<text :class="{active: searchInparam.orderRule == '4'}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>

		<!-- 商品集合 -->
		<view style="margin-top: 84px;">
			<goods-list :goodsList="goodsList"></goods-list>
		</view>

		<!-- 加载更多 -->
		<load-more :moreLoadText="moreLoadText"></load-more>


		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.categoryId">
						<view class="cate-item b-b two">{{item.categoryName}}</view>
						<view v-for="tItem in item.children" :key="tItem.categoryId" class="cate-item b-b" :class="{active: tItem.categoryId==searchInparam.cateId}"
						 @click="changeCate(tItem)">
							{{tItem.categoryName}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

	</view>
</template>

<script>
	import LoadMore from "@/components/common/load-more.vue"
	import goodsList from "@/components/common/goods-list.vue"
	import UniNavBar from "@/components/uni-app/uni-nav-bar/uni-nav-bar.vue"
	import UniIcons from "@/components/uni-app/uni-icons/uni-icons.vue"
	export default {
		components: {
			LoadMore,
			goodsList,
			UniNavBar,
			UniIcons
		},
		data() {
			return {
				cateList: [],
				searchText: "",
				searchInparam: {
					search: "",
					orderRule: "1",
					cateId: -1,
					pageInparam: {
						pageSize: 10,
						pageCurrentPage: 0
					}
				},
				moreLoadText: "正在加载更多",
				goodsList: [],
				cateMaskState: 0, //分类面板展开状态

			};
		},

		onLoad(options) {
			// 分类查询
			this.searchInparam.cateId = options.id ? options.id : -1

			this.searchText = options.search;
			// 加载分类信息
			this.loadCateList();
			// 加载列表数据
			this.loadData();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData(true, true);
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods: {
			//加载分类
			async loadCateList() {
				this.$get("/cates").then(res => {
					let fail = res[0]
					let success = res[1]
					console.log(success);
					if (success.data.status == 200) {
						this.cateList = success.data.data
					}
				})
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(isReLoad = false, isPullDown = false) {
				if (!isReLoad && this.moreLoadText != '正在加载更多') {
					return;
				}
				if (isReLoad) {
					this.searchInparam.pageInparam.pageCurrentPage = 0
					this.moreLoadText = '正在加载更多'
				}
				this.searchInparam.pageInparam.pageCurrentPage += 1
				this.$post(`/goods`, this.searchInparam).then(res => {
					if (isPullDown) {
						uni.stopPullDownRefresh();
					}

					let fail = res[0];
					let success = res[1]
					if (fail) {
						uni.showToast({
							title: "服务器异常",
							icon: "none"
						})
					} else {

						console.log(success);
						if (success.data.status == 200) {
							let data = success.data.data
							// 是否还有下一页
							if (!data.hasNextPage) {
								this.moreLoadText = '我是有底线的(⊙o⊙)'
							} else {
								this.moreLoadText = '正在加载更多'
							}
							if (isReLoad) {
								// 重新t加载
								this.goodsList = data.list;

								uni.pageScrollTo({
									duration: 300,
									scrollTop: 0
								})

							} else {
								// 追加
								this.goodsList.push(...data.list);
							}
						}
					}
				})
			},
			//筛选点击
			tabClick(index) {

				if (index == '3') {
					this.searchInparam.orderRule = this.searchInparam.orderRule == '3' ? '4' : '3'
				} else {
					this.searchInparam.orderRule = index
				}

				// 重新加载
				this.loadData(true);
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item) {
				this.searchInparam.cateId = item.categoryId;
				this.toggleCateMask();
				this.loadData(true);
			},
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.title;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			confirm() {
				this.loadData(true);
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.content {
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
	}

	.navbar {
		position: fixed;
		left: 0;
		top: 44px;
		display: flex;
		width: 100%;
		height: 40px;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: 84px;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}
</style>

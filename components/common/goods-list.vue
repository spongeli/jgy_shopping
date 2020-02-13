<template>
	<view class="guess-section">
		<view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item.goodsId)">
			<view class="image-wrapper"><image :src="getHeaderImgUrl(item.goodsHeaderImg)" mode="aspectFill"></image></view>
			<text class="title clamp">{{ item.goodsName }}</text>
			<text class="price">￥{{ item.goodsPrice }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			goodsList:Array
		},
		methods:{
			//详情页
			navToDetailPage(id) {
				//测试数据没有写id，用title代替
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				});
			},
			getHeaderImgUrl(item){
				if(item.indexOf(",") > 1){
					return item.split(',')[0]
				}
				return item
			}
		},
		created() {
			console.log(this.goodsList);
		}
	}
</script>

<style lang="scss">
	/* 猜你喜欢 */
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
</style>

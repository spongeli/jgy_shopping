<template>
	<div class="load_more v-fc">
		{{moreLoadText}}
	</div>
</template>

<script>
	export default {
		props:{
			moreLoadText:String
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style scoped>
	.load_more{
		height: 80upx;
		background-color: #FFFFFF;
		color: #C0C4CC;
		box-shadow: 0 0px 1px rgba(243, 243, 243);
		font-size: 14px;
	}
</style>

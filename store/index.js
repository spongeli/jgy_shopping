import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		
		cateParent: [],
		token: ``,
		
		// 用户浏览历史
		scanList:[]
	},
	mutations: {
		login(state, userInfo) {
			state.hasLogin = true;
			state.userInfo = userInfo;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: userInfo
			})
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
			uni.removeStorage({
				key: 'token'
			})
		},
		submitToken(state, token) {
			uni.setStorage({
				key: "token",
				data: token
			})
			state.token = token
		},
		// 提交浏览历史记录
		submitScanGoods(state,goodsid){
			let index = state.scanList.indexOf(goodsid);
			console.log(index);
			if(index >= 0){
				state.scanList.splice(index,1);
			}
			state.scanList.unshift(goodsid)
			console.log(state.scanList);
		}
	},
	actions: {

	},
	getters: {
		// websocket相关
		onEventLogin(state) {
			return function() {
				return state.hasLogin
			}
		},
	}
})

export default store

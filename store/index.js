import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		
		cateParent: [],
		token: ``,
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
		},
		submitToken(state, token) {
			uni.setStorage({
				key: "token",
				data: token
			})
			state.token = token
		}
	},
	actions: {

	},
	getters: {

	}
})

export default store

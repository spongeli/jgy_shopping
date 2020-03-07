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
		login(state, provider) {

			state.hasLogin = true;
			state.userInfo = provider;

			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: provider
			})
			console.log(state.userInfo);
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

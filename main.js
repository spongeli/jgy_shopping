import Vue from 'vue'
import store from './store'
import App from './App'

import CONST from 'common/const.js'
import Json from './Json' //测试用数据
import util from "common/util.js"

const json = type => {
	//模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$util = util;
Vue.prototype.$api = {
	json,
	prePage
};

Vue.prototype.$const = CONST;
require("./request/request.js")


App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

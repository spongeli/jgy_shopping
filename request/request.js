import Vue from 'vue'


Vue.prototype.$get = function(url, data) {
	// 返回一个Promise
	return uni.request({
		url: this.$const.SERVER_URL + url,
		data: data,
		header: {
			"token": uni.getStorageSync('token')
		}
	})
}

Vue.prototype.$post = function(url, data) {
	// 返回一个Promise
	return uni.request({
		url: this.$const.SERVER_URL + url,
		method: "POST",
		data: data,
		header: {
			"token": uni.getStorageSync('token')
		}
	})
}

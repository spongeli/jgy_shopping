import Vue from 'vue'


Vue.prototype.$get = function(url, data){
	// 返回一个Promise
	return uni.request({
		url: this.$const.SERVER_URL + url,
	})
}

Vue.prototype.$post = function(url, data){
	// 返回一个Promise
	return uni.request({
		url: this.$const.SERVER_URL + url,
		method: "POST",
		data: data
	})
}
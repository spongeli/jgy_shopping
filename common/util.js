export default {
	showSuccess(title, duration = 1500, mask = false, icon = 'success') {
		//统一提示方便全局修改
		if (Boolean(title) === false) {
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon
		});
	},
	showFail(title, duration = 1500, mask = false, icon = 'none') {
		//统一提示方便全局修改
		if (Boolean(title) === false) {
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon
		});
	}
}

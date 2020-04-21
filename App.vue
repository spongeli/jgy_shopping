<script>
	export default {
		onLaunch: function() {
			// 检查登陆状态 没有登陆就去登陆
			// #ifdef MP-WEIXIN
			uni.checkSession({
				fail: res => {
					this.login();
				},
				success: () => {
					let token = uni.getStorageSync('token');
					if (!token) {
						this.login();
					} else {
						this.$store.commit(`login`, uni.getStorageSync('userInfo'));
					}
				}
			});
			// #endif

			// 除了微信小程序其他编译器均编译
			// #ifndef MP-WEIXIN
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.$store.commit(`login`, userInfo);
				console.log(uni.getStorageSync('token'));;
				this.$store.commit(`submitToken`, uni.getStorageSync('token'));
			}
			// #endif
		},
		methods: {
			// #ifdef MP-WEIXIN
			login() {
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						this.$get('/wx/login', {
							token: loginRes.code
						}).then(res => {
							if (res[1]) {
								let resData = res[1].data;
								console.log(resData, 'resData');
								this.$store.commit('submitToken', resData.data.token);
								// 如果nickname存在，则已经登陆了
								if (resData.data.userinfo.nickname) {
									this.$store.commit(`login`, resData.data.userinfo);
								}
							} else {
								uni.showToast({
									title: '服务器异常',
									icon: 'none'
								});
							}
						});
					}
				});
			},
			// #endif
			loginInnit(){
				console.log(this.$store.state.scanList);
				if(this.$store.state.scanList.length > 0){
					this.$get(`/user/scan`,{ids:this.$store.state.scanList}).then(res => {
						if(res[1]){
							let resData = res[1].data
							console.log(resData);
						}
					})
				}
			}
		},
		// 计算登陆状态
		computed:{
			hasLogin(){
				return this.$store.getters.onEventLogin()
			}
		},
		watch: {
			// 监听登陆
			hasLogin(newval,oldval) {
				if(newval){
					this.loginInnit()
				}
			}
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style lang="scss">
	@import url('./static/css/base.scss');
	@import url('./static/css/my-base.css');
	@import url('./static/css/icon.css');
	@import url('./static/css/uni.css');

	/*
		全局公共样式和字体图标
	*/
	/* @font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	} */

	/* 骨架屏替代方案 */
	.Skeleton {
		background: #f3f3f3;
		padding: 20upx 0;
		border-radius: 8upx;
	}

	/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;

		image {
			width: 100%;
			height: 100%;
			transition: 0.6s;
			opacity: 0;

			&.loaded {
				opacity: 1;
			}
		}
	}

	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	.common-hover {
		background: #f5f5f5;
	}

	/*边框*/
	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(0.5);
		border-bottom: 1px solid $border-color-base;
	}

	.b-b:after {
		bottom: 0;
	}

	.b-t:after {
		top: 0;
	}

	/* button样式改写 */
	uni-button,
	button {
		height: 80upx;
		line-height: 80upx;
		font-size: $font-lg + 2upx;
		font-weight: normal;

		&.no-border:before,
		&.no-border:after {
			border: 0;
		}
	}

	uni-button[type='default'],
	button[type='default'] {
		color: $font-color-dark;
	}

	/* input 样式 */
	.input-placeholder {
		color: #999999;
	}

	.placeholder {
		color: #999999;
	}
</style>

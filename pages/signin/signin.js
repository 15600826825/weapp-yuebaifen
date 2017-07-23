const App = getApp()
Page({
	data: {
		form: {
			tel: '',
			password: ''
		},
    loading: false
	},
	onLoad() {
		this.initValidate()
		this.$wuxToptips  = App.wux(this).$wuxToptips
	},
	showToptips(msg) {
		this.$wuxToptips.error({
      icon: '',
			text: msg,
		})
	},
  telChange (e) {
    this.setData({
      'form.tel': e.detail.value
    })
  },
  passChange (e) {
    console.log(e)
    this.setData({
      'form.password': e.detail.value
    })
  },
  clearTel () {
    this.setData({
      'form.tel': ''
    })
  },
  clearPass () {
    this.setData({
      'form.password': ''
    })
  },
	submitForm (e) {
		let that = this;
		const params = e.detail.value
		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
			this.showToptips(error.msg)
			return false
		}
    this.setData({
      loading: true
    })
		App.request({
			url: App.api.requestLogin,
			method: 'POST',
			data: {
        mobile: params.tel,
        pass: App.Md5.hex_md5(params.password)
      },
			success(res) {
        that.setData({
          loading: false
        })
        let result = res.data.result;
        let customerUser = result.customerUser;
        let customerSessionId = result.customerSessionId;
        wx.setStorage({key: 'user', data: customerUser})
        wx.setStorage({key: 'sessionId', data: customerSessionId})
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })
        wx.redirectTo({url: '../home/home'})
      },
      other() {
        that.setData({
          loading: false
        })
      }
		})
		// wx.request({
  //     url: `${App.globalData.baseUrl}/user/loginByMobileAndPassword.json`,
  //     method: 'POST',
  //     data: {
  //       mobile: params.tel,
  //       pass: App.Md5.hex_md5(params.password)
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function(res) {
  //       console.log(res)
  //       App.$http()
  //       App.interceptor(res)
  //       if(res.data.code === 0) {
  //         let result = res.data.result;
  //         let customerUser = result.customerUser;
  //         let customerSessionId = result.customerSessionId;
  //         wx.setStorage({key: 'user', data: customerUser})
  //         wx.setStorage({key: 'sessionId', data: customerSessionId})
  //         wx.showToast({
  //           title: '登录成功',
  //           icon: 'success',
  //           duration: 1000
  //         })
  //         wx.redirectTo({url: '../home/home'})
  //       } else {
  //         // that.showToast(res.data.message)
  //         wx.showToast({
  //           title: res.data.message,
  //         	image: '../../assets/images/iconfont-toptips.png', 
  //         })
  //       }
  //     },
  //     fail: function(res) {
  //       console.log('error')
  //     }
  //   })
		// this.$wuxToast.show({
		// 	type: 'success',
		// 	hide: !0, 
		// 	text: '提交成功', 
		// })
		// wx.navigateTo({
		// 	url: '../index/index?id=123'
		// })
		// wx.showNavigationBarLoading()
	},
	onPullDownRefresh () {
    // wx.stopPullDownRefresh()
  },
  initValidate() {
    this.WxValidate = App.WxValidate({
			tel: {
				required: true, 
				tel: true, 
			},
			password: {
				required: true, 
				rangelength: [6, 20], 
			},
		}, {
			tel: {
				required: '请输入手机号', 
				tel: '请输入正确的手机号', 
			},
			password: {
				required: '请输入密码', 
				rangelength: '密码在6-20位之间', 
			},
		})
  },
})
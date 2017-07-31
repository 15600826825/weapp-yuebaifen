const App = getApp();
Page({
	data: {
		form: {
			oldPassword: '',
			newPassword: '',
			confirmPass: ''
		}
	},
	onLoad(options){
    this.initValidate()
    this.$wuxToptips = App.wux(this).$wuxToptips
  },
  showToptips(error) {
    const hideToptips = this.$wuxToptips.show({
      icon: '',
      timer: 1000,
      text: error.msg || '请填写正确的字段',
      success: () => console.log('toptips', error)
    })
  },
	formSubmit(e) {
		let that = this;
		let params = e.detail.value;
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showToptips(error)
      return false
    }
    let data = {
      oldPassword: App.Md5.hex_md5(params.oldPassword),
      newPassword: App.Md5.hex_md5(params.newPassword),
      customerSessionId: wx.getStorageSync('sessionId')
    }
		App.request({
      url: App.api.modifyPassword,
      method: 'POST',
      data: data,
      success(res) {
    		that.$wuxToptips.success({
          hide: !0, 
          text: '修改成功',
        })
        wx.navigateTo({url: '../index/index'})
      }
    })
	},
  initValidate() {
    this.WxValidate = App.WxValidate({
      oldPassword: {
        required: true,
      },
      newPassword: {
        required: true,
        password: true
      },
      confirmPass: {
        required: true,
        equalTo: 'newPassword'
      }
    }, {
      oldPassword: {
        required: '请输入原密码',
      },
      newPassword: {
        required: '请输入新密码',
        password: '密码在6 到 20位之间，只能是字母和数字的组合'
      },
      confirmPass: {
        required: '请再次输入密码',
        equalTo: '两次密码输入不一致'
      }
    })
    this.WxValidate.addMethod('password', (value, param) => {
      return this.WxValidate.optional(value) || (value.match(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/))
    })
  }
})
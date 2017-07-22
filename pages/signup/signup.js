const App = getApp()
Page({
	data: {
		form: {
			mobile: '',
      pass: '',
      inCode: '',
      imgCodeUrl: '',
      imgSessionId: '',
      cardNo: '',
      name: '',
      smsCode: '',
      qq: '',
      email: '',
      agree: true
		}
	},
	onLoad() {
		this.initValidate()
		this.$wuxToptips  = App.wux(this).$wuxToptips
		this.getRandomImage()
	},
	showToptips(msg) {
		this.$wuxToptips.error({
      icon: '',
			text: msg,
			timer: 1500
		})
	},
	telChange (e) {
		console.log(e)
    this.setData({
      'form.mobile': e.detail.value
    })
  },
  inCodeChange (e) {
    this.setData({
      'form.inCode': e.detail.value
    })
  },
  smsChange (e) {
    this.setData({
      'form.smsCode': e.detail.value
    })
  },
  nameChange(e) {
    this.setData({
      'form.name': e.detail.value
    })
  },
  cardChange(e) {
    this.setData({
      'form.cardNo': e.detail.value
    })
  },
  qqChange(e) {
    this.setData({
      'form.qq': e.detail.value
    })
  },
  emailChange(e) {
    this.setData({
      'form.email': e.detail.value
    })
  },
  passChange(e) {
    this.setData({
      'form.pass': e.detail.value
    })
  },
  clearTel (e) {
    this.setData({
      'form.mobile': ''
    })
  },
  clearName(e) {
    this.setData({
      'form.name': ''
    })
  },
  clearCard(e) {
    this.setData({
      'form.cardNo': ''
    })
  },
  clearQQ(e) {
    this.setData({
      'form.qq': ''
    })
  },
  clearEmail(e) {
    this.setData({
      'form.email': ''
    })
  },
  clearPass(e) {
    this.setData({
      'form.pass': ''
    })
  },
  getRandomImage () {
    let that = this;
    App.request({
        url: App.api.getRandomImage,
        method: 'GET',
        success(res) {
          console.log(res.data)
          that.setData({
            'form.imgCodeUrl': res.data.result.imgBase64,
            'form.imgSessionId': res.data.result.imgSessionId
          })
        },
    })
  },
  getSmsCode () {
  	let form = {
  		detail: {
  			value: {
  				mobile: this.data.form.mobile,
  				inCode: this.data.form.inCode,
  			}
  		}
  	}
  	if (!this.Validate.checkForm(form)) {
			const error = this.Validate.errorList[0]
			this.showToptips(error.msg)
			return false
		}
  },
  submitForm(e) {
  	let that = this;
  	console.log(e)
		const params = e.detail.value;
		console.log(params)
		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
			this.showToptips(error.msg)
			return false
		}
		// App.request({
		// 	url: App.api.loginUrl,
		// 	method: 'POST',
		// 	data: {
  //       mobile: params.tel,
  //       pass: App.Md5.hex_md5(params.password)
  //     },
		// 	success(res) {
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
  //     },
		// })
  },
  initValidate() {
    this.WxValidate = App.WxValidate({
      mobile: {
        required: true,
        tel: true, 
      },
      inCode: {
        required: true,
      },
      smsCode: {
        required: true,
      },
      name: {
        required: true,
      },
      cardNo: {
        required: true,
        idcard: true
      },
      qq: {
        number: true,
        minlength: 5
      },
      email: {
        email: true
      },
      pass: {
        required: true,
        password: true
      },
      agree: {
        required: true
      },
    }, {
      mobile: {
        required: '请输入手机号',
        tel: '请输入正确的手机号'
      },
      pass: {
        required: '请设置密码',
        password: '密码在 6 到 20 位之间，只能是字母和数字的组合'
      },
      inCode: {
        required: '请输入图形验证码'
      },
      smsCode: {
        required: '请输入短信验证码'
      },
      name: {
        required: '请输入姓名'
      },
      cardNo: {
        required: '请输入身份证号'
      },
      qq: {
        number: 'qq号输入不合法',
        minlength: 'qq号输入不合法'
      },
      agree: {
        required: '请同意服务与隐私协议'
      },
    })
    this.WxValidate.addMethod('password', (value, param) => {
      return this.WxValidate.optional(value) || (value.match(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/))
    })
    this.Validate = App.WxValidate({
    	mobile: {
        required: true,
        tel: true, 
      },
      inCode: {
        required: true,
      },
    }, {
      mobile: {
        required: '请输入手机号',
        tel: '请输入正确的手机号'
      },
      inCode: {
        required: '请输入图形验证码'
      }
    }) 
  },
})
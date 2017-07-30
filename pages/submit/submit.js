const App = getApp()
Page({
	data: {
		form: {
      amount: '',
      parts: '',
			name: '',
			cardNo: '',
			accNo: '',
			validDate: '',
			cvn: '',
			reserveMobile: '',
      sessionId: '',
			agree: false,
		},
    date: ''
	},
	onLoad(options){
    let that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('shopName')
    })
    this.initValidate()
    this.$wuxToptips = App.wux(this).$wuxToptips
    this.setData({
      'form.amount': wx.getStorageSync('amount'),
      'form.parts': wx.getStorageSync('part')
    })
  },
  showToptips(error) {
    const hideToptips = this.$wuxToptips.show({
      icon: '',
      timer: 2000,
      text: error.msg || '请填写正确的字段',
      success: () => console.log('toptips', error)
    })
  },
  bindDateChange (e) {
    let date = e.detail.value.split('-');
    let year = date[0].substr(2, 2),
        month = date[1];
     console.log(month+''+year)
     this.setData({
      date: e.detail.value,
      'form.validDate': month+''+year
     })
  },
  formSubmit (e) {
    let that = this;
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showToptips(error)
      return false
    }
    const params = e.detail.value;
    params.parts = parseInt(params.parts)
    params.customerSessionId = wx.getStorageSync('sessionId')
    params.shopId = wx.getStorageSync('shopId')
    params.mechanismId = wx.getStorageSync('mechanismId')
    App.request({
      url: App.api.createOrder,
      method: 'POST',
      data: params,
      success(res) {
        that.$wuxToptips.success({
          hide: !0, 
          text: '提交成功', 
        })
        wx.redirectTo({url: '../records/records'})
      }
    })
  },
  initValidate() {
    this.WxValidate = App.WxValidate({
    	name: {
    		required: true
    	},
    	cardNo: {
    		required: true,
    		idcard: true
    	},
    	accNo: {
    		required: true,
    		number: true,
    	},
    	validDate: {
    		required: true,
    		date: true
    	},
    	cvn: {
    		required: true,
        number: true,
    	},
      reserveMobile: {
        required: true,
        tel: true, 
      },
      agree: {
        required: true
      }
    }, {
    	name: {
    		required: '请输入姓名',
    	},
    	cardNo: {
    		required: '请输入身份证号',
    	},
    	accNo: {
    		required: '请输入信用卡号',
    	},
      validDate: {
        required: '请选择有效期',
      },
    	cvn: {
    		required: '请输入cvn2码',
    	},
      reserveMobile: {
        required: '请输入预留手机号',
      },
      agree: {
      	required: '请同意个人消费分期支付合同'
      }
    })
  }
})
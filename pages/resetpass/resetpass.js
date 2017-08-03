import Md5 from '../../assets/plugins/md5'
const App = getApp()
Page({
	data: {
		form: {
			mobile: '',
			imgSessionId: '',
			inCode: '',
			smsCode: '',
			newPassword: ''
		},
    buttonText: '获取验证码',
    buttonStatus: false
	},
  onLoad (options){
      this.initValidate()
      this.$wuxToptips = App.wux(this).$wuxToptips
      this.getRandomImage()
  },
  getRandomImage () {
    let that = this;
    App.request({
        url: App.api.getRandomImage,
        method: 'GET',
        success(res){
          that.setData({
            'form.imgCodeUrl': res.data.result.imgBase64,
            'form.imgSessionId': res.data.result.imgSessionId
          })
        }
    })
  },
  showToptips(error) {
    const hideToptips = this.$wuxToptips.show({
      icon: '',
      timer: 1000,
      text: error.msg || '请填写正确的字段',
      success: () => console.log('toptips', error)
    })
  },
  formSubmit (e) {
    const params = e.detail.value
    let that = this;
    params.imgSessionId = this.data.form.imgSessionId;
    console.log(params)
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showToptips(error)
      return false
    }
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    params.newPassword = Md5.hex_md5(params.newPassword)
    console.log(params)
    wx.request({
      url: `${App.globalData.baseUrl}/user/resetPasswordById.json`,
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        if(res.data.code === 0) {
          that.$wuxToptips.success({
            hide: !0, 
            text: '重置成功', 
          })
          wx.navigateTo({url: '../index/index'})
        } else {
          that.$wuxToptips.error({
            hide: !0, 
            text: res.data.message, 
          })
        }
      },
      fail: function(res) {
        console.log('error')
      },
      complete: function() {
        wx.hideLoading()
      }
    })
    this.$wuxToptips.success({
      hide: !0, 
      text: '提交成功', 
    })
  },
  initValidate() {
    this.WxValidate = App.WxValidate({
      mobile: {
        required: true,
        tel: true, 
      },
      inCode: {
        required: true,
        maxlength: 4
      },
      smsCode: {
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
      mobile: {
        required: '请输入手机号',
      },
      inCode: {
        required: '请输入图形验证码',
      },
      smsCode: {
        required: '请输入短信验证码',
      },
      newPassword: {
        required: '请输入新密码',
        password: '密码在 6 到 20 位之间，只能是字母和数字的组合'
      },
      confirmPass: {
        required: '请再次输入密码',
        equalTo: '两次密码输入不一致'
      }
    })
    this.WxValidate.addMethod('password', (value, param) => {
      return this.WxValidate.optional(value) || (value.match(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/))
    })
  },
  changeMobile (e) {
    this.setData({
      'form.mobile': e.detail.value
    })
  },
  changeInCode (e) {
    this.setData({
      'form.inCode': e.detail.value
    })
  },
  checkTel(value) {
    return /^1[34578]\d{9}$/.test(value)
  },
  checkEmpty(value) {
    return value.replace(/(^\s*)|(\s*$)/g, '')
  },
  countDown () {
    let count = 60;
    this.setData({
      buttonStatus: true
    })
    let timer = setInterval(() => {
      if (count > 0) {
        count--;
      } else {
        clearInterval(timer)
        this.setData({
          buttonStatus: false,
          buttonText: '重新发送'
        })
        return;
      }
      this.setData({
        buttonText: `重新发送 ${count}s`
      })
    }, 1000)
  },
  getSmsCode () {
    let that = this;
    let mobile = this.data.form.mobile;
    let inCode = this.data.form.inCode;
    if(!this.checkTel(mobile)){
      this.$wuxToptips.error({
        hide: !0,
        timer: 1000,
        text: '请输入正确手机号', 
      })
      return false;
    }
    if(!this.checkEmpty(inCode)){
      this.$wuxToptips.error({
        hide: !0,
        timer: 1000,
        text: '请输入图片验证码', 
      })
      return false
    }
    wx.request({
      url: `${App.globalData.baseUrl}/sms/getMobileSmsCode.json`,
      data: {
         mobile: mobile,
         smsType: 3,
         inCode: inCode,
         imgSessionId: that.data.form.imgSessionId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        console.log(res)
        if(res.data.code === 0) {
          that.countDown()
          that.$wuxToptips.success({
            hide: !0,
            timer: 2000,
            text: '短信验证码已发送，注意查收', 
          })
          
        } else {
        	that.$wuxToptips.error({
            hide: !0, 
            text: res.data.message, 
          })
          setTimeout(() => {
            that.getRandomImage()
          }, 500)
        }
      },
      fail(err) { 
        console.log(err)
      },
    })
  }
})
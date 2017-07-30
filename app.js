Object.assign = Object.assign && typeof Object.assign === 'function' ? Object.assign : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key] } } } return target }
Array.from = Array.from && typeof Array.from === 'function' ? Array.from : obj => [].slice.call(obj)

import wux from 'components/wux'
import WxValidate from 'assets/plugins/WxValidate'
import Md5 from 'assets/plugins/md5'
App({
	onLaunch() {
		console.log('onLaunch')
    this.getUserInfo((res) => {
      console.log(res)
    })
	},
	onShow() {
		console.log('onShow')
	},
	onHide() {
		console.log('onHide')  
	},
  getSessionKey() {
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
        appid: '',
        secret: 'b0e5d20d615f9c9c885687f587d2da5a',
        js_code: res.code,
        grant_type: 'authorization_code'
      },
      success(res) {
        console.log(res)
      }
    })
  },
  getUserInfo(cb) {
    let that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.login({
        success(res) {
          console.log(res)
          if (res.code) {
            // that.globalData.code = res.code
            // wx.setStorageSync('code', res.code)
            wx.getUserInfo({
              success (res) {
                that.globalData.encrypted = {encryptedData: res.encryptedData, iv: res.iv}
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              },
              fail (res) {
                console.log(res.errMsg)
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
	request(config) {
    config.loading = config.loading === false ? false : true;
    config.loading && wx.showLoading({
      title: '加载中',
    })
		wx.request({
			url: `https://www.yueshijue.com/ysj/${config.url}`,
      method: config.method || 'POST',
      data: config.data || {},
      header: config.header || {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        if(res.data.code === 999) {
          wx.showToast({
            title: res.data.message,
            image: '../../assets/images/iconfont-toptips.png',
            timer: 1000
          })
          // wx.clearStorage()
          setTimeout(() => {
            wx.redirectTo({url: '/pages/signin/signin'})
          }, 100)
        } else if(res.data.code === 0) {
      		config.success(res)
      	} else {
          console.log(res)
      		wx.showToast({
            title: res.data.message,
          	image: '../../assets/images/iconfont-toptips.png',
            timer: 1000
          })
          setTimeout(() => {
            config.other && config.other()
          }, 1000)
          // wx.redirectTo({url: '/pages/index/index'})
      	}
      },
      fail(error) {
				console.log('error')
				console.log(error)
			},
      complete() {
        wx.hideLoading()
      }
    })
	},
	globalData: {
    userInfo: null,
    baseUrl: 'https://www.yueshijue.com/ysj',
    version: '1.1.0',
  },
  api: {
  	requestLogin: 'user/loginByMobileAndPassword.json',
    getRandomImage: 'user/getRandomImage.json',
    getMobileSmsCode: 'sms/getMobileSmsCode.json',
    requestRegist: 'user/registe.json',
    getMechanismList: 'appShop/getShopMechanismInfoList.json',
    getCustomerUserInfo: 'user/getCustomerUserInfo.json',
    updateCustomerUserInfo: 'user/updateCustomerUserInfo.json',
    getUserOrderApplyInfo: 'order/getUserOrderApplyInfo.json',
    confirmHarvestOrder: 'order/confirmHarvestOrder.json',
    getOrderPartList: 'order/partList.json',
    createOrder: 'order/createOrder.json'
  },
  Md5: Md5,
	wux: wux, 
	WxValidate: (rules, messages) => new WxValidate(rules, messages), 
})
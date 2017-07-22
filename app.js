Object.assign = Object.assign && typeof Object.assign === 'function' ? Object.assign : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key] } } } return target }
Array.from = Array.from && typeof Array.from === 'function' ? Array.from : obj => [].slice.call(obj)

import wux from 'components/wux'
import WxValidate from 'assets/plugins/WxValidate'
import Md5 from 'assets/plugins/md5'
App({
	onLaunch() {
		console.log('onLaunch')
	},
	onShow() {
		console.log('onShow')
	},
	onHide() {
		console.log('onHide')
	},
	request(config) {
    wx.showLoading({
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
        wx.hideLoading()
      	if(res.data.code === 0) {
      		console.log('操作成功')
      		config.success(res)
      	} else {
      		wx.showToast({
            title: res.data.message,
          	image: '../../assets/images/iconfont-toptips.png', 
          })
          // wx.redirectTo({url: '/pages/index/index'})
      	}
      },
      fail(error) {
				console.log('error')
				console.log(error)
			}
    })
	},
	interceptor(config) {
		console.log(config)
	},
	globalData: {
    userInfo: null,
    baseUrl: 'https://www.yueshijue.com/ysj',
    version: '1.1.0',
  },
  api: {
  	loginUrl: 'user/loginByMobileAndPassword.json',
    getRandomImage: 'user/getRandomImage.json',
  },
  Md5: Md5,
	wux: wux, 
	WxValidate: (rules, messages) => new WxValidate(rules, messages), 
})
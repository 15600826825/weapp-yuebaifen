const App = getApp()
Page({
	data: {
		user: {},
		region: ['北京市', '广东省', '山东省', '江苏省', '河南省', '上海市', 
		'河北省', '浙江省', '香港特别行政区', '陕西省', '湖南省', '重庆市', 
		'福建省', '天津市', '云南省', '四川省', '广西壮族自治区', '安徽省', 
		'海南省', '江西省', '湖北省', '山西省', '辽宁省','台湾省', '黑龙江',
		'内蒙古自治区', '澳门特别行政区', '贵州省', '甘肃省','青海省', 
		'新疆维吾尔自治区', '西藏区', '吉林省', '宁夏回族自治区'],
    origin: [],
  },
	onLoad() {
		let that = this;
    this.$wuxToast = App.wux(this).$wuxToast
		wx.getStorage({
      key: 'user',
      success(res) {
        that.setData({
        	user: res.data
        })
      } 
    })
	},
	getUserInfo() {
		let that = this;
		let sessionId = wx.getStorageSync('sessionId')
		App.request({
			url: App.api.getCustomerUserInfo,
			method: 'POST',
			data: {
				customerSessionId: sessionId
			},
			success(res) {
				wx.setStorage({key: 'user', data: res.data.result})
			}
		})
	},
	bindDateChange(e) {
    this.setData({
      'user.birthday': e.detail.value
    })
  },
	bindRegionChange(e) {
		console.log(e.detail.value)
    this.setData({
      origin: e.detail.value
    })
	},
	updateGender() {
		let that = this;
		wx.showActionSheet({
		  itemList: ['女', '男'],
		  success(res) {
		    that.setData({
		    	'user.gender': res.tapIndex
		    })
		  },
		  fail(res) {
		    console.log(res.errMsg)
		  }
		})
	},
	formSubmit(e) {
		let that = this;
		const params = e.detail.value;
		params.customerSessionId = wx.getStorageSync('sessionId');
		params.origin = params.origin[2] || this.data.user.origin;
		params.gender = params.gender === '男' ? 1 : 0
		console.log(params)
		App.request({
			url: App.api.updateCustomerUserInfo,
			method: 'POST',
			data: params,
			success(res) {
				wx.showToast({
          icon: 'success',
          title: '修改成功',
          duration: 1000
        })
        that.getUserInfo()
			}
		})
	}
})
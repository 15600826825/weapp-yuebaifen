const App = getApp()
Page({
	data: {
		avatar: 'http://www.yueshijue.com/wechat/myyonghu.png',
		user: {
			name: '',
			mobile: ''
		},
		version: '1.1.0'
	},
	onLoad () {
  	let that = this
    this.$wuxToast = App.wux(this).$wuxToast
		wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
        	user: res.data
        })
      } 
    })
    // this.getUserInfo()
  },
  getUserInfo () {
    let that = this
    let sessionId = wx.getStorageSync('sessionId')
    wx.request({
      url: `${App.globalData.baseUrl}/user/getCustomerUserInfo.json`,
      method: 'POST',
      data: {
        customerSessionId: sessionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        App.isLogin(res.data.code)
        if(res.data.code === 0) {
          // wx.setStorage({
          //   key: 'user',
          //   data: res.data.result
          // })
        } else {
          that.$wuxToast.show({
            type: 'forbidden',
            timer: 1500,
            color: '#fff',
            text: '获取失败',
          })
        }
      },
      fail: function() {
        console.log('fail')
      }
    })
  }
})  
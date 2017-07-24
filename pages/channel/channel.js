const App = getApp()
Page({
	data: {
		shopData: {},
		mechanismInfoList: [
			{
				mechanismId: 1,
				lowestAmount: 3000,
				amount: 5000,
				mechanismNickName: '悦分期'
			},
			{
				mechanismId: 1,
				lowestAmount: 3000,
				amount: 5000,
				mechanismNickName: '悦分期'
			}
		]
	},
	onLoad() {
		this.$wuxToast = App.wux(this).$wuxToast;
		this.getChannleList()
	},
	getChannleList () {
		let that = this;
    let sessionId = wx.getStorageSync('sessionId')
    let shopUuid = wx.getStorageSync('shopUuid')
    console.log(sessionId)
    console.log(shopUuid)
    App.request({
    	url: App.api.getMechanismList,
    	method: 'POST',
    	data: {
    		shopUuid: shopUuid,
        customerSessionId: sessionId
    	},
    	success(res) {
    		console.log(res)
    		that.setData({
    			mechanismInfoList: res.data.result.shopMechanismInfoVoList,
    			shopData: res.data.result.shopData
    		})
    	}
    })
	},
	selectedChannel(e) {
		console.log(e)
		let mechanismId = e.currentTarget.dataset.mechanismid
    let lowestAmount = e.currentTarget.dataset.lowestamount
    let largestAmount = e.currentTarget.dataset.largestamount
    wx.setStorage({
      key: 'mechanismId',
      data: mechanismId
    })
    wx.setStorage({
      key: 'lowestAmount',
      data: lowestAmount
    })
    wx.setStorage({
      key: 'largestAmount',
      data: largestAmount
    })
    // wx.navigateTo({url: '../detail/detail'})
	}
})
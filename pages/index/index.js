const App = getApp();
Page({
	data: {
		text1: '额度更高',
		text2: '零手续费',
		text3: '审批更快'
	},
	onLoad() {
		this.$wuxToast = App.wux(this).$wuxToast
    wx.showShareMenu({
		  withShareTicket: true
		})
	},
	handleTap() {
		console.log('tap')
	},
	scanCode() {
		let that = this;
		wx.scanCode({
		  success: (res) => {
		    console.log(res)
		    if(res.result.indexOf('"shopUuid":') === -1) {
		  		that.$wuxToast.show({
		  			type: 'forbidden',
            text: '二维码有误'
          })
          return false
		  	}
		    let shopUuid = JSON.parse(res.result).shopUuid;
		    if (shopUuid) {
		    	wx.setStorage({
			    	key: 'shopUuid',
			    	data: shopUuid
			    })
			    console.log(shopUuid)
		    	// wx.navigateTo({url: '../stage/stage'})
		    } else {
		    	that.$wuxToast.show({
            type: 'forbidden',
            text: '二维码有误'
          })
		    }
		  },
		  fail: (error) => {
		  	console.log('fail')
		  }
		})
	},
})
const App = getApp();
Page({
	data: {
		text1: '额度更高',
		text2: '零手续费',
		text3: '审批更快',
		startX: 0,
		startTime: 0,
		offsetX: 0,
		user: {
			mobile: 15210647536
		},
		toggle: true,
		leftValue: 0
	},
	onLoad() {
		this.$wuxToast = App.wux(this).$wuxToast
    wx.showShareMenu({
		  withShareTicket: true
		})
	},
	touchStart(e) {
		this.setData({
			startX: e.touches[0].clientX,
			startTime: e.timeStamp
		})
	},
	touchMove(e) {
		let offsetX = e.touches[0].clientX - this.data.startX;
		this.setData({
			offsetX: offsetX
		})
	},
	touchEnd(e) {
		// console.log(e.timeStamp - this.data.startTime)
		// console.log(this.data.offsetX)
		let leftValue = 0;
		if(e.timeStamp - this.data.startTime < 100) return;
		if(this.data.offsetX > 50) {
			leftValue = '550rpx'
		} else if (this.data.offsetX < -50) {
			leftValue = 0
		}
		this.setData({
			leftValue: leftValue
		})
	},
	handleTap() {
		let leftValue = this.data.leftValue === 0 ? '550rpx' : 0;
		this.setData({
			leftValue: leftValue
		})
	},
	scanCode() {
		let that = this;
		// wx.scanCode({
		//   success: (res) => {
		//     console.log(res)
		//     if(res.result.indexOf('"shopUuid":') === -1) {
		//   		that.$wuxToast.show({
		//   			type: 'forbidden',
  //           text: '二维码有误'
  //         })
  //         return false
		//   	}
		//     let shopUuid = JSON.parse(res.result).shopUuid;
		//     if (shopUuid) {
		//     	wx.setStorage({
		// 	    	key: 'shopUuid',
		// 	    	data: shopUuid
		// 	    })
		// 	    console.log(shopUuid)
		//     	wx.navigateTo({url: '../channel/channel'})
		//     } else {
		//     	that.$wuxToast.show({
  //           type: 'forbidden',
  //           text: '二维码有误'
  //         })
		//     }
		//   },
		//   fail: (error) => {
		//   	console.log('fail')
		//   }
		// })
		wx.getLocation({
		  type: 'gcj02', //返回可以用于wx.openLocation的经纬度
		  success: function(res) {
		  	console.log(res)
		    var latitude = res.latitude
		    var longitude = res.longitude
		    wx.openLocation({
		      latitude: latitude,
		      longitude: longitude,
		      scale: 28
		    })
		  }
		})
	},
}) 
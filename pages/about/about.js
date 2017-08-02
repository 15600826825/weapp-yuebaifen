var App = getApp()
Page({
	data: {
		phone: '010-56143517',
		version: App.globalData.version
	},
	onload() {
		
	},
	call (e) {
		wx.makePhoneCall({
		  phoneNumber: e.currentTarget.dataset.phone
		})
	}
})
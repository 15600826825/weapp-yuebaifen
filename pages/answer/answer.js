const App = getApp();
Page({
	data: {
		item: {}
	},
	onLoad(option) {
		this.setData({
			item: JSON.parse(option.item)
		})
	}
})
const App = getApp()
Page({
	data: {
		recordList: [],
		carriersNote: '',
    orderNo: '',
    hidden: true
	},
	onLoad() {
		let that = this;
    this.$wuxToptips = App.wux(this).$wuxToptips;
		this.getApplyRecordList()
	},
	getApplyRecordList () {
  	let that = this
  	let sessionId = wx.getStorageSync('sessionId')
  	App.request({
  		url: App.api.getUserOrderApplyInfo,
  		method: 'POST',
      data: {
        customerSessionId: sessionId
      },
      success(res) {
      	that.setData({
      		recordList: res.data.result
      	})
      },
  	})
  },
  takeDelivery (e) {
    this.setData({
      orderNo: e.currentTarget.dataset.orderno,
      hidden: false  
    })
  },
  codeChange (e) {
    this.setData({
      carriersNote: e.detail.value
    })
  },
  cancel() {
    this.setData({
      hidden: true,
      carriersNote: ''
    })
  },
  formSubmit () {
    let that = this;
    let sessionId = wx.getStorageSync('sessionId')
    let data = {
      orderNo: this.data.orderNo,
      carriersNote: this.data.carriersNote,
      customerSessionId: sessionId
    }
    console.log(data)
    App.request({
      url: App.api.confirmHarvestOrder,
      method: 'POST',
      data: data,
      success(res) {
        wx.showToast({
          title: res.data.message,
          timer: 1000
        })
        that.cancel()
      },
    })
  }
})
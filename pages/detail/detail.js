const App = getApp()
Page({
	data:{
    form: {
      totalAmount: '',
      termNumber: ''
    },
    lowestAmount: '',
    largestAmount: '',
    eachTermAmount: '',
    firstAmount: '',
    totalAmount: '',
    showView: false,
    termList: [],
    selectedAmount: ''
  },
  onLoad (options) {
    this.$wuxToast = App.wux(this).$wuxToast
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('shopName')
    })
    this.setData({
      lowestAmount: wx.getStorageSync('lowestAmount'),
      largestAmount: wx.getStorageSync('largestAmount')
    })
  },
  checkAmount(value) {
    let that = this;
    if (value === '') {
      that.$wuxToast.show({
        type: 'forbidden',
        timer: 1500,
        color: '#fff',
        text: '请输入金额',
      })
      return false;
    } else if(value < this.data.lowestAmount || value > this.data.largestAmount) {
      that.$wuxToast.show({
        type: 'forbidden',
        timer: 1500,
        color: '#fff',
        text: '金额范围有误',
      })
      return false;
    }
    return true;
  },
  selectStageNumber () {
  	let that = this;
  	if(!this.checkAmount(this.data.form.totalAmount)) return;
  	let itemList = ['6期', '12期', '24期'];
  	wx.showActionSheet({
		  itemList: itemList,
		  success(res) {
		  	that.setData({
		  		'form.termNumber': itemList[res.tapIndex]
		  	})
		  	console.log(itemList[res.tapIndex])
		    console.log(res.tapIndex)

		  },
		  fail(res) {
		    console.log(res.errMsg)
		  }
		})
  }
})
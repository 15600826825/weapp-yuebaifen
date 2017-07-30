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
    partList: [],
    selectedAmount: ''
  },
  onLoad (options) {
    this.$wuxToast = App.wux(this).$wuxToast
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('shopName')
    })
    this.setData({
      lowestAmount: wx.getStorageSync('lowestAmount'),
      largestAmount: wx.getStorageSync('largestAmount'),
      partList: wx.getStorageSync('partList')
    })
  },
  amountChange(e) {
  	this.setData({
  		'form.totalAmount': e.detail.value
  	})
  },
  checkAmount(val) {
    let that = this;
    if (!parseInt(val)) {
      that.$wuxToast.show({
        type: 'forbidden',
        timer: 1500,
        color: '#fff',
        text: '请输入金额',
      })
      return false;
    } else if(val < this.data.lowestAmount || val > this.data.largestAmount) {
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
  	let amount = this.data.form.totalAmount;
  	if(!this.checkAmount(amount)) return;
  	let that = this;
  	let sessionId = wx.getStorageSync('sessionId')
    let mechanismId = wx.getStorageSync('mechanismId')
    let shopId = wx.getStorageSync('shopId')
    // App.request({
    //   url: App.api.getOrderPartList,
    //   method: 'POST',
    //   data: {
    //     amount: amount,
    //     shopId: shopId,
    //     mechanismId: mechanismId,
    //     customerSessionId: sessionId
    //   },
    //   success(res) {
    //   	console.log(res)
    //   	wx.setStorage({
    //   		key: 'partList',
    //   		data: res.data.result
    //   	})
    //   },
    // })
  	let partNameList = this.data.partList.map(item => item.name);
  	let partIdList = this.data.partList.map(item => item.dicId);
  	wx.showActionSheet({
		  itemList: partNameList,
		  success(res) {
		  	if(res.tapIndex >= 0) {
		  		let partNum = parseInt(partNameList[res.tapIndex])
			  	let partId = partIdList[res.tapIndex];
			  	that.setData({
			  		'form.termNumber': partNameList[res.tapIndex],
			  		totalAmount: parseInt(amount).toFixed(2),
			  		eachTermAmount: (Math.floor((amount / partNum) * 100) / 100).toFixed(2)
			  	})
		  	}
		  },
		  fail(res) {
		    console.log(res.errMsg)
		  }
		})
  },
  checkPartNum(val) {
  	let that = this;
    if (parseInt(val) > 0) return true;
    that.$wuxToast.show({
      type: 'forbidden',
      timer: 1500,
      color: '#fff',
      text: '请选择期数',
    })
    return false;
  },
  submit() {
  	let that = this;
  	let amount = parseInt(this.data.form.totalAmount);
  	let partNum = this.data.form.termNumber;
  	if(!this.checkAmount(amount) || !this.checkPartNum(partNum)) return;
  	if (amount.toFixed(2) !== this.data.totalAmount) {
  		that.$wuxToast.show({
	      type: 'forbidden',
	      timer: 1500,
	      color: '#fff',
	      text: '请重新选择期数',
	    })
	    return false;
  	}
  	console.log(amount, partNum)
    wx.setStorage({key: 'amount', data: amount})
  	wx.setStorage({key: 'part', data: partNum})
  	// wx.navigateTo({url: '../applystage/applystage'})
  }
})
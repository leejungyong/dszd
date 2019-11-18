// pages/start/share.js
let app=getApp()
let aid, title,sharepic=null
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    img:'',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log(options)
    // console.log(act)
    aid=options.aid
    title=options.title
    
    // this.setData({
    //   aid:options.aid
    // })
    // console.log(options)
    this.getCode()
  },
  //
  myact(){
    wx.navigateTo({
      url: '../my/mytests',
    })
  },
  getCode(){
    let that=this
    let data = {
      page: 'pages/index/index',
      // scene: this.data.aid
      scene:'3'
    }
    // console.log(data)
    wx.request({
      url: app.globalData.config.apiUrl + 'makeQrcode.php',
      data: data,
      method: 'POST',
      success: (res) => {
        console.log(res.data)
        that.setData({
          img: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: '../my/my',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    let that = this
    // console.log(ops)

    if (ops.from === 'button') {

    }
    return {
      title: title,
      path: 'pages/game/game?aid=' + aid,
      imageUrl: sharepic ? app.globalData.config.apiUrl + 'sharepic/' + sharepic : app.globalData.config.apiUrl + 'sharepic/1.jpg',

    }
  }
})
// pages/game/xiuxiu3.js
let aid=null
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      myGenius:'',
      mateGenius:'',
      initState:null
  },
  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=getMyXiuxiu',
      method:'POST',
      data:{
        aid:aid,
        openid:wx.getStorageSync('openid')
      },
      success(res){
        console.log(res.data)
        that.setData({
          initState:res.data.status,
          myGenius:res.data.myGenius,
          mateGenius:res.data.mateGenius
        })
      }
    })
  },
sure(){
  let that=this
  let msg = {
    aid: aid,
    openid: wx.getStorageSync('openid'),
    mateopenid:that.data.mateGenius.openid,
    act:'updateMyXiuxiu',
    status:2
  }
  wx.sendSocketMessage({
    data: JSON.stringify(msg),
  })
},
cancel(){
  let that = this
  let msg = {
    aid: aid,
    openid: wx.getStorageSync('openid'),
    mateopenid: that.data.mateGenius.openid,
    act:'updateMyXiuxiu',
    status: -2
  }
  wx.sendSocketMessage({
    data: JSON.stringify(msg)
  })
},

//接受对方联姻请求
  accept() {
    let that = this
    let msg = {
      aid: aid,
      openid: wx.getStorageSync('openid'),
      mateopenid: that.data.mateGenius.openid,
      act: 'acceptXiuxiuRequire',
      status: 2
    }
    wx.sendSocketMessage({
      data: JSON.stringify(msg),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    aid=options.aid
    let that = this
    this.fetch()
    wx.connectSocket({
      url: 'wss://www.wondfun.com:39002',
      success: res => {
        console.log(res)
      }
    })
    wx.onSocketMessage(function (res) {
    
      console.log(JSON.parse(res.data))
      let data = JSON.parse(res.data)

      if (wx.getStorageSync('openid') == data.from) {
        if(data.status==0){
            that.setData({
              initState: 1
            })
        } else{
          that.setData({
            initState: data.status
          })
        }
        wx.showToast({
          title: data.msg,
          icon:'none'
        })
       
      }
      if (wx.getStorageSync('openid') == data.to){
        if(data.status==0){
          that.setData({
          initState: 1
        })
          wx.showModal({
            title: '',
            content: '确认要联姻吗？',
            cancelText:'拒绝',
            success:res=>{
              if(res.confirm){
                that.accept()
              }else{
                that.cancel()
              }
            }
          })
        }else{
          that.setData({
            initState: data.status
          })
          wx.showToast({
            title: data.msg,
            icon:'none'
          })
        }
        
      }

      // if (data.status==0) {
      // } else {
      // }

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
    wx.closeSocket()
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
  onShareAppMessage: function () {

  }
})
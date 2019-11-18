// pages/game/changetime.js
let aid
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'',
    min:-60,
    step:null
  },
  sliderChange(e){
    console.log(e.detail.value)
    this.setData({
      time:e.detail.value
    })
  },

  //确认调整
  sure(){
    let that=this
    wx.showModal({
      title: '',
      content: '确认调整时间吗？',
      success:res=>{
        if(res.confirm){
          wx.request({
            url: app.globalData.config.apiUrl+'index.php?act=updateActTime',
            method:'POST',
            data:{
              aid:aid,
              time:that.data.time*60
            },
            success:res=>{
              console.log(res.data)
              if(res.data.status){
                wx.showToast({
                  title: res.data.msg,
                })
                wx.navigateBack({delta:1})
              }else{
                wx.showToast({
                  title: res.data.msg,
                })
              }
             
            }
          })
        }
      }
    })
  },

  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=getActStep',
      method:'POST',
      data:{
        aid:aid
      },
      success:res=>{
        console.log(res.data)
        that.setData({
          step:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    aid=options.aid
    this.fetch()
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
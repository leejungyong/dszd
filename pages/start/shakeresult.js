// pages/start/shakeresult.js
let aid=null
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team:'',
    desc:'',
    teampic:'',
    genius:app.globalData.genius,
    gindex:0
  },
  next(){
    wx.redirectTo({
      url: '../game/game?aid='+aid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let myteam=JSON.parse(options.myteam) 
    this.setData({
      team:myteam.name,
      desc:myteam.desc,
      teampic:myteam.pic,
      gindex:myteam.genius-1
    })
    aid=myteam.aid
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
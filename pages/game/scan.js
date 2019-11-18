// pages/game/scan.js
const app=getApp()
let aid,act,openid,money,rate,step,token,teamname,teamid,interest,total
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  scan(){
    wx.scanCode({
      success(res){
        console.log(res.result.split('&'))
        let result=res.result,

        openid=wx.getStorageSync('openid')

        act = result.split('&')[0].split('=')[1]
        token = result.split('&')[2].split('=')[1]
        aid = result.split('&')[3].split('=')[1]
        money = result.split('&')[4].split('=')[1]
        rate = result.split('&')[5].split('=')[1]
        step=result.split('&')[6].split('=')[1]
        teamname = result.split('&')[7].split('=')[1]
        teamid = result.split('&')[8].split('=')[1]
        interest = result.split('&')[9].split('=')[1]
        total = result.split('&')[10].split('=')[1]
        
        wx.navigateTo({
          url: './lend?act=' + act + '&openid=' + openid + '&token=' + token + '&aid=' + aid + '&money=' + money + '&rate=' + rate + '&step=' + step + '&teamname=' + teamname + '&teamid=' + teamid+'&interest='+interest + '&total=' + total,
        })
      }
    })
    // wx.navigateTo({
    //   url: './lend'
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
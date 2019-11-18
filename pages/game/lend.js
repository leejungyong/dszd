// pages/game/lend.js
const app = getApp()
let aid, openid, teamid, token
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    teamname: '',
    money: '',
    rate: '',
    deadline: '',
    interest: '',
    total: '',
    steps: ['第一阶段', '第二阶段', '第三阶段', '第四阶段']
  },
  // 点击确定按钮
  sure() {
    let that = this
    wx.showModal({
      title: '',
      content: '确认借出吗？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=postBizBorrow',
            method: 'POST',
            data: {
              aid: aid,
              openid: openid,
              teamid: teamid,
              teamname: that.data.teamname,
              token: token,
              money: that.data.money,
              rate: that.data.rate,
              step: that.data.deadline,
              type: 1
            },
            success: res => {
              console.log(res.data)
              wx.navigateBack({
                delta: 2
              })
            }
          })
        }else{
          wx.navigateBack({
            delta:1
          })
        }
      }
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    aid = options.aid
    openid = options.openid
    teamid = options.teamid
    token = options.token
    this.setData({
      teamname: options.teamname,
      money: options.money,
      rate: options.rate,
      deadline: options.step,
      interest:options.interest,
      total:options.total
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
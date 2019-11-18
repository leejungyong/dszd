// pages/game/team.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  _data: {
    aid: 0,
    teamid: 0,
    teamname: '',
    act: null
  },
  data: {
    isCaptain:false,
    act:null,
    imgurl: app.globalData.config.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let ops=JSON.parse(options.ops),
        act=JSON.parse(options.act)
        
        this._data.act=act
        this._data.aid = ops.currentaid
        this._data.teamid = ops.currentteamid
        this._data.teamname = ops.name
    this.setData({
      isCaptain: ops.currentrole > 0 ? false : true,
      act: act
    })
  },
//查看队伍
  viewTeam() {
    let role = this.data.isCaptain ? 0 : 1
    wx.navigateTo({
      url: './viewteam?ops=' + JSON.stringify(this._data) + '&role=' + role,
    })
  },

  //我的二维码
  qrcode(){
    let ops = {
      aid: this._data.aid,
      teamid: this._data.teamid,
      act: 'addMoney',
      teamname: this._data.teamname,
      openid: wx.getStorageSync('openid')
    }
    wx.navigateTo({
      url: './mycode?ops=' + JSON.stringify(ops),
    })
  },

  //角色授权
  roleauthorize(){
    wx.navigateTo({
      url: './roleauthorize',
    })
  },
  //我的禀赋
  gift(){
    wx.navigateTo({
      url: './gift',
    })
  },
  //行走步数
  werun() {
    let ops = {
      aid: this._data.aid,
      teamid: this._data.teamid
    }

    wx.navigateTo({
      url: './werun?ops=' + JSON.stringify(ops)
    })
  },

  //活动相册
  album(){
    let ops = {
      aid: this._data.aid,
      teamid: this._data.teamid
    }

    wx.navigateTo({
      url: './album?ops=' + JSON.stringify(ops)
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
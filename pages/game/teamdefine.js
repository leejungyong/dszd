// pages/game/teamdefine.js
const app=getApp()
let aid=null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    img:'',
    stamp:'',
    actmode:'',
    teamNum:''
  },
  //添加新队伍
  toAddTeam() {
    let displayorder = parseInt(this.data.list[this.data.list.length - 1].displayorder) + 1
    console.log(displayorder)
    wx.navigateTo({
      url: './newTeam?aid=' + aid + '&displayorder=' + displayorder + '&teamnum=' + this.data.teamNum,
    })
  },

  toTeamEdit(e){

    let index = e.currentTarget.dataset.idx
    let obj = this.data.list[index]

    obj.desc = obj.desc.replace('?', '？')
    obj.desc = obj.desc.replace('&', '')

    obj.pic = obj.pic.replace(/\?/, '？')
    wx.navigateTo({
      url: './editteam?index=' + index + '&aid=' + aid + '&actmode=' + this.data.actmode + '&teamObj=' + JSON.stringify(obj),
    })
    // wx.navigateTo({
    //   url: './editteam',
    // })
  },
  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getDefinedTeamById',
      method:'POST',
      data:{
        aid:aid
      },
      success:(res)=>{
        console.log(res.data)
        that.setData({
          list:res.data.list,
          teamNum:res.data.teamNum,
          actmode:parseInt(res.data.actmode)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({

    })
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
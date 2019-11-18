// pages/my/editact.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    actName: '',
    teamName: '',
    place: '',
    teamNum: 6,
    pic: '',
    aid: '',
    imgurl:app.globalData.config.imgUrl
  },
  //选择日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  sliderChange(e) {
    console.log(e.detail.value)
    this.setData({
      teamNum: e.detail.value
    })
  },
  updateName(e) {
    console.log(e)
    this.setData({
      actName: e.detail.value
    })
  },
  updateTeamName(e) {
    this.setData({
      teamName: e.detail.value
    })
  },
  updatePlace(e) {
    this.setData({
      place: e.detail.value
    })
  },
  delPic(){
    this.setData({
      pic:''
    })
  },
  sure(){
    let that=this
    wx.request({
      url:app.globalData.config.apiUrl+ 'index.php?act=editAct',
      method:"POST",
      data:{
        openid:wx.getStorageSync('openid'),
        actdata:{
          aid:that.data.aid,
          title:that.data.actName,
          date:that.data.date,
          teamnum:that.data.teamNum,
          pic:that.data.pic
        }
      },
      success:res=>{
        console.log(res.data)
        if(res.data.status){
          if (that.data.pic.indexOf('http://tmp')!=-1){
            wx.uploadFile({
              url: app.globalData.config.apiUrl + 'uploadactpic.php',
              filePath: that.data.pic,
              name: 'file',
              formData: {
                'aid':that.data.aid,
                'openid': wx.getStorageSync('openid')
              },
              success: res => {
                console.log(res.data)
                wx.showToast({
                  title: '创建成功！',
                  icon: 'none'
                })
              
                // let pages = getCurrentPages()
                // let prepage = pages[pages.length - 2]
                // prepage.fetch()
                // wx.navigateBack()
              }
            })
          }
          let pages = getCurrentPages()
          let prepage = pages[pages.length - 2]
          prepage.fetch()
          wx.navigateBack()
        }
      }
    })
  },
  //添加封面图
  chooseImg() {
    let that = this,
      pic = that.data.pic

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        pic = res.tempFilePaths[0]

        that.setData({
          pic: pic
        })
        console.log(that.data.pic)
      }
    })
  },

  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+ 'index.php?act=getActBaseInfo',
      method:"POST",
      data:{
        openid:wx.getStorageSync('openid'),
        aid:that.data.aid
      },
      success:res=>{
        console.log(res.data)
        let data=res.data
        if(res.data){
          that.setData({
            actName:data.title,
            date:data.date,
            pic:that.data.imgurl+'dszd/api/sharepic/'+ data.sharepic,
            teamNum:data.teamnum
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      aid:options.aid
    })
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
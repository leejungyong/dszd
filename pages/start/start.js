// pages/start/start.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: [1],
    //是否采用衔接滑动  
    circular: true,
    //是否显示画板指示点  
    indicatorDots: true,
    //选中点的颜色   
    indicatorcolor: "#fff",
    //是否竖直  
    vertical: false,
    //是否自动切换  
    autoplay: true,
    //自动切换的间隔
    interval: 2500,
    //滑动动画时长毫秒  
    duration: 100,
    imgheights: [],    // 所有的图片高度
    current: 0,        //当前的swiper-item
    getuserinfo:app.globalData.getUserinfo
  },
  imageLoad: function (e) { //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  //swiper改变
  change(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //授权用户信息处理
  bindGetUserInfo(e){
    // console.log(e.detail)
    if(e.detail.userInfo){
      wx.navigateTo({
        url: './createNew',
      })
    }else{
      wx.showModal({
        title: '',
        content: '请在设置页面中打开用户信息权限',
        success: res => {
          if (res.confirm) {
            wx.openSetting({
              success(res) { }
            })
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  toCreate(){
    wx.navigateTo({
      url: './createNew',
    })
  },
  toShake(){
    wx.navigateTo({
      url: './shake',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserSettting()
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
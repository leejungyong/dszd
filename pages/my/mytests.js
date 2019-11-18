// pages/my/mytests.js
let app=getApp()
import {
  wxRequest
} from '../../utils/wxrequest.js'

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
    navbar:['进行中','已结束'],
    currentTab:0,
    actNow:[1,1],
    actFinish:[1,1],
    imgurl: app.globalData.config.imgUrl,
    currentPage:0,
    getuserinfo: app.globalData.getUserinfo
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
  //改变导航
  changeNav(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  //授权用户信息处理
  bindGetUserInfo(e) {
    console.log(e.detail)
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '程序需要您授权后才可正常运行',
        icon: 'none'
      })
    }
     else {
       console.log(wx.getStorageSync('openid'))
      wx.request({
        url: app.globalData.config.apiUrl + 'index.php?act=syncUser',
        data: {
          openid: wx.getStorageSync('openid'),
          unionid: wx.getStorageSync('unionid'),
          avatar: e.detail.userInfo.avatarUrl,
          nick: e.detail.userInfo.nickName
          // nick: util.base64_encode(e.detail.userInfo.nickName)
        },
        method: 'POST',
        success: (res) => {
          console.log(res)
          wx.navigateTo({
            url: '../start/createNew',
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      })
    } 
  },
  //创建测评
  createTest(){
    wx.navigateTo({
      url: '../start/createNew',
    })
  },
  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=getMyActList',
      method:'POST',
      data:{
        openid: wx.getStorageSync('openid'),
        pageindex:that.data.currentPage,
      },
      success:res=>{
        console.log(res.data)
        that.setData({
          actNow:res.data.actNow,
          actFinish:res.data.actDone
        })
      }
    
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserSettting()
    this.fetch()
  },
  //编辑活动
  editAct(e){
    let index=e.currentTarget.id,
    aid=this.data.actNow[index].aid
    wx.navigateTo({
      url:'./editact?aid='+aid,
    })
  },
  //使用活动
  useAct(e){
    let index = e.currentTarget.id
    let act = this.data.currentTab == 0 ? this.data.actNow[index] : this.data.actFinished[index]
    
    console.log(this.data.actNow[index])
    wx.navigateTo({
      url: './sharePage?ops=' + JSON.stringify(act),
    })
  },
  // sharePage(id) {
  //   // console.log(id)
  //   let act = this.data.actNow[id]
  //   console.log(act)
  //   wx.navigateTo({
  //     url: './sharePage?ops=' + JSON.stringify(act),
  //   })
  // },
  // beforeShare(e) {
  //   let that = this
  //   let openid = wx.getStorageSync('openid')
  //   let id = e.currentTarget.id
  //   let aid = this.data.actNow[id].aid 

  //   //检查点位任务是否都设置完整
  //   this.checkAct(aid)
  //     .then((ret) => {
  //       //  console.log(ret)
  //       if (ret.taskFlag) {
  //         //是否分享过了
  //         if (ret.actIsShared == 1) {
  //           //console.log('可以进入分享，不扣点')
  //           that.sharePage(id)
  //           // that.setData({
  //           //   index: id,
  //           //   hideShareBox: false
  //           // })
  //         } else {
  //           if (ret.point && ret.point >= 999) {
  //             //  console.log('扣点分享后')
  //             that.updatePoint(openid, aid)
  //               .then((ret) => {
  //                 if (ret.status) {
  //                   //console.log('可以进入分享')
  //                   that.sharePage(id)
  //                   // that.setData({
  //                   //   index: id,
  //                   //   hideShareBox: false
  //                   // })
  //                 } else {
  //                   wx.showToast({
  //                     title: ret.msg,
  //                     icon: 'none'
  //                   })
  //                 }
  //               })
  //           } else {
  //             // console.log('先购买')
  //             wx.showModal({
  //               title: '提示',
  //               content: '玩点不够',
  //               showCancel: false,
  //               confirmText: '我知道了',
  //               success(res) {
  //                 wx.navigateTo({
  //                   url: '/pages/shop/buyshare?aid=' + aid,
  //                 })

  //               }
  //             })

  //           }
  //         }
  //       } else {
  //         wx.showModal({
  //           title: '提示',
  //           showCancel: false,
  //           content: '请先设置完整活动信息，点位任务后才可以进行分享',
  //           success(res) {

  //           }
  //         })
  //       }
  //     })
  //     .catch((err) => {

  //     })
  // },

  // async checkAct(aid) {
  //   return await wxRequest(
  //     app.globalData.config.apiUrl + 'index.php?act=checkAct', {
  //       hideLoading: false,
  //       data: {
  //         aid: aid,
  //         openid: wx.getStorageSync('openid')
  //       }
  //     }
  //   )
  // },
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
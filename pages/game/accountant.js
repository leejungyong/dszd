// pages/game/accountant.js
let aid=null,list
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poilist: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    money:null,
    lend:null,
    borrow:null,
    tabs: ['全部', '借入', '贷出', '产业', '其他'],
    currentTab: 0,
    list: [],
    myteam:null,
    rate:''
  },
//切换
  navbarTap(e) {
    let that=this
    let idx = e.currentTarget.dataset.idx

    this.setData({
      currentTab: idx
    })
   if(idx== 1){
      that.setData({
        list: list.borrowed
    })
   } else if (idx == 2) {
     that.setData({
       list: list.lent
     })
   } else if (idx == 3) {
     that.setData({
       list: list.plant
     })
   } else if (idx == 4) {
     that.setData({
       list: list.other
     })
   }
  },
  borrow(){
    let that=this
    wx.showActionSheet({
      itemList: ['户部司', '家族'],
      success(res) {
        console.log(res.tapIndex)

        let type=null
        if(res.tapIndex==0){
          type=0
        }else{
          type=1
        }
        wx.navigateTo({
          url: './borrow?aid=' + aid + '&type=' + type + '&rate=' + that.data.rate+'&myteam='+JSON.stringify(that.data.myteam),
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

   
  },
  lend(){
    wx.navigateTo({
      url: './scan',
    })
  },
  // toBill(){
  //   wx.navigateTo({
  //     url: './bill',
  //   })
  // },
  //跳转到详情页
  toBillDetail(){
    let type=this.data.currentTab-1
    wx.navigateTo({
      url: './billdetail?type='+type,
    })
  },
  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=getMyAccount',
      method:'POST',
      data:{
        aid:aid,
        openid:wx.getStorageSync('openid')
      },
      success:res=>{
        console.log(res.data)
        if(res.data){
          list = res.data.list
          that.setData({
            money:res.data.money,
            lend:res.data.lend,
            borrow:res.data.borrow,
            list:list.all
          })
          
          // if(that.data.currentTab==0){
          //   that.setData({
          //     list:list.all
          //   })
          // }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    aid=options.aid
    console.log(options)
    this.setData({
      myteam:JSON.parse(options.myteam),
      rate:options.rate
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
    wx.showNavigationBarLoading()

    this.fetch()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
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
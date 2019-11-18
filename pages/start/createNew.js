// pages/start/createNew.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    actName:'',
    teamName:'',
    place:'',
    teamNum:6,
    pic:'',
    aid:'' 
  },

  //选择日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
    sliderChange(e){
      this.setData({
        teamNum:e.detail.value
      })
    },
    updateName(e){
      this.setData({
        actName:e.detail.value
      })
    },
    updateTeamName(e){
      this.setData({
        teamName: e.detail.value
      })
    },
    updatePlace(e){
      this.setData({
        place: e.detail.value
      })
    },

    //一键生成按钮
  creatAct(){
    let that=this
    let isPic=1
    if(that.data.pic==''){
      isPic=0
      that.setData({
        pic:'https://img.wondfun.com/dszd/api/sharepic/1.jpg'
      })
    }
    wx.request({
      url:app.globalData.config.apiUrl+'index.php?act=newAct',
      method:'POST',
      data:{
        openid:wx.getStorageSync('openid'),
        actdata:{
          title:that.data.actName,
          date:that.data.date,
          teamname:that.data.teamName,
          teamnum:that.data.teamNum,
          place:that.data.place,
          pic:that.data.pic
        }
      },
      success:res=>{
        console.log(res.data)
        let act=res.data.list[0]
        let aid=res.data.aid
        if(res.data.status){
          if(isPic==1){
            wx.uploadFile({
              url: app.globalData.config.apiUrl + 'uploadactpic.php',
              filePath: that.data.pic,
              name: 'file',
              formData: {
                'aid': aid,
                'openid': wx.getStorageSync('openid')
              },
              success: res => {
                console.log(res.data)
                wx.showToast({
                  title: '创建成功！',
                  icon: 'none'
                })
                // let ops=res.data.list[0]
                wx.navigateTo({
                  url: './share?aid=' + act.aid + '&title=' + act.title + '&sharepic=' + '',
                })
              }
            })
          }else{
            wx.showToast({
            title: '创建成功！',
            icon: 'none'
          })
          // let ops=res.data.list[0]
          wx.navigateTo({
            url: './share?aid=' + act.aid + '&title=' + act.title + '&sharepic=' + '',
          })
          }
          

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
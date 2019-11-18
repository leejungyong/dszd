// pages/game/roleauthorize.js
const app=getApp()
let aid ,openid,teamid,token,act
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  scan() {
    let that = this
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        console.log(res)
        let result = res.result
        console.log(result)
        act = result.split('&')[0].split('=')[1]
        openid = result.split('&')[1].split('=')[1]
        teamid = result.split('&')[2].split('=')[1]

        token = result.split('&')[3].split('=')[1]
        aid = result.split('&')[4].split('=')[1]
        wx.showModal({
          title: '判定',
          content: '确定要使其成为账房吗？',
          success: (res) => {
            if (res.confirm) {
              wx.request({
                url: app.globalData.config.apiUrl + 'index.php?act=isAccountant',
                data: {
                  aid: aid,
                  teamid: teamid,
                  openid: openid
                },
                method: 'POST',
                success: (res) => {
                  console.log(res.data)
                  let data = res.data
                  if (data.status) {
                    wx.showToast({
                      title: '操作成功'
                    })
                  } else {
                    wx.showToast({
                      title: '操作错误',
                      icon: 'none'
                    })
                  }
                },
                fail: (res) => {
                  wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                  })
                }
              })

            } else {
            }
          }
        })
      },
      fail: (res) => {
        console.log(res)
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
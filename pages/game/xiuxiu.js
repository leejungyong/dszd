var aid = 0
var audioCtx
const app = getApp()
Page({


  data: {
    start: false,
    end: false,
    hide: true,
    audio: 'https://img.wondfun.com/dszd/img/xiuxiu.mp3',
  },
  onReady() {
    audioCtx = wx.createAudioContext('myAudio')

  },
  playAudio(mp3) {
    audioCtx.setSrc(mp3) //音频文件，第三方的可自行选择
    audioCtx.play() //播发音频
  },
  search() {
    // console.log('begin')
    let that = this
    that.playAudio(that.data.audio)
    let rnd = Math.floor(Math.random() * 2);
    // let rnd=1
    let lat = null,
      lng = null
    wx.getLocation({
      success: function (res) {
        // console.log(res)
        lat = res.latitude,
          lng = res.longitude
        console.log(lat + ' ' + lng)
        let msg = {
          aid: aid,
          openid: wx.getStorageSync('openid'),
          rnd: rnd,
          lat: lat,
          lng: lng
        }
        wx.sendSocketMessage({
          data: JSON.stringify(msg)
        })
      },
    })


  },

  touchstart() {
    this.setData({
      start: true,
      end: false
    })
    let lat = null,
      lng = null
    wx.getLocation({
      success: function (resl) {
        lat = resl.latitude,
          lng = resl.longitude
        wx.request({
          url: app.globalData.config.apiUrl + 'index.php?act=updateXiuxiuStatus',
          method: 'POST',
          data: {
            aid: aid,
            openid: wx.getStorageSync('openid'),
            status: 0,
            lat: lat,
            lng: lng
          },
          success: res => {
            console.log('联姻开始')
            console.log(res.data)
          },
          fail: err => {
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            })
          }
        })
      },
    })

  },
  touchend() {
    let that = this
    setTimeout(() => {
      that.setData({
        start: false,
        end: true
      })
    }, 1000)
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=updateXiuxiuStatus',
      method: 'POST',
      data: {
        aid: aid,
        openid: wx.getStorageSync('openid'),
        status: -1
      },
      success: res => {
        console.log('联姻停止')
        console.log(res.data)
      },
      fail: err => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },
  fetch() {
    let that = this
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getXiuxiuStatus',
      method: 'POST',
      data: {
        aid: aid,
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        console.log(res.data)
        let data = res.data
        let matched = data.status
        that.setData({
          hide: matched
        })
        if (matched) {
          wx.redirectTo({
            url: './xiuxiu3?aid=' + aid,
          })
        } else {

        }

      },
      fail: err => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },
  onLoad: function (options) {
    let that = this
    aid = options.aid
    that.fetch()
    wx.connectSocket({
      url: 'wss://www.wondfun.com:39002',
      success: res => {
        console.log(res)
      }
    })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data))
      let data = JSON.parse(res.data)
      if (data.status) {
        if (data.from == wx.getStorageSync('openid') || data.to == wx.getStorageSync('openid')) {
        wx.redirectTo({
          url: './xiuxiu3?aid=' + aid,
        })}
      } else {
        if (data.from == wx.getStorageSync('openid')) {
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        }
      }

    })


  },
  onUnload: function () {
    wx.closeSocket()
  }

})
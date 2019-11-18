var aid = null
const app = getApp()
let content = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '',
    content: [],
    poilist: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    toView: 'm0',
    myteam: null,
    stamp: (new Date()).valueOf(),
    timer: '',
    countdown: '',
    taskid:null,
    auctionBeginTime: null,   //当前地块开始拍卖时间戳
    auctionNowTime: null,     //当前时间戳
    auctionBegin: '',        //当前地块拍卖开始时间
    auctionEnd: '',           //当前地块拍卖截止时间
    auctionPass: '',           //当前地块拍卖已用时间
  },
  updateMsg(e) {

    let reg = /^[0-9]*$/,
      that = this,
      str = e.detail.value
    if (reg.exec(str)) {
      console.log(reg.exec(str))
      this.setData({
        msg: str
      })
    } else {
      that.setData({
        msg: str.substring(0, str.length - 1, 1)
      })
      return
    }

  },
  sendMsg() {
    // console.log(this.data.msg)
    let that = this,
      message = {
        aid: aid,
        msg: that.data.msg,
        nick: that.data.myteam.nick,
        teamname: that.data.myteam.name,
        taskid: that.data.taskid
      }
    wx.sendSocketMessage({
      data: JSON.stringify(message)
    })

  },

  //初始化信息
  fetch() {
    console.log(aid)
    let that = this
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=initAuction',
      method: 'POST',
      data: {
        aid: aid,
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        console.log(res.data)
        let data = res.data
        let auctionBeginTime = data.auctionBeginTime
        // let auctioStartTime = data.auctionStartTime
        let auctionEndTime = data.auctionBeginTime + 2 * 60 * 1000
        console.log(auctionEndTime)
        that.setData({
          poilist: data.poilist,
          myteam: data.myteam,
          content: data.content,
          taskid:data.taskid,
          toView: 'm' + (data.content.length - 1),
          auctionBeginTime: auctionBeginTime,
          auctionBegin: new Date(auctionBeginTime).toTimeString().substr(0, 8),
          auctionEnd: new Date(auctionEndTime).toTimeString().substr(0, 8),
          auctionPass: Math.floor((data.auctionNowTime - auctionBeginTime) / 1000)
        })
        console.log(that.data.toView)
        wx.connectSocket({
          url: 'wss://www.wondfun.com:39001',
          success: res => {
            let message = {
              aid: aid,
              msg: '进入了拍卖',
              nick: that.data.myteam.nick,
              teamname: that.data.myteam.name,
              taskid: -1
            }
            setTimeout(() => {
              wx.sendSocketMessage({
                data: JSON.stringify(message)
              })
            }, 500)

          }
        })

      }
    })
  },

  onLoad: function (options) {
    let that = this

    aid = options.aid

    that.fetch()

    wx.onSocketMessage(function (res) {
      let data = JSON.parse(res.data)
      // console.log(JSON.parse(res.data)) 
      console.log(data)
      let content = that.data.content
      if (data.status) {
        content.push(data.info)
        if (that.data.auctionPass > 0) {

          clearInterval(that.data.timer)
          // let t = Math.floor((that.data.auctionBeginTime - (new Date()).valueOf()) / 1000) + 120
          //如拍卖持续时间超过2min则自动成交
          if (that.data.auctionPass > 2 * 60) {
            //执行超时逻辑
          let  message = {
              aid: aid,
            msg: '2分钟超时',
              nick: '系统',
              teamname: '',
              taskid: that.data.taskid
            }
            wx.sendSocketMessage({
              data: JSON.stringify(message)
            })
          } else {
            let t = 20

             that.setData({
              content: content,
              stamp: that.data.stamp,
              toView: 'm' + (content.length - 1),
              timer: setInterval(() => {
                 console.log(t)
                if (t > 0) {
                  t = t - 1
                  that.setData({
                    countdown: t
                  })
                } else {
                  //执行超时逻辑
                let  message = {
                    aid: aid,
                    msg: '20秒无人出价',
                    nick: '系统',
                    teamname: '',
                    taskid: that.data.taskid
                  }
                  wx.sendSocketMessage({
                    data: JSON.stringify(message)
                  })
                  clearInterval(that.data.timer)
                }
              }, 1000)
            })
          }
        }
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }

    })


  },
onUnload(){
  clearInterval(this.data.timer)
  wx.closeSocket()
}


})
var QR = require('../../utils/wxqrcode.js');
var aid, token, act, price, stone, teamid, teamname,stonename
const app = getApp()
Page({


  data: {
    canvasHidden: false,
    timer: '',
    msg: '',
    width: 250,
    height: 250
  },


  onLoad: function (options) {
    console.log(options)
    let openid = wx.getStorageSync('openid')
    aid = options.aid
    act = options.act
    token = new Date().getTime();
    price = options.price
    teamid = options.teamid
    teamname = options.teamname
    stone = options.stone,
    stonename=options.stonename
    var size = this.setCanvasSize(); //动态设置画布大小
    var param = 'act=' + act + '&openid=' + openid + '&token=' + token + '&aid=' + aid + '&price=' + price + '&teamname=' + teamname + '&teamid=' + teamid + '&stone=' + stone+'&stonename='+stonename

    this.createQrCode(param, "mycanvas", size.w, size.h);
    this.setData({
      height: size.w,
      width: size.w,
      msg: '请出示二维码',
      teamname: teamname
    })

    let that = this

    that.data.timer = setInterval(() => {
      that.listenScanResult()
    }, 2000)

  },
  init() {

  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale * .8;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    QR.api.draw(url, canvasId, cavW, cavH);
    //setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  listenScanResult() {
    let that = this
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=listenSellStoneResult',
      data: {
        token: token,
        aid: aid,
        teamid: teamid,
        openid: wx.getStorageSync('openid')
      },
      method: 'POST',
      success: function (res) {
        let data = res.data
        console.log(res.data)
        if (data.status) {
          clearInterval(that.data.timer)
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
          setTimeout(() => {
            wx.redirectTo({
              url: './game?aid=' + aid
            })
          }, 2000)
        }
        else {

        }
      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },
  onUnload() {
    let that = this
    clearInterval(that.data.timer)

  }
})
// pages/game/game.js
const app = getApp()
let aid = null

Page({


  data: {
    autoplay: true,
    interval: 5000,
    duration: 500,
    vertical: true,
    arr: ['盐', '粮', '布', '茶'],
    poilist: [],
    jewelTab: 0,
    navTab: ['宝石', '其他'],
    jewelList: [1, 1, 1, 1, 1],
    plant: false, //显示种植
    hideBox: true,
    hideStone: true,
    sellMoney: true, //显示输入金额
    items: [{
        name: 'yan',
        value: '盐'
      },
      {
        name: 'liang',
        value: '粮',
        checked: 'true'
      },
      {
        name: 'cha',
        value: '茶'
      },
      {
        name: 'bu',
        value: '布'
      },
    ],
    // aid:'26',
    act: null,
    myteam: null,
    slogan: '让世界更好玩',
    teams: null,
    stones: null,
    lands: null,
    imgUrl: app.globalData.config.imgUrl,
    cdn: app.globalData.config.cdn,
    stoneSelected: null,
    hideUseStone: true,
    teams_nomyteam: null,
    teamvalue: [0],
    selectedteam: 1,
    landIdhold: '',
    landIdexchange1: '',
    landIdexchange2: '',
    cards: null,
    boardInfo: null,
    showTime: false,
    timer: '', //定时器1
    countTime: '',
    endtime: '',
    isHideYJKdetail: true, //是否显示溢价卡详情
    currentyjk: 0, //当前的溢价卡索引
    genius: app.globalData.genius,
    isHideSellYJK: true,
    moneyInput: 0, //溢价卡出售金额
    jewelMoney: 0, //宝石出售金额
    getuserinfo: app.globalData.getUserinfo,
    isStartGame: true
  },
  startGame() {
    this.setData({
      isStartGame: true
    })
  },
  //初始化获取用户信息
  onGotUserInfo(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '程序需要您授权后才可正常运行',
        icon: 'none'
      })
    } else {
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
          this.setData({
            isStartGame: true
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
  //拍卖
  auction() {
    wx.navigateTo({
      url: './auction?aid=' + aid,
    })
  },
  // 跳转至队伍
  toTeam() {
    console.log(this.data.myteam)
    let ops = JSON.stringify(this.data.myteam)
    ops = ops.replace(/\?/g, '？')
    ops = ops.replace(/\&/g, '＆')
    let act = JSON.stringify(this.data.act)
    act = act.replace(/\?/g, '？')
    act = act.replace(/\&/g, '＆')
    wx.navigateTo({
      url: './team?ops=' + ops + '&act=' + act,
    })
  },
  //寻宝
  ai() {
    wx.navigateTo({
      url: './ai?aid=' + aid + '&teamid=' + this.data.myteam.displayorder,
    })
  },
  // 跳转至相册
  toAlbum() {
    let ops = {
      aid: aid,
      teamid: this.data.myteam.currentteamid,
      act_status: this.data.act.status
    }
    console.log(ops)
    wx.navigateTo({
      url: './album?ops=' + JSON.stringify(ops)
    })
  },
  //背包tab
  changeTab(e) {
    console.log(e)
    let that = this
    this.setData({
      jewelTab: e.currentTarget.dataset.idx
    })
    if (that.data.jewelTab == 0) {
      wx.request({
        url: app.globalData.config.apiUrl + 'index.php?act=getBoxStone',
        data: {
          aid: aid,
          openid: wx.getStorageSync('openid'),
          teamid: that.data.myteam.currentteamid
        },
        method: 'POST',
        success: (res) => {
          console.log(res.data)
          that.setData({
            stones: res.data
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      })
    } else if (that.data.jewelTab == 1) {
      wx.request({
        url: app.globalData.config.apiUrl + 'index.php?act=getMyCard',
        method: 'POST',
        data: {
          openid: wx.getStorageSync('openid'),
          aid: aid
        },
        success(res) {
          console.log(res.data)
          if (res.data) {
            let cardobj = res.data.cards
            let arr = []
            for (let key in cardobj) {
              arr.push(cardobj[key])
            }
            console.log(arr)
            that.setData({
              cards: arr
            })
          }
        }
      })
    }

  },

  //记录
  log() {
    wx.navigateTo({
      url: './log?aid=' + aid + '&teamid=' + this.data.myteam.currentteamid,
    })
  },
  //心流
  toHeart() {
    wx.navigateTo({
      url: './heart1?aid='+this.data.act.aid+'&teamid='+this.data.myteam.displayorder,
    })
  },
  map(e) {
    if (this.data.step >= 0) {
      let id = e.currentTarget.id,
        that = this,
        act = JSON.stringify(that.data.act)
      act = act.replace(/\?/g, '？')
      act = act.replace(/\&/g, '＆')
      //console.log(act)
      let ops = JSON.stringify(that.data.poilist[id])
      console.log(ops)
      let open = that.data.poilist[id].open
      if (open == 1) {
        wx.showToast({
          title: '此点位未开放',
          icon: 'none'
        })
        return
      }
      ops = ops.replace(/\?/g, '？')
      ops = ops.replace(/\&/g, '＆')
      //console.log(ops)
      let teamid = that.data.myteam.currentteamid
      let slogan = that.data.slogan
      slogan = slogan.replace(/\?/g, '？')
      slogan = slogan.replace(/\&/g, '＆')
      // console.log(slogan)
      wx.navigateTo({
        url: './map?act=' + act + '&ops=' + ops + '&roleid=' + that.data.myteam.currentrole + '&slogan=' + slogan + '&teamid=' + teamid + '&teamname=' + that.data.myteam.name
      })
    }

  },
  //购买
  buy() {
    wx.navigateTo({
      url: './buy?aid=' + aid,
    })
  },
  //显示背包
  showBox() {
    let that = this

    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getBoxStone',
      data: {
        aid: aid,
        openid: wx.getStorageSync('openid'),
        teamid: that.data.myteam.currentteamid
      },
      method: 'POST',
      success: (res) => {
        console.log(res.data)
        that.setData({
          hideBox: false,
          stones: res.data
        })

      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })

  },
  //查看宝石
  viewStone: function(e) {
    let id = e.currentTarget.id
    let stone = this.data.stones[id]
    console.log(stone)
    this.setData({
      stoneSelected: stone,
      hideStone: false
    })
  },
  useStone: function(e) {
    this.setData({
      hideUseStone: false
    })
  },
  //
  getSelectedTeam(e) {
    let id = e.detail.value[0]
    let teamid = this.data.teams[id].displayorder
    console.log(teamid)
    this.setData({
      selectedteam: teamid
    })

  },
  updatelandIdhold(e) {
    //console.log(e.detail.value)
    this.setData({
      landIdhold: e.detail.value
    })
  },
  //关闭背包
  closeBox() {
    this.setData({
      hideBox: true
    })
  },
  //显示宝石详情
  // toJewelDe() {
  //   this.setData({
  //   })
  // },
  //关闭宝石详情
  closeJewelDetail() {
    this.setData({
      hideStone: true
    })
  },
  //取消使用宝石
  cancelUseStone() {
    let that = this
    this.setData({
      hideUseStone: true,
      teamvalue: [0],
      selectedteam: 1,
      landIdhold: '',
      landIdexchange1: '',
      landIdexchange2: '',
    })
  },
  ////使用宝石
  confirmUseStone() {
    let that = this
    var teamid, stoneid, data, postallowed
    // teamid = that.data.selectedteam
    postallowed = true
    stoneid = this.data.stoneSelected.id
    if (stoneid == 4) {
      teamid = that.data.selectedteam
      console.log(teamid)
      data = {
        aid: aid,
        stoneid: stoneid,
        teamid: that.data.teams_nomyteam[teamid - 1].displayorder,
        teamname: that.data.teams_nomyteam[teamid - 1].name,
        myteamid: that.data.myteam.displayorder,
        myteamname: that.data.myteam.name,
      }
      // console.log(data)
      // postallowed = false
      // return false
    } else if (stoneid == 2) {
      data = {
        aid: aid,
        stoneid: stoneid,
        myteamid: that.data.myteam.displayorder,
        myteamname: that.data.myteam.name,
      }
    } else if (stoneid == 6) {
      data = {
        aid: aid,
        stoneid: stoneid,
        myteamid: that.data.myteam.displayorder,
        myteamname: that.data.myteam.name,
      }
    } else if (stoneid == 5) {
      data = {
        aid: that._data.aid,
        stoneid: stoneid,
        myteamid: that.data.myteam.displayorder,
        myteamname: that.data.myteam.name,
      }
    } else if (stoneid == 1) {
      let landid = that.data.landIdhold
      console.log(landid)
      if (landid == '' || isNaN(parseInt(landid)) || parseInt(landid) <= 0 || parseInt(landid) > 50 || that.data.lands[landid - 1].ptype != 0) {
        wx.showToast({
          title: '请输入正确的编号，只有普通地块才可以被抢夺',
          icon: 'none'
        })
        postallowed = false
        return false
      } else {
        data = {
          aid: aid,
          stoneid: stoneid,
          myteamid: that.data.myteam.displayorder,
          myteamname: that.data.myteam.name,
          landid: landid,
          taskid: that.data.lands[landid - 1].taskid,
          teamid: that.data.lands[landid - 1].owner[0]
        }
      }
    } else if (stoneid == 7) {
      let landid = that.data.landIdhold

      if (landid == '' || isNaN(parseInt(landid)) || parseInt(landid) <= 0 || parseInt(landid) > 50 || that.data.lands[landid - 1].ptype != 0) {
        wx.showToast({
          title: '风暴宝石只能用于普通地块，请输入正确编号',
          icon: 'none'
        })
        postallowed = false
        return false
      } else {
        data = {
          aid: aid,
          stoneid: stoneid,
          myteamid: that.data.myteam.displayorder,
          myteamname: that.data.myteam.name,
          landid: landid,
          taskid: that.data.lands[landid - 1].taskid,
          teamid: that.data.lands[landid - 1].owner[0] ? that.data.lands[landid - 1].owner[0] : 0
        }
        console.log(data)
      }
    } else if (stoneid == 3) {
      let landIdexchange1 = that.data.landIdexchange1
      let landIdexchange2 = that.data.landIdexchange2
      // console.log(landid)
      if (landIdexchange1 == '' || isNaN(parseInt(landIdexchange1)) || parseInt(landIdexchange1) <= 0 || parseInt(landIdexchange1) > 50 || that.data.lands[landIdexchange1 - 1].ptype != 0 || landIdexchange2 == '' || isNaN(parseInt(landIdexchange2)) || parseInt(landIdexchange2) <= 0 || parseInt(landIdexchange2) > 50 || that.data.lands[landIdexchange2 - 1].ptype != 0) {
        wx.showToast({
          title: '请输入正确的编号，只有普通地块才可以被交换',
          icon: 'none'
        })
        postallowed = false
        return false
      } else {
        console.log(that.data.lands[landIdexchange2 - 1].owner.length)
        data = {
          aid: aid,
          stoneid: stoneid,
          landIdexchange1: landIdexchange1,
          landIdexchange2: landIdexchange2,
          myteamid: that.data.myteam.displayorder,
          myteamname: that.data.myteam.name,
          taskid1: that.data.lands[landIdexchange1 - 1].taskid,
          teamid1: that.data.lands[landIdexchange1 - 1].owner.length > 0 ? that.data.lands[landIdexchange1 - 1].owner[0] : '0',
          taskid2: that.data.lands[landIdexchange2 - 1].taskid,
          teamid2: that.data.lands[landIdexchange2 - 1].owner.length > 0 ? that.data.lands[landIdexchange2 - 1].owner[0] : '0'
        }
      }
    }
    if (postallowed) {
      let token = new Date().getTime();
      let cache = wx.getStorageSync('lastpost')
      wx.setStorageSync('lastpost', token)
      if (cache) {
        let duration = token - cache
        if (duration < 3000) {
          wx.showToast({
            title: '手速有点过快呀，休息下，过几秒再点击吧',
            icon: 'none'
          })
          return
        }

      }
      wx.request({
        url: app.globalData.config.apiUrl + 'index.php?act=useStone',

        data: data,
        method: 'POST',
        success: (res) => {
          console.log(res.data)
          let data = res.data
          if (data.status) {
            that.setData({
              hideBox: true,
              hideStone: true,
              hideUseStone: true,
              teamvalue: [0],
              selectedteam: 1,
              landIdhold: '',
              landIdexchange1: '',
              landIdexchange2: '',
            })
            wx.showToast({
              title: data.msg,
              icon: 'none',
              success() {
                setTimeout(() => {
                  that.fetch()
                }, 2000)
              }
            })
          } else {
            wx.showToast({
              title: data.msg,
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
    }
  },
  //显示宝石出售
  tosellJewel() {
    this.setData({
      sellMoney: false
    })
  },
  updateMoneyInputJewel(e) {
    this.setData({
      jewelMoney: e.detail.value
    })
  },
  //确认出售
  sureSellJewel() {
    let jewel = this.data.stoneSelected.id,
      stonename = this.data.stoneSelected.name
    wx.navigateTo({
      url: './sellstone?aid=' + aid + '&stone=' + jewel + '&teamid=' + this.data.myteam.id + '&price=' + this.data.jewelMoney + '&act=sellStone' + '&teamname=' + this.data.myteam.name + '&stonename=' + stonename,
    })
  },
  //关闭宝石出售弹框
  closeSell() {
    this.setData({
      sellMoney: true
    })
  },
  //显示溢价卡详情
  showYJKdetail(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      isHideYJKdetail: false,
      currentyjk: index
    })
  },

  //关闭溢价卡详情
  closeYJK() {
    this.setData({
      isHideYJKdetail: true
    })
  },
  //显示出售溢价卡弹框
  showSellYJK() {
    this.setData({
      isHideSellYJK: false
    })
  },
  //取消出售溢价卡
  cancelSellYJK() {
    this.setData({
      isHideSellYJK: true,
      moneyInput: ''
    })
  },
  //
  updateMoneyInput(e) {
    this.setData({
      moneyInput: e.detail.value
    })
  },
  //确定出售溢价卡
  sureSellYJK() {
    let card = parseInt(this.data.currentyjk) + 1
    wx.navigateTo({
      url: './sellcode?aid=' + aid + '&card=' + card + '&teamid=' + this.data.myteam.id + '&price=' + this.data.moneyInput + '&act=sellCard' + '&teamname=' + this.data.myteam.name,
    })
  },
  //跳转至账房
  toAccountTant() {
    wx.navigateTo({
      url: './accountant?aid=' + aid + '&rate=' + this.data.act.rate + '&myteam=' + JSON.stringify(this.data.myteam),
    })
  },
  queryXiuXiuState(){
      wx.request({
        url: app.globalData.config.apiUrl+'index.php?act=getXiuxiuByAid',
        method:'POST',
        data:{
          aid:aid,
          openid:wx.getStorageSync('openid')
        },
        success:res=>{
          console.log(res.data)
          if(res.data){
              wx.navigateTo({
                url: './xiuxiu3?aid=' + aid,
              })
          }else{
            wx.navigateTo({
              url: './xiuxiu?aid=' + aid,
            })
          }
        }
      })
  },
  //跳转至咻咻
  toXiuxiu1() {
    let that=this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation'] == undefined) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
            that.queryXiuXiuState()
            }
          })
        } else {
          if ((res.authSetting['scope.userLocation'])) {
            that.queryXiuXiuState()
          } else {
            wx.showModal({
              title: '',
              showCancel: false,
              content: '如果要使用咻咻功能，请在设置中打开地理位置授权',
              success: (res) => {
                wx.openSetting({
                  success(res) {}
                })
              }
            })
          }

        }
      }
    })


  },
  //显示种植
  showPlant() {
    this.setData({
      plant: true
    })
  },
  closePlant() {
    this.setData({
      plant: false
    })
  },
  //地块连线
  link() {
    let myteamid = this.data.myteam.currentteamid,
      aid = this.data.act.aid
    wx.navigateTo({
      url: './toAccount?' + '&myteamid=' + myteamid + '&aid=' + aid,
    })
  },
  //计算阶段倒计时
  countTime1(status, endTime) {
    let that = this
    if (parseInt(status) == 0 && parseInt(endTime) > 0 && (endTime * 1000) > (new Date().getTime())) {
      let time = endTime * 1000 - new Date().getTime()
      console.log(time)
      that.setData({
        showTime: true,
        timer: setInterval(function() {
          time = time - 99;
          let hour = parseInt(time / (60 * 60 * 1000))
          if (hour < 10 && hour >= 0) {
            hour = '0' + hour
          }
          let afterHour = time - hour * 60 * 60 * 1000; //取得算出小时数后剩余的秒数
          let min = parseInt(afterHour / (60 * 1000))
          if (min < 10 && min >= 0) {
            min = '0' + min
          }
          let afterMin = parseInt((time - hour * 60 * 60 * 1000 - min * 60 * 1000) / 1000);


          let msecond = time % 100
          msecond = msecond < 10 ? '0' + msecond : msecond
          if (afterMin >= 0 && afterMin < 10) {
            afterMin = '0' + afterMin
          }
          that.setData({
            countTime: hour + ':' + min + ':' + afterMin + ':' + msecond
          })
          if (parseInt(time) <= 0) {
            clearInterval(that.data.timer)
            that.setData({
              showTime: false
            })
            return
          }
        }, 99)
      })
    } else {
      that.setData({
        showTime: false
      })
    }
  },

  fetch() {
    let that = this
    console.log(aid)
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getActDetailInfo',
      method: 'POST',
      data: {
        aid: aid,
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        console.log(res.data)
        if (res.data.myteam.length == 0) {
          wx.redirectTo({
            url: '../start/shake?aid=' + aid,
          })
        } else {
          wx.getSetting({
            success(resa) {
              if (!resa.authSetting['scope.userInfo']) {
                that.setData({
                  isStartGame: false
                })
              }
            }
          })
          let data = res.data
          if (res.data) {
            // 计算阶段倒计时时间
            that.countTime1(data.act.status, data.act.stepConfig.endtime2)

            let tasks = res.data.task
            for (let i in tasks) {
              //tasks[i].currentowner = tasks[i].owner 
              let owners = tasks[i].owner ? tasks[i].owner.split(',') : []
              tasks[i].owner = owners
              let ind = parseInt(tasks[i].plant) == 0 ? 0 : parseInt(tasks[i].plant) - 1
              console.log(ind)
              tasks[i].plant = app.globalData.genius[ind].name
            }
            let act = res.data.act
             act.step = 0
            that.setData({
              lands: res.data.task,
              poilist: res.data.task,
              act: act,
              boardInfo: res.data.act.stepConfig.boardInfo,
              myteam: res.data.myteam,
              teams: res.data.teams,
              endtime: res.data.act.stepConfig.endtime1,
              slogan: res.data.act.slogan || '让世界更好玩',
              step: act.step
            })
            if (wx.getStorageSync('openid') == data.act.creator) {
              wx.navigateTo({
                url: './manage?aid=' + aid + '&title=' + data.act.title + '&cat=' + data.act.cat,
              })
            } else {
              if (that.data.act.step == 1 || that.data.act.step == 5 || that.data.act.step == 9 || that.data.act.step == 13) {
                wx.navigateTo({
                  url: './auction?aid=' + aid,
                })
              }
            }

          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    aid = options.aid
    let that = this
    that.fetch()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    wx.showNavigationBarLoading()
    clearInterval(that.data.timer)
    that.setData({
      timer: '',
      showTime: false
    })
    this.fetch()
    // wx.navigateTo({
    //   url: './manage',
    // })
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
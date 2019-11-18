// pages/game/manage.js
let act, aid, mid, teamid, taskid, token, openid, sellprice, posid, money, buyer, seller_teamname, buyer_teamname = null
let act_title,actStatus=null
let stopstart,stopend
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lands:null,
    act:null,
    teams:null,
    linktype:null,
    start:false,//是否禁用开始游戏按钮
    step:'',   //当前阶段
    flag:1,
    time:'',
    nostart:false
  },
  toTopBoard(){
    // aid=26
    wx.navigateTo({
      url: './topboard?aid='+aid,
    })
  },
  //扫码
  scan() {
    let that = this
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        let result = res.result
        console.log(result)
       act = result.split('&')[0].split('=')[1]
        openid = result.split('&')[1].split('=')[1]
        teamid = result.split('&')[2].split('=')[1]

        token = result.split('&')[3].split('=')[1]
        aid = result.split('&')[4].split('=')[1]
        wx.showModal({
          title: '判定',
          content: '确定要使其成为队长吗？',
          success: (res) => {
            if (res.confirm) {
              wx.request({
                url: app.globalData.config.apiUrl + 'index.php?act=isCaptain',
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
  //点击开始游戏
  startGame(){

    let that=this
   
    
    wx.showModal({
      title: '',
      content: '确认要开始游戏吗？',
      success:res=>{
        if(res.confirm){
            wx.request({
              url: app.globalData.config.apiUrl+'index.php?act=updateActStep',
              method:'POST',
              data:{
                aid:aid,
                act:'start'
              },
              success:res=>{
                console.log(res.data)
                if(res.data.status){
                  that.setData({
                    start:true,
                    nostart:false
                  })
                }
              }
            })
        }
      }
    })
  
  },  
  //跳转至调整时间
  changTime(){
    if(this.data.act.step>=0){
      wx.navigateTo({
      url: './changetime?aid='+aid,
    })
    }
  },
  //点击暂停
  stopOrContinue(){
    let that=this
    if(that.data.flag==1){
      stopstart=new Date().getTime()
    }else{
      stopend=new Date().getTime()
      // console.log(stopend)
      console.log(Math.floor((stopend - stopstart) / 1000) )
      that.setData({
        time:Math.floor((stopend-stopstart)/1000) ,
      })
     
    }
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=updateActTime',
      method: 'POST',
      data: {
        aid: aid,
        time: that.data.time,
        flag: that.data.flag
      },
      success: res => {
        console.log(res.data)
        if (res.data.status) {
          wx.showToast({
            title: that.data.flag == 1 ? '游戏继续' :'游戏暂停',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }

    })
    that.setData({
      flag: !that.data.flag,
    })
  
  },
  //跳转至队伍自定义
  toTeamDefine(){
    wx.navigateTo({
      url: './teamdefine?aid='+aid,
    })
  },
  //基础设置
  toSetting(){
    wx.navigateTo({
      url: '../my/editact?aid='+aid,
    })
  },
  //
  fetch() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getActDetailInfo',
      data: {
        aid: aid,
        openid: wx.getStorageSync('openid')
      },
      method: 'POST',
      success: (res) => {
        let data = res.data
        console.log(data)
        act_title = data.act.title
        let tasks = data.task

        for (let i in tasks) {
          //tasks[i].currentowner = tasks[i].owner 
          let owners = tasks[i].owner ? tasks[i].owner.split(',') : []
          tasks[i].owner = owners

        }

        wx.hideLoading()
        actStatus = data.act.status
        // let cat = data.act.cat
        // let items = that._data.items
        //在旅行模式下 无交易状态
        // if (cat == 1) {
        //   items.splice(3, 2)
        // }
        // for (let i in items) {
        //   if (items[i].value == actStatus) {
        //     items[i].checked = true
        //   }

        // }
        // let openareaData = data.act.openarea.split(',')
        // console.log(openareaData)
        // let openArea = that.data.openArea
        // console.log(openArea)
        // for (let i in openArea) {
        //   for (let j in openareaData) {
        //     if (openArea[i].value == openareaData[j]) {
        //       openArea[i].checked = true
        //     }
        //   }
        // }
        // let mode = data.act.mode

        // let modes = that._data.modes


        // var ctab
        // for (let i in modes) {
        //   if (modes[i].value == mode) {
        //     ctab = mode
        //   }

        // }

        // if (ctab == 2) {
        //   ctab = 3
        // } else if (ctab == -1) {
        //   ctab = 2
        // }

        this.setData({
          lands: data.task,
          // currentTab: ctab,
          teams: data.teams,
          // items: items,
          // modes: modes,
          // openArea: openArea,
          linktype: data.act.linktype,
          act:data.act
        })
        let step=data.act.step
        if (step==-1){
          that.setData({
            start:false,
            nostart:true
          })
        } else if (step == -2){
          that.setData({
            start:true,
            nostart:true
          })
        } else{
          that.setData({
            start: true,
            nostart:false
          })
        }

      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    aid=options.aid
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
  onShareAppMessage: function (ops) {
    let that = this
    let stamp = new Date().getTime()
    //console.log(ops)
    if (ops.from === 'button') {
      return {
        title: '邀请你成为' + that.data.act.title + '的管理员',
        path: 'pages/game/promoteManager?aid=' + aid,
        imageUrl: app.globalData.config.apiUrl + 'sharepic/' + that.data.act.sharepic + '?' + stamp,
        success: function (res) {
        },
        fail: function (res) {
        }
      }
    }
    return {
      title: '',
      path: 'pages/game/game?aid=' + aid,
      imageUrl: app.globalData.config.apiUrl + 'sharepic/' + that.data.act.sharepic + '?' + stamp,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
      }
    }
  },
})
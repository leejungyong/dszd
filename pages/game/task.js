var roleid, aid, taskid, memberobj;
const app = getApp()
Page({
  _data: {
    task: null,
    teamid: 0,
    teamname: '',
    act: null,
    role: null
  },

  data: {
    actMode: null,
    task: null,
    flag: true,
    inputTxt: '',
    answer: '',
    stoneSelected: null,
    hideStone: true,
    btnTxt: '播放音频',
    imgUrl: app.globalData.config.imgUrl,
    uploadUrl: app.globalData.config.uploadUrl,
    slogan: '让世界更好玩',
    items: [{
        id: '1',
        value: '盐',
        checked: false
      },
      {
        id: '2',
        value: '粮',
        checked: false
      },
      {
        id: '3',
        value: '布',
        checked: false
      },
      {
        id: '4',
        value: '茶',
        checked: false
      }
    ],
    roleid: '',
    useYJK: false, //是否使用溢价卡
    nameOfYJ: null, //溢价卡的名字
    numOfYJ: null, //溢价卡的数量
    totalMoney: 4000,
    baseProduce: 200, //基础产量
    basePrice: 10, //基础价格
    rate: 1, //溢价卡 
    member: 0.5, //拥有溢价卡的人的比例 N
    cost: 400, //经营成本
    cards: null, //所有溢价卡信息
    step: 1,
    showSell: true, //隐藏出售地块弹框
    inputTxt: null, //出售价格
    isDisabled:true
  },
  onUnload() {
    if (this.data.task.media == 1) {
      this.innerAudioContext.stop()
    }
  },
  registerAudioContext: function(src) {
    //console.log('ok')
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = src
    this.innerAudioContext.onEnded(
      (res) => {
        this.setData({
          btnTxt: '播放音频'
        })
      })
    this.innerAudioContext.onError((res) => {
      console.log('播放音频失败' + res);
    })
    this.innerAudioContext.onStop((res) => {
      console.log('播放结束!');
    })
  },
  hideStone() {
    this.setData({
      hideStone: true
    })
  },
  preview(e) {
    let id = e.currentTarget.id
    let url = this.data.task.pics[id].url
    let urls = []
    urls.push(url)
    wx.previewImage({
      urls: urls
    })
  },
  preventTouchMove: function() {

  },
  updateAnswer(e) {
    this.setData({
      answer: e.detail.value
    })
  },
  checkAnswer() {
    let that = this
    if (this.data.answer == '') {
      wx.showToast({
        title: '请输入答案',
        icon: 'none'
      })
      return
    } else {
      let answer = this.data.answer
      let defaultAnswer = this._data.task.answer
      if (this.data.task.qtype == 1) {
        if (answer == defaultAnswer) {
          wx.showLoading({
            title: '提交中',
            mask: true
          })
          //that.disabled = true
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=autoUpdateScore',
            data: {
              taskid: this._data.task.taskid,
              aid: this._data.task.aid,
              teamid: this._data.teamid,
              // owner: this._data.task.owner.join(','),
              owner: this._data.task.owner,
              ptype: this._data.task.ptype,
              pvalue: this._data.task.pvalue,
              mine: this._data.task.mine,
              displayorder: this._data.task.displayorder,
              pass: 2
            },
            method: 'POST',
            success: function(res) {
              //that.disabled = false
              wx.hideLoading()
              console.log(res.data)
              let data = res.data
              //console.log(data)
              wx.showToast({
                title: '回答正确,' + data,
                icon: 'none'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: './game?aid=' + that._data.task.aid,
                })
              }, 2000)

            },
            fail: (res) => {
              //that.disabled = false
              wx.hideLoading()
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              })
            }
          })



        } else {
          wx.showToast({
            title: '啊哦，回答错误哦',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)

        }
      } else if (this.data.task.qtype == 2) {
        let answerArr = defaultAnswer.split('|')
        let result = true
        for (let i in answerArr) {
          if (answer.indexOf(answerArr[i]) == -1) {
            result = false
            break
          }
        }
        if (result) {
          //that.disabled = true
          wx.showLoading({
            title: '提交中',
            mask: true
          })
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=autoUpdateScore',
            data: {
              taskid: this._data.task.taskid,
              aid: this._data.task.aid,
              teamid: this._data.teamid,
              owner: this._data.task.owner.join(','),
              ptype: this._data.task.ptype,
              pvalue: this._data.task.pvalue,
              mine: this._data.task.mine,
              displayorder: this._data.task.displayorder,
              pass: 2
            },
            method: 'POST',
            success: function(res) {
              // that.disabled = false
              wx.hideLoading()
              //console.log(res)
              let data = res.data
              //console.log(data)
              wx.showToast({
                title: '回答正确,' + data,
                icon: 'none'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: './game?aid=' + that._data.task.aid,
                })
              }, 2000)

            },
            fail: (res) => {
              //that.disabled = false
              wx.hideLoading()
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: '啊哦，回答错误哦',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      } else if (this.data.task.qtype == 3) {
        if (answer.indexOf(defaultAnswer) >= 0) {
          wx.showLoading({
            title: '提交中',
            mask: true
          })
          //that.disabled = true
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=autoUpdateScore',
            data: {
              taskid: this._data.task.taskid,
              aid: this._data.task.aid,
              teamid: this._data.teamid,
              owner: this._data.task.owner.join(','),
              ptype: this._data.task.ptype,
              pvalue: this._data.task.pvalue,
              mine: this._data.task.mine,
              displayorder: this._data.task.displayorder,
              pass: 2
            },
            method: 'POST',
            success: function(res) {
              //that.disabled = false
              wx.hideLoading()
              //console.log(res)
              let data = res.data
              //console.log(data)
              wx.showToast({
                title: '回答正确,' + data,
                icon: 'none'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: './game?aid=' + that._data.task.aid,
                })
              }, 2000)

            },
            fail: (res) => {
              //that.disabled = false
              wx.hideLoading()
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: '啊哦，回答错误哦',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      } else if (this.data.task.qtype == 4) {
        if (defaultAnswer.indexOf(answer) >= 0) {
          wx.showLoading({
            title: '提交中',
            mask: true
          })
          //that.disabled = true
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=autoUpdateScore',
            data: {
              taskid: this._data.task.taskid,
              aid: this._data.task.aid,
              teamid: this._data.teamid,
              owner: this._data.task.owner.join(','),
              ptype: this._data.task.ptype,
              pvalue: this._data.task.pvalue,
              mine: this._data.task.mine,
              displayorder: this._data.task.displayorder,
              pass: 2
            },
            method: 'POST',
            success: function(res) {
              //that.disabled = false
              wx.hideLoading()
              // console.log(res)
              let data = res.data
              //console.log(data)
              wx.showToast({
                title: '回答正确,' + data,
                icon: 'none'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: './game?aid=' + that._data.task.aid,
                })
              }, 2000)

            },
            fail: (res) => {
              //that.disabled = false
              wx.hideLoading()
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: '啊哦，回答错误哦',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      } else if (this.data.task.qtype == 6) {
        let answerArr = defaultAnswer.split('|')
        let n = 0
        for (let i in answerArr) {
          if (answer.indexOf(answerArr[i]) > -1) {
            n++

          }
        }
        if (n >= 3) {
          wx.showLoading({
            title: '提交中',
            mask: true
          })
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=autoUpdateScore',
            data: {
              taskid: this._data.task.taskid,
              aid: this._data.task.aid,
              teamid: this._data.teamid,
              owner: this._data.task.owner.join(','),
              ptype: this._data.task.ptype,
              pvalue: this._data.task.pvalue,
              mine: this._data.task.mine,
              displayorder: this._data.task.displayorder,
              pass: 2
            },
            method: 'POST',
            success: function(res) {
              // that.disabled = false
              wx.hideLoading()
              //console.log(res)
              let data = res.data
              //console.log(data)
              wx.showToast({
                title: '回答正确,' + data,
                icon: 'none'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: './game?aid=' + that._data.task.aid,
                })
              }, 2000)

            },
            fail: (res) => {
              //that.disabled = false
              wx.hideLoading()
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              })
            }
          })

        } else {
          wx.showToast({
            title: '啊哦，回答错误哦',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      }
    }
  },
  updateTxt(e) {
    this.setData({
      inputTxt: e.detail.value
    })
  },
  challenge() {
    let ops = JSON.stringify(this._data.task)

    if (this._data.task.qtype == 5 || this._data.task.qtype == 7) {
      let op = this._data.task
      console.log(op)
      op.posid = op.displayorder
      op.openid = wx.getStorageSync('openid')
      op.teamid = this._data.teamid
      op.teamname = this._data.teamname
      op.act = this._data.task.qtype == 5 ? 'checktask' : 'addMoney'

      wx.navigateTo({
        url: './showtaskcode?ops=' + JSON.stringify(op)
      })
    } else {
      wx.navigateTo({
        url: './challenge?ops=' + ops + '&teamid=' + this._data.teamid,
      })
    }
  },
  manage() {
    let that = this
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getMyMoney',
      method: 'POST',
      data: {
        aid: that._data.task.aid,
        openid: wx.getStorageSync('openid')
      },
      success(res) {
        console.log(res.data)
        if (res.data >= 400) {
          that.setData({
            flag: false
          })
        } else {
          wx.showToast({
            title: '您的银两不足，无法经营产业！',
          })
        }
      }
    })

  },
  hide() {
    this.setData({
      flag: true
    })
  },
  viewBox() {

  },
  updateMine() {
    //console.log(this.data.inputTxt)
    if (this.data.inputTxt == '' || parseInt(this.data.inputTxt) <= 0 || isNaN(parseInt(this.data.inputTxt))) {
      wx.showToast({
        title: '请填写金额',
        icon: 'none'
      })
      return
    }
    let that = this
    let mine = that.data.inputTxt
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=updateMine',
      data: {
        taskid: that._data.task.taskid,
        mine: mine,
        aid: that._data.task.aid,
        pvalue: that._data.task.pvalue,
        teamid: that._data.teamid
      },
      method: 'POST',
      success: (res) => {
        let data = res.data
        //console.log(data)
        if (data.status) {
          wx.showToast({
            title: data.msg
          })
          setTimeout(() => {
            wx.redirectTo({
              url: './game?aid=' + that._data.task.aid,
            })
          }, 2000)

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
  },

  play() {

    if (this.data.btnTxt == '播放音频' || this.data.btnTxt == '继续播放') {

      this.innerAudioContext.play()
      this.setData({
        btnTxt: '暂停播放'
      })
    } else {

      this.innerAudioContext.pause()
      this.setData({
        btnTxt: '继续播放'
      })
    }

  },
  captainTask(options) {
    let that = this

    let task = JSON.parse(options.ops)
    console.log(task)

    let act = JSON.parse(options.act)
    this._data.act = act

    let teamid = options.teamid

    this._data.teamid = teamid
    let teamname = options.teamname

    this._data.teamname = teamname


    this._data.teamname = options.teamname
    this._data.task = task
    //let sessionname = 'aid' + task.aid + '_task' + task.displayorder + '_team' + teamid


    //let session = wx.getStorageSync(sessionname) ? wx.getStorageSync(sessionname) : 0

    wx.setNavigationBarTitle({
      title: task.displayorder + '号点-' + task.name
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=queryAnswerstatus',
      data: {
        aid: task.aid,
        teamid: this._data.teamid,
        taskid: task.taskid,
        openid: wx.getStorageSync('openid'),
        sessionname: '',
        sessionvalue: ''
      },
      method: 'POST',
      success: (res) => {
        let data = res.data
        console.log(data)
        let status = data.pass.pass ? data.pass.pass : -1

        this.setData({
          task: {
            'usecard': task.usecard,
            'plant': task.plant,
            'name': task.name,
            'memo': task.memo,
            'pics': task.pics,
            'qtype': task.qtype,
            'ptype': task.ptype,
            'mine': task.mine,
            'owner': task.owner,
            'teamid': teamid,
            'media': task.media,
            'answer': task.answer,
            'displayorder': task.displayorder,
            'url': task.url,
            'tip1': task.tip1 ? task.tip1 : null,
            'tip2': task.tip2 ? task.tip2 : null
          },
          answerStatus: status,
          roleid: roleid,
          actMode: that._data.act.mode

        })
        wx.hideLoading()

        if (that.data.task.mine == 0) {
          let arr = that.data.items
          arr = arr.map((item, index) => {
            if (item.value == task.plant) {
              item.checked = true
              that.cardChange(index + 1)
            }
            return item
          })
          that.setData({
            items: arr
          })
          // console.log(that.data.member)
        } else {
          let step = null
          console.log(that.data.step)
          if (that.data.step >= 0 && that.data.step <= 3) {
            step = app.globalData.produce.step1
          } else if (that.data.step >= 4&& that.data.step <= 7) {
            step = app.globalData.produce.step2
          } else if (that.data.step >= 8 && that.data.step <= 11) {
            step = app.globalData.produce.step3
          } else if (that.data.step >= 12 && that.data.step <= 15) {
            step = app.globalData.produce.step4
          }
          console.log(step)
          if (that.data.task.usecard == 1) {
            that.setData({
              rate: 3
            })
          }
          if (that.data.task.mine == 1) {
            that.setData({
              basePrice: step.salt.basePrice,
              baseProduce: step.salt.baseProduce,
              member: memberobj.member1
            })
          } else if (that.data.task.mine == 2) {
            that.setData({
              basePrice: step.corns.basePrice,
              baseProduce: step.corns.baseProduce,
              member: memberobj.member2
            })
          } else if (that.data.task.mine == 3) {
            that.setData({
              basePrice: step.cloth.basePrice,
              baseProduce: step.cloth.baseProduce,
              member: memberobj.member3
            })
          } else if (that.data.task.mine == 4) {
            that.setData({
              basePrice: step.tea.basePrice,
              baseProduce: step.tea.baseProduce,
              member: memberobj.member4
            })
          }
          that.setData({
            totalMoney: that.data.baseProduce * (1 + that.data.member) * that.data.basePrice * that.data.rate - that.data.cost
          })
        }
        // console.log(this.data)
        if (task.media == 1) {
          this.registerAudioContext(task.url);
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
  //显示出售地块的modal
  sell() {
    let that=this
    if (that.data.step == 3 || that.data.step == 7|| that.data.step == 11 || that.data.step == 15 ){
      that.setData({
        isDisabled:false
      })
    }
    this.setData({
      showSell: false
    })
  },
  //

  updateInputTxt(e) {
    this.setData({
      inputTxt: e.detail.value
    })
  },
  //取消出售地块
  cancelSell() {
    this.setData({
      showSell: true
    })
  },
  //确定出售
  sureSell() {
    if (this.data.inputTxt == '' || isNaN(parseInt(this.data.inputTxt)) || parseInt(this.data.inputTxt) <= this._data.task.pvalue) {
      wx.showToast({
        title: '请设置不低于' + this._data.task.pvalue + '的价格',
        icon: 'none'
      })
    } else {
      let ops = {
        act: 'sell',
        taskid: this._data.task.taskid,
        aid: this._data.task.aid,
        openid: wx.getStorageSync('openid'),
        teamid: this._data.teamid,
        sellprice: this.data.inputTxt,
        posid: this._data.task.displayorder,
        teamname: this._data.teamname
      }
      // console.log(ops)
      wx.navigateTo({
        url: './showtradecode?ops=' + JSON.stringify(ops),
      })
    }
  },
  //改变radiogroup
  changeRadio(e) {
    let id = e.detail.value
    // console.log(e)
    this.cardChange(id)
  },
  cardChange(id) {
    // console.log(id)
    let that = this,
      step=null
    if (that.data.step>=0&&that.data.step<=3) {
      step = app.globalData.produce.step1
    } else if (that.data.step >= 4 && that.data.step <= 7) {
      step = app.globalData.produce.step2
    } else if (that.data.step >= 8 && that.data.step <= 11) {
      step = app.globalData.produce.step3
    } else if (that.data.step >= 12 && that.data.step <= 15) {
      step = app.globalData.produce.step4
    }
    if (id == 1) {
      if (that.data.cards.card1 == 0) {
        that.setData({
          useYJK: false,
          numOfYJ: that.data.cards.card1,
          rate: 1
        })
      } else {
        if (that.data.items[id - 1].value == that.data.task.plant) {
          that.setData({
            useYJK: true,
            rate: 3
          })
        } else {
          that.setData({
            useYJK: false,
            rate: 1
          })
        }
        that.setData({
          nameOfYJ: that.data.items[id - 1].value,
          numOfYJ: that.data.cards.card1
        })
      }
      that.setData({
        basePrice: step.salt.basePrice,
        baseProduce: step.salt.baseProduce,
        member: memberobj.member1
      })
    } else if (id == 2) {
      if (that.data.cards.card2 == 0) {
        that.setData({
          useYJK: false,
          numOfYJ: that.data.cards.card2,
          rate: 1
        })
      } else {
        if (that.data.items[id - 1].value == that.data.task.plant) {
          that.setData({
            useYJK: true,
            rate: 3
          })
        } else {
          that.setData({
            useYJK: false,
            rate: 1
          })
        }
        that.setData({
          nameOfYJ: that.data.items[id - 1].value,
          numOfYJ: that.data.cards.card2
        })
      }
      that.setData({
        basePrice: step.corns.basePrice,
        baseProduce: step.corns.baseProduce,
        member: memberobj.member2
      })
    } else if (id == 3) {
      if (that.data.cards.card3 == 0) {
        that.setData({
          useYJK: false,
          numOfYJ: that.data.cards.card3,
          rate: 1
        })
      } else {
        if (that.data.items[id - 1].value == that.data.task.plant) {
          that.setData({
            useYJK: true,
            rate: 3
          })
        } else {
          that.setData({
            useYJK: false,
            rate: 1
          })
        }
        that.setData({
          nameOfYJ: that.data.items[id - 1].value,
          numOfYJ: that.data.cards.card3
        })
      }
      that.setData({
        basePrice: step.cloth.basePrice,
        baseProduce: step.cloth.baseProduce,
        member: memberobj.member3
      })
    } else if (id == 4) {
      if (that.data.cards.card4 == 0) {
        that.setData({
          useYJK: false,
          numOfYJ: that.data.cards.card4,
          rate: 1
        })
      } else {
        if (that.data.items[id - 1].value == that.data.task.plant) {
          that.setData({
            useYJK: true,
            rate: 3
          })
        } else {
          that.setData({
            useYJK: false,
            rate: 1
          })
        }
        that.setData({
          nameOfYJ: that.data.items[id - 1].value,
          numOfYJ: that.data.cards.card4
        })
      }
      that.setData({
        basePrice: step.tea.basePrice,
        baseProduce: step.tea.baseProduce,
        member: memberobj.member4
      })
    }
    //计算本阶段收益
    that.setData({
      totalMoney: that.data.baseProduce * (1 + that.data.member) * that.data.basePrice * that.data.rate - that.data.cost
    })
    // console.log(that.data)
  },
  //是否使用溢价卡
  isUse(e) {
    let that = this
    let b = that.data.useYJK
    that.setData({
      useYJK: !b
    })
    if (that.data.useYJK) {
      that.setData({
        rate: 3
      })
    } else {
      that.setData({
        rate: 1
      })
    }
    //计算本阶段收益
    that.setData({
      totalMoney: that.data.baseProduce * (1 + that.data.member) * that.data.basePrice * that.data.rate - that.data.cost
    })
  },
  //确定种植
  surePlant() {
    let that = this
    console.log(that.data.useYJK)
    wx.showModal({
      title: '',
      content: '确定要经营该产业吗？',

      success: res => {
        if (res.confirm) {
          let id
          that.data.items.map(item => {
            if (item.checked == true) {
              id = item.id
            }
          })
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=postPlant',
            method: 'POST',
            data: {
              openid: wx.getStorageSync('openid'),
              aid: aid,
              taskid: taskid,
              plant: id,
              card: that.data.useYJK == true ? 1 : 0
            },
            success: res => {
              console.log(res.data)
              if (res.data.status) {
                let arr = that.data.task
                arr.mine = res.data.mine
                arr.usecard = res.data.card
                that.setData({
                  task: arr,
                  flag: true
                })
                wx.showToast({
                  title: '种植成功！',
                  icon: 'none'
                })

                let pages = getCurrentPages(),
                  prepage = pages[pages.length - 3]
                prepage.fetch()
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 2000)

              } else {
                wx.showToast({
                  title: '操作失败，请重试！',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  //出售
  sold() {
    let that = this
    wx.showModal({
      title: '',
      content: '确认出售吗？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=sellPlant',
            method: 'POST',
            data: {
              openid: wx.getStorageSync('openid'),
              aid: aid,
              taskid: taskid,
              step: that.data.step
            },
            success: res => {
              console.log(res.data)
              if (res.data.status) {
                wx.showToast({
                  title: '出售成功！',
                  icon: 'none'
                })
                let pages = getCurrentPages(),
                  prepage = pages[pages.length - 3]
                prepage.fetch()
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 2000)

              } else {
                wx.showToast({
                  title: '操作失败，请重试！',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })

  },
  //关闭种植遮罩
  closePlant() {
    this.setData({
      flag: true
    })
  },
  //获取溢价卡信息
  fetch() {
    let that = this
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getMyCard',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        aid: aid
      },
      success: res => {
        console.log(res.data)
        let s = res.data.step
        // s = 1
        if (res.data) {
          that.setData({
            cards: res.data.cards,
            step: s
          })
        }
      }
    })
  },

  onLoad: function(options) {
    let that = this
    let ops = options

    let task = JSON.parse(ops.ops)
    let act = JSON.parse(ops.act)
    console.log(ops)
    roleid = ops.roleid

    let actid = act.aid

    aid = act.aid
    taskid = task.taskid
    memberobj = task.member
    console.log(memberobj)
    this.setData({
      roleid: ops.roleid
    })

    this.fetch()
    this.captainTask(options)

    // if (roleid == 1) {
    //   wx.request({
    //     url: app.globalData.config.apiUrl + 'index.php?act=getRedbagTodo',
    //     data: {
    //       aid: actid,
    //       openid: wx.getStorageSync('openid')
    //     },
    //     method: 'POST',
    //     success: (res) => {
    //       let data = res.data
    //       console.log(data)
    //       if (data && data.status == 0 && taskid == data.taskid) {

    //       } else {

    //         that.captainTask(options)
    //       }
    //     },
    //     fail: (err) => {
    //       wx.showToast({
    //         title: '网络错误',
    //         icon: 'none'
    //       })
    //     }
    //   })

    // } else if (roleid == 0) {
    //   this.captainTask(options)
    // }

  },

})
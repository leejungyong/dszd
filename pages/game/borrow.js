// pages/game/borrow.js
let aid=null
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // items: [
    //   { value: '0', name: '户部司',checked:true },
    //   { value: '1', name: '家族',checked:false }, 
    // ],
    currentSelect:'第一阶段',
    currentSelectValue:0,
    period: [
      { name: '第一阶段', value: '0' }, 
      { name: '第二阶段', value: '1' }, 
      { name: '第三阶段', value: '2' }, 
      { name: '第四阶段', value: '3'}
      ],
    show:false,
    borrowMoney:'',//借入金额
    rate:'',        //利率
    interest:'0',    //利息
    total:'0',       //总还款金额
    type:null,
    myteam:null,
    sysrate:''
  },
  //计算总利息和总还款金额
  count(){
    // console.log(this.data)

    let that=this,  
        realrate=null
    if(that.data.type==0){
      realrate=that.data.sysrate
    }else if(that.data.type==1){
      realrate=that.data.rate
    }
     let rate = (realrate / 100).toFixed(2),
      interest=parseFloat((that.data.borrowMoney*rate).toFixed(2))
      console.log(rate)
      console.log(interest)
    let total=interest+parseInt(that.data.borrowMoney)
    that.setData({
      interest:interest==null?'0':interest,
      total:total==null?'0':total
    })
  },
  //点击下拉框
  showSelect(){
    let s=this.data.show
    this.setData({
      show:!s
    })
  },
  //选择下拉框中的一个
  chooseOne(e){
    console.log(e)
    let that=this
    let index=e.currentTarget.dataset.idx
    that.setData({
      show:false,
      currentSelect:that.data.period[index].name,
      currentSelectValue: that.data.period[index].value
    })
    that.count()
  },

  //改变借入金额
  updateMoney(e){
    this.setData({
      borrowMoney:e.detail.value
    })
    this.count()
  },
  //改变利率
  updateRate(e){
    this.setData({
      rate:e.detail.value
    })
    this.count()
  },

  //向户部司
  sureSys(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=postSysBorrow',
      method:'POST',
      data:{
        aid:aid,
        openid:wx.getStorageSync('openid'),
        step:that.data.currentSelectValue,
        money:that.data.borrowMoney,
        type:that.data.type,
        rate:that.data.sysrate
      },
      success:res=>{
          console.log(res.data)
              wx.navigateBack({
                delta: 1,
              })
      }
    })

  },

  //向家族借款
  sureFamily(){
    let that = this
    let act='borrow'
    wx.navigateTo({
      url: './codeofborrow?act='+act+'&aid='+aid+'&money='+that.data.borrowMoney+'&rate='+that.data.rate+'&step='+that.data.currentSelectValue+'&teamname='+that.data.myteam.name+'&teamid='+that.data.myteam.displayorder+'&interest='+that.data.interest+'&total='+that.data.total
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(JSON.parse(options.myteam))
    aid=options.aid
    this.setData({
      type:options.type,
      myteam:JSON.parse(options.myteam),
      sysrate:options.rate
    })
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
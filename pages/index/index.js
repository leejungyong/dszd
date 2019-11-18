//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    swiper:[1],
    //是否采用衔接滑动  
    circular: true,
    //是否显示画板指示点  
    indicatorDots: true,
    //选中点的颜色   
    indicatorcolor: "#fff",
    //是否竖直  
    vertical: false,
    //是否自动切换  
    autoplay: true,
    //自动切换的间隔
    interval: 2500,
    //滑动动画时长毫秒  
    duration: 100,
    imgheights:[],    // 所有的图片高度
    current:0,        //当前的swiper-item
    navbar: ['热门活动', '最新活动'],
    currentTab:0,
    list:[1,1,1],
    openSide: false,
    display: 'none',
    translate: '',
    cityList:[{name:'hazng',checked:false}],
    typeList: [{ name: 'shi', checked: false}]
  },

  toWX(){},

  imageLoad: function(e) { //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  //swiper改变
  change(e){
    this.setData({
      current:e.detail.current
    })
  },

  //改变导航
  changeNav(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  //显示侧边栏
  showSide() {
    let that = this
    this.setData({
      openSide: true,
      display: 'block', 
    })
  },
  //关闭侧边栏
  hideSide() {
    this.setData({
      openSide: false,
      display: 'none',
      translate: ''
    })
  },
  onLoad: function () {
   
  },

})

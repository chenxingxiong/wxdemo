//index.js
//获取应用实例
const app = getApp()
const weatherMap={
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'

}
const weatherColorMap={
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data:{
    nowTemp:'',
    nowWeather:"",
    nowWeatherBgimg:'',
    castlist:[]
  },

  onPullDownRefresh:function(){
    this.getNowdata(()=>{
      wx.stopPullDownRefresh()
    });

  },
  onLoad: function () {
    console.log("hello world");
    this.getNowdata();

  },

  getNowdata(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: { city: "上海市" },
      // success:function(res){
      //  console.log(res);
      //  }
      success: res => {
        console.log(res);
        let result = res.data.result;
        this.getnow(result)
        this.getmanyHours(result)
      },
      complete: () => {
        callback && callback();
      }

    })
  },   

  getnow(result){
    let nowTemp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      nowTemp: nowTemp,
      nowWeather: weatherMap[weather],
      nowWeatherBgimg: '/img/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  }, 
  getmanyHours(result){
    let forecast = result.forecast;
    let nt = new Date().getHours();
    let casttemplist = [];
    for (let i = 0; i < 8; i ++) {
      casttemplist.push({
        time: (i*3+ nt) % 24 + "时",
        iconpath: '/img/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + "°"
      })
    }
    casttemplist[0].time = '现在';
    this.setData({
      castlist: casttemplist
    })
  }
  
})

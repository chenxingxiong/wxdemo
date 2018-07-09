//index.js
//XOXBZ-O3Y3W-55URL-RCA6E-5VFNT-QEBRA  位置服务的key
//获取应用实例
const app = getApp()
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'

}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk = '';
Page({
  data: {
    nowTemp: '',
    nowWeather: "",
    nowWeatherBgimg: '',
    castlist: [],
    todaydate: '',
    todaytemp: '',
    city: '广州市',
    locationTipsText: UNPROMPTED_TIPS,
    locationAuthType: UNPROMPTED

  },

  onPullDownRefresh: function () {
    this.getNowdata(() => {
      wx.stopPullDownRefresh()
    });

  },
  onLoad: function () {
    qqmapsdk = new QQMapWX({
      key: 'XOXBZ-O3Y3W-55URL-RCA6E-5VFNT-QEBRA'
    });
    wx.getSetting({
      success:res=>{
        let auth = res.authSetting['scope.userLocation']
         this.setData({
           locationAuthType:auth?AUTHORIZED:(auth==false)?UNAUTHORIZED:UNPROMPTED,
           locationTipsText:auth?AUTHORIZED_TIPS:(auth==false)?UNAUTHORIZED_TIPS:UNPROMPTED_TIPS
         })

         if(auth){
           this.getCityAndWeather()
         }else{
           this.getNowdata();
         }
      }
    })

  },
  // onShow: function () {
  //   //获取地理位置权限
  //  wx.getSetting({
  //    success:res=>{
  //      let auth=res.authSetting['scope.userLocation']
  //      if(auth&&this.data.locationAuthType!=AUTHORIZED){
  //        this.setData({
  //          locationTipsText: AUTHORIZED_TIPS,
  //          locationAuthType: AUTHORIZED

  //        })
  //        this.getTapLocation()
  //      }
  //    }
  //  })
  // },

  getNowdata(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: { city: this.data.city },
      // success:function(res){
      //  console.log(res);
      //  }
      success: res => {
        console.log(res);
        let result = res.data.result;
        this.getnow(result)
        this.getmanyHours(result)
        this.setToday(result)
      },
      complete: () => {
        callback && callback();
      }

    })
  },

  getnow(result) {
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
  getmanyHours(result) {
    let forecast = result.forecast;
    let nt = new Date().getHours();
    let casttemplist = [];
    for (let i = 0; i < 8; i++) {
      casttemplist.push({
        time: (i * 3 + nt) % 24 + "时",
        iconpath: '/img/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + "°"
      })
    }
    casttemplist[0].time = '现在';
    this.setData({
      castlist: casttemplist
    })
  },
  setToday(result) {
    let ndate = new Date();
    this.setData({
      todaytemp: result.today.minTemp + '°' + '- ' + result.today.maxTemp + '°',
      todaydate: `${ndate.getFullYear()}-${ndate.getMonth() + 1}-${ndate.getDay()} 今天`,
      // todaydate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`,

    })
    console.log(ndate.getFullYear())
  },
  onclickshowtoast() {
    wx.showToast({

    })
    //跳转到list列表页面
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city,
    })
  },

    getCityAndWeather(){
      var that = this;
      wx.getLocation({
        success: function (res) {
          that.setData({
            locationAuthType: AUTHORIZED,
            locationTipsText: AUTHORIZED_TIPS
          })
          console.log(res.latitude, res.longitude)
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (res) {
              let city = res.result.address_component.city;
              that.setData({
                city: city,
                locationTipsText: AUTHORIZED_TIPS
              })
              that.getNowdata();
            }

          });

        },
        fail: () => {
          that.setData({
            locationAuthType: UNAUTHORIZED,
            locationTipsText: UNAUTHORIZED_TIPS
          })

        }
      })
    },

  //获取位置信息
  getTapLocation() {
    if (this.data.locationAuthType == UNAUTHORIZED) {
     wx.openSetting({
       success:res=>{
         let auth = res.authSetting['scope.userLocation']
         if(auth){
           this.getCityAndWeather()
         }
       }
     })
    }
    else {
      this.getCityAndWeather()
    }
  }

})

// pages/list/list.js
const dayMap=['星期日','星期一','星期二','星期三','星期四','星期五','星期六']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekWeather:[]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeekWeather()
  },

   
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  

   

  getWeekWeather(){
   wx.request({
     url: 'https://test-miniprogram.com/api/weather/future',
     data:{
       city:'上海',
       time:new Date().getTime()
     },
     success:res=>{
       let result=res.data.result;
       console.log(result);
       this.setWeekWeather(result)
     }
   })
  },

  setWeekWeather(result){
    let weekWeather=[]
    for(let i=0;i<7;i++){
      let date=new Date()
      date.setDate(date.getDate()+i)
      weekWeather.push({
        day:dayMap[date.getDay()],
        date:date.getFullYear()+'-'+`${date.getMonth()+1}`+'-'+date.getDate(),
        temp:result[i].minTemp+"-"+result[i].maxTemp,
        iconPath:'/img/'+result[i].weather+'-icon.png'
      })

    }
    weekWeather[0].day='今天',
    this.setData({
      weekWeather:weekWeather
    })
  }

})
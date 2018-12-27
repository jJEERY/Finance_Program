Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  HorL: function(After, Before){
    if (parseInt(After) > parseInt(Before))
       return 'red';
    else
       return 'green';
  },

  GetFour: function (num){
    return parseFloat(num).toFixed(4);
  },

  GetDM:function (date){
    return (date.getMonth() + 1) + '/' + date.getDate();
  },

  onLoad: function (options) {
    var that = this;
    var code = wx.getStorageSync('code');
    this.setData({code:code});

    console.log(code);

    //连接代码
    wx.request({
      url: 'https://www.szu522.cn:50003/conn.php',
      data: {
        Code: code
      },
      dataType: 'json'
      ,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var itemArr = res.data;

        if(itemArr.data == null){
              wx.showModal({
                title: '提示',
                content: '您输入的股票代码预测值正在更新中……',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../welcome/welcome',
                    })
                  }
                }
              })
              return;
        }
        console.log(itemArr.data)
        var codes = {
          Name: itemArr.data.name,
          Code: itemArr.data.code,
          Time: itemArr.data.date,

          D1H: that.GetFour(itemArr.data.high1),
          D2H: that.GetFour(itemArr.data.high2),
          D3H: that.GetFour(itemArr.data.high3),
          D4H: that.GetFour(itemArr.data.high4),
          D5H: that.GetFour(itemArr.data.high5),

          D1l: that.GetFour(itemArr.data.low1),
          D2l: that.GetFour(itemArr.data.low2),
          D3l: that.GetFour(itemArr.data.low3),
          D4l: that.GetFour(itemArr.data.low4),
          D5l: that.GetFour(itemArr.data.low5),

          loss: itemArr.data.loss,
        }


        //算出预测日期
        codes.Time=new Date(codes.Time);
        
        console.log(codes.Time.getMonth());

        var day1 = new Date(codes.Time);
        if(codes.Time.getDay()==5){
          day1.setDate(codes.Time.getDate() + 3);
        }
        else{
          day1.setDate(codes.Time.getDate() + 1);
        }

        var day2 = new Date(day1);
        if (day1.getDay() == 5) {
          day2.setDate(day1.getDate() + 3);
        }
        else {
          day2.setDate(day1.getDate() + 1);
        }

        var day3 = new Date(day2);
        if (day2.getDay() == 5) {
          day3.setDate(day2.getDate() + 3);
        }
        else {
          day3.setDate(day2.getDate() + 1);
        }

        var day4 = new Date(day3);
        if (day3.getDay() == 5) {
          day4.setDate(day3.getDate() + 3);
        }
        else {
          day4.setDate(day3.getDate() + 1);
        }

        var day5 = new Date(day4);
        if (day4.getDay() == 5) {
          day5.setDate(day4.getDate() + 3);
        }
        else {
          day5.setDate(day4.getDate() + 1);
        }

        var days = {
          day1: that.GetDM(day1),
          day2: that.GetDM(day2),
          day3: that.GetDM(day3),
          day4: that.GetDM(day4),
          day5: that.GetDM(day5)
        }
        that.setData(codes);
        console.log(days);

        var D1H = that.data.D1H
        var D2H = that.data.D2H
        var D3H = that.data.D3H
        var D4H = that.data.D4H
        var D5H = that.data.D5H

        var D1L = that.data.D1l
        var D2L = that.data.D2l
        var D3L = that.data.D3l
        var D4L = that.data.D4l
        var D5L = that.data.D5l
     
        that.setData({
          imageUrl: "https://www.szu522.cn:50003/"+codes.Code+".png",
          codes:codes,
          days: days
        })
      }
    })
  }
})
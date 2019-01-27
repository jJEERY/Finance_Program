
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    chosen: '',
  },

  /**
   * 截取四位小数
   */
  GetFour: function (num){
    return parseFloat(num).toFixed(4);
  },
  
  /**
   * 获取表格日期
   */
  GetDM:function (date){
    return (date.getMonth() + 1) + '/' + date.getDate();
  },

  /* 选择添加或取消自选股票 */
  self_option: function (e) {
    var that = this;
    var code = e.target.id;
    var userId = app.useropenID;
    //若显示为加自选，则点击后的操作为加自选
    if(this.chosen == '+加自选') {
      var name = that.codes.Name;
      //加自选
      wx.request({
        url: 'http://172.31.71.181:9090/addStock',
        data: {
          userId: userId,
          code: code,
          name: name
        },
        method: 'GET',
        success: function (res) {
          var result = res.data.result;
          //添加自选股成功
          if (result == "添加自选成功") {
            wx.showToast({
              title: result,
            });
            //选择成功后需要修改页面上的信息
            var chosen = '已选中';
            //将修改后的结果提交到公共值中
            that.setData({
              chosen: chosen
            });
          } else {
            //成功连接服务器但是操作数据库失败
            wx.showToast({
              title: result,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {
          //连接java服务器失败
          wx.showToast({
            title: '连接服务器超时...',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    //若显示为已选中，则点击后的操作为取消自选
    else {
      //取消自选
      wx.request({
        url: 'http://172.31.71.181:9090/deleteStock',
        data: {
          userId: userId,
          code: code
        },
        method: 'GET',
        success: function (res) {
          //对java返回值进行判断，是否成功操作数据库
          var result = res.data.result;
          if (result == "取消自选成功") {
            wx.showToast({
              title: result,
            });
            //成功操作后，需要修改页面上的信息
            var chosen = '+加自选';
            //将值提交到公共值中
            that.setData({
              chosen: chosen
            });
          } else {
            //成功连接了java但是操作数据库失败
            wx.showToast({
              title: result,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '连接服务器超时...',
            icon: 'none',
            duration: 2000
          })
        }
      })

    }
  },
  /* 选择添加或取消自选股票 *
  self_option: function (e) {
    var that  = this;
    var code = '"' + e.target.id + '"';
    var openid = '"' + app.useropenID + '"';
    console.log(code);
    console.log(openid);

    /* 获取自选股里面的内容并比较 *
    wx.request({
      url: 'https://www.szu522.cn:50003/addstock.php',
      data:{
        openid: openid,
        code: code
      },
      dataType: 'json',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("修改成功！");
        that.changebutton(openid, code);
      }
    }); 
  },

  /* 查看根据输入的id和code改变界面上的选择键的内容 */
  changebutton: function (userId, code) {
    var that = this;
    //获得自选键
    wx.request({
      url: 'http://172.31.71.181:9090/checkStock',
      data: {
        userId: userId,
        code: code
      },
      method: 'GET',
      //成功连接
      success: function(res) {

        var result = res.data.result;
        var chosen = '';
        if (result) {
          chosen = '已选中';        
        } else {
          chosen = '+加自选';
        }
      },
      //连接失败错误提示
      fail: function() {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onLoad: function(options) {
    var that = this;
    var code = wx.getStorageSync('code');
    this.setData({
      code: code
    });
    var userId = app.useropenID;

    wx.request({
      url: 'http://172.31.71.181:9090/getStockPredict',
      data: {
        code: code
      },
      method: 'GET',
      success: function(res) {
        var itemArr = res.data;
        //没有股票信息则退出
        if(itemArr == null) {
          wx.showModal({
            title: '提示',
            content: '暂无此股票信息',
            showCancel: false,
            confirmText: '退出',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../homepage/homepage',
                })
              }
            }
          })
        }
        //查询到股票预测信息后开始处理
        var codes = {
          Name: itemArr.name,
          Code: itemArr.code,
          Time: itemArr.date,

          D1H: that.GetFour(itemArr.high1),
          D2H: that.GetFour(itemArr.high2),
          D3H: that.GetFour(itemArr.high3),
          D4H: that.GetFour(itemArr.high4),
          D5H: that.GetFour(itemArr.high5),

          D1l: that.GetFour(itemArr.low1),
          D2l: that.GetFour(itemArr.low2),
          D3l: that.GetFour(itemArr.low3),
          D4l: that.GetFour(itemArr.low4),
          D5l: that.GetFour(itemArr.low5),

          loss: itemArr.loss,
        };
        //算出预测日期
        codes.Time = new Date(codes.Time);
        var day1 = new Date(codes.Time);
        var day2 = new Date(codes.Time);
        var day3 = new Date(codes.Time);
        var day4 = new Date(codes.Time);
        var day5 = new Date(codes.Time);

        //对接下来五天进行判断，跳过周六日
        that.getTomorrow(codes.Time, day1);
        that.getTomorrow(day1, day2);
        that.getTomorrow(day2, day3);
        that.getTomorrow(day3, day4);
        that.getTomorrow(day4, day5);
        var days = {
          day1: that.GetDM(day1),
          day2: that.GetDM(day2),
          day3: that.GetDM(day3),
          day4: that.GetDM(day4),
          day5: that.GetDM(day5)
        };

        that.setData({
          imageUrl: "https://www.szu522.cn:50003/" + codes.Code + ".png",
          codes: codes,
          days: days
        });
        that.changebutton(userId, code);
      },
      //连接失败提示
      fail: function() {
        wx.showToast({
          title: '查询股票失败，请返回重试',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  //跳过周六日
  getTomorrow: function (today, tomorrow) {
    if (today.getDay() == 5) {
      tomorrow.setDate(today.getDate() + 3);
    }
    else {
      tomorrow.setDate(today.getDate() + 1);
    }
  },
  /* 
  onLoad: function (options) {
    var that = this;
    var code = wx.getStorageSync('code');
    this.setData({code:code});

    var id = app.useropenID;
    id = '"' + id + '"';

    console.log(code);

    // 连接代码获取图片和数据
    wx.request({
      url: 'https://www.szu522.cn:50003/conn.php',
      data: {
        Code: code
      },
      dataType: 'json',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var itemArr = res.data;
        if(itemArr.data == null){
              wx.showModal({
                title: '提示',
                content: '暂无此股票信息',
                showCancel: false,
                confirmText: '退出',
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
        console.log(codes.Time);
        // 算出预测日期
        codes.Time=new Date(codes.Time);

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
          imageUrl: "https://www.szu522.cn:50003/" + codes.Code + ".png",
          codes:codes,
          days: days
        })
      }
    });

    that.changebutton(id,code);
  }*/
})
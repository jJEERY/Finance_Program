const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagejump: true,
    chosen: [],
    popErrorMsg: '',
    Code: []
  },

  /* 点击搜索框 */
  touch_search: function (e) {
    wx.navigateTo({
      url: '../welcome/welcome',
    })
  },
  
  /* 选择top20的股票 */
  touch_choose: function (e){
    if (this.data.pagejump){
      var id = e.currentTarget.dataset.select;

      wx.setStorageSync('code', id);
      wx.navigateTo({
        url: '../get/get',
      })
    }
    this.setData({ pagejump: true });
  },
  
  /* 添加或取消用户自选股 */
  self_option: function(e) {

    var userId = app.useropenID;
    //点击+自选按钮后页面不跳转
    this.setData({
      pagejump: false
    });
    var that = this;
    var code = e.target.id;
    var Code = this.data.Code;
    var index = -1;
    //循环判断目标id在top20中的下标
    for(var i = 0; i < Code.length; i ++) {
      if(code == Code[i].code) {
        index = i;
        break;
      }
    }
    //标记为-1说明目标不在top20中，提示错误信息
    if(index == -1) {
      wx.showToast({
        title: '选择目标错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //获得原先记录是否为用户自选股的布尔值集合
    var chosens = this.data.chosen;
    //获得下标后通过chosen的布尔值判断是添加自选还是取消自选
    if(chosens[i]) {
      //取消自选
      wx.request({
        url: 'http://localhost:9090/deleteStock',
        data: {
          userId: userId,
          code: code
        },
        method: 'GET',
        success: function(res) {
          //对java返回值进行判断，是否成功操作数据库
          var result = res.data.result;
          if(result == "取消自选成功") {
            wx.showToast({
              title: result,
            });
            //成功操作后，需要修改页面上的信息
            Code[i].chosen = '+加自选';
            chosens[i] = false;
            //将值提交到公共值中
            that.setData({
              Code: Code,
              chosen: chosens
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
        fail: function() {
          wx.showToast({
            title: '连接服务器超时...',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      //加自选需要获得股票的名称
      var name = Code[i].name;
      //加自选
      wx.request({
        url: 'http://localhost:9090/addStock',
        data: {
          userId: userId,
          code: code,
          name: name
        },
        method: 'GET',
        success: function(res) {
          var result = res.data.result;
          //添加自选股成功
          if (result == "添加自选成功") {
            wx.showToast({
              title: result,
            });
            //选择成功后需要修改页面上的信息
            Code[i].chosen = '已选中';
            chosens[i] = true;
            //将修改后的结果提交到公共值中
            that.setData({
              Code: Code,
              chosen: chosens
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
        fail: function() {
          //连接java服务器失败
          wx.showToast({
            title: '连接服务器超时...',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userID = '';

    if (app.useropenID && app.useropenID != ''){
      userID = app.useropenID;
      this.getCodemessge(userID);
    } else {
      app.useropenIDCallback = useropenID =>{
        if (useropenID != ''){
          userID = app.useropenID;
          this.getCodemessge(userID);
        }
      }
    }
  },

  /* 获取前20的股票数据 */
  getCodemessge: function(id) {
    var that = this;
    var userId = app.useropenID;
    wx.request({
      url: 'http://localhost:9090/getStockTop20',
      data: {
        userId: userId
      },
      method: 'GET',
      success: function(res) {
        var itemArr = res.data;
        var Code = [];
        for (var i = 0; i < itemArr.length; i++) {
          if (itemArr[i].chosen) {
            Code[i] = { code: itemArr[i].code, name: itemArr[i].name, chosen: '已选中' };
            that.data.chosen[i] = true;
          }
          else {
            Code[i] = { code: itemArr[i].code, name: itemArr[i].name, chosen: '+加自选' };
            that.data.chosen[i] = false;
          }
        }

        // console.log(Code);
        that.setData({
          Code: Code
        });
      },
      fail: function() {
        wx.showToast({
          title: '失败，请重试!',
          icon: 'none',
          duration: 2000
        })
      }
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
    this.onLoad();
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
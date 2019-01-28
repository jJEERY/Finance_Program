const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagejump: true,
    Code: []
  },

  /* 处理选中的股票 */
  touch_choose: function (e) {
    if (this.data.pagejump) {
      var id = e.currentTarget.dataset.select;
      wx.setStorageSync('code', id);
      wx.navigateTo({
        url: '../get/get',
      })
    }
    this.setData({ pagejump: true });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = app.useropenID;
    var that = this;
    //连接服务器获取自选股列表
    wx.request({
      url: 'http://localhost:9090/getStockById',
      data: {
        userId: userId
      },
      method: 'GET',
      //连接服务器成功
      success: function(res) {
        var itemArr = res.data;

        var Code = [];
        //判断返回信息是否为空
        if(itemArr != null) {
          //将获得的自选股信息填到Code中
          for(var i = 0; i < itemArr.length; i ++) {
            Code[i] = {
              code : itemArr[i].code,
              name : itemArr[i].name
            };
          }
          that.setData({
            Code: Code
          });
        } else {
          //当java获取数据库信息失败时的错误提示信息
          wx.showToast({
            title: '获取自选股信息失败',
            icon: 'none',
            duration: 2000
          });
          return;
        }
      },
      //连接服务器失败的错误提示
      fail: function() {
        wx.showToast({
          title: '连接服务器超时...',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    })
  },

  /**
   * 在自选股处取消自选股
   */
  delete_option: function(e) {
    //点击取消自选否定页面跳转
    this.setData({
      pagejump: false
    });
    var that = this;
    var userId = app.useropenID;
    //当前选中的股票
    var code = e.target.id;
    //自选股列表
    var Code = this.data.Code;
    var index = -1;
    for(var i = 0; i < Code.length; i ++) {
      if(code == Code[i].code) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      wx.showToast({
        title: '选择目标错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //用户自选股页面只有取消自选股请求
    wx.request({
      url: 'http://localhost:9090/deleteStock',
      data: {
        userId: userId,
        code: code
      },
      method: 'GET',
      //连接成功
      success: function(res) {
        //对java返回值进行判断，是否成功操作数据库
        var result = res.data.result;
        if (result == "取消自选成功") {
          wx.showToast({
            title: result,
          });
          //1、直接刷新页面重新获取自选股列表
          that.onLoad();
          //2、直接删除Code中的某一项,然后将值提交到公共值中
          Code.splice(i, 1);
          //将值提交到公共值中
          that.setData({
            Code: Code,
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
      //连接服务器失败
      fail: function() {
        wx.showToast({
          title: '连接服务器超时...',
          icon: 'none',
          duration: 2000
        });
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
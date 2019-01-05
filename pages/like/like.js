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
    var id = app.useropenID;
    id = '"'+id+'"';
    var that = this;

    wx.request({
      url: 'https://www.szu522.cn:50003/selectstock.php' ,
      data: {
        openid: id
      },
      dataType: 'json',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var itemArr = res.data;

        var Code = [];
        for (var i = 0; (itemArr.data != null) && (i < itemArr.data.length); i++)
          Code[i] = { code: itemArr.data[i].code, name: itemArr.data[i].name };

        that.setData({
          Code: Code
        })
      }
    });
  },

  /**
   * 在自选股处取消自选股
   */
  delete_option:function (e) {
    this.setData({ pagejump: false });
    var that = this;
    var id = e.target.id;
    var choose = this.data.Code;

    var code = '"' + e.target.id + '"';
    var openid = '"' + app.useropenID + '"';
    var index = -1;
    for (var i = 0; i < choose.length; i++) {
      if (id == choose[i].code) {
        index = i;
        break;
      }
    }
    if(index == -1) {
      return;
    }
    wx.request({
      url: 'https://www.szu522.cn:50003/addstock.php',
      data: {
        openid: openid,
        code: code
      },
      dataType: 'json',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (result.resultCode == 200) {
          wx.showToast({
            title: result.desc,
          })
        } else {
          // 输出错误提示
          that.setData({
            popErrorMsg: result.desc
          });
          that.fadeOut();
        }
        that.setData({
          Code: that.data.Code
        })
        that.onLoad();
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
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /* 处理选中的股票 */
  touch_choose: function (e) {
    var id = e.currentTarget.dataset.select;

    wx.setStorageSync('code', id);
    wx.navigateTo({
      url: '../get/get',
    })
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
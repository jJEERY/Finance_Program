const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagejump: true,
    chosen: []
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

  /* 选择添加自选股票或者取消自选 */
  self_option: function(e){
    this.setData({ pagejump: false });

    var that = this;
    var id = e.target.id;
    var choose = this.data.Code;

    var code = '"' + e.target.id + '"';
    var openid = '"' + app.useropenID + '"';

    var index = -1;
    for (var i = 0; i < choose.length;i++)
      if (id == choose[i].code){
        index = i;
        break;
      }

    if(index == -1){
      return ;
    }
    console.log(index);

    /* 获取自选股里面的内容并比较 */
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
        console.log("修改成功！");
        if (that.data.chosen[i]) {
          that.data.Code[i].chosen = '+加自选';
          that.data.chosen[i] = false;
        }
        else {
          that.data.Code[i].chosen = '已选择';
          that.data.chosen[i] = true;
        }

        that.onLoad();

        console.log(code);
        console.log(openid);
        console.log(that.data.Code);
        console.log(that.data.chosen);
      }
    });
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
    var openid = '"' + app.useropenID + '"';

    wx.request({
      url: 'https://www.szu522.cn:50003/homepage.php',
      data: {
        openid: openid
      },
      dataType: 'json',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var itemArr = res.data;
        console.log(itemArr);
        
        var Code = [];
        for (var i = 0; i < itemArr.data.length; i++) {
          if (itemArr.data[i].chosen) {
            Code[i] = { code: itemArr.data[i].code, name: itemArr.data[i].name, chosen: '已选中' };
            that.data.chosen[i] = true ;
          } 
          else {
            Code[i] = { code: itemArr.data[i].code, name: itemArr.data[i].name, chosen: '+加自选' };
            that.data.chosen[i] = false ;
          }
        }

        console.log(Code);
        that.setData({
          Code: Code
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
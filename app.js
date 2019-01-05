App({
  globalData:{
    useropenID: '',
    Code:[],
  },
  data:{},

  onLaunch:function(){
    var that=this;
    wx.login({
      success:function(res){
        if (res.code){
          wx.request({
            url: 'https://www.szu522.cn:50003/openid.php',
            data:{
              code:res.code
            },
            dataType: 'json', 
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },

            success: function (res) {
              that.useropenID = res.data;

              //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.useropenIDCallback) {
                that.useropenIDCallback(res.data);
              }
            }
          })
        }else{
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})
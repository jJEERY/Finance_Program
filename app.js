App({

  globalData:{
    useropenID: '',
    Code:[],
  },
  data: {
    appId: 'wxd82f4a9a8c8b7d64',
    secret: 'fb0c1d510d45955970aca9b8bae72449',
    url: 'https://api.weixin.qq.com/sns/jscode2session'
  },
  onLaunch: function() {
    var that = this;
    var user = {};
    var userInfo = {};
    wx.login({
      success:function(res) {
        if(res.code) {
          wx.getUserInfo({
            success: function(res) {
              var objz = {};
              objz.avatarUrl = res.userInfo.avatarUrl;
              objz.nickName = res.userInfo.nickName;
              wx.setStorageSync('userInfo', objz);
            }
          });
          var data = that.data;
          var url = data.url + '?appid=' + data.appId +'&secret=' + data.secret + '&js_code=' + res.code + '&grant_type=authorization_code'; 
          wx.request({
            url: url,
            data: {},
            method: 'GET',
            success: function(res) {
              that.useropenID = res.data.openid;
              console.log(that.useropenID)
              //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.useropenIDCallback) {
                that.useropenIDCallback(res.data);
              }
            }
          });
        } else {
          wx.showToast({
            title: '登录失败:' + res.errMsg,
            icon: 'none'
          })
          console.log('登录失败:' + res.errMsg);
        }
      } 
    })
  }
  /*onLaunch:function(){
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
  },*/
})
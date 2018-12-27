App({
  data:{},
  onLaunch:function(){
    var that=this;
    wx.login({
      success:function(res){
        if (res.code){
          console.log(res.code)         
          wx.request({
            url: 'https://www.szu522.cn:50003/openid.php',
            data:{
            code:res.code
            },
            dataType: 'json'
            , 
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.data.openid = res.data;
              console.log(that.data)
            }
          })
        }else{
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})
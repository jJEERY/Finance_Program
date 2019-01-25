const app = getApp();
Page({

  /* 页面的初始数据 */
  data: {
    newinput : false,
    userinput : '',
    title_tips :'',
    Code: [],
  },

  /* 回到顶部按钮 */
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  /* 上下滑动显示或取消回到顶部按钮 */
  scroll: function (e, res) {
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      })
    }
  },

  /* 输入数字查找股票 */
  CheckByNum: function (code) {
    var flag = true;
    var showcode = [];
    var count = 0;

    for (var i = 0; i < this.data.Code.length; i++) {
      var data = this.data.Code[i].code;
      for (var j = 0; j < code.length; j++)
        if (data[j] != code[j]) {
          flag = false; break; //与输入字符串不匹配
        }

      // 判断是否与输入字符串匹配
      if (flag)
        showcode[count++] = this.data.Code[i];
      flag = true;
    }
    
    return showcode;
  },

  /* 输入首字母查找股票 */
  CheckByLetter: function (letter) {
    var count = 0;
    var showcode = [];
    var flag = true;

    for (var i = 0; i < this.data.Code.length; i++) {
      var data = this.data.Code[i].letter;
      for (var j = 0; j < letter.length; j++) {
        if (data[j] != letter[j]) {
          flag = false; break; //与输入字符串不匹配
        }
      }
      // 判断是否与输入字符串匹配
      if (flag)
        showcode[count++] = this.data.Code[i];
      flag = true;
    }

     return showcode;
  },

  /* 输入名字查找股票 */
  CheckByName: function (name) {
    var count = 0;
    var showcode = [];
    var flag = true;

    for (var i = 0; i < this.data.Code.length; i++) {
      var data = this.data.Code[i].name;

      var k=0;
      for (var j = 0; j < name.length; j++){
        if (data[k]==' ') {k++;j--;continue;}
        if (data[k++] != name[j]) {
          flag = false; break; //与输入字符串不匹配
        }
      }

      // 判断是否与输入字符串匹配
      if (flag)
        showcode[count++] = this.data.Code[i];
      flag = true;
    }

    return showcode;
  },

  /* 输入框内容变化显示不同可选股票 */
  inputCode: function (e) {
    var tmp_code = e.detail.value;
    var reg = new RegExp('[0-9]');
    var showcode = [];

    // 显示所有内容
    if (tmp_code.length == 0){
      this.newinput = false;
      this.setData({ title_tips: '搜索结果' });
      this.setData({
        showcode: showcode
      })
      return;
    }
    else
      this.setData({ title_tips: '搜索结果' });

    if (reg.test(tmp_code)){
      showcode = this.CheckByNum(tmp_code);
    }
    else{
      showcode = this.CheckByLetter(tmp_code.toUpperCase()).concat(this.CheckByName(tmp_code));

      for (var i = 0; i < showcode.length && showcode.length <= 20;i++)
        for (var j = i + 1; j < showcode.length;j++)
          if (showcode[i] == showcode[j])
            showcode.splice(j,1);
    }

    this.setData({
      showcode: showcode
    })
  },

  /* 清空输入框内容 */
  clearinput: function () {
    this.setData({
      userinput : '',
      code: '',
      title_tips: '搜索结果',
      showcode: []
    })

    this.newinput = false;
  },

  /* 点击股票展示结果 */
  touch_choose: function (e){
    var id = e.currentTarget.dataset.select;

    wx.setStorageSync('code', id);
    wx.navigateTo({
      url: '../get/get',
    })
  },

  //输出当前时间
  formattime: function formattime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(this.formatnumber).join('/') + ' ' + [hour, minute, second].map(this.formatnumber).join(':')
  },
  formatnumber:function formatnumber(n) {  
    n = n.toString()  
    return n[1] ? n : '0' + n
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that=this;
    var welcome_test = {
      input_place: "  请输入代码 / 名称 / 首字母 ",
      title_tips: '搜索结果'
    }
    this.setData(welcome_test);
    var nowCode = app.Code;
    this.setData({
      Code: nowCode,
    });
  },
  onUnload: function (){
    wx.reLaunch({
      url: '../homepage/homepage',
    })
  }
})
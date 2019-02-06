//app.js
App({

  //监听小程序初始化，当小程序初始化完成时会触发发，且全局只触发一次
  onLaunch: function() {
    this.getUserInfo()
    var that=this;
    wx.login({
      success: function (loginCode) {
        wx.request({
          url:  'https://bbq.uhaan.net/biaob/login?code=' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data,'app-openid')
           that.globalData.openid=res.data
          }
        })
      }
    })
  },
  //用户自定义的全局数据，可以通过var app = getApp()获取app实例，再通过app.globalData.userInfo获取数据
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          console.log(res.userInfo,'app-userinfo')
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  
  globalData: {
    userInfo: null,
    openid:''
  }
})

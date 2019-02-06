var app = getApp();
const API_URL = 'https://bbq.uhaan.net/biaob/';
Page({
  data: {
    userInfo: {},
    openid: app.globalData.openid,
    hasUserInfo:false
  },
  
  txtMore:function(){
    var that = this;
    var openid = that.data.openid;
    if(openid != null){
        wx.switchTab({
          url: '../index/index',
        })
    }else{
      console.log('尚未登录');
    }
  },

  onLoad: function () {
    var that = this;
      wx.login({
        success: function (loginCode) {
          wx.request({
            url: API_URL + 'GetOpenid/code/' + loginCode.code,
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res)
              that.setData({
                openid: res.data,
                userInfo: wx.getStorageSync('userInfo')
              })
            }
          })
        }
      })
  
 
  }
})
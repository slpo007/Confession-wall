var url = "https://bbq.uhaan.net/biaob/";
var app=getApp()
var page = 0;
var page_size = 5; 
var GetList = function (that) {
  that.setData({
    hidden: false
  });
  wx.showNavigationBarLoading();
  wx.request({
    url: url + 'index/',
    data: {
      page: page,
      page_size: page_size
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
     
      var whdthNum = res.data;
      if (whdthNum == 0) {
        that.setData({
          ShdthNum: whdthNum
        });
      }
      if(res.data != 0){
        var listData = wx.getStorageSync('infoList') || []
        for (var i = 0; i < res.data.length; i++) {
          listData.push(res.data[i]);
        }
        wx.setStorageSync('infoList', listData)
        setTimeout(function () {
          that.setData({
            infoList: listData
          });
        }, 800)
      
        setTimeout(function () {
          that.setData({
            hidden: true
          });
        }, 2000);
        
      }else{
        that.setData({
          hidden: true,
          display: false
        });
      }
    
    },
    complete: function () {
      wx.hideNavigationBarLoading(); 
      wx.stopPullDownRefresh();
    }
  })
}

// -------------------------------
Page({
  data: {
    picUrl: "https://bbq.uhaan.net/",
    infoList:[],
    hidden: true,
    display: true,
    ShdthNum: 1,
    hasUserInfo:false
  },
  onLoad: function () {
    var that = this;

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
             console.log(res,'already')
             that.setData({
               hasUserInfo:true
             })
            }
          });
        }
      }
    })
    //-----------
    try {
      wx.removeStorageSync('infoList')
    } catch (e) {
    }
  },
  onShow: function () {
    this.onLoad()
    var that = this;
    var ShdthNum = that.data.ShdthNum;
    if (ShdthNum == 1) {
      
      GetList(that);
    }else{
      setTimeout(function () {
        try {
          var value = wx.getStorageSync('infoList')
          if (value) {
            that.setData({
              infoList: value,
            })
          }
        } catch (e) {
          console.log('error');
        }
      }, 1000) 
    }
  },
  getUserInfo: function (res) {
    if(res.detail.userInfo){
    
      var that = this;
      that.setData({
        hasUserInfo: true
      })
      wx.setStorageSync('userInfo', res.detail.userInfo);
      // 回传
      wx.request({
        url: url + 'register/',
        method:'post',
        data: {
          openid: app.globalData.openid,
          data: JSON.stringify(res.detail.userInfo)
        },
        header: {

          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res,'return')
        },
        complete: function () {
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
      })
    }else{
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
           
          }
        }
      })
     
    }
    
   
  
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    console.log(1)
    page = 0;
    this.setData({
      display: true,
      infoList: []
    })
    wx.removeStorageSync('infoList')
  
    GetList(this)
  },
  onReachBottom: function () {
    var that = this;
    setTimeout(function () {
      GetList(that)
    }, 1000)
  },

  onShareAppMessage: function () {
    var that = this;
    var picUrl = that.data.picUrl;
    return {
      title: '对自己喜欢的人表白【太原】',
      path: '/pages/index/index'
    }
  }
})

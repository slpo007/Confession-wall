var bmap = require('../../utils/bmap-wx.js');
var app=getApp();
const API_URL = 'https://bbq.uhaan.net/biaob/';
var wxMarkerData = [];  
Page({
  data: {
    ak:"uUD6Yefm3I5VETmL6Rsk8VwBDGqOpgBt",
    markers: [],    
    longitude:'',      
    latitude:'',        
    address:'获取中...',    
    openid: app.globalData.openid,
    imglist: [],
    item: '../../image/upic.png',
    loading: false,
    disabled: false,
    loadingHide: true,
    loadingText: "位置获取中",
    content:''
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  formSubmit: function (e) {
    console.log(e,'tj')
    var that = this;
    var imglist = that.data.imglist;
    var formData = e.detail.value;
    console.log(formData,'formatade')
    var content = e.detail.value.content;
    var openid = app.globalData.openid;
    console.log(openid,'addddd')
    if (content.length === 0){
      wx.showToast({
        title: '内容不能为空',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.showToast({
        title: '请稍后',
        icon: 'loading',
        duration: 4000
      })
      wx.request({
        url: API_URL + 'addData/openid/' + app.globalData.openid,
        data: formData,
        header: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
            var aid = res.data;
            if (imglist != '') {
              for (var i = 0; i < imglist.length; i++) {
                wx.uploadFile({
                  url: API_URL + 'upload/pid/' + aid,
                  filePath: imglist[0],
                  name: 'files',
                  formData: {
                    'pid': aid
                  },
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function (res) {
                    if (i >= imglist.length) {
                      wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 3000
                      })
                      that.setData({
                        imglist: [],
                        loading: true,
                        disabled: true
                      })
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }, 2000) 
                    }
                  }
                })
              }
             
          }else {
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 3000
              })
              that.setData({
                loading: true,
                disabled: true
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000) 
          }
        }
      })
    }
  }, 

  upsUid: function(e){
    var openid = app.globalData.openid;
   
    wx.request({
      url: API_URL + 'seachUser/openid/' + openid,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res,'mobil-res')
        if(res.data != 0){
          wx.navigateTo({
            url: '../mobile/mobile',
          })
        }
      }
    })
  },

  onLoad:function(){
    this.getBaiduMap(); 
  },

  onShow: function(){
    var that = this;
    that.setData({
      disabled: false,
      loading: false,
      content:''
    })
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: API_URL + 'GetOpenid/code/' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) { 
            console.log(res,'add')
            that.upsUid(res);
            that.setData({
              openid: res.data
            })
          }
        })
      }
    })
    
  },

  checkimg: function () {
    self = this
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        self.setData({
          imglist: tempFilePaths
        })
      }
    })
  },

  clearGps: function(){
    this.getBaiduMap();
  }, 
  getBaiduMap: function (){     
    var that = this;    
    that.setData({ loadingHide: false });
    var BMap = new bmap.BMapWX({     
        ak: that.data.ak     
    });    
    var fail = function(data) { 
        var errMsg = data.errMsg;
        if(errMsg == 'getLocation:fail auth deny'){
          that.setData({  
            latitude: 0,    
            longitude: 0,
            address:'火星网友一枚'
          })
        }else{
          that.setData({
            latitude: 0,    
            longitude: 0,
            address:'火星网友一枚'
          })
        }
        setTimeout(function () {
          that.setData({ loadingHide: true });
        }, 1000)  
    };     
    var success = function(data) {  
        wxMarkerData = data.wxMarkerData;
        that.setData({     
            markers: wxMarkerData,    
            latitude: wxMarkerData[0].latitude,    
            longitude: wxMarkerData[0].longitude,    
            address: wxMarkerData[0].address,    
        }); 
        setTimeout(function () {
          that.setData({ loadingHide: true });
        }, 1000)     
    };  
    BMap.regeocoding({     
        fail: fail,     
        success: success
    }); 
  }

})
// pages/init/init.js
Page({
  /**		
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!getApp().isLoaded()) {
      wx.cloud.callFunction({
        name: 'register',
        data: {
          type: 'onload',
          // type: 'update',
          // data: {
          //   _id: "c0ca0aed61bec682011f133a55eb456c",
          //   nothing: 'fuckyou'
          // },
        },
        success: function(res) {
          console.log(res.result.message)
          var userData = res.result.data;
          console.log(res.result.data);
          getApp().fillUser(userData);
          wx.switchTab({
            url: '/pages/now/now',
          })
        },
        fail: function() {
          wx.showModal({
            title: "网络状态不佳",
            content: '小程序需要网络才能使用，请检查网络后重试！'
          })
        }
      })
    } else {
      wx.switchTab({
        url: '/pages/now/now',
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
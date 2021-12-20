import * as DateUtil from "../../utils/date";

// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    _popup_show: false,
  },
  addTagClicked: function(e) {
    this.setData({
      _popup_show: true,
    })
  },
  onClose: function(e) {
    this.setData({
      _popup_show: false,
    })
  },
  newtagtimes(event) {
    this.setData({
      result: event.detail,
    });
  },
  loc2: function(e) {
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
      },
      fail: function(e) {
        console.log(e)
        wx.showModal({
          title: "错误",
          content: '请确定您打开了定位权限且点击了绿色的完成按钮',
          showCancel: false,
          success: function(res) {}
        })
      }
    })
  },
  loc1: function(e) {
    wx.getLocation({
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
        wx.showModal({
          title: "错误",
          content: '需要定位进行信息聚合，请确定您打开了定位权限',
          showCancel: false,
          success: function(res) {}
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTabBar().init();

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

  },
  fucktest: function() {
    console.log(DateUtil.dateToViewString(new Date()));
  }
})
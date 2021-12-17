// pages/entrydetail/entrydetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    entry: {
      iid: 'abcdefg-test-iid-no-unique',
      pid: 'abc-test-no-unique',
      title: 'XXXXXXXXX',
      tag: 'XX',
      duedate: 'XXXX-XX-XX',
      triggerdate: 'XXXX-XX-XX',
      done: false,
      viewdata: {
        datestr: 'XXXX-XX-XX',
        outofdate: true,
        waiting: true,
        projectname: 'XXXXX',
      },
    },
  },
  go: function(e) {
    wx.switchTab({
      url: '/pages/now/now',
    })
  },
  check: function(e) {
    console.log(e);
    this.data.entry.done = !this.data.entry.done;
    this.setData({
      entry: this.data.entry,
    })
  },

  click: function(e) {
    console.log(e);
    this.data.entry.viewdata.outofdate = !this.data.entry.viewdata.outofdate;
    this.data.entry.viewdata.datestr = 'XXXXX?'
    this.setData({
      entry: this.data.entry,
    })
  },
  edittitle: function(e) {
    this.setData({
      _title_focus: !this.data._title_focus,
    })
  },
  showcalendar: function(e) {
    this.setData({
      _show_calendar: true,
    })
  },
  closecalendar: function(e) {
    this.setData({
      _show_calendar: false,
    })
  },
  confirmcalendar: function(e) {
    this.setData({
      _show_calendar: false,
      calendar_date: new Date(e.detail),
    });
    console.log(this.data.calendar_date);
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
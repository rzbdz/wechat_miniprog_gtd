// pages/ddldetail/ddldetail.js
const { TodoData } = require('../../utils/tododata')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _title_focus: false,
    _show_calendar: false,
    calendar_date: {},
    project: TodoData.createProject("", '2021-12-31'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    this.data.project.updateView((a) => null);
    this.setData({
      project: this.data.project,
    })
    console.log('after update: ', this.data.project);
    console.log(option.query)
    const eventChannel = this.getOpenerEventChannel()
    console.log(eventChannel);
    if (!eventChannel.length) return;
    eventChannel.emit('acceptDataFromOpenedPage', { data: 'testsaaa' });
    eventChannel.emit('someEvent', { data: 'testbdfd' });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log('in new', data)
    })
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

  },
  distance: function(lat1,
    lat2, lon1, lon2) {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return (c * r);
  },
  clk: function(e) {
    console.log(e);
    wx.chooseLocation().then(res => {
      console.log(res);
      return new Promise(resolve => {
        resolve(res);
      })
    }).then(res1 => {
      wx.chooseLocation().then(res2 => {
        console.log(res2);
        console.log(this.distance(res1.latitude, res2.latitude, res1.longitude, res2.longitude));
      })
    });
    console.log();
  },
  go: function(e) {
    wx.switchTab({
      url: '/pages/now/now',
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
  }
})
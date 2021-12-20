//const { TodoData } = require("../utils/tododata");
//const { DateUtil } = require("../utils/date");

const { TodoData, DateUtil, UserData } = require('../utils/myutils');
// pages/testpage.js
Page({
  state: {
    isOk: false,
  },
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    p: {},
    e1: {},
    e2: {},
    e2: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.p = new TodoData.Project('AAAA', '2022-1-1', []);
    TodoData.initProjectView(e => null, this.data.p);
    this.setData({
      p: this.data.p,
    })
  },
  delete: function(e) {
    console.log('longtab',e)
    wx.showModal({
      cancelColor: 'green',
      confirmColor: 'red',
      title: "do you want fuck?",
      content: 'fuck you',
      cancelText: 'No',
      confirmText: 'Delete',
    })
  },
  e1clicked: function(e) {
    console.log(e);
    e.detail
  },
  e1checked: function(e) {
    console.log(e);
  },

  testCloudProjectUp: function(e) {
    console.log('upload');
  },
  testCloudProjectDown: function(e) {
    console.log('down');
    var _this = this;
    wx.cloud.callFunction({
      name: 'register',
      success: function(res) {
        console.log(res.result.message)
        _this.data.user = res.result.data;
        _this.state.isOk = true;
        console.log(res.result.data);
      },
      fail: console.error
    })
  },

  testCustom1: function(e) {
    console.log('cus1');
    this.data.e1 = new TodoData.Sub(this.data.p.pid, 'meee', '2021-12-1', new Date());
    this.data.e2 = new TodoData.Sub(this.data.p.pid, 'caca', '2021-12-1', new Date());
    TodoData.addPrereqState(this.data.e2, this.data.e1);
    TodoData.initSubView(e => this.data.p, e => this.data.e1, this.data.e1);
    TodoData.initSubView(e => this.data.p, e => this.data.e1, this.data.e2);
    TodoData.addSub(this.data.p, this.data.e1.iid);
    TodoData.addSub(this.data.p, this.data.e2.iid);
    var e1iid = this.data.e1.iid;
    var e2iid = this.data.e2.iid;
    var _this = this;
    var map = {
      [e1iid]: _this.data.e1,
      [e2iid]: _this.data.e2
    }
    var sm = function(iid) {
      return map[iid]
    }
    TodoData.updateProjectView(sm, this.data.p);
    this.setData({
      p: this.data.p,
      e1: this.data.e1,
      e2: this.data.e2,
    })
  },
  toprojectdetail: function(e) {
    console.log(e, 'clicked', 'go!');
    var _p = this.data.p;
    wx.navigateTo({
      url: '/pages/ddldetail/ddldetail',
      events: {
        someEvent: function(data) {
          console.log('iam testpage', data)
        }
      },
      success: function(res) {
        res.eventChannel.emit('acceptData', { data: _p });
      }
    })
  },
  testCustom2: function(e) {
    console.log('cus2');
    var t = new TodoData.Tag('fuck', ['06', '15', '14'])
    var bb = TodoData.isTimeMatchTag(t);
    console.log('match tag: ', bb);
  },
  testCustom3: function(e) {
    console.log('cus3');

  },
  testCustom4: function(e) {
    console.log('cus4');

  },
  go: function() {
    wx.switchTab({
      url: 'now/now',
    })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  onShareAppMessage: function() {},

})
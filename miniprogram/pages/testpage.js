const { createProject, createSub } = require("../utils/tododata");

// pages/testpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: createProject('采矿', '2021-12-31', [], '1234'),
    e1: {},
    e2: {},
    e2: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.data.e1 = createSub("abc", '矿工入场', '2022-12-15', '2022-12-10', '人力');
    var i1 = this.data.e1.iid;
    this.data.e2 = createSub("abc", '运器械', '2022-12-15', '2022-12-10', '运输', [i1]);
    var i2 = this.data.e2.iid;
    this.data.e1.addSubscriber(i2);
    this.data.e3 = createSub("abc", '拉车', '2022-12-15', '2022-12-10', '运输', [i1]);
    var i3 = this.data.e3.iid;
    this.data.e1.addSubscriber(i3);
    var iidmap = {}
    iidmap[i1] = this.data.e1;
    iidmap[i2] = this.data.e2;
    iidmap[i3] = this.data.e3;
    this.data.p.subs = [i1, i2, i3];
    console.log(iidmap, iidmap[i1]);
    var submap = (iid) => { return iidmap[iid] };
    this.data.p.setPid('abc');
    this.data.p.updateView(submap);
    var projmap = (pid) => { return this.data.p };
    this.data.e1.updateView(projmap);
    this.data.e2.updateView(projmap);
    this.data.e3.updateView(projmap);
    this.setData({
      p: this.data.p,
      e1: this.data.e1,
      e2: this.data.e2,
      e3: this.data.e3,
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
  onShareAppMessage: function() {},


  testCloudProjectUp: function(e) {
    console.log('upload');
  },
  testCloudProjectDown: function(e) {
    console.log('down');
  },
  testCustom1: function(e) {
    console.log('cus1');

  },

  testCustom2: function(e) {
    console.log('cus2');

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
  }
})
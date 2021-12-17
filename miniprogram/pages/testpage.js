const { TodoData } = require("../utils/tododata");
const { DateUtil } = require("../utils/date");
// pages/testpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: TodoData.createProject('采矿', '2021-12-31', []),
    e1: {},
    e2: {},
    e2: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.e1 = TodoData.createSub("abc", '矿工入场', '2022-12-15', '2021-12-10', '人力');
    var i1 = this.data.e1.iid;
    this.data.e2 = TodoData.createSub("abc", '运器械', '2021-12-17', '2021-12-10', '运输', [i1]);
    var i2 = this.data.e2.iid;
    this.data.e1.addSubscriber(i2);
    this.data.e3 = TodoData.createSub("abc", '拉车', '2021-12-15', '2021-12-10', '运输', [i1]);
    var i3 = this.data.e3.iid;
    this.data.e1.addSubscriber(i3);
    var iidmap = {}
    iidmap[i1] = this.data.e1;
    iidmap[i2] = this.data.e2;
    iidmap[i3] = this.data.e3;
    this.data.p.subs = [i1, i2, i3];
    console.log(iidmap, iidmap[i1]);
    var submap = (iid) => { return iidmap[iid] };
    this.data.e1.doIt(submap);
    console.log('after doit');
    this.data.p.updateView(submap);
    var projmap = (pid) => { return this.data.p };
    this.data.e1.updateView(projmap);
    this.data.e2.updateView(projmap);
    console.log(this.data.e2.isWaiting());
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
  },

  testCustom1: function(e) {
    console.log('cus1');
    wx.cloud.callFunction({
      name: 'register',
      data: {

      },
      success: function(res) {
        //console.log(res, res.result, res.result.data);
        var p0 = res.result.data._projects[0];
        console.log(p0);
        // var pobj = TodoData.deserializeProject(p0);
        // https://stackoverflow.com/questions/70388410/construct-an-object-that-has-member-functions-from-an-object-that-has-no-member?noredirect=1#comment124425505_70388410
        var pobj = Object.create(new TodoData.Project(), Object.getOwnPropertyDescriptors(p0));
        pobj.updateView((a) => null);
        pobj.setPid('1122');
        console.log(p0);
        console.log(pobj);
      },
      fail: console.error,
    })
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
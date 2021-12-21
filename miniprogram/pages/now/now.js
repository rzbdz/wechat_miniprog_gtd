const { TodoData, DateUtil } = require("../../utils/myutils");

// pages/now/now.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  state: {
    cachedLocation: {},
  },
  data: {
    hour: 0,
    empty: false,
    lists: [
      { description: "超限", fold: false, list: [], showdone: false },
      { description: "位置", fold: false, list: [], showdone: false },
      { description: "时刻", fold: false, list: [], showdone: false },
      { description: "今天截至", fold: false, list: [], showdone: false },
      { description: "最近添加", fold: true, list: [], showdone: true },
    ]
  },
  foldExpand: function(e) {
    // console.log(e);
    let i = e.currentTarget.dataset.index
    // console.log(i);
    let b = !this.data.lists[i].fold;
    let temp = 'lists[' + i + '].fold';
    this.setData({
      [temp]: b,
    })
    // console.log(i + ', ' + this.data.lists[i].fold);
  },
  expirein: 0,
  locin: 1,
  timein: 2,
  duein: 3,
  recentin: 4,
  sortlilsts: function() {
    this.data.lists[0].list.sort((a, b) => a.date.localeCompare(b.date));
    this.data.lists[1].list.sort((a, b) => a.date.localeCompare(b.date));
    this.data.lists[2].list.sort((a, b) => a.date.localeCompare(b.date));
  },
  updateView: function() {
    var updatedata = {};
    updatedata['lists[' + this.expirein + '].list'] = app.getExpiredEList();
    updatedata['lists[' + this.timein + '].list'] = app.getTimeEList();
    updatedata['lists[' + this.recentin + '].list'] = app.getRecentAdd();
    updatedata['lists[' + this.duein + '].list'] = app.getTodayEList();
    updatedata['hour'] = DateUtil.getNowHour();
    if (this.state.cachedLocation) {
      updatedata['lists[' + this.locin + '].list'] = app.getLocationEList(this.state.cachedLocation);
    } else {
      updatedata['lists[' + this.locin + '].list'] = [];
    }
    this.setData(updatedata);
    console.log(updatedata, 'fuck the what?');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTabBar().init();
    var _this = this;
    if (app.isEmpty()) {
      this.setData({
        empty: true,
      })
    } else {
      this.setData({
        empty: false,
      })
    }
    this.updateView();
    if (!this.data.empty) {
      wx.getLocation({
        success(res) {
          _this.state.cachedLocation = new TodoData.Location(res.latitude, res.longitude, '定位数据没有名称');
          // console.log(loc);
          var updatedata = {};
          updatedata['lists[' + _this.locin + '].list'] = app.getLocationEList(_this.state.cachedLocation);
          _this.setData(updatedata);
        },
        fail() {
          wx.showModal({
            title: "提示",
            content: '请确定您打开了定位权限, 当前将启动无位置服务模式。',
            showCancel: false,
            success: function(res) {
              // console.log(res);
            }
          })
          var updatedata = {};
          updatedata['lists[' + _this.locin + '].list'] = [];
          _this.setData(updatedata);
        }
      })
    } else {
      var updatedata = {};
      updatedata['lists[' + _this.locin + '].list'] = [];
      _this.setData(updatedata);
    }
  },
  checkEntry: function(e) {
    // console.log(e.detail, "should be iid");
    if (e.detail.check) {
      TodoData.doneEntry(s => app.getEntry(s), app.getEntry(e.detail.iid));
    } else {
      TodoData.undoneEntry(s => app.getEntry(s), app.getEntry(e.detail.iid));
    }
    this.updateView();
  },
  cardClicked: function(e) {
    // console.log(e.detail, "should be iid");
    var _this = this;
    wx.navigateTo({
      url: '/pages/entrydetail/entrydetail?type=read&iid=' + e.detail,
      events: {
        fuckme: function(data) {
          // console.log('go back to me, check local: ', localObject);
        }
      },
      success: function(res) {}
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    app.uploadUser();
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
  entryclicked: function() {
    wx.navigateTo({
      url: '/pages/entrydetail/entrydetail',
    })
  },
  testbind: function(e) {
    // console.log(e)
  }
})
const { TodoData, DateUtil } = require("../../utils/myutils");
var app = getApp();
// pages/entrydetail/entrydetail.js
Page({
  state: {
    _which_calendar: '',
  },
  /**
   * 页面的初始数据
   */
  data: {
    _show_calendar: false,
    _pre_popup_show: false,
    _tag_popup_show: false,
    entry: null,
    prereq: {
      'ddd': {
        iid: 'ddd',
        title: '任务 A'
      },
      'dsaf': {
        iid: 'dsaf',
        title: '任务 B'
      } 
    },
    canPre: {
      'ddaaaaaadsd': {
        iid: 'dddsaasdfafdasfsfd',
        title: '任务 C'
      },
      'dsaadasff': {
        iid: 'dsaasdaaaaaadf',
        title: '任务 D'
      },
      'dddasdasd': {
        iid: 'dddaaaaaaaaaaasd',
        title: '任务 E'
      },
      'dsaafdaadf': {
        iid: 'dsaaaaaaaaadf',
        title: '任务 F'
      },
      'dddaaaaasd': {
        iid: 'dddsd',
        title: '任务 G'
      },
      'dsaadfaafdf': {
        iid: 'dsaadadfdsagadsbaf',
        title: '任务 H'
      }
    },
    taglist: [new TodoData.Tag('吃饭', ['06', '08', '12'], [new TodoData.Location(111, 11, '西安市长安区'), new TodoData
      .Location(11, 1101, '西安市雁塔区')
    ]), new TodoData.Tag('工地', ['10', '14', '20'], [new TodoData.Location(11, 10, '北京市'), new TodoData
      .Location(1101, 11, '北京市通州')
    ]), new TodoData.Tag('吃饭d', ['06', '08', '12'], [new TodoData.Location(111, 11, '西安市长安区'), new TodoData
      .Location(11, 1001, '西安市雁塔区')
    ])]
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
  preChange: function(e) {
    console.log(e);
    this.data.prereq[e.detail.value] = this.data.canPre[e.detail.value];
    console.log(this.data.canPre[e.detail.value]);
    delete this.data.canPre[e.detail.value];
    this.setData({
      _pre_popup_show: false,
      prereq: this.data.prereq,
    })
  },
  deletePrereqClicked: function(e) {
    var iid = e.currentTarget.dataset.iid;
    console.log(iid);
    this.data.canPre[iid] = this.data.prereq[iid];
    delete this.data.prereq[iid];
    this.setData({
      prereq: this.data.prereq,
    })
  },
  prePopupOnClose: function(e) {
    this.setData({
      _pre_popup_show: false,
    })
  },
  addPrereqClicked: function(e) {
    this.setData({
      _pre_popup_show: true,
      canPre: this.data.canPre,
    })
  },

  click: function(e) {
    console.log(e);
    this.data.entry.viewdata.outofdate = !this.data.entry.viewdata.outofdate;
    this.data.entry.viewdata.duedatestr = 'XXXXX?'
    this.setData({
      entry: this.data.entry,
    })
  },
  editTitleClick: function(e) {
    this.setData({
      _title_focus: !this.data._title_focus,
    })
  },
  showCalendar: function(e) {
    console.log(e.currentTarget.dataset);
    this.state._which_calendar = e.currentTarget.dataset.which;
    this.setData({
      _show_calendar: true,
    })
  },
  closeCalendar: function(e) {
    this.setData({
      _show_calendar: false,
    })
  },
  confirmCalendar: function(e) {
    var d = e.detail;
    console.log(d);
    this.data.entry[this.state._which_calendar] = d;
    TodoData.updateSubViewLocally(e => {}, this.data.entry);
    var _this = this;
    this.setData({
      entry: _this.data.entry,
      _show_calendar: false,
    });
    console.log(this.data.calendar_date);
  },
  tagPopupShow: function(e) {
    this.setData({
      _tag_popup_show: true,
    })
  },
  tagPopupOnClose: function(e) {
    this.setData({
      _tag_popup_show: false,
    })
  },
  tagChange: function(e) {
    console.log(e.detail);
    this.setData({
      _tag_popup_show: false,
      'entry.tag': e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.type == 'add') {
      const eventChannel = this.getOpenerEventChannel()
      console.log(eventChannel);
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      var _this = this;
      eventChannel.once('acceptData', function(data) {
        console.log('in new', data)
        data.localObject.there = 'fuckyou chenge!m;'
        console.log('in new', data.localObject);
      })
      eventChannel.emit('fuckme', { data: 'add page I am loaded!' });
      this.data.entry = new TodoData.Sub(options.pid);
      TodoData.updateSubViewProjectName((pid) => { return app.getProject(pid) }, this.data.entry);
      this.setData({ entry: this.data.entry });
    } else {

    }
  },
  titleChange: function(e) {
    console.log(e.detail.value);
    this.setData({
      "entry.title": e.detail.value,
    });
  },
  doneCheck: function(e) {
    console.log(e.detail);
    this.setData({
      "entry.done": e.detail.value,
    });
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
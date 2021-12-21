const { TodoData, DateUtil } = require("../../utils/myutils");
var app = getApp();
// pages/entrydetail/entrydetail.js
Page({
  state: {
    _which_calendar: '',
    _is_tag_loaded: false,
  },
  /**
   * 页面的初始数据
   */
  data: {
    _show_calendar: false,
    _pre_popup_show: false,
    _tag_popup_show: false,
    _ddlmindate: null,
    _triggermaxdate: null,
    entry: null,
    prereq: {},
    canPre: {},
    taglist: [],
  },
  go: function(e) {
    wx.switchTab({
      url: '/pages/now/now',
    })
  },
  check: function(e) {
    // console.log(e);
    this.data.entry.done = !this.data.entry.done;
    this.setData({
      entry: this.data.entry,
    })
  },
  preChange: function(e) {
    // console.log(e);
    this.data.prereq[e.detail.value] = this.data.canPre[e.detail.value];
    TodoData.addPrereqState(this.data.entry, app.getEntry(e.detail.value));
    // console.log(this.data.canPre[e.detail.value]);
    this.setData({
      _pre_popup_show: false,
      prereq: this.data.prereq,
    })
  },
  deletePrereqClicked: function(e) {
    var iid = e.currentTarget.dataset.iid;
    // console.log(iid);
    TodoData.removePrereq(this.data.entry, app.getEntry(iid));
    TodoData.updateSubWaiting((e) => app.getEntry(e), this.data.entry);
    delete this.data.prereq[iid];
    this.setData({
      prereq: this.data.prereq,
      "entry.viewdata.waiting": this.data.entry.viewdata.waiting,
    })
  },
  prePopupOnClose: function(e) {
    this.setData({
      _pre_popup_show: false,
    })
  },
  addPrereqClicked: function(e) {
    this.data.canPre = app.getCanAddPrereqList(this.data.entry.pid, this.data.entry.duedate);
    delete this.data.canPre[this.data.entry.iid];
    for (var piid in this.data.prereq) {
      delete this.data.canPre[piid];
    }
    // console.log(this.data.canPre, this.data.prereq);
    this.setData({
      _pre_popup_show: true,
      canPre: this.data.canPre,
    })
  },
  saveButtonClicked: function(e) {
    var newprereq = {}
    for (let piid in this.data.prereq) {
      newprereq[piid] = false;
    }
  },
  click: function(e) {
    // console.log(e);
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
    // console.log(e.currentTarget.dataset);
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
    // console.log(d);
    this.data.entry[this.state._which_calendar] = d;
    TodoData.updateSubViewLocally(e => app.getEntry(e), this.data.entry);
    var _this = this;
    this.setData({
      entry: _this.data.entry,
      _show_calendar: false,
      _ddlmindate: this.data.entry.triggerdate.getTime(),
      _triggermaxdate: this.data.entry.duedate.getTime(),
    });
    // console.log(this.data.calendar_date);
  },
  tagPopupShow: function(e) {
    if (!this.state._is_tag_loaded) {
      this.state._is_tag_loaded = true;
      this.setData({
        _tag_popup_show: true,
        taglist: app.getTagList(),
      })
    } else {
      this.setData({
        _tag_popup_show: true,
      })
    }
  },
  tagPopupOnClose: function(e) {
    this.setData({
      _tag_popup_show: false,
    })
  },
  tagChange: function(e) {
    // console.log(e.detail);
    app.decTagRefCnt(this.data.entry.tag);
    this.setData({
      _tag_popup_show: false,
      'entry.tag': e.detail.value,
    });
    app.incTagRefCnt(this.data.entry.tag);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    if (options.type == 'add') {
      const eventChannel = this.getOpenerEventChannel()
      // console.log(eventChannel);
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      var _this = this;
      eventChannel.once('acceptData', function(data) {
        // console.log('in new', data)
        data.localObject.there = 'fuckyou chenge!m;'
        // console.log('in new', data.localObject);
      })
      eventChannel.emit('fuckme', { data: 'add page I am loaded!' });
      // console.log(options.pid);
      this.data.entry = new TodoData.Sub(options.pid);
      app.updateEntry(this.data.entry.iid, this.data.entry);
      TodoData.updateSubViewProjectName((pid) => { return app.getProject(pid) }, this.data.entry);
      // console.log(this.data.canPre);
      this.setData({
        entry: this.data.entry,
        _ddlmindate: this.data.entry.triggerdate.getTime(),
        _triggermaxdate: this.data.entry.duedate.getTime(),
      });
      this.data.entry.title = '未命名任务';
    } else if (options.type == 'read') {
      // console.log(options.iid);
      this.data.entry = app.getEntry(options.iid)
      TodoData.initSubView((pid) => { return app.getProject(pid) }, (iid) => { return app.getEntry(iid) }, this
        .data.entry);
      var ppss = app.getPrereqList(options.iid);
      this.setData({
        entry: this.data.entry,
        prereq: ppss,
        _ddlmindate: this.data.entry.triggerdate.getTime(),
        _triggermaxdate: this.data.entry.duedate.getTime(),
      });
    }
  },
  titleChange: function(e) {
    // console.log(e.detail.value);
    this.setData({
      "entry.title": e.detail.value,
    });
  },
  doneCheck: function(e) {
    // console.log(e.detail);
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
    uploadUser();
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
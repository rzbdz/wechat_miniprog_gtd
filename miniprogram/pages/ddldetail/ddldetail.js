// pages/ddldetail/ddldetail.js
const { TodoData, DateUtil, UserData } = require('../../utils/myutils')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _title_focus: false,
    _show_calendar: false,
    _show_save: false,
    project: {},
    entriesofproject: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    // const eventChannel = this.getOpenerEventChannel()
    // console.log(eventChannel);
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // var _this = this;
    // arg = await eventChannel.once('acceptData', function(data) {
    //   console.log('in new', data)
    // })
    // eventChannel.emit('sendBack', { data: 'add page I am loaded!' });
    console.log(option.type);
    if (option.type === 'add') {
      this.setData({ project: new TodoData.Project() })
    } else if (option.type === 'read') {
      this.setData({
        project: app.getProject(option.pid),
        entriesofproject: app.getEntriesOfProject(option
          .pid)
      });
    }
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
  titleChange: function(e) {
    console.log(e.detail.value);
    var updatedata = {}
    updatedata['project.title'] = e.detail.value;
    updatedata['_show_save'] = true;
    this.setData(updatedata);
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
  saveButtonClick: function(e) {
    console.log('exit');
    app.updateProject(this.data.project.pid, this.data.project);
    const eventChannel = this.getOpenerEventChannel()
    console.log(eventChannel);
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    var _this = this;
    // arg = await eventChannel.once('acceptData', function(data) {
    //   console.log('in new', data)
    // })
    eventChannel.emit('sendBack', { type: 'added' });
    wx.switchTab({
      url: '/pages/deadline/deadline',
    })
  },
  editTtitleButtonClick: function(e) {
    this.setData({
      _title_focus: !this.data._title_focus,
    })
  },
  showCalendar: function(e) {
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
    var choosed = new Date(e.detail);
    this.data.project.duedate = choosed;
    var updatedata = TodoData.updateProjectDuedateSet('project', choosed);
    updatedata['_show_calendar'] = false;
    updatedata['_show_save'] = true;
    this.setData(updatedata);
    console.log(this.data.calendar_date);
  },
  addButtonClicked: function(e) {
    var _this = this;
    var localObject = { here: 'abc', there: 'cde' };
    wx.navigateTo({
      url: '/pages/entrydetail/entrydetail?type=add&pid=' + _this.data.project.pid,
      events: {
        sendBack: function(data) {
          console.log('i am in ddldetail, add button return', data)
          if (data.type == 'added') {
            console.log(app.getProjectList());
            _this.setData({
              entry: app.getEntriesOfProject(_this.data.project.pid)
            });
          }
        },
        fuckme: function(data) {
          console.log('go back to me, check local: ', localObject);
        }
      },
      success: function(res) {
        res.eventChannel.emit('acceptData', { type: 'add', localObject: localObject });
      }
    })
  },
})
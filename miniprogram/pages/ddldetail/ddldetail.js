// pages/ddldetail/ddldetail.js
const { TodoData, DateUtil, UserData } = require('../../utils/myutils')
import Notify from '../.././miniprogram_npm/@vant/weapp/notify/notify'
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  state: {
    changed: false,
    loaded: false,
  },
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
    this.data.loaded = true;
    // const eventChannel = this.getOpenerEventChannel()
    // console.log(eventChannel);
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // var _this = this;

    // arg = await eventChannel.once('acceptData', function(data) {
    //   console.log('in new', data)
    // })
    // eventChannel.emit('sendBack', { data: 'add page I am loaded!' });
    // console.log(option.type);
    if (option.type === 'add') {
      this.setData({ project: new TodoData.Project() })
      app.updateProject(this.data.project.pid, this.data.project);
    } else if (option.type === 'read') {
      var p = app.getProject(option.pid);
      TodoData.initProjectView((iid) => { return app.getEntry(iid) }, p);
      this.setData({
        project: p,
        entriesofproject: app.getEntriesOfProject(option
          .pid)
      });
    }
  },
  entryClicked: function(e) {
    // console.log(e.detail, "should be iid");
    var _this = this;
    var localObject = { here: 'abc', there: 'cde' };
    wx.navigateTo({
      url: '/pages/entrydetail/entrydetail?type=read&iid=' + e.detail,
      events: {
        sendBack: function(data) {
          // console.log('i am in ddldetail, add button return', data)
          if (data.type == 'added') {
            // console.log(app.getProjectList());
            _this.setData({
              entry: app.getEntriesOfProject(_this.data.project.pid)
            });
          }
        },
        fuckme: function(data) {
          // console.log('go back to me, check local: ', localObject);
        }
      },
      success: function(res) {
        res.eventChannel.emit('acceptData', { type: 'add', localObject: localObject });
      }
    })
  },
  entryChecked: function(e) {
    // console.log(e.detail, "should be iid");
    if (e.detail.check) {
      TodoData.doneEntry(s => app.getEntry(s), app.getEntry(e.detail.iid));
    } else {
      TodoData.undoneEntry(s => app.getEntry(s), app.getEntry(e.detail.iid));
    }
    var notice = false;
    if (this.data.project.done != this.data.project.total) {
      notice = true;
      // console.log('ready to hint')
    }
    TodoData.updateProjectView((iid) => app.getEntry(iid), this.data.project);
    this.setData({
      entriesofproject: this.data.entriesofproject,
      project: this.data.project
    })
    if (this.data.project.done == this.data.project.total && notice == true) {
      // console.log('hint')
      Notify({ type: 'success', message: '项目' + this.data.project.title + '已完成' });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  delete: function(e) {
    // console.log('user delete something', e.detail, " should be iid!");
    // console.log('longtab')
    var _this = this;
    wx.showModal({
      cancelColor: 'green',
      confirmColor: '#ab0005',
      title: "危险操作",
      content: '你要抹去这个任务的存在吗？如果任务存在依赖关系，将无法抹去。',
      cancelText: '不',
      confirmText: '尝试抹去',
      success(res) {
        if (res.confirm) {
          app.deleteEntry(e.detail);
          TodoData.updateProjectView((iid) => app.getEntry(iid), _this.data.project);
          _this.setData({
            project: _this.data.project,
            entriesofproject: app.getEntriesOfProject(_this.data.project.pid),
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    TodoData.updateProjectView((e) => app.getEntry(e), this.data.project);
    this.setData({
      entriesofproject: app.getEntriesOfProject(this.data.project
        .pid),
      project: this.data.project,
    });
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
    // console.log('exit');
    app.updateProject(this.data.project.pid, this.data.project);
    const eventChannel = this.getOpenerEventChannel()
    // console.log(eventChannel);
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    var _this = this;
    // arg = await eventChannel.once('acceptData', function(data) {
    //   console.log('in new', data)
    // })
    eventChannel.emit('sendBack', { type: 'added' });
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
  titleChange: function(e) {
    // console.log(e.detail.value);
    var updatedata = {}
    updatedata['project.title'] = e.detail.value;
    updatedata['_show_save'] = true;
    this.setData(updatedata);
  },
  clk: function(e) {
    // console.log(e);
    wx.chooseLocation().then(res => {
      // console.log(res);
      return new Promise(resolve => {
        resolve(res);
      })
    }).then(res1 => {
      wx.chooseLocation().then(res2 => {
        // console.log(res2);
        // console.log(this.distance(res1.latitude, res2.latitude, res1.longitude, res2.longitude));
      })
    });
    // console.log();
  },
  saveButtonClick: function(e) {
    // console.log('exit');
    app.updateProject(this.data.project.pid, this.data.project);
    const eventChannel = this.getOpenerEventChannel()
    // console.log(eventChannel);
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
    // console.log(this.data.calendar_date);
  },
  addButtonClicked: function(e) {
    var _this = this;
    var localObject = { here: 'abc', there: 'cde' };
    wx.navigateTo({
      url: '/pages/entrydetail/entrydetail?type=add&pid=' + _this.data.project.pid,
      events: {
        sendBack: function(data) {
          // console.log('i am in ddldetail, add button return', data)
          if (data.type == 'added') {
            // console.log(app.getProjectList());
            _this.setData({
              entry: app.getEntriesOfProject(_this.data.project.pid)
            });
          }
        },
        fuckme: function(data) {
          // console.log('go back to me, check local: ', localObject);
        }
      },
      success: function(res) {
        res.eventChannel.emit('acceptData', { type: 'add', localObject: localObject });
      }
    })
  },
})
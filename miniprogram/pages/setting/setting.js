import * as DateUtil from "../../utils/date";
import { TodoData } from "../../utils/myutils";
var app = getApp();
// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _checkbox_arr: [
      6, 8, 10, 12, 14, 16, 18, 20, 22, 0
    ],
    local_time: [],
    local_loca: [],
    is_two_loc: false,
    local_name: '',
    tags: {},
    _popup_show: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({ tags: app.getTagObj() })
  },

  addTagClicked: function(e) {
    this.setData({
      _popup_show: true,
    })
  },
  onClose: function(e) {
    // console.log('fuck');
    this.setData({
      _popup_show: false,
      is_two_loc: false,
      local_time: [],
      local_loca: [],
      local_name: ''
    })
    // console.log(this.data.local_name);
  },
  newtagtimes(event) {
    this.setData({
      local_time: event.detail,
    });
    // console.log('see what choose got:', event.detail);
  },
  locTap1: function(e) {
    var _this = this;
    wx.chooseLocation({
      success: function(res) {
        // console.log(res)
        _this.setData({
          "local_loca[0]": new TodoData.Location(res.latitude, res.longitude, res.address)
        })
      },
      fail: function(e) {
        // console.log(e)
        wx.showModal({
          title: "错误",
          content: '请确定您打开了定位权限且点击了绿色的完成按钮',
          showCancel: false,
          success: function(res) {
            // console.log(res);
          }
        })
      }
    })
  },
  locTap2: function(e) {
    var _this = this;
    if (this.data.local_loca.length < 1) {
      wx.showModal({
        title: "提示",
        content: '请先填充第一个地址！',
        showCancel: false,
        success: function(res) {
          // console.log(res);
        }
      })
      return;
    }
    wx.chooseLocation({
      success: function(res) {
        // console.log(res)
        _this.setData({
          "local_loca[1]": new TodoData.Location(res.latitude, res.longitude, res.address)
        })
      },
      fail: function(e) {
        // console.log(e)
        wx.showModal({
          title: "错误",
          content: '请确定您打开了定位权限且点击了绿色的完成按钮',
          showCancel: false,
          success: function(res) {
            // console.log(res);
          }
        })
      }
    })
  },
  enterNewName: function(e) {
    // console.log('new name', e.detail.value);
    this.data.local_name = e.detail.value;
  },
  addATag: function(e) {
    // console.log('new tag', e);
    if (this.data.local_name === '') {
      wx.showModal({
        title: "错误",
        content: '标签必须有名字',
        showCancel: false,
        success: function(res) {
          // console.log(res);
        }
      })
      return;
    }
    app.updateTag(new TodoData.Tag(this.data.local_name, this.data.local_time, this.data.local_loca));
    this.setData({
      tags: app.getTagObj(),
      _popup_show: false,
      is_two_loc: false,
      local_time: [],
      local_loca: [],
      local_name: ''
    })
  },
  deleteTag: function(e) {
    var _this = this;
    wx.showModal({
      title: "请确定删除",
      content: '你正在删除 Tag',
      showCancel: true,
      success: function(res) {
        if (res.cancel) {

        } else if (res.confirm) {
          var n = e.currentTarget.dataset.name;
          // console.log(n, 'should be tag name');
          app.deleteTag(n);
          _this.setData({
            tags: app.getTagObj(),
          });
        }
      }
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
    this.getTabBar().init();

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
  fucktest: function() {
    // console.log(DateUtil.dateToViewString(new Date()));
  }
})
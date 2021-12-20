// pages/community/community.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    projectlist: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({ projectlist: app.getProjectList() });
  },
  delete: function(e) {
    console.log('user delete something', e.detail, " should be pid!");
    console.log('longtab')
    var _this = this;
    wx.showModal({
      cancelColor: 'green',
      confirmColor: '#ab0005',
      title: "危险操作",
      content: '你要抹去这个项目的存在吗？',
      cancelText: '不',
      confirmText: '抹去',
      success(res) {
        if (res.confirm) {
          app.deleteProject(e.detail);
          _this.setData({
            projectlist: app.getProjectList()
          });
        }
      }
    })
  },
  addProject: function(e) {
    var _this = this;
    wx.navigateTo({
      url: '/pages/ddldetail/ddldetail?type=add',
      events: {
        sendBack: function(data) {
          console.log('i am in ddl, add button', data)
          if (data.type == 'added') {
            console.log(app.getProjectList());
            _this.setData({
              projectlist: app.getProjectList()
            });
          }
        }
      },
      success: function(res) {
        res.eventChannel.emit('acceptData', { type: 'add' });
      }
    })
  },
  cardClicked: function(e) {
    var _this = this;
    wx.navigateTo({
      url: '/pages/ddldetail/ddldetail?type=read&pid=' + e.detail,
      events: {
        sendBack: function(data) {
          console.log('i am in ddl, add button', data)
          if (data.type == 'added') {
            console.log(app.getProjectList());
            _this.setData({
              projectlist: app.getProjectList()
            });
          }
        }
      },
      success: function(res) {
        res.eventChannel.emit('acceptData', { type: 'add' });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTabBar()
      .init();
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

})
// pages/community/community.js
Page({
  class_ddl: function(pid,
    pro, ddl) {

  },
  ddlcreator: function(id, head,
    progress, dealdate, cdown,
    waiting, ooday, cando, done,
    ttal, sbs, sc) {
    return {
      pid: id,
      title: head,
      pro: progress,
      ddl: dealdate,
      countdown: cdown,
      wait: waiting,
      outofdate: ooday,
      cando: cando,
      done: done,
      total: ttal,
      subs: sbs,
      score: sc
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    ddllist: [{
      pid: "asdfh23425-test-pid-not-unique-test-only",
      title: "刚果采矿",
      progress: 29,
      waiting: 999,
      outofdate: 999,
      cando: 999,
      done: 20,
      total: 90,
      subs: [],
      viewdata: {
        /**
         * datestr
         * countdown
         */
        datestr: '2021-12-31',
        countdown: 0,
        score: 'S+',
      },
    }, ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      ddllist: this.data
        .ddllist
    })
  },

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
  cardclicked: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/ddldetail/ddldetail?id=1',
      events: {
        acceptDataFromOpenedPage: function(data) {
          console.log('in old', data)
        },
        someEvent: function(data) {
          console.log('in old', data)
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'testfrom old' })
      }
    })
  },

  toaddpage: function(e) {
    wx.navigateTo({
      url: '/pages/addddl/addddl',
    })
  }
})
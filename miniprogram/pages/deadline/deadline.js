// pages/community/community.js
Page({
  class_ddl: function(pid,
    pro, ddl) {

  },
  /**
   * 页面的初始数据
   */
  data: {
    ddllist: [{
      pid: "asdfh23425",
      title: "刚果采矿",
      pro: 29,
      ddl: '2021-12-13',
      countdown: 2,
      wait: 999,
      outofdate: 999,
      cando: 999,
      done: 20,
      total: 90,
      subs: [],
      score: 'S+'
    }, ]
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.ddllist.push(this
      .ddlcreator('asdfa',
        '非洲水电', 90,
        "2022-09-22", 2, 20, 10,
        10, 10, 100, [], 'A-'));
    this.setData({
      ddllist: this.data
        .ddllist
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

  onChange: function(event) {
    switch (event
      .detail) {
      case 0:
        getApp().st(
          "/pages/now/now"
        )
        break;
      case 1:
        getApp().st(
          "/pages/deadline/deadline"
        )
        break;
      case 2:
        getApp().st(
          "/pages/community/community"
        )
        break;
      case 3:
        getApp().st(
          "/pages/setting/setting"
        )
        break;
    }
    // const db = wx.cloud.database();
    // const todos = db.collection('todos')
    // todos.add({
    //     data: {
    //         description: "fuck you"
    //     },
    // }).then(res => {
    //     console.log(res)
    // })

  }
})
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
        pid: "asdfh23425",
        title: "刚果采矿",
        pro: 29,
        ddl: '2021-12-13',
        countdown: -2,
        wait: 999,
        outofdate: 999,
        cando: 0,
        done: 20,
        total: 90,
        subs: [],
        score: 'S+'
      },
      {
        pid: "asdfddh23425",
        title: "刚果采矿",
        pro: 29,
        ddl: '2021-12-13',
        countdown: -2,
        wait: 999,
        outofdate: 999,
        cando: 999,
        done: 20,
        total: 90,
        subs: [],
        score: 'S+'
      }, {
        pid: "asdfhd23425",
        title: "刚果采矿",
        pro: 29,
        ddl: '2021-12-13',
        countdown: -2,
        wait: 999,
        outofdate: 0,
        cando: 999,
        done: 0,
        total: 90,
        subs: [],
        score: 'S+'
      },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.data.ddllist.push(this
      .ddlcreator('asafdfa',
        '非洲水电', 90,
        "2022-09-22", 2, 20, 0,
        10, 10, 100, [], 'A-'));
    this.data.ddllist.push(this
      .ddlcreator('asddddfa',
        '美国大坝', 90,
        "2022-09-22", 2, 0, 10,
        10, 10, 100, [], 'A-'));
    this.data.ddllist.push(this
      .ddlcreator('asaf1dfa',
        "洲际导弹订单", 45,
        "2022-09-22", 22, 3, 10,
        10, 1, 22, [], 'A-'));
    this.data.ddllist.push(this
      .ddlcreator('asdadfa',
        '非洲水电', 90,
        "2022-09-22", 360, 20, 10,
        10, 10, 100, [], 'A-'));
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
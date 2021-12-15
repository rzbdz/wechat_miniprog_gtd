// pages/now/now.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lists: [
      { description: "超限", fold: false, list: [] },
      { description: "位置", fold: false, list: [] },
      { description: "时间", fold: false, list: [] },
      { description: "最近添加", fold: false, list: [] },
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
  /**
   * @param {string} title 
   * @param {string} project 
   * @param {string} tag 
   * @param {string} date 
   *   if today, pass in time, if not today pass in date string.
   * @param {bool} outofdate 
   * @param {int} which 
   */
  additem: function(title, project, tag, date, outofdate, waiting, which, iid = 0) {
    this.data.lists[which].list.push({
      title: title,
      project: project,
      tag: tag,
      date: date,
      outofdate: outofdate,
      waiting: waiting,
      iid: iid,
    })
  },
  expirein: 0,
  locin: 1,
  timein: 2,
  recentin: 3,
  sortlilsts: function() {
    this.data.lists.forEach(e => {
      e.list.sort((a, b) => a.date.localeCompare(b.date))
    });
    this.data.lists[this.recentin].list.reverse();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.additem("学nosql存储模式", "微信小程序", '工作', '2022-12-14', false, false, this.locin);
    this.additem("借数据库教材", "数据库期末", '出行', '2021-12-14', false, false, this.timein);
    this.additem("打电话给非洲", "非洲水电", '工作', '2020-12-12', true, false, this.expirein);
    this.additem("打灰", "洲际导弹订单", '军工', '2021-12-14', false, false, this.recentin);
    this.additem("学nosql存储模式", "微信小程序", '工作', '2018-12-14', false, true, this.locin);
    this.additem("借数据库教材", "数据库期末", '出行', '2017-12-14', false, false, this.timein);
    this.additem("打电话给非洲", "非洲水电", '工作', '2016-12-12', true, false, this.expirein);
    this.additem("打灰", "洲际导弹订单", '军工', '2021-12-11', false, false, this.recentin);
    this.additem("学nosql存储模式", "微信小程序", '工作', '2015-12-14', false, false, this.locin);
    this.additem("借数据库教材", "数据库期末", '出行', '2021-12-12', false, false, this.timein);
    this.additem("打电话给非洲", "非洲水电", '工作', '2021-12-14', true, true, this.expirein);
    this.additem("打灰", "洲际导弹订单", '军工', '2021-12-14', false, false, this.recentin);
    this.sortlilsts();
    this.setData({
      lists: this.data.lists,
    })
    console.log(this.data.lists)
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
  entryclicked: function() {
    wx.navigateTo({
      url: '/pages/entrydetail/entrydetail',
    })
  }

})
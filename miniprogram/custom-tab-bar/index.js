// custom-tab-bar/index.js
Component({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [{
        "pagePath": "/pages/now/now",
        "text": "现在"
      },
      {
        "pagePath": "/pages/deadline/deadline",
        "text": "死线"
      },
      {
        "pagePath": "/pages/community/community",
        "text": "外包"
      },
      {
        "pagePath": "/pages/setting/setting",
        "text": "设置"
      }
    ]
  },
  methods: {
    onChange: function(e) {
      wx.switchTab({
        url: this.data.list[e.detail].pagePath,
      })
      this.setData({
        active: e.detail
      })
    },
    init: function() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.pagePath === `/${page.route}`)
      });
    }
  }
})
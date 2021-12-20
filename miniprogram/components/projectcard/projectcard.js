// components/projectcard/projectcard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    project: {
      type: Object,
      value: {
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
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _cardclicked() {
      this.triggerEvent("click", this.data.project.pid);
    },
    _long() {
      this.triggerEvent("long", this.data.project.pid);
    },
  }
})
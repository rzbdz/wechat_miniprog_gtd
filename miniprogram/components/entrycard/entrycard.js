// components/entrycard/entrycard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    entry: {
      type: Object,
      value: {
        iid: 'abcdefg-test-iid-no-unique',
        pid: 'abc-test-no-unique',
        title: 'XXXXXXXXX',
        tag: 'XX',
        duedate: 'XXXX-XX-XX',
        triggerdate: 'XXXX-XX-XX',
        done: false,
        viewdata: {
          datestr: 'XXXX-XX-XX',
          outofdate: false,
          waiting: false,
          projectname: 'XXXXX',
        },
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    _entryclicked() {
      // console.log('in compo entry', this.data.entry.iid);
      this.triggerEvent("click", this.data.entry.iid);
    },
    _checkboxchange(e) {
      // console.log('in compo entry', e);
      this.triggerEvent("check", { iid: this.data.entry.iid, check: e.detail.value });
    },
    _long() {
      this.triggerEvent("long", this.data.entry.iid);
    },
  }
})
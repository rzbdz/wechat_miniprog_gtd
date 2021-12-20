App({
  async onLaunch() {
    this.initcloud()

    this.globalState = {
      isLoaded: false,
    };
    this.globalData = {
      isLoaded: false,
      user: {},
      test: { a1: 'cde', a2: 'abc' },
    }
  },
  onHide() {
    this.uploadUser();
  },
  onShow() {
    if (this.globalState.isLoaded) {
      this.uploadUser();
    }
  },
  fillUser: function(user) {
    this.globalData.user = user;
    console.log('main user be', user);
    this.globalState.isLoaded = true;
  },
  isLoaded() {
    return this.globalState.isLoaded;
  },
  getProjectList() {
    return Object.values(this.globalData.user.projects);
  },
  uploadUser() {
    var _this = this;
    console.log('upload data: ', _this.globalData.user);
    wx.cloud.callFunction({
      name: 'register',
      data: {
        type: 'update',
        data: _this.globalData.user,
        // type: 'update',
        // data: {
        //   _id: "c0ca0aed61bec682011f133a55eb456c",
        //   nothing: 'fuckyou'
        // },
      },
      success: function(res) {
        console.log(res.result.message)
      },
      fail: console.error
    })
  },
  getProject(pid) {
    return this.globalData.user.projects[pid];
  },
  updateProject(pid, p) {
    console.log('app update: ', p);
    this.globalData.user.projects[pid] = p;
  },
  deleteProject(pid) {
    var p = this.globalData.user.projects[pid];
    var _this = this;
    var _count = 0;
    p.subs.forEach(e => {
      _count += 1;
      delete _this.globalData.user.entries[e];
    })
    console.log('delete: ', _count, 'entries');
    delete this.globalData.user.projects[pid];
  },
  getEntryList() {
    return Object.values(this.globalData.user.entries);
  },
  getEntry(iid) {
    return this.globalData.user.entries[iid];
  },
  getPrereqList(iid) {
    var e = this.globalData.user.entries[iid];
    var res = {};
    var _this = this;
    e.prereq.forEach(piid => {
      res[piid]({
        iid: piid,
        title: _this.globalData.user.entries[piid].title,
      });
    })
  },
  getCanAddPrereqList(pid, triggerdate) {
    triggerdate = new Date(triggerdate);
    var res = {};
    var es = this.getEntriesOfProject(pid);
    for (let i = 0; i < es.length; i++) {
      if (es[i].triggerdate > triggerdate) {
        break;
      }
      res[iid] = ({ iid: es[i].iid, name: es[i].title });
    }
    return res;
  },
  updateEntry(iid, e) {
    console.log('app update: ', e);
    this.globalData.user.entries[iid] = e;
  },
  deleteEntry(iid) {
    console.log('app delete:', iid);
    delete this.globalData.user.entries[iid];
  },
  getEntriesOfProject(pid) {
    var myentries = [];
    var _thises = this.globalData.user.entries;
    this.globalData.user.projects[pid].subs.forEach(
      eiid => {
        _thises[eiid].triggerdate = new Date(_thises[eiid].triggerdate);
        myentries.push(_thises[eiid]);
      }
    )
    myentries.sort(function(a, b) { return a.triggerdate - b.triggerdate });
    return myentries;
  },
  getTagList() {
    return Object.values(this.globalData.user.tags);
  },
  st: function(to) {
    wx.navigateTo({
      url: to,
    })
  },
  flag: false,
  /**
   * 初始化云开发环境（支持环境共享和正常两种模式）
   */
  async initcloud() {
    const shareinfo = wx.getExtConfigSync() // 检查 ext 配置文件
    const normalinfo = require('./envList.js').envList || [] // 读取 envlist 文件
    if (shareinfo.envid != null) { // 如果 ext 配置文件存在，环境共享模式
      this.c1 = new wx.cloud.Cloud({ // 声明 cloud 实例
        resourceAppid: shareinfo.appid,
        resourceEnv: shareinfo.envid,
      })
      // 装载云函数操作对象返回方法
      this.cloud = async function() {
        if (this.flag != true) { // 如果第一次使用返回方法，还没初始化
          await this.c1.init() // 初始化一下
          this.flag = true // 设置为已经初始化
        }
        return this.c1 // 返回 cloud 对象
      }
    } else { // 如果 ext 配置文件存在，正常云开发模式
      if (normalinfo.length != 0 && normalinfo[0].envId != null) { // 如果文件中 envlist 存在
        wx.cloud.init({ // 初始化云开发环境
          traceUser: true,
          env: normalinfo[0].envId
        })
        // 装载云函数操作对象返回方法
        this.cloud = () => {
          return wx.cloud // 直接返回 wx.cloud
        }
      } else { // 如果文件中 envlist 不存在，提示要配置环境
        this.cloud = () => {
          throw new Error('当前小程序没有配置云开发环境，请在 envList.js 中配置你的云开发环境')
        }
      }
    }
  },

  // 获取云数据库实例
  async database() {
    return (await this.cloud()).database()
  },

})
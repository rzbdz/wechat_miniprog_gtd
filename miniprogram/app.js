const { TodoData, DateUtil } = require('./utils/myutils.js');

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
  },
  fillUser: function(user) {
    this.globalData.user = user;
    this.globalState.isLoaded = true;
  },
  isLoaded() {
    return this.globalState.isLoaded;
  },
  isEmpty() {
    console.log('emtpy: ', this.getEntryList().length)
    return this.getEntryList().length == 0;
  },
  getProjectList() {
    var _this = this;
    var l = Object.values(this.globalData.user.projects);
    l.sort((a, b) => { return new Date(a.duedate) - new Date(b.duedate) })
    l.forEach(p => {
      TodoData.initProjectView((iid) => { return _this.getEntry(iid) }, p);
    })
    return l;
  },
  uploadUser() {
    var _this = this;
    wx.cloud.callFunction({
      name: 'register',
      data: {
        type: 'update',
        data: _this.globalData.user,
      },
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },
  getProject(pid) {
    return this.globalData.user.projects[pid];
  },
  updateProject(pid, p) {
    // console.log('app update: ', p);
    this.globalData.user.projects[pid] = p;
    this.uploadUser();
  },
  deleteProject(pid) {
    var p = this.globalData.user.projects[pid];
    var _this = this;
    var _count = 0;
    var ths = new Set(_this.globalData.user.recent);
    p.subs.forEach(e => {
      ths.delete(e);
      _count += 1;
      _this.deleteEntry(e, true);
    })
    _this.globalData.user.recent = Array.from(ths);
    // console.log('delete: ', _count, 'entries');
    delete this.globalData.user.projects[pid];
    this.uploadUser();
  },
  getEntryList() {
    return Object.values(this.globalData.user.entries);
  },
  updateAllSubView() {
    this.getEntryList().forEach(e => {
      TodoData.updateSubViewLocally(iid => this.getEntry(iid), e);
    });
  },
  getExpiredEList() {
    var expired = [];
    this.getEntryList().forEach(e => {
      TodoData.updateSubWaiting((ei) => this.getEntry(ei), e);
      if (e.viewdata.outofdate) {
        expired.push(e);
      }
    });
    return expired;
  },
  getTodayEList() {
    var td = [];
    this.getEntryList().forEach(e => {
      if (DateUtil.isSameDay(e.duedate, DateUtil.getToday())) {
        td.push(e);
      }
    });
    return td;
  },
  getLocationEList(loc) {
    // console.log('fuckyou')
    var locTagSet = new Set();
    this.getTagList().forEach(tag => {
      if (TodoData.isLocationMatchTag(tag, loc)) {
        locTagSet.add(tag.name);
      }
    })
    // console.log(locTagSet, 'loctagset');
    var match = [];
    console.log(this.getEntryList(), '?????????????????????');
    console.log(this.globalData.user);
    this.getEntryList().forEach(e => {
      TodoData.updateSubWaiting((ei) => this.getEntry(ei), e);
      if (!e.viewdata.waiting && locTagSet.has(e.tag)) {
        match.push(e);
      }
    });
    return match;
  },
  getTimeEList() {
    var timeTagSet = new Set();
    this.getTagList().forEach(tag => {
      if (TodoData.isTimeMatchTag(tag)) {
        timeTagSet.add(tag.name);
      }
    })
    var match = [];
    this.getEntryList().forEach(e => {
      TodoData.updateSubWaiting((ei) => this.getEntry(ei), e);
      if (!e.viewdata.waiting && timeTagSet.has(e.tag)) {
        match.push(e);
      }
    });
    return match;
  },
  getRecentAdd() {
    var match = [];
    this.globalData.user.recent.forEach(iid => {
      TodoData.updateSubWaiting((ei) => this.getEntry(ei), this.globalData.user.entries[iid]);
      match.push(this.globalData.user.entries[iid]);
    })
    return match;
  },
  getEntry(iid) {
    return this.globalData.user.entries[iid];
  },
  getPrereqList(iid) {
    let e = this.globalData.user.entries[iid];
    var res = {};
    var _this = this;
    for (var piid in e.prereq) {
      res[piid] = {
        iid: piid,
        name: _this.globalData.user.entries[piid].title,
      };
    }
    return res;
  },
  getCanAddPrereqList(pid, triggerdate) {
    triggerdate = new Date(triggerdate);
    var res = {};
    var es = this.getEntriesOfProject(pid);
    for (let i = 0; i < es.length; i++) {
      if (es[i].triggerdate > triggerdate) {
        break;
      }
      res[es[i].iid] = ({ iid: es[i].iid, name: es[i].title });
    }
    return res;
  },
  updateEntry(iid, e) {
    // console.log('app update: ', e);

    this.globalData.user.projects[e.pid].subs.push(iid);
    this.globalData.user.entries[iid] = e;

    if (this.globalData.user.recent.length >= 4) {
      this.globalData.user.recent.unshift(iid);
      this.globalData.user.recent.pop();
    } else {
      this.globalData.user.recent.unshift(iid);
    }
  },
  deleteEntry(iid, force = false) {
    var e = this.globalData.user.entries[iid];
    if (!force) {
      var len1 = e.notify.length,
        len2 = Object.values(e.prereq).length;
      if (len1 > 0 || len2 > 0) {
        wx.showModal({
          cancelColor: 'green',
          title: "????????????",
          content: "?????????????????????????????????????????? (" + len1 + '????????????????????????????????????????????????' + len2 + '?????????)',
          cancelText: '??????',
        })
        return;
      }
    }
    this.decTagRefCnt(e.tag);
    var ths = new Set(this.globalData.user.recent);
    ths.delete(iid);
    this.globalData.user.recent = Array.from(ths);
    // console.log(this.globalData.user.recent, "recent");
    var pid = e.pid;
    // console.log('app delete:', iid);
    var ss = new Set(this.globalData.user.projects[pid].subs);
    // console.log(ss, 'should be a set contains iid');
    ss.delete(iid);
    this.globalData.user.projects[pid].subs = Array.from(ss);
    delete this.globalData.user.entries[iid];
    this.uploadUser();
  },
  getEntriesOfProject(pid) {
    var myentries = [];
    var _this = this;
    var _thises = this.globalData.user.entries;
    if (this.globalData.user.projects[pid] == null) {
      return myentries;
    }
    this.globalData.user.projects[pid].subs.forEach(
      eiid => {
        TodoData.initSubView((pid) => _this.getProject(pid), (iid) => _this.getEntry(iid), _thises[eiid]);
        myentries.push(_thises[eiid]);
      }
    )
    myentries.sort(function(a, b) { return a.duedate - b.duedate });
    return myentries;
  },
  getTagList() {
    return Object.values(this.globalData.user.tags);
  },
  incTagRefCnt(tagname) {
    this.globalData.user.tags[tagname].refcnt += 1;
  },
  decTagRefCnt(tagname) {
    if (tagname === '??????') {
      console.log('?????????dec');
      return;
    }
    this.globalData.user.tags[tagname].refcnt -= 1;
  },
  getTagObj() {
    return this.globalData.user.tags;
  },
  updateTag(tag) {
    // console.log(tag);
    this.globalData.user.tags[tag.name] = tag;
    this.uploadUser();
  },
  deleteTag(name) {
    if (this.globalData.user.tags[name].refcnt > 0) {
      wx.showModal({
        title: "??????",
        content: '???????????????????????????????????? Tag',
        showCancel: false,
        success: function(res) {}
      })
      return;
    }
    delete this.globalData.user.tags[name];
    this.uploadUser();
  },
  st: function(to) {
    wx.navigateTo({
      url: to,
    })
  },
  flag: false,
  /**
   * ?????????????????????????????????????????????????????????????????????
   */
  async initcloud() {
    const shareinfo = wx.getExtConfigSync() // ?????? ext ????????????
    const normalinfo = require('./envList.js').envList || [] // ?????? envlist ??????
    if (shareinfo.envid != null) { // ?????? ext ???????????????????????????????????????
      this.c1 = new wx.cloud.Cloud({ // ?????? cloud ??????
        resourceAppid: shareinfo.appid,
        resourceEnv: shareinfo.envid,
      })
      // ???????????????????????????????????????
      this.cloud = async function() {
        if (this.flag != true) { // ???????????????????????????????????????????????????
          await this.c1.init() // ???????????????
          this.flag = true // ????????????????????????
        }
        return this.c1 // ?????? cloud ??????
      }
    } else { // ?????? ext ??????????????????????????????????????????
      if (normalinfo.length != 0 && normalinfo[0].envId != null) { // ??????????????? envlist ??????
        wx.cloud.init({ // ????????????????????????
          traceUser: true,
          env: normalinfo[0].envId
        })
        // ???????????????????????????????????????
        this.cloud = () => {
          return wx.cloud // ???????????? wx.cloud
        }
      } else { // ??????????????? envlist ?????????????????????????????????
        this.cloud = () => {
          throw new Error('??????????????????????????????????????????????????? envList.js ??????????????????????????????')
        }
      }
    }
  },

  // ????????????????????????
  async database() {
    return (await this.cloud()).database()
  },

})
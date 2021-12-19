// myutils.js
//================================================
// @copynoright rzbdz@github.com
// 这个文件是所有的 util，因为小程序控制云开发公用 js 太麻烦了
// 问题就在我要前后端用同一个数据模型
// 这种的解决方案一般是通过构建的依赖来解决，
// 但是云开发开发和部署都不同机器，没办法这样写项目。
// 我暂时还是这样一个文件去复制更新了。
//==============================================
// 通过搜索来定位编码吧：就三个模块：
// DateUtil
// TodoData
// UserData
Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

exports.DateUtil = {
  DAY_MOD: (24 * 60 * 60 * 1000),
  genUID: function(prefix = '') {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return prefix + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  getDayStamp: function(d) {
    return Math.floor(d.getTime() / this.DAY_MOD);
  },

  /**
   * TODO: cache Date today
   * this interface is setup to support cached date instead of asking 
   * for a second accuracy function call every time a date comparison happends
   */
  getToday: function() {
    return new Date();
  },

  isNowAfter: function(date) {
    return this.getDayStamp(new Date(date)) < this.getDayStamp(this.getToday());
  },

  isSameDay: function(first, second) {
    return first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();
  },
  /**
   * return a Number.
   */
  expireDays: function(d) {
    var stamp = this.getDayStamp(d);
    var stampNow = this.getDayStamp(this.getToday());
    return Math.floor(stamp - stampNow);
  },
  dateToViewString: function(d) {
    if (this.isSameDay(d, this.getToday())) {
      return d.format('今天');
    }
    return d.format('yyyy-MM-dd');
  },
}

exports.TodoData = {
  Location: function(lat, lon, name) {
    this.lat = lat;
    this.lon = lon;
    this.name = name;
  },
  distance: function(loc1, loc2) {
    var lon1 = loc1.lon;
    var lon2 = loc2.lon;
    var lat1 = loc1.lat;
    var lat2 = loc2.lat;
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;
    // calculate the result
    return (c * r) * 1000;
  },
  /**
   * 
   * @param {String} name 
   * @param {Array<Number>} time arr of int 
   * @param {Array<Location>} location arr of Location
   */
  Tag: function(name = '', time = [], location = []) {
    // tag won't have id
    // we need name check
    // in the view model.
    // f**c javascript
    this.name = name;
    this.time = time;
    this.location = location;
  },

  /**
   * 
   * @param {String} pid 
   * @param {String} title 
   * @param {Date} duedate 
   * @param {Date} triggerdate 
   * @param {String} tag tagname!
   * @param {Map<String, bool>} prereq 
   * @param {*} scene 
   */
  Sub: function(pid, title, duedate, triggerdate = exports.getToday(), tag = null, prereq = {}, scene = null) {
    this.iid = exports.DateUtil.genUID('sub');
    this.pid = pid
    this.title = title
    this.duedate = duedate
    this.triggerdate = triggerdate
    this.prereq = prereq
    this.notify = []
    this.tag = tag
    this.scene = ''
    this.done = false
    this.viewdata = {
      datestr: '1999-05-04',
      triggerstr: '1999-05-04',
      outofdate: false,
      waiting: true,
      projectname: pid,
    }
  },
  _get_pre_state: function(sMap, sub) {
    var alldone = true;
    for (var piid in sub.prereq) {
      sub.prereq[piid] = sMap(piid).done;
      alldone |= sub.prereq[piid];
    }
    return alldone;
  },
  initSubView: function(pMap, sMap, sub) {
    var today = exports.DateUtil.getToday();
    sub.duedate = new Date(sub.duedate);
    sub.viewdata.datestr = exports.DateUtil.dateToViewString(today);
    sub.viewdata.outofdate = exports.DateUtil.isNowAfter(today);
    sub.viewdata.projectname = pMap(sub.pid).title;
    var td = new Date(sub.triggerdate);
    sub.triggerdate = td;
    this.updateSubWaiting(sMap, sub);
  },
  updateSubWaiting: function(sMap, sub) {
    sub.viewdata.waiting = !this._get_pre_state(sMap, sub) || exports.DateUtil.isNowAfter(sub.triggerdate);
    return sub.viewdata.waiting;
  },
  addPrereqState: function(sub, pre, done = false) {
    var preiid = pre.iid;
    // add a prereq in my req list
    sub.prereq[preiid] = done;
    // add me to prereq's notify list
    pre.notify.push(sub.iid);
  },
  removePrereq: function(sub, pre) {
    // remove piid from my pre list
    var preiid = pre.iid;
    delete sub.prereq[preiid];
    // remove me from pre's notify list
    var s = new Set(pre.notify);
    s.delete(sub.iid);
    pre.notify = Array.from(s);
  },
  doneEntry: function(SubMap, sub) {
    // notify who depend on me
    sub.notify.forEach(n => {
      SubMap(n).prereq[sub.iid] = true;
    })
  },
  undoneEntry: function(SubMap, sub) {
    // notify who depend on me
    sub.notify.forEach(n => {
      SubMap(n).prereq[sub.iid] = false;
    })
  },
  Project: function(title = '', duedate = '', subs = []) {
    this.pid = exports.DateUtil.genUID('pro');
    this.title = title;
    this.duedate = duedate;
    this.subs = subs;
    this.progress = 0;
    this.cando = 0;
    this.waiting = 0;
    this.done = 0;
    this.outofdate = 0;
    this.total = 0;
    this.viewdata = {
      datestr: 'XXXXXX',
      countdown: 0,
      score: 'S+',
    };
  },
  addSub: function(p, iid) {
    p.subs.push(iid);
  },
  // TODO: use better reviewing method
  // an alternative is to use quantitative scoring,
  // then convert to grade score in the view.
  score: function(p) {
    var done = p.done,
      ood = p.outofdate,
      total = p.total,
      expired = p.viewdata.countdown < 0;
    var sc;
    if (expired) sc = 'F-';
    if (ood > total / 2) sc = 'F';
    if (done > total / 2) {
      if (ood > total / 3) {
        sc = 'A+';
      } else if (ood > 0) {
        sc = 'S';
      } else {
        sc = 'S+';
      }
    } else {
      if (ood > 0) {
        sc = 'A-';
      } else {
        sc = 'A'
      }
    }
    p.viewdata.score = sc;
    return sc;
  },
  initProjectView: function(subMap, p) {
    this.updateProjectView(subMap, p);
    var today = exports.DateUtil.getToday();
    p.duedate = new Date(p.duedate);
    p.viewdata.datestr = exports.DateUtil.dateToViewString(p.duedate);
    p.viewdata.countdown = exports.DateUtil.expireDays(p.duedate);
    p.viewdata.score = this.score(p);
  },
  /**
   * you should only update p.waiting, p.done, p.cando in setData list
   */
  updateProjectView: function(subMap, p) {
    var waiting = 0,
      done = 0,
      total = p.subs.length;
    var _this = this;

    p.subs.forEach(s => {
      if (_this.updateSubWaiting(subMap, subMap(s))) {
        waiting += 1;
      }
      if (s.done) {
        done += 1;
      }
    })
    p.waiting = waiting;
    p.done = done;
    p.cando = total - done - waiting;
    p.total = total;
  }
}

exports.UserData = {
  User: function() {
    if (arguments.length == 1) {
      this.openid = arguments[0];
    } else {
      this.openid = '';
    }
    // Use dictionary to speed up, it's
    // okay to store a redundant id as key
    this.projects = {};
    this.tags = {};
    this.entries = {};
    this.description = 'perserved keyword';
    this.register_date = Date.now();
    this.reputation = 'comming soon';
  },
  createUser: function(openid) {
    return new this.User(openid);
  },
}
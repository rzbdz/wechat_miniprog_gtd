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
  Sub: function() {
    this.iid = ''
    this.pid = ''
    this.title = ''
    this.duedate = ''
    this.triggerdate = ''
    this.prereq = {}
    this.notify = []
    this.tag = ''
    this.scene = ''
    this.done = false
    this.viewdata = {
      /**
       * datestr
       * outofdate
       * waiting
       * projectname
       */
    }
  },
  createSub: function(pid, title, duedate, triggerdate, tag, prereq = [], scene = "") {
    var r = new this.Sub();
    r.pid = pid;
    r.title = title;
    r.duedate = duedate;
    r.triggerdate = triggerdate;
    r.tag = tag;
    r.prereq = prereq;
    r.scene = scene;
    r.iid = exports.DateUtil.genUID('sub');
    return r;
  },

  Project: function() {
    this.pid = '';
    this.title = '';
    this.duedate = '';
    this.subs = [];
    this.progress = 0;
    this.cando = 0;
    this.waiting = 0;
    this.done = 0;
    this.outofdate = 0;
    this.total = 0;
    this.viewdata = {
      /**
       * datestr
       * countdown
       */
      datestr: 'XXXXXX',
      countdown: 0,
      score: 'S+',
    };
  },
  // TODO: use better reviewing method
  // an alternative is to use quantitative scoring,
  // then convert to grade score in the view.
  _score_algorithm = function(done, ood, total, expired) {
    if (expired) return 'F-';
    if (ood > total / 2) return 'F';
    if (done > total / 2) {
      if (ood > total / 3) {
        return 'A+';
      } else if (ood > 0) {
        return 'S';
      } else {
        return 'S+';
      }
    } else {
      if (ood > 0) {
        return 'A-';
      } else {
        return 'A'
      }
    }
  }
  /**
   * 4 args
   * @param {String} title 
   * @param  duedate timestamp(Date().getTime)
   * @param {Array} subs 
   * 
   * @param {Number} cando 
   * @param {Number} ood 
   * @param {Number} wait 
   * functions: <br/>
   * setPid()<br/>
   * updateView(mapSub)<br/>
   * removeSub(iid)<br/>
   */
  createProject: function(title, duedate, subs = []) {
    console.log(subs);
    var p = new this.Project();
    p.pid = exports.DateUtil.genUID('pro');
    p.title = title;
    p.duedate = duedate;
    p.subs = subs;
    return p;
  },
  Location: function(lat = 0, lon = 0, name = '') {
    this.lat = lat;
    this.lon = lon;
    this.name = name;
    this.distanceTo = function(rhs) {
      return this._distance(lat, rhs.lat, lon, rhs.lon);
    }
    this.inRangeOf = function(start_loc, radius = 0.1) {
      var km = this.distanceTo(start_loc);
      if (km <= radius) {
        return true;
      }
      return false;
    }
  },
  distance = function(loc1, loc2) {
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
    return (c * r);
  },
  Tag: function() {
    // tag won't have id
    // we need name check
    // in the view model.
    // f**c javascript
    if (arguments.length == 1) {
      this.name = arguments[0];
    } else {
      this.name = '';
    }
    if (arguments.length == 2) {
      this.time = arguments[1];
    } else { this.time = []; }
    if (arguments.length == 3) {
      this.location = arguments[2];
    } else {
      this.location = [];
    }
  },
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
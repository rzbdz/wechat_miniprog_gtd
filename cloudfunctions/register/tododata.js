const { DateUtil } = require("./date");

exports.TodoData = {
  Sub: function() {
    this.iid = ''
    this.pid = ''
    this.title = ''
    this.duedate = ''
    this.triggerdate = ''
    this.prereq = ''
    this.notify = {}
    this.tag = ''
    this.scene = ''
    this.done = false
    this.addSubscriber = function(hisiid) {
      this.notify['hisiid'] = false;
    }
    this.removeSubscriber = function(hisiid) {
      delete notify['hisiid'];
    }
    this.doNotify = function(preiid, doornot = true) {
      notify['preiid'] = doornot;
    }
    this.removePrerq = function(iid) {
      var s = new Set(this.prereq);
      s.delete(iid);
      this.prereq = Array.from(s);
    }
    this.addPrerq = function(iid) {
      this.prereq.push(iid);
    }
    this.hasPreNotFinish = function() {
      var res = true;
      for (var key in dic) {
        res &= dic[key];
      }
    }
    this.viewdata = {
      /**
       * datestr
       * outofdate
       * waiting
       * projectname
       */
    }
    this.isOutOfDate = function() {
      return DateUtil.isNowAfter(new Date(this.duedate));
    }
    /**
     * call this function to update waiting
     * everytime in application update
     */
    this.isWaiting = function() {
      var trd = new Date(this.triggerdate);
      return this.viewdata.waiting = !DateUtil.isNowAfter(trd) || this.hasPreNotFinish();
    }
    this.updateViewLight = this.isWaiting;
    /**
     * Call this function to init a project,
     * onReload, onShow
     * @param {(String)=>Project} mapProj 
     */
    this.updateView = function(mapProj) {
      var d = new Date(this.duedate);
      this.viewdata = {
        datestr: DateUtil.dateToViewString(d),
        outofdate: DateUtil.isNowAfter(d),
        waiting: this.isWaiting(),
        projectname: mapProj(this.pid).title,
      }
    }
    this.doIt = function(mapSub) {
      this.done = true;
      this.notify.forEach(i => {
        mapSub(i).doNotify(this.iid);
      });
      // this.notify = [];
      // I cannot remove anyone since I would be undone.
    }
    this.unDoIt = function(mapSub) {
      this.done = false;
      this.notify.forEach(i => {
        mapSub(i).addPrerq(this.iid);
      });
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
    r.iid = DateUtil.genUID('sub');
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
    /**
     * 
     * @param {function(Object)=>Object{done:boolean, wait: boolean, updateAgg()}} mapSub 
     */
    this._updateAggFromSubs = function(mapSub) {
      // console.log(this)
      var done_count = 0;
      var wait_count = 0;
      var ood_count = 0;
      this.subs.forEach(e => {
        var s = mapSub(e);
        // console.log("from the map:", s, "the id use :", e);
        done_count += s.done ? 1 : 0;
        wait_count += s.isWaiting() ? 1 : 0;
        ood_count += s.isOutOfDate() ? 1 : 0;
      });
      this.waiting = wait_count;
      this.done = done_count;
      this.outofdate = ood_count;
      // console.log(this.subs.length);
      // console.log("subs: ", this.subs);
      this.total = this.subs.length;
      this.progress = Math.floor(this.done / this.total * 100);
      this.cando = this.total - this.waiting;
    }
    this.setPid = function(pid) {
      this.pid = pid;
    }
    this.viewdata = {
      /**
       * datestr
       * countdown
       */
      datestr: 'XXXXXX',
      countdown: 0,
      score: 'S+',
    };

    // TODO: use better reviewing method
    // an alternative is to use quantitative scoring,
    // then convert to grade score in the view.
    this._score_algorithm = function(done, ood, total, expired) {
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
    this.updateView = function(mapSub) {
      this._updateAggFromSubs(mapSub);
      var cd = DateUtil.expireDays(new Date(this.duedate));
      this.viewdata = {
        datestr: DateUtil.dateToViewString(new Date(this.duedate)),
        countdown: cd,
        score: this._score_algorithm(this.done, this.outofdate, this.total, cd < 0),
      }
    }
    this.removeSub = function(iid) {
      var s = new Set(this.subs);
      this.subs.delete(iid);
      this.subs = Array.from(s);
    }
  },
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
    // console.log(subs);
    var p = new this.Project();
    p.pid = DateUtil.genUID('pro');
    p.title = title;
    p.duedate = duedate;
    p.subs = subs;
    return p;
  },
  deserializeProject: function(plainP) {
    var p = new this.Project();
    p.pid = plainP.pid;
    p.title = plainP.title;
    p.duedate = plainP.duedate;
    p.subs = plainP.subs;
    p.progress = plainP.progress;
    p.cando = plainP.cando;
    p.waiting = plainP.waiting;
    p.done = plainP.done;
    p.outofdate = plainP.outofdate;
    p.total = plainP.total;
    p.viewdata = plainP.viewdata;
    return p;
  },
  distance: function(lat1,
    lat2, lon1, lon2) {
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
  Location: function() {
    this.lat = '';
    this.lon = '';
    this.name = '';
    this.distanceTo = function(rhs) {
      return distance(lat, rhs.lat, lon, rhs.lon);
    }
    this.inRangeOf = function(start_loc, radius = 0.1) {
      var km = this.distanceTo(start_loc);
      if (km <= radius) {
        return true;
      }
      return false;
    }
  },
  Tag: function() {
    this.name = '';
    this.time = [];
    this.location = [];
  },
}
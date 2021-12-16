import * as DateUtil from "./date";

export function createSub(pid, title, duedate, triggerdate, tag, prereq = [], scene = "") {
  return {
    iid: DateUtil.genUID('sub-'),
    pid: pid,
    title: title,
    duedate: duedate,
    triggerdate: triggerdate,
    prereq: prereq,
    notify: [],
    tag: tag,
    scene: scene,
    done: false,
    addSubscriber: function(hisiid) {
      this.notify.push(hisiid);
    },
    removeSubscriber: function(hisiid) {
      var s = new Set(notify);
      s.delete(hisiid);
      this.notify = Array.from(s);
    },
    viewdata: {
      /**
       * datestr
       * outofdate
       * waiting,
       * projectname,
       */
    },
    updateView: function(mapProj) {
      var d = new Date(duedate);
      this.viewdata = {
        datestr: DateUtil.dateToViewString(d),
        outofdate: DateUtil.isNowAfter(d),
        waiting: this.isWaiting(),
        projectname: mapProj(pid).title,
      }
    },
    removePrerq: function(iid) {
      var s = new Set(this.prereq);
      s.delete(iid);
      this.prereq = Array.from(s);
    },
    addPrerq: function(iid) {
      this.prereq.push(iid);
    },
    doIt: function(mapSub) {
      this.done = true;
      this.notify.forEach(i => {
        mapSub(i).removePrerq(this.iid);
      });
      // this.notify = [];
      // I cannot notify anyone since I would be undone.
    },
    unDoIt: function(mapSub) {
      this.done = false;
      this.notify.forEach(i => {
        mapSub(i).addPrerq(this.iid);
      });
    },
    isOutOfDate: function() {
      return DateUtil.isNowAfter(new Date(duedate));
    },
    isWaiting: function() {
      var trd = new Date(triggerdate);
      console.log('asking waiting(', this.iid, '):len:', this.prereq.length, "sowhat's in it:", this.prereq);
      return !DateUtil.isNowAfter(trd) || this.prereq.length > 0;
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
export function createProject(title, duedate, subs) {
  console.log(subs);
  return {
    pid: DateUtil.genUID('pro-'),
    title: title,
    duedate: duedate,
    subs: subs,
    progress: 0,
    cando: 0,
    waiting: 0,
    done: 0,
    outofdate: 0,
    total: subs.length,
    /**
     * 
     * @param {function(Object)=>Object{done:boolean, wait: boolean, updateAgg()}} mapSub 
     */
    _updateAggFromSubs: function(mapSub) {
      var done_count = 0;
      var wait_count = 0;
      var ood_count = 0;
      this.subs.forEach(e => {
        var s = mapSub(e);
        console.log("from the map:", s, "the id use :", e);
        done_count += s.done ? 1 : 0;
        wait_count += s.isWaiting() ? 1 : 0;
        ood_count += s.isOutOfDate() ? 1 : 0;
      });
      this.waiting = wait_count;
      this.done = done_count;
      this.outofdate = ood_count;
      console.log(this.subs.length);
      console.log("subs: ", this.subs);
      this.total = this.subs.length;
      this.progress = Math.floor(this.done / this.total * 100);
      this.cando = this.total - this.waiting;
    },
    setPid: function(pid) {
      this.pid = pid;
    },
    viewdata: {
      /**
       * datestr
       * countdown
       */
      datestr: 'XXXXXX',
      countdown: 0,
      score: 'S+',
    },
    _score_algorithm(done, ood, total, expired) {
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
    },
    updateView: function(mapSub) {
      this._updateAggFromSubs(mapSub);
      var cd = DateUtil.expireDays(new Date(this.duedate));
      this.viewdata = {
        datestr: DateUtil.dateToViewString(new Date(this.duedate)),
        countdown: cd,
        score: this._score_algorithm(this.done, this.outofdate, this.total, cd < 0),
      }
    },
    removeSub: function(iid) {
      var s = new Set(this.subs);
      subs.delete(iid);
      this.subs = Array.from(s);
    }
  }
}
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
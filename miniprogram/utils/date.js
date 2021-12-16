export function genUID(prefix = '') {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return prefix + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function isNowAfter(date) {
  return new Date(date) <= new Date();
}

/**
 * TODO: cache Date today
 * this interface is setup to support cached date instead of asking 
 * for a second accuracy function call every time a date comparison happends
 */
export function getToday() {
  return new Date();
}
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
const DAY_MOD = (24 * 60 * 60 * 1000);

export function getDayStamp(d) {
  return Math.floor(d.getTime() / DAY_MOD);
}

export function isSameDay(d1, d2) {
  var stamp1 = getDayStamp(d1);
  var stamp2 = getDayStamp(d2);
  console.log(stamp1, stamp2);
  return stamp1 == stamp2;
}
/**
 * return a Number.
 */
export function expireDays(d) {
  var stamp = getDayStamp(d);
  var stampNow = getDayStamp(getToday());
  return Math.floor(stamp - stampNow);
}
// FIXME: time before 8:00 am would be in yesterday
export function dateToViewString(d) {
  if (isSameDay(d, getToday())) {
    return d.format('今天');
  }
  return d.format('yyyy-MM-dd');
}
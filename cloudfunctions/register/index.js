// 云函数入口文件
const cloud = require('wx-server-sdk')
const { TodoData, UserData } = require('./myutils')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  meta = {
    event: event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
  var dt;
  const db = cloud.database()
  const users = db.collection('users')
  if (event.type === 'onload') {
    const re = await users.where({
      openid: meta.openid
    }).get();
    var msg;
    if (re.data.length > 0) {
      dt = re.data[0];
      msg = '已登录！'
    } else {
      msg = '注册成功！'
      dt = new UserData.User(meta.openid);
      c = await users.add({
        data: dt,
      })
      // console.log(c)
    }
    return { message: msg, data: dt };
  } else if (event.type === 'update') {
    // FIXME: use incremental update
    dt = event.data;
    dbid = dt._id;
    delete dt['_id'];
    try {
      await users.doc(dbid).set({ data: dt })
    } catch {
      return { message: '失败了，尝试的dbid:', dbid: dbid };
    }
    return { message: msg };
    //return { message: { da: dt, db: dbid } }
  }
  return { message: 'impossible' }
}
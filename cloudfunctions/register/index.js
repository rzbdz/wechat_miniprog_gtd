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
  const todos = db.collection('todos')
  if (event.type === 'onload') {
    const re = await todos.where({
      openid: meta.openid
    }).get();
    var msg;
    if (re.data.length > 0) {
      dt = re.data[0];
      msg = '已登录！'
    } else {
      msg = '注册成功！'
      dt = new UserData.User(meta.openid);
      
      c = await todos.add({
        data: dt,
      })
      console.log(c)
    }
    return { message: msg, data: dt };
  } else if (event.type === 'update') {
    // FIXME: use incremental update
    dt = event.data;
    dbid = dt._id;
    delete dt['_id'];
    await todos.doc(dbid).set({ data: dt })
    return { message: msg };
    //return { message: { da: dt, db: dbid } }
  }
  return { message: 'impossible' }
}
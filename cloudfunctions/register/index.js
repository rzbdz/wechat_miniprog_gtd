// 云函数入口文件
const cloud = require('wx-server-sdk')

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
  const db = cloud.database()
  const users = db.collection('users')
  const todos = db.collection('todos')
  const re = await users.where({
    _openid: meta.openid
  }).get();
  var msg
  dt = {
    _openid: meta.openid,
    _projects: []
  };
  if (re.data.length > 0) {
    msg = 'already registered!'
    const mytodos = await todos.where({
      _openid: meta.openid
    }).get();
    if (mytodos.data.length == 0) {
      c = await todos.add({
        data: dt
			})
			console.log(c)
      return { message: msg, result: dt };
    } else {
      return { message: msg, result: mytodos.data[0] };
    }
  } else {
    const res = await users.add({
      data: {
        _description: "one new user",
        _openid: meta.openid,
        _register_date: Date.now(),
      },
    })
    msg = 'registered sucess!'
    c = await todos.add({
      data: dt
		})
		console.log(c)
    return { message: msg, result: dt };
  }
}
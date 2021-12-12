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
  const re = await users.where({
    _openid: meta.openid
  }).get();
  if (re.data.length > 0) return {
    res: re,
    msg: "registered already!"
  };
  const res = await users.add({
    data: {
      _description: "one new user",
      _openid: meta.openid,
      _register_date: Date.now(),
    },
  })
  return {
    res
  }
}
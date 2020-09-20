// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const friendCollection = db.collection("friend")
const userCollection = db.collection("user")
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取用户好友列表
  let res = await friendCollection.where({
    _openid: cloud.getWXContext().OPENID
  }).get()
  let friendGroup = res.data[0].friend_group
  // 获取好友信息
  return await userCollection.where({
      _openid: _.in(friendGroup)
    }).skip(event.skip)
    .limit(10)
    .get()
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "development-ds5e1"
})

const db = cloud.database()
const friendCollection = db.collection("friend")
const photoCollection = db.collection("photo")
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let _openid = cloud.getWXContext().OPENID
  // 获取好友列表
  let friendGroup = await friendCollection.where({
    _openid: _openid
  }).get()
  friendGroup = friendGroup.data[0].friend_group
  friendGroup.push(_openid)
  // 获取图片
  return photoCollection.aggregate()
    .match({
      _openid: _.in(friendGroup)
    }).sort({
      create_time: -1
    }).skip(event.skip)
    .limit(5)
    .lookup({
      from: "user",
      localField: "_openid",
      foreignField: "_openid",
      as: "userInfo"
    }).end()
}
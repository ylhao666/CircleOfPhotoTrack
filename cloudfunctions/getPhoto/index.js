// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "development-ds5e1"
})

const db = cloud.database()
const photoCollection = db.collection("photo")
const friendCollection = db.collection("friend")
const userCollection = db.collection("user")

// 云函数入口函数
exports.main = async (event, context) => {
  let photo = await photoCollection.doc(event.photoId)
    .get()
  // 判断用户是否是好友关系
  if (cloud.getWXContext().OPENID != photo.data._openid) {
    const friends = await friendCollection.where({
      _openid: photo.data._openid
    }).get()
    if (friends.data[0].friend_group.indexOf(cloud.getWXContext().OPENID) < 0) {
      return null;
    }
  }
  // 获取用户信息
  const userInfo = await userCollection.where({
    _openid: photo.data._openid
  }).get()
  return {
    userInfo: userInfo.data[0],
    photoInfo: photo.data
  }
}
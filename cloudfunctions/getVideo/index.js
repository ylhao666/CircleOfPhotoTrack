// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const videoCollection = db.collection("video")
const friendCollection = db.collection("friend")
const userCollection = db.collection("user")

// 云函数入口函数
exports.main = async (event, context) => {
  let video = await videoCollection.doc(event.videoId)
    .get()
  // 判断用户是否是好友关系
  if (cloud.getWXContext().OPENID != video.data._openid) {
    const friends = await friendCollection.where({
      _openid: video.data._openid
    }).get()
    if (friends.data[0].friend_group.indexOf(cloud.getWXContext().OPENID) < 0) {
      return null;
    }
  }
  // 获取用户信息
  const userInfo = await userCollection.where({
    _openid: video.data._openid
  }).get()
  return {
    userInfo: userInfo.data[0],
    videoInfo: video.data
  }
}
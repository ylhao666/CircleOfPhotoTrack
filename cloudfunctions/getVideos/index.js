// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const friendCollection = db.collection("friend")
const videoCollection = db.collection("video")
const userCollection = db.collection("user")
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 判断用户是否是好友关系
  if (cloud.getWXContext().OPENID != event._openid) {
    const friends = await friendCollection.where({
      _openid: event._openid
    }).get()
    if (friends.data[0].friend_group.indexOf(cloud.getWXContext().OPENID) < 0) {
      return null;
    }
  }
  // 获取用户信息
  const userInfo = await userCollection.where({
    _openid: event._openid
  }).get()
  // 根据发布时间分组
  const videoList = await videoCollection.aggregate()
    .match({
      _openid: event._openid
    }).group({
      _id: '$create_time',
      list: $.push({
        _id: '$_id',
        like_number: '$like_number',
        introduction: '$introduction',
        thumbUrl: '$thumbUrl',
        videoUrl: '$videoUrl'
      })
    }).skip(event.skip)
    .limit(5)
    .project({
      _id: 0,
      create_time: '$_id',
      list: 1
    }).end()
  return {
    userInfo: userInfo.data[0],
    videoList: videoList.list
  }
}
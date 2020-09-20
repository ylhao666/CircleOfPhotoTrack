// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const subscribeMsgCollection = cloud.database().collection("subscribe_message")

// 云函数入口函数
exports.main = async (event, context) => {
  return subscribeMsgCollection.where({
    _openid: event.from_id,
    data: {
      userId: cloud.getWXContext().OPENID
    }
  }).update({
    data: {
      status: true
    }
  })
}
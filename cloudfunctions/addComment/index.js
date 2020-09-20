// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "development-ds5e1"
})

const db = cloud.database()
const commentCollection = db.collection("comment")

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.message
    })
    if (result.errCode == 0) {
      return commentCollection.add({
        data: {
          _openid: cloud.getWXContext().OPENID,
          file_id: event.file_id,
          message: event.message
        }
      })
    }
  } catch (error) {
    console.error(error);
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const photoCollection = db.collection("photo")
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return photoCollection.doc(event.photoId)
    .update({
      data: {
        like_number: _.inc(event.like)
      }
    })
}
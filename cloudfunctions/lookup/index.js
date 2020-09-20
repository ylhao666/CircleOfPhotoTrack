// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'development-ds5e1'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection(event.collection).aggregate().match(event.match)
      .skip(event.skip)
      .limit(event.limit)
      .lookup({
        from: event.from,
        localField: event.localField,
        foreignField: event.foreignField,
        as: event.as
      })
      .end()
  } catch (e) {
    console.error(e)
  }
}
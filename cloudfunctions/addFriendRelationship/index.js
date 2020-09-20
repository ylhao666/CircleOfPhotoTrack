// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "development-ds5e1"
})
const db = cloud.database()
const collection = db.collection('friend')
const _ = db.command

function addRelactionShip(fromOpenid, toOpenid) {
  return collection.where({
      _openid: fromOpenid
    }).get()
    .then(res => {
      console.log("获取用户好友信息", res)
      if (res.data.length == 0) {
        return collection.add({
          data: {
            _openid: fromOpenid,
            friend_group: [
              toOpenid
            ]
          }
        })
      } else {
        return collection.doc(res.data[0]._id).update({
            data: {
              friend_group: _.addToSet(toOpenid)
            }
          })
      }
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await addRelactionShip(wxContext.OPENID, event.friendOpenId)
      .then(res => {
        console.log(res)
        return addRelactionShip(event.friendOpenId, wxContext.OPENID)
      })
  } catch (error) {
    console.error(error);
  }
}
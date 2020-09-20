// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "development-ds5e1"
})
const db = cloud.database()
const subscribeMsgCollection = db.collection("subscribe_message")

// 发送信息
async function sendMessage(message) {
  const result = await cloud.openapi.subscribeMessage.send({
    touser: message._openid,
    page: message.page,
    lang: 'zh_CN',
    data: {
      thing2: {
        value: message.data.name
      },
      phrase3: {
        value: message.data.note
      }
    },
    templateId: message.templateId,
    miniprogramState: 'trial'
  })
  return result
}

// 云函数入口函数
exports.main = async (event, context) => {
  let messageList = await subscribeMsgCollection.where({
    status: true
  }).get()
  messageList = messageList.data
  messageList.forEach(message => {
    sendMessage(message)
      .then(res => {
        if (res.errCode == 0) {
          // 发送成功后删除信息
          subscribeMsgCollection.doc(message._id)
            .remove()
        }
      })
  })
}
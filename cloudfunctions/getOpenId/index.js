// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"development-ds5e1"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    openId: wxContext.OPENID
  }
}
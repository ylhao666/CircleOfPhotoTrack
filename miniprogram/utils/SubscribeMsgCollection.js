class SubscribeMsgCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.subscribeMsgCollection = this.db.collection("subscribe_message")
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 根据openId查询用户
      this._openid = getOpenIdRes.result.openId
    })
  }
  // 增加订阅消息
  addSubscribeMsg(name, userId) {
    return this.subscribeMsgCollection.add({
      data: {
        create_time: Date.now(),
        data: {
          name: name,
          note: "已通过",
          userId: userId
        },
        page: "pages/index/index",
        status: false,
        templateId: "_pxxT-aRlZIMzsZdPAhBJa47BnqvXMafbmXjKMNhiwA"
      }
    })
  }
  // 修改订阅状态
  modifySubscribeStatus(from_id) {
    return wx.cloud.callFunction({
      name: "modifySubscribeStatus",
      data: {
        from_id: from_id
      }
    })
  }
}

module.exports = new SubscribeMsgCollection()
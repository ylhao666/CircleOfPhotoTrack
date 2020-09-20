class FriendApplicationCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.friendApplicationCollection = this.db.collection('friend_application')
    this._ = this.db.command
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 根据openId查询用户
      this._openid = getOpenIdRes.result.openId
    })
  }
  // 新增好友申请
  addFirendApplication(receiveOpenId) {
    return this.friendApplicationCollection
      .where({
        _openid: this._openid,
        receive_openid: receiveOpenId
      }).count().then(count => {
        if (count.total == 0) {
          return this.friendApplicationCollection.add({
            data: {
              receive_openid: receiveOpenId,
              status: false
            }
          })
        }
      })
  }
  // 获取好友申请列表
  getApplyList(skip) {
    return wx.cloud.callFunction({
      name: 'lookup',
      data: {
        collection: 'friend_application',
        from: 'user',
        localField: '_openid',
        foreignField: '_openid',
        as: 'userInfo',
        skip: skip,
        limit: 15,
        match: {
          receive_openid: this._openid,
          status: false
        }
      }
    })
  }
  // 通过好友申请
  throughApplication(id) {
    return this.friendApplicationCollection
      .where({
        _id: id,
        receive_openid: this._openid,
        status: false
      }).update({
        data: {
          status: true
        }
      }).then(res => {
        return res
      })
  }
  // 获取通过申请好友列表
  getThroughApplyList(skip) {
    return wx.cloud.callFunction({
      name: 'lookup',
      data: {
        collection: 'friend_application',
        from: 'user',
        localField: '_openid',
        foreignField: '_openid',
        as: 'userInfo',
        skip: skip,
        limit: 15,
        match: {
          receive_openid: this._openid,
          status: true
        }
      }
    })
  }
}

module.exports = new FriendApplicationCollection()
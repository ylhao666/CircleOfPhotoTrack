class UserCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.userCollection = this.db.collection('user')
    this._ = this.db.command
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 根据openId查询用户
      this._openid = getOpenIdRes.result.openId
    })
  }
  // 新增用户
  addUserInfo(userInfo) {
    // 根据openId查询用户
    return this.getUserByOpenId(this._openid)
      .then(getUserRes => {
        if (getUserRes.data.length == 0) {
          return this.userCollection.add({
            data: userInfo
          })
        }
      })
  }
  // 根据openId查找用户
  getUserByOpenId(openId) {
    return this.userCollection.where({
      _openid: openId
    }).get()
  }
  // 根据用户名查询用户
  searchUser(userName) {
    return this.userCollection.where({
      nickName: this.db.RegExp({
        regexp: userName,
        options: 'i'
      }),
      _openid: this._.neq(this._openid)
    }).get()
  }
}

module.exports = new UserCollection()
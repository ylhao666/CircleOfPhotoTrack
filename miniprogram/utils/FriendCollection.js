class FriendCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.friendCollection = this.db.collection('friend')
    this._ = this.db.command
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 根据openId查询用户
      this._openid = getOpenIdRes.result.openId
    })
  }
  // 新增朋友
  addFriend(friendOpenId) {
    return wx.cloud.callFunction({
      name: 'addFriendRelationship',
      data: {
        friendOpenId: friendOpenId
      }
    })
  }
  // 获取朋友列表
  getFriends(skip) {
    return wx.cloud.callFunction({
      name: 'getFriends',
      data: {
        skip: skip
      }
    })
  }
  // 查询朋友
  async searchFriend(str) {
    let userCollection = require("../utils/UserCollection.js")
    // 获取查询到得用户列表
    let userList = await userCollection.searchUser(str)
    // 获取好友列表
    let friendGroup = await this.friendCollection.get()
    if (friendGroup.data.length == 0) {
      return [];
    }
    friendGroup = friendGroup.data[0].friend_group
    userList = userList.data
    // 好友列表
    let friendList = new Array()
    userList.forEach(user => {
      if (friendGroup.includes(user._openid)) {
        friendList.push(user)
      }
    })
    return friendList
  }
}

module.exports = new FriendCollection()
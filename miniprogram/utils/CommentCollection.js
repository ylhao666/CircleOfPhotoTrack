class CommentCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.commentCollection = this.db.collection('comment')
    this._ = this.db.command
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 根据openId查询用户
      this._openid = getOpenIdRes.result.openId
    })
  }
  // 文件评论
  addComment(file_id, message) {
    return wx.cloud.callFunction({
      name: 'addComment',
      data: {
        file_id: file_id,
        message: message
      }
    })
  }
  // 
  getComments(file_id, skip) {
    return wx.cloud.callFunction({
      name: 'lookup',
      data: {
        collection: 'comment',
        from: 'user',
        localField: '_openid',
        foreignField: '_openid',
        as: 'userInfo',
        skip: skip,
        limit: 10,
        match: {
          file_id: file_id
        }
      }
    })
  }

}

module.exports = new CommentCollection()
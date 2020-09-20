class LikeCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.likeCollection = this.db.collection('like')
    this._ = this.db.command
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 设置openid
      this._openid = getOpenIdRes.result.openId
    })
  }

  getLikeList(skip) {
    return wx.cloud.callFunction({
      name: 'lookup',
      data: {
        collection: 'like',
        from: 'photo',
        localField: 'file_id',
        foreignField: '_id',
        as: 'photoInfo',
        skip: skip,
        limit: 10,
        match: {
          _openid: this._openid
        }
      }
    })
  }
}

module.exports = new LikeCollection()
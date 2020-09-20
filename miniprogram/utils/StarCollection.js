class StarCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.starCollection = this.db.collection('star')
    this._ = this.db.command
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 设置openid
      this._openid = getOpenIdRes.result.openId
    })
  }
  // 获取收藏夹信息
  getStarList(skip) {
    return wx.cloud.callFunction({
      name: 'lookup',
      data: {
        collection: 'star',
        from: 'photo',
        localField: 'file_id',
        foreignField: '_id',
        as: 'photoInfo',
        skip: skip,
        limit: 5,
        match: {
          _openid: this._openid
        }
      }
    })
  }
}

module.exports = new StarCollection()
class VideoCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.videoCollection = this.db.collection('video')
    this.likeCollection = this.db.collection('like')
    this._ = this.db.command
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 设置openid
      this._openid = getOpenIdRes.result.openId
    })
  }
  // 新增视频
  addVideo(introduction, videoUrl, thumbUrl) {
    return this.videoCollection.add({
      data: {
        introduction: introduction,
        videoUrl: videoUrl,
        thumbUrl: thumbUrl,
        create_time: new Date().setHours(0, 0, 0, 0),
        like_number: 0
      }
    })
  }
  // 批量获取视频
  getVideos(userOpenId, skip) {
    return wx.cloud.callFunction({
      name: 'getVideos',
      data: {
        _openid: userOpenId,
        skip: skip
      }
    })
  }
  // 根据id获取视频信息
  getVideo(videoId) {
    return wx.cloud.callFunction({
      name: 'getVideo',
      data: {
        videoId: videoId
      }
    })
  }
}
module.exports = new VideoCollection()
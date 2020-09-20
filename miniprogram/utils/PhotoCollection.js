class PhotoCollection {
  constructor() {
    this.db = wx.cloud.database()
    this.photoCollection = this.db.collection('photo')
    this.likeCollection = this.db.collection('like')
    this.starCollection = this.db.collection("star")
    this._ = this.db.command
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(getOpenIdRes => {
      // 设置openid
      this._openid = getOpenIdRes.result.openId
    })
  }
  // 新增图片
  addPhotos(introduction, photoList) {
    return this.photoCollection.add({
      data: {
        introduction: introduction,
        photoList: photoList,
        create_time: new Date().setHours(0, 0, 0, 0),
        like_number: 0,
        star_number:0
      }
    })
  }
  // 点赞或取消点赞
  async giveALike(photoId, like) {
    const result = await wx.cloud.callFunction({
      name: 'modifyLikeNum',
      data: {
        photoId: photoId,
        like: like ? 1 : -1
      }
    })
    if (result.result.stats.updated) {
      if (like) {
        // 新增点赞
        this.likeCollection.add({
          data: {
            create_time: Date.now(),
            file_id: photoId
          }
        })
      } else {
        // 取消点赞
        this.likeCollection.where({
          file_id: photoId
        }).remove()
      }
    }
  }
  // 判断是否赞过该图片
  async isLikePhoto(photoId) {
    const result = await this.likeCollection.where({
      file_id: photoId
    }).count()
    return result.total > 0 ? true : false
  }
  // 判断是否收藏过该图片
  async isStarPhoto(photoId) {
    const result = await this.starCollection.where({
      file_id: photoId
    }).count()
    return result.total > 0 ? true : false
  }
  // 收藏或取消收藏
  async giveAStar(photoId, star) {
    const result = await wx.cloud.callFunction({
      name: 'modifyStarNum',
      data: {
        photoId: photoId,
        star: star ? 1 : -1
      }
    })
    if (result.result.stats.updated) {
      if (star) {
        // 新增收藏
        this.starCollection.add({
          data: {
            create_time: Date.now(),
            file_id: photoId
          }
        })
      } else {
        // 取消收藏
        this.starCollection.where({
          file_id: photoId
        }).remove()
      }
    }
  }
  // 批量获取图片
  getPhotos(userOpenId, skip) {
    return wx.cloud.callFunction({
      name: 'getPhotos',
      data: {
        _openid: userOpenId,
        skip: skip
      }
    })
  }
  // 根据id获取图片
  getPhoto(photoId){
    return wx.cloud.callFunction({
      name:'getPhoto',
      data:{
        photoId:photoId
      }
    })
  }
}

module.exports = new PhotoCollection()
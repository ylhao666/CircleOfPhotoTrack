const app = getApp()
const commentCollection = require("../../utils/CommentCollection.js")
const photoCollection = require("../../utils/PhotoCollection")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: "",
    goodJob: {
      goodJobIcon: false,
      goodJobInfo: 0
    },
    star: {
      starIcon: false,
      starInfo: 0
    },
    commentList: [],
    userInfo: {},
    photoInfo: {},
    skip: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLoginStatus()
    photoCollection.getPhoto(options.id)
      .then(res => {
        console.log(res)
        this.setData({
          userInfo: res.result.userInfo,
          photoInfo: res.result.photoInfo,
          "goodJob.goodJobInfo": res.result.photoInfo.like_number,
          "star.starInfo": res.result.photoInfo.star_number
        })
        // 判断是否点过赞
        photoCollection.isLikePhoto(res.result.photoInfo._id)
          .then(res => {
            this.setData({
              "goodJob.goodJobIcon": res
            })
          })
        // 判断是否收藏
        photoCollection.isStarPhoto(res.result.photoInfo._id)
          .then(res => {
            this.setData({
              "star.starIcon": res
            })
          })
        this.getComments(res.result.photoInfo._id, this.data.skip)
      })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      skip: 0,
      commentList: []
    }, () => {
      this.getComments(this.data.photoInfo._id, this.data.skip)
        .then(wx.stopPullDownRefresh())
    })
  },
  // 触底刷新
  onReachBottom: function () {
    this.setData({
      skip: this.data.skip + 1
    }, () => {
      this.getComments(this.data.photoInfo._id, this.data.skip)
    })
  },
  onUnload: function () {
    // 判断是否点过赞
    photoCollection.isLikePhoto(this.data.photoInfo._id)
      .then(res => {
        // 当点赞状态发生改变时
        if (res ^ this.data.goodJob.goodJobIcon) {
          // 修改点赞状态
          photoCollection.giveALike(this.data.photoInfo._id, this.data.goodJob.goodJobIcon)
        }
      })
    // 判断是否收藏过
    photoCollection.isStarPhoto(this.data.photoInfo._id)
      .then(res => {
        // 当收藏状态发生改变时
        if (res ^ this.data.star.starIcon) {
          // 修改收藏状态
          photoCollection.giveAStar(this.data.photoInfo._id, this.data.star.starIcon)
        }
      })
  },
  // 评论
  confirm: function (event) {
    console.log(this.data.comment)
    if (this.data.comment == "") {
      wx.showToast({
        title: '请输入评论',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '提交中',
      })
      commentCollection.addComment(this.data.photoInfo._id, this.data.comment)
        .then(res => {
          if (res.result == null) {
            wx.showToast({
              title: '内容含有违法违规内容',
              icon: 'none'
            })
          }
          if (res.result.errMsg == "collection.add:ok") {
            this.setData({
              comment: ""
            })
            wx.showToast({
              title: '提交成功',
            })
          }
          wx.hideLoading()
        })
    }
  },
  // 点赞
  clickGoodJob: function (event) {
    this.setData({
      goodJob: {
        goodJobIcon: !this.data.goodJob.goodJobIcon,
        goodJobInfo: this.data.goodJob.goodJobIcon ? this.data.goodJob.goodJobInfo - 1 : this.data.goodJob.goodJobInfo + 1
      }
    })
  },
  // 收藏
  clickStar: function () {
    this.setData({
      star: {
        starIcon: !this.data.star.starIcon,
        starInfo: this.data.star.starIcon ? this.data.star.starInfo - 1 : this.data.star.starInfo + 1
      }
    })
  },
  //查看图片
  viewPhoto: function (event) {
    wx.previewImage({
      urls: this.data.photoInfo.photoList
    })
  },
  // 获取评论
  getComments: async function (file_id, skip) {
    // 获取评论
    commentCollection.getComments(file_id, skip * 10)
      .then(res => {
        this.setData({
          commentList: this.data.commentList.concat(res.result.list)
        })
      })
  }
})
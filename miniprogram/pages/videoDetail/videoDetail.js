const videoCollection = require("../../utils/VideoCollection.js")
const commentCollection = require("../../utils/CommentCollection.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoInfo: {},
    userInfo: {},
    commentList:[],
    comment:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLoginStatus()
    videoCollection.getVideo(options.id)
      .then(res => {
        console.log(res)
        this.setData({
          userInfo: res.result.userInfo,
          videoInfo: res.result.videoInfo
        })
        // 获取评论
        commentCollection.getComments(res.result.videoInfo._id)
          .then(res => {
            this.setData({
              commentList: res.result.list
            })
          })
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
      commentCollection.addComment(this.data.videoInfo._id, this.data.comment)
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

})
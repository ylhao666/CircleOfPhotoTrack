const likeCollection = require("../../utils/LikeCollection.js")
const dateUtils = require("../../utils/DateUtils.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeList: [],
    skip: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLoginStatus()
    this.getLikeList(this.data.skip)
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      skip: 0,
      likeList: []
    }, () => {
      this.getLikeList(this.data.skip)
      wx.stopPullDownRefresh()
    })
  },
  // 触底刷新
  onReachBottom: function () {
    this.setData({
      skip: this.data.skip + 1
    }, () => {
      this.getLikeList(this.data.skip)
    })
  },
  getLikeList: async function (skip) {
    likeCollection.getLikeList(skip * 10)
      .then(res => {
        this.setData({
          likeList: this.data.likeList.concat(res.result.list.map(item => {
            return {
              _id: item._id,
              _openid: item._openid,
              create_time: dateUtils.timeStampFormat(item.create_time),
              file_id: item.file_id,
              photoInfo: item.photoInfo
            }
          }))
        })
      })
  }

})
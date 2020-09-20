const starCollection = require("../../utils/StarCollection.js")
const dateUtils = require("../../utils/DateUtils.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starList: [],
    skip: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLoginStatus()
    this.getStarList(this.data.skip)
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      skip: 0,
      starList: []
    }, () => {
      this.getStarList(this.data.skip)
      wx.stopPullDownRefresh()
    })
  },
  // 触底刷新
  onReachBottom: function () {
    this.setData({
      skip: this.data.skip + 1
    }, () => {
      this.getStarList(this.data.skip)
    })
  },
  getStarList: async function (skip) {
    starCollection.getStarList(skip * 5)
      .then(res => {
        this.setData({
          starList: this.data.starList.concat(res.result.list.map(item => {
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
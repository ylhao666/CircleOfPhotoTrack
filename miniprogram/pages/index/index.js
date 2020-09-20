const app = getApp()
const dateUtils = require("../../utils/DateUtils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skip: 0,
    msgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLoginStatus()
      .then(() => {
        // 判断用户是否登录
        if (app.globalData.user.userInfo) {
          this.getMsg(this.data.skip)
        }
      })
  },
  onShow: function () {
    app.checkLoginStatus()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      skip: 0,
      msgList: []
    }, () => {
      this.getMsg(this.data.skip)
        .then(() => {
          wx.stopPullDownRefresh()
        })
    })
  },
  // 触底刷新
  onReachBottom: function () {
    wx.showLoading()
    this.setData({
      skip: this.data.skip + 1
    }, () => {
      this.getMsg(this.data.skip)
        .then(() => {
          wx.hideLoading()
        })
    })
  },
  // 获取消息列表
  async getMsg(skip) {
    wx.cloud.callFunction({
      name: "getRecentMsg",
      data: {
        skip: skip * 5
      }
    }).then(res => {
      this.setData({
        msgList: this.data.msgList.concat(res.result.list.filter(item => !this.data.msgList.some(msg => msg._id === item._id)).map(item => {
          return {
            _id: item._id,
            create_time: dateUtils.timeStampFormat(item.create_time),
            introduction: item.introduction,
            like_number: item.like_number,
            photoList: item.photoList,
            _openid: item._openid,
            star_number: item.star_number,
            userInfo: item.userInfo,
          }
        }))
      })
    })
  },
  viewPhotoDetail: function (event) {
    wx.navigateTo({
      url: '../photoDetail/photoDetail?id=' + event.target.dataset.id,
    })
  }
})
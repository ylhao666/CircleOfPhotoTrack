const app = getApp()
const photoCollection = require("../../utils/PhotoCollection.js")
const videoCollection = require("../../utils/VideoCollection.js")
const dateUtils = require("../../utils/DateUtils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    photoList: [],
    videoList: [],
    loading: true,
    skip: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    if (app.globalData.user.userInfo) {
      this.getPhotos(this.data.skip)
      this.getVideos(this.data.skip)
    }
  },
  onShow: function () {
    app.checkLoginStatus()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      skip: 0,
      photoList: [],
      videoList: []
    }, () => {
      this.getPhotos(this.data.skip)
      this.getVideos(this.data.skip)
        .then(() => {
          wx.stopPullDownRefresh()
        })
    })
  },
  // 触底回调
  onReachBottom: function () {
    wx.showLoading()
    this.setData({
      skip: this.data.skip + 1
    }, () => {
      this.getPhotos(this.data.skip)
        .then(wx.hideLoading())
    })
  },
  // 上传文件
  uploadFile: function () {
    console.log(this.data.tabIndex)
    if (this.data.tabIndex) {
      // 上传视频
      wx.navigateTo({
        url: '../addVideos/addVideos',
      })
    } else {
      // 上传图片
      wx.navigateTo({
        url: '../addPhotos/addPhotos',
      })
    }
  },
  // 改变tab栏回调
  changeTab: function (event) {
    this.setData({
      tabIndex: event.detail.index
    })
  },
  // 获取图片
  getPhotos: async function (skip) {
    photoCollection.getPhotos(photoCollection._openid, skip * 5)
      .then(res => {
        this.setData({
          photoList: this.data.photoList.concat(res.result.photoList.map(item => {
            return {
              list: item.list,
              create_time: dateUtils.timeStampFormat(item.create_time)
            }
          }))
        })
      })
  },
  // 获取视频
  getVideos: async function (skip) {
    videoCollection.getVideos(videoCollection._openid, skip * 5)
      .then(res => {
        console.log(res)
        this.setData({
          videoList: this.data.videoList.concat(res.result.videoList.map(item => {
            return {
              list: item.list,
              create_time: dateUtils.timeStampFormat(item.create_time)
            }
          }))
        })
      })
  }
})
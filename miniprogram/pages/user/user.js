const photoCollection = require("../../utils/PhotoCollection.js")
const videoCollection = require("../../utils/VideoCollection.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    photoList: [],
    videoList: [],
    photoSkip: 0,
    videoSkip: 0,
    tabIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取图片options._openid
    this.getPhotos(options._openid, this.data.photoSkip)
    // 获取视频
    this.getVideos(options._openid, this.data.videoSkip)
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    if (this.data.tabIndex) {
      // 刷新视频
      this.setData({
        videoSkip: 0,
        videoList: []
      }, () => {
        this.getVideos(this.data.userInfo._openid, this.data.videoSkip)
          .then(() => {
            wx.stopPullDownRefresh()
          })
      })
    } else {
      // 刷新图片
      this.setData({
        photoSkip: 0,
        photoList: []
      }, () => {
        this.getPhotos(this.data.userInfo._openid, this.data.photoSkip)
          .then(() => {
            wx.stopPullDownRefresh()
          })
      })
    }
  },
  // 触底刷新
  onReachBottom: function () {
    wx.showLoading()
    if (this.data.tabIndex) {
      this.setData({
        videoSkip: this.data.videoSkip + 1
      }, () => {
        this.getVideos(this.data.userInfo._openid, this.data.videoSkip)
          .then(wx.hideLoading())
      })
    } else {
      // 查询图片
      this.setData({
        photoSkip: this.data.photoSkip + 1
      }, () => {
        this.getPhotos(this.data.userInfo._openid, this.data.photoSkip)
          .then(wx.hideLoading())
      })
    }
  },
  // 获取图片
  getPhotos: async function (_openid, skip) {
    photoCollection.getPhotos(_openid, skip * 3)
      .then(res => {
        this.setData({
          userInfo: res.result.userInfo,
          photoList: this.data.photoList.concat(res.result.photoList.map(item => {
            return {
              list: item.list,
              create_time: `${new Date(item.create_time).getFullYear()}/${new Date(item.create_time).getMonth()+1}/${new Date(item.create_time).getDate()}`
            }
          }))
        })
      })
  },
  // 获取视频
  getVideos: async function (_openid, skip) {
    videoCollection.getVideos(_openid, skip * 3)
      .then(res => {
        console.log(res)
        this.setData({
          videoList: this.data.videoList.concat(res.result.videoList.map(item => {
            return {
              list: item.list,
              create_time: `${new Date(item.create_time).getFullYear()}/${new Date(item.create_time).getMonth()+1}/${new Date(item.create_time).getDate()}`
            }
          }))
        })
      })
  },
  // 
  changeTab: function (event) {
    this.setData({
      tabIndex: event.detail.index
    })
  }
})
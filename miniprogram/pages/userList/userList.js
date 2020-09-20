const app = getApp()
const friendCollection = require("../../utils/FriendCollection.js")
const userCollection = require("../../utils/UserCollection.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends: [],
    skip: 0,
    value: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLoginStatus()
    this.getFriends(this.data.skip)
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      skip: 0,
      friends: []
    }, () => {
      this.getFriends(this.data.skip)
        .then(wx.stopPullDownRefresh())
    })
  },
  // 触底加载
  onReachBottom: function () {
    this.setData({
      skip: this.data.skip + 1
    }, () => {
      this.getFriends(this.data.skip)
    })
  },
  // 获取好友列表
  getFriends: async function (skip) {
    friendCollection.getFriends(skip * 10)
      .then(res => {
        this.setData({
          friends: this.data.friends.concat(res.result.data)
        })
      })
  },
  // 查询好友
  searchUser: async function (event) {
    wx.showLoading({
      title: '搜索中',
    })
    friendCollection.searchFriend(event.detail)
      .then(friendList => {
        console.log(friendList)
        this.setData({
          friends: friendList
        })
        wx.hideLoading()
      })
  }
})
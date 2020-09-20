const app = getApp()
const friendApplicationCollection = require("../../utils/FriendApplicationCollection.js")
const friendCollection = require("../../utils/FriendCollection.js")
const subscribeMsgCollection = require("../../utils/SubscribeMsgCollection.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newFriendList: [],
    throughFriendList: [],
    activeTab: 0,
    newApplySkip: 0,
    throughApplySkip: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 检查用户登录状态
    app.checkLoginStatus()
    wx.showLoading({
      title: '加载中',
    })
    // 获取申请列表
    this.getApplyList(this.data.newApplySkip)
      .then(() => {
        wx.hideLoading()
        this.getThroughApplyList(this.data.throughApplySkip)
      })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    if (this.data.activeTab == 0) {
      // 获取申请列表
      this.setData({
        newApplySkip: 0,
        newFriendList: []
      }, () => {
        this.getApplyList(this.data.newApplySkip)
          .then(wx.stopPullDownRefresh())
      })
    } else {
      // 获取通过列表
      this.setData({
        throughApplySkip: 0,
        throughFriendList: []
      }, () => {
        this.getThroughApplyList(this.data.throughApplySkip)
          .then(() => {
            wx.stopPullDownRefresh()
          })
      })
    }
  },
  // 通过好友申请
  throughApplication: function (event) {
    friendApplicationCollection.throughApplication(event.target.dataset.id)
      .then(res => {
        console.log(res)
        if (res.stats.updated == 1) {
          wx.showToast({
            title: '已通过该申请'
          })
          this.onPullDownRefresh()
          // 添加好友关系
          friendCollection.addFriend(event.target.dataset.openid)
            .then(res => {
              console.log(res)
            })
          // 修改消息订阅状态
          console.log(event.target.dataset.openid)
          console.log(subscribeMsgCollection._openid)
          subscribeMsgCollection.modifySubscribeStatus(event.target.dataset.openid)
            .then(res => {
              console.log(res)
            })
        }
      })
  },
  // 改变tab回调
  changeTab: function (event) {
    this.setData({
      activeTab: event.detail.index
    })
  },
  // 获取好友申请列表
  getApplyList: async function (skip) {
    const res = await friendApplicationCollection.getApplyList(skip * 15)
    this.setData({
      newFriendList: this.data.newFriendList.concat(res.result.list)
    })
  },
  // 获取已通过好友列表
  getThroughApplyList: async function (skip) {
    const res = await friendApplicationCollection.getThroughApplyList(skip * 15)
    this.setData({
      throughFriendList: this.data.throughFriendList.concat(res.result.list)
    })
  }
})
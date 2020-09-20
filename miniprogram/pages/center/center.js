// pages/center/center.js
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
const userCollection = require("../../utils/UserCollection.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      userInfo: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.user.userInfo) {
      this.setData({
        user: {
          userInfo: app.globalData.user.userInfo
        }
      })
    }
  },
  onShow: function () {
    if(!app.globalData.user.userInfo){
      this.setData({
        user: {
          userInfo: null
        }
      })
    }
  },
  // 初始化
  init: function () {
    app.checkLoginStatus()
      .then(() => {
        wx.showLoading({
          title: '授权登录中',
        })
        return userCollection.addUserInfo(app.globalData.user.userInfo)
      })
      .then(res => {
        this.setData({
          user: {
            userInfo: app.globalData.user.userInfo
          }
        })
        wx.hideLoading()
      })
  },

  // 授权登录函数
  login: function (event) {
    // 用户取消授权时
    if (event.detail.errMsg == "getUserInfo:fail auth deny") {
      this.setData({
        showDialog: true
      })
    } else {
      // 获取用户授权后初始化
      this.init()
    }
  }
})
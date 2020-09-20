const userCollection = require('../../utils/UserCollection.js')
const friendApplicationCollection = require("../../utils/FriendApplicationCollection.js")
const subscribeMsgCollection = require("../../utils/SubscribeMsgCollection.js")
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    dialogShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 查询用户
  searchUser: function (event) {
    if (event.detail == "") {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '查询中',
    })
    userCollection.searchUser(event.detail)
      .then(searchRes => {
        // 查询不到用户时
        if (!searchRes.data.length) {
          wx.showToast({
            title: '未查询到该用户',
            icon: 'loading'
          })
        }
        this.setData({
          userList: searchRes.data
        })
        wx.hideLoading()
      })
  },
  // 添加用户
  addUser: function (event) {
    Dialog.confirm({
      selector: '#apply-dialog',
      title: `申请添加${event.target.dataset.nickname}为好友`,
      message: '申请后需等待对方通过申请',
      asyncClose: true,
      confirmButtonColor: '#1989FA',
      context: this
    })
  },
  // 弹窗取消后回调
  closeDialog: function () {
    Dialog.close()
  },
  // 发送好友申请
  sendApplication: function (event) {
    friendApplicationCollection.addFirendApplication(event.target.dataset.useropenid)
      .then(res => {
        if (res) {
          this.setSubscribeMsg()
        } else {
          wx.showToast({
            title: '该用户已是好友关系',
            icon: 'none'
          })
        }
        Dialog.close()
      }).catch(err => {
        console.error(err);
        Dialog.close()
      })
  },
  // 订阅消息订阅提醒
  setSubscribeMsg: function () {
    Dialog.confirm({
      selector: '#subscribe-dialog',
      title: '已发出好友申请',
      message: '好友通过申请后将通过订阅消息提醒您',
      confirmButtonColor: '#1989FA',
      context: this
    })
  },
  // 增加订阅消息
  sendSubscribeMsg: function (event) {
    wx.requestSubscribeMessage({
      tmplIds: ["_pxxT-aRlZIMzsZdPAhBJa47BnqvXMafbmXjKMNhiwA"],
      success: res => {
        console.log(res)
        if (res['_pxxT-aRlZIMzsZdPAhBJa47BnqvXMafbmXjKMNhiwA'] == "accept") {
          // 增加订阅消息
          subscribeMsgCollection.addSubscribeMsg(event.target.dataset.name, event.target.dataset._openid)
        }
      },
      fail: err => {
        console.error(err);
      }
    })
  }
})
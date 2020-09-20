import Notify from '@vant/weapp/notify/notify';
App({
  globalData: {
    user: {
      userInfo: null
    },
    friendApplyWatcher: null,
  },
  onLaunch: function () {
    wx.cloud.init({
      env: 'development-ds5e1',
      traceUser: true
    })
    this.checkLoginStatus()
      .then(() => {
        this.globalData.friendApplyWatcher = this.getFriendApplyWatcher()
      })
  },
  checkLoginStatus: function () {
    return new Promise((resolve, reject) => {
      // 获取用户授权情况
      wx.getSetting({
        success: res => {
          // 未授权的话跳转到用户授权页面
          if (!res.authSetting["scope.userInfo"]) {
            wx.showToast({
              title: '未授权登录',
              icon: 'loading',
              complete: res => {
                this.globalData.user.userInfo = null
                wx.switchTab({
                  url: '/pages/center/center'
                })
              }
            })
          } else {
            // 获取用户信息
            wx.getUserInfo({
              success: res => {
                this.globalData.user.userInfo = res.userInfo
                resolve()
              }
            })
          }
        }
      })
    })
  },
  // 获取好友申请监听器
  getFriendApplyWatcher: function () {
    return wx.cloud.database()
      .collection("friend_application")
      .where({
        receive_openid: '{openid}',
        status: false
      }).watch({
        onChange: snapshot => {
          console.log('docs\'s changed events', snapshot.docChanges)
          // 获取数据更新事件数组
          let docChanges = snapshot.docChanges
          docChanges.forEach(change => {
            // 当收到好友申请时
            if (change.dataType == "add" && change.queueType == "enqueue") {
              console.log("receive friendApplication", change.doc)
              Notify({
                type: 'primary',
                message: '你有新的好友申请'
              })
            }
          })
        },
        onError: err => {
          console.error('the watch closed because of error', err)
        }
      })
  }
})
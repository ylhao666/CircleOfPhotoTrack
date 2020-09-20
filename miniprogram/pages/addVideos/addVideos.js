const userCollection = require("../../utils/UserCollection.js")
const videoCollection = require("../../utils/VideoCollection.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: "",
    showVideo: false,
    introduction: ""
  },

  onShow:function(){
    app.checkLoginStatus()
  },
  // 添加视频
  addVideo: function () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      maxDuration: 30,
      success: res => {
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        const {
          tempFilePath,
          thumbTempFilePath
        } = res.tempFiles[0]
        // 上传视频
        this.uploadFilePromise(`${userCollection._openid}/videos/${Math.random()*10000000000}.${tempFilePath.substring(tempFilePath.lastIndexOf(".")+1)}`, tempFilePath)
          .then(data => {
            // 上传封面
            this.setData({
              videoUrl: data.fileID,
              showVideo: true
            })
            return this.uploadFilePromise(`${userCollection._openid}/photos/${Math.random()*10000000000}.${thumbTempFilePath.substring(thumbTempFilePath.lastIndexOf(".")+1)}`, thumbTempFilePath)
          }).then(data => {
            wx.hideLoading()
            this.setData({
              thumbUrl: data.fileID
            })
          })
      }
    })
  },
  // 上传视频
  uploadFilePromise: function (fileName, filePath) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: filePath
    })
  },
  // 删除视频
  deleteVideo: function (event) {
    wx.showLoading({})
    wx.cloud.deleteFile({
      fileList: [this.data.videoUrl, this.data.thumbUrl]
    }).then(res => {
      wx.hideLoading()
      this.setData({
        videoUrl: "",
        showVideo: false
      })
      this.addVideo()
    })
  },
  release: function () {
    if (this.data.introduction == "") {
      wx.showToast({
        title: '请输入简介',
        icon: 'none'
      })
      return
    }
    if (this.data.videoUrl == "") {
      wx.showToast({
        title: '请选择一段视频',
        icon: 'none'
      })
      return
    }
    // 发布视频
    videoCollection.addVideo(this.data.introduction, this.data.videoUrl, this.data.thumbUrl)
      .then(res => {
        if (res.errMsg == "collection.add:ok") {
          wx.showToast({
            title: '发布成功'
          })
          wx.switchTab({
            url: '../fileList/fileList',
          })
        }else{
          wx.showToast({
            title: '网络异常',
          })
        }
      })
  }
})
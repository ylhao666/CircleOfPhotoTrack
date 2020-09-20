const userCollection = require("../../utils/UserCollection.js")
const photoCollection = require("../../utils/PhotoCollection.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    introduction: "",
    introduction: ""
  },
  onShow: function () {
    app.checkLoginStatus()
  },
  // 校验图片格式
  beforeRead: function (event) {
    const {
      file,
      callback
    } = event.detail
    file.forEach(item => {
      if (!this.isAssetTypeAnImage(item.path.substring(item.path.lastIndexOf(".") + 1))) {
        callback(false)
        wx.showToast({
          title: '图片格式错误',
          icon: 'none'
        })
        return
      }
    })
    callback(true)
  },
  // 添加图片
  addPhoto: function (event) {
    console.log(event)
    wx.showLoading({
      title: '上传中',
    })
    const uploadTasks = event.detail.file.map((file) => {
      return this.uploadFilePromise(`${userCollection._openid}/photos/${Math.random()*10000000000}.${file.path.substring(file.path.lastIndexOf(".")+1)}`, file.path)
    })
    Promise.all(uploadTasks)
      .then(data => {
        wx.hideLoading()
        console.log(data)
        const newFileList = data.map(item => {
          return {
            url: item.fileID,
            isImage: true
          }
        })
        this.setData({
          fileList: this.data.fileList.concat(newFileList)
        })
      })
  },
  // 上传图片
  uploadFilePromise: function (fileName, filePath) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: filePath
    })
  },
  // 删除图片
  deletePhoto: function (event) {
    wx.cloud.deleteFile({
      fileList: [event.detail.file.url]
    }).then(res => {
      let newFileList = JSON.parse(JSON.stringify(this.data.fileList))
      newFileList.splice(event.detail.index, 1)
      this.setData({
        fileList: newFileList
      })
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
    if (this.data.fileList.length == 0) {
      wx.showToast({
        title: '请至少选择一张图片',
        icon: 'none'
      })
      return
    }
    photoCollection.addPhotos(this.data.introduction, this.data.fileList.map(file => file.url))
      .then(res => {
        if (res.errMsg == "collection.add:ok") {
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          })
          wx.switchTab({
            url: '../fileList/fileList',
          })
        }
      })
  },
  isAssetTypeAnImage: function (ext) {
    return [
      'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'
    ].
    indexOf(ext.toLowerCase()) !== -1;
  }
})
# 图迹圈

## 项目介绍

图迹圈提供一个平台给予用户分享自己喜欢的图片或视频，并提供诸如点赞，评论之类的社交功能。

### 项目演示

项目GitHub地址：**https://github.com/ylhao666/CircleOfPhotoTrack**

项目演示视频：**https://v.qq.com/x/page/y31538sixzf.html**

### 项目结构

```
root
├── cloudfunctions -- 云函数
├── miniprogram -- 小程序源码
└── project.config.json -- 项目配置
```

### 功能模块划分

![功能模块划分图](https://mmbiz.qpic.cn/mmbiz_png/dbt7tI6635ykRrHian3oiba2OwOlcSdKicJcYRibUVMQQMDLWB6A1Ffzu1kzjrMZtBJD2kUibrTzplOxOWTfhQxZo2Q/0?wx_fmt=png)

### 引用UI组件

**Vant Weapp**

GitHub地址：**https://github.com/youzan/vant-weapp**

## 项目启动流程

### 1.创建项目所需集合

|       集合名       |     描述     |           数据权限           |
| :----------------: | :----------: | :--------------------------: |
|      comment       |   评论集合   |        仅创建者可读写        |
|       friend       |   好友集合   |        仅创建者可读写        |
| friend_application | 好友申请集合 |            自定义            |
|        like        |   点赞集合   |        仅创建者可读写        |
|       photo        | 分享图片集合 |        仅创建者可读写        |
|        star        | 收藏图片集合 |        仅创建者可读写        |
| subscribe_message  | 订阅消息集合 |        仅创建者可读写        |
|        user        | 用户信息集合 | 所有用户可读，仅创建者可读写 |
|       video        | 分享视频集合 |        仅创建者可读写        |

### 2.修改需自定义的集合数据权限

**friend_application**

```json
{
  "read": "doc._openid == auth.openid || doc.receive_openid == auth.openid",
  "write": "doc._openid == auth.openid || doc.receive_openid == auth.openid"
}
```

### 3.修改初始化云开发环境

**.\miniprogram\app.js**

```javascript
onLaunch: function () {
    wx.cloud.init({
      env: '${env}',
      traceUser: true
    })
  }
```

### 4.部署上传云函数

```
├─addComment
├─addFriendRelationship
├─getFriends
├─getOpenId
├─getPhoto
├─getPhotos
├─getRecentMsg
├─getVideo
├─getVideos
├─lookup
├─modifyLikeNum
├─modifyStarNum
├─modifySubscribeStatus
└─sendSubscribeMessage
```

### 5.修改订阅消息模板id

关于订阅消息：**https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html**

申请订阅消息

![image-20200920163042205](.\image-20200920163042205.png)

修改订阅消息模板 **templateId**

**.\miniprogram\utils\SubscribeMsgCollection.js**

```javascript
// 增加订阅消息
  addSubscribeMsg(name, userId) {
    return this.subscribeMsgCollection.add({
      data: {
        create_time: Date.now(),
        data: {
          name: name,
          note: "已通过",
          userId: userId
        },
        page: "pages/index/index",
        status: false,
        templateId: "${templateId}"
      }
    })
  }
```

## 项目效果截图

#### 主页

[主页](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/9e7b6612a74306f8457d42c68954009.jpg?imageMogr2/thumbnail/500x)  [图片详情](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/8b80b051ecf14eab1bab19bfc70f41c.jpg?imageMogr2/thumbnail/500x)  [图片评论](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/e702260e3f750c36e1196b9d567c1a2.jpg?imageMogr2/thumbnail/500x)

#### 文件列表
[图片](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/78913ec21dfe11e8e9e496c373129e7.jpg?imageMogr2/thumbnail/500x) [视频](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/5465110f326ce3227be3c2c1d8e5f1a.jpg?imageMogr2/thumbnail/500x)

#### 个人中心

[个人中心](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/bec5395c8ea77f2bde2b6e00d016f44.jpg?imageMogr2/thumbnail/500x) [好友列表](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/cdd1da09c6b921c9ff66c97dd3548a6.jpg?imageMogr2/thumbnail/500x) [点赞列表](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/d8029e4525170b762d4527701e25d48.jpg?imageMogr2/thumbnail/500x) [收藏列表](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/15e97dc002844ccb71a7c07078d3bd3.jpg?imageMogr2/thumbnail/500x) [好友申请列表](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/137939a03f97805ea6d1e02ad29509b.jpg?imageMogr2/thumbnail/500x) [通过列表](https://ylhaaa-1259802962.cos.ap-guangzhou.myqcloud.com/Circle%20of%20photo%20track/389f0f60e45a08cdd485976a3f54f17.jpg?imageMogr2/thumbnail/500x)

## 关于作者

```java
System.out.println("Come on!")
```

来自东莞-菜鸡-**Ylhaaa**


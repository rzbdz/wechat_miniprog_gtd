# 云开发 TodoList 模板

这是使用云开发能力构建的待办事项小程序模板，其中演示了云开发三大基础能力的使用：

- 数据库：对文档型数据库进行读写
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码
  
## 部署方式

- 在左上角点击【云开发】按钮，进入云开发控制台。
- 如果没有环境则按照提示开通云开发环境
- 进入云开发环境，在【设置】页复制`环境ID`
- 在控制台数据库页，创建云开发数据库 `todo`
- 右键点击 `cloudfunctions/getOpenId` 文件夹，选择云函数云端安装依赖上传
- 如果在新建项目时，小程序下有云开发环境，则会默认注入第一个环境，如果想更换为自己想要的环境，只需要将 `miniprogram/envList.js` 文件里的内容全部替换成如下，注意替换envId
``` js
module.exports = {
  envList: [{
    envId:'上述步骤中你获得的环境ID'
  }]
}
```
- 运行即可，如果想快速学习掌握云开发，可以参考如下训练营直播回放教程
	- [小程序云开发基础能力讲解](https://developers.weixin.qq.com/community/business/doc/000886e019c398607cfb749b85840d)
	- [小程序云开发进阶能力讲解](https://developers.weixin.qq.com/community/business/doc/000ec6acee06e89dd42b88a615ec0d)
	- [小程序云开发高阶能力&案例讲解](https://developers.weixin.qq.com/community/business/doc/000a2c97b14c883dd42b040aa5bc0d)

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)


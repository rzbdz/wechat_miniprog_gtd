# 包工头 Todolist 小程序

![bao](https://gitee.com/rzbdz/wechat_miniprog_gtd/raw/master/.res/bao.png)

当今社会，每个人都有很多任务要处理。根据 GTD 理论，能马上完成的事情必须尽早完成，能马上开始的事情必须尽早开始，能外包的事情绝不自己做，一下子做不完的事情 DDL 没到之前能不做就不做。

本小程序**执行部分**根据 GTD 理论，只抽象出**死线**和**条目**两个概念，通过用户提前注入场景，如时间点触发，地理位置触发，生活场景触发。

将**条目**根据场景分为各种不同类型的执行促进生活场景全链路打通，利用小程序 API 获取地理时间信息形成抓手，使用户生活形成闭环。

提供社区小组团购功能，让小组作业再也不扯皮。

更新：
因为设计库表太麻烦了，暂时重新简化一下概念，每个项目的子条目状态只划分为等待事件和可做事件。每个事件可以设置 ddl 或者不设置。
每个事件可以设置等待，等待既可以是外包事件，也可以是特定事件、条件触发事件，不属于能马上完成的。

![bao](https://gitee.com/rzbdz/wechat_miniprog_gtd/raw/master/.res/ddl.png)

---

因为外包部分很麻烦，所以外包部分等待版本更新。

互联网发展进入第三阶段后，物理世界逐渐实现全面数字化。这意味着生产力和生产关系发生了变化，个人需求和形式也必须随之改变，才能够更好地应对挑战。

传统的 GTD 只是针对个人业务管理，每个人的 GTD 系统不一样，很难形成闭环，打通全链路聚合，这次我的小程序通过提供统一的生态，精细化沟通写作，减少分歧。

通过包工头 Todolist 小程序，提供一个包工头和牛马力工的统一沟通、协作平台，重构协同办公，使得计划到位，目标清晰，通过暴露互联网外包的抓手，精准施策，耦合 GTD 理论，打通 GTD 全链路生态，赋能大家的日常生活，让外包力工和外包包工头之间最终形成完美的闭环，对齐双方，凝聚公式，解决 GTD 在外包工程应用过程中的痛点。


## 小程序设计：
### Now :
根据 GTD 的理论，这里必须有一个 Inbox 收件箱处理各种事情的，为了专注外包项目，这里必须从项目来规划。
现在这个 Now 是 GTD 理论中的根据 Trigger list 来触发的当前子任务。
### Deadline：
这个是项目的起点和重点。全程进度跟踪。DDL 警告。

### Community：
社区页面，完成外包指派。外包之前必须生成完整的外包项目。
社区首页是个人 profile，每个人在社区都有两个职责：
    - 包工头
    - 牛马力工
包工头页面：
 - 看到所有的 Bag Male head 发布的信息
 - 可以发布新的Bag Male 任务
单个外包项目详情页面：
 - 看到包公完成进度，可以加钱和扣钱
 - 不能改合同
 牛马力工页面：
  - 首先是包公大厅，领取最新包公
  - 然后是完成包公任务。
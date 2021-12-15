App({
  async onLaunch() {
    this.initcloud()

    this.globalData = {
      // 用于存储待办记录的集合名称
      cachedopenid: "",
    }
    
    console.log((await (await this.cloud()).callFunction({
      name: 'register'
    })).result);
    // result has a message and a result
    // in result: 
    // _id: "xxx"
    // _openid: "xxx"
    // _projects: []

  },

  st: function(to) {
    wx.navigateTo({
      url: to,
    })
  },
  flag: false,
  /**
   * 初始化云开发环境（支持环境共享和正常两种模式）
   */
  async initcloud() {
    const shareinfo = wx.getExtConfigSync() // 检查 ext 配置文件
    const normalinfo = require('./envList.js').envList || [] // 读取 envlist 文件
    if (shareinfo.envid != null) { // 如果 ext 配置文件存在，环境共享模式
      this.c1 = new wx.cloud.Cloud({ // 声明 cloud 实例
        resourceAppid: shareinfo.appid,
        resourceEnv: shareinfo.envid,
      })
      // 装载云函数操作对象返回方法
      this.cloud = async function() {
        if (this.flag != true) { // 如果第一次使用返回方法，还没初始化
          await this.c1.init() // 初始化一下
          this.flag = true // 设置为已经初始化
        }
        return this.c1 // 返回 cloud 对象
      }
    } else { // 如果 ext 配置文件存在，正常云开发模式
      if (normalinfo.length != 0 && normalinfo[0].envId != null) { // 如果文件中 envlist 存在
        wx.cloud.init({ // 初始化云开发环境
          traceUser: true,
          env: normalinfo[0].envId
        })
        // 装载云函数操作对象返回方法
        this.cloud = () => {
          return wx.cloud // 直接返回 wx.cloud
        }
      } else { // 如果文件中 envlist 不存在，提示要配置环境
        this.cloud = () => {
          throw new Error('当前小程序没有配置云开发环境，请在 envList.js 中配置你的云开发环境')
        }
      }
    }
  },

  // 获取云数据库实例
  async database() {
    return (await this.cloud()).database()
  },


  // 获取用户唯一标识，兼容不同环境模式
  async getOpenId() {
    const openid = (await (await this.cloud()).callFunction({
      name: 'mylogin'
    })).result.openid;
    if (openid !== "") return this.globalData.cachedopenid = openid;
    return this.globalData.cachedopenid = fromopenid
  }
})
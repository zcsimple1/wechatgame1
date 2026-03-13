// pages/share/share.js
Page({
  data: {
    options: [],
    creator: '匿名',
    isDrawing: false,
    showResult: false,
    result: ''
  },

  onLoad(options) {
    if (options.options) {
      try {
        const optionsData = JSON.parse(decodeURIComponent(options.options))
        this.setData({
          options: optionsData
        })
      } catch (e) {
        wx.showToast({
          title: '数据解析失败',
          icon: 'none'
        })
      }
    }

    // 获取用户昵称
    this.getUserInfo()
  },

  getUserInfo() {
    wx.getUserProfile({
      desc: '用于显示创建者',
      success: (res) => {
        this.setData({
          creator: res.userInfo.nickName
        })
      },
      fail: () => {
        // 用户拒绝授权，使用匿名
        this.setData({
          creator: '神秘人'
        })
      }
    })
  },

  startDraw() {
    if (this.data.options.length < 2) {
      wx.showToast({
        title: '选项不足',
        icon: 'none'
      })
      return
    }

    this.setData({
      isDrawing: true,
      showResult: false
    })

    // 动画效果
    let count = 0
    const maxCount = 20
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.data.options.length)
      this.setData({
        result: this.data.options[randomIndex].name
      })

      count++
      if (count >= maxCount) {
        clearInterval(interval)
        this.finalDraw()
      }
    }, 100)
  },

  finalDraw() {
    // 根据权重随机选择
    const totalWeight = this.data.options.reduce((sum, opt) => sum + (opt.weight || 1), 0)
    let random = Math.random() * totalWeight

    let result = ''
    for (const opt of this.data.options) {
      random -= (opt.weight || 1)
      if (random <= 0) {
        result = opt.name
        break
      }
    }

    this.setData({
      isDrawing: false,
      showResult: true,
      result
    })

    // 震动反馈
    wx.vibrateShort({
      type: 'heavy'
    })
  },

  onShareAppMessage() {
    const optionsStr = encodeURIComponent(JSON.stringify(this.data.options))
    return {
      title: `快来试试这个抽签！由${this.data.creator}创建`,
      path: `/pages/share/share?options=${optionsStr}`
    }
  }
})

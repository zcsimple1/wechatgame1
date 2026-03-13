// pages/index/index.js
Page({
  data: {
    quickPresets: [
      { id: 'yes-no', name: '是或否', icon: '❓', options: ['是', '否'] },
      { id: 'lunch', name: '吃什么', icon: '🍜', options: ['火锅', '烧烤', '寿司', '披萨', '汉堡', '炒菜'] },
      { id: 'weekend', name: '去哪玩', icon: '🎡', options: ['看电影', '逛街', '公园', '宅家', 'KTV', '运动'] },
      { id: 'lucky', name: '幸运数字', icon: '🔢', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
      { id: 'mood', name: '心情如何', icon: '😊', options: ['开心', '平静', '兴奋', '放松', '期待'] },
      { id: 'color', name: '选个颜色', icon: '🎨', options: ['红色', '蓝色', '绿色', '黄色', '紫色'] }
    ],
    showResult: false,
    result: ''
  },

  goToCustom() {
    wx.navigateTo({
      url: '/pages/custom/custom'
    })
  },

  goToWheel() {
    wx.navigateTo({
      url: '/pages/wheel/wheel'
    })
  },

  goToPreset() {
    wx.navigateTo({
      url: '/pages/preset/preset'
    })
  },

  shareApp() {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.showToast({
      title: '请点击右上角分享',
      icon: 'none'
    })
  },

  quickDraw(e) {
    const id = e.currentTarget.dataset.id
    const preset = this.data.quickPresets.find(p => p.id === id)

    if (preset && preset.options) {
      // 随机选择
      const randomIndex = Math.floor(Math.random() * preset.options.length)
      const result = preset.options[randomIndex]

      this.setData({
        result: result.name,
        showResult: true
      })

      // 震动反馈
      wx.vibrateShort({
        type: 'heavy'
      })
    }
  },

  closeResult() {
    this.setData({
      showResult: false,
      result: ''
    })
  },

  onShareAppMessage() {
    return {
      title: '幸运抽签小程序 - 多种抽签方式等你来',
      path: '/pages/index/index'
    }
  }
})

// pages/index/index.js
Page({
  data: {
    quickPresets: [
      { id: 'yes-no', name: '是或否', icon: '🎯', options: [{ name: '是', icon: '✅' }, { name: '否', icon: '❌' }] },
      { id: 'lunch', name: '吃什么', icon: '🍜', options: [
        { name: '火锅', icon: '🍲' },
        { name: '烧烤', icon: '🍢' },
        { name: '寿司', icon: '🍣' },
        { name: '披萨', icon: '🍕' },
        { name: '汉堡', icon: '🍔' },
        { name: '炒菜', icon: '🥘' }
      ] },
      { id: 'weekend', name: '去哪玩', icon: '🎡', options: [
        { name: '看电影', icon: '🎬' },
        { name: '逛街', icon: '🛍️' },
        { name: '公园', icon: '🌳' },
        { name: '宅家', icon: '🏠' },
        { name: 'KTV', icon: '🎤' },
        { name: '运动', icon: '🏃' }
      ] },
      { id: 'lucky', name: '幸运数字', icon: '🔢', options: [
        { name: '1', icon: '1️⃣' },
        { name: '2', icon: '2️⃣' },
        { name: '3', icon: '3️⃣' },
        { name: '4', icon: '4️⃣' },
        { name: '5', icon: '5️⃣' },
        { name: '6', icon: '6️⃣' },
        { name: '7', icon: '7️⃣' },
        { name: '8', icon: '8️⃣' },
        { name: '9', icon: '9️⃣' },
        { name: '10', icon: '🔟' }
      ] },
      { id: 'mood', name: '心情如何', icon: '😊', options: [
        { name: '开心', icon: '😄' },
        { name: '平静', icon: '😌' },
        { name: '兴奋', icon: '🤩' },
        { name: '放松', icon: '😎' },
        { name: '期待', icon: '🥰' }
      ] },
      { id: 'color', name: '选个颜色', icon: '🎨', options: [
        { name: '红色', icon: '🔴' },
        { name: '蓝色', icon: '🔵' },
        { name: '绿色', icon: '🟢' },
        { name: '黄色', icon: '🟡' },
        { name: '紫色', icon: '🟣' }
      ] }
    ],
    showResult: false,
    result: '',
    resultIcon: '',
    currentPreset: {}
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
      this.setData({
        currentPreset: preset
      })
      this.startDraw()
    }
  },

  startDraw() {
    const { currentPreset } = this.data
    const options = currentPreset.options

    if (options.length < 2) {
      wx.showToast({
        title: '选项不足',
        icon: 'none'
      })
      return
    }

    // 随机选择并显示结果
    const randomIndex = Math.floor(Math.random() * options.length)
    const result = options[randomIndex]

    this.setData({
      result: result.name,
      resultIcon: result.icon,
      showResult: true
    })

    wx.vibrateShort({
      type: 'heavy'
    })
  },

  retryDraw() {
    this.startDraw()
  },

  closeResult() {
    this.setData({
      showResult: false,
      result: '',
      resultIcon: '',
      currentPreset: {}
    })
  },

  onShareAppMessage() {
    return {
      title: '幸运抽签小程序 - 多种抽签方式等你来',
      path: '/pages/index/index'
    }
  }
})

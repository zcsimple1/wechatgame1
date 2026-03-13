// pages/index/index.js
Page({
  data: {
    options: [],
    newOption: '',
    newWeight: '',
    isDrawing: false,
    showResult: false,
    result: ''
  },

  onLoad() {
    // 恢复上次保存的选项
    const savedOptions = wx.getStorageSync('drawOptions')
    if (savedOptions && savedOptions.length > 0) {
      this.setData({
        options: savedOptions
      })
      this.calculateProbabilities()
    }
  },

  onOptionInput(e) {
    this.setData({
      newOption: e.detail.value
    })
  },

  onWeightInput(e) {
    this.setData({
      newWeight: e.detail.value
    })
  },

  addOption() {
    if (!this.data.newOption.trim()) {
      wx.showToast({
        title: '请输入选项名称',
        icon: 'none'
      })
      return
    }

    const weight = this.data.newWeight ? parseInt(this.data.newWeight) : 1
    if (weight < 1) {
      wx.showToast({
        title: '权重必须大于等于1',
        icon: 'none'
      })
      return
    }

    const options = [...this.data.options, {
      name: this.data.newOption.trim(),
      weight: weight,
      probability: 0
    }]

    this.setData({
      options,
      newOption: '',
      newWeight: ''
    })

    this.calculateProbabilities()
    this.saveOptions()

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  },

  deleteOption(e) {
    const index = e.currentTarget.dataset.index
    const options = this.data.options.filter((_, i) => i !== index)

    this.setData({
      options
    })

    this.calculateProbabilities()
    this.saveOptions()
  },

  calculateProbabilities() {
    const options = this.data.options
    if (options.length === 0) return

    const totalWeight = options.reduce((sum, opt) => sum + (opt.weight || 1), 0)

    const optionsWithProb = options.map(opt => ({
      ...opt,
      probability: ((opt.weight || 1) / totalWeight * 100).toFixed(1)
    }))

    this.setData({
      options: optionsWithProb
    })
  },

  saveOptions() {
    wx.setStorageSync('drawOptions', this.data.options)
  },

  startDraw() {
    if (this.data.options.length < 2) {
      wx.showToast({
        title: '请至少添加2个选项',
        icon: 'none'
      })
      return
    }

    this.setData({
      isDrawing: true,
      showResult: false
    })

    // 动画效果 - 快速切换选项
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

  closeResult() {
    this.setData({
      showResult: false,
      result: ''
    })
  },

  sharePage() {
    if (this.data.options.length < 2) {
      wx.showToast({
        title: '请至少添加2个选项',
        icon: 'none'
      })
      return
    }

    // 将选项信息编码后跳转到分享页
    const optionsData = JSON.stringify(this.data.options)
    wx.navigateTo({
      url: `/pages/share/share?options=${encodeURIComponent(optionsData)}`
    })
  },

  onShareAppMessage() {
    return {
      title: '快来试试这个抽签小程序！',
      path: '/pages/index/index'
    }
  }
})

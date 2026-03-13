// pages/wheel/wheel.js
Page({
  data: {
    options: [],
    newOption: '',
    isSpinning: false,
    showResult: false,
    result: '',
    canvas: null,
    ctx: null,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
    currentRotation: 0
  },

  onLoad() {
    // 恢复上次保存的选项
    const savedOptions = wx.getStorageSync('wheelOptions')
    if (savedOptions && savedOptions.length > 0) {
      this.setData({ options: savedOptions })
    }
  },

  onReady() {
    this.initCanvas()
    this.drawWheel()
  },

  onShow() {
    if (this.data.canvas) {
      this.drawWheel()
    }
  },

  initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#wheelCanvas')
      .fields({ node: true, size: true })
      .exec(res => {
        if (res[0]) {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio

          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          this.setData({ canvas, ctx })
          this.drawWheel()
        }
      })
  },

  drawWheel() {
    const { canvas, ctx, options, currentRotation } = this.data
    if (!canvas || !ctx || options.length < 2) return

    const centerX = 280
    const centerY = 280
    const radius = 250
    const anglePerSlice = (2 * Math.PI) / options.length

    ctx.clearRect(0, 0, 560, 560)
    ctx.save()

    // 应用旋转
    ctx.translate(centerX, centerY)
    ctx.rotate(currentRotation)
    ctx.translate(-centerX, -centerY)

    // 绘制转盘扇形
    options.forEach((option, index) => {
      const startAngle = index * anglePerSlice
      const endAngle = (index + 1) * anglePerSlice

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // 填充颜色
      ctx.fillStyle = option.color || this.data.colors[index % this.data.colors.length]
      ctx.fill()

      // 绘制边框
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // 绘制文字
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + anglePerSlice / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24rpx sans-serif'
      ctx.fillText(option.name, radius - 20, 8)
      ctx.restore()
    })

    ctx.restore()

    // 绘制中心圆
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()

    // 绘制指针三角形
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius - 30)
    ctx.lineTo(centerX - 20, centerY - radius + 20)
    ctx.lineTo(centerX + 20, centerY - radius + 20)
    ctx.closePath()
    ctx.fillStyle = '#ff6b6b'
    ctx.fill()
  },

  goBack() {
    wx.navigateBack()
  },

  onOptionInput(e) {
    this.setData({
      newOption: e.detail.value
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

    if (this.data.options.length >= 12) {
      wx.showToast({
        title: '最多添加12个选项',
        icon: 'none'
      })
      return
    }

    const options = [...this.data.options, {
      name: this.data.newOption.trim(),
      color: this.data.colors[this.data.options.length % this.data.colors.length]
    }]

    this.setData({
      options,
      newOption: ''
    })

    this.saveOptions()
    this.drawWheel()

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

    this.saveOptions()
    this.drawWheel()
  },

  saveOptions() {
    wx.setStorageSync('wheelOptions', this.data.options)
  },

  spinWheel() {
    if (this.data.isSpinning) return

    if (this.data.options.length < 2) {
      wx.showToast({
        title: '请至少添加2个选项',
        icon: 'none'
      })
      return
    }

    this.setData({
      isSpinning: true,
      showResult: false
    })

    // 随机选择结果
    const randomIndex = Math.floor(Math.random() * this.data.options.length)
    const anglePerSlice = (2 * Math.PI) / this.data.options.length

    // 计算目标角度（让指针指向该选项中心）
    const targetAngle = randomIndex * anglePerSlice + anglePerSlice / 2
    const spins = 5 + Math.random() * 3 // 随机旋转5-8圈
    const totalRotation = spins * 2 * Math.PI - targetAngle

    // 动画
    const duration = 3000
    const startTime = Date.now()
    const startRotation = this.data.currentRotation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const newRotation = startRotation + totalRotation * easeOut

      this.setData({
        currentRotation: newRotation
      })

      this.drawWheel()

      if (progress < 1) {
        setTimeout(animate, 16)
      } else {
        // 动画结束
        const result = this.data.options[randomIndex].name
        this.setData({
          isSpinning: false,
          showResult: true,
          result
        })

        wx.vibrateShort({
          type: 'heavy'
        })
      }
    }

    animate()
  },

  closeResult() {
    this.setData({
      showResult: false,
      result: ''
    })
  },

  resetWheel() {
    wx.showModal({
      title: '确认重置',
      content: '确定要清空所有选项吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            options: [],
            currentRotation: 0,
            showResult: false,
            result: ''
          })
          this.saveOptions()
          this.drawWheel()
        }
      }
    })
  },

  shareWheel() {
    if (this.data.options.length < 2) {
      wx.showToast({
        title: '请至少添加2个选项',
        icon: 'none'
      })
      return
    }

    wx.showToast({
      title: '转盘分享功能开发中',
      icon: 'none'
    })
  },

  onShareAppMessage() {
    return {
      title: '快来试试这个转盘抽签！',
      path: '/pages/wheel/wheel'
    }
  }
})

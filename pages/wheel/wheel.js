// pages/wheel/wheel.js
Page({
  data: {
    options: [],
    newOption: '',
    isSpinning: false,
    showResult: false,
    result: '',
    resultIcon: '',
    canvas: null,
    ctx: null,
    colors: ['#FF6B6B', '#FF8E53', '#FFA07A', '#FFD93D', '#6BCF7F', '#4ECDC4', '#45B7D1', '#9B59B6', '#FF69B4', '#FF7F50', '#20B2AA', '#00CED1'],
    currentRotation: 0,
    canStop: false
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

      // 添加光泽效果
      const gradient = ctx.createRadialGradient(
        centerX + radius * 0.3 * Math.cos(startAngle + anglePerSlice / 2),
        centerY + radius * 0.3 * Math.sin(startAngle + anglePerSlice / 2),
        0,
        centerX,
        centerY,
        radius
      )
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
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

    // 绘制中心圆（渐变光泽效果）
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
    const centerGradient = ctx.createRadialGradient(centerX - 6, centerY - 6, 0, centerX, centerY, 20)
    centerGradient.addColorStop(0, '#fff')
    centerGradient.addColorStop(1, '#e0e0e0')
    ctx.fillStyle = centerGradient
    ctx.fill()

    // 绘制指针三角形（渐变效果）
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius - 30)
    ctx.lineTo(centerX - 18, centerY - radius + 20)
    ctx.lineTo(centerX + 18, centerY - radius + 20)
    ctx.closePath()
    const pointerGradient = ctx.createLinearGradient(centerX, centerY - radius - 30, centerX, centerY - radius + 20)
    pointerGradient.addColorStop(0, '#ff6b6b')
    pointerGradient.addColorStop(1, '#ee5a5a')
    ctx.fillStyle = pointerGradient
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
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
    if (this.data.isSpinning) {
      // 如果正在旋转，则停止
      this.stopWheel()
      return
    }

    if (this.data.options.length < 2) {
      wx.showToast({
        title: '请至少添加2个选项',
        icon: 'none'
      })
      return
    }

    this.setData({
      isSpinning: true,
      showResult: false,
      canStop: true
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
    let stopped = false

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

      if (progress < 1 && !stopped) {
        setTimeout(animate, 16)
      } else {
        // 动画结束
        const resultOption = this.data.options[randomIndex]
        this.setData({
          isSpinning: false,
          showResult: true,
          result: resultOption.name,
          resultIcon: resultOption.name.charAt(0) === '1' || resultOption.name.charAt(0) === '2' ? resultOption.name.charAt(0) + '️⃣' : '',
          canStop: false
        })

        wx.vibrateShort({
          type: 'heavy'
        })
      }
    }

    animate()
  },

  stopWheel() {
    if (!this.data.isSpinning || !this.data.canStop) return

    // 停止旋转，计算当前指向的选项
    const { currentRotation, options } = this.data
    const anglePerSlice = (2 * Math.PI) / options.length

    // 规范化角度到 [0, 2*PI)
    const normalizedRotation = ((-currentRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)

    // 计算指针指向的选项（指针在顶部，即 -PI/2 位置）
    const pointerAngle = (3 * Math.PI / 2 - normalizedRotation + 2 * Math.PI) % (2 * Math.PI)
    const resultIndex = Math.floor(pointerAngle / anglePerSlice) % options.length

    const result = options[resultIndex].name
    this.setData({
      isSpinning: false,
      showResult: true,
      result,
      canStop: false
    })

    wx.vibrateShort({
      type: 'heavy'
    })
  },

  closeResult() {
    this.setData({
      showResult: false,
      result: '',
      resultIcon: ''
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

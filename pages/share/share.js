// pages/share/share.js
Page({
  data: {
    options: [],
    creator: '匿名',
    isSpinning: false,
    showResult: false,
    result: '',
    canvas: null,
    ctx: null,
    colors: ['#FF6B6B', '#FF8E53', '#FFA07A', '#FFD93D', '#6BCF7F', '#4ECDC4', '#45B7D1', '#9B59B6', '#FF69B4', '#FF7F50', '#20B2AA', '#00CED1'],
    currentRotation: 0,
    canStop: false,
    animationTimer: null,
    displayMode: 'list' // 'wheel' 或 'list'
  },

  onLoad(options) {
    // 确定显示模式：如果有颜色信息则是圆盘式，否则是列表式
    let displayMode = 'list'

    if (options.options) {
      try {
        const optionsData = JSON.parse(decodeURIComponent(options.options))

        // 检查是否有颜色属性，如果有则是圆盘式
        if (optionsData.length > 0 && optionsData[0].color) {
          displayMode = 'wheel'
        }

        this.setData({
          options: optionsData,
          displayMode
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

  onReady() {
    if (this.data.displayMode === 'wheel') {
      this.initCanvas()
      this.drawWheel()
    }
  },

  onShow() {
    if (this.data.displayMode === 'wheel' && this.data.canvas) {
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

          // 设置canvas实际像素尺寸
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr

          this.setData({ canvas, ctx })
          this.drawWheel()
        }
      })
  },

  drawWheel() {
    const { canvas, ctx, options, currentRotation } = this.data
    if (!canvas || !ctx || options.length < 2) return

    // 获取设备像素比
    const dpr = wx.getSystemInfoSync().pixelRatio

    // 使用实际像素尺寸
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    const radius = Math.min(centerX, centerY) - 20
    const anglePerSlice = (2 * Math.PI) / options.length

    // 清除整个画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
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
      ctx.font = `bold ${20 * dpr}px sans-serif`
      ctx.fillText(option.name, radius - 20, 8 * dpr)
      ctx.restore()
    })

    ctx.restore()

    // 绘制中心圆
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
    const centerGradient = ctx.createRadialGradient(centerX - 6, centerY - 6, 0, centerX, centerY, 20)
    centerGradient.addColorStop(0, '#fff')
    centerGradient.addColorStop(1, '#e0e0e0')
    ctx.fillStyle = centerGradient
    ctx.fill()

    // 绘制指针三角形
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

  getUserInfo() {
    wx.getUserProfile({
      desc: '用于显示创建者',
      success: (res) => {
        this.setData({
          creator: res.userInfo.nickName
        })
      },
      fail: () => {
        this.setData({
          creator: '神秘人'
        })
      }
    })
  },

  spinWheel() {
    // 列表模式直接抽签
    if (this.data.displayMode === 'list') {
      this.startDraw()
      return
    }

    // 圆盘模式旋转转盘
    if (this.data.isSpinning) {
      this.stopWheel()
      return
    }

    if (this.data.options.length < 2) {
      wx.showToast({
        title: '选项不足',
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

    // 指针在顶部（3*PI/2）
    const optionStartAngle = randomIndex * anglePerSlice
    const optionCenterAngle = optionStartAngle + anglePerSlice / 2

    // 要让选项中心转到顶部
    const targetAngle = (3 * Math.PI / 2) - optionCenterAngle

    // 计算最终的旋转角度
    const spins = 5 + Math.random() * 3
    const currentMod = this.data.currentRotation % (2 * Math.PI)
    let rotationDiff = targetAngle - currentMod
    while (rotationDiff < 0) {
      rotationDiff += 2 * Math.PI
    }
    const totalRotation = spins * 2 * Math.PI + rotationDiff

    // 动画
    const duration = 3000
    const startTime = Date.now()
    const startRotation = this.data.currentRotation
    let stopped = false

    const animate = () => {
      if (stopped) return

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
        this.setData({
          animationTimer: setTimeout(animate, 16)
        })
      } else {
        // 动画结束
        const resultOption = this.data.options[randomIndex]
        this.setData({
          isSpinning: false,
          showResult: true,
          result: resultOption.name,
          canStop: false,
          animationTimer: null
        })

        wx.vibrateShort({
          type: 'heavy'
        })
      }
    }

    animate()
  },

  startDraw() {
    if (this.data.options.length < 2) {
      wx.showToast({
        title: '选项不足',
        icon: 'none'
      })
      return
    }

    // 直接出结果，不做动画
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
      showResult: true,
      result
    })

    wx.vibrateShort({
      type: 'heavy'
    })
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
      isSpinning: false,
      showResult: true,
      result
    })

    wx.vibrateShort({
      type: 'heavy'
    })
  },

  stopWheel() {
    if (!this.data.isSpinning || !this.data.canStop) return

    // 取消动画
    if (this.data.animationTimer) {
      clearTimeout(this.data.animationTimer)
      this.setData({ animationTimer: null })
    }

    // 停止旋转，计算当前指向的选项
    const { currentRotation, options } = this.data
    const anglePerSlice = (2 * Math.PI) / options.length

    // 规范化角度
    const normalizedRotation = ((-currentRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)

    // 计算指针指向的选项
    const pointerAngle = (3 * Math.PI / 2 - normalizedRotation + 2 * Math.PI) % (2 * Math.PI)
    const resultIndex = Math.floor(pointerAngle / anglePerSlice) % options.length

    const result = options[resultIndex]
    this.setData({
      isSpinning: false,
      showResult: true,
      result: result.name,
      canStop: false
    })

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

  onShareAppMessage() {
    const optionsStr = encodeURIComponent(JSON.stringify(this.data.options))
    return {
      title: `快来试试这个转盘抽签！由${this.data.creator}创建`,
      path: `/pages/share/share?options=${optionsStr}`
    }
  }
})

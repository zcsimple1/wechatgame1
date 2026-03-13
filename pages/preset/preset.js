// pages/preset/preset.js
Page({
  data: {
    currentCategory: 'all',
    showResult: false,
    result: '',
    currentPreset: {},
    categories: [
      { id: 'all', name: '全部' },
      { id: 'decision', name: '决策' },
      { id: 'food', name: '美食' },
      { id: 'entertainment', name: '娱乐' },
      { id: 'life', name: '生活' },
      { id: 'game', name: '游戏' }
    ],
    presets: [
      {
        id: 'yes-no',
        category: 'decision',
        name: '是或否',
        icon: '❓',
        options: ['是', '否']
      },
      {
        id: 'yes-no-maybe',
        category: 'decision',
        name: '是或否或也许',
        icon: '❓',
        options: ['是', '否', '也许']
      },
      {
        id: 'lunch',
        category: 'food',
        name: '今天吃什么',
        icon: '🍜',
        options: ['火锅', '烧烤', '寿司', '披萨', '汉堡', '炒菜', '面食', '砂锅']
      },
      {
        id: 'drink',
        category: 'food',
        name: '喝什么',
        icon: '🥤',
        options: ['奶茶', '咖啡', '果汁', '苏打水', '可乐', '矿泉水']
      },
      {
        id: 'weekend',
        category: 'entertainment',
        name: '周末去哪玩',
        icon: '🎡',
        options: ['看电影', '逛街', '公园', '宅家', 'KTV', '运动', '爬山', '桌游']
      },
      {
        id: 'movie',
        category: 'entertainment',
        name: '看什么电影',
        icon: '🎬',
        options: ['动作片', '喜剧片', '恐怖片', '科幻片', '爱情片', '纪录片']
      },
      {
        id: 'lucky-number',
        category: 'game',
        name: '幸运数字',
        icon: '🔢',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      },
      {
        id: 'dice',
        category: 'game',
        name: '掷骰子',
        icon: '🎲',
        options: ['1点', '2点', '3点', '4点', '5点', '6点']
      },
      {
        id: 'mood',
        category: 'life',
        name: '今天心情',
        icon: '😊',
        options: ['开心', '平静', '兴奋', '放松', '期待', '焦虑', '疲惫']
      },
      {
        id: 'color',
        category: 'life',
        name: '选个颜色',
        icon: '🎨',
        options: ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色']
      },
      {
        id: 'gift',
        category: 'life',
        name: '送什么礼物',
        icon: '🎁',
        options: ['鲜花', '巧克力', '香水', '手表', '项链', '书籍']
      },
      {
        id: 'exercise',
        category: 'entertainment',
        name: '做什么运动',
        icon: '🏃',
        options: ['跑步', '游泳', '瑜伽', '健身', '篮球', '羽毛球', '骑行']
      },
      {
        id: 'snack',
        category: 'food',
        name: '吃什么零食',
        icon: '🍪',
        options: ['薯片', '饼干', '糖果', '坚果', '果干', '巧克力']
      },
      {
        id: 'tea',
        category: 'food',
        name: '喝什么茶',
        icon: '🍵',
        options: ['红茶', '绿茶', '乌龙茶', '花茶', '普洱茶', '白茶']
      }
    ],
    filteredPresets: []
  },

  onLoad() {
    this.filterPresets()
  },

  goBack() {
    wx.navigateBack()
  },

  switchCategory(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      currentCategory: id
    })
    this.filterPresets()
  },

  filterPresets() {
    const { currentCategory, presets } = this.data
    let filtered = presets

    if (currentCategory !== 'all') {
      filtered = presets.filter(preset => preset.category === currentCategory)
    }

    this.setData({
      filteredPresets: filtered
    })
  },

  selectPreset(e) {
    const id = e.currentTarget.dataset.id
    const preset = this.data.presets.find(p => p.id === id)

    if (preset) {
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

    // 动画效果
    let count = 0
    const maxCount = 20
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * options.length)
      this.setData({
        result: options[randomIndex],
        showResult: true
      })

      count++
      if (count >= maxCount) {
        clearInterval(interval)
        this.finalDraw()
      }
    }, 100)
  },

  finalDraw() {
    const { currentPreset } = this.data
    const options = currentPreset.options
    const randomIndex = Math.floor(Math.random() * options.length)

    this.setData({
      result: options[randomIndex]
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
      result: ''
    })
  },

  onShareAppMessage() {
    return {
      title: '热门预设抽签 - 快来试试！',
      path: '/pages/preset/preset'
    }
  }
})

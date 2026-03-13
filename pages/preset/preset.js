// pages/preset/preset.js
Page({
  data: {
    currentCategory: 'all',
    showResult: false,
    result: '',
    resultIcon: '',
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
        icon: '🎯',
        options: [{ name: '是', icon: '✅' }, { name: '否', icon: '❌' }]
      },
      {
        id: 'yes-no-maybe',
        category: 'decision',
        name: '是或否或也许',
        icon: '🎰',
        options: [{ name: '是', icon: '✅' }, { name: '否', icon: '❌' }, { name: '也许', icon: '❓' }]
      },
      {
        id: 'lunch',
        category: 'food',
        name: '今天吃什么',
        icon: '🍜',
        options: [
          { name: '火锅', icon: '🍲' },
          { name: '烧烤', icon: '🍢' },
          { name: '寿司', icon: '🍣' },
          { name: '披萨', icon: '🍕' },
          { name: '汉堡', icon: '🍔' },
          { name: '炒菜', icon: '🥘' },
          { name: '面食', icon: '🍜' },
          { name: '砂锅', icon: '🍲' }
        ]
      },
      {
        id: 'drink',
        category: 'food',
        name: '喝什么',
        icon: '🥤',
        options: [
          { name: '奶茶', icon: '🧋' },
          { name: '咖啡', icon: '☕' },
          { name: '果汁', icon: '🧃' },
          { name: '苏打水', icon: '🥤' },
          { name: '可乐', icon: '🥤' },
          { name: '矿泉水', icon: '💧' }
        ]
      },
      {
        id: 'weekend',
        category: 'entertainment',
        name: '周末去哪玩',
        icon: '🎡',
        options: [
          { name: '看电影', icon: '🎬' },
          { name: '逛街', icon: '🛍️' },
          { name: '公园', icon: '🌳' },
          { name: '宅家', icon: '🏠' },
          { name: 'KTV', icon: '🎤' },
          { name: '运动', icon: '🏃' },
          { name: '爬山', icon: '⛰️' },
          { name: '桌游', icon: '🎲' }
        ]
      },
      {
        id: 'movie',
        category: 'entertainment',
        name: '看什么电影',
        icon: '🎬',
        options: [
          { name: '动作片', icon: '🎯' },
          { name: '喜剧片', icon: '😂' },
          { name: '恐怖片', icon: '👻' },
          { name: '科幻片', icon: '🚀' },
          { name: '爱情片', icon: '💕' },
          { name: '纪录片', icon: '📹' }
        ]
      },
      {
        id: 'lucky-number',
        category: 'game',
        name: '幸运数字',
        icon: '🔢',
        options: [
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
        ]
      },
      {
        id: 'dice',
        category: 'game',
        name: '掷骰子',
        icon: '🎲',
        options: [
          { name: '1点', icon: '1️⃣' },
          { name: '2点', icon: '2️⃣' },
          { name: '3点', icon: '3️⃣' },
          { name: '4点', icon: '4️⃣' },
          { name: '5点', icon: '5️⃣' },
          { name: '6点', icon: '6️⃣' }
        ]
      },
      {
        id: 'mood',
        category: 'life',
        name: '今天心情',
        icon: '😊',
        options: [
          { name: '开心', icon: '😄' },
          { name: '平静', icon: '😌' },
          { name: '兴奋', icon: '🤩' },
          { name: '放松', icon: '😎' },
          { name: '期待', icon: '🥰' },
          { name: '焦虑', icon: '😰' },
          { name: '疲惫', icon: '😴' }
        ]
      },
      {
        id: 'color',
        category: 'life',
        name: '选个颜色',
        icon: '🎨',
        options: [
          { name: '红色', icon: '🔴' },
          { name: '橙色', icon: '🟠' },
          { name: '黄色', icon: '🟡' },
          { name: '绿色', icon: '🟢' },
          { name: '蓝色', icon: '🔵' },
          { name: '紫色', icon: '🟣' }
        ]
      },
      {
        id: 'gift',
        category: 'life',
        name: '送什么礼物',
        icon: '🎁',
        options: [
          { name: '鲜花', icon: '💐' },
          { name: '巧克力', icon: '🍫' },
          { name: '香水', icon: '🧴' },
          { name: '手表', icon: '⌚' },
          { name: '项链', icon: '📿' },
          { name: '书籍', icon: '📚' }
        ]
      },
      {
        id: 'exercise',
        category: 'entertainment',
        name: '做什么运动',
        icon: '🏃',
        options: [
          { name: '跑步', icon: '🏃' },
          { name: '游泳', icon: '🏊' },
          { name: '瑜伽', icon: '🧘' },
          { name: '健身', icon: '💪' },
          { name: '篮球', icon: '🏀' },
          { name: '羽毛球', icon: '🏸' },
          { name: '骑行', icon: '🚴' }
        ]
      },
      {
        id: 'snack',
        category: 'food',
        name: '吃什么零食',
        icon: '🍪',
        options: [
          { name: '薯片', icon: '🥔' },
          { name: '饼干', icon: '🍪' },
          { name: '糖果', icon: '🍬' },
          { name: '坚果', icon: '🥜' },
          { name: '果干', icon: '🍎' },
          { name: '巧克力', icon: '🍫' }
        ]
      },
      {
        id: 'tea',
        category: 'food',
        name: '喝什么茶',
        icon: '🍵',
        options: [
          { name: '红茶', icon: '🍵' },
          { name: '绿茶', icon: '🍵' },
          { name: '乌龙茶', icon: '🍵' },
          { name: '花茶', icon: '🌸' },
          { name: '普洱茶', icon: '🍵' },
          { name: '白茶', icon: '🍵' }
        ]
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

    // 直接随机选择并显示结果
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

  finalDraw() {
    // 已不再使用，保留以防兼容性问题
  },

  retryDraw() {
    this.startDraw()
  },

  closeResult() {
    this.setData({
      showResult: false,
      result: '',
      resultIcon: ''
    })
  },

  stopPropagation() {
    // 阻止事件冒泡，防止点击内容区关闭弹出框
  },

  onShareAppMessage() {
    return {
      title: '热门预设抽签 - 快来试试！',
      path: '/pages/preset/preset'
    }
  }
})

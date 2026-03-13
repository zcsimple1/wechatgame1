#!/bin/bash

# 幸运抽签小程序 - 一键提交脚本

echo "🚀 开始提交代码..."
echo ""

# 检查是否有修改
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ 没有需要提交的修改"
    exit 0
fi

# 显示当前状态
echo "📋 当前修改内容："
git status --short
echo ""

# 添加所有修改
echo "➕ 添加所有修改..."
git add .
echo ""

# 提交代码
echo "📝 提交代码..."
git commit -m "feat: 更新幸运抽签小程序

- 完善抽签功能实现
- 优化界面样式和交互体验
- 添加分享页面功能
- 支持自定义权重和概率计算
"
echo ""

# 推送到远程仓库
echo "📤 推送到远程仓库..."
git push origin main
echo ""

# 检查推送结果
if [ $? -eq 0 ]; then
    echo "✅ 代码提交成功！"
    echo ""
    echo "📊 提交统计："
    git log -1 --stat
else
    echo "❌ 推送失败，请检查网络连接或权限"
    exit 1
fi

echo ""
echo "🎉 完成！"

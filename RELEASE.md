# 发布流程

## 准备工作

1. 确保代码已经完成测试并提交
2. 确保 GitHub Actions 配置正确
3. 确保已经设置 NPM_TOKEN 在 GitHub Secrets 中

## 发布步骤

1. 更新版本号
```bash
# 手动修改 package.json 中的 version
# 或者使用 npm version 命令自动更新
npm version patch  # 补丁版本 0.0.x
npm version minor  # 次要版本 0.x.0
npm version major  # 主要版本 x.0.0
```

2. 提交变更
```bash
git add .
git commit -m "chore: bump version to x.x.x"
```

3. 打标签并推送
```bash
# 如果使用 npm version，则不需要手动打标签
git tag vx.x.x
git push
git push --tags
```

## 版本号规则

遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- 主版本号（major）：做了不兼容的 API 修改
- 次版本号（minor）：做了向下兼容的功能性新增
- 修订号（patch）：做了向下兼容的问题修正

## 发布后检查

1. 检查 GitHub Actions 是否成功运行
2. 检查 NPM 包是否成功发布
3. 检查新版本的功能是否正常

## 回滚方案

如果发现问题需要回滚：

1. 删除远程标签
```bash
git push --delete origin vx.x.x
```

2. 删除本地标签
```bash
git tag -d vx.x.x
```

3. 在 NPM 废弃有问题的版本
```bash
npm deprecate mytt-ts@x.x.x "This version has been deprecated"
``` 
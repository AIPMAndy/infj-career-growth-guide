# INFJ 升职加薪必看书影音指南

> 41 部电影、电视剧、书籍与纪录片，6 条职业成长路线。每部都配有一个职场问题、一条可执行练习，以及避免误学的提醒。

作者：**AI 酋长 Andy** · [个人网站](https://metaver.vip/) · [职业成长与求职陪跑](https://metaver.vip/services) · 微信 `AIPMAndy`

![项目分享图](assets/social-preview.svg)

## 🌐 在线阅读

**[互动网站](https://aipmandy.github.io/infj-career-growth-guide/)** （GitHub Pages 发布成功后生效）

**[作品数据](data/catalog.json)** · **[7 / 30 天行动指南](guides/7-30-day-plan.md)** · **[记录模板](templates/career-evidence.md)**

## 作品清单

| 类型 | 数量 | 代表作品 |
| --- | ---: | --- |
| 电影 | 12 | 《穿普拉达的女王》《隐藏人物》《十二怒汉》《点球成金》 |
| 电视剧 | 10 | 《未生》《半泽直树》《傲骨贤妻》《熊家餐馆》 |
| 书籍 | 15 | 《非暴力沟通》《关键对话》《金字塔原理》《谈判力》 |
| 纪录片 | 4 | 《美国工厂》《最后之舞》《成为》《主厨的餐桌》 |
| **总计** | **41** | **6 类职场能力** |

6 个成长方向：**职业定位、价值表达、向上管理、边界与谈判、影响力与协作、带队与晋升**。

## 怎样使用

1. 打开网站，先输入自己正在遇到的职场问题，例如「不敢谈加薪」「周报」「带团队」。
2. 按成长能力、作品类型筛选；点开作品查看**为什么推荐、今天要做什么、什么不能学**。
3. 优先完成一个行动，例如做一页**晋升证据清单**，而不是先刷完所有作品。
4. 在站内收藏、标记完成，跟着 7 天入门计划或 30 天路线练习。
5. 每周复盘一次实际工作变化，必要时和上级沟通评价标准。

## 网站功能

- 41 条中文书影音资料，作品英文原名与职场问题
- 关键词检索、作品类别 / 六类职场能力筛选
- 收藏、已完成、隐藏已完成、随机推荐
- 每部作品单独的解读、行动步骤和反面提醒
- 7 天 / 30 天可勾选行动清单，完成记录导出为 Markdown
- 搜索友好的响应式网站；无需后端、账号或外部 JavaScript 服务

数据存储在当前浏览器 `localStorage`，更换设备或清空浏览器缓存会丢失。没有用户注册、服务端收集或跨设备同步功能。

## 如何部署

仓库建议名称：`infj-career-growth-guide`，属于 `AIPMAndy` 账号。

1. 在 GitHub 创建 **Public** 仓库 `infj-career-growth-guide`。
2. 将本项目的所有文件推送到仓库的 `main` 分支根目录（保留 `index.html` 在根目录）。
3. 打开仓库 **Settings → Pages**，选择 **Build and deployment → Source: Deploy from a branch**。
4. 选择 **Branch: main / (root)**，点击 Save。待 GitHub Pages 发布后，访问 `https://aipmandy.github.io/infj-career-growth-guide/`。
5. 将此网址填写到仓库 About → Website，并可添加 topics：`infj`, `career-growth`, `book-list`, `movie-list`, `github-pages`, `chinese`。

无需安装依赖；本地双击 `index.html` 可查看。使用简单本地 HTTP 服务也可以：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/
```

如需自动化部署，可后续改用 GitHub Actions，但不要同时启用互相冲突的两种发布方式。本项目默认走 `main / root` 分支模式。

## 仓库结构

```text
index.html                 # 网站入口
style.css                  # 移动端适配的样式
app.js                     # 筛选、详情、收藏、打卡、导出
data/catalog.json         # 结构化作品库，可供外部引用
data/catalog.js           # 无后端/离线版浏览器数据文件
guides/7-30-day-plan.md   # 独立 7/30 天行动指南
templates/career-evidence.md # 晋升价值证据表
assets/social-preview.svg # 社交平台分享图
assets/favicon.svg        # 网站图标
LAUNCH.md                 # Threads/X 传播文案和发布检查
CONTRIBUTING.md           # 共建规则
LICENSE                   # MIT
```

新增作品请同时维护 `data/catalog.json` 和 `data/catalog.js`；后者应是 `window.INFJ_CATALOG = <JSON数组>;`，两者数据内容需完全一致。

## 关于 INFJ、版权与真实结果

- **INFJ 仅是读者熟悉的主题标签**，MBTI 不是个人能力、职业表现、加薪概率或管理潜质的可靠预测模型。任何类型的职场人都可使用这些练习。
- 作品解读与行动建议是编辑性职场学习材料，没有声称影视角色属于某一人格类型，也不承诺看完会升职加薪。
- 不提供影视资源、盗版下载或受版权保护的整本书；作品名称用于识别和评论，相关权利属于各权利人。
- 影视剧情存在夸张与改编。涉及歧视、职场霸凌、违法行为时，仅用于分析风险，不应照搬。

欢迎提出 Issue / PR，尤其欢迎补充中国本土职场案例、不同职业阶段的有效练习。⭐

同系列：[INTJ 成长书影音图鉴](https://github.com/AIPMAndy/intj-growth-guide)。

### 从本地一键创建仓库（可选）

如果已经安装并登录 GitHub CLI (`gh auth login`)，在解压目录运行 `bash publish.sh`。脚本只允许**第一次发布全新的公开仓库**，如果仓库已存在或目录已有 Git 记录会退出，不会覆盖任何现有项目。随后按上述步骤在 Pages 设置里打开静态网站。

### 自动检查

```bash
python3 -m unittest discover -s tests -v
node --check app.js
```
---
title: "77 Star！douyin-favorites-to-knowledge：一千条抖音收藏自动变成本地可搜笔记，每晚十一点自己跑一遍"
source: "https://mp.weixin.qq.com/s?__biz=MzUzNTgzNjQzOQ==&mid=2247486014&idx=1&sn=9008986eddd7ee3fb79b844410b18954&chksm=fb1913c2eaac9d8b2619a03aa70eb36bef8206bef91c3400264a4f059e19d5efb8277cccaf74#rd"
category: "未分类"
author: "海冰AI备忘录"
date: 2026-10-29
tags: []
notion: "https://www.notion.so/409feb00ed72811e9e17dda83e994077"
---

# 77 Star！douyin-favorites-to-knowledge：一千条抖音收藏自动变成本地可搜笔记，每晚十一点自己跑一遍
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=MzUzNTgzNjQzOQ==&mid=2247486014&idx=1&sn=9008986eddd7ee3fb79b844410b18954&chksm=fb1913c2eaac9d8b2619a03aa70eb36bef8206bef91c3400264a4f059e19d5efb8277cccaf74#rd](https://mp.weixin.qq.com/s?__biz=MzUzNTgzNjQzOQ%3D%3D&mid=2247486014&idx=1&sn=9008986eddd7ee3fb79b844410b18954&chksm=fb1913c2eaac9d8b2619a03aa70eb36bef8206bef91c3400264a4f059e19d5efb8277cccaf74#rd)
一个 **77 star** 的项目，三个月发了 **11 个版本**。
这个比例不太正常。多数小项目是"发一版，然后慢慢烂掉"；它的 CHANGELOG 一条一条写着"2.3.1 修了 2.3.0 引入的问题，2.3.2 修了 2.3.1 的余波，2.3.5 修了 2.3.4 的配置键"。密集自修是双面的：它确实犯过错，但每次都把"原来错在哪"写清楚了。
**douyin-favorites-to-knowledge** 干的事一句话能说完：把你抖音收藏夹里的新收藏，变成一篇篇带标题、作者、原视频链接、语音转文字的 Markdown 笔记，落进你的本地知识库或者 Obsidian。
它解决的不是"下载"，是"我收藏过什么来着"
市面上抖音工具九成是下载器：给个链接出个 mp4。
但这个项目盯的是另一件事——你刷到一条有用的视频，点了收藏，然后就再也没打开过。收藏夹到第一千条的时候，它已经不是知识库了，是个黑洞。
所以它做的是转换：**把"看过"变成"能搜"**。每条收藏生成一份独立 Markdown，含标题、作者、原始地址、收藏描述、转写文本、标签和采集时间。以后你想找"那个讲 XX 的人"，`grep` 一下就行。
三个设计细节，看得出是被事故教育过的
**第一，收藏和喜欢严格分开。** 收藏走 `showTab=favorite_collection`，喜欢走 `showTab=like`，两套独立的防重键、独立的文件名（喜欢的是 `like-*.md`）。因为"随手点赞"和"主动收藏"混在一起，知识库就废了。
**第二，它把采集和入库拆成了两步。**`scan → review → promote` 三个原子命令，中间有个 `review.json` 让你先看再批。别家直接把东西塞进抽屉，它先摊开让你过目。
**第三，没新增也写一行日报。** 每晚 23:00 跑 `daily`，生成 `日报/YYYY-MM-DD.md`，哪怕今天没新收藏，也明写"今日没有新增条目"。不然你分不清"它没干活"和"干了但没货"。
```
douyin-favorites-knowledge setup    # 问目录、选转录方案、打开抖音登录页
douyin-favorites-knowledge sync     # 以后就这一行

```
生产依赖只有两项：`playwright` 和一个 23 KB 的本地 wheel。
安全上，我读了源码，"不存 Cookie"这句是真的
它把抖音的播放地址下载单独抽了一个模块，硬编码了 8 个域名后缀白名单——`douyin.com`、`douyinvod.com`、`douyinpic.com` 等等，只有这些域名的 cookie 会被记住，而且是**只在内存里，同步结束就清**。登录态本身存在独立的浏览器 profile 目录，不写配置、不进笔记、不上传。
`SECURITY.md` 里还专门写了一句：不要把 `DOUYIN_FAVORITES_PROFILE_DIR` 指到你日常用的浏览器上。
谁该用
收藏夹已经几百上千条、又用 Obsidian 或本地 Markdown 的人，这是目前唯一把"抓取 + 转写 + 防重 + 落盘 + 日报"串成闭环的工具。它仓库根目录还带一个 `SKILL.md`，可以让 Agent 自己装、自己跑、自己出日报。
坑也在这里，三条
**第一，作者改个昵称就能让整轮同步中止。** 有个用户提了个 issue：他有 1000 条收藏、283 行防重台账，某天一个作者把昵称从"妙妙屋（AI 拾宝版）"改成"妙妙屋（AI 拾宝中）"，标题正文链接全没变，但下一次 sync 直接报 `promoted item changed`，整轮中止。它的处置办法是删台账行、删旧卡片、重跑——而 **sync 每次只报第一条就停**，5 条漂移要跑 5 轮。这个 issue 到 10 月 27 日还开着，作者没回。
**第二，它曾经有个"第二天必炸"的 bug。** 2.3.1 的 CHANGELOG 原文写着：以前把每次重新生成的采集时间算进了内容指纹，所以"第二次同步必报 `promoted item changed`，每日任务从第二天起失败"。装完当天试用完全正常，第二天才开始炸，而且报错长得像"内容被篡改"，排查方向会被带偏。
**第三，它的安全规则把自己的配置拦过。** 有个正则专门拦配置里的敏感键名，规则是键名里出现 `token` 就报错。结果 2.3.4 加了个叫 `max_output_tokens` 的配置项，直接被自己拦下，`check-config` 和 `sync` 都读不进配置。2.3.5 的修法是改键名，不是放宽规则——所以你照 2.3.4 装完，第二天升级要手改配置。
还有两个默认值要清楚：转录默认走 SiliconFlow 的免费模型（截至 8 月 5 日官方标价免费，作者自己写了"不承诺永久免费"），README 里放了作者的推荐注册链接，隐含返利，用不用你自己判断；转写准确率的天花板是免费模型，作者在 issue 里说得很直白——"口播不准是模型上限，不是流水线漏做了一步"。
最后一个提醒：这是个**单人项目**，25 次提交、11 个版本、31 个已关 issue，全是一个人。**77 个 star 里，watcher 是 0**。也就是说它坏了，没人会替你发现。
自己用，很值。推荐给团队当基础设施，别。
---
项目地址：https://github.com/tars1230/douyin-favorites-to-knowledge[1]
它的 CHANGELOG 是我最近读到写得最老实的一份——每条都交代"错在哪、怎么错的、现在怎么改"。这类文档比 README 更能看出一个项目值不值得长期用。完整的十模块分析报告（含源码里那段安全正则的具体实现、Gitee 镜像的同步状态核对）已经进了 ima 的「GitHub项目集」。
我是海冰，持续拆解 GitHub 上真正值得用的开源项目，只写自己读过源码的那一种，不堆形容词。 如果这篇帮你省了自己翻仓库的时间，欢迎点赞、在看、转发，我们下篇见。
#### 引用链接
[1]_https://github.com/tars1230/douyin-favorites-to-knowledge_

---
title: "LynMusic：开源跨平台本地音乐播放器，一个曲库五端同步"
source: "https://mp.weixin.qq.com/s?__biz=MjM5ODMwNjY0MA==&mid=2457901471&idx=1&sn=be7e033339cca0c53beabf7420c66e37&chksm=b0aa4f62e0d8bbcc5cfa1e77faf8e1c81260f4907a469425b8f5000ba5b851b45878e44ee9b3#rd"
category: "未分类"
author: iPlayZip
date: 2026-09-16
tags: []
notion: "https://www.notion.so/414feb00ed7281859b62cd20a8a7af7d"
---

# LynMusic：开源跨平台本地音乐播放器，一个曲库五端同步
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=MjM5ODMwNjY0MA==&mid=2457901471&idx=1&sn=be7e033339cca0c53beabf7420c66e37&chksm=b0aa4f62e0d8bbcc5cfa1e77faf8e1c81260f4907a469425b8f5000ba5b851b45878e44ee9b3#rd](https://mp.weixin.qq.com/s?__biz=MjM5ODMwNjY0MA%3D%3D&mid=2457901471&idx=1&sn=be7e033339cca0c53beabf7420c66e37&chksm=b0aa4f62e0d8bbcc5cfa1e77faf8e1c81260f4907a469425b8f5000ba5b851b45878e44ee9b3#rd)
![](assets/414feb00ed728185-1.png)
你的音乐收藏现在存在几个地方？电脑硬盘一份，NAS 一份，手机里还有一部分——想听的时候，三个设备三种打开方式，歌单还各是各的。LynMusic 是一个开源的跨平台本地音乐播放器，基于 Kotlin Multiplatform 开发，一套代码跑五个平台：Windows、macOS、Linux、Android、iOS。本地文件夹、Samba、WebDAV、Navidrome 都能接，把散落在硬盘、NAS 和自建服务里的歌汇成一套曲库。这篇讲清楚三件事：它凭什么能一套代码跑五端、曲库怎么接、自己想编译怎么办。
**01**
**开发背景与平台覆盖**
为什么会有这个播放器作者的出发点挺实在：市面上的本地播放器，歌词搜索太难用，有些歌手的歌还不一定搜得到。加上想练手 KMP（Kotlin Multiplatform），又有了 AI 编程工具降低实现难度，索性自己做一个——功能和界面都能自主决策。从仓库提交记录看，这个项目 2026 年 3 月启动，迭代相当勤：TV 和车机模块、UPnP 投放、歌词平滑滚动、数据迁移，一路都在加。五个端，全都有普通播放器最多做到"桌面 + 手机"两端，LynMusic 的覆盖是拉满的：
- 桌面端（Windows / macOS / Linux，JVM）：专辑墙、多栏布局，收藏多也不乱；
- 手机端（Android / iOS）：通勤路上接着听，数据同步；
- TV 端：客厅场景，歌词平滑滚动，大屏看词；
- 车机端（Android Automotive）：滑动封面切歌，开车听歌不用分神。
另外还有 UPnP/DLNA 投放能力，能把音乐投到局域网里的其他播放设备上。
**02**
**曲库接入方式**
本地文件夹导入是基本功。真正让它好用的是私有音乐源接入：
- Samba / WebDAV：NAS 里的音乐目录直接挂进来，不用下载到手机；
- Navidrome：自建音乐服务器的话，官方推荐接这个——多端数据能统一，歌单和喜欢状态五个设备保持一致；
- 本地文件：硬盘里的散装歌曲也能导入管理。
接好之后是常规播放器的操作：歌曲、专辑、艺人多维度浏览，喜欢、歌单、播放队列这些日常管理都有。
**03**
**核心功能特色**
歌词功能
作者做这个项目的初心就是歌词，这块的完成度确实高：
- 歌词搜索：自动匹配，搜不到的还支持在线结果回填；
- 歌词分享：看到戳心的词可以直接做图分享；
- TV 端平滑滚动：歌词逐句跟进，不是干巴巴的翻页。
其他实用功能
对于注重资料整理的人，还有音乐标签编辑：标题、歌手、专辑、歌词、封面都能改，散装 MP3 的乱七八糟标签可以顺手收拾干净。界面主题也支持自定义，视觉上不至于千人一面。
**04**
**自行编译方法**
普通用户直接去 GitHub Releases 下载对应平台的安装包就行。想动手编译的话，项目是标准的 Gradle 结构：
编译安卓 APP
debug 版本
```ruby
./gradlew :composeApp:assembleDebug
```
release 版本
```ruby
./gradlew :composeApp:assembleRelease
```
直接跑桌面版（JVM）
```ruby
./gradlew :composeApp:run
```
打包当前系统的独立安装包
（在 Mac 上跑就打 Mac 的包）：
```ruby
./gradlew :composeApp:packageDistributionForCurrentOS
```
产物在 `composeApp/build/compose/binaries/main/`。iOS 开发版在 Xcode 里打开 iosApp 目录启动。
**05**
**适用场景与开源协议**
要不要装你的歌是不是存在 NAS 或者自建服务器里，手机上却一直没有顺手的播放器？是的话，LynMusic 正对你的需求。它面向的是个人音乐收藏场景——手里攒了大量本地音源、或者自建了 Navidrome 的用户，五个设备一个曲库，数据还能同步。如果你已经习惯了流媒体平台的推荐和歌单生态，本地播放器对你可能没有吸引力——它管理的是你自己的收藏，不提供内容。手里没多少本地音源的话，装了也没东西可放。
licensing 顺带交代：项目采用 GPL-3.0-or-later 协议，内含的 Platinum UPnP SDK 是 GPL/商业双许可，二次开发注意开源义务。
链接
GitHub 项目主页：
https://github.com/wesley666/LynMusic
安装包从 GitHub Releases 页面下载，各平台版本都有。

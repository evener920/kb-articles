---
title: "开源免费的C 盘清理软件，干净、纯粹、不流氓，真正解决 C 盘爆红痛点的清理利器。"
source: "https://mp.weixin.qq.com/s?__biz=Mzg2MjY1NDIzNg==&mid=2247502347&idx=1&sn=6bf7cd386e1bfb32f6e7a632a8fc473b&chksm=cfedce4968d6f55be327f0c94b2d7d27736ba9fbab4a69da4283e359e9be245317e7107c579f#rd"
category: "未分类"
author: "github淘金"
date: 2026-10-17
tags: []
notion: "https://www.notion.so/405feb00ed72813f9167cf115e41cbbe"
---

# 开源免费的C 盘清理软件，干净、纯粹、不流氓，真正解决 C 盘爆红痛点的清理利器。
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=Mzg2MjY1NDIzNg==&mid=2247502347&idx=1&sn=6bf7cd386e1bfb32f6e7a632a8fc473b&chksm=cfedce4968d6f55be327f0c94b2d7d27736ba9fbab4a69da4283e359e9be245317e7107c579f#rd](https://mp.weixin.qq.com/s?__biz=Mzg2MjY1NDIzNg%3D%3D&mid=2247502347&idx=1&sn=6bf7cd386e1bfb32f6e7a632a8fc473b&chksm=cfedce4968d6f55be327f0c94b2d7d27736ba9fbab4a69da4283e359e9be245317e7107c579f#rd)
light-c
> “
> 给 Windows 用户做的 C 盘清理软件，扫描快、功能全，不瞎删系统文件。
> 
Github地址
**https://github.com/Chunyu33/light-c**
![](assets/405feb00ed72813f-1.jpg)
功能特性
- 垃圾清理：临时文件、系统更新残留、缩略图缓存、DirectX 着色器缓存，还有微软 Defender 那部分能重建的缓存，都可以扫出来。
- 大文件排查：按盘符扫描，标出占用空间大的文件，带风险提示，删之前让你确认。
- 社交软件缓存：微信、QQ、钉钉、飞书这些桌面版的缓存，分类列出来，按需清理。
- 系统瘦身：可选的 Windows 组件、省空间设置，加上 Windows Search 索引重建（Windows.db 膨胀的时候有用），每一步都有安全提示。
- 旧驱动管理：找出没在用第三方驱动包，支持备份和恢复，不会动你正在用的驱动。
- 卸载残留：在常见位置扫已经卸载软件的残留文件，按可信度给结果。
- 注册表清理：找孤立的注册表项，操作前自动备份。
- 右键菜单整理：清掉失效或多余的右键菜单条目。
- 目录分析：看文件夹占用空间，逐层下钻，临时缓存能清的直接清。
- 磁盘增长追踪：拍磁盘快照，对比前后变化，定位是哪些文件、目录在变胖。
- 第三方"此电脑"图标管理：清那些软件乱加的图标，带注册表和权限备份，还能防复活。
- AI 模型缓存：本地模型、LoRA、embedding 这些存储分析，选中就能删。
- 多语言：简中、繁中、英文、日文切换，界面和后台提示都跟着变。
怎么用
普通用户直接去 lightc.app 下安装包就行，支持便携模式——在 exe 旁边放个 `LightC.portable.json`，配置和数据就存在同目录，不往用户文件夹写东西。
想自己编译的话，要 Windows 10 以上、Node.js 20.19+、Rust 工具链和 Tauri 2 的环境。装完依赖 `npm install`，`npm run tauri dev` 跑开发版，`npm run build` 打包。
作者特意做了安全限制：不动 Windows Defender 的核心目录、隔离区、定义更新；System32 只碰 DirectX 着色器缓存；需要管理员权限或重启才能删的文件，会标出来让你知道。清理前多看看勾选的内容，重要数据自己先备份。

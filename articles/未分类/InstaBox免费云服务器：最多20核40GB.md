---
title: "InstaBox免费云服务器：最多20核40GB"
source: "https://mp.weixin.qq.com/s?__biz=Mzg3NDIzMjEzNA==&mid=2247487184&idx=1&sn=be743715f5f015a986766a327d33579b&chksm=cf1864751bd02d9000151af144da429c1c1e2b185bea059c857054c6a6d67f62ece69b5f6ee5#rd"
category: "未分类"
author: "大肥猫科技馆"
date: 2026-10-18
tags: []
notion: "https://www.notion.so/3fdfeb00ed72815580fafc38af58c39d"
---

# InstaBox免费云服务器：最多20核40GB
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=Mzg3NDIzMjEzNA==&mid=2247487184&idx=1&sn=be743715f5f015a986766a327d33579b&chksm=cf1864751bd02d9000151af144da429c1c1e2b185bea059c857054c6a6d67f62ece69b5f6ee5#rd](https://mp.weixin.qq.com/s?__biz=Mzg3NDIzMjEzNA%3D%3D&mid=2247487184&idx=1&sn=be743715f5f015a986766a327d33579b&chksm=cf1864751bd02d9000151af144da429c1c1e2b185bea059c857054c6a6d67f62ece69b5f6ee5#rd)
**InstaBox 正在邀请制内测，主打给 AI Agent 提供云端 Linux 电脑。**
当前反馈的免费额度最高可到 5 台机器，总计 20 vCPU、40GB 内存。
### 免费额度
- 单台：4 vCPU、8GB 内存、20GB 存储；
- 最多 5 台，总计 20 vCPU、40GB 内存；
- 启动时间反馈不到 1 秒；
- 支持持久化文件、环境配置和快照；
- 支持把端口暴露为公共 HTTPS URL；
- 默认闲置 30 分钟后自动暂停。
这些是当前内测和账号反馈的配置，不代表所有账号都一定拥有相同额度，最终以 InstaBox 控制台实际显示为准。
### 适合拿来做什么
- 给 AI Agent 提供长期运行的云端环境；
- 跑脚本、定时任务和轻量服务；
- 部署测试项目或临时开发环境；
- 保存文件、依赖和环境配置，下次继续使用；
- 通过公共 URL 访问本地端口，做网页 Demo 或回调测试。
如果只是偶尔跑任务，闲置自动暂停可以减少资源占用；需要长时间运行的服务，则要留意暂停规则和当前账号限制。
### 怎么申请
1. 打开 https://instabox.sh；
1. 使用 Google 账号登录；
1. 完成注册后等待邀请码；
1. 收到邀请后进入控制台，查看机器额度和可用功能。
目前是邀请制内测，有用户反馈上午申请、下午收到邀请，但这属于个人经历，不代表固定审核时效。
### 官方页面已确认的功能
- 云端完整 Linux 虚拟机；
- 支持 Docker 和 Docker Compose；
- 持久化存储；
- 暂停与恢复；
- 机器快照；
- 公共端口和 HTTPS URL；
- Vault，用于集中管理密钥。
官方还提供命令行入口：
```
npx instabox@latest sh
```
### 注意事项
- 目前是邀请制内测，邀请码和额度可能分批开放；
- 免费配置、暂停规则和机器数量以账号控制台为准；
- 公共 URL 暴露端口时，不要直接放管理后台、数据库或带敏感信息的服务；
- API Key、密码和其他密钥使用 Vault 或环境变量管理，不要写进公开仓库；
- 重要数据不要只放在测试机器里，定期下载或推送到自己的存储和 Git 仓库。
入口：
https://instabox.sh

## 摘要

（待补充）

## 我的笔记

（待补充）

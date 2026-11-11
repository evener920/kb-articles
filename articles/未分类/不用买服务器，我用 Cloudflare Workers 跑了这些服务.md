---
title: "不用买服务器，我用 Cloudflare Workers 跑了这些服务"
source: "https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg==&mid=2247486658&idx=1&sn=e34c6778ed8577d9f0ca94b28c8270da&chksm=f130708b8e89281e15a0dc2a669b350cc8e4d3e0d66f2a58b07e786b3a0360cc80f819f5a3dc#rd"
category: "未分类"
author: "心如止水码如流"
date: 2026-11-08
tags: []
notion: "https://www.notion.so/415feb00ed7281f983b0c14a4720f556"
---

# 不用买服务器，我用 Cloudflare Workers 跑了这些服务
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg==&mid=2247486658&idx=1&sn=e34c6778ed8577d9f0ca94b28c8270da&chksm=f130708b8e89281e15a0dc2a669b350cc8e4d3e0d66f2a58b07e786b3a0360cc80f819f5a3dc#rd](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247486658&idx=1&sn=e34c6778ed8577d9f0ca94b28c8270da&chksm=f130708b8e89281e15a0dc2a669b350cc8e4d3e0d66f2a58b07e786b3a0360cc80f819f5a3dc#rd)
> 字数 1958，阅读大约需 10 分钟
> 
**一句话结论：Cloudflare Workers 免费额度够个人用，部署零运维，但国内访问不稳定是硬伤。**
前阵子盘了一圈 Cloudflare Workers 上跑的东西——OpenList 网盘、Inkstone 笔记、GitHub 文件加速，加起来也有小半年了。这篇把实战经验串一遍，顺便说说反代、Tunnel 这些玩法，最后聊聊国内访问的坑。
### Cloudflare Workers 到底是什么
一句话：**边缘计算 + 零运维部署**。
你写一段 JS/TS 代码，Cloudflare 帮你部署到全球 300+ 节点。不用买服务器、不用装 Docker、不用管 SSL、不用操心备份。免费版每天 10 万次请求，对个人项目来说基本用不完。
跟传统服务器比：
| 对比项 | 传统服务器 | Cloudflare Workers |
| 成本 | ¥50+/月 | 免费 |
| 运维 | 装系统、配环境、管安全 | 零 |
| 部署 | SSH + Docker + Nginx | Fork + 点几下 |
| 扩缩容 | 手动 | 自动 |
| 冷启动 | 无 | 有，几百毫秒到 3 秒 |
| 国内访问 | 快 | 慢且不稳定 |
适合：个人项目、轻量 API、图床、笔记、监控面板、临时服务。
不适合：大文件上传、视频转码、需要常驻进程的服务。
### 我实际跑了什么
#### 1. OpenList-Worker：网盘挂载
OpenList 官方出的 TypeScript 版，把 Go 后端改写为跑在 Workers 上的服务。78 个存储驱动全在，数据存在 D1/KV/R2 里。
之前写了两篇详细教程：
- • [OpenList-Worker 部署使用（Cloudflare 版）](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247486629&idx=1&sn=75af2083fcc6d33e5562b80a4892b774&scene=21#wechat_redirect)
- • [OpenList-Worker 部署使用（阿里 ESA 版）](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247486647&idx=1&sn=f905f9d30fa1cc25c64ba0610ea4a7e3&scene=21#wechat_redirect)
**为什么选 Worker 版**：不用买服务器、不用跑 Docker、自带免费额度。冷启动有几百毫秒延迟，大文件上传受请求体限制（25 MB），但下载挂载的网盘走 302 转发不受影响。
**实测体验**（浙江电信）：
- • 冷启动：首次 ~3s，二次 <1s
- • 目录列表：1s 左右返回
- • 视频预览：直链跳转上游，Worker 不转流
- • 大文件上传：单片 16 MB、总 25 MB
#### 2. Inkstone：Markdown 笔记
一个跑在 Workers 上的自托管 Markdown 笔记本。纯 Markdown 存储，永不变成私有格式。
详细教程：[一个完全跑在 Cloudflare Workers 上的开源 Markdown 笔记](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247486578&idx=1&sn=bf169663a2965244ae077b3523a35103&scene=21#wechat_redirect)
**核心卖点**：
- • MCP 支持：AI 助手可以直接搜索和读取你的笔记
- • 离线编辑 + 多端同步
- • 双存储模式：R2（10 GB）vs KV（1 GB）
- • 定时 WebDAV 备份到 Nextcloud
**部署坑**：R2 模式要绑信用卡，KV 模式不用。构建命令不一样，别搞混了。
#### 3. GitHub 文件加速
基于 Workers 的 开源的 **GitHub 资源加速下载项目**，专门用于解决国内访问 GitHub Release、Archive（源码压缩包）、项目文件以及 Git Clone 速度缓慢或无法连接的问题。
使用地址：`https://ghpro.zngw.cc`
### 反代和 Tunnel：两种隐藏源站的玩法
#### 方案 A：Workers 反代
最轻量的玩法。写一个 Worker，用 `fetch()` 把请求转发到你的源站：
```

1234567
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = '你的源站IP或域名';
    return fetch(url, request);
  }
}

```
DNS 设成橙色云朵（Proxied），流量走 Cloudflare 边缘节点再到源站。源站 IP 完全不暴露。
**好处**：源站 IP 隐藏、自带 DDoS 防护、SSL 终结。
**代价**：国内访问可能变慢（CF 无国内节点）、部分协议支持不完整。
#### 方案 B：Cloudflare Tunnels
跑一个 `cloudflared` 客户端在源站机器上，建立隧道到 Cloudflare。不需要公网 IP，不需要开端口。
详细教程：
- • [使用 Cloudflare Tunnels 为免费实现内网穿透](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247485264&idx=1&sn=20e51811b4f3b037f02b30d5a0b82efc&scene=21#wechat_redirect)
- • [Cloudflare Tunnels 连接失败分析](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247485516&idx=1&sn=82b55ca85e969e239037014df34f8006&scene=21#wechat_redirect)
**实测**（浙江电信）：
- • 延迟：200ms 左右
- • 速度：1 MB/s 左右（相当于 10 兆带宽）
- • 视频 1080p H.265：开始缓存一会儿，后面基本流畅
**踩过的坑**：QUIC 协议在部分网络环境下不稳定，systemd 默认 15 秒超时会把 cloudflared 杀掉。改成 `TimeoutStartSec=infinity` 解决。
#### 怎么选
| 场景 | 推荐方案 |
| 隐藏源站 IP + 轻量反代 | Workers 反代 |
| 没有公网 IP + 内网穿透 | Cloudflare Tunnels |
| 纯静态站点 | Pages |
| 需要数据库的应用 | Workers + D1 |
| 大文件存储 | R2 |
### 存储怎么选
Cloudflare 提供三种存储，各有各的坑：
| 存储 | 免费额度 | 适合场景 | 注意 |
| **D1** | 500 万行读/天，10 万行写/天 | 结构化数据、用户系统 | SQLite 语法，重度使用会超限 |
| **KV** | 10 万次读/天，1000 次写/天 | 配置、缓存、小数据 | 容量有限，不适合存文件 |
| **R2** | 10 GB 存储，100 万次读/月 | 文件、图片、附件 | 要绑信用卡，但不用额外付费 |
**我的选择**：
- • 笔记应用：D1 存元数据 + KV 存附件（省得绑卡）
- • 网盘：D1 存索引 + R2 存文件
- • 监控：D1 存指标
### 部署通用流程
不管什么项目，流程都差不多：
1. 1. **Fork 仓库** 到你自己的 GitHub 账号
1. 2. **Cloudflare 创建资源**：D1 数据库、R2 存储桶、KV 命名空间（按需）
1. 3. **连接 GitHub**：Workers/Pages 控制台 → 创建应用 → Continue with GitHub
1. 4. **配置环境变量**： 之类的必填项，用 Secret 方式存
1. 5. **绑定存储**：D1/R2/KV 绑定到 Worker
1. 6. **部署**：等几分钟，访问  或  域名
**几个通用坑**：
- • Cloudflare 提示"无法获取存储库内容" → 先 Fork 再连
- • 自定义域名要在平台控制台加，别只改 DNS
- • 环境变量改了要重新部署才生效
### 国内访问的坑
这是最现实的问题。Cloudflare 在国内没有物理节点，所有流量都要绕道海外。
**实测数据**（浙江电信，不同时段波动大）：
| 指标 | 数值 |
| 延迟 | 150-300ms |
| 下载速度 | 0.5-2 MB/s |
| 丢包率 | 0-5%（看时段和区域） |
| 可用性 | 95%+（部分地区经常抽风） |
**具体表现**：
- • 网页文档操作：没问题
- • 图片加载：有延迟，但能接受
- • 视频 1080p：开始缓存一会儿，后面基本流畅
- • 大文件下载：慢，不稳定
- • API 调用：延迟高，偶发超时
**为什么不稳定**：
1. 1. **无国内节点**：流量绕道日本、新加坡、美国，物理距离远
1. 2. **国际出口拥堵**：晚高峰尤其明显
1. 3. **DNS 污染**：部分地区递归 DNS 对 CF 的 NS 支持不好
1. 4. **UDP 限制**：QUIC 协议在部分网络环境下被限速
**怎么缓解**：
- • 用 EdgeOne（腾讯云版）或阿里云 ESA，有国内节点
- • 用 Cloudflare Tunnels 的 TCP 回退（比 QUIC 稳）
- • 域名解析用 CNAME 到国内 CDN
- • 重要服务别全押在 CF 上，留个备用
### 五个坑，别踩
1. 1. **D1 读取配额**：每天 500 万行，个人够用，多用户要注意
1. 2. **R2 要绑卡**：免费额度也要过结算流程，学生党用 KV 代替
1. 3. **冷启动延迟**：首次访问 3 秒左右，用户体验一般
1. 4. **大文件上传**：Workers 请求体限制 25 MB，大了得分片或走 R2 直传
1. 5. **国内访问**：不稳定是常态，别用于生产环境的核心服务
### 说说我的用法
**主力还是自建**（VPS + Docker），Workers 版拿来做：
- • 临时分享文件，不用开服务器端口
- • 手机端快速预览网盘文档
- • 给 AI 助手挂 MCP，让它直接搜我网盘里的资料
- • 测试新驱动、新配置，坏了删了重部署不心疼
- • 轻量监控面板，平替哪吒
**不适合 Workers 的**：
- • 大文件存储和分发
- • 视频转码
- • 需要常驻进程的服务
- • 对延迟敏感的应用
Cloudflare Workers 是个好工具，但它不是万能的。免费额度和国内访问是两道坎，跨过去了就是真香，跨不过去就是折腾。
相关阅读：
- [OpenList-Worker部署使用--Cloudflare版](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247486629&idx=1&sn=75af2083fcc6d33e5562b80a4892b774&scene=21#wechat_redirect)
- [OpenList-Worker部署使用--阿里ESA版](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247486647&idx=1&sn=f905f9d30fa1cc25c64ba0610ea4a7e3&scene=21#wechat_redirect)
- [一个完全跑在 Cloudflare Workers 上的开源 Markdown 笔记](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247486578&idx=1&sn=bf169663a2965244ae077b3523a35103&scene=21#wechat_redirect)
- [使用Cloudflare Tunnels为飞牛Nas免费实现内网穿透](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247485264&idx=1&sn=20e51811b4f3b037f02b30d5a0b82efc&scene=21#wechat_redirect)
- [Cloudflare Tunnels连接失败分析](https://mp.weixin.qq.com/s?__biz=MzYyNDU3OTMyNg%3D%3D&mid=2247485516&idx=1&sn=82b55ca85e969e239037014df34f8006&scene=21#wechat_redirect)

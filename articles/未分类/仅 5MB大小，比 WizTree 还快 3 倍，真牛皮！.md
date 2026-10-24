---
title: "仅 5MB大小，比 WizTree 还快 3 倍，真牛皮！"
source: "https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA==&mid=2247509237&idx=1&sn=90893ff0aeaa46c63f30712b120ede9c&chksm=c1485b01567bbcbba7e8ac261fe81bf8a1f6e5af7bab612c8d1d32617bbd51906cd2097a08a7#rd"
category: "未分类"
author: "开源先锋"
date: 2026-10-23
tags: []
notion: "https://www.notion.so/403feb00ed7281e0b7f5f61e11ff04a4"
---

# 仅 5MB大小，比 WizTree 还快 3 倍，真牛皮！
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA==&mid=2247509237&idx=1&sn=90893ff0aeaa46c63f30712b120ede9c&chksm=c1485b01567bbcbba7e8ac261fe81bf8a1f6e5af7bab612c8d1d32617bbd51906cd2097a08a7#rd](https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA%3D%3D&mid=2247509237&idx=1&sn=90893ff0aeaa46c63f30712b120ede9c&chksm=c1485b01567bbcbba7e8ac261fe81bf8a1f6e5af7bab612c8d1d32617bbd51906cd2097a08a7#rd)
* 戳上方蓝字“**开源先锋**”关注我
大家好啊，我是开源君！
现在用电脑的小伙伴，C 盘飘红、home 目录爆满肯定是常碰到的事情。
升级硬盘肯定是不现实的，但清理的话，打开资源管理器一层层点进去，看到的全是看不懂的文件夹名。
哪个能删？哪个删了会出事？心里真的没底。
最近 GitHub 刷到这样一个上个月刚开源的项目 - `disktree`，它把磁盘空间画成一幅矩形树图，谁占得多，一眼就能看出来，一键清理，非常方便。
9月底开源以来，就已经有 3.5K+ 的开发者们给点赞了~
### 项目简介
`disktree` 是一个磁盘占用可视化工具，用 Rust 写的，基于 Zed 编辑器同款的 GPUI 图形框架打造。
它的思路很简单：把你的磁盘画成一张"地图"。每个目录是一块马赛克，面积越大，占的磁盘空间越多。哪个大块头在偷空间，一眼就看出来。
![](assets/403feb00ed7281e0-1.png)
工作原理上，扫描思路参考了`dust`，扫描目录后用 squarified 算法绘制嵌套矩形树状图。面积默认按"磁盘实际占用"计算（和 du 口径一致），而不是文件表面大小——稀疏文件、压缩文件不会骗你。硬链接只会算一次，隐藏目录默认包含。
### 功能特性
#### 01 色块有含义，还能看出"哪些能回收"
颜色不是随便涂的，代表数据的**种类**：代码、智能体临时文件、工具链、同步文件、git、媒体、文档、缓存等。
![](assets/403feb00ed7281e0-2.jpg)
更贴心的是**斜线阴影**。它标出"可以拿回来的空间"，比如缓存、同步历史、包仓库、构建产物。
这样一来，扫一眼就知道可以先动哪里。
#### 02 滚轮缩放，一路"钻"进目录
在目录上滚动滚轮，画面会朝鼠标位置放大。
放大到目录铺满视野，再滚一格，就**直接进入**这个目录，内容在眼前自然展开。反向滚动，则一路退回来。
![](assets/403feb00ed7281e0-3.gif)
整个过程是一个连贯的动作，很像地图软件。
当然，键盘快捷键也是同样支持的：`Enter` 进入，`Backspace` / `Esc` 返回。
#### 03 先标记，后提交，删前有预演
这是我最喜欢的设计。
按空格或 `x` 就能标记，想标多少标多少。**标记之后，什么都不会发生。**
按 `c` 打开清单，在里面检查、取消，最后再提交。
![](assets/403feb00ed7281e0-4.gif)
删除方式有两种：
- **移到回收站**：默认方式，可恢复
- **永久删除**：一定会弹窗确认，并列出要删什么、能腾出多少
![](assets/403feb00ed7281e0-5.jpg)
删完它会自动重新扫描，告诉你**实际腾出了多少空间**。
#### 04 "Worth a look"：替你挑出最值得看的
侧边栏里有个"值得一看"列表，列出**最大、又有可能删掉**的东西。
![](assets/403feb00ed7281e0-6.jpg)
选中一个 git 仓库时，它还会显示有没有未提交的改动、stash 和未推送的提交。
删之前先看一眼，免得误删还没推上去的代码。
#### 05 内置多重保护，不让你手滑
disktree 对删除很克制。它会拒绝：
- 文件系统根目录、扫描根目录、你的家目录
- /usr、/etc、/boot 等系统目录
- 挂载点，以及内部含有挂载点的目录
![](assets/403feb00ed7281e0-7.jpg)
另外，符号链接只会被取消链接，不会被跟进去删。这些规则都写在代码里，并且每条都有测试。
#### 06 还能让 AI 帮你收尾
清单页按 `a`，能复制一段给编程智能体的提示词：按你选的路径清理，但每条都先核对，其他的一概不碰。
![](assets/403feb00ed7281e0-8.jpg)
prompt类似如下：
![](assets/403feb00ed7281e0-9.jpg)
想让 AI 帮忙收拾，又怕它乱来，这个真的实用。
### 同类工具对比
说到磁盘分析，Windows 上最常被提起的是 **WizTree** 和 **SpaceSniffer**。
**WizTree** 的招牌是快。它直接读取 NTFS 的主文件表（MFT），整盘扫描几秒就能出结果。
不过它只有 Windows 版，且不开源，个人使用免费。
**SpaceSniffer** 小巧，免安装，还能边扫描边浏览，支持过滤和彩色标签。同样只有 Windows 版，也不开源，扫描速度也真的很一般。
**disktree** 的不同在于三点：
- **跨平台**：Linux、macOS、Windows 一套程序，操作习惯统一
- **开源**：MIT 协议，代码和测试都能看
- **删得放心**：先标记后提交，再加上保护规则，还懂开发者的缓存、构建产物和 git 状态
速度上它也不虚。在 Windows 以管理员身份运行时，disktree 同样会读取 MFT。
作者在 400 万文件的 `C:\` 盘上测得约 3.4 秒，WizTree 是 11.2 秒。
当然这是作者的自测数据，环境不同结果会有差异，做个参考就行。
### 快速安装、使用
#### 安装
**方式一：下载发行版**
到项目release页面下载对应系统的压缩包。
![](assets/403feb00ed7281e0-10.jpg)
- Linux：解压后运行 ./install.sh，或把 disktree 放进 PATH
- macOS：解压后把 disktree.app 拖进"应用程序"
- Windows 10/11：解压后直接运行 disktree.exe
**方式二：源码编译（需要 Rust 1.97+）**
```
git clone https://github.com/tobi/disktree
cd disktree
make install

```
不需要 root，会装到 `~/.local` 下。
**方式三：Arch / Omarchy 用户**
```
yay -S disktree-bin

```
**小提示**
macOS 下载的未签名版本可能被 Gatekeeper 拦住，提示"已损坏"。执行下面这条清除隔离标记即可：
```
xattr -dr com.apple.quarantine /Applications/disktree.app

```
#### 使用
```
disktree            # 扫描家目录
disktree --disk     # 扫描家目录所在的整块磁盘
disktree ~/src      # 扫描任意目录
disktree --help     # 查看更多选项

```
进去软件界面之后，记住这几个键就够了：
- space / x：标记或取消标记
- enter：进入目录
- esc：返回上一级
- /：按名称过滤
- c：打开清单，确认删除
- ?：查看全部快捷键
### 开源君想说
之前一直用 WizTree 和 Spacesniffer 清理win系统的空间，用也能用，但总感觉还是少点什么。
`disktree`的"先标记、后确认"的流程，还有AI帮忙收尾、内置的多重保护，让开源君一下就喜欢上了这个项目，真的不错。
要是你的硬盘也老是莫名其妙变红，不妨试下这个，说不定就用上了。
```
https://github.com/tobi/disktree

```
推荐阅读：
[搜 1TB 只要 2 秒，打错字也能搜？这项目有点猛](https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA%3D%3D&mid=2247509007&idx=1&sn=feb10a9fc28e92b2648642c4f1e78232&scene=21#wechat_redirect)
[1.1w Star！手里没有 Mac 电脑，也能做 iOS 开发了！](https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA%3D%3D&mid=2247509040&idx=1&sn=fe431e2b30628746d3e14d39456ec5e7&scene=21#wechat_redirect)
[这个7.7K star的项目，盯上了剪映！](https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA%3D%3D&mid=2247509056&idx=1&sn=3ae122749aacadb443f49014b68628c6&scene=21#wechat_redirect)
[这个 1万 star 项目，正在悄悄冲击Office！](https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA%3D%3D&mid=2247509180&idx=1&sn=4c740034cc62ea3ebb4c1bbeff5c230e&scene=21#wechat_redirect)
[国外老哥用 Claude Code 爆改 TV，真的6~](https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA%3D%3D&mid=2247509199&idx=1&sn=cf142872665cad2a38147f46f51eeac7&scene=21#wechat_redirect)
[169 GB 干到 91.2 GB，这个项目太TM绝了！](https://mp.weixin.qq.com/s?__biz=MzkwNzU4NTMyMA%3D%3D&mid=2247509223&idx=1&sn=b8ae9457da933a07a8b6cea7e05bfac3&scene=21#wechat_redirect)

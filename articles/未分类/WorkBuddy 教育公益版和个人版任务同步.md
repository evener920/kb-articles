---
title: "WorkBuddy 教育公益版和个人版任务同步"
source: "https://mp.weixin.qq.com/s?__biz=MzU1NjU4NDk1NA==&mid=2247484453&idx=1&sn=000669634fefb312d672e9c61c992ccb&chksm=fa496247f204d2a3fc2c6763e009ee21251970306fe9756bd1a30c02c07e37337c3f906d1b00#rd"
category: "未分类"
author: "小海豚老师"
date: 2026-10-22
tags: []
notion: "https://www.notion.so/403feb00ed728165aadbdaee37f60342"
---

# WorkBuddy 教育公益版和个人版任务同步
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=MzU1NjU4NDk1NA==&mid=2247484453&idx=1&sn=000669634fefb312d672e9c61c992ccb&chksm=fa496247f204d2a3fc2c6763e009ee21251970306fe9756bd1a30c02c07e37337c3f906d1b00#rd](https://mp.weixin.qq.com/s?__biz=MzU1NjU4NDk1NA%3D%3D&mid=2247484453&idx=1&sn=000669634fefb312d672e9c61c992ccb&chksm=fa496247f204d2a3fc2c6763e009ee21251970306fe9756bd1a30c02c07e37337c3f906d1b00#rd)
大家好！如果你在电脑上同时使用 **WorkBuddy 教育公益版和个人版**（或多个账号），很可能遇到过这样的烦心事：用公益版做的备课、课件、分析任务，切换到另一个账号后就找不到了，只能来回切账号翻记录。
### 一、这个方法解决什么问题
l**任务看不见**：切了账号，之前创建的任务从侧边栏"消失"；
l**其实没丢**：所有任务的记录都还好好存在你电脑里，只是"登记的名字"不对；
l**一键解决**：按本文方法操作后，当前登录账号能看到本机**所有账号**创建的全部任务，点开就能**继续对话**，历史记录一条不少。
### 二、怎么用：三步搞定
1.**复制**下面方框里的提示词（整段全选复制）；
2.**粘贴发给 WorkBuddy**：新开一个对话，把提示词发过去，WorkBuddy 会自动完成备份和调整，过程中不用你操作；
3.**重新打开 WorkBuddy**：等它汇报完成后，完全退出并重新打开 WorkBuddy，侧边栏就能看到所有任务了。
### 三、提示词（复制这一整段）
| 请帮我完成「本机 WorkBuddy 跨账号任务同步」。目标：让我当前登录的账号，能看到本机所有账号创建的任务，并能继续对话。【背景】WorkBuddy 的任务归属由本地数据库控制，不是看文件放在哪。切账号后侧边栏按 user_id 过滤，所以看不到别的账号的任务，但任务数据文件其实都还在本机，没有删除。【你要做的事，按顺序执行，每一步都先备份再改，改前必须确认 WorkBuddy 完全退出】1. 找到数据库：路径是 ~/.workbuddy/workbuddy.db（Windows 即 C:\Users\\.workbuddy\workbuddy.db）。2. 读当前登录账号 uid：读 ~/.workbuddy/storage/skeleton/account-snapshot.json，取 primary.uid 字段。如果这个文件不存在，就从 sessions 表里按 updated_at 最新的那条的 user_id 作为当前账号。3. 用 SQLite 的在线备份 API（Python 里是 sqlite3 的 conn.backup()，或 .backup 命令）先把 workbuddy.db 完整备份到 ~/.workbuddy/automation-backups/ 下，文件名带当天时间戳。4. 修改任务归属（只改 transport='local' 且未删除的任务）： UPDATE sessions SET user_id = '' WHERE transport='local' AND deleted_at IS NULL AND user_id != '';5. 修改自动化任务归属（同样只改未删除的）： UPDATE automations SET owner_user_id = '' WHERE deleted_at IS NULL AND owner_user_id != '';6. 提交事务，打印本次归账了多少个任务、多少个自动化。【硬性安全要求，必须遵守】- 改库前，WorkBuddy 必须完全退出，否则数据库被锁定或你的修改会被程序回写覆盖。 - 一定先备份，再 UPDATE；每次运行都要重新备份。 - 只改 user_id / owner_user_id 两个归属字段，绝不删除任何行、不动 tasks/ 目录下的任何数据文件。 - 不要碰 transport='cloud' 的任务（那些数据在云端，本地改无效）。 - 如果数据库被占用（报 locked/busy），等几秒重试，不要强杀进程。【执行后给我汇报】当前账号 uid；从哪些账号归账了各多少个任务、多少个自动化；备份文件完整路径；明确的下一步提示：重新打开 WorkBuddy 即可看到所有任务。【如果遇到问题】不要擅自猜。把报错原文和已执行的步骤列出来，等我确认后再继续。 |
### 四、三点放心
l**数据不会丢**：改之前 WorkBuddy 会自动做完整备份（存在 ~/.workbuddy/automation-backups/），随时可以还原；
l**云端任务不受影响**：只调整本地任务的归属，不删任何东西；
l**遇到问题不用慌**：如果中途报错，把报错信息发给 WorkBuddy，它会列出已执行的步骤等你确认，不会乱改。
| 小贴士：以后新建的任务都归当前账号，一般只需要做一次。如果之后又用了别的账号想再合并，把同一段提示词再发一遍就行。 |
适用于 WorkBuddy 教育公益版 / 个人版（Windows / macOS），全程约 10 分钟。

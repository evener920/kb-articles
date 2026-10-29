---
title: "公文格式GB/T 9704规范｜附一键排版Python代码"
source: "https://mp.weixin.qq.com/s?__biz=Mzk3NTcyNTU0OA==&mid=2247484992&idx=1&sn=e88c7e04e38ee976cff709dfd1d070a7&chksm=c52bffb3ee2b1d60ede1268025f7226378014e5aa16499406d82442af19f24bb857862ccb50d#rd"
category: "未分类"
author: "研教简论"
date: 2026-10-26
tags: []
notion: "https://www.notion.so/408feb00ed7281cd81bcf2425d0c2366"
---

# 公文格式GB/T 9704规范｜附一键排版Python代码
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=Mzk3NTcyNTU0OA==&mid=2247484992&idx=1&sn=e88c7e04e38ee976cff709dfd1d070a7&chksm=c52bffb3ee2b1d60ede1268025f7226378014e5aa16499406d82442af19f24bb857862ccb50d#rd](https://mp.weixin.qq.com/s?__biz=Mzk3NTcyNTU0OA%3D%3D&mid=2247484992&idx=1&sn=e88c7e04e38ee976cff709dfd1d070a7&chksm=c52bffb3ee2b1d60ede1268025f7226378014e5aa16499406d82442af19f24bb857862ccb50d#rd)
你有没有过这种经历：熬几个通宵写完的申报书、实施方案、请示函，内容反复打磨了好几遍，结果到了办公室，一句【格式不对，回去重排】就给打了回来；标题该用宋体还是黑体拿不准，页边距凭感觉拖来拖去，给表格加个蓝色表头觉得【显得专业】，页码随便插个数字就完事；网上搜的格式标准五花八门，有的是十几年前的旧标准，有的说得不清不楚，排完交上去还是不合规。
其实党政机关公文格式有明确的国家标准——**GB/T 9704-2012**，从字体字号到页边距、从标题层级到页码格式，每一项都有精确规定。今天把最核心的规范、可直接复制的排版代码、90%的人都会踩的坑全部整理出来，照着做，排版一次过，再也不用在格式上反复返工。
---
### 一、GB/T 9704 核心格式速查表（直接对照改）
不用翻厚厚的标准原文，对照这几张表，就能改对90%的格式问题。
#### 1. 字体字号层级（最容易踩坑的点）
| 元素 | 标准字体 | 字号 | 样式要求 |
| 公文标题 | 小标宋体 | 2号（约22pt） | 加粗、居中 |
| 一级标题（一、二、） | 黑体 | 3号（约16pt） | 加粗 |
| 二级标题（（一）（二）） | 楷体 | 3号（约16pt） | 加粗 |
| 正文 | 仿宋体 | 3号（约16pt） | 首行缩进2字符 |
| 表格表头 | 黑体 | 五号（10.5pt） | 加粗、居中 |
| 表格内容 | 仿宋体 | 五号（10.5pt） | 左对齐/两端对齐 |
| 页码 | 宋体 | 小四号 | 【— N —】一字线格式 |
> ❌ 高频错误：标题用黑体、正文用宋体。标准规定是标题小标宋、正文仿宋，搞反的人最多。
> 
#### 2. 页面与段落硬标准
- 页边距：上3.7cm / 下3.5cm / 左2.8cm / 右2.6cm
- 行距：28磅固定值（不是多倍行距，不是最小值）
- 排版密度：每行28字、每页22行（标准参数下自动撑满版心）
- 首行缩进：2字符（严禁用空格凑，字号一变就错位）
#### 3. 标题层级序号规范
| 层级 | 序号格式 | 字体 | 注意事项 |
| 第一层 | 一、二、三、 | 黑体3号 | 句尾不加标点 |
| 第二层 | （一）（二）（三） | 楷体3号 | 句尾不加标点 |
| 第三层 | 1. 2. 3. | 仿宋3号 | 可加粗，与正文齐肩 |
| 第四层 | （1）（2）（3） | 仿宋3号 | 与正文齐肩 |
---
### 二、可直接复制的排版代码（复制粘贴就能用）
手动调格式慢还容易错，下面两段代码分别适合单篇快速修改和批量处理，都是从标准落地脚本里摘出来的，直接替换文件名就能用。
#### 方案一：officecli 快速排版命令（单篇文档一键改）
适合快速调整单篇docx，逐条执行对应命令即可。
```
officecli set ”$FILE” / \
  --prop pageWidth=11906 --prop pageHeight=16838 \
  --prop marginTop=2098 --prop marginBottom=1984 \
  --prop marginLeft=1587 --prop marginRight=1474
```
> 说明：将`$FILE`替换为你的docx文件路径，执行后自动套用国标页边距。
> 
```
officecli set ”$FILE” ”/body/p[N]” \
  --prop align=center --prop size=22pt --prop bold=true \
  --prop font=”STSong” --prop color=000000 --prop lineSpacing=28pt
```
> 说明：`/body/p[N]`中的N替换为标题所在的段落序号。
> 
```
# 把引号内的数字替换为你的正文段落序号
BODY_PARAS=”2 4 6 7 9 12 13 14 15 16 17”
for idx in $BODY_PARAS; do
  officecli set ”$FILE” ”/body/p[$idx]” \
    --prop size=16pt --prop font=”STFangSong” --prop lineSpacing=28pt \
    --prop firstLineIndent=640 --prop spaceBefore=0 --prop spaceAfter=0
done
```
```bash
officecli add ”$FILE” / --type footer --prop type=default \
  --prop align=center --prop size=9pt --prop text=”— ” --prop field=page
officecli add ”$FILE” ”/footer[1]/p[1]” --type run --prop text=” —” --prop size=9pt
```
> 生成效果：页脚居中显示【— 1 —】，页码自动跟随内容更新。
> 
公文表格严禁彩色表头、彩色底纹，必须纯黑白。一键清除所有颜色：
```bash
# TBL=表格序号，COLS=列数，ROWS=总行数
TBL=1
COLS=3
ROWS=8
# 表头行：白底黑字加粗
for col in $(seq 1 $COLS); do
  officecli set ”$FILE” ”/body/tbl[$TBL]/tr[1]/tc[$col]” --prop fill=FFFFFF
  officecli set ”$FILE” ”/body/tbl[$TBL]/tr[1]/tc[$col]/p[1]/r[1]” \
    --prop color=000000 --prop bold=true --prop size=12pt --prop font=”STFangSong”
done
# 数据行：白底黑字
for row in $(seq 2 $ROWS); do
  for col in $(seq 1 $COLS); do
    officecli set ”$FILE” ”/body/tbl[$TBL]/tr[$row]/tc[$col]” --prop fill=FFFFFF
    officecli set ”$FILE” ”/body/tbl[$TBL]/tr[$row]/tc[$col]/p[1]/r[1]” \
      --prop color=000000 --prop size=12pt --prop font=”STFangSong”
  done
done
```
#### 方案二：python-docx 批量排版脚本（大量文档高效处理）
如果有几十篇文档要统一格式，用python脚本批量处理，核心函数如下。
```python
from docx.shared import Pt
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
def set_cjk_font(run, font_name, size_pt, bold=False):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.insert(0, rFonts)
# 同时设置中英文字体，确保中文正确渲染
    for attr in ['w:eastAsia', 'w:ascii', 'w:hAnsi']:
        rFonts.set(qn(attr), font_name)
```
```python
def set_fixed_line_spacing(para, pt_val=28):
    pPr = para._element.get_or_add_pPr()
    spacing = pPr.find(qn('w:spacing'))
    if spacing is None:
        spacing = OxmlElement('w:spacing')
        pPr.append(spacing)
    spacing.set(qn('w:line'), str(int(pt_val * 20)))
    spacing.set(qn('w:lineRule'), 'exact')
```
用正则自动匹配[一、][（一）]层级，不用手动选段落：
```python
import re
for para in doc.paragraphs:
    text = para.text.strip()
    if not text:
        continue
# 一级标题：一、二、三、
    if re.match(r'^[一二三四五六七八]、', text) and len(text) <= 20:
        for run in para.runs:
            set_cjk_font(run, '黑体', 16, bold=True)
        set_fixed_line_spacing(para, 28)
# 二级标题：（一）（二）
    elif re.match(r'^（[一二三四五六七八]）', text):
        for run in para.runs:
            set_cjk_font(run, '楷体', 16, bold=True)
        set_fixed_line_spacing(para, 28)
# 正文段落
    else:
        for run in para.runs:
            set_cjk_font(run, '仿宋', 16)
        set_fixed_line_spacing(para, 28)
        para.paragraph_format.first_line_indent = Pt(32)
```
> 运行提示：脚本保存为`.py`文件后通过终端执行，避开沙箱中文编码问题。
> 
---
### 三、90%的人都会踩的8个格式坑
对照检查，踩中任何一个，专业度直接打折扣。 
1. ❌ 标题用黑体：公文标题必须用小标宋体，黑体只用于一级标题。 
1. ❌ 正文用宋体：正文标准字体是仿宋体，不是普通宋体。
1. ❌ 表格加彩色表头：公文表格纯黑白，白底黑字表头加粗即可，严禁蓝色、灰色底纹。
1. ❌ 页码格式错误：标准是[— 1 —]，不是[1][第1页][-1-]。
1. ❌ 首行缩进用空格凑：必须用段落首行缩进2字符，空格会随字号变化错位。
1. ❌ 行距用多倍行距：标准是28磅固定值，不是1.5倍或最小值。
1. ❌ 一级标题用[一.]：序号是顿号[一、]，不是英文点[一.]。
1. ❌ 标点用英文半角：全文必须用中文全角标点，包括引号[“”]、括号（）。
---
### 四、进阶场景：红头函、多附件、新闻稿排版要点
#### 1. 红头函格式关键参数
- 发文机关标志（红头）距上页边30mm，下方红色双线（上粗下细）
- 发文字号居版心右边缘，不是居中
- 首页不显示页码，第2页起才编排页码
- 结尾用语规范：商洽需回复用【请予函复】，直接告知用【特此函达】，答复来函用【特此函复】
#### 2. 多附件分页正确做法
每个附件独立起页，严禁用空行硬分页（容易产生空白页），正确做法是设置段前分页：
```
# 附件标题段落设置段前分页
p.paragraph_format.page_break_before = True
```
同时所有标题设置「与下段同页」，避免标题孤立在页尾：
```
p.paragraph_format.keep_with_next = True
```
#### 3. 单位新闻稿排版
- 采用主标题+副标题两行式，副标题以【——】开头
- 通讯员署名放在标题下居中，楷体三号
- 正文仿宋三号、28磅固定行距、首行缩进2字符
- 页码统一用【— N —】格式
> 补充说明：用公文字号排版，不代表内容要写成公文套话。比如写指导手册、实施方案，完全可以用公文的排版体系保证正式感，内容保持实务风格即可。
> 
---
最后想说：公文格式的核心从来不是好看，是规范。一份符合GB/T 9704标准的文档，不用额外说明，格式本身就体现了专业和严谨。
如果这篇文章对你有用，欢迎转发给身边写材料、做申报、写公文的同事朋友。关注不迷路。
![](assets/408feb00ed7281cd-1.png)

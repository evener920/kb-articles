---
title: "Piper：轻量的本地中文朗读"
source: "https://mp.weixin.qq.com/s?__biz=MzU2NjIzMjcxOQ==&mid=2247488768&idx=1&sn=a9d0180ac60273e2dd247a2fafe5d5c2&chksm=fd75774d48c213f58059efe45ccda78b78753a94d0513584cf4900f5e62b283562cfc72269c2#rd"
category: "未分类"
author: "Yan的随想录"
date: 2026-11-12
tags: []
notion: "https://www.notion.so/418feb00ed7281909883c827a7214e9f"
---

# Piper：轻量的本地中文朗读
> 💡 备注属性未写入，可能是备注属性名称或者类型被修改了，建议将字段类型设置为 rich_text，可以在小程序-操作-修改文章数据库页面进行调整
> 💡 原文链接:[https://mp.weixin.qq.com/s?__biz=MzU2NjIzMjcxOQ==&mid=2247488768&idx=1&sn=a9d0180ac60273e2dd247a2fafe5d5c2&chksm=fd75774d48c213f58059efe45ccda78b78753a94d0513584cf4900f5e62b283562cfc72269c2#rd](https://mp.weixin.qq.com/s?__biz=MzU2NjIzMjcxOQ%3D%3D&mid=2247488768&idx=1&sn=a9d0180ac60273e2dd247a2fafe5d5c2&chksm=fd75774d48c213f58059efe45ccda78b78753a94d0513584cf4900f5e62b283562cfc72269c2#rd)
最近想让电脑把文字念出来听，包括我和 AI 的对话，编程工具中的文档，其它各种文本文件。试了几个，效果能接受的里面 Piper 最轻。
语音在本机合成，不用 GPU，速度也快，我几乎感觉不到等待。和 Kokoro 比，这次用下来耗时大概只有它的三分之一。
模型按品质分了几档，大小也不一样，最小的不到 20 MB，树莓派也能跑；我用的 Medium 中文模型 60 多 MB。依赖也少，PyTorch、CUDA 这些都不用装。VS Code 插件装上就能读英文，要读中文再下个中文模型就行，非常方便。
用下来也碰到一些不好用的地方：英文模型读不了中文，换成中文模型后中文基本能读，夹在里面的英文单词发音不对，甚至没声音，在网上也没找到解法。所以我觉得它更适合读单一语言的内容，中英混得多的话，Kokoro 更合适。
以下记录了具体的实验和用法：
### VS Code 插件
中文模型我用的是 `zh_CN-huayan-medium`。
1. 在扩展市场搜索并安装 Piper-TTS: Voice。
1. 从 Trelis 的中文模型仓库 下载模型文件和对应的配置文件：
- zh_CN-huayan-medium.onnx
  - zh_CN-huayan-medium.onnx.json
1. 两个文件放进插件的 `voices` 目录。Linux 下我用的版本对应路径是：`~/.vscode/extensions/sethmiller.piper-tts-1.0.3-linux-x64/voices/`
1. 重新加载 VS Code，在插件设置里选中文音色 `zh_CN-huayan-medium`。
扩展目录名会随版本和系统变。找不到 `voices` 时，在 VS Code 扩展目录里搜 `piper-tts`，照那个版本的说明找。
#### 播放和停止
选中一段文字，点右键，在菜单里选 Read Aloud Text / Stop Reading，就能朗读或停止。
### 用 Python 合成整篇文本
接到自己的脚本或其他工具里，可以直接用 Python。
```
mkdir piper-readercd piper-readerpip install piper-ttsmkdir models
```
刚才下载的两个模型文件放进 `models/`，目录长这样：
```
piper-reader/├── models/│ ├── zh_CN-huayan-medium.onnx│ └── zh_CN-huayan-medium.onnx.json└── tts.py
```
`tts.py` 里写：
```
from pathlib import Pathimport sysimport wave
from piper import PiperVoice
model_path = Path("models/zh_CN-huayan-medium.onnx")
if len(sys.argv)  2 else Path("output.wav")text = input_path.read_text(encoding="utf-8").strip()
if not text: raise SystemExit("输入文件没有可合成的文字。")
voice = PiperVoice.load(str(model_path))with wave.open(str(output_path), "wb") as wav_file: voice.synthesize_wav(text, wav_file)
print(f"音频已保存到：{output_path}")
```
准备一个 `article.txt`，跑一下：
```
python tts.py article.txt article.wav
```
运行后会先加载模型，再生成 `article.wav`。代码里只写了 `.onnx` 的路径，Piper 会自己去找同目录下同名的 `.onnx.json`。出来的是 WAV，用系统播放器就能放。
这段脚本要等整篇合成完才保存音频。想边合成边播，可以换成流式接口 `synthesize_stream_raw()`，音频块的播放和衔接要自己处理。
### 参考
实际读出来的效果录在视频里了，可以看：https://www.bilibili.com/video/BV1HTW26tEwX/

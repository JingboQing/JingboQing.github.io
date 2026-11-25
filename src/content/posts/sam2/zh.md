---
title: 视频分割模型 SAM 2
date: 2026-04-23
datePrecision: day
type: resource
summary: SAM 2 是 Meta 开源的图像与视频分割模型，在单帧图像上给出提示后，可将目标的分割结果传播至整段视频。我们在波浪荷载识别试验中采用该模型从相机图像中提取水线。
pinned: false
draft: false
cover: ./cover.svg
coverAlt: 圆柱露出水面的部分被填色标出，下边缘是一条起伏的水线，旁边写着 SAM 2
coverOnPage: false
links:
  - label: GitHub 仓库
    url: https://github.com/facebookresearch/sam2
  - label: 项目主页
    url: https://ai.meta.com/sam2/
  - label: 论文
    url: https://arxiv.org/abs/2408.00714
---

<p class="lead">基于相机图像的波面测量，关键在于从图像中准确提取水线。水面反光、浪花飞溅以及模型表面的标记，均会干扰以边缘检测为基础的传统方法。SAM 2 是 Meta 开源的图像与视频分割模型，在单帧图像上给出提示后，即可在整段视频中持续分割目标。我们在固定结构和浮式结构的波浪荷载识别试验中，均采用该模型从四台相机的图像中提取水线。</p>

## 模型简介

SAM 2（Segment Anything Model 2）由 Meta 基础人工智能研究团队（FAIR）于 2024 年 7 月发布，同年 9 月更新为 SAM 2.1。该模型延续第一代 Segment Anything 模型的提示式分割思路，并将处理对象由单张图像扩展至视频：在任一帧上以点、框或掩膜给出提示后，模型借助记忆模块逐帧处理视频，将分割结果传播至其余各帧；若某一帧的分割存在偏差，可在该帧补充提示予以修正。

模型的训练数据为 SA-V 数据集，包含约 5.1 万段视频和 64 万个时空掩膜。代码与模型权重均以 Apache 2.0 许可证发布，模型共有四种规模，参数量约为 3900 万至 2.2 亿。

## 水线提取

课题组此前在固定圆柱试验中采用 Canny 算子提取水线（Zhu 等，2023）。该流程依次进行灰度化、高斯滤波（用于去除圆柱表面的网格线）和双阈值边缘判定，再限定像素坐标的范围，得到连续的水线。该方法在上述试验中取得了良好的效果；其结果取决于阈值、高斯核尺寸和坐标范围等参数，需针对具体图像分别设定。此外，边缘检测以灰度突变为判据，水面反光和浪花引起的灰度变化也可能被识别为边缘。

![用 Canny 算子提取水线的流程图](./zhu2023-fig6.jpg "Zhu 等（2023）用 Canny 算子提取水线的流程：(a) 原始图像；(b)(c) 小阈值和大阈值的分割结果；(d) 高斯滤波结果；(e) 双阈值判断结果；(f) 提取出的水线。")

后续试验的条件更为复杂：带板圆柱附近出现波浪破碎和浪花飞溅，浮式圆柱随波浪发生纵荡、垂荡和纵摇，水线的位置和形态变化显著，上述参数的设定工作量随之增加。SAM 2 采用提示式分割，在单帧图像上给出提示后，即可将分割结果传播至整个图像序列，无需针对不同画面设定阈值等参数，对不同试验条件的适应性更好。

对每台相机的图像序列，采用 SAM 2 分割圆柱露出水面的区域，得到掩膜序列，掩膜的下边缘即为水线。下方视频取自固定圆柱模型的试验，左侧为单台相机的原始图像，右侧为 SAM 2 的分割结果。图像中，圆柱在水面上的倒影与露出水面的部分相连，而 SAM 2 的分割结果仅包含露出水面的部分。

<figure>
<video controls muted loop playsinline preload="metadata" poster="./sam2-video-poster.jpg">
  <source src="./sam2-video.mp4" type="video/mp4" />
</video>
<figcaption>固定圆柱试验。左：单台相机的原始图像；右：SAM 2 的分割结果，青色区域为圆柱露出水面的部分，其下边缘即为水线。</figcaption>
</figure>

根据相机标定得到的像素坐标与物理坐标的对应关系，可由水线换算出沿水线各点的波面高程。所得波面数据用于[固定结构](/zh/updates/fixed-structure-loads/)和[浮式结构](/zh/updates/floating-cylinder-loads/)的波浪荷载识别。

![由图像序列分割得到掩膜，再提取波面时程](./fig4-vision.jpg "由图像获取波面：(a) 相机布置与试验场景；(b) 由图像序列分割出掩膜序列，再提取沿水线的波面时程。")
## 引用

- **Qing J**, Liu J, Yan J, Whittaker C, Guo A. Wave load identification for a floating cylinder using in-situ wave elevation and structural motion data. *Journal of Fluids and Structures*, 2026, 141: 104485.
- Ravi N, Gabeur V, Hu Y-T, et al. SAM 2: Segment anything in images and videos. arXiv:2408.00714, 2024.
- Zhu S, Liu J, Guo A. Wave force measurement on a large-scale vertical cylinder using a visual technique. *Ocean Engineering*, 2023, 280: 114788.

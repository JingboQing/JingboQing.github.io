---
title: SAM 2, a video segmentation model
date: 2026-04-23
datePrecision: day
type: resource
summary: SAM 2 is Meta's open-source model for image and video segmentation; given a prompt on a single frame, it propagates the segmentation of the target through the whole video. We used it to extract the waterline from camera images in our wave load identification experiments.
inOverview: false
draft: false
cover: ./cover.svg
coverAlt: The part of a cylinder above the water filled in as a mask, its lower edge an undulating waterline, beside the words SAM 2
coverOnPage: false
links:
  - label: GitHub repository
    url: https://github.com/facebookresearch/sam2
  - label: Project page
    url: https://ai.meta.com/sam2/
  - label: Paper
    url: https://arxiv.org/abs/2408.00714
---

<p class="lead">Camera-based measurement of the water surface depends on extracting the waterline accurately from each image. Reflections, spray and markings on the model all interfere with conventional methods based on edge detection. SAM 2 is Meta's open-source model for image and video segmentation: given a prompt on a single frame, it segments the target throughout the video. In our wave load identification experiments on fixed and floating structures, we used it to extract the waterline from the images of four cameras.</p>

## Overview

SAM 2 (Segment Anything Model 2) was released by Meta's Fundamental AI Research team (FAIR) in July 2024 and updated to SAM 2.1 in September of the same year. It retains the promptable segmentation of the first Segment Anything Model and extends it from single images to video: once a prompt is given on any frame as points, a box or a mask, the model processes the video frame by frame with a memory module and propagates the segmentation to the other frames. If the segmentation on a frame is inaccurate, additional prompts on that frame correct it.

The model was trained on the SA-V dataset, which contains about 51,000 videos and 643,000 spatio-temporal masks. The code and the model weights are released under the Apache 2.0 licence, in four sizes ranging from about 39 million to 224 million parameters.

## Waterline extraction

Our group previously extracted the waterline in fixed-cylinder tests with the Canny operator (Zhu et al., 2023). The procedure consists of greyscale conversion, Gaussian filtering to remove the grid lines on the cylinder surface and double-threshold edge detection, followed by a restriction of the pixel-coordinate range, which yields a continuous waterline. The method performed well in those tests. Its results depend on parameters such as the thresholds, the Gaussian kernel size and the coordinate range, which have to be set for the images at hand. Moreover, because edge detection relies on abrupt changes in grey level, the changes caused by reflections and spray may also be detected as edges.

![Flow chart of waterline extraction with the Canny operator](./zhu2023-fig6.jpg "Waterline extraction with the Canny operator by Zhu et al. (2023): (a) original image; (b), (c) segmentation with a small and a large threshold; (d) Gaussian filtering; (e) double-threshold result; (f) extracted waterline.")

The subsequent experiments involved more complex conditions: waves broke and produced spray around the plated cylinder, and the floating cylinder surged, heaved and pitched with the waves. The position and shape of the waterline varied considerably, and setting these parameters required correspondingly more effort. SAM 2 performs promptable segmentation: a prompt on a single frame suffices to propagate the segmentation through the image sequence, without setting thresholds or similar parameters for each view, which makes it more adaptable to different experimental conditions.

For each camera, SAM 2 segmented the part of the cylinder above the water in the image sequence, yielding a sequence of masks whose lower edge is the waterline. The video below is from the tests on the fixed cylinder model: the left side shows the raw images from one camera and the right side the segmentation by SAM 2. In the images, the reflection of the cylinder on the water adjoins the part above the surface, whereas the segmentation by SAM 2 contains only the part above the surface.

<figure>
<video controls muted loop playsinline preload="metadata" poster="./sam2-video-poster.jpg">
  <source src="./sam2-video.mp4" type="video/mp4" />
</video>
<figcaption>Fixed-cylinder test. Left: raw images from one camera; right: segmentation by SAM 2, with the part of the cylinder above the water shown in cyan and its lower edge marking the waterline.</figcaption>
</figure>

From the correspondence between pixel and physical coordinates given by the camera calibration, the surface elevation at points along the waterline is obtained. These data were used for wave load identification on [fixed](/en/updates/fixed-structure-loads/) and [floating structures](/en/updates/floating-cylinder-loads/).

![Masks segmented from the image sequence, and the surface elevation extracted from them](./fig4-vision.jpg "Surface elevation from images: (a) camera arrangement and experimental scene; (b) the image sequence is segmented into a mask sequence, from which the elevation history along the waterline is extracted.")
## Citation

- **Qing J**, Liu J, Yan J, Whittaker C, Guo A. Wave load identification for a floating cylinder using in-situ wave elevation and structural motion data. *Journal of Fluids and Structures*, 2026, 141: 104485.
- Ravi N, Gabeur V, Hu Y-T, et al. SAM 2: Segment anything in images and videos. arXiv:2408.00714, 2024.
- Zhu S, Liu J, Guo A. Wave force measurement on a large-scale vertical cylinder using a visual technique. *Ocean Engineering*, 2023, 280: 114788.

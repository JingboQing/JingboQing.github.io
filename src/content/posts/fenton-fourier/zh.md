---
title: 稳态非线性波程序 Fourier
date: 2026-06-18
datePrecision: day
type: resource
summary: John Fenton 编写的 Fourier 程序采用傅里叶级数数值求解稳态非线性波，适用于接近破碎的大波；同一程序包还提供五阶 Stokes 波和椭圆余弦波程序，可用于相互校核。本文介绍其方法、输入输出与适用范围，并给出算例。
inOverview: false
draft: false
cover: ./cover.svg
coverAlt: 一条波峰尖、波谷平的非线性波浪曲线，下面衬着正弦曲线，旁边写着 Fourier
coverOnPage: false
links:
  - label: 程序主页
    url: https://johndfenton.com/Steady-waves/Fourier.html
  - label: 使用说明
    url: https://johndfenton.com/Steady-waves/Instructions.pdf
---

<p class="lead">设计波通常以规则波描述，但波高较大时，线性理论和低阶 Stokes 理论均存在明显误差。深水条件下可采用高阶 Stokes 理论，浅水条件下可采用椭圆余弦波理论；而对于过渡水深中的大波和接近破碎的波浪，两种解析理论的精度均不理想。John Fenton 公开的 Fourier 程序直接数值求解完整的非线性问题，唯一的近似是傅里叶级数的截断，对接近最大波高的波浪也能给出高精度的结果。</p>

## 方法

该方法最早由 Chappelear（1961）提出，Rienecker 和 Fenton（1981）将其发展为完全基于傅里叶级数的形式。将流场与自由面均表示为傅里叶级数，代入自由面上的运动学边界条件和动力学边界条件，得到关于级数系数、波数和自由面高程的非线性代数方程组，再以牛顿迭代法求解。

对于波高很大的情形，程序先求解一系列波高较小的波，再逐步外推至目标波高，以避免迭代收敛到错误的解。多数问题取 10 至 20 项级数即可满足精度要求，即使接近最大波高也是如此；根据说明文档，在给定波长与水深之比下，该方法可适用至最大波高的约 98%。

## 程序包

Fourier 程序包包含 C++ 源代码和 Windows 可执行程序，最初的 Fortran 版本附于 Fenton（1988）的论文中。网站上另提供 Stokes 和 Cnoidal 两个程序包，分别实现五阶 Stokes 理论（Fenton，1985）和椭圆余弦波理论（Fenton，1999）。三个程序读取相同格式的输入文件，便于相互校核；作者建议一般情况下优先采用 Fourier 程序。[波浪互动实验室](/zh/updates/wave-lab/)中的五阶 Stokes 波演示即采用 Fenton（1985）的系数。

## 输入与输出

主要参数在 Data.dat 中设置：相对波高 $H/d$、给定波长还是周期及其数值、平均流的类型与大小、傅里叶级数的项数，以及外推的波高步数。Convergence.dat 用于设置迭代次数和收敛判据，Points.dat 用于设置输出的自由面点数和流速剖面数。

按周期求解时须指定平均流，可采用两种定义：一是固定点处的时间平均流速，即欧拉平均流速；二是沿水深积分的质量输运速度。封闭水槽中不存在净质量输运，后者为零。平均流的定义不同，同一周期对应的波长和波速也不同，因此比较不同理论或程序的结果时，应首先统一平均流的定义。

程序输出三个文本文件：Solution.res 给出波速、平均流、体积通量、Bernoulli 常数、动量通量、能量和辐射应力等积分量以及傅里叶系数；Surface.res 给出自由面剖面；Flowfield.res 给出各剖面上的速度和加速度。自 2019 年起，程序还额外输出便于其他程序读取的 Solution-Flat.res。程序包附有 Gnuplot 脚本，可直接绘制波面与流场。

## Stokes 理论与椭圆余弦波理论的适用分界

说明文档还讨论了两种解析理论的适用分界。Fenton 引入 Stokes–Ursell 数 $\mathrm{SU} = \mathrm{Ur}/(8\pi^2)$，其中 $\mathrm{Ur} = HL^2/d^3$ 为 Ursell 数；采用 Hedges（1995）建议的分界 $\mathrm{Ur} = 40$，即 $\mathrm{SU} \approx 1/2$，超过该值时不宜采用 Stokes 理论。三个程序均输出该参数。在波浪互动实验室的参数平面中，二阶 Stokes 解在 $\mathrm{Ur} \approx 26$（即 $\mathrm{SU} \approx 1/3$）处开始在波谷出现次峰，与上述分界大体一致。

## 算例

下图比较了两组工况下 Fourier 程序、五阶 Stokes 理论和线性理论给出的波面。工况 (a) 的相对波高 $H/d = 0.2$、相对波长 $L/d = 7$，Stokes–Ursell 数 $\mathrm{SU} = 0.12$，波高约为该波长下最大波高的 31%；Fourier 程序与五阶 Stokes 理论的波面基本重合，线性理论则低估了波峰高度。工况 (b) 的 $H/d = 0.5$、$L/d = 10$，$\mathrm{SU} = 0.63$，超过上节所述的分界，波高约为最大波高的 70%；此时五阶 Stokes 理论的波峰明显偏低，波形出现不合理的起伏，并在波谷处形成虚假的次峰，而 Fourier 程序仍给出波峰尖、波谷平的合理波面。

![Fourier 程序、五阶 Stokes 理论与线性理论的波面对比](./fourier-profiles-zh.svg "一个波长内的波面，波峰位于 $x/L = 0$：(a) $H/d = 0.2$，$L/d = 7$；(b) $H/d = 0.5$，$L/d = 10$。")

Fourier 程序的结果由程序包中的 C++ 源代码编译后计算。按说明文档的建议，多数问题取 10 至 20 项傅里叶级数即可满足精度要求，两组工况均取 20 项。两组工况均给定波长求解，因此波面形状与平均流的定义无关；五阶 Stokes 理论采用 Fenton（1985）的系数。

## 引用

- Chappelear J E. Direct numerical calculation of wave properties. *Journal of Geophysical Research*, 1961, 66(2): 501–508.
- Rienecker M M, Fenton J D. A Fourier approximation method for steady water waves. *Journal of Fluid Mechanics*, 1981, 104: 119–137.
- Fenton J D. A fifth-order Stokes theory for steady waves. *Journal of Waterway, Port, Coastal, and Ocean Engineering*, 1985, 111(2): 216–234.
- Fenton J D. The numerical solution of steady water wave problems. *Computers & Geosciences*, 1988, 14: 357–368.
- Fenton J D. The cnoidal theory of water waves. In: Herbich J B (ed.), *Developments in Offshore Engineering*. Houston: Gulf, 1999: 55–100.
- Hedges T S. Regions of validity of analytical wave theories. *Proceedings of the Institution of Civil Engineers – Water, Maritime and Energy*, 1995, 112: 111–114.

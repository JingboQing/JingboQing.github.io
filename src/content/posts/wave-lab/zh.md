---
title: 波浪互动实验室
date: 2026-11-13
datePrecision: day
type: resource
summary: 规则波、不规则波、Stokes 波和圆柱绕射的浏览器演示：调整参数，观察波面传播、水质点运动、波浪谱、波高统计、非线性效应以及圆柱所受的波浪力。
pinned: true
draft: false
cover: ./cover.svg
coverAlt: 希腊字母 η 与一条波浪曲线
coverOnPage: false
links:
  - label: 规则波演示
    url: /demos/linear-wave/index.html?lang=zh
  - label: 不规则波演示
    url: /demos/irregular-wave/index.html?lang=zh
  - label: Stokes 波演示
    url: /demos/nonlinear-wave/index.html?lang=zh
  - label: 圆柱绕射演示
    url: /demos/cylinder/index.html?lang=zh
---

线性波理论将波浪视为小振幅的简谐运动。这一理论形式简单，却能解释许多现象：波长随水深的变化、水面以下水体的运动，以及看似杂乱的真实海面如何由许多规则波叠加而成。波高增大后，波峰变尖、波谷变平，水质点还会缓慢向前漂移，这些现象需要用 Stokes 非线性理论描述。波浪遇到尺度较大的结构物时还会发生反射和绕射，结构所受的力不能再直接按入射波计算。下面的演示均在浏览器中实时计算。

## 规则波

可调整波高 $H$、周期 $T$、水深 $h$ 和流速 $U$。上图为传播中的波面，下图为不同深度处水质点的运动轨迹：深水中轨迹接近圆形，半径随深度减小；水深变浅后，轨迹压扁为水平方向的椭圆。

<iframe class="demo-frame" src="/demos/linear-wave/index.html?lang=zh" title="线性规则波互动演示" loading="lazy"></iframe>

## 不规则波

真实海面可以看作许多频率不同、相位随机的规则波的叠加。演示用 JONSWAP 谱生成随机波面，同时给出某一点的浪高仪记录、由长记录估计的谱，以及跨零波高与 Rayleigh 分布的对比。“水槽试验工况”按钮对应一个实验室测试中可能用到的不规则波工况。

<iframe class="demo-frame" src="/demos/irregular-wave/index.html?lang=zh" title="线性不规则波互动演示" loading="lazy"></iframe>

## Stokes 波

可调整波高 $H$、周期 $T$ 和水深 $h$，并在二阶和五阶之间切换。第一张图以波高归一化，比较线性、二阶和五阶的波面；第二张图追踪四个深度处的水质点，左侧为漂流速度沿深度的分布；第三张图在水深–波高参数平面上标出当前波浪的位置。

<iframe class="demo-frame" src="/demos/nonlinear-wave/index.html?lang=zh" title="Stokes 波互动演示" loading="lazy"></iframe>

## 圆柱绕射

规则波从左侧入射，作用于一根直立在海底的圆柱。可调整波高 $H$、周期 $T$、水深 $h$ 和圆柱直径 $D$。三维图为圆柱周围的瞬时波面，也可只显示圆柱的散射波；下方两张图分别为沿圆柱一周的波面振幅，以及由波浪力换算的等效惯性系数随 $ka$ 的变化。

<iframe class="demo-frame" src="/demos/cylinder/index.html?lang=zh" title="圆柱绕射互动演示" loading="lazy"></iframe>

反之，仅由柱面水线上少数几点的波面，也可以识别圆柱所受的力，相应演示见[由波面识别荷载的研究](/zh/updates/fixed-structure-loads/#测点数量与布置)。

## 理论

规则波、不规则波和圆柱绕射三个演示采用线性（Airy）波理论，Stokes 波演示在此基础上逐阶加入非线性修正。$x$ 沿波浪传播方向，$z$ 竖直向上，静水面为 $z=0$，海底水平，水深为 $h$。

### 线性化的边值问题

将水视为无黏、不可压缩流体，并假定流动无旋，流速为速度势 $\Phi$ 的梯度。$\Phi$ 在水体内满足拉普拉斯方程，海底处法向速度为零：

$$
{\nabla^2\Phi = 0 \quad (-h<z<\eta)}, \qquad\allowbreak {\frac{\partial\Phi}{\partial z} = 0 \quad (z=-h)}.
$$

自由面上，水面质点始终保持在水面上（运动学条件），水面压力等于大气压（动力学条件）。波幅远小于波长和水深时，略去两个条件中的乘积项，并在 $z=0$ 处取值：

$$
{\frac{\partial\eta}{\partial t} = \frac{\partial\Phi}{\partial z}}, \qquad\allowbreak {\frac{\partial\Phi}{\partial t} + g\eta = 0 \qquad (z=0)}.
$$

方程和边界条件均为线性，解满足叠加原理。

### 规则波

振幅 $a = H/2$ 的行进波解为

$$
{\eta = a\cos\theta}, \qquad\allowbreak {\Phi = \frac{ga}{\omega}\,\frac{\cosh k(z+h)}{\cosh kh}\,\sin\theta}, \qquad\allowbreak {\theta = kx-\omega t} .
$$

代入自由面条件得到色散关系

$$
{\omega^2 = gk\tanh kh}, \qquad\allowbreak {\omega = \frac{2\pi}{T}, \quad k = \frac{2\pi}{L}}.
$$

这是关于 $k$ 的隐式方程，演示中用牛顿迭代求解。波峰以相速 $c$ 移动，波能以群速 $c_g$ 传播：

$$
{c = \frac{\omega}{k}}, \qquad\allowbreak {c_g = \frac{\mathrm{d}\omega}{\mathrm{d}k} = \frac{c}{2}\left(1 + \frac{2kh}{\sinh 2kh}\right)}.
$$

速度势对 $x$、$z$ 求导，得到水质点速度

$$
{u = a\omega\,\frac{\cosh k(z+h)}{\sinh kh}\cos\theta}, \qquad\allowbreak {w = a\omega\,\frac{\sinh k(z+h)}{\sinh kh}\sin\theta} .
$$

再对时间积分可知，水质点绕平衡位置做椭圆运动，水平半轴和竖向半轴分别为

$$
{A = a\,\frac{\cosh k(z+h)}{\sinh kh}}, \qquad\allowbreak {B = a\,\frac{\sinh k(z+h)}{\sinh kh}}.
$$

深水（$h/L \ge 1/2$）中 $\tanh kh \to 1$，波长 $L = gT^2/(2\pi)$ 与水深无关。轨迹为圆，半径随深度按 $e^{kz}$ 衰减，在半个波长深处仅为水面处的 4%；群速为相速的一半。浅水（$h/L \le 1/20$）中 $\tanh kh \to kh$，不同周期的波均以 $\sqrt{gh}$ 传播。轨迹压扁为水平椭圆，水平半轴沿深度几乎不变，竖向半轴线性减小，在海底处为零。

波陡存在上限：$H/L$ 达到 $0.142\tanh kh$（Miche 极限）时，波浪破碎。

### 均匀流

流速 $U$ 以沿 $x$ 方向为正，逆流为负。随水流运动的观察者看到的是静水中的波，其相对频率 $\sigma$ 满足静水色散关系；固定点处的频率 $\omega$ 还需计入多普勒频移：

$$
{\omega = \sigma + kU}, \qquad\allowbreak {\sigma^2 = gk\tanh kh} .
$$

演示中的 $T = 2\pi/\omega$ 是固定点（如浪高仪）测得的周期，$T_r = 2\pi/\sigma$ 是随水流运动时测得的周期。$T$ 保持不变时，顺流使波长增大，逆流使波长减小。群速为 $c_g = c_{g,r} + U$，其中 $c_{g,r}$ 按上一节的公式以 $\sigma$ 计算。

逆流越强，群速越小。群速降为零时，波能无法继续逆流传播，即波浪阻塞（Peregrine，1976）。深水中阻塞流速为 $U = -gT/(8\pi)$：对周期 2 s 的波，逆流流速超过 0.78 m/s 时波浪便无法传播。

### 不规则波

随机相位模型将波面表示为许多规则波的叠加：

$$
{\eta(x,t) = \sum_j a_j\cos(k_jx - \omega_jt + \varphi_j)}, \quad\allowbreak {a_j = \sqrt{2S(f_j)\,\Delta f}}.
$$

相位 $\varphi_j$ 在 $[0, 2\pi)$ 上均匀分布，波数 $k_j$ 由各自的频率按色散关系确定。这一模型忽略了各分量之间的非线性相互作用，这类相互作用可用高阶谱方法模拟（见[分享](/zh/updates/hos/)）。由中心极限定理，任一点的 $\eta$ 服从正态分布，方差等于谱面积 $m_0$。

谱型采用 JONSWAP 谱（Hasselmann 等，1973）：

$$
{S(f) = C\,f^{-5}\exp\!\left[-\frac54\left(\frac{f_p}{f}\right)^4\right]\gamma^{\,r}}, \qquad\allowbreak {r = \exp\!\left[-\frac{(f-f_p)^2}{2\sigma_J^2 f_p^2}\right]}.
$$

$f_p = 1/T_p$ 为谱峰频率，$\sigma_J$ 在峰前取 0.07、峰后取 0.09，常数 $C$ 由 $4\sqrt{m_0} = H_s$ 确定。谱峰升高因子 $\gamma$ 控制谱峰的尖锐程度：$\gamma = 1$ 时即为 Pierson–Moskowitz 谱，JONSWAP 观测的平均值为 3.3。

由谱矩得到有效波高和平均跨零周期：

$$
{m_n = \int_0^\infty f^{\,n}S(f)\,\mathrm{d}f}, \qquad\allowbreak {H_{m0} = 4\sqrt{m_0}}, \qquad\allowbreak {T_{m02} = \sqrt{m_0/m_2}}.
$$

窄带海况中，跨零波高服从 Rayleigh 分布（Longuet-Higgins，1952）。记 $x = H/H_{m0}$，

$$
{P(H > x H_{m0}) = e^{-2x^2}}, \qquad\allowbreak {p(x) = 4x\,e^{-2x^2}}.
$$

由此可得 $H_{1/3} \approx H_{m0}$；$N$ 个波中最大波高的众数约为 $H_{m0}\sqrt{(\ln N)/2}$，数百个波中的最大波高约为 $1.8H_{m0}$。

浪高仪记录的谱采用 Welch 法估计（Welch，1967）：将长记录分为每段 2048 点、相邻段重叠一半的若干段，每段加 Hann 窗后计算周期图，再对各段取平均。

### 二阶 Stokes 波

波高增大后，自由面条件中的乘积项不能再略去。Stokes（1847）以波陡 $\varepsilon = ka$ 为小参数，将速度势和波面展开为级数 $\Phi = \varepsilon\Phi_1 + \varepsilon^2\Phi_2 + \cdots$，$\eta = \varepsilon\eta_1 + \varepsilon^2\eta_2 + \cdots$，并将自由面条件在 $z=0$ 处做 Taylor 展开后按阶整理。一阶解即上文的线性解；二阶项由一阶量的乘积驱动，产生频率为 $2\omega$ 的分量（Dean 和 Dalrymple，1991）：

$$
{\eta = a\cos\theta + a_2\cos 2\theta}, \qquad\allowbreak {a_2 = \frac{ka^2}{4}\,\frac{\cosh kh\,(2+\cosh 2kh)}{\sinh^3 kh}},
$$

$$
{\Phi = \frac{ga}{\omega}\,\frac{\cosh k(z+h)}{\cosh kh}\sin\theta} + {\frac{3}{8}\,a^2\omega\,\frac{\cosh 2k(z+h)}{\sinh^4 kh}\sin 2\theta}.
$$

色散关系在二阶保持不变。$\cos 2\theta$ 在波峰（$\theta = 0$）和波谷（$\theta = \pi$）处均等于 1，二倍频分量使两处同时抬高：波峰高度为 $a + a_2$，波谷深度为 $a - a_2$，平均水位不变。深水中 $a_2 = ka^2/2$。水深减小时 $a_2/a$ 迅速增大，在浅水极限下

$$
{\frac{a_2}{a} \approx \frac{3ka}{4(kh)^3} = \frac{3\,\mathrm{Ur}}{32\pi^2}}, \qquad\allowbreak {\mathrm{Ur} = \frac{HL^2}{h^3}},
$$

即浅水中二阶修正的大小由 Ursell 数（Ursell，1953）决定。$a_2 > a/4$ 时，$\cos 2\theta$ 项在波谷中部形成次峰，二阶解在此失效；在浅水中，这一条件对应 $\mathrm{Ur} \approx 8\pi^2/3 \approx 26$。

### 五阶 Stokes 波

展开至 $\varepsilon^5$ 时，波面包含一至五倍频分量（Skjelbreia 和 Hendrickson，1960）。演示采用 Fenton（1985）的形式，取 $\varepsilon = kH/2$：

$$
{k\eta = \varepsilon\cos\theta} + {\varepsilon^2 B_{22}\cos 2\theta} + {\varepsilon^3 B_{31}(\cos\theta - \cos 3\theta)} + {\varepsilon^4 (B_{42}\cos 2\theta + B_{44}\cos 4\theta)} + {\varepsilon^5 B_{53}(\cos 3\theta - \cos\theta)} + {\varepsilon^5 B_{55}(\cos 5\theta - \cos\theta)},
$$

$$
{c = \sqrt{g/k}\,\bigl(C_0 + \varepsilon^2 C_2 + \varepsilon^4 C_4\bigr)}, \qquad\allowbreak {C_0 = \sqrt{\tanh kh}}.
$$

系数 $B_{ij}$、$C_i$ 只依赖于 $kh$，表达式较长，详见 Fenton（1985）；Fenton 公开的 Fourier 程序可给出完全非线性解，可用于检验五阶理论的精度（见[分享](/zh/updates/fenton-fourier/)）。三阶和五阶项在波峰和波谷处为零，二阶和四阶项在两处相等，因此波峰至波谷的高度恰为 $H$。

从三阶开始，相速随波高变化。深水中 $C_2 = 1/2$，$c = \sqrt{g/k}\,\bigl(1 + \tfrac12\varepsilon^2 + \tfrac18\varepsilon^4\bigr)$：周期不变时，波高越大，波速越快，波长也越长。演示取欧拉平均流速为零，由这一关系根据 $T$ 求解 $k$。

浅水中这些系数随 $kh$ 减小而迅速增大，五阶波面同样会在波谷出现次峰。五阶理论的适用范围比二阶宽，但对于 Ursell 数很大的浅水长波，应改用椭圆余弦波理论（Korteweg 和 de Vries，1895）。

### Stokes 漂流

线性理论中，水质点的轨迹是闭合的。计入二阶效应后，水质点位于波峰下方时位置偏高、向前速度较大，位于波谷下方时位置偏低、向后速度较小，因此每个周期都有一段净向前位移。沿质点轨迹对二阶速度场取平均，得到漂流速度（Dean 和 Dalrymple，1991）：

$$
\bar u_s = \frac{ka^2\omega}{2}\,\frac{\cosh 2k(z+h)}{\sinh^2 kh}.
$$

深水中 $\bar u_s = (ka)^2 c\,e^{2kz}$，随深度的衰减速率是轨道半径的两倍；浅水中漂流速度沿深度几乎均匀。演示中的质点路径由二阶或五阶速度场逐步积分得到。在两端封闭的水槽中，漂流引起的质量输运会被反向回流抵消。

### 参数平面

Stokes 波演示的第三张图以 $h/(gT^2)$ 为横轴、$H/(gT^2)$ 为纵轴，这类图常用于比较各种波浪理论的适用范围（Le Méhauté，1976）。灰色区域超过 Miche 破碎极限，橙色区域为二阶解出现次峰的 $a_2/a_1 > 1/4$（$a_1 = a$ 为一阶振幅），虚线为 $a_2/a_1 = 0.05$，两条竖线 $h/L = 1/20$ 和 $1/2$ 将浅水、过渡水深和深水分开。

深水中 $a_2/a_1 = ka/2$，即使达到破碎极限也仅约 0.22，不会出现次峰；浅水中等值线随水深减小迅速下降，较小的波高即会出现次峰。

### 圆柱绕射

半径为 $a$ 的直立圆柱立于海底，入射波沿 $x$ 方向传播。按线性势流理论，总波面为入射波与圆柱散射波之和；散射波抵消入射波在柱面上的法向速度，并向外传播（MacCamy 和 Fuchs，1954）。以圆柱中心为原点取极坐标 $(r, \theta)$，$\theta$ 自波浪传播方向起算：

$$
{\eta = \mathrm{Re}\bigl[A\,e^{-i\omega t}\bigr]}, \qquad\allowbreak {A = \frac{H}{2}\sum_{m=0}^{\infty}\epsilon_m i^m Z_m(r)\cos m\theta}, \qquad\allowbreak {Z_m(r) = J_m(kr) - \frac{J_m'(ka)}{H_m'(ka)}H_m(kr)}.
$$

$J_m$、$Y_m$ 分别为第一类和第二类 Bessel 函数，$H_m = J_m + iY_m$ 为第一类 Hankel 函数，$\epsilon_0 = 1$，$m \ge 1$ 时 $\epsilon_m = 2$。$J_m(kr)$ 项为入射波的柱面波展开，$H_m(kr)$ 项为向外传播的散射波。在柱面上，利用 Bessel 函数的 Wronski 行列式，复振幅可化简为

$$
A(a, \theta) = \frac{H}{2}\sum_{m=0}^{\infty}\epsilon_m i^m\,\frac{2i}{\pi ka\,H_m'(ka)}\cos m\theta.
$$

$ka$ 很小时，圆柱对入射波几乎没有扰动，柱面各处振幅均接近入射波幅。$ka$ 很大时，迎浪面如同直墙将波浪反射，迎浪点振幅趋于入射波幅的 2 倍，背浪侧形成遮蔽区。

将柱面压力 $p = \rho g\,\eta\cosh k(z+h)/\cosh kh$ 沿圆周和水深积分，只有 $m = 1$ 项对水平力有贡献：

$$
{F = \frac{2\rho g H\tanh kh}{k^2\,|H_1'(ka)|}\cos(\omega t + \delta)}, \qquad\allowbreak {\tan\delta = \frac{Y_1'(ka)}{J_1'(ka)}}.
$$

其中入射波面为 $\eta = (H/2)\cos(kx - \omega t)$。$ka$ 很小时 $|H_1'(ka)| \approx 2/[\pi (ka)^2]$，$\delta \to 90^\circ$，上式退化为 Morison 公式中的惯性力，惯性系数 $C_M = 2$（Morison 等，1950）：

$$
F = \rho\,C_M\,\pi a^2\,\frac{gH}{2}\tanh kh.
$$

将 MacCamy–Fuchs 力写成同样的形式，可得等效惯性系数 $C_{M,\mathrm{eff}} = 4/[\pi (ka)^2\,|H_1'(ka)|]$。$ka$ 很小时它等于 2，在 $ka \approx 0.32$ 处达到最大值（约 2.06）；$ka$ 超过 0.5 后降至 2 以下并迅速减小，此时仍取 $C_M = 2$ 会高估惯性力。工程上常以 $D/L > 0.2$ 作为需要考虑绕射效应的界限，对应 $ka > 0.63$。采用开源边界元程序 Capytaine 计算同一问题，结果与该解析解的差别小于 1.2%（见[分享](/zh/updates/capytaine/)）。

MacCamy–Fuchs 解为势流解，不包含黏性引起的拖曳力。拖曳力的相对大小可用 KC 数 $\mathrm{KC} = u_{\max}T/D$ 衡量，水面处 $\mathrm{KC} = \pi H/(D\tanh kh)$；KC 数较小时惯性力占主导，绕射效应明显的大直径圆柱一般属于这种情况。

### 参考文献

- Dean R G, Dalrymple R A. *Water Wave Mechanics for Engineers and Scientists*. World Scientific, 1991.
- Fenton J D. A fifth-order Stokes theory for steady waves. *Journal of Waterway, Port, Coastal, and Ocean Engineering*, 1985, 111(2): 216–234.
- Hasselmann K, et al. Measurements of wind-wave growth and swell decay during the Joint North Sea Wave Project (JONSWAP). *Ergänzungsheft zur Deutschen Hydrographischen Zeitschrift*, Reihe A, Nr. 12, 1973.
- Holthuijsen L H. *Waves in Oceanic and Coastal Waters*. Cambridge University Press, 2007.
- Korteweg D J, de Vries G. On the change of form of long waves advancing in a rectangular canal, and on a new type of long stationary waves. *Philosophical Magazine*, 1895, 39(240): 422–443.
- Le Méhauté B. *An Introduction to Hydrodynamics and Water Waves*. Springer, 1976.
- Longuet-Higgins M S. On the statistical distribution of the heights of sea waves. *Journal of Marine Research*, 1952, 11(3): 245–266.
- MacCamy R C, Fuchs R A. *Wave Forces on Piles: A Diffraction Theory*. Technical Memorandum No. 69, Beach Erosion Board, U.S. Army Corps of Engineers, 1954.
- Morison J R, O'Brien M P, Johnson J W, Schaaf S A. The force exerted by surface waves on piles. *Journal of Petroleum Technology*, 1950, 2(5): 149–154.
- Peregrine D H. Interaction of water waves and currents. *Advances in Applied Mechanics*, 1976, 16: 9–117.
- Skjelbreia L, Hendrickson J A. Fifth order gravity wave theory. *Proceedings of the 7th International Conference on Coastal Engineering*, 1960: 184–196.
- Stokes G G. On the theory of oscillatory waves. *Transactions of the Cambridge Philosophical Society*, 1847, 8: 441–455.
- Ursell F. The long-wave paradox in the theory of gravity waves. *Proceedings of the Cambridge Philosophical Society*, 1953, 49(4): 685–694.
- Welch P D. The use of fast Fourier transform for the estimation of power spectra: a method based on time averaging over short, modified periodograms. *IEEE Transactions on Audio and Electroacoustics*, 1967, 15(2): 70–73.

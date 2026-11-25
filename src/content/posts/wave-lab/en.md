---
title: An interactive wave laboratory
date: 2026-11-13
datePrecision: day
type: resource
summary: "Browser demonstrations of regular, irregular and Stokes waves and of diffraction by a cylinder: adjust the parameters and observe the free surface, the particle motion beneath it, the spectrum, the wave-height statistics, the effect of nonlinearity and the force on the cylinder."
inOverview: true
draft: false
cover: ./cover.svg
coverAlt: The Greek letter η above a wave curve
coverOnPage: false
links:
  - label: Regular waves
    url: /demos/linear-wave/index.html?lang=en
  - label: Irregular waves
    url: /demos/irregular-wave/index.html?lang=en
  - label: Stokes waves
    url: /demos/nonlinear-wave/index.html?lang=en
  - label: Diffraction by a cylinder
    url: /demos/cylinder/index.html?lang=en
---

Linear wave theory treats waves as small-amplitude harmonic motion. It is simple, yet it explains a great deal: how the wavelength changes with depth, how the water beneath the surface moves, and how a sea that looks disordered is built from many regular waves. As the wave height increases, the crests sharpen, the troughs flatten and the water particles drift slowly forward; these effects are described by Stokes's nonlinear theory. A large structure also reflects and diffracts the waves, and the force on it can then no longer be calculated directly from the incident wave. All the demonstrations below are computed in real time in the browser.

## Regular waves

The wave height $H$, period $T$, depth $h$ and current $U$ can be adjusted. The upper plot shows the propagating free surface, and the lower plot the particle orbits at several depths. In deep water the orbits are nearly circular and shrink with depth; in shallow water they flatten into horizontal ellipses.

<iframe class="demo-frame" src="/demos/linear-wave/index.html?lang=en" title="Interactive demonstration of linear regular waves" loading="lazy"></iframe>

## Irregular waves

A real sea can be regarded as the superposition of many regular waves with different frequencies and random phases. The demonstration generates a random surface from a JONSWAP spectrum and shows a wave-gauge record at one point, the spectrum estimated from a long record, and the zero-crossing wave heights compared with the Rayleigh distribution. The "Flume case" button sets an irregular-wave condition of the kind that might be used in a laboratory test.

<iframe class="demo-frame" src="/demos/irregular-wave/index.html?lang=en" title="Interactive demonstration of linear irregular waves" loading="lazy"></iframe>

## Stokes waves

The wave height $H$, period $T$ and depth $h$ can be adjusted, and the order switched between second and fifth. The first plot, normalised by the wave height, compares the linear, second-order and fifth-order surfaces; the second follows particles at four depths, with the drift velocity against depth on the left; the third marks the position of the current wave in the depth–height plane.

<iframe class="demo-frame" src="/demos/nonlinear-wave/index.html?lang=en" title="Interactive demonstration of Stokes waves" loading="lazy"></iframe>

## Diffraction by a cylinder

A regular wave arrives from the left at a vertical cylinder standing on the seabed. The wave height $H$, period $T$, depth $h$ and cylinder diameter $D$ can be adjusted. The 3D view shows the instantaneous surface around the cylinder, or the scattered wave alone; the two plots below show the wave amplitude around the cylinder and the force expressed as an effective inertia coefficient against $ka$.

<iframe class="demo-frame" src="/demos/cylinder/index.html?lang=en" title="Interactive demonstration of wave diffraction by a cylinder" loading="lazy"></iframe>

Conversely, the force on the cylinder can be identified from the surface at only a few points on its waterline; a demonstration accompanies the [research on identifying loads from the surface](/en/updates/fixed-structure-loads/#number-and-placement-of-measurement-points).

## Theory

The regular-wave, irregular-wave and cylinder demonstrations use linear (Airy) wave theory; the Stokes-wave demonstration adds nonlinear corrections to it order by order. $x$ points in the direction of wave travel, $z$ points up from the still-water level $z=0$, and the bed is flat at depth $h$.

### The linearised boundary-value problem

Water is treated as inviscid and incompressible and the flow as irrotational, so the velocity is the gradient of a potential $\Phi$. $\Phi$ satisfies Laplace's equation in the water, and the normal velocity vanishes at the bed:

$$
{\nabla^2\Phi = 0 \quad (-h<z<\eta)}, \qquad\allowbreak {\frac{\partial\Phi}{\partial z} = 0 \quad (z=-h)}.
$$

At the free surface, particles stay on the surface (kinematic condition) and the pressure is atmospheric (dynamic condition). For amplitudes much smaller than the wavelength and the depth, the product terms in both conditions are dropped and the conditions are applied at $z=0$:

$$
{\frac{\partial\eta}{\partial t} = \frac{\partial\Phi}{\partial z}}, \qquad\allowbreak {\frac{\partial\Phi}{\partial t} + g\eta = 0 \qquad (z=0)}.
$$

The equations and boundary conditions are now linear, so solutions can be superposed.

### Regular waves

A progressive wave of amplitude $a = H/2$ is

$$
{\eta = a\cos\theta}, \qquad\allowbreak {\Phi = \frac{ga}{\omega}\,\frac{\cosh k(z+h)}{\cosh kh}\,\sin\theta}, \qquad\allowbreak {\theta = kx-\omega t} .
$$

The surface conditions then give the dispersion relation

$$
{\omega^2 = gk\tanh kh}, \qquad\allowbreak {\omega = \frac{2\pi}{T}, \quad k = \frac{2\pi}{L}}.
$$

This is implicit in $k$; the demonstration solves it by Newton iteration. Crests move at the phase speed $c$ and wave energy at the group velocity $c_g$:

$$
{c = \frac{\omega}{k}}, \qquad\allowbreak {c_g = \frac{\mathrm{d}\omega}{\mathrm{d}k} = \frac{c}{2}\left(1 + \frac{2kh}{\sinh 2kh}\right)}.
$$

Differentiating the potential with respect to $x$ and $z$ gives the particle velocities

$$
{u = a\omega\,\frac{\cosh k(z+h)}{\sinh kh}\cos\theta}, \qquad\allowbreak {w = a\omega\,\frac{\sinh k(z+h)}{\sinh kh}\sin\theta} .
$$

Integrating in time shows that each particle moves on an ellipse about its mean position, with horizontal and vertical semi-axes

$$
{A = a\,\frac{\cosh k(z+h)}{\sinh kh}}, \qquad\allowbreak {B = a\,\frac{\sinh k(z+h)}{\sinh kh}}.
$$

In deep water ($h/L \ge 1/2$), $\tanh kh \to 1$ and the wavelength $L = gT^2/(2\pi)$ no longer depends on depth. The orbits are circles whose radius decays as $e^{kz}$, falling to 4% of the surface value half a wavelength below; the group velocity is half the phase speed. In shallow water ($h/L \le 1/20$), $\tanh kh \to kh$ and waves of all periods travel at $\sqrt{gh}$. The orbits flatten into horizontal ellipses: the horizontal semi-axis barely changes with depth, while the vertical one decreases linearly to zero at the bed.

The steepness has an upper limit: the wave breaks when $H/L$ reaches $0.142\tanh kh$ (the Miche limit).

### Uniform current

The current $U$ is positive along $x$ and negative when opposing. An observer moving with the current sees a still-water wave, whose relative frequency $\sigma$ satisfies the still-water dispersion relation; at a fixed point the frequency $\omega$ also includes a Doppler shift:

$$
{\omega = \sigma + kU}, \qquad\allowbreak {\sigma^2 = gk\tanh kh} .
$$

In the demonstration $T = 2\pi/\omega$ is the period recorded at a fixed point (such as a wave gauge), and $T_r = 2\pi/\sigma$ the period measured while moving with the current. At fixed $T$, a following current lengthens the waves and an opposing one shortens them. The group velocity is $c_g = c_{g,r} + U$, with $c_{g,r}$ from the previous section evaluated with $\sigma$.

A stronger opposing current means a smaller group velocity. When the group velocity falls to zero, wave energy can no longer propagate against the current; this is wave blocking (Peregrine, 1976). In deep water blocking occurs at $U = -gT/(8\pi)$, so a 2 s wave cannot propagate against a current stronger than 0.78 m/s.

### Irregular waves

The random-phase model represents the free surface as a superposition of many regular waves:

$$
{\eta(x,t) = \sum_j a_j\cos(k_jx - \omega_jt + \varphi_j)}, \quad\allowbreak {a_j = \sqrt{2S(f_j)\,\Delta f}}.
$$

The phases $\varphi_j$ are uniform on $[0, 2\pi)$ and each wavenumber $k_j$ follows from its frequency through the dispersion relation. The model ignores nonlinear interactions between the components; these can be simulated with the High-Order Spectral method (see [this post](/en/updates/hos/)). By the central limit theorem, $\eta$ at any point is Gaussian, with variance equal to the area under the spectrum, $m_0$.

The spectrum takes the JONSWAP form (Hasselmann et al., 1973):

$$
{S(f) = C\,f^{-5}\exp\!\left[-\frac54\left(\frac{f_p}{f}\right)^4\right]\gamma^{\,r}}, \qquad\allowbreak {r = \exp\!\left[-\frac{(f-f_p)^2}{2\sigma_J^2 f_p^2}\right]}.
$$

$f_p = 1/T_p$ is the peak frequency, $\sigma_J$ is 0.07 below the peak and 0.09 above it, and $C$ is fixed by $4\sqrt{m_0} = H_s$. The peak enhancement factor $\gamma$ controls the sharpness of the peak: $\gamma = 1$ gives the Pierson–Moskowitz spectrum, and the mean value from the JONSWAP measurements is 3.3.

The spectral moments give the significant height and the mean zero-crossing period:

$$
{m_n = \int_0^\infty f^{\,n}S(f)\,\mathrm{d}f}, \qquad\allowbreak {H_{m0} = 4\sqrt{m_0}}, \qquad\allowbreak {T_{m02} = \sqrt{m_0/m_2}}.
$$


In a narrow-band sea the zero-crossing heights follow the Rayleigh distribution (Longuet-Higgins, 1952). With $x = H/H_{m0}$,

$$
{P(H > x H_{m0}) = e^{-2x^2}}, \qquad\allowbreak {p(x) = 4x\,e^{-2x^2}}.
$$

It follows that $H_{1/3} \approx H_{m0}$, and the most probable largest height among $N$ waves is about $H_{m0}\sqrt{(\ln N)/2}$; among a few hundred waves, the largest height is about $1.8H_{m0}$.

The spectrum of the gauge record is estimated with Welch's method (Welch, 1967): the long record is divided into 2048-point segments overlapping by half, each segment is multiplied by a Hann window and its periodogram computed, and the periodograms are averaged.

### Second-order Stokes waves

As the wave height increases, the product terms in the surface conditions can no longer be dropped. Stokes (1847) expanded in the steepness $\varepsilon = ka$, writing $\Phi = \varepsilon\Phi_1 + \varepsilon^2\Phi_2 + \cdots$ and $\eta = \varepsilon\eta_1 + \varepsilon^2\eta_2 + \cdots$, expanding the surface conditions about $z=0$ in Taylor series and collecting orders. The first order is the linear solution above; the second is driven by products of first-order terms and adds a component at frequency $2\omega$ (Dean and Dalrymple, 1991):

$$
{\eta = a\cos\theta + a_2\cos 2\theta}, \qquad\allowbreak {a_2 = \frac{ka^2}{4}\,\frac{\cosh kh\,(2+\cosh 2kh)}{\sinh^3 kh}},
$$

$$
{\Phi = \frac{ga}{\omega}\,\frac{\cosh k(z+h)}{\cosh kh}\sin\theta} + {\frac{3}{8}\,a^2\omega\,\frac{\cosh 2k(z+h)}{\sinh^4 kh}\sin 2\theta}.
$$

The dispersion relation is unchanged at second order. Since $\cos 2\theta$ equals 1 both at the crest ($\theta = 0$) and at the trough ($\theta = \pi$), the second harmonic lifts both: the crest stands $a + a_2$ high, the trough is $a - a_2$ deep, and the mean level is unchanged. In deep water $a_2 = ka^2/2$. The ratio $a_2/a$ grows quickly as the depth decreases, and in the shallow-water limit

$$
{\frac{a_2}{a} \approx \frac{3ka}{4(kh)^3} = \frac{3\,\mathrm{Ur}}{32\pi^2}}, \qquad\allowbreak {\mathrm{Ur} = \frac{HL^2}{h^3}},
$$

so in shallow water the size of the correction is set by the Ursell number (Ursell, 1953). When $a_2 > a/4$, the $\cos 2\theta$ term produces a secondary crest in the middle of the trough and the second-order solution fails there; in shallow water this happens at $\mathrm{Ur} \approx 8\pi^2/3 \approx 26$.

### Fifth-order Stokes waves

Carried to $\varepsilon^5$, the surface contains the first to fifth harmonics (Skjelbreia and Hendrickson, 1960). The demonstration follows Fenton (1985), with $\varepsilon = kH/2$:

$$
{k\eta = \varepsilon\cos\theta} + {\varepsilon^2 B_{22}\cos 2\theta} + {\varepsilon^3 B_{31}(\cos\theta - \cos 3\theta)} + {\varepsilon^4 (B_{42}\cos 2\theta + B_{44}\cos 4\theta)} + {\varepsilon^5 B_{53}(\cos 3\theta - \cos\theta)} + {\varepsilon^5 B_{55}(\cos 5\theta - \cos\theta)},
$$

$$
{c = \sqrt{g/k}\,\bigl(C_0 + \varepsilon^2 C_2 + \varepsilon^4 C_4\bigr)}, \qquad\allowbreak {C_0 = \sqrt{\tanh kh}}.
$$

The coefficients $B_{ij}$ and $C_i$ depend only on $kh$; their full expressions are in Fenton (1985), whose Fourier program gives fully nonlinear solutions against which the fifth-order theory can be checked (see [this post](/en/updates/fenton-fourier/)). The third- and fifth-order terms vanish at the crest and the trough, and the second- and fourth-order terms take the same value at both, so the crest-to-trough height is exactly $H$.

From third order on, the wave speed depends on the wave height. In deep water $C_2 = 1/2$ and $c = \sqrt{g/k}\,\bigl(1 + \tfrac12\varepsilon^2 + \tfrac18\varepsilon^4\bigr)$: at a fixed period, a higher wave travels faster and has a longer wavelength. The demonstration takes the mean Eulerian current as zero and solves this relation for $k$ from $T$.

In shallow water the coefficients grow rapidly as $kh$ falls, and the fifth-order surface also develops a secondary crest in the trough. Fifth-order theory applies over a wider range than second order, but long shallow-water waves with a large Ursell number require cnoidal theory (Korteweg and de Vries, 1895).

### Stokes drift

In linear theory the particle orbits are closed. At second order, a particle under the crest is higher and moves forward faster than it moves back under the trough, where it is lower, so it advances by a net distance in each period. Averaging the second-order velocity along the particle path gives the drift velocity (Dean and Dalrymple, 1991):

$$
\bar u_s = \frac{ka^2\omega}{2}\,\frac{\cosh 2k(z+h)}{\sinh^2 kh}.
$$

In deep water $\bar u_s = (ka)^2 c\,e^{2kz}$, which decays with depth twice as fast as the orbit radius; in shallow water the drift is nearly uniform over the depth. The particle paths in the demonstration are integrated step by step through the second- or fifth-order velocity field. In a flume closed at both ends, the mass transport due to the drift is balanced by a return current.

### The depth–height plane

The third plot of the Stokes demonstration has $h/(gT^2)$ on the horizontal axis and $H/(gT^2)$ on the vertical, the plane commonly used to compare the ranges of wave theories (Le Méhauté, 1976). The grey region lies beyond the Miche breaking limit, the orange region is where the second-order solution develops a secondary crest ($a_2/a_1 > 1/4$, with $a_1 = a$ the first-order amplitude), the dashed line is $a_2/a_1 = 0.05$, and two vertical lines at $h/L = 1/20$ and $1/2$ separate shallow, intermediate and deep water.

In deep water $a_2/a_1 = ka/2$, only about 0.22 even at breaking, so no secondary crest appears; in shallow water the contours drop steeply as the depth decreases, and even small waves develop one.

### Diffraction by a cylinder

A vertical cylinder of radius $a$ stands on the bed, and the incident wave travels along $x$. In linear potential flow the surface is the incident wave plus the wave scattered by the cylinder, which cancels the normal velocity of the incident wave on the wall and travels outwards (MacCamy and Fuchs, 1954). In polar coordinates $(r, \theta)$ centred on the cylinder, with $\theta$ measured from the direction of wave travel,

$$
{\eta = \mathrm{Re}\bigl[A\,e^{-i\omega t}\bigr]}, \qquad\allowbreak {A = \frac{H}{2}\sum_{m=0}^{\infty}\epsilon_m i^m Z_m(r)\cos m\theta}, \qquad\allowbreak {Z_m(r) = J_m(kr) - \frac{J_m'(ka)}{H_m'(ka)}H_m(kr)}.
$$

$J_m$ and $Y_m$ are Bessel functions of the first and second kinds, $H_m = J_m + iY_m$ is the Hankel function of the first kind, $\epsilon_0 = 1$ and $\epsilon_m = 2$ for $m \ge 1$. The $J_m(kr)$ term is the incident wave expanded in cylindrical waves; the $H_m(kr)$ term is the outgoing scattered wave. On the wall the Wronskian of the Bessel functions reduces the complex amplitude to

$$
A(a, \theta) = \frac{H}{2}\sum_{m=0}^{\infty}\epsilon_m i^m\,\frac{2i}{\pi ka\,H_m'(ka)}\cos m\theta.
$$

For small $ka$ the cylinder barely disturbs the wave, and the amplitude all around the wall is close to the incident one. For large $ka$ the front reflects the wave like a vertical wall, the amplitude at the front point tends to twice the incident one, and the lee side is sheltered.

Integrating the pressure $p = \rho g\,\eta\cosh k(z+h)/\cosh kh$ around the wall and over the depth, only the $m = 1$ term gives a horizontal force:

$$
{F = \frac{2\rho g H\tanh kh}{k^2\,|H_1'(ka)|}\cos(\omega t + \delta)}, \qquad\allowbreak {\tan\delta = \frac{Y_1'(ka)}{J_1'(ka)}},
$$

for an incident surface $\eta = (H/2)\cos(kx - \omega t)$. For small $ka$, $|H_1'(ka)| \approx 2/[\pi (ka)^2]$ and $\delta \to 90^\circ$, and this becomes the inertia force of the Morison formula with inertia coefficient $C_M = 2$ (Morison et al., 1950):

$$
F = \rho\,C_M\,\pi a^2\,\frac{gH}{2}\tanh kh.
$$

Writing the MacCamy–Fuchs force in the same form gives an effective inertia coefficient $C_{M,\mathrm{eff}} = 4/[\pi (ka)^2\,|H_1'(ka)|]$. It equals 2 for small $ka$ and peaks at about 2.06 near $ka \approx 0.32$; once $ka$ exceeds 0.5 it drops below 2 and falls quickly, and keeping $C_M = 2$ there overestimates the inertia force. In practice diffraction is usually taken into account when $D/L > 0.2$, that is $ka > 0.63$. The open-source boundary element code Capytaine reproduces this solution to within 1.2% (see [this post](/en/updates/capytaine/)).

The MacCamy–Fuchs solution is a potential-flow solution and carries no viscous drag. The relative size of drag is measured by the Keulegan–Carpenter number $\mathrm{KC} = u_{\max}T/D$, which at the surface is $\pi H/(D\tanh kh)$; at small KC inertia dominates, and large-diameter cylinders with strong diffraction usually fall in that range.

### References

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

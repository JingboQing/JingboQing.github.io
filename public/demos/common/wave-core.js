// Water-wave toolkit shared by the demos (linear theory, plus second-order Stokes waves). SI units throughout.
// Each formula is checked against an independent Python implementation before release.

export const G = 9.81;

// Finite-depth dispersion relation ω² = g k tanh(kh), solved by Newton iteration.
export function waveNumber(omega, h) {
  const k0 = (omega * omega) / G;
  if (!(h > 0) || k0 * h > 30) return k0;
  let k = k0 / Math.sqrt(Math.tanh(k0 * h));
  for (let i = 0; i < 60; i++) {
    const t = Math.tanh(k * h);
    const f = G * k * t - omega * omega;
    const df = G * t + G * k * h * (1 - t * t);
    const dk = f / df;
    k -= dk;
    if (Math.abs(dk) < 1e-14 * k) break;
  }
  return k;
}

// c_g / c = (1 + 2kh / sinh 2kh) / 2
export const groupRatio = (kh) => (kh > 30 ? 0.5 : 0.5 * (1 + (2 * kh) / Math.sinh(2 * kh)));

// Waves on a uniform current U along +x, with the observed (absolute) frequency ω fixed:
// (ω − kU)² = g k tanh(kh), intrinsic frequency σ = ω − kU > 0.
// Returns the wavenumber of the wave travelling in +x, or null when an opposing current blocks it.
export function waveNumberCurrent(omega, h, U) {
  if (U === 0) return waveNumber(omega, h);
  const F = (k) => G * k * Math.tanh(k * h) - (omega - k * U) ** 2; // F(0) = −ω² < 0
  const bisect = (lo, hi) => {
    for (let i = 0; i < 200; i++) {
      const mid = 0.5 * (lo + hi);
      if (F(mid) < 0) lo = mid; else hi = mid;
      if (hi - lo < 1e-15 * hi) break;
    }
    return 0.5 * (lo + hi);
  };
  if (U > 0) return bisect(0, omega / U); // F(ω/U) > 0, so a root lies below ω/U
  // Opposing current: F rises, may cross zero, then falls again. Take the first crossing.
  const kMax = Math.max(G / (U * U), 10 * waveNumber(omega, h));
  const n = 4000, k0 = 1e-8 * kMax;
  let prev = k0;
  for (let i = 1; i <= n; i++) {
    const k = k0 * (kMax / k0) ** (i / n);
    if (F(k) >= 0) return bisect(prev, k);
    prev = k;
  }
  return null;
}

export function regularWave(H, T, h, U = 0) {
  const omega = (2 * Math.PI) / T;
  const k = waveNumberCurrent(omega, h, U);
  if (k === null) return { H, T, h, U, omega, blocked: true };
  const sigma = omega - k * U;
  const c = omega / k;
  return { H, T, h, U, omega, k, sigma, L: (2 * Math.PI) / k, c, cg: (groupRatio(k * h) * sigma) / k + U, kh: k * h, Tr: (2 * Math.PI) / sigma, blocked: false };
}

// Depth classes by h/L: deep ≥ 1/2, shallow ≤ 1/20.
export const depthClass = (hOverL) => (hOverL >= 0.5 ? 'deep' : hOverL <= 0.05 ? 'shallow' : 'intermediate');

// Miche breaking limit H/L = 0.142 tanh(kh).
export const breakingSteepness = (kh) => 0.142 * Math.tanh(kh);

// Semi-axes of the particle orbit at mean depth z (z ≤ 0) for amplitude a.
// Horizontal a cosh k(z+h) / sinh kh, vertical a sinh k(z+h) / sinh kh.
export function orbitAxes(a, k, h, z) {
  if (k * h > 30) {
    const e = Math.exp(k * z);
    return [a * e, a * e];
  }
  const s = Math.sinh(k * h);
  return [(a * Math.cosh(k * (z + h))) / s, (a * Math.sinh(k * (z + h))) / s];
}

// Second-order Stokes waves (Dean & Dalrymple 1991, ch. 11). The dispersion relation is unchanged at this order.
// θ = kx − ωt, z measured up from the still-water level, a = H/2.
// Second-harmonic amplitude a2 = (k a² / 4) · F(kh), F(kh) = cosh kh (2 + cosh 2kh) / sinh³ kh, F → 2 in deep water.
export const stokesFactor = (kh) => (kh > 30 ? 2 : (Math.cosh(kh) * (2 + Math.cosh(2 * kh))) / Math.sinh(kh) ** 3);

export function stokes2(H, T, h) {
  const omega = (2 * Math.PI) / T, k = waveNumber(omega, h), kh = k * h, a = H / 2;
  const deep = kh > 30, s = Math.sinh(kh);
  const a2 = (k * a * a * stokesFactor(kh)) / 4, r = a2 / a;
  // Velocity: u = aω cosh k(z+h)/sinh kh · cos θ + (3/4) k a² ω cosh 2k(z+h)/sinh⁴ kh · cos 2θ, w likewise with sinh, sin.
  const q = 0.75 * k * a * a * omega;
  const velocity = (x, z, t) => {
    const th = k * x - omega * t;
    if (deep) { const e = Math.exp(k * z); return [a * omega * e * Math.cos(th), a * omega * e * Math.sin(th)]; }
    const c1 = Math.cosh(k * (z + h)) / s, s1 = Math.sinh(k * (z + h)) / s;
    const c2 = Math.cosh(2 * k * (z + h)) / s ** 4, s2 = Math.sinh(2 * k * (z + h)) / s ** 4;
    return [a * omega * c1 * Math.cos(th) + q * c2 * Math.cos(2 * th), a * omega * s1 * Math.sin(th) + q * s2 * Math.sin(2 * th)];
  };
  // Mass-transport (Stokes drift) velocity at mean depth z: (k a² ω / 2) cosh 2k(z+h) / sinh² kh.
  const drift = (z) => (deep ? a * a * omega * k * Math.exp(2 * k * z) : (a * a * omega * k * Math.cosh(2 * k * (z + h))) / (2 * s * s));
  // η = a cos θ + a2 cos 2θ: crest at θ = 0; trough at θ = π while r ≤ 1/4, otherwise two troughs and a bump at θ = π.
  const crest = a + a2, trough = r <= 0.25 ? -a + a2 : -(a * a) / (8 * a2) - a2;
  const L = (2 * Math.PI) / k;
  return { H, T, h, omega, k, kh, L, c: omega / k, a, a2, ratio: r, crest, trough, ursell: (H * L * L) / h ** 3, velocity, drift };
}

// Fifth-order Stokes waves after Fenton (1985), J. Waterway, Port, Coastal, Ocean Eng. 111(2): 216–234, with zero
// mean Eulerian current. ε = kH/2, S = sech 2kh. The coefficients were checked against the full nonlinear
// free-surface conditions: halving ε cuts the residual exactly 64-fold, and a 0.1 % change in any coefficient breaks that.
function fentonCoefficients(kd) {
  const S = 1 / Math.cosh(2 * kd), sh = Math.sinh(kd), th = Math.tanh(kd), m = 1 - S, p = 3 + 2 * S, q = 4 + S;
  return {
    A11: 1 / sh,
    A22: (3 * S ** 2) / (2 * m ** 2),
    A31: (-4 - 20 * S + 10 * S ** 2 - 13 * S ** 3) / (8 * sh * m ** 3),
    A33: (-2 * S ** 2 + 11 * S ** 3) / (8 * sh * m ** 3),
    A42: (12 * S - 14 * S ** 2 - 264 * S ** 3 - 45 * S ** 4 - 13 * S ** 5) / (24 * m ** 5),
    A44: (10 * S ** 3 - 174 * S ** 4 + 291 * S ** 5 + 278 * S ** 6) / (48 * p * m ** 5),
    A51: (-1184 + 32 * S + 13232 * S ** 2 + 21712 * S ** 3 + 20940 * S ** 4 + 12554 * S ** 5 - 500 * S ** 6 - 3341 * S ** 7 - 670 * S ** 8) / (64 * sh * p * q * m ** 6),
    A53: (4 * S + 105 * S ** 2 + 198 * S ** 3 - 1376 * S ** 4 - 1302 * S ** 5 - 117 * S ** 6 + 58 * S ** 7) / (32 * sh * p * m ** 6),
    A55: (-6 * S ** 3 + 272 * S ** 4 - 1552 * S ** 5 + 852 * S ** 6 + 2029 * S ** 7 + 430 * S ** 8) / (64 * sh * p * q * m ** 6),
    B22: ((1 + 2 * S) / (2 * m)) / th,
    B31: (-3 * (1 + 3 * S + 3 * S ** 2 + 2 * S ** 3)) / (8 * m ** 3),
    B42: (6 - 26 * S - 182 * S ** 2 - 204 * S ** 3 - 25 * S ** 4 + 26 * S ** 5) / (6 * p * m ** 4) / th,
    B44: (24 + 92 * S + 122 * S ** 2 + 66 * S ** 3 + 67 * S ** 4 + 34 * S ** 5) / (24 * p * m ** 4) / th,
    B53: (9 * (132 + 17 * S - 2216 * S ** 2 - 5897 * S ** 3 - 6292 * S ** 4 - 2687 * S ** 5 + 194 * S ** 6 + 467 * S ** 7 + 82 * S ** 8)) / (128 * p * q * m ** 6),
    B55: (5 * (300 + 1579 * S + 3176 * S ** 2 + 2949 * S ** 3 + 1188 * S ** 4 + 675 * S ** 5 + 1326 * S ** 6 + 827 * S ** 7 + 130 * S ** 8)) / (384 * p * q * m ** 6),
    C0: Math.sqrt(th),
    C2: (Math.sqrt(th) * (2 + 7 * S ** 2)) / (4 * m ** 2),
    C4: (Math.sqrt(th) * (4 + 32 * S - 116 * S ** 2 - 400 * S ** 3 - 71 * S ** 4 + 146 * S ** 5)) / (32 * m ** 5),
  };
}
const FENTON_TERMS = [[1, 1], [2, 2], [3, 1], [3, 3], [4, 2], [4, 4], [5, 1], [5, 3], [5, 5]];

// Returns null when the fifth-order dispersion relation has no root near the linear wavenumber.
export function stokes5(H, T, h) {
  const omega = (2 * Math.PI) / T, kLin = waveNumber(omega, h);
  const KD_MAX = 30; // beyond this the wave is deep; capping kh keeps cosh(5kh) finite
  const speed = (k) => {
    const c = fentonCoefficients(Math.min(k * h, KD_MAX)), e = (k * H) / 2;
    return Math.sqrt(G / k) * (c.C0 + e * e * c.C2 + e ** 4 * c.C4);
  };
  const f = (k) => k * speed(k) - omega;
  // ω = k c(k): search outward from the linear wavenumber for the nearest sign change, then bisect.
  let lo = null, hi = null;
  for (let i = 1; i <= 400 && lo === null; i++) {
    for (const [a, b] of [[kLin * (1 - (i - 1) / 500), kLin * (1 - i / 500)], [kLin * (1 + (i - 1) / 500), kLin * (1 + i / 500)]]) {
      if (b > 0 && f(a) * f(b) <= 0) { lo = Math.min(a, b); hi = Math.max(a, b); break; }
    }
  }
  if (lo === null) return null;
  for (let i = 0; i < 100; i++) { const mid = 0.5 * (lo + hi); if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; }
  const k = 0.5 * (lo + hi), kd = Math.min(k * h, KD_MAX), he = kd / k, e = (k * H) / 2;
  const c = fentonCoefficients(kd);
  // kη = ε cos θ + ε²B22 cos 2θ + ε³B31 (cos θ − cos 3θ) + ε⁴(B42 cos 2θ + B44 cos 4θ) + ε⁵(−(B53 + B55) cos θ + B53 cos 3θ + B55 cos 5θ)
  const surface = (th) => (e * Math.cos(th) + e ** 2 * c.B22 * Math.cos(2 * th) + e ** 3 * c.B31 * (Math.cos(th) - Math.cos(3 * th))
    + e ** 4 * (c.B42 * Math.cos(2 * th) + c.B44 * Math.cos(4 * th))
    + e ** 5 * (-(c.B53 + c.B55) * Math.cos(th) + c.B53 * Math.cos(3 * th) + c.B55 * Math.cos(5 * th))) / k;
  // u = C0 √(g/k) Σ ε^i A_ij j cosh(jk(z+h)) cos jθ, w likewise with sinh, sin.
  const P = c.C0 * Math.sqrt(G / k), amps = FENTON_TERMS.map(([i, j]) => [j, P * e ** i * c[`A${i}${j}`] * j]);
  const velocity = (x, z, t) => {
    // In deep water he < h; below z = −he the motion is negligible (≈ e^−30), so clamp instead of letting cosh grow again.
    const th = k * x - omega * t, y = Math.max(0, k * (z + he));
    let u = 0, w = 0;
    for (const [j, A] of amps) { u += A * Math.cosh(j * y) * Math.cos(j * th); w += A * Math.sinh(j * y) * Math.sin(j * th); }
    return [u, w];
  };
  // Crest at θ = 0. The profile should fall steadily to the trough at θ = π; a rise on the way is a spurious bump.
  let trough = Infinity, bump = false, prev = surface(0);
  for (let i = 1; i <= 720; i++) {
    const v = surface((i / 720) * Math.PI);
    if (v > prev + 1e-9 * H) bump = true;
    trough = Math.min(trough, v); prev = v;
  }
  const L = (2 * Math.PI) / k;
  return { H, T, h, omega, k, kh: k * h, L, c: omega / k, cLinear: omega / kLin, Llinear: (2 * Math.PI) / kLin, eps: e, crest: surface(0), trough, bump, ursell: (H * L * L) / h ** 3, surface, velocity };
}

// JONSWAP spectral shape (γ = 1 gives Pierson–Moskowitz), σ = 0.07 below and 0.09 above the peak.
export function jonswapShape(f, fp, gamma) {
  if (f <= 0) return 0;
  const sigma = f <= fp ? 0.07 : 0.09;
  const r = Math.exp(-((f - fp) ** 2) / (2 * sigma * sigma * fp * fp));
  return f ** -5 * Math.exp(-1.25 * (fp / f) ** 4) * gamma ** r;
}

// One-sided spectrum S(f) in m²/Hz, scaled so that m0 = Hs² / 16.
export function jonswap(Hs, Tp, gamma) {
  const fp = 1 / Tp;
  const df = fp / 4000;
  let m0 = 0;
  for (let f = df / 2; f < 15 * fp; f += df) m0 += jonswapShape(f, fp, gamma) * df;
  const scale = (Hs * Hs) / 16 / m0;
  return (f) => scale * jonswapShape(f, fp, gamma);
}

// Spectral moment m_n = ∫ f^n S(f) df, midpoint rule.
export function moment(S, n, fMax, steps = 20000) {
  const df = fMax / steps;
  let m = 0;
  for (let i = 0; i < steps; i++) {
    const f = (i + 0.5) * df;
    m += f ** n * S(f) * df;
  }
  return m;
}

// Small seeded random generator (mulberry32) so a seed always gives the same sea.
export function random(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// In-place radix-2 FFT without normalisation. inverse = true uses e^{+i…}.
export function fft(re, im, inverse = false) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const a = i + j;
        const b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci;
        const ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr;
        im[b] = im[a] - ti;
        re[a] += tr;
        im[a] += ti;
        const next = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = next;
      }
    }
  }
}

// Random-phase linear sea at one point: η(t) = Σ a_j cos(2π f_j t + φ_j), a_j = sqrt(2 S(f_j) Δf).
// N samples with dt = Tp / perPeak; the record is periodic with length N·dt.
export function synthesizeRecord(S, Tp, seed, N = 16384, perPeak = 32) {
  const dt = Tp / perPeak;
  const df = 1 / (N * dt);
  const rand = random(seed);
  const re = new Float64Array(N);
  const im = new Float64Array(N);
  for (let j = 1; j < N / 2; j++) {
    const a = Math.sqrt(2 * S(j * df) * df);
    const phase = 2 * Math.PI * rand();
    re[j] = (a / 2) * Math.cos(phase);
    im[j] = (a / 2) * Math.sin(phase);
    re[N - j] = re[j];
    im[N - j] = -im[j];
  }
  fft(re, im, true);
  return { eta: re, dt, df };
}

// Zero up-crossing analysis: individual wave heights and periods.
export function zeroUpCrossing(eta, dt) {
  const up = [];
  for (let i = 0; i < eta.length - 1; i++) {
    if (eta[i] < 0 && eta[i + 1] >= 0) up.push(i + -eta[i] / (eta[i + 1] - eta[i]));
  }
  const H = [];
  const T = [];
  for (let w = 0; w < up.length - 1; w++) {
    let max = -Infinity;
    let min = Infinity;
    for (let i = Math.ceil(up[w]); i <= Math.floor(up[w + 1]); i++) {
      if (eta[i] > max) max = eta[i];
      if (eta[i] < min) min = eta[i];
    }
    H.push(max - min);
    T.push((up[w + 1] - up[w]) * dt);
  }
  return { H, T };
}

// Welch estimate of the one-sided spectrum: Hann window, 50 % overlap.
export function welch(eta, dt, segment = 2048) {
  const w = Float64Array.from({ length: segment }, (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / segment));
  const u = w.reduce((s, x) => s + x * x, 0);
  const S = new Float64Array(segment / 2 + 1);
  let count = 0;
  for (let start = 0; start + segment <= eta.length; start += segment / 2) {
    const re = new Float64Array(segment);
    const im = new Float64Array(segment);
    for (let i = 0; i < segment; i++) re[i] = eta[start + i] * w[i];
    fft(re, im);
    for (let k = 0; k <= segment / 2; k++) S[k] += re[k] * re[k] + im[k] * im[k];
    count++;
  }
  const f = new Float64Array(segment / 2 + 1);
  for (let k = 0; k <= segment / 2; k++) {
    const factor = k === 0 || k === segment / 2 ? 1 : 2;
    S[k] *= (factor * dt) / (u * count);
    f[k] = k / (segment * dt);
  }
  return { f, S };
}

// Mean of the highest third.
export function highestThird(H) {
  const sorted = [...H].sort((a, b) => b - a);
  const n = Math.max(1, Math.round(sorted.length / 3));
  return sorted.slice(0, n).reduce((s, x) => s + x, 0) / n;
}

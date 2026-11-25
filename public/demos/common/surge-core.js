// Linear radiation by a vertical circular cylinder that spans the full depth and moves rigidly in surge (along x).
// Time dependence e^{−iωt}. Per unit body velocity U the potential is
//   φ = cos θ [α_0 H_1(kr) cosh k(z+h) + Σ_n α_n K_1(k_n r) cos k_n(z+h)],
// with the evanescent wavenumbers ω² = −g k_n tan(k_n h). Checked against scipy before release: the damping
// agrees with the Haskind relation and the far-field energy flux, and the added mass tends to ρπa²h for long waves.
import { G, waveNumber } from './wave-core.js';
import { besselJY } from './cylinder-core.js';

// Scaled modified Bessel functions [e^x K_0(x), e^x K_1(x)] for x > 0, from
// e^x K_ν(x) = ∫_0^∞ exp(−x(cosh t − 1)) cosh(νt) dt by the trapezoidal rule. The integrand is analytic, so the
// rule converges exponentially; the step shrinks like 1/√x where the integrand narrows.
export function besselK01Scaled(x) {
  const step = Math.min(0.25, 0.7 / Math.sqrt(x)), end = Math.acosh(1 + 45 / x);
  let k0 = 0.5, k1 = 0.5; // t = 0 counted with weight 1/2
  for (let t = step; t <= end + step; t += step) {
    const e = Math.exp(-x * (Math.cosh(t) - 1));
    k0 += e; k1 += e * Math.cosh(t);
  }
  return [k0 * step, k1 * step];
}

// Evanescent wavenumbers k_1 … k_n: k_n h = nπ − y with (nπ − y) tan y = ω²h/g, y in (0, π/2).
// The left side increases with y, so Newton's method is safeguarded by bisection.
export function evanescentWavenumbers(omega, h, n) {
  const nu = (omega * omega * h) / G, out = new Float64Array(n);
  for (let m = 1; m <= n; m++) {
    const c = m * Math.PI;
    let lo = 0, hi = Math.PI / 2, y = Math.atan(nu / c);
    for (let it = 0; it < 60; it++) {
      const tn = Math.tan(y), g = (c - y) * tn - nu;
      if (g > 0) hi = y; else lo = y;
      const dg = (c - y) * (1 + tn * tn) - tn;
      let next = y - g / dg;
      if (!(next > lo && next < hi)) next = 0.5 * (lo + hi);
      if (Math.abs(next - y) < 1e-15 * (1 + y)) { y = next; break; }
      y = next;
    }
    out[m - 1] = (c - y) / h;
  }
  return out;
}

// Complex helpers on [re, im].
const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };

// Radiation by surge at frequency ω for a cylinder of radius a in depth h.
// Returns, per unit body velocity: the force fR (= iωA − B), the coefficient eR of cos θ in the waterline
// elevation, and its propagating part; plus the added mass A and damping B.
export function surgeRadiation(omega, h, a, rho = 1025, modes = 40) {
  const k = waveNumber(omega, h), ka = k * a, kh = k * h;
  const { J, Y } = besselJY(2, ka);
  const H1 = [J[1], Y[1]], H1p = [(J[0] - J[2]) / 2, (Y[0] - Y[2]) / 2];
  const ratio = div(H1, H1p);
  // q = 2kh / sinh 2kh, written so that deep water does not overflow.
  const q = kh > 300 ? 0 : (2 * kh) / Math.sinh(2 * kh);
  // Propagating mode: α_0 H_1(ka) I_0 = (2/k²) tanh(kh)/(1 + q) · H_1/H_1′ and α_0 H_1(ka) cosh kh = 2/(k(1 + q)) · H_1/H_1′.
  const sForce = (2 / (k * k)) * Math.tanh(kh) / (1 + q), sEta = 2 / (k * (1 + q));
  let S = [sForce * ratio[0], sForce * ratio[1]];
  const eProp = [sEta * ratio[0], sEta * ratio[1]];
  let eEv = 0;
  const kn = evanescentWavenumbers(omega, h, modes);
  for (const kv of kn) {
    const x = kv * a, [k0, k1] = besselK01Scaled(x), r = k1 / (-k0 - k1 / x); // K_1/K_1′, both scaled alike
    const s = Math.sin(kv * h), c = Math.cos(kv * h);
    const N = 0.5 * (h + Math.sin(2 * kv * h) / (2 * kv)), I = s / kv;
    S[0] += ((I * I) / (N * kv)) * r;
    eEv += ((I * c) / (N * kv)) * r;
  }
  // F = −iωρπa S per unit velocity; η = (iω/g) φ(a, θ, 0).
  const fR = [omega * rho * Math.PI * a * S[1], -omega * rho * Math.PI * a * S[0]];
  const io = omega / G;
  const eRprop = [-io * eProp[1], io * eProp[0]];
  const eR = [eRprop[0], eRprop[1] + io * eEv];
  return { k, ka, kh, fR, eR, eRprop, addedMass: -rho * Math.PI * a * S[0], damping: -omega * rho * Math.PI * a * S[1] };
}

export { mul as cmul, div as cdiv };

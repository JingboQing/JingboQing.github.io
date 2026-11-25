// Linear wave diffraction by a bottom-mounted vertical circular cylinder (MacCamy & Fuchs 1954), and the Bessel
// functions it needs. Waves of height H travel along +x; the cylinder of radius a stands at the origin in depth h.
// Time dependence e^{−iωt}: the surface is η = Re[A(x, y) e^{−iωt}]. Checked against scipy.special before release.
import { G, waveNumber } from './wave-core.js';

const EULER_GAMMA = 0.5772156649015329;

// J_0 … J_n and Y_0 … Y_n at x > 0. J by Miller's backward recurrence normalised with J_0 + 2ΣJ_2k = 1;
// Y_0 and Y_1 from Neumann series in the J's; higher Y by forward recurrence, which is stable for Y.
export function besselJY(n, x) {
  const top = 2 * Math.ceil((Math.max(n, x) + 30 + Math.sqrt(40 * Math.max(n, x))) / 2);
  const Jw = new Float64Array(top + 2);
  Jw[top] = 1e-300;
  let sum = 0;
  for (let m = top; m >= 1; m--) {
    Jw[m - 1] = ((2 * m) / x) * Jw[m] - Jw[m + 1];
    if (Math.abs(Jw[m - 1]) > 1e250) { for (let k = m - 1; k <= top; k++) Jw[k] *= 1e-250; sum *= 1e-250; }
    if ((m - 1) % 2 === 0 && m - 1 > 0) sum += 2 * Jw[m - 1];
  }
  sum += Jw[0];
  for (let m = 0; m <= top; m++) Jw[m] /= sum;
  const J = Jw.slice(0, n + 2);
  // Y_0 = (2/π)(ln(x/2) + γ) J_0 − (4/π) Σ_k (−1)^k J_2k / k, and Y_1 = −Y_0′ from the same series differentiated.
  const L = Math.log(x / 2) + EULER_GAMMA;
  let s0 = 0, s1 = 0;
  for (let k = 1; 2 * k + 1 <= top; k++) {
    const sign = k % 2 === 0 ? 1 : -1;
    s0 += (sign * Jw[2 * k]) / k;
    s1 += (sign * 0.5 * (Jw[2 * k - 1] - Jw[2 * k + 1])) / k;
  }
  const Y = new Float64Array(n + 2);
  Y[0] = (2 / Math.PI) * L * Jw[0] - (4 / Math.PI) * s0;
  Y[1] = -((2 / Math.PI) * (Jw[0] / x - L * Jw[1]) - (4 / Math.PI) * s1);
  for (let m = 1; m <= n; m++) Y[m + 1] = ((2 * m) / x) * Y[m] - Y[m - 1];
  return { J, Y };
}

// Derivatives from the arrays: Z_0′ = −Z_1, Z_m′ = (Z_{m−1} − Z_{m+1}) / 2.
const derivative = (Z, m) => (m === 0 ? -Z[1] : 0.5 * (Z[m - 1] - Z[m + 1]));

// i^m as [re, im].
const iPow = (m) => [[1, 0], [0, 1], [-1, 0], [0, -1]][m % 4];

// Number of angular modes for a cylinder of size ka: the scattered coefficients fall off fast beyond m ≈ ka.
export const modeCount = (ka) => Math.ceil(ka + 12 + 4 * Math.cbrt(ka));

// Everything that depends on ka only: c_m = J_m′(ka) / H_m′(ka), and H_1′(ka).
function cylinderModes(ka) {
  const M = modeCount(ka), { J, Y } = besselJY(M + 1, ka);
  const modes = [];
  for (let m = 0; m <= M; m++) {
    const jp = derivative(J, m), yp = derivative(Y, m), d = jp * jp + yp * yp;
    modes.push({ m, jp, yp, c: [(jp * jp) / d, (-jp * yp) / d] }); // J′/(J′ + iY′)
  }
  return modes;
}

// Run-up as a cosine series, η(a, θ)/(H/2) = Σ_m r_m cos mθ with r_m = ε_m i^m · 2i / (π ka H_m′(ka)), as [re, im].
export function runupCoefficients(ka) {
  return cylinderModes(ka).map(({ m, jp, yp }) => {
    const eps = m === 0 ? 1 : 2, [pr, pi] = iPow(m), f = 2 / (Math.PI * ka * (jp * jp + yp * yp));
    return [eps * f * (pr * yp - pi * jp), eps * f * (pr * jp + pi * yp)];
  });
}

// Effective inertia coefficient of the MacCamy–Fuchs force, C_M,eff = 4 / (π (ka)² |H_1′(ka)|); → 2 as ka → 0.
export function effectiveInertia(ka) {
  const { J, Y } = besselJY(3, ka), jp = derivative(J, 1), yp = derivative(Y, 1);
  return 4 / (Math.PI * ka * ka * Math.hypot(jp, yp));
}

// Full solution for given wave height, period, depth and cylinder diameter.
export function macCamyFuchs(H, T, h, D, rho = 1025) {
  const omega = (2 * Math.PI) / T, k = waveNumber(omega, h), a = D / 2, ka = k * a, kh = k * h;
  const modes = cylinderModes(ka);
  // Complex surface amplitude A(x, y)/(H/2) outside the cylinder: incident wave minus the scattered sum.
  // A/(H/2) = e^{ikx} − Σ ε_m i^m c_m H_m(kr) cos mθ.
  const amplitude = (x, y) => {
    const r = Math.hypot(x, y);
    if (r < a) return null;
    const th = Math.atan2(y, x), kr = k * r, M = modes.length - 1, { J, Y } = besselJY(M, kr);
    let re = Math.cos(k * x), im = Math.sin(k * x);
    for (const { m, c } of modes) {
      const eps = m === 0 ? 1 : 2, [pr, pi] = iPow(m), cm = Math.cos(m * th);
      // ε_m i^m c_m (J_m + iY_m) cos mθ
      const ar = pr * c[0] - pi * c[1], ai = pr * c[1] + pi * c[0];
      re -= eps * cm * (ar * J[m] - ai * Y[m]);
      im -= eps * cm * (ar * Y[m] + ai * J[m]);
    }
    return [re, im];
  };
  // Run-up on the cylinder, by the Wronskian: η(a, θ)/(H/2) = Σ ε_m i^m · 2i / (π ka H_m′(ka)) · cos mθ.
  const runup = (th) => {
    let re = 0, im = 0;
    for (const { m, jp, yp } of modes) {
      const eps = m === 0 ? 1 : 2, [pr, pi] = iPow(m), d = jp * jp + yp * yp, cm = Math.cos(m * th);
      // 2i/(π ka) · (J′ − iY′)/d = (2/(π ka d)) · (Y′ + iJ′)
      const qr = (2 / (Math.PI * ka * d)) * yp, qi = (2 / (Math.PI * ka * d)) * jp;
      re += eps * cm * (pr * qr - pi * qi);
      im += eps * cm * (pr * qi + pi * qr);
    }
    return [re, im];
  };
  // Horizontal force F = 2ρgH tanh(kh) / (k² H_1′(ka)), complex amplitude with e^{−iωt}.
  const m1 = modes[1], d1 = m1.jp * m1.jp + m1.yp * m1.yp, F0 = (2 * rho * G * H * Math.tanh(kh)) / (k * k);
  const force = [(F0 * m1.jp) / d1, (-F0 * m1.yp) / d1];
  // Morison inertia force with C_M = 2 (no drag): F = ρ C_M π a² (gH/2) tanh(kh), in phase with the acceleration at x = 0.
  const morison = rho * 2 * Math.PI * a * a * ((G * H) / 2) * Math.tanh(kh);
  const L = (2 * Math.PI) / k;
  return { H, T, h, D, a, k, ka, kh, L, omega, rho, amplitude, runup, force, forceAmplitude: Math.hypot(force[0], force[1]),
    morison, cmEff: effectiveInertia(ka), keuleganCarpenter: (Math.PI * H) / (D * Math.tanh(kh)) };
}

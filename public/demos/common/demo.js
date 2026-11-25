// Shared page behaviour for the wave demos: language, embedding in a post, sliders, playback and SVG drawing.

// Applies the zh/en texts, the back link and, inside a post, the embedded layout plus height reporting.
export function setupPage(texts, postSlug) {
  const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
  const t = texts[lang];
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  document.title = `${t.title} · ${lang === 'en' ? 'Jingbo Qing' : '卿景博'}`;
  document.querySelectorAll('[data-i18n]').forEach((node) => richText(node, t[node.dataset.i18n]));
  document.querySelectorAll('[data-i18n-label]').forEach((node) => node.setAttribute('aria-label', t[node.dataset.i18nLabel]));
  document.querySelectorAll('[data-language]').forEach((link) => {
    if (link.dataset.language === lang) link.setAttribute('aria-current', 'page');
  });
  renderMath();
  const back = document.querySelector('[data-back]');
  if (back) back.setAttribute('href', `../../${lang}/updates/${postSlug}/`);
  if (window.self !== window.top) {
    document.documentElement.classList.add('embedded');
    const main = document.querySelector('main');
    const report = () => parent.postMessage({ type: 'demo-height', height: Math.ceil(main.getBoundingClientRect().height) }, location.origin);
    new ResizeObserver(report).observe(main);
    window.addEventListener('load', report);
  }
  return { lang, t };
}

// Text with inline math: segments written as $...$ are typeset with KaTeX, the rest is plain text.
const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export function richText(el, s) {
  if (typeof s !== 'string' || !s.includes('$') || !window.katex) { el.textContent = s ?? ''; return; }
  el.innerHTML = s.split(/(\$[^$]+\$)/).map((part) => (/^\$[^$]+\$$/.test(part)
    ? window.katex.renderToString(part.slice(1, -1), { throwOnError: false })
    : escapeHtml(part))).join('');
}

// Typesets every element with a data-tex attribute (KaTeX is loaded from ./katex by each page).
export function renderMath(root = document) {
  if (!window.katex) return;
  root.querySelectorAll('[data-tex]').forEach((el) => {
    window.katex.render(el.dataset.tex, el, { throwOnError: false, displayMode: false });
  });
}

// Slider with a linear or logarithmic scale; shows the formatted value next to the label.
export function slider(id, { min, max, log = false, format, onInput }) {
  const input = document.getElementById(id);
  const output = document.getElementById(`${id}-output`);
  const toValue = (v) => (log ? min * (max / min) ** (v / 1000) : Number(v));
  const toPosition = (x) => (log ? Math.round((1000 * Math.log(x / min)) / Math.log(max / min)) : x);
  if (log) Object.assign(input, { min: 0, max: 1000, step: 1 });
  const show = () => {
    const text = format(get());
    output.textContent = text;
    input.setAttribute('aria-valuetext', text);
  };
  // A value set by code (a preset) is kept exactly until the user moves the slider.
  let exact = null;
  const get = () => exact ?? toValue(input.value);
  const set = (x) => { exact = x; input.value = String(toPosition(x)); show(); };
  input.addEventListener('input', () => { exact = null; show(); onInput(); });
  return { get, set, show };
}

// requestAnimationFrame loop that pauses when hidden and honours reduced motion.
export function playback(button, t, onFrame) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !reduce.matches;
  let previous = null;
  let frame = 0;
  let time = 0;
  const tick = (now) => {
    frame = 0;
    if (!playing || document.hidden) { previous = null; return; }
    if (previous !== null) time += Math.min((now - previous) / 1000, 0.1);
    previous = now;
    onFrame(time);
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    button.textContent = playing ? t.pause : t.play;
    button.setAttribute('aria-pressed', String(playing));
    previous = null;
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    if (playing && !document.hidden) frame = requestAnimationFrame(tick);
  };
  button.addEventListener('click', () => { playing = !playing; sync(); });
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', (event) => { if (event.matches) { playing = false; sync(); } });
  sync();
  return { get time() { return time; }, reset() { time = 0; onFrame(0); } };
}

// SVG helpers. The drawing uses the element's real width, so text stays readable on phones.
const NS = 'http://www.w3.org/2000/svg';
export function node(tag, attrs = {}, parent) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (parent) parent.appendChild(el);
  return el;
}
export function text(parent, x, y, content, attrs = {}) {
  const el = node('text', { x, y, ...attrs }, parent);
  el.textContent = content;
  return el;
}
export function responsive(svg, height, draw) {
  let width = 0;
  const redraw = () => {
    const w = Math.max(260, Math.round(svg.getBoundingClientRect().width));
    if (w === width) return;
    width = w;
    svg.setAttribute('viewBox', `0 0 ${w} ${height}`);
    svg.setAttribute('height', String(height));
    draw(w);
  };
  new ResizeObserver(redraw).observe(svg);
  redraw();
  return { get width() { return width; }, redraw: () => { width = 0; redraw(); } };
}
// SVG text with simple inline math, e.g. '$\\eta$ (m)', '$H/H_{m0}$' or '$h/(gT^2)$'. Variables use the KaTeX math
// italic; digits, operators and names such as max stay upright; _x, _{..} become subscripts and ^x, ^{..} superscripts.
const SYMBOLS = { '\\eta': 'η', '\\omega': 'ω', '\\gamma': 'γ', '\\sigma': 'σ', '\\varphi': 'φ', '\\lambda': 'λ', '\\beta': 'β', '\\theta': 'θ', '\\varepsilon': 'ε' };
export function mathText(parent, x, y, s, attrs = {}) {
  const el = node('text', { x, y, ...attrs }, parent);
  let shift = 0; // baseline offset still to undo after a sub- or superscript
  // level: 0 normal, 1 subscript, −1 superscript
  const span = (content, { italic = false, level = 0, math = true } = {}) => {
    const a = {};
    if (math) Object.assign(a, { 'font-family': italic ? 'KaTeX_Math' : 'KaTeX_Main', 'font-style': italic ? 'italic' : 'normal' });
    const offset = level > 0 ? 3 : level < 0 ? -5 : 0;
    const dy = offset - shift;
    if (dy) a.dy = dy;
    shift = offset;
    if (level) a['font-size'] = '0.78em';
    node('tspan', a, el).textContent = content;
  };
  // Index of the brace that closes the one at `open`, allowing nested groups.
  const closing = (tex, open) => {
    for (let i = open, depth = 0; i < tex.length; i++) {
      if (tex[i] === '{') depth++;
      else if (tex[i] === '}' && --depth === 0) return i;
    }
    return tex.length;
  };
  const emitMath = (tex, level = 0) => {
    for (let i = 0; i < tex.length;) {
      if (tex[i] === '\\') {
        const name = tex.slice(i).match(/^\\[a-zA-Z]+/)[0];
        if (name === '\\mathrm' && tex[i + name.length] === '{') { // upright text, e.g. C_{M,\mathrm{eff}}
          const end = closing(tex, i + name.length);
          span(tex.slice(i + name.length + 1, end), { level });
          i = end + 1;
          continue;
        }
        if (SYMBOLS[name]) span(SYMBOLS[name], { italic: true, level }); else span(name.slice(1), { level });
        i += name.length;
      } else if (tex[i] === '_' || tex[i] === '^') {
        const braced = tex[i + 1] === '{';
        const end = braced ? closing(tex, i + 1) : i + 1;
        emitMath(braced ? tex.slice(i + 2, end) : tex[i + 1], tex[i] === '_' ? 1 : -1);
        i = end + 1;
      } else {
        let j = i;
        const letter = /[A-Za-z]/.test(tex[i]);
        while (j < tex.length && !'\\_^'.includes(tex[j]) && /[A-Za-z]/.test(tex[j]) === letter) j++;
        span(tex.slice(i, j), { italic: letter, level });
        i = j;
      }
    }
  };
  s.split(/(\$[^$]+\$)/).forEach((part) => {
    if (!part) return;
    if (/^\$[^$]+\$$/.test(part)) emitMath(part.slice(1, -1));
    else span(part, { math: false });
  });
  return el;
}

export const path = (xs, ys) => xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join('');

// Axis label: up to three significant digits, no trailing zeros.
export const label = (v) => String(+(+v).toPrecision(3)).replace('-', '−');

// Number formatting with a sensible number of significant digits.
export function fmt(x, digits = 3) {
  if (!Number.isFinite(x)) return '—';
  if (x === 0) return '0';
  const p = Math.max(0, digits - 1 - Math.floor(Math.log10(Math.abs(x))));
  return x.toFixed(Math.min(p, 6));
}
// Axis extent in round steps for a quantity of size L (a wavelength, a period, a wave height, a spectral peak).
// It stays put while it lies between min·L and max·L, so a parameter change shows in the picture rather than
// in the axis numbers; only outside that band does it move to the first round value above target·L.
// Round values are mantissas × 10ⁿ (default 1, 2, 5); `steps` instead gives a fixed list (smallest first),
// whose last entry is used when nothing is long enough.
export const FINE_STEPS = [1, 1.5, 2, 3, 5, 7.5];
export function steadySpan(previous, L, { target = 2.5, min = 1.3, max = 6.5, steps, mantissas = [1, 2, 5] } = {}) {
  if (previous && previous >= min * L && previous <= max * L) return previous;
  const want = target * L;
  if (steps) return steps.find((v) => v >= want - 1e-9) ?? steps[steps.length - 1];
  const mag = 10 ** Math.floor(Math.log10(want));
  return [...mantissas, 10].map((m) => m * mag).find((v) => v >= want * (1 - 1e-9));
}

// Round axis ticks. When the axis end is itself round, a step that lands exactly on it is preferred.
export function ticks(max, count = 4) {
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const candidates = [1, 2, 2.5, 5, 10, 20].map((m) => m * mag).filter((s) => s >= raw * (1 - 1e-9));
  const fits = (s) => Math.abs(max / s - Math.round(max / s)) < 1e-6;
  const step = candidates.find((s) => s <= 2.5 * raw && fits(s)) ?? candidates[0];
  const out = [];
  for (let v = 0; v <= max + 1e-9; v += step) out.push(+v.toFixed(10));
  return { values: out, step };
}

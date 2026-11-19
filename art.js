/* ============================================================
   THE SACRED SHROUD — procedural pulp-print scene art
   ============================================================ */
const ART = (() => {
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    const r = hex.length === 4 ? ((n >> 8) & 15) * 17 : (n >> 16) & 255, g = hex.length === 4 ? ((n >> 4) & 15) * 17 : (n >> 8) & 255, b = hex.length === 4 ? (n & 15) * 17 : n & 255;
    return `rgba(${r},${g},${b},${a})`;
  }
  function mix(h1, h2, t) {
    const p = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const a = p(h1), b = p(h2);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }

  /* ---------- primitives ---------- */
  function sky(c, w, h, top, bot, horiz) {
    const g = c.createLinearGradient(0, 0, horiz ? w : 0, horiz ? 0 : h);
    g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  function stars(c, w, h, r, n, col, maxY) {
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * h * (maxY || 1), s = r() < 0.08 ? 1.8 : r() * 1.1 + 0.3;
      c.fillStyle = hexA(col || '#ffffff', 0.35 + r() * 0.65);
      c.beginPath(); c.arc(x, y, s, 0, 7); c.fill();
      if (s > 1.6) { c.strokeStyle = hexA(col || '#ffffff', 0.4); c.lineWidth = 0.6; c.beginPath(); c.moveTo(x - 5, y); c.lineTo(x + 5, y); c.moveTo(x, y - 5); c.lineTo(x, y + 5); c.stroke(); }
    }
  }
  function glow(c, x, y, rad, col, a) {
    const g = c.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, hexA(col, a == null ? 0.7 : a)); g.addColorStop(1, hexA(col, 0));
    c.fillStyle = g; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
  }
  function planet(c, x, y, rad, col, ring, r) {
    glow(c, x, y, rad * 1.6, col, 0.25);
    const g = c.createRadialGradient(x - rad * 0.4, y - rad * 0.4, rad * 0.1, x, y, rad);
    g.addColorStop(0, mix(col, '#ffffff', 0.35)); g.addColorStop(0.7, col); g.addColorStop(1, mix(col, '#000000', 0.6));
    c.save(); c.beginPath(); c.arc(x, y, rad, 0, 7); c.fillStyle = g; c.fill(); c.clip();
    c.globalAlpha = 0.25;
    for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? mix(col, '#000', 0.3) : mix(col, '#fff', 0.2); c.fillRect(x - rad, y - rad + (i + r()) * rad / 3, rad * 2, rad * 0.12 + r() * rad * 0.1); }
    c.restore(); c.globalAlpha = 1;
    if (ring) {
      c.save(); c.translate(x, y); c.rotate(-0.35);
      c.strokeStyle = hexA(mix(col, '#fff', 0.4), 0.8); c.lineWidth = rad * 0.08;
      c.beginPath(); c.ellipse(0, 0, rad * 1.9, rad * 0.45, 0, Math.PI * 0.05, Math.PI * 0.95, true); c.stroke();
      c.strokeStyle = hexA(mix(col, '#fff', 0.2), 0.5); c.lineWidth = rad * 0.04;
      c.beginPath(); c.ellipse(0, 0, rad * 2.2, rad * 0.55, 0, Math.PI * 0.05, Math.PI * 0.95, true); c.stroke();
      c.restore();
    }
  }
  function ridge(c, w, h, base, amp, col, r, jag, freq) {
    c.fillStyle = col; c.beginPath(); c.moveTo(0, h);
    const step = jag ? 14 : 6, ph = r() * 10, f = freq || 1;
    for (let x = 0; x <= w + step; x += step) {
      let y = base + Math.sin(x / w * 6.28 * f + ph) * amp * 0.5 + Math.sin(x / w * 17 * f + ph * 2) * amp * 0.25;
      if (jag) y += (r() - 0.5) * amp * 0.8;
      c.lineTo(x, y);
    }
    c.lineTo(w, h); c.closePath(); c.fill();
  }
  function dunes(c, w, h, base, amp, col, r) {
    c.fillStyle = col; c.beginPath(); c.moveTo(0, h);
    const ph = r() * 6;
    for (let x = 0; x <= w; x += 4) c.lineTo(x, base + Math.sin(x / w * 5 + ph) * amp + Math.sin(x / w * 13 + ph) * amp * 0.25);
    c.lineTo(w, h); c.fill();
  }
  function poly(c, pts, col) { c.fillStyle = col; c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.closePath(); c.fill(); }
  function rock(c, x, y, s, col, r, lit) {
    const n = 7 + (r() * 4 | 0), pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * 6.28, d = s * (0.65 + r() * 0.45); pts.push(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8); }
    poly(c, pts, col);
    if (lit) { c.strokeStyle = hexA(lit, 0.6); c.lineWidth = 1.2; c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length / 2; i += 2) c.lineTo(pts[i], pts[i + 1]); c.stroke(); }
  }
  function rocket(c, x, y, s, col, ang, flame) {
    c.save(); c.translate(x, y); c.rotate(ang || 0); c.scale(s, s);
    if (flame) { glow(c, 0, 34, 22, flame, 0.8); poly(c, [-5, 22, 5, 22, 0, 48], flame); }
    c.fillStyle = col;
    c.beginPath(); c.moveTo(0, -30); c.bezierCurveTo(12, -16, 10, 10, 7, 22); c.lineTo(-7, 22); c.bezierCurveTo(-10, 10, -12, -16, 0, -30); c.fill();
    poly(c, [-7, 8, -16, 26, -7, 20], col); poly(c, [7, 8, 16, 26, 7, 20], col);
    c.fillStyle = hexA('#ffffff', 0.5); c.beginPath(); c.arc(0, -8, 3.4, 0, 7); c.fill();
    c.restore();
  }
  function frigate(c, x, y, s, col, lights) {
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col;
    c.beginPath(); c.moveTo(-60, 0); c.lineTo(-40, -12); c.lineTo(30, -14); c.lineTo(62, -4); c.lineTo(62, 4); c.lineTo(30, 10); c.lineTo(-40, 10); c.closePath(); c.fill();
    poly(c, [-30, -12, -10, -26, 10, -26, 0, -12], col); poly(c, [-40, 8, -52, 22, -24, 10], col);
    if (lights) { for (let i = 0; i < 6; i++) { c.fillStyle = hexA(lights, 0.9); c.fillRect(-30 + i * 10, -4, 3, 2); } glow(c, -62, 0, 14, lights, 0.6); }
    c.restore();
  }
  function halftone(c, w, h, col, fromY, strength) {
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = col;
    const gap = 5;
    for (let y = fromY; y < h; y += gap) {
      const t = (y - fromY) / (h - fromY); const rad = Math.max(0, t * gap * 0.55 * strength);
      if (rad < 0.25) continue;
      for (let x = (y / gap % 2) * gap / 2; x < w; x += gap) { c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill(); }
    }
    c.restore();
  }
  function finish(c, w, h, pal) {
    // pulp print: halftone dots in shadow, vignette, scanlines, grain
    halftone(c, w, h, hexA('#000000', 0.55), h * 0.55, 1);
    const v = c.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.6)');
    c.fillStyle = v; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(0,0,0,0.08)'; for (let y = 0; y < h; y += 3) c.fillRect(0, y, w, 1);
    c.save(); c.globalCompositeOperation = 'overlay'; c.fillStyle = hexA(pal[5], 0.06); c.fillRect(0, 0, w, h); c.restore();
  }

  /* ---------- terrain modules ---------- */
  const T = {
    jungle(c, w, h, p, r, a) {
      for (let i = 0; i < (a.moons || 1); i++) planet(c, w * (0.7 + i * 0.15), h * (0.18 + i * 0.1), h * (0.08 - i * 0.03), mix(p[5], '#ffffff', 0.4), false, r);
      glow(c, w * 0.3, h * 0.55, w * 0.5, p[5], 0.25);
      [[p[2], 0.45, 26], [p[3], 0.6, 18], [p[4], 0.78, 12]].forEach(([col, base, n], li) => {
        for (let i = 0; i < n; i++) {
          const x = r() * w, top = h * (base - 0.25 - r() * 0.2), tw = 3 + li * 3 + r() * 4;
          c.fillStyle = col; c.fillRect(x, top, tw, h - top);
          for (let f = 0; f < 6; f++) { c.beginPath(); c.ellipse(x + (r() - 0.5) * 60, top + (r() - 0.3) * 20, 22 + r() * 30 + li * 8, 8 + r() * 10, (r() - 0.5) * 1.2, 0, 7); c.fill(); }
        }
        ridge(c, w, h, h * base + 20, 16, col, r);
      });
      c.fillStyle = hexA(p[5], 0.35); for (let i = 0; i < 40; i++) c.fillRect(r() * w, h * 0.86 + r() * h * 0.1, 10 + r() * 30, 1);
      c.strokeStyle = hexA(p[4], 0.9); c.lineWidth = 2;
      for (let i = 0; i < 9; i++) { const x = r() * w; c.beginPath(); c.moveTo(x, 0); c.quadraticCurveTo(x + 10, h * 0.2, x - 5, h * (0.2 + r() * 0.25)); c.stroke(); }
    },
    outpost(c, w, h, p, r, a) {
      T.jungle(c, w, h, p, r, a);
      c.fillStyle = p[4]; c.beginPath(); c.ellipse(w * 0.55, h * 0.84, w * 0.2, h * 0.05, 0, 0, 7); c.fill();
      c.strokeStyle = hexA(p[5], 0.6); c.lineWidth = 1.5; c.stroke();
      for (let i = 0; i < 5; i++) {
        const x = w * (0.08 + i * 0.2) + r() * 20, y = h * (0.62 + r() * 0.1), s = 18 + r() * 12;
        c.fillStyle = p[4]; c.fillRect(x, y, s * 1.4, s); poly(c, [x - 5, y, x + s * 0.7, y - s * 0.8, x + s * 1.4 + 5, y], p[4]);
        c.fillRect(x + 3, y + s, 3, h - y); c.fillRect(x + s * 1.4 - 6, y + s, 3, h - y);
        c.fillStyle = p[5]; c.fillRect(x + s * 0.5, y + s * 0.35, 6, 6); glow(c, x + s * 0.5 + 3, y + s * 0.35 + 3, 18, p[5], 0.5);
      }
      frigate(c, w * 0.55, h * 0.78, 0.9, '#0c1a14', p[5]);
    },
    ruins(c, w, h, p, r) {
      planet(c, w * 0.8, h * 0.2, h * 0.1, mix(p[5], '#fff', 0.3), false, r);
      ridge(c, w, h, h * 0.6, 30, p[2], r);
      const cx = w * 0.5, base = h * 0.75; c.fillStyle = p[3];
      c.fillRect(cx - 110, base - 70, 220, 90); poly(c, [cx - 40, base - 70, cx, base - 170, cx + 40, base - 70], p[3]);
      c.fillRect(cx - 30, base - 140, 60, 80); poly(c, [cx - 130, base - 70, cx - 95, base - 120, cx - 60, base - 70], p[3]); poly(c, [cx + 60, base - 70, cx + 95, base - 120, cx + 130, base - 70], p[3]);
      for (let i = 0; i < 7; i++) { const x = cx - 90 + i * 28; c.fillStyle = p[5]; c.beginPath(); c.moveTo(x, base - 20); c.lineTo(x, base - 45); c.quadraticCurveTo(x + 6, base - 58, x + 12, base - 45); c.lineTo(x + 12, base - 20); c.fill(); glow(c, x + 6, base - 35, 22, p[5], 0.35); }
      c.fillStyle = p[5]; c.beginPath(); c.arc(cx, base - 110, 12, 0, 7); c.fill(); glow(c, cx, base - 110, 50, p[5], 0.5);
      ridge(c, w, h, h * 0.84, 14, p[4], r);
      c.strokeStyle = hexA('#2a4a2a', 0.9); c.lineWidth = 2;
      for (let i = 0; i < 14; i++) { const x = cx - 120 + r() * 240; c.beginPath(); c.moveTo(x, base - 80 - r() * 60); c.quadraticCurveTo(x + 8, base - 30, x - 4, base + 10); c.stroke(); }
    },
    desert(c, w, h, p, r, a) {
      glow(c, w * 0.18, h * 0.3, h * 0.5, p[5], 0.55);
      planet(c, w * 0.72, h * 0.32, h * 0.26, mix(p[1], p[5], 0.4), a.ring !== false, r);
      dunes(c, w, h, h * 0.62, 10, p[2], r);
      for (let i = 0; i < 6; i++) {
        const x = r() * w, s = 40 + r() * 70, y = h * 0.7;
        const pts = [x - s, y]; for (let k = 0; k <= 8; k++) pts.push(x - s + k * s / 4, y - s * (0.3 + r() * 0.6) * Math.sin(k / 8 * Math.PI)); pts.push(x + s, y);
        poly(c, pts, p[3]);
        c.fillStyle = p[3]; for (let k = 0; k < 3; k++) { c.save(); c.translate(x + (r() - 0.5) * s, y - s * 0.4 * r()); c.rotate((r() - 0.5) * 1.4); c.fillRect(-2, -s * 0.4, 4 + r() * 6, s * 0.4); c.restore(); }
        c.strokeStyle = p[3]; c.lineWidth = 3; c.beginPath(); c.arc(x + s * 0.3, y - s * 0.25, s * 0.12, 0, 7); c.stroke();
      }
      dunes(c, w, h, h * 0.8, 12, p[4], r);
      c.save(); c.translate(w * 0.2, h * 0.86); c.rotate(-0.15); frigate(c, 0, 0, 1.1, mix(p[4], '#000', 0.4), null); c.restore();
    },
    junktown(c, w, h, p, r, a) {
      T.desert(c, w, h, p, r, a);
      for (let i = 0; i < 12; i++) {
        const x = i * w / 12 + r() * 10, bh = 20 + r() * 50, bw = 24 + r() * 26, y = h * 0.8 - bh;
        c.fillStyle = mix(p[4], '#000', 0.2); c.fillRect(x, y, bw, bh + 40);
        if (r() < 0.6) { c.fillStyle = p[5]; c.fillRect(x + 5, y + 8, 5, 4); glow(c, x + 7, y + 10, 14, p[5], 0.4); }
        if (r() < 0.4) { c.strokeStyle = mix(p[4], '#000', 0.2); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + bw / 2, y); c.lineTo(x + bw / 2, y - 26); c.stroke(); poly(c, [x + bw / 2, y - 26, x + bw / 2 + 14, y - 22, x + bw / 2, y - 18], '#e3b23c'); }
      }
    },
    cavern(c, w, h, p, r) {
      glow(c, w * 0.5, h * 0.55, w * 0.45, p[5], 0.25);
      for (let i = 0; i < 18; i++) { const x = r() * w, len = 30 + r() * h * 0.35; poly(c, [x - 10 - r() * 16, 0, x, len, x + 10 + r() * 16, 0], p[3]); }
      ridge(c, w, h, h * 0.75, 30, p[3], r, true);
      for (let i = 0; i < 14; i++) {
        const x = r() * w, y = h * (0.6 + r() * 0.3), s = 8 + r() * 22;
        glow(c, x, y - s / 2, s * 3, p[5], 0.35);
        poly(c, [x - s * 0.3, y, x - s * 0.1, y - s * 1.4, x + s * 0.2, y - s * 0.6, x + s * 0.35, y], mix(p[5], '#ffffff', 0.25));
      }
      ridge(c, w, h, h * 0.9, 16, p[4], r, true);
    },
    plains(c, w, h, p, r) {
      glow(c, w * 0.25, h * 0.45, w * 0.4, p[5], 0.4);
      planet(c, w * 0.8, h * 0.2, h * 0.07, mix(p[5], '#fff', 0.5), false, r);
      ridge(c, w, h, h * 0.5, 50, p[2], r, true);
      ridge(c, w, h, h * 0.64, 28, p[3], r);
      ridge(c, w, h, h * 0.8, 20, p[4], r);
      c.strokeStyle = hexA(mix(p[3], p[5], 0.3), 0.8); c.lineWidth = 1;
      for (let i = 0; i < 220; i++) { const x = r() * w, y = h * (0.82 + r() * 0.18); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 3, y - 8, x + 6 + r() * 4, y - 14 - r() * 8); c.stroke(); }
    },
    spaceport(c, w, h, p, r, a) {
      T.plains(c, w, h, p, r, a);
      for (let i = 0; i < 7; i++) {
        const x = w * 0.1 + i * w * 0.13, th = 60 + r() * 90, y = h * 0.8 - th;
        c.fillStyle = mix(p[4], '#000', 0.2); c.fillRect(x, y, 10 + r() * 10, th + 30);
        c.fillRect(x - 10, y + 10, 34, 5);
        c.fillStyle = r() < 0.5 ? p[5] : '#ff5a4a'; c.beginPath(); c.arc(x + 5, y - 3, 2.5, 0, 7); c.fill(); glow(c, x + 5, y - 3, 12, p[5], 0.6);
      }
      c.strokeStyle = hexA('#ffffff', 0.35); c.lineWidth = 2; c.beginPath(); c.moveTo(w * 0.62, h * 0.75); c.quadraticCurveTo(w * 0.66, h * 0.4, w * 0.75, h * 0.15); c.stroke();
      rocket(c, w * 0.75, h * 0.14, 0.7, '#1a1530', 0.5, p[5]);
    },
    docks(c, w, h, p, r) {
      glow(c, w * 0.5, h * 0.3, w * 0.5, p[5], 0.15);
      for (let i = 0; i < 4; i++) {
        const x = w * (0.1 + i * 0.27), top = h * 0.12 + r() * 30;
        c.strokeStyle = p[3]; c.lineWidth = 4; c.beginPath(); c.moveTo(x, h); c.lineTo(x, top); c.lineTo(x + 90, top); c.stroke();
        c.lineWidth = 1; c.beginPath(); c.moveTo(x + 70, top); c.lineTo(x + 70, top + 50 + r() * 40); c.stroke();
        c.fillStyle = hexA(p[5], 0.12); c.beginPath(); c.moveTo(x + 2, top + 4); c.lineTo(x - 40, h); c.lineTo(x + 40, h); c.fill();
      }
      const cols = ['#7a3a3a', '#3a5a7a', '#7a6a3a', '#3a6a4a', '#5a3a6a'];
      for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) {
        if (r() < 0.25) continue;
        const bw = w / 9, x = i * bw + r() * 4, y = h * 0.92 - (row + 1) * 26;
        c.fillStyle = mix(cols[(r() * 5) | 0], '#000', 0.45 + row * 0.08); c.fillRect(x, y, bw - 4, 24);
        c.fillStyle = 'rgba(0,0,0,0.25)'; for (let k = 4; k < bw - 6; k += 6) c.fillRect(x + k, y + 2, 2, 20);
      }
      c.fillStyle = p[4]; c.fillRect(0, h * 0.92, w, h * 0.08);
    },
    city(c, w, h, p, r) {
      glow(c, w * 0.5, h * 0.72, w * 0.55, p[5], 0.5);
      ridge(c, w, h, h * 0.6, 30, p[2], r);
      c.fillStyle = p[3]; c.fillRect(w * 0.15, h * 0.58, w * 0.7, h * 0.2);
      for (let i = 0; i < 6; i++) { const x = w * (0.15 + i * 0.13); c.fillRect(x, h * 0.48, 22, h * 0.2); for (let k = 0; k < 3; k++) c.fillRect(x + k * 8, h * 0.46, 5, 6); }
      for (let i = 0; i < 4; i++) {
        const x = w * (0.25 + r() * 0.5), y = h * 0.55;
        for (let k = 0; k < 9; k++) { c.fillStyle = hexA('#2a2026', 0.35 - k * 0.03); c.beginPath(); c.arc(x + k * 6 + r() * 6, y - k * 16, 10 + k * 4, 0, 7); c.fill(); }
        glow(c, x, y, 30, '#ff8a3a', 0.7);
      }
      ridge(c, w, h, h * 0.82, 16, p[4], r);
    },
    fortress(c, w, h, p, r) {
      planet(c, w * 0.2, h * 0.18, h * 0.06, '#e8e0ff', false, r);
      const cx = w * 0.55;
      glow(c, cx, h * 0.4, w * 0.45, p[5], 0.3); glow(c, w * 0.2, h * 0.9, w * 0.5, mix(p[1], '#ffffff', 0.2), 0.35);
      poly(c, [cx - 200, h, cx - 120, h * 0.55, cx - 60, h * 0.5, cx - 20, h * 0.38, cx + 40, h * 0.42, cx + 110, h * 0.58, cx + 220, h], p[3]);
      c.fillStyle = p[3]; c.fillRect(cx - 60, h * 0.25, 100, h * 0.2);
      for (let i = 0; i < 5; i++) c.fillRect(cx - 60 + i * 22, h * 0.21, 12, 10);
      c.fillRect(cx - 20, h * 0.1, 26, h * 0.2); poly(c, [cx - 26, h * 0.1, cx - 7, h * 0.02, cx + 12, h * 0.1], p[3]);
      poly(c, [cx - 7, h * 0.02, cx - 7, h * -0.02, cx + 14, h * 0.0], p[5]);
      for (let i = 0; i < 3; i++) { c.fillStyle = hexA(p[5], 0.12); c.beginPath(); const sx = cx - 40 + i * 40; c.moveTo(sx, h * 0.3); const ang = -1.2 + r() * 1.4; c.lineTo(sx + Math.cos(ang - 0.08) * w, h * 0.3 + Math.sin(ang - 0.08) * w); c.lineTo(sx + Math.cos(ang + 0.08) * w, h * 0.3 + Math.sin(ang + 0.08) * w); c.fill(); }
      for (let i = 0; i < 10; i++) { c.fillStyle = p[5]; c.fillRect(cx - 50 + r() * 80, h * (0.28 + r() * 0.12), 3, 4); }
      ridge(c, w, h, h * 0.85, 12, p[4], r, true);
    },
    asteroids(c, w, h, p, r) {
      glow(c, w * 0.7, h * 0.4, w * 0.5, p[1], 0.35);
      for (let i = 0; i < 26; i++) {
        const z = r(), x = r() * w, y = r() * h, s = 6 + z * 40;
        rock(c, x, y, s, mix(p[4], p[2], z), r, p[5]);
        if (r() < 0.15) glow(c, x, y, s * 1.2, p[5], 0.5);
      }
    },
    station(c, w, h, p, r, a) {
      T.asteroids(c, w, h, p, r, a);
      rock(c, w * 0.5, h * 0.62, h * 0.32, p[3], r, p[5]);
      c.fillStyle = p[4]; c.fillRect(w * 0.5 - 4, h * 0.25, 8, h * 0.15); c.fillRect(w * 0.42, h * 0.35, w * 0.16, 6);
      for (let i = 0; i < 12; i++) { c.fillStyle = p[5]; const x = w * 0.42 + r() * w * 0.16, y = h * 0.5 + r() * h * 0.2; c.fillRect(x, y, 3, 3); glow(c, x, y, 10, p[5], 0.5); }
    },
    pyre(c, w, h, p, r) {
      const cx = w / 2, cy = h * 0.55;
      for (let i = 0; i < 20; i++) { c.strokeStyle = hexA(p[5], 0.08 + r() * 0.1); c.lineWidth = 4 + r() * 10; const a = r() * 6.28; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * w, cy + Math.sin(a) * w); c.stroke(); }
      glow(c, cx, cy, h * 0.7, p[1], 0.8); glow(c, cx, cy, h * 0.3, p[5], 1);
      c.fillStyle = p[4]; c.beginPath(); c.rect(0, 0, w, h); c.moveTo(cx + h * 0.75, cy); c.arc(cx, cy, h * 0.75, 0, 7, true); c.fill('evenodd');
      for (let i = 0; i < 30; i++) { const x = r() * w, y = h * (0.8 + r() * 0.15); c.fillStyle = p[4]; c.beginPath(); c.arc(x, y - 14, 5, 0, 7); c.fill(); c.fillRect(x - 6, y - 10, 12, 30); }
    },
    hellworld(c, w, h, p, r) {
      sky(c, w, h, p[1], p[5], true);
      c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(0, 0, w, h);
      glow(c, w * 0.12, h * 0.25, h * 0.5, '#ffd06a', 0.7);
      planet(c, w * 0.85, h * 0.2, h * 0.07, '#cfe8ff', false, r);
      ridge(c, w, h, h * 0.55, 60, mix(p[2], '#1a2a4a', 0.0), r, true, 2);
      ridge(c, w, h, h * 0.72, 40, p[3], r, true, 2);
      c.strokeStyle = hexA('#ff7a2a', 0.9); c.lineWidth = 2;
      for (let i = 0; i < 12; i++) { let x = r() * w * 0.5, y = h * (0.78 + r() * 0.2); c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 4; k++) { x += 10 + r() * 20; y += (r() - 0.5) * 10; c.lineTo(x, y); } c.stroke(); }
      for (let i = 0; i < 10; i++) { const x = w * 0.55 + r() * w * 0.45, y = h * (0.75 + r() * 0.2), s = 6 + r() * 14; poly(c, [x - s / 3, y, x, y - s * 1.6, x + s / 3, y], hexA('#bfefff', 0.85)); }
      ridge(c, w, h, h * 0.88, 14, p[4], r, true);
    },
    ice(c, w, h, p, r) {
      for (let i = 0; i < 3; i++) { c.strokeStyle = hexA(i % 2 ? '#7affc8' : '#7ad0ff', 0.25); c.lineWidth = 18; c.beginPath(); const y = h * (0.15 + i * 0.08); c.moveTo(0, y); for (let x = 0; x <= w; x += 30) c.lineTo(x, y + Math.sin(x / 60 + i) * 18); c.stroke(); }
      ridge(c, w, h, h * 0.55, 70, p[2], r, true, 2);
      ridge(c, w, h, h * 0.72, 50, p[3], r, true, 3);
      for (let i = 0; i < 16; i++) { const x = r() * w, y = h * (0.72 + r() * 0.2), s = 10 + r() * 30; poly(c, [x - s / 3, y, x, y - s * 2, x + s / 3, y], hexA(p[5], 0.55)); }
      ridge(c, w, h, h * 0.9, 12, p[4], r, true);
    },
    crash(c, w, h, p, r, a) {
      T.hellworld(c, w, h, p, r, a);
      c.save(); c.translate(w * 0.5, h * 0.78); c.rotate(0.12); frigate(c, 0, 0, 1.6, '#160808', '#ffb04a'); c.restore();
      for (let k = 0; k < 10; k++) { c.fillStyle = hexA('#1a1010', 0.4 - k * 0.035); c.beginPath(); c.arc(w * 0.5 + k * 9, h * 0.68 - k * 18, 12 + k * 5, 0, 7); c.fill(); }
    },
    pit(c, w, h, p, r) {
      glow(c, w * 0.5, h * 0.8, w * 0.6, p[5], 0.6);
      poly(c, [0, 0, w * 0.35, h * 0.3, w * 0.25, h, 0, h], p[3]); poly(c, [w, 0, w * 0.65, h * 0.3, w * 0.75, h, w, h], p[3]);
      const cx = w * 0.5, by = h * 0.85;
      for (let i = 0; i < 9; i++) { c.save(); c.translate(cx + (r() - 0.5) * 120, by - i * 14); c.rotate((r() - 0.5) * 0.6); c.fillStyle = mix(p[4], '#3a1a10', r()); c.fillRect(-50, -8, 100, 16); c.restore(); }
      c.fillStyle = p[4]; c.fillRect(cx - 18, by - 170, 36, 60); poly(c, [cx - 30, by - 170, cx - 18, by - 200, cx - 6, by - 170, cx + 6, by - 200, cx + 18, by - 170, cx + 30, by - 200, cx + 30, by - 170], p[4]);
      glow(c, cx, by - 140, 26, '#ff8a3a', 0.8);
      c.fillStyle = hexA('#ffcf9a', 0.5); for (let i = 0; i < 60; i++) c.fillRect(w * 0.2 + r() * w * 0.08, h * 0.3 + r() * h * 0.5, 1, 6);
    },
    storm(c, w, h, p, r) {
      for (let i = 0; i < 6; i++) { c.fillStyle = hexA('#000000', 0.25); c.beginPath(); c.ellipse(r() * w, h * 0.15 * r(), 120 + r() * 120, 30 + r() * 20, 0, 0, 7); c.fill(); }
      for (let b = 0; b < 2; b++) {
        let x = w * (0.25 + r() * 0.5), y = 0; c.strokeStyle = hexA(p[5], 0.9); c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y);
        while (y < h * 0.6) { x += (r() - 0.5) * 40; y += 12 + r() * 18; c.lineTo(x, y); } c.stroke(); glow(c, x, y, 60, p[5], 0.35);
      }
      ridge(c, w, h, h * 0.58, 40, p[2], r, true);
      for (let i = 0; i < 6; i++) { const x = r() * w, y = h * 0.66; c.fillStyle = p[3]; c.beginPath(); c.ellipse(x, y, 34, 18, 0, Math.PI, 0); c.fill(); c.fillStyle = '#ffd86a'; c.fillRect(x - 6, y - 6, 12, 4); }
      ridge(c, w, h, h * 0.75, 14, p[3], r);
      c.strokeStyle = p[4]; c.lineWidth = 1;
      for (let i = 0; i < 6; i++) { const y = h * (0.8 + i * 0.03); c.beginPath(); for (let x = 0; x < w; x += 8) { c.moveTo(x, y); c.lineTo(x + 4, y - 3); c.lineTo(x + 8, y); } c.stroke(); }
      ridge(c, w, h, h * 0.92, 6, p[4], r);
      c.strokeStyle = hexA('#cfe8d0', 0.25); c.lineWidth = 1;
      for (let i = 0; i < 160; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 4, y + 14); c.stroke(); }
    },
    bunker(c, w, h, p, r, a) {
      T.storm(c, w, h, p, r, a);
      poly(c, [0, 0, w * 0.22, 0, w * 0.18, h * 0.5, w * 0.26, h, 0, h], p[3]); poly(c, [w, 0, w * 0.8, 0, w * 0.84, h * 0.5, w * 0.76, h, w, h], p[3]);
      for (let i = 0; i < 6; i++) { const left = i % 2 === 0, x = left ? w * 0.1 + r() * 40 : w * 0.82 + r() * 40, y = h * (0.3 + r() * 0.5); c.fillStyle = p[5]; c.fillRect(x, y, 10, 14); glow(c, x + 5, y + 7, 22, p[5], 0.5); }
    },
    megacity(c, w, h, p, r) {
      glow(c, w * 0.5, h * 0.25, h * 0.45, '#ffffff', 0.8);
      for (let L = 0; L < 3; L++) {
        const col = [p[2], p[3], p[4]][L], n = 14 - L * 3;
        for (let i = 0; i < n; i++) {
          const bw = 14 + r() * 22 + L * 8, x = r() * w, th = h * (0.35 + r() * 0.45) - L * 20, y = h - th;
          c.fillStyle = col; c.fillRect(x, y, bw, th); poly(c, [x, y, x + bw / 2, y - 20 - r() * 40, x + bw, y], col);
          if (L === 2) { c.fillStyle = hexA('#ffffff', 0.4); for (let k = 0; k < 8; k++) c.fillRect(x + 3, y + 10 + k * 14, bw - 6, 2); }
        }
      }
      c.fillStyle = hexA(p[5] === '#ffffff' ? '#7d3cff' : p[5], 0.75);
      for (let i = 0; i < 3; i++) c.fillRect(w * (0.1 + r() * 0.7), h * (0.3 + r() * 0.3), 50, 18);
      c.fillStyle = hexA('#3a2c20', 0.7); for (let i = 0; i < 30; i++) c.fillRect(r() * w, h * (0.1 + r() * 0.4), 6, 2);
    },
    promenade(c, w, h, p, r, a) {
      T.megacity(c, w, h, p, r, a);
      c.strokeStyle = hexA(p[5], 0.5); c.lineWidth = 6; c.beginPath(); c.arc(w * 0.5, h * 0.32, h * 0.18, 0, 7); c.stroke();
      c.fillStyle = hexA(p[5], 0.25); c.beginPath(); c.arc(w * 0.5, h * 0.32, h * 0.12, 0, 7); c.fill();
      c.fillStyle = p[4]; c.fillRect(0, h * 0.86, w, h * 0.14);
      c.strokeStyle = hexA('#bfe8ff', 0.7); c.lineWidth = 2;
      for (let i = -4; i <= 4; i++) { c.beginPath(); c.moveTo(w * 0.5, h * 0.84); c.quadraticCurveTo(w * 0.5 + i * 12, h * 0.68, w * 0.5 + i * 22, h * 0.86); c.stroke(); }
      for (let i = 0; i < 5; i++) { const x = w * (0.08 + i * 0.22); c.fillStyle = p[4]; c.fillRect(x, h * 0.5, 3, h * 0.36); c.fillStyle = '#d03a2a'; c.fillRect(x + 3, h * 0.5, 16, 40); }
    },
    undercity(c, w, h, p, r) {
      for (let L = 0; L < 4; L++) {
        const y = h * (0.2 + L * 0.2); c.fillStyle = mix(p[3], '#000', L * 0.1); c.fillRect(0, y, w, 8);
        for (let i = 0; i < 6; i++) { const x = r() * w; c.fillRect(x, y, 6, h); }
        for (let i = 0; i < 5; i++) { const x = r() * w; c.strokeStyle = p[4]; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y + 8); c.lineTo(x, y + 30); c.stroke(); c.fillStyle = p[5]; c.beginPath(); c.arc(x, y + 32, 3, 0, 7); c.fill(); glow(c, x, y + 32, 24, p[5], 0.4); }
      }
      c.strokeStyle = hexA(p[2], 1); c.lineWidth = 10;
      for (let i = 0; i < 4; i++) { const y = r() * h; c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(w * 0.3, y + 40, w * 0.6, y - 40, w, y + 10); c.stroke(); }
      c.fillStyle = p[4]; c.fillRect(0, h * 0.9, w, h * 0.1);
    },
    spire(c, w, h, p, r) {
      stars(c, w, h, r, 60, '#d8c8ff', 0.5);
      for (let i = 0; i < 20; i++) { const bw = 20 + r() * 30, x = r() * w, th = h * (0.2 + r() * 0.3); c.fillStyle = p[3]; c.fillRect(x, h - th, bw, th); c.fillStyle = hexA('#ffe0a0', 0.5); for (let k = 0; k < 6; k++) c.fillRect(x + 4 + r() * (bw - 8), h - th + r() * th, 2, 2); }
      const cx = w / 2;
      poly(c, [cx - 50, h, cx - 26, h * 0.04, cx, -10, cx + 26, h * 0.04, cx + 50, h], '#06040c');
      c.strokeStyle = hexA(p[5], 0.9); c.lineWidth = 1.5;
      for (let k = 0; k < 18; k++) { const y = h * 0.08 + k * h * 0.05, half = 26 + (y / h) * 24; c.beginPath(); c.moveTo(cx - half, y); c.lineTo(cx + half, y); c.stroke(); }
      glow(c, cx, h * 0.06, 50, p[5], 0.6);
    },
    void(c, w, h, p, r) {
      for (let i = 0; i < 5; i++) glow(c, r() * w, r() * h, 60 + r() * 120, p[i % 2 ? 2 : 1], 0.5);
      for (let i = 0; i < 7; i++) { const x = r() * w, y = r() * h; c.fillStyle = hexA(p[5], 0.9); c.beginPath(); c.ellipse(x, y, 6, 2.5, 0, 0, 7); c.fill(); c.fillStyle = '#000'; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); glow(c, x, y, 20, p[5], 0.4); }
      c.strokeStyle = hexA(p[5], 0.18); c.lineWidth = 3;
      for (let i = 0; i < 9; i++) { c.beginPath(); const y = h * (0.6 + r() * 0.4); c.moveTo(r() * w, h); c.bezierCurveTo(r() * w, y, r() * w, r() * h, r() * w, r() * h * 0.6); c.stroke(); }
      for (let i = 0; i < 6; i++) { const x = r() * w, y = r() * h, s = 10 + r() * 30; c.strokeStyle = hexA(p[5], 0.35); c.lineWidth = 1; c.beginPath(); c.moveTo(x, y - s); c.lineTo(x + s, y + s); c.lineTo(x - s, y + s); c.closePath(); c.stroke(); }
    },
    bazaar(c, w, h, p, r, a) {
      T.void(c, w, h, p, r, a);
      const cx = w / 2, cy = h * 0.55;
      poly(c, [cx - 10, cy + 80, cx, cy - 110, cx + 10, cy + 80], '#000');
      for (let i = 0; i < 14; i++) { const ang = i / 14 * 6.28, x = cx + Math.cos(ang) * w * 0.36, y = cy + Math.sin(ang) * h * 0.18; c.save(); c.translate(x, y); c.rotate(ang + 1.57); c.fillStyle = p[3]; c.fillRect(-20, -6, 40, 12); c.fillStyle = p[5]; c.fillRect(-14, -2, 4, 3); c.fillRect(6, -2, 4, 3); c.restore(); }
      glow(c, cx, cy, 40, p[5], 0.3);
    },
    throne(c, w, h, p, r, a) {
      T.void(c, w, h, p, r, a);
      const cx = w / 2;
      poly(c, [cx - 160, h, cx - 90, h * 0.4, cx - 40, h * 0.3, cx, h * 0.12, cx + 40, h * 0.3, cx + 90, h * 0.4, cx + 160, h], '#050208');
      for (let i = -3; i <= 3; i++) poly(c, [cx + i * 40 - 8, h * 0.5 + Math.abs(i) * 20, cx + i * 40, h * 0.3 + Math.abs(i) * 24, cx + i * 40 + 8, h * 0.5 + Math.abs(i) * 20], '#0c0616');
      glow(c, cx, h * 0.12, 70, p[5], 0.7);
      c.fillStyle = '#000'; c.beginPath(); c.arc(cx, h * 0.12, 16, 0, 7); c.fill();
      c.strokeStyle = hexA(p[5], 0.6); c.lineWidth = 1.5;
      for (let i = 0; i < 10; i++) { c.beginPath(); c.moveTo(cx, h * 0.12); c.bezierCurveTo(cx + (r() - 0.5) * 200, h * 0.3, cx + (r() - 0.5) * 300, h * 0.5, cx + (r() - 0.5) * w, h); c.stroke(); }
    },
    graveyard(c, w, h, p, r) {
      for (let i = 0; i < 4; i++) glow(c, r() * w, r() * h, 120, p[2], 0.4);
      for (let i = 0; i < 9; i++) { const z = r(); c.save(); c.translate(r() * w, r() * h); c.rotate((r() - 0.5) * 2); frigate(c, 0, 0, 0.3 + z * 0.9, mix(p[4], p[3], z), r() < 0.4 ? p[5] : null); c.restore(); }
    },
    nebula(c, w, h, p, r, a) {
      for (let i = 0; i < 9; i++) glow(c, r() * w, r() * h, 80 + r() * 160, [p[1], p[2], p[5]][i % 3], 0.35);
      if (a.spiral) { c.strokeStyle = hexA(p[5], 0.35); c.lineWidth = 6; c.beginPath(); for (let t = 0; t < 22; t += 0.1) { const rad = 4 + t * 7; c.lineTo(w * 0.6 + Math.cos(t) * rad, h * 0.5 + Math.sin(t) * rad * 0.6); } c.stroke(); }
      stars(c, w, h, r, 80, '#ffe0f0');
    },
    derelict(c, w, h, p, r, a) {
      T.nebula(c, w, h, p, r, { spiral: true });
      c.fillStyle = p[4]; c.beginPath(); c.rect(0, 0, w, h); c.moveTo(w / 2 + w * 0.32, h * 0.45); c.ellipse(w / 2, h * 0.45, w * 0.32, h * 0.32, 0, 0, 7, true); c.fill('evenodd');
      for (let i = 0; i < 9; i++) { c.fillStyle = p[3]; c.fillRect(i * w / 9, 0, 10, h); }
      c.strokeStyle = hexA('#000', 0.7); c.lineWidth = 3; c.beginPath(); c.moveTo(w * 0.35, h * 0.2); c.lineTo(w * 0.5, h * 0.4); c.lineTo(w * 0.45, h * 0.6); c.stroke();
    },
    flagship(c, w, h, p, r) {
      glow(c, w * 0.5, h * 0.5, w * 0.6, '#5a0a0a', 0.7);
      c.save(); c.translate(w * 0.5, h * 0.55); c.scale(4.2, 3.2); frigate(c, 0, 0, 1, '#030203', '#ff3a3a'); c.restore();
      c.fillStyle = '#050505'; c.fillRect(w * 0.42, h * 0.08, 3, h * 0.3); c.beginPath(); c.moveTo(w * 0.42 + 3, h * 0.08); c.quadraticCurveTo(w * 0.52, h * 0.1, w * 0.56, h * 0.12); c.lineTo(w * 0.55, h * 0.22); c.quadraticCurveTo(w * 0.5, h * 0.2, w * 0.42 + 3, h * 0.2); c.fill();
      c.fillStyle = hexA('#bbbbbb', 0.8); c.font = 'bold 14px Bungee, sans-serif'; c.fillText('PF', w * 0.47, h * 0.17);
    },
    vault(c, w, h, p, r) {
      planet(c, w * 0.82, h * 0.18, h * 0.1, mix(p[5], '#ffffff', 0.25), true, r);
      for (let i = 0; i < 3; i++) { c.fillStyle = hexA(p[5], 0.1); c.beginPath(); const sx = w * (0.2 + i * 0.3); c.moveTo(sx, h * 0.6); const ang = -1.9 + r() * 0.8; c.lineTo(sx + Math.cos(ang - 0.07) * w, h * 0.6 + Math.sin(ang - 0.07) * w); c.lineTo(sx + Math.cos(ang + 0.07) * w, h * 0.6 + Math.sin(ang + 0.07) * w); c.fill(); }
      ridge(c, w, h, h * 0.42, 40, p[2], r, true);
      c.fillStyle = p[3]; c.fillRect(0, h * 0.5, w, h * 0.5);
      const neon = [p[5], '#3fd0c9', '#f2a33a', '#e8442e'];
      for (let row = 0; row < 3; row++) {
        const ww = 26 - row * 2, hh = ww * 1.4, gap = ww * 0.9, y = h * 0.55 + row * (hh + 10), off = (row % 2) * (ww + gap) / 2;
        for (let x = 10 + off; x < w - ww; x += ww + gap) {
          const col = neon[(r() * neon.length) | 0];
          c.beginPath(); c.moveTo(x, y + hh); c.lineTo(x, y + ww / 2); c.arc(x + ww / 2, y + ww / 2, ww / 2, Math.PI, 0); c.lineTo(x + ww, y + hh); c.closePath();
          c.fillStyle = '#05030a'; c.fill(); c.strokeStyle = col; c.lineWidth = 1.6; c.stroke();
          if (r() < 0.35) glow(c, x + ww / 2, y + hh * 0.6, ww, col, 0.45);
        }
      }
      c.fillStyle = hexA(p[5], 0.85); c.fillRect(w * 0.36, h * 0.47, w * 0.28, 12); glow(c, w * 0.5, h * 0.47 + 6, w * 0.2, p[5], 0.35);
      ridge(c, w, h, h * 0.94, 5, p[4], r);
    },
    ship(c, w, h, p, r, a) {
      // window onto the current location
      const loc = a.view && LOCS[a.view] ? LOCS[a.view].art : null;
      c.save(); c.beginPath(); c.ellipse(w / 2, h * 0.42, w * 0.38, h * 0.34, 0, 0, 7); c.clip();
      if (loc) { const vp = loc.pal; sky(c, w, h, vp[0], vp[1]); stars(c, w, h, rng(loc.seed), 80); planet(c, w * 0.62, h * 0.5, h * 0.24, mix(vp[1], vp[5], 0.4), !!loc.ring, rng(loc.seed + 1)); }
      else { stars(c, w, h, r, 120); }
      c.restore();
      c.fillStyle = p[4]; c.beginPath(); c.rect(0, 0, w, h); c.moveTo(w / 2 + w * 0.38, h * 0.42); c.ellipse(w / 2, h * 0.42, w * 0.38, h * 0.34, 0, 0, 7, true); c.fill('evenodd');
      c.strokeStyle = p[3]; c.lineWidth = 10; c.beginPath(); c.ellipse(w / 2, h * 0.42, w * 0.38, h * 0.34, 0, 0, 7); c.stroke();
      c.strokeStyle = p[2]; c.lineWidth = 3; for (let i = 0; i < 6; i++) { const ang = i / 6 * 6.28; c.beginPath(); c.moveTo(w / 2 + Math.cos(ang) * w * 0.38, h * 0.42 + Math.sin(ang) * h * 0.34); c.lineTo(w / 2 + Math.cos(ang) * w * 0.5, h * 0.42 + Math.sin(ang) * h * 0.5); c.stroke(); }
      c.fillStyle = p[3]; c.fillRect(0, h * 0.8, w, h * 0.2);
      for (let i = 0; i < 26; i++) { const col = ['#f2a33a', '#3fd0c9', '#e8442e', '#b48cff'][(r() * 4) | 0]; const x = 20 + r() * (w - 40), y = h * 0.84 + r() * h * 0.12; c.fillStyle = col; c.fillRect(x, y, 4, 3); glow(c, x + 2, y + 1, 8, col, 0.4); }
    }
  };

  function paint(canvas, art, opts) {
    opts = opts || {};
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 360, h = canvas.clientHeight || 180;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const p = art.pal, r = rng(art.seed || 1);
    sky(c, w, h, p[0], p[1]);
    const dayKinds = ['desert', 'junktown', 'megacity', 'promenade', 'hellworld', 'crash'];
    if (!dayKinds.includes(art.k)) stars(c, w, h, r, art.k === 'void' || art.k === 'throne' ? 30 : 110, '#ffffff', 0.7);
    (T[art.k] || T.plains)(c, w, h, p, r, Object.assign({}, art, opts));
    finish(c, w, h, p);
  }

  function paintTitle(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 360, h = canvas.clientHeight || 300;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rng(1979);
    sky(c, w, h, '#05061a', '#2a1240');
    for (let i = 0; i < 5; i++) glow(c, r() * w, r() * h * 0.7, 90 + r() * 120, ['#7a4bd1', '#e8442e', '#3fd0c9'][i % 3], 0.22);
    stars(c, w, h, r, 220);
    planet(c, w * 0.78, h * 0.62, Math.min(w, h) * 0.3, '#e8743a', true, r);
    planet(c, w * 0.16, h * 0.2, Math.min(w, h) * 0.06, '#9fd4ff', false, r);
    c.strokeStyle = 'rgba(255,220,160,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(w * 0.02, h * 0.98); c.quadraticCurveTo(w * 0.2, h * 0.6, w * 0.34, h * 0.42); c.stroke();
    rocket(c, w * 0.36, h * 0.4, Math.max(1, w / 360) * 1.4, '#f4ead2', 0.62, '#ff7a2a');
    halftone(c, w, h, 'rgba(0,0,0,0.5)', h * 0.5, 0.9);
    const v = c.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, w * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.7)'); c.fillStyle = v; c.fillRect(0, 0, w, h);
  }

  /* ---------- enemy silhouettes ---------- */
  function paintEnemy(canvas, id, def) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 90, h = canvas.clientHeight || 90;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rng(hash(id)), col = def.col, dark = mix(col, '#000000', 0.55), eye = def.boss ? '#ff3a3a' : '#fff6a0';
    const s = Math.min(w, h) / 100;
    c.save(); c.translate(w / 2, h * 0.58); c.scale(s, s);
    glow(c, 0, 0, 60, col, def.boss ? 0.45 : 0.25);
    c.fillStyle = col; c.strokeStyle = dark; c.lineWidth = 3;
    const eyes = (pts) => pts.forEach(([x, y, rr]) => { c.fillStyle = eye; c.beginPath(); c.arc(x, y, rr || 2.6, 0, 7); c.fill(); glow(c, x, y, (rr || 2.6) * 4, eye, 0.6); });
    const k = def.art;
    if (k === 'beast') {
      c.beginPath(); c.ellipse(0, 4, 30, 16, 0, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.ellipse(28, -8, 14, 10, -0.3, 0, 7); c.fill(); c.stroke();
      poly(c, [36, -2, 50, 2, 36, 4], col);
      for (let i = 0; i < 4; i++) { c.fillRect(-22 + i * 14, 14, 6, 18); }
      c.beginPath(); c.moveTo(-28, 0); c.quadraticCurveTo(-50, -10, -46, -26); c.lineWidth = 5; c.strokeStyle = col; c.stroke();
      for (let i = 0; i < 5; i++) poly(c, [-20 + i * 9, -10, -16 + i * 9, -22 - r() * 6, -12 + i * 9, -10], dark);
      eyes([[32, -11]]);
    } else if (k === 'plant') {
      c.strokeStyle = col; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 36); c.quadraticCurveTo(-8, 0, 0, -20); c.stroke();
      c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(0, 10 - i * 4); c.bezierCurveTo((i % 2 ? 1 : -1) * 30, -10 - i * 4, (i % 2 ? 1 : -1) * 40, 10, (i % 2 ? 1 : -1) * (30 + r() * 14), 30); c.stroke(); }
      c.fillStyle = col; c.beginPath(); c.arc(0, -26, 18, 0, 7); c.fill();
      c.fillStyle = dark; c.beginPath(); c.ellipse(0, -22, 10, 6, 0, 0, 3.14); c.fill();
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; poly(c, [Math.cos(a) * 16, -26 + Math.sin(a) * 16, Math.cos(a + 0.2) * 30, -26 + Math.sin(a + 0.2) * 30, Math.cos(a + 0.4) * 16, -26 + Math.sin(a + 0.4) * 16], col); }
      eyes([[-6, -30, 2], [6, -30, 2]]);
    } else if (k === 'wisp') {
      for (let i = 0; i < 5; i++) { c.strokeStyle = hexA(col, 0.5); c.lineWidth = 4 - i * 0.5; c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-20 + i * 10, 20, 20 - i * 8, 30, (r() - 0.5) * 40, 44); c.stroke(); }
      glow(c, 0, -6, 34, col, 0.9); c.fillStyle = mix(col, '#ffffff', 0.5); c.beginPath(); c.arc(0, -6, 14, 0, 7); c.fill();
      c.fillStyle = dark; c.beginPath(); c.arc(-5, -8, 2.5, 0, 7); c.arc(5, -8, 2.5, 0, 7); c.fill(); c.beginPath(); c.ellipse(0, 0, 4, 3, 0, 0, 7); c.fill();
    } else if (k === 'humanoid' || k === 'shifter' || k === 'mutant') {
      const hunch = k === 'mutant' ? 8 : 0;
      c.beginPath(); c.arc(hunch, -30 + hunch, 9, 0, 7); c.fill(); c.stroke();
      poly(c, [-14, -18 + hunch, 14 + hunch, -18 + hunch, 10, 12, -10, 12], col);
      c.fillRect(-10, 12, 7, 26); c.fillRect(3, 12, 7, 26);
      c.save(); c.translate(14 + hunch, -14 + hunch); c.rotate(0.9); c.fillRect(0, -3, 22, 6); c.restore();
      c.save(); c.translate(-14, -14 + hunch); c.rotate(2.0); c.fillRect(0, -3, 20, 6); c.restore();
      c.fillStyle = dark; c.save(); c.translate(22 + hunch, -2 + hunch); c.rotate(-0.2); c.fillRect(0, -2, 30, 4); c.restore();
      if (k === 'mutant') { for (let i = 0; i < 6; i++) poly(c, [-10 + i * 5, -18, -8 + i * 5 + hunch, -30 - r() * 10, -6 + i * 5, -18], dark); eyes([[hunch - 3, -30 + hunch, 2], [hunch + 4, -32 + hunch, 2], [hunch + 1, -26 + hunch, 1.6]]); }
      else if (k === 'shifter') { c.strokeStyle = hexA(col, 0.4); c.lineWidth = 2; for (let i = 1; i < 4; i++) { c.beginPath(); c.arc(i * 6, -30, 9, 0, 7); c.stroke(); c.beginPath(); c.arc(-i * 6, -30, 9, 0, 7); c.stroke(); } eyes([[-3, -31, 2], [3, -31, 2]]); }
      else { c.fillStyle = eye; c.fillRect(-6, -33, 12, 3); glow(c, 0, -32, 12, eye, 0.6); }
    } else if (k === 'drone') {
      c.beginPath(); c.ellipse(0, 0, 28, 10, 0, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.arc(0, -4, 12, 3.14, 0); c.fill();
      c.strokeStyle = col; c.lineWidth = 2; [-30, 30].forEach(x => { c.beginPath(); c.moveTo(x * 0.7, -2); c.lineTo(x, -14); c.stroke(); c.beginPath(); c.ellipse(x, -15, 14, 2, 0, 0, 7); c.stroke(); });
      c.fillStyle = dark; c.fillRect(-8, 8, 4, 16); c.fillRect(4, 8, 4, 16);
      eyes([[0, 2, 4]]);
    } else if (k === 'construct') {
      c.fillRect(-18, -40, 36, 22); c.strokeRect(-18, -40, 36, 22);
      c.fillRect(-26, -16, 52, 34); c.strokeRect(-26, -16, 52, 34);
      c.fillRect(-40, -14, 12, 34); c.fillRect(28, -14, 12, 34);
      c.fillRect(-20, 18, 14, 22); c.fillRect(6, 18, 14, 22);
      glow(c, 0, 0, 22, def.boss ? '#ff5a3a' : '#6ad0ff', 0.9); c.fillStyle = mix(col, '#fff', 0.6); c.beginPath(); c.arc(0, 0, 6, 0, 7); c.fill();
      eyes([[-6, -30, 2.4], [6, -30, 2.4]]);
    } else if (k === 'mech') {
      c.fillRect(-28, -30, 56, 36); c.strokeRect(-28, -30, 56, 36);
      c.fillRect(-12, -42, 24, 14);
      c.fillRect(-44, -26, 16, 12); c.fillRect(-56, -22, 18, 6); c.fillRect(28, -26, 16, 12); c.fillRect(36, -22, 26, 6);
      poly(c, [-24, 6, -34, 40, -18, 40, -12, 6], col); poly(c, [24, 6, 34, 40, 18, 40, 12, 6], col);
      c.fillStyle = dark; for (let i = 0; i < 4; i++) c.fillRect(-22 + i * 12, -20, 6, 20);
      eyes([[-5, -36, 2.4], [5, -36, 2.4]]);
    } else if (k === 'wyrm') {
      c.strokeStyle = col; c.lineCap = 'round';
      for (let i = 0; i < 7; i++) { c.lineWidth = 20 - i * 1.5; c.beginPath(); c.moveTo(-30 + i * 8, 40 - i * 4); c.lineTo(-24 + i * 8, 30 - i * 9); c.stroke(); }
      c.fillStyle = col; c.beginPath(); c.ellipse(20, -30, 18, 12, -0.5, 0, 7); c.fill();
      poly(c, [26, -36, 50, -50, 34, -28], col); poly(c, [28, -24, 48, -14, 30, -20], col);
      for (let i = 0; i < 4; i++) poly(c, [34 + i * 3, -36 + i * 3, 36 + i * 3, -30 + i * 3, 38 + i * 3, -36 + i * 3], '#fff');
      c.fillStyle = dark; c.fillRect(-40, 36, 80, 8);
      eyes([[18, -34, 2.6]]);
    } else if (k === 'horror' || k === 'shroud') {
      c.strokeStyle = col; c.lineCap = 'round';
      for (let i = 0; i < 9; i++) { c.lineWidth = 6 - i * 0.3; const a = -0.3 + i / 8 * 3.7; c.beginPath(); c.moveTo(0, 6); c.bezierCurveTo(Math.cos(a) * 30, 6 + Math.sin(a) * 20, Math.cos(a) * 46, 20 + r() * 10, Math.cos(a) * (50 + r() * 10), 36); c.stroke(); }
      c.fillStyle = k === 'shroud' ? '#0a0614' : col; c.beginPath(); c.ellipse(0, -10, 30, 28, 0, 0, 7); c.fill();
      if (k === 'shroud') { c.strokeStyle = hexA('#ff5fa2', 0.7); c.lineWidth = 1.5; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo((r() - 0.5) * 50, -36); c.quadraticCurveTo((r() - 0.5) * 70, 0, (r() - 0.5) * 90, 40); c.stroke(); } glow(c, 0, -10, 40, '#ff5fa2', 0.4); }
      const ey = []; for (let i = 0; i < (def.boss ? 7 : 4); i++) ey.push([(r() - 0.5) * 36, -20 + (r() - 0.5) * 24, 1.8 + r() * 2]); eyes(ey);
    } else if (k === 'vehicle') {
      c.fillRect(-40, -6, 80, 20); c.strokeRect(-40, -6, 80, 20);
      c.fillStyle = dark; c.beginPath(); c.ellipse(0, 18, 44, 9, 0, 0, 7); c.fill();
      c.fillStyle = mix(col, '#000', 0.2); for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(-36 + i * 12, 18, 5, 0, 7); c.fill(); }
      c.fillStyle = col; c.beginPath(); c.ellipse(-4, -12, 20, 10, 0, 0, 7); c.fill(); c.stroke();
      c.fillRect(12, -16, 40, 6);
      eyes([[-10, -14, 2]]);
    } else {
      c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fill(); eyes([[-6, -4], [6, -4]]);
    }
    c.restore();
  }

  /* ---------- galaxy map ---------- */
  const MAPPOS = { eplaotune: [0.16, 0.72], pliea: [0.32, 0.5], eldania: [0.48, 0.72], aegialeus: [0.62, 0.86], skuna: [0.66, 0.42], wucury: [0.82, 0.68], ruenov: [0.84, 0.26], unknown: [0.14, 0.16], snailshell: [0.44, 0.14], vault: [0.3, 0.9] };
  function paintGalaxy(canvas, unlocked, cur) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 360, h = canvas.clientHeight || 220;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rng(42);
    sky(c, w, h, '#05061a', '#140a2a');
    for (let i = 0; i < 6; i++) glow(c, r() * w, r() * h, 60 + r() * 90, ['#7a4bd1', '#e8442e', '#3fd0c9'][i % 3], 0.18);
    stars(c, w, h, r, 160);
    c.fillStyle = 'rgba(255,240,200,0.1)'; c.beginPath(); c.ellipse(w * 0.75, h * 0.35, w * 0.2, h * 0.25, 0, 0, 7); c.fill();
    c.font = '9px "Chakra Petch", sans-serif'; c.fillStyle = 'rgba(244,234,210,0.45)'; c.fillText('INNER COLONIES', w * 0.68, h * 0.08);
    c.fillText('OUTER COLONIES', w * 0.05, h * 0.96); c.fillText('UNCHARTED', w * 0.04, h * 0.06);
    c.setLineDash([3, 5]); c.strokeStyle = 'rgba(244,234,210,0.25)'; c.lineWidth = 1;
    const ids = TRAVEL_ORDER.filter(id => unlocked.includes(id));
    c.beginPath(); ids.forEach((id, i) => { const [x, y] = MAPPOS[id]; i ? c.lineTo(x * w, y * h) : c.moveTo(x * w, y * h); }); c.stroke(); c.setLineDash([]);
    TRAVEL_ORDER.forEach(id => {
      const [x, y] = MAPPOS[id], on = unlocked.includes(id), L = LOCS[id];
      const px = x * w, py = y * h;
      if (!on) { c.fillStyle = 'rgba(255,255,255,0.15)'; c.beginPath(); c.arc(px, py, 3, 0, 7); c.fill(); return; }
      planet(c, px, py, id === cur ? 9 : 7, mix(L.art.pal[1], L.art.pal[5], 0.4), !!L.art.ring, rng(L.art.seed));
      if (id === cur) { c.strokeStyle = '#f2a33a'; c.lineWidth = 1.5; c.beginPath(); c.arc(px, py, 15, 0, 7); c.stroke(); }
      c.fillStyle = '#f4ead2'; c.font = '600 10px "Chakra Petch", sans-serif'; c.fillText(L.n.replace('The ', ''), px + 12, py + 3);
    });
  }

  return { paint, paintTitle, paintEnemy, paintGalaxy, hexA };
})();

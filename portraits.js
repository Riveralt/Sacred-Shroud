/* ============================================================
   THE SACRED SHROUD — pulp portrait busts, drawn in code
   ============================================================ */
const PORTRAITS = {
  miles:    { rim: '#f2a33a', bg: '#3a2410', skin: '#d9a27a', hair: '#5a3a22', hs: 'messy', jaw: 'square', brows: 'cocky', eyes: 'normal', iris: '#5a7a3a', mouth: 'grin', stubble: true, outfit: 'jacket', oc: '#5e6b3a', under: '#efe8d8' },
  jaxon:    { rim: '#5fa0ff', bg: '#10203a', skin: '#8a5a3c', hair: '#1c120c', hs: 'buzz', jaw: 'square', brows: 'stern', eyes: 'normal', iris: '#3a2412', mouth: 'flat', outfit: 'armor', oc: '#4a5a72', under: '#2a3240', scar: 'thorn' },
  katey:    { rim: '#3fd0c9', bg: '#0e2a2a', skin: '#f0c8a8', hair: '#a8482a', hs: 'bun', jaw: 'round', brows: 'up', eyes: 'wide', iris: '#2a7a5a', mouth: 'smile', outfit: 'labcoat', oc: '#e8ece6', under: '#2a9a94', goggles: true, freckles: true },
  kat:      { rim: '#b48cff', bg: '#1c1238', robot: true, oc: '#7a6aa8', glow: '#d8b8ff' },
  ryder:    { rim: '#ff5a2e', bg: '#3a1408', skin: '#e8b896', hair: '#16100c', hs: 'slick', jaw: 'narrow', brows: 'flat', eyes: 'lidded', iris: '#4a5a6a', mouth: 'smirk', outfit: 'flight', oc: '#6a3a1e', under: '#c8322a', cheekScar: true },
  celeste:  { rim: '#ff7ab8', bg: '#2a0e22', skin: '#f2cdb4', hair: '#120a10', hs: 'long', ember: '#ff7a2a', jaw: 'narrow', brows: 'flat', eyes: 'glow', iris: '#ff8a3a', mouth: 'flat', outfit: 'robe', oc: '#3a1a3a', under: '#5a2a4a', burns: true },
  buckner:  { rim: '#a87dff', bg: '#1a1030', skin: '#ecd2c0', hair: '#2a2630', hs: 'sidepart', jaw: 'narrow', brows: 'up', eyes: 'lidded', iris: '#3a3a5a', mouth: 'thin', stache: 'pencil', outfit: 'suit', oc: '#5a3a9a', under: '#f4f0ea', tie: '#2a1a4a', monocle: true },
  sparrow:  { rim: '#ff6fae', bg: '#2e0c22', skin: '#c88a62', hair: '#1a0e08', hs: 'hat', jaw: 'square', brows: 'cocky', eyes: 'normal', iris: '#2a1a0a', mouth: 'grin', stache: 'goatee', outfit: 'pirate', oc: '#2a1a2e', under: '#ff6fae', earring: true },
  julius:   { rim: '#d08a3a', bg: '#2a1608', skin: '#e0a882', hair: '#6a5a50', hs: 'chef', jaw: 'round', brows: 'stern', eyes: 'normal', iris: '#3a2a1a', mouth: 'flat', stache: 'walrus', outfit: 'apron', oc: '#f0ece2', under: '#a8322a', stubble: true },
  croupier: { rim: '#ffd06a', bg: '#2a1e06', skin: '#f0c49a', hair: '#1a1410', hs: 'visor', jaw: 'round', brows: 'up', eyes: 'wide', iris: '#2a4a2a', mouth: 'bigGrin', outfit: 'waistcoat', oc: '#d8a83a', under: '#f4f0ea' }
};

const PORTRAIT_ART = (() => {
  const shade = (hex, t) => { const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; const f = t < 0 ? 0 : 255, a = Math.abs(t); r = Math.round(r + (f - r) * a); g = Math.round(g + (f - g) * a); b = Math.round(b + (f - b) * a); return `rgb(${r},${g},${b})`; };
  const INK = '#140c08';
  function headPath(c, jaw) {
    const w = 33, cw = jaw === 'square' ? 19 : jaw === 'round' ? 24 : 11, jy = jaw === 'square' ? 128 : jaw === 'round' ? 124 : 122, chin = jaw === 'narrow' ? 147 : 143;
    c.beginPath(); c.moveTo(100 - w, 96);
    c.bezierCurveTo(100 - w, 46, 100 + w, 46, 100 + w, 96);
    c.bezierCurveTo(100 + w, jy - 6, 100 + cw + 6, jy + 12, 100 + cw * 0.5, chin - 2);
    c.quadraticCurveTo(100, chin + 2, 100 - cw * 0.5, chin - 2);
    c.bezierCurveTo(100 - cw - 6, jy + 12, 100 - w, jy - 6, 100 - w, 96);
    c.closePath();
  }
  function halftoneIn(c, x0, y0, x1, y1, col, gap, max) {
    c.fillStyle = col;
    for (let y = y0; y < y1; y += gap) for (let x = x0 + ((y / gap) % 2) * gap / 2; x < x1; x += gap) {
      const t = 1 - (x - x0) / (x1 - x0); const r = Math.max(0, t * max); if (r < 0.3) continue;
      c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    }
  }
  function background(c, P) {
    c.save(); c.beginPath(); c.arc(100, 120, 98, 0, 7); c.clip();
    const g = c.createRadialGradient(100, 90, 10, 100, 120, 110); g.addColorStop(0, shade(P.bg, 0.25)); g.addColorStop(1, P.bg); c.fillStyle = g; c.fillRect(0, 0, 200, 240);
    c.globalAlpha = 0.16; c.fillStyle = P.rim;
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; c.beginPath(); c.moveTo(100, 100); c.lineTo(100 + Math.cos(a) * 160, 100 + Math.sin(a) * 160); c.lineTo(100 + Math.cos(a + 0.12) * 160, 100 + Math.sin(a + 0.12) * 160); c.fill(); }
    c.globalAlpha = 0.18; halftoneIn(c, 0, 0, 200, 240, '#000', 6, 2.4); c.globalAlpha = 1;
    c.restore();
  }
  function torso(c, P) {
    // neck
    c.fillStyle = shade(P.skin, -0.18); c.strokeStyle = INK; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(86, 128); c.lineTo(86, 160); c.lineTo(114, 160); c.lineTo(114, 128); c.fill(); c.stroke();
    // shoulders
    const body = () => { c.beginPath(); c.moveTo(4, 240); c.bezierCurveTo(8, 186, 40, 166, 78, 158); c.lineTo(122, 158); c.bezierCurveTo(160, 166, 192, 186, 196, 240); c.closePath(); };
    body(); c.fillStyle = P.oc; c.fill();
    c.save(); body(); c.clip();
    const o = P.outfit;
    if (o === 'jacket') {
      c.fillStyle = P.under; c.beginPath(); c.moveTo(80, 158); c.lineTo(100, 210); c.lineTo(120, 158); c.fill();
      c.fillStyle = shade(P.oc, -0.25); c.beginPath(); c.moveTo(78, 158); c.lineTo(62, 176); c.lineTo(92, 196); c.lineTo(84, 160); c.fill(); c.beginPath(); c.moveTo(122, 158); c.lineTo(138, 176); c.lineTo(108, 196); c.lineTo(116, 160); c.fill();
      c.strokeStyle = '#3a2a1a'; c.lineWidth = 7; c.beginPath(); c.moveTo(140, 168); c.lineTo(70, 240); c.stroke();
      c.fillStyle = '#c8a050'; c.fillRect(150, 200, 10, 10);
    } else if (o === 'armor') {
      c.fillStyle = P.under; c.fillRect(70, 158, 60, 90);
      [[44, 186], [156, 186]].forEach(([x, y], i) => { c.fillStyle = P.oc; c.beginPath(); c.ellipse(x, y, 38, 24, i ? 0.35 : -0.35, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 2.5; c.stroke(); c.strokeStyle = shade(P.oc, 0.3); c.lineWidth = 2; c.beginPath(); c.ellipse(x, y - 4, 30, 16, i ? 0.35 : -0.35, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); });
      // the cut-off thorn patch on the left shoulder
      c.fillStyle = '#1a1e28'; c.beginPath(); c.moveTo(30, 180); c.lineTo(38, 172); c.lineTo(52, 176); c.lineTo(58, 186); c.lineTo(48, 196); c.lineTo(34, 192); c.closePath(); c.fill();
      c.strokeStyle = '#5fa0ff'; c.lineWidth = 2; c.beginPath(); c.moveTo(40, 190); c.lineTo(46, 182); c.stroke();
      c.fillStyle = shade(P.under, 0.15); for (let i = 0; i < 3; i++) c.fillRect(82, 172 + i * 18, 36, 3);
    } else if (o === 'labcoat') {
      c.fillStyle = P.under; c.beginPath(); c.moveTo(78, 158); c.lineTo(100, 200); c.lineTo(122, 158); c.fill();
      c.fillStyle = shade(P.oc, -0.12); c.beginPath(); c.moveTo(78, 158); c.lineTo(66, 182); c.lineTo(98, 214); c.fill(); c.beginPath(); c.moveTo(122, 158); c.lineTo(134, 182); c.lineTo(102, 214); c.fill();
      c.fillStyle = '#3a8a8a'; c.fillRect(132, 200, 18, 4); c.fillStyle = '#e8442e'; c.fillRect(138, 194, 3, 10);
    } else if (o === 'flight') {
      c.fillStyle = shade(P.oc, -0.2); c.fillRect(96, 160, 8, 90);
      c.fillStyle = '#e8d8b8';
      for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI; c.beginPath(); c.arc(100 + Math.cos(a) * 36, 162 + Math.sin(a) * -10 + 6, 9, 0, 7); c.fill(); }
      c.fillStyle = P.under; c.beginPath(); c.moveTo(84, 160); c.quadraticCurveTo(100, 176, 116, 160); c.lineTo(122, 172); c.quadraticCurveTo(110, 186, 108, 214); c.lineTo(98, 212); c.quadraticCurveTo(96, 186, 80, 172); c.closePath(); c.fill();
    } else if (o === 'robe') {
      c.fillStyle = shade(P.oc, -0.2); c.beginPath(); c.moveTo(78, 140); c.lineTo(74, 170); c.lineTo(100, 182); c.lineTo(126, 170); c.lineTo(122, 140); c.closePath(); c.fill();
      c.strokeStyle = P.under; c.lineWidth = 3; c.beginPath(); c.moveTo(100, 182); c.lineTo(100, 240); c.stroke();
      const g = c.createRadialGradient(100, 250, 4, 100, 250, 80); g.addColorStop(0, 'rgba(255,140,60,.85)'); g.addColorStop(1, 'rgba(255,90,40,0)'); c.fillStyle = g; c.fillRect(0, 170, 200, 70);
    } else if (o === 'suit') {
      c.fillStyle = P.under; c.beginPath(); c.moveTo(80, 158); c.lineTo(100, 216); c.lineTo(120, 158); c.fill();
      c.fillStyle = P.tie; c.beginPath(); c.moveTo(96, 166); c.lineTo(104, 166); c.lineTo(107, 206); c.lineTo(100, 214); c.lineTo(93, 206); c.closePath(); c.fill();
      c.fillStyle = shade(P.oc, -0.22); c.beginPath(); c.moveTo(80, 158); c.lineTo(68, 178); c.lineTo(84, 186); c.lineTo(96, 220); c.fill(); c.beginPath(); c.moveTo(120, 158); c.lineTo(132, 178); c.lineTo(116, 186); c.lineTo(104, 220); c.fill();
      c.fillStyle = '#f4f0ea'; c.beginPath(); c.moveTo(140, 186); c.lineTo(150, 182); c.lineTo(148, 192); c.fill();
    } else if (o === 'pirate') {
      c.fillStyle = shade(P.skin, -0.1); c.beginPath(); c.moveTo(82, 158); c.lineTo(100, 214); c.lineTo(118, 158); c.fill();
      c.fillStyle = P.under; c.beginPath(); c.moveTo(80, 160); c.quadraticCurveTo(70, 176, 74, 196); c.lineTo(84, 186); c.quadraticCurveTo(86, 170, 90, 162); c.fill();
      c.fillStyle = '#e8d8c0'; c.beginPath(); c.moveTo(82, 158); c.lineTo(72, 172); c.lineTo(94, 200); c.fill(); c.beginPath(); c.moveTo(118, 158); c.lineTo(128, 172); c.lineTo(106, 200); c.fill();
      c.fillStyle = '#d8b04a'; c.beginPath(); c.arc(60, 210, 4, 0, 7); c.arc(140, 210, 4, 0, 7); c.fill();
    } else if (o === 'apron') {
      c.fillStyle = '#d8d2c6'; c.fillRect(0, 158, 200, 90);
      c.fillStyle = P.under; c.beginPath(); c.moveTo(80, 160); c.lineTo(100, 176); c.lineTo(120, 160); c.lineTo(116, 168); c.lineTo(100, 184); c.lineTo(84, 168); c.closePath(); c.fill();
      c.fillStyle = P.oc; c.beginPath(); c.moveTo(70, 188); c.lineTo(130, 188); c.lineTo(138, 240); c.lineTo(62, 240); c.fill(); c.strokeStyle = '#8a8478'; c.lineWidth = 2; c.stroke();
      c.strokeStyle = '#8a8478'; c.beginPath(); c.moveTo(70, 188); c.lineTo(84, 162); c.moveTo(130, 188); c.lineTo(116, 162); c.stroke();
      c.strokeStyle = '#9a9aa8'; c.lineWidth = 4; c.beginPath(); c.moveTo(150, 240); c.lineTo(158, 196); c.stroke(); c.fillStyle = '#9a9aa8'; c.beginPath(); c.ellipse(160, 190, 9, 6, -0.3, 0, 7); c.fill();
    } else if (o === 'waistcoat') {
      c.fillStyle = '#2a1a10'; c.fillRect(0, 158, 200, 90);
      c.fillStyle = P.under; c.beginPath(); c.moveTo(78, 158); c.lineTo(100, 200); c.lineTo(122, 158); c.fill();
      c.fillStyle = P.oc; c.beginPath(); c.moveTo(60, 170); c.lineTo(84, 160); c.lineTo(100, 204); c.lineTo(100, 240); c.lineTo(56, 240); c.fill(); c.beginPath(); c.moveTo(140, 170); c.lineTo(116, 160); c.lineTo(100, 204); c.lineTo(100, 240); c.lineTo(144, 240); c.fill();
      c.fillStyle = '#fff6c8'; for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(58 + Math.random() * 84, 170 + Math.random() * 70, 1.1, 0, 7); c.fill(); }
      c.fillStyle = INK; c.beginPath(); c.moveTo(100, 166); c.lineTo(86, 158); c.lineTo(86, 174); c.closePath(); c.moveTo(100, 166); c.lineTo(114, 158); c.lineTo(114, 174); c.closePath(); c.fill();
      c.fillStyle = '#2a1a10'; [190, 206, 222].forEach(y => { c.beginPath(); c.arc(104, y, 2.2, 0, 7); c.fill(); });
    }
    // shading + rim
    c.globalAlpha = 0.35; halftoneIn(c, 0, 158, 100, 240, '#000', 5, 2.6); c.globalAlpha = 1;
    c.restore();
    body(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
    c.save(); body(); c.clip(); c.strokeStyle = P.rim; c.lineWidth = 4; c.beginPath(); c.moveTo(126, 160); c.bezierCurveTo(162, 168, 190, 188, 194, 240); c.stroke(); c.restore();
  }
  function backHair(c, P) {
    c.fillStyle = P.hair;
    if (P.hs === 'long') {
      c.beginPath(); c.moveTo(62, 90); c.bezierCurveTo(56, 40, 144, 40, 138, 90); c.bezierCurveTo(146, 140, 150, 180, 142, 206); c.lineTo(58, 206); c.bezierCurveTo(50, 180, 54, 140, 62, 90); c.fill();
      const g = c.createLinearGradient(0, 170, 0, 210); g.addColorStop(0, 'rgba(255,122,42,0)'); g.addColorStop(1, P.ember); c.fillStyle = g; c.fillRect(50, 168, 100, 40);
    }
    if (P.hs === 'bun') { c.beginPath(); c.arc(100, 46, 18, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 2.5; c.stroke(); }
  }
  function frontHair(c, P) {
    c.fillStyle = P.hair; c.strokeStyle = INK; c.lineWidth = 2.5;
    const hs = P.hs;
    if (hs === 'messy') {
      c.beginPath(); c.moveTo(66, 92); c.bezierCurveTo(60, 52, 90, 40, 104, 44);
      const tufts = [[110, 34], [118, 46], [130, 40], [128, 56], [140, 62], [134, 72]];
      tufts.forEach(([x, y]) => c.lineTo(x, y));
      c.lineTo(134, 88); c.bezierCurveTo(124, 72, 110, 70, 96, 74); c.bezierCurveTo(84, 76, 72, 82, 66, 92); c.closePath(); c.fill(); c.stroke();
    } else if (hs === 'buzz') {
      c.beginPath(); c.moveTo(67, 88); c.bezierCurveTo(66, 52, 134, 52, 133, 88); c.bezierCurveTo(124, 72, 76, 72, 67, 88); c.fill();
      c.fillStyle = shade(P.hair, 0.25); for (let i = 0; i < 70; i++) { c.fillRect(70 + Math.random() * 60, 58 + Math.random() * 20, 1, 1); }
    } else if (hs === 'bun') {
      c.beginPath(); c.moveTo(66, 96); c.bezierCurveTo(60, 50, 140, 50, 134, 96); c.bezierCurveTo(126, 76, 110, 70, 100, 80); c.bezierCurveTo(90, 70, 74, 76, 66, 96); c.fill(); c.stroke();
      c.strokeStyle = P.hair; c.lineWidth = 3; c.beginPath(); c.moveTo(68, 92); c.quadraticCurveTo(62, 112, 68, 128); c.moveTo(132, 92); c.quadraticCurveTo(140, 112, 134, 126); c.stroke();
    } else if (hs === 'slick') {
      c.beginPath(); c.moveTo(66, 94); c.bezierCurveTo(60, 46, 140, 44, 134, 92); c.bezierCurveTo(128, 70, 100, 62, 84, 70); c.quadraticCurveTo(74, 76, 66, 94); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(92, 66); c.quadraticCurveTo(80, 86, 86, 96); c.quadraticCurveTo(90, 80, 100, 70); c.fill();
      c.strokeStyle = shade(P.hair, 0.3); c.lineWidth = 1.5; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(80 + i * 12, 58); c.quadraticCurveTo(100 + i * 8, 52, 128, 70 + i * 3); c.stroke(); }
    } else if (hs === 'long') {
      c.beginPath(); c.moveTo(66, 100); c.bezierCurveTo(60, 50, 140, 50, 134, 100); c.bezierCurveTo(128, 80, 112, 70, 102, 66); c.quadraticCurveTo(84, 78, 70, 112); c.closePath(); c.fill(); c.stroke();
    } else if (hs === 'sidepart') {
      c.beginPath(); c.moveTo(67, 92); c.bezierCurveTo(64, 50, 136, 50, 133, 90); c.bezierCurveTo(124, 74, 96, 70, 84, 72); c.lineTo(80, 66); c.quadraticCurveTo(70, 76, 67, 92); c.fill(); c.stroke();
      c.strokeStyle = '#9a96a8'; c.lineWidth = 2; c.beginPath(); c.moveTo(84, 60); c.quadraticCurveTo(110, 54, 128, 70); c.stroke();
    } else if (hs === 'hat') {
      c.beginPath(); c.moveTo(68, 98); c.bezierCurveTo(66, 70, 134, 70, 132, 98); c.lineTo(132, 90); c.bezierCurveTo(130, 76, 70, 76, 68, 90); c.fill();
      // hat
      c.fillStyle = '#2a1430'; c.beginPath(); c.ellipse(100, 70, 66, 14, -0.08, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(70, 70); c.bezierCurveTo(72, 30, 128, 30, 130, 68); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#d8b04a'; c.fillRect(71, 60, 58, 6);
      c.fillStyle = '#ff6fae'; c.beginPath(); c.moveTo(124, 60); c.bezierCurveTo(150, 30, 176, 26, 184, 16); c.bezierCurveTo(176, 40, 152, 56, 128, 64); c.fill();
      c.strokeStyle = '#ffb8d8'; c.lineWidth = 1; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(130 + i * 6, 56 - i * 4); c.lineTo(140 + i * 6, 52 - i * 5); c.stroke(); }
    } else if (hs === 'chef') {
      c.beginPath(); c.moveTo(67, 92); c.bezierCurveTo(66, 70, 134, 70, 133, 92); c.lineTo(133, 86); c.bezierCurveTo(124, 78, 76, 78, 67, 86); c.fill();
      c.fillStyle = '#f6f2ea'; c.fillRect(70, 62, 60, 18); c.strokeRect(70, 62, 60, 18);
      c.beginPath(); c.arc(80, 52, 15, 0, 7); c.arc(100, 44, 18, 0, 7); c.arc(120, 52, 15, 0, 7); c.fill();
      c.beginPath(); c.arc(80, 52, 15, Math.PI * 0.75, Math.PI * 1.75); c.stroke(); c.beginPath(); c.arc(100, 44, 18, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); c.beginPath(); c.arc(120, 52, 15, Math.PI * 1.25, Math.PI * 2.25); c.stroke();
    } else if (hs === 'visor') {
      c.beginPath(); c.moveTo(67, 94); c.bezierCurveTo(64, 54, 136, 54, 133, 94); c.bezierCurveTo(120, 80, 80, 80, 67, 94); c.fill(); c.stroke();
      c.fillStyle = 'rgba(40,160,80,.85)'; c.beginPath(); c.moveTo(60, 80); c.quadraticCurveTo(100, 62, 140, 80); c.lineTo(150, 92); c.quadraticCurveTo(100, 76, 50, 92); c.closePath(); c.fill(); c.strokeStyle = INK; c.stroke();
      c.fillStyle = '#1a3a1a'; c.fillRect(64, 78, 72, 3);
    }
  }
  function face(c, P) {
    // ears
    c.fillStyle = P.skin; c.strokeStyle = INK; c.lineWidth = 2.5;
    [[66, 104], [134, 104]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x, y, 6, 10, 0, 0, 7); c.fill(); c.stroke(); });
    if (P.earring) { c.strokeStyle = '#ffd06a'; c.lineWidth = 2; c.beginPath(); c.arc(134, 116, 4, 0, 7); c.stroke(); }
    headPath(c, P.jaw); c.fillStyle = P.skin; c.fill();
    c.save(); headPath(c, P.jaw); c.clip();
    const sh = c.createLinearGradient(62, 0, 104, 0); sh.addColorStop(0, 'rgba(80,30,10,.28)'); sh.addColorStop(1, 'rgba(80,30,10,0)'); c.fillStyle = sh; c.fillRect(60, 60, 50, 100);
    c.globalAlpha = 0.16; halftoneIn(c, 62, 76, 92, 150, '#3a1408', 4, 1.4); c.globalAlpha = 1;
    if (P.stubble) { c.fillStyle = 'rgba(60,40,30,.35)'; for (let i = 0; i < 160; i++) { const x = 72 + Math.random() * 56, y = 120 + Math.random() * 26; c.fillRect(x, y, 1.2, 1.2); } }
    if (P.freckles) { c.fillStyle = 'rgba(160,80,40,.6)'; for (let i = 0; i < 14; i++) { const s = i % 2 ? 1 : -1; c.beginPath(); c.arc(100 + s * (12 + Math.random() * 10), 110 + Math.random() * 8, 0.9, 0, 7); c.fill(); } }
    if (P.burns) { c.fillStyle = 'rgba(200,70,80,.32)'; [[74, 118, 9], [80, 132, 7], [70, 106, 6], [86, 142, 6]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }); }
    c.globalAlpha = 0.55; c.strokeStyle = P.rim; c.lineWidth = 3; c.beginPath(); c.moveTo(134, 94); c.bezierCurveTo(135, 120, 122, 140, 106, 146); c.stroke(); c.globalAlpha = 1;
    c.restore();
    headPath(c, P.jaw); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
    // eyes
    const ey = 102;
    [-1, 1].forEach(s => {
      const x = 100 + s * 13;
      c.fillStyle = '#fbf6ec'; c.beginPath(); c.ellipse(x, ey, 7, P.eyes === 'wide' ? 4.6 : 3.6, 0, 0, 7); c.fill();
      if (P.eyes === 'glow') { const g = c.createRadialGradient(x, ey, 0, x, ey, 9); g.addColorStop(0, 'rgba(255,170,80,.9)'); g.addColorStop(1, 'rgba(255,120,40,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, ey, 9, 0, 7); c.fill(); }
      c.fillStyle = P.iris; c.beginPath(); c.arc(x + s * 0.5, ey, 3, 0, 7); c.fill();
      c.fillStyle = INK; c.beginPath(); c.arc(x + s * 0.5, ey, 1.4, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(x + 1.2, ey - 1.2, 0.9, 0, 7); c.fill();
      c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.ellipse(x, ey, 7, P.eyes === 'wide' ? 4.6 : 3.6, 0, Math.PI, 0); c.stroke();
      if (P.eyes === 'lidded') { c.fillStyle = shade(P.skin, -0.12); c.beginPath(); c.ellipse(x, ey - 1, 7.4, 3.2, 0, Math.PI, 0); c.fill(); c.strokeStyle = INK; c.beginPath(); c.moveTo(x - 7, ey - 0.5); c.lineTo(x + 7, ey - 0.5); c.stroke(); }
    });
    // brows
    c.strokeStyle = P.robot ? '#000' : shade(P.hair, -0.1); c.lineWidth = 4; c.lineCap = 'round';
    const br = { cocky: [[-20, 92, -7, 90], [7, 88, 20, 92]], stern: [[-20, 90, -6, 95], [6, 95, 20, 90]], up: [[-20, 92, -7, 89], [7, 89, 20, 92]], flat: [[-20, 93, -7, 93], [7, 93, 20, 93]] }[P.brows];
    br.forEach(([x0, y0, x1, y1]) => { c.beginPath(); c.moveTo(100 + x0, y0); c.lineTo(100 + x1, y1); c.stroke(); });
    c.lineCap = 'butt';
    // nose
    c.strokeStyle = shade(P.skin, -0.45); c.lineWidth = 2; c.beginPath(); c.moveTo(101, 104); c.lineTo(97, 117); c.quadraticCurveTo(101, 120, 105, 117); c.stroke();
    if (P.cheekScar) { c.strokeStyle = '#a85a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(118, 110); c.lineTo(126, 124); c.stroke(); c.lineWidth = 1; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(118 + i * 3, 115 + i * 4); c.lineTo(124 + i * 3, 113 + i * 4); c.stroke(); } }
    // facial hair
    if (P.stache === 'pencil') { c.strokeStyle = P.hair; c.lineWidth = 2; c.beginPath(); c.moveTo(91, 124); c.quadraticCurveTo(100, 121, 109, 124); c.stroke(); }
    if (P.stache === 'walrus') { c.fillStyle = P.hair; c.beginPath(); c.moveTo(86, 128); c.quadraticCurveTo(92, 116, 100, 121); c.quadraticCurveTo(108, 116, 114, 128); c.quadraticCurveTo(108, 126, 100, 127); c.quadraticCurveTo(92, 126, 86, 128); c.fill(); c.strokeStyle = INK; c.lineWidth = 1.5; c.stroke(); }
    if (P.stache === 'goatee') { c.fillStyle = P.hair; c.beginPath(); c.moveTo(88, 125); c.quadraticCurveTo(100, 119, 112, 125); c.lineTo(110, 128); c.quadraticCurveTo(100, 124, 90, 128); c.fill(); c.beginPath(); c.moveTo(94, 136); c.quadraticCurveTo(100, 140, 106, 136); c.lineTo(102, 150); c.lineTo(98, 150); c.fill(); }
    // mouth
    c.strokeStyle = INK; c.lineWidth = 2.5; c.fillStyle = '#fbf6ec';
    const m = P.mouth;
    if (m === 'grin') { c.beginPath(); c.moveTo(88, 128); c.quadraticCurveTo(102, 140, 116, 126); c.quadraticCurveTo(102, 133, 88, 128); c.fill(); c.stroke(); }
    if (m === 'bigGrin') { c.beginPath(); c.moveTo(84, 126); c.quadraticCurveTo(100, 146, 116, 126); c.closePath(); c.fill(); c.stroke(); c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(90 + i * 5, 127); c.lineTo(90 + i * 5, 133); c.stroke(); } }
    if (m === 'smile') { c.beginPath(); c.moveTo(90, 128); c.quadraticCurveTo(100, 136, 110, 128); c.stroke(); }
    if (m === 'smirk') { c.beginPath(); c.moveTo(90, 130); c.quadraticCurveTo(102, 132, 112, 125); c.stroke(); }
    if (m === 'flat') { c.beginPath(); c.moveTo(91, 130); c.lineTo(109, 130); c.stroke(); }
    if (m === 'thin') { c.beginPath(); c.moveTo(92, 130); c.quadraticCurveTo(100, 132, 108, 129); c.stroke(); }
    // accessories
    if (P.goggles) {
      c.strokeStyle = '#3a2a1a'; c.lineWidth = 5; c.beginPath(); c.moveTo(66, 78); c.quadraticCurveTo(100, 66, 134, 78); c.stroke();
      [[86, 72], [114, 72]].forEach(([x, y]) => { c.fillStyle = '#8a6a3a'; c.beginPath(); c.arc(x, y, 11, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 2.5; c.stroke(); c.fillStyle = 'rgba(120,230,220,.75)'; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x - 2, y - 2, 2, 0, 7); c.fill(); });
    }
    if (P.monocle) { c.strokeStyle = '#d8b04a'; c.lineWidth = 2.5; c.beginPath(); c.arc(113, 102, 9, 0, 7); c.stroke(); c.fillStyle = 'rgba(220,230,255,.25)'; c.fill(); c.lineWidth = 1; c.beginPath(); c.moveTo(121, 106); c.quadraticCurveTo(130, 140, 140, 176); c.stroke(); }
  }
  function robot(c, P) {
    // neck segments
    c.fillStyle = '#4a3e6a'; c.strokeStyle = INK; c.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) { c.beginPath(); c.rect(86 - i, 134 + i * 9, 28 + i * 2, 8); c.fill(); c.stroke(); }
    // chassis
    const body = () => { c.beginPath(); c.moveTo(6, 240); c.bezierCurveTo(10, 190, 44, 166, 80, 160); c.lineTo(120, 160); c.bezierCurveTo(156, 166, 190, 190, 194, 240); c.closePath(); };
    body(); c.fillStyle = P.oc; c.fill(); c.save(); body(); c.clip();
    c.fillStyle = shade(P.oc, -0.25); c.fillRect(70, 160, 60, 90);
    c.strokeStyle = shade(P.oc, 0.3); c.lineWidth = 2; [[30, 196, 60, 178], [170, 196, 140, 178]].forEach(([a, b, cc, d]) => { c.beginPath(); c.moveTo(a, b); c.lineTo(cc, d); c.stroke(); });
    const g = c.createRadialGradient(100, 200, 0, 100, 200, 22); g.addColorStop(0, '#fff'); g.addColorStop(0.3, P.glow); g.addColorStop(1, 'rgba(180,140,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(100, 200, 22, 0, 7); c.fill();
    c.fillStyle = '#e8e0ff'; c.font = 'bold 9px sans-serif'; c.fillText('C.A.T.', 132, 222);
    c.globalAlpha = 0.3; halftoneIn(c, 0, 160, 100, 240, '#000', 5, 2.6); c.globalAlpha = 1;
    c.restore(); body(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
    c.save(); body(); c.clip(); c.strokeStyle = P.rim; c.lineWidth = 4; c.beginPath(); c.moveTo(126, 162); c.bezierCurveTo(162, 170, 190, 190, 194, 240); c.stroke(); c.restore();
    // head fins
    [[-1], [1]].forEach(([s]) => { c.fillStyle = shade(P.oc, -0.1); c.beginPath(); c.moveTo(100 + s * 30, 84); c.lineTo(100 + s * 46, 66); c.lineTo(100 + s * 40, 100); c.closePath(); c.fill(); c.strokeStyle = INK; c.lineWidth = 2.5; c.stroke(); });
    // head
    const head = () => { c.beginPath(); c.moveTo(68, 96); c.bezierCurveTo(66, 48, 134, 48, 132, 96); c.bezierCurveTo(132, 120, 122, 136, 100, 138); c.bezierCurveTo(78, 136, 68, 120, 68, 96); c.closePath(); };
    head(); const hg = c.createLinearGradient(68, 50, 132, 138); hg.addColorStop(0, '#d8d0f0'); hg.addColorStop(0.5, '#9a8ac8'); hg.addColorStop(1, '#4a3e6a'); c.fillStyle = hg; c.fill();
    c.save(); head(); c.clip(); c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(86, 70, 10, 16, -0.4, 0, 7); c.fill();
    c.strokeStyle = P.rim; c.lineWidth = 4; c.beginPath(); c.moveTo(132, 90); c.bezierCurveTo(132, 120, 120, 134, 104, 138); c.stroke(); c.restore();
    head(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
    // visor
    c.fillStyle = '#120a24'; c.beginPath(); c.moveTo(74, 94); c.quadraticCurveTo(100, 86, 126, 94); c.lineTo(124, 108); c.quadraticCurveTo(100, 102, 76, 108); c.closePath(); c.fill(); c.stroke();
    [[-1], [1]].forEach(([s]) => { const x = 100 + s * 12, y = 99; const gg = c.createRadialGradient(x, y, 0, x, y, 12); gg.addColorStop(0, '#fff'); gg.addColorStop(0.35, P.glow); gg.addColorStop(1, 'rgba(180,140,255,0)'); c.fillStyle = gg; c.beginPath(); c.arc(x, y, 12, 0, 7); c.fill(); });
    c.strokeStyle = '#2a2244'; c.lineWidth = 1.5; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(92 + i * 5, 122); c.lineTo(92 + i * 5, 130); c.stroke(); }
  }
  function frame(c, P) {
    c.strokeStyle = P.rim; c.lineWidth = 4; c.beginPath(); c.arc(100, 120, 96, 0, 7); c.stroke();
    c.strokeStyle = '#000'; c.lineWidth = 2; c.beginPath(); c.arc(100, 120, 99, 0, 7); c.stroke();
  }
  function paint(canvas, id, opts) {
    opts = opts || {};
    const P = PORTRAITS[id]; if (!P) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = canvas.clientWidth || 100, h = canvas.clientHeight || 120;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const c = canvas.getContext('2d'); c.setTransform(dpr * w / 200, 0, 0, dpr * h / 240, 0, 0);
    const seed = id.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0); let s = seed; const rr = Math.random; Math.random = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    try {
      if (opts.round !== false) { background(c, P); c.save(); c.beginPath(); c.arc(100, 120, 98, 0, 7); c.clip(); }
      if (P.robot) robot(c, P);
      else { backHair(c, P); torso(c, P); face(c, P); frontHair(c, P); }
      if (opts.round !== false) { c.restore(); frame(c, P); }
    } finally { Math.random = rr; }
  }
  function paintGeneric(canvas, name, col) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = canvas.clientWidth || 100, h = canvas.clientHeight || 120;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const c = canvas.getContext('2d'); c.setTransform(dpr * w / 200, 0, 0, dpr * h / 240, 0, 0);
    const P = { bg: '#120e1c', rim: col };
    const fig = () => { c.beginPath(); c.moveTo(4, 240); c.bezierCurveTo(8, 186, 40, 166, 80, 158); c.lineTo(86, 136); c.bezierCurveTo(60, 120, 62, 54, 100, 52); c.bezierCurveTo(138, 54, 140, 120, 114, 136); c.lineTo(120, 158); c.bezierCurveTo(160, 166, 192, 186, 196, 240); c.closePath(); };
    fig(); c.fillStyle = '#0d0a14'; c.fill();
    c.save(); fig(); c.clip();
    c.strokeStyle = col; c.lineWidth = 5; c.globalAlpha = 0.85; c.beginPath(); c.moveTo(126, 72); c.bezierCurveTo(140, 100, 132, 128, 114, 138); c.moveTo(122, 160); c.bezierCurveTo(160, 168, 190, 188, 194, 240); c.stroke(); c.globalAlpha = 1;
    c.globalAlpha = 0.25; halftoneIn(c, 0, 50, 200, 240, col, 5, 1.6); c.globalAlpha = 1;
    c.restore();
    fig(); c.strokeStyle = '#000'; c.lineWidth = 3; c.stroke();
    [[-1], [1]].forEach(([sx]) => { const x = 100 + sx * 12, y = 100; const g = c.createRadialGradient(x, y, 0, x, y, 7); g.addColorStop(0, '#fff'); g.addColorStop(0.4, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); });
  }
  return { paint, paintGeneric };
})();

/* ---------- speaker bust over the scene art ---------- */
const NPC_PORTRAIT = { 'Cecil Buckner': 'buckner', 'Drayden Sparrow': 'sparrow', 'The Croupier': 'croupier' };
const FACTION_COL = [
  [/New Sun|Thug|Ayers|Scrapjaw|Envoy|Factor|Weighmaster|Dealer/i, '#e3b23c'], [/Rebel|Quartermaster|Scout/i, '#e0503d'],
  [/Eclipse|Recruiter \(Eclipse\)/i, '#a87dff'], [/LSF|Ortega|Recruiter/i, '#a8b85a'], [/Cleans|Acolyte|Deacon|Medina|Pyre|Halo|Pilgrim/i, '#ff7a3d'],
  [/Thorn|Fields|Squad|Dean/i, '#5fa0ff'], [/Boyle|Hull|Tormented/i, '#d9783d'], [/Unseen|Hierarch|Hands/i, '#8f6fff'], [/Valence/i, '#9bf0d0'],
  [/Whithall|O’Connor/i, '#e9d27a'], [/Aellona|Huntress/i, '#d8b26a'], [/Roth/i, '#d8c8ff'], [/Commodore|Phantom/i, '#c8c8d8'], [/Aldridge|Commissioner/i, '#3fd0c9'],
  [/Omu-Sala|Noor|Kell|Ilse|Vash|Tamsin/i, '#9fd46a']
];
let SPK = { key: null };
function speakerOf(key) {
  if (PORTRAITS[key]) return { id: key };
  if (key.startsWith('N:')) { const n = key.slice(2); if (NPC_PORTRAIT[n]) return { id: NPC_PORTRAIT[n] }; const f = FACTION_COL.find(([re]) => re.test(n)); return { generic: true, name: n, col: f ? f[1] : '#c8442e' }; }
  return null;
}
function showSpeaker(key, sp) {
  const wrap = document.getElementById('speaker'); if (!wrap) return;
  const art = document.querySelector('.artwrap');
  if (SPK.key === key) { wrap.classList.remove('dim'); return; }
  const who = speakerOf(key); if (!who) { hideSpeaker(); return; }
  SPK.key = key;
  wrap.classList.remove('on', 'dim'); void wrap.offsetWidth;
  document.getElementById('spkName').textContent = sp.n;
  wrap.style.setProperty('--sc', who.generic ? who.col : (PORTRAITS[who.id] && PORTRAITS[who.id].rim) || sp.c);
  wrap.classList.add('on'); art.classList.add('speaking');
  const cv = document.getElementById('spkCv');
  requestAnimationFrame(() => { if (who.generic) PORTRAIT_ART.paintGeneric(cv, who.name, who.col); else PORTRAIT_ART.paint(cv, who.id, { round: false }); });
}
function dimSpeaker() { const w = document.getElementById('speaker'); if (w && SPK.key) w.classList.add('dim'); }
function hideSpeaker() {
  SPK.key = null;
  const w = document.getElementById('speaker'); if (w) w.classList.remove('on', 'dim');
  const art = document.querySelector('.artwrap'); if (art) art.classList.remove('speaking');
}

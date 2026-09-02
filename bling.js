/* ============================================================
   ✨ NĀHELE BLING PACK ✨
   Floating gold sparkles + cursor sparkle trail + progress bar.
   To un-bling the site: delete the <link> and <script> lines
   that load bling.css / bling.js. Nothing else is affected.
   ------------------------------------------------------------
   TURN-IT-DOWN KNOBS:
   ============================================================ */
(function(){
'use strict';
var SPARKLE_COUNT = 70;    // floating sparkles on screen (try 30 for subtle)
var CURSOR_TRAIL  = true;  // false = no sparkles following the mouse
var SCROLL_BAR    = true;  // false = remove the gold scroll-progress bar

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine = window.matchMedia('(pointer: fine)').matches;
if (window.innerWidth < 700) SPARKLE_COUNT = Math.round(SPARKLE_COUNT * 0.6);

/* ---------- gold scroll-progress bar ---------- */
if (SCROLL_BAR){
  var bar = document.createElement('div');
  bar.id = 'bling-progress';
  document.body.appendChild(bar);
  var setBar = function(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', setBar, {passive:true});
  window.addEventListener('resize', setBar);
  setBar();
}

/* ---------- sparkle canvas (drifting gold dust + cursor trail) ---------- */
if (!reduceMotion){
  var canvas = document.createElement('canvas');
  canvas.id = 'bling-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2), W, H;
  var resize = function(){
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  var GOLD = '#e8c56a', CREAM = '#fff6da';
  var sparkles = [], trail = [], i;
  for (i = 0; i < SPARKLE_COUNT; i++){
    sparkles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(0.08 + Math.random() * 0.25),
      phase: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.03,
      col: Math.random() < 0.8 ? GOLD : CREAM
    });
  }
  function star(x, y, r, rot, alpha, col){
    ctx.globalAlpha = alpha;
    ctx.fillStyle = col;
    ctx.beginPath();
    for (var p = 0; p < 4; p++){
      var a = rot + p * Math.PI / 2, b = a + Math.PI / 4;
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      ctx.lineTo(x + Math.cos(b) * r * 0.28, y + Math.sin(b) * r * 0.28);
    }
    ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  }
  function tick(){
    ctx.clearRect(0, 0, W, H);
    var s, p, tw, a;
    for (var i2 = 0; i2 < sparkles.length; i2++){
      s = sparkles[i2];
      s.x += s.vx; s.y += s.vy; s.phase += s.speed;
      if (s.y < -8){ s.y = H + 8; s.x = Math.random() * W; }
      if (s.x < -8) s.x = W + 8; else if (s.x > W + 8) s.x = -8;
      tw = 0.5 + 0.5 * Math.sin(s.phase);
      a = tw * 0.75;
      if (a > 0.03) star(s.x, s.y, s.size * (0.6 + tw * 0.7), s.phase, a, s.col);
    }
    for (var j = trail.length - 1; j >= 0; j--){
      p = trail[j];
      p.life -= 0.028; p.phase += 0.18;
      if (p.life <= 0){ trail.splice(j, 1); continue; }
      star(p.x, p.y, p.size * p.life, p.phase, p.life * 0.9, p.col);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ---------- cursor trail (desktop / fine pointer only) ---------- */
  if (CURSOR_TRAIL && fine){
    var lastX = -99, lastY = -99, lastT = 0;
    window.addEventListener('mousemove', function(e){
      var now = performance.now();
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (now - lastT < 28 || dx * dx + dy * dy < 90) return;
      lastT = now; lastX = e.clientX; lastY = e.clientY;
      if (trail.length > 60) trail.shift();
      trail.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        size: 2.2 + Math.random() * 2.8,
        life: 1,
        phase: Math.random() * 6.28,
        col: Math.random() < 0.7 ? GOLD : CREAM
      });
    }, {passive:true});
  }
}
})();

/*
 * ZEUSMESS sound engine.
 * Every sound is synthesized live with Web Audio: no files, no loading.
 * Each section has its own sound on arrival and its own quiet ambience.
 */
(function () {
  "use strict";

  var ctx = null, master, sfxBus, ambBus, comp, analyser, white = null, brown = null;
  var on = { sfx: true, amb: true };
  var ducked = false;
  var amb = { want: null, name: null, gain: null, stops: [] };
  var freq = null;

  function N(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function ensure() {
    if (ctx) { if (ctx.state === "suspended" && !document.hidden) ctx.resume(); return ctx; }
    var A = window.AudioContext || window.webkitAudioContext;
    if (!A) return null;
    try { ctx = new A(); } catch (e) { return null; }
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = .003; comp.release.value = .25;
    master = ctx.createGain(); master.gain.value = .9;
    analyser = ctx.createAnalyser(); analyser.fftSize = 64; analyser.smoothingTimeConstant = .78;
    freq = new Uint8Array(analyser.frequencyBinCount);
    sfxBus = ctx.createGain(); sfxBus.gain.value = .85;
    ambBus = ctx.createGain(); ambBus.gain.value = on.amb ? .6 : 0;
    sfxBus.connect(master); ambBus.connect(master);
    master.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination);
    white = noiseBuffer(false); brown = noiseBuffer(true);
    return ctx;
  }

  function noiseBuffer(isBrown) {
    var len = ctx.sampleRate * 2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (isBrown) { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    return b;
  }

  function out(node, o, t0, d) {
    var dest = o.out || sfxBus;
    if (o.pan != null && ctx.createStereoPanner) {
      var p = ctx.createStereoPanner();
      p.pan.setValueAtTime(o.pan, t0);
      if (o.pan2 != null) p.pan.linearRampToValueAtTime(o.pan2, t0 + d);
      node.connect(p); p.connect(dest);
    } else node.connect(dest);
  }
  function env(g, t0, a, d, v) {
    g.gain.setValueAtTime(.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(.0002, v), t0 + a);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
  }

  /* A plain oscillator note, optionally through a sweeping low-pass. */
  function tone(o) {
    var t0 = ctx.currentTime + (o.t || 0), d = o.d || .1, a = o.a || .004;
    var osc = ctx.createOscillator(), g = ctx.createGain(), head = osc;
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(o.f, t0);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t0 + d);
    if (o.detune) osc.detune.value = o.detune;
    if (o.lp) {
      var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = o.q || .8;
      f.frequency.setValueAtTime(o.lp, t0);
      if (o.lp2) f.frequency.exponentialRampToValueAtTime(o.lp2, t0 + d);
      osc.connect(f); head = f;
    }
    head.connect(g); env(g, t0, a, d, o.v || .1); out(g, o, t0, d);
    osc.start(t0); osc.stop(t0 + d + .05);
  }

  /* Filtered noise burst: steam, air, whooshes. */
  function noise(o) {
    var t0 = ctx.currentTime + (o.t || 0), d = o.d || .2;
    var src = ctx.createBufferSource(); src.buffer = o.brown ? brown : white; src.loop = true;
    var f = ctx.createBiquadFilter(); f.type = o.ft || "bandpass"; f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.f || 1000, t0);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t0 + d);
    var g = ctx.createGain();
    src.connect(f); f.connect(g); env(g, t0, o.a || .02, d, o.v || .1); out(g, o, t0, d);
    src.start(t0, Math.random() * 1.5); src.stop(t0 + d + .05);
  }

  /* FM bell: glass taps and ceramic cups. */
  function bell(o) {
    var t0 = ctx.currentTime + (o.t || 0), d = o.d || .6;
    var car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    car.frequency.value = o.f; mod.frequency.value = o.f * (o.ratio || 1.41);
    mg.gain.setValueAtTime(o.f * (o.index || 2), t0);
    mg.gain.exponentialRampToValueAtTime(Math.max(1, o.f * .02), t0 + d);
    mod.connect(mg); mg.connect(car.frequency); car.connect(g);
    env(g, t0, .003, d, o.v || .08); out(g, o, t0, d);
    car.start(t0); mod.start(t0); car.stop(t0 + d + .05); mod.stop(t0 + d + .05);
  }

  function buzz(t, d, v) {
    tone({ f: 100, t: t, d: d, v: v, type: "sawtooth", a: .003, lp: 1800 });
    tone({ f: 200.6, t: t, d: d, v: v * .45, type: "square", a: .003, lp: 2400 });
  }

  /* ---------- One-shot effects ---------- */
  var FX = {
    hover: function () { tone({ f: 2700, d: .028, v: .01 }); },
    tap: function () { bell({ f: 1900, d: .16, v: .045, ratio: 2.76, index: 1.1 }); noise({ ft: "highpass", f: 6500, d: .025, v: .025, a: .002 }); },
    on: function () { bell({ f: 1320, d: .2, v: .05, ratio: 2, index: 1 }); bell({ f: 1980, t: .06, d: .26, v: .05, ratio: 2, index: 1 }); },
    off: function () { bell({ f: 1980, d: .18, v: .045, ratio: 2, index: 1 }); bell({ f: 1320, t: .06, d: .22, v: .04, ratio: 2, index: 1 }); },
    whoosh: function (dir) {
      var up = dir >= 0;
      noise({ ft: "bandpass", f: up ? 380 : 2600, f2: up ? 2800 : 360, q: .9, d: .42, v: .14, a: .14, pan: up ? -.5 : .5, pan2: up ? .5 : -.5 });
      tone({ f: up ? 170 : 250, f2: up ? 250 : 150, d: .34, v: .03 });
    },
    step: function () { tone({ f: 880, d: .05, v: .04, type: "square" }); tone({ f: 1175, t: .05, d: .07, v: .035, type: "square" }); },
    edge: function () { tone({ f: 220, f2: 160, d: .12, v: .05, type: "square", lp: 900 }); },
    open: function () {
      noise({ ft: "lowpass", f: 500, f2: 3200, d: .32, v: .09, a: .08 });
      [N(72), N(76), N(79), N(84)].forEach(function (f, i) { bell({ f: f, t: .05 + i * .045, d: .4, v: .03, ratio: 3, index: .8 }); });
    },
    close: function () {
      noise({ ft: "lowpass", f: 3200, f2: 450, d: .28, v: .07, a: .02 });
      [N(84), N(79), N(72)].forEach(function (f, i) { bell({ f: f, t: i * .045, d: .3, v: .028, ratio: 3, index: .8 }); });
    },
    copy: function () { [N(84), N(91)].forEach(function (f, i) { bell({ f: f, t: i * .07, d: .3, v: .04, ratio: 3.5, index: 1 }); }); },
    unlock: function () {
      noise({ ft: "bandpass", f: 300, f2: 4200, q: .7, d: .75, v: .13, a: .32 });
      [N(72), N(76), N(79), N(83), N(88)].forEach(function (f, i) { bell({ f: f, t: .2 + i * .07, d: 1.2, v: .045, ratio: 3.5, index: 1.3, pan: -.6 + i * .3 }); });
      [N(60), N(64), N(67), N(72)].forEach(function (f, i) { tone({ f: f, t: .22 + i * .07, d: .12, v: .022, type: "square" }); });
      tone({ f: N(48), t: .15, d: 1.5, v: .06, type: "triangle", a: .25 });
    }
  };

  /* ---------- Arriving in a section ---------- */
  var ENTER = {
    home: function () {
      [N(60), N(67), N(71), N(76)].forEach(function (f, i) { tone({ f: f, t: i * .06, d: 1, v: .03, type: "triangle", a: .05 }); });
      [N(84), N(88), N(91)].forEach(function (f, i) { tone({ f: f, t: .28 + i * .06, d: .08, v: .018, type: "square" }); });
    },
    services: function () {
      [N(79), N(83), N(86), N(91), N(95)].forEach(function (f, i) { bell({ f: f, t: i * .05, d: .32, v: .032, ratio: 2.76, index: 1, pan: -.6 + i * .3 }); });
    },
    starbucks: function () {
      // steam wand hiss, then a ceramic cup set on its saucer
      noise({ ft: "highpass", f: 2800, d: .8, v: .06, a: .07 });
      noise({ ft: "bandpass", f: 5200, f2: 4300, q: 3, d: .65, v: .045, a: .1 });
      bell({ f: 2350, t: .6, d: .55, v: .065, ratio: 1.41, index: 2.2 });
      bell({ f: 3120, t: .61, d: .38, v: .035, ratio: 1.73, index: 1.5 });
      tone({ f: 190, t: .6, d: .07, v: .05 });
    },
    work: function () {
      // a neon tube flickers on, then an analog swell
      [[0, .04], [.07, .03], [.13, .05], [.26, .55]].forEach(function (p) { buzz(p[0], p[1], .035); });
      [N(45), N(52), N(57), N(60)].forEach(function (f, i) { tone({ f: f, t: .3, d: 1.2, v: .022, type: "sawtooth", a: .35, lp: 260, lp2: 2600, detune: (i - 1.5) * 7 }); });
    },
    about: function () {
      [N(67), N(72), N(76), N(79)].forEach(function (f, i) { tone({ f: f, t: i * .08, d: .1, v: .035, type: "square" }); });
      bell({ f: N(91), t: .34, d: .7, v: .035, ratio: 3, index: 1 });
    },
    contact: function () {
      // arcade coin, then a short CONTINUE? jingle
      tone({ f: 988, d: .08, v: .045, type: "square" });
      tone({ f: 1319, t: .08, d: .45, v: .045, type: "square" });
      [N(72), N(76), N(79), N(84), N(79), N(84)].forEach(function (f, i) { tone({ f: f, t: .62 + i * .09, d: .1, v: .028, type: "square" }); });
    }
  };

  /* ---------- Moving between projects ---------- */
  var SLIDE = {
    starbucks: function (i) {
      bell({ f: 2100 * Math.pow(2, ((i % 5) - 2) / 12), d: .45, v: .055, ratio: 1.41, index: 2 });
      noise({ ft: "bandpass", f: 1800, f2: 900, d: .16, v: .035 });
    },
    "default": function (i) {
      tone({ f: 1400, f2: 320, d: .22, v: .045, type: "sawtooth", lp: 2600, lp2: 400 });
      tone({ f: N(64 + (i % 4) * 3), t: .03, d: .14, v: .026, type: "square" });
    }
  };

  /* ---------- Ambience ---------- */
  function loopNoise(dest, o) {
    var src = ctx.createBufferSource(); src.buffer = o.brown ? brown : white; src.loop = true;
    var f = ctx.createBiquadFilter(); f.type = o.ft || "lowpass"; f.frequency.value = o.f; f.Q.value = o.q || .7;
    var g = ctx.createGain(); g.gain.value = o.v;
    src.connect(f); f.connect(g); g.connect(dest);
    var lfo = null;
    if (o.lfo) {
      lfo = ctx.createOscillator(); lfo.frequency.value = o.lfo;
      var lg = ctx.createGain(); lg.gain.value = o.v * (o.depth || .5);
      lfo.connect(lg); lg.connect(g.gain); lfo.start();
    }
    src.start(0, Math.random() * 1.5);
    return function () { try { src.stop(); if (lfo) lfo.stop(); } catch (e) {} };
  }
  function pad(dest, notes, o) {
    var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = o.lp || 700; f.Q.value = .6;
    var g = ctx.createGain(); g.gain.value = o.v || .02;
    f.connect(g); g.connect(dest);
    var lfo = ctx.createOscillator(); lfo.frequency.value = o.rate || .06;
    var lg = ctx.createGain(); lg.gain.value = (o.lp || 700) * .45;
    lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    var oscs = [];
    notes.forEach(function (m, i) {
      [-6, 6].forEach(function (dt) {
        var osc = ctx.createOscillator(); osc.type = o.type || "triangle";
        osc.frequency.value = N(m); osc.detune.value = dt + i;
        osc.connect(f); osc.start(); oscs.push(osc);
      });
    });
    return function () { oscs.concat([lfo]).forEach(function (x) { try { x.stop(); } catch (e) {} }); };
  }
  function every(min, max, fn) {
    var alive = true, id = 0;
    (function next() { id = setTimeout(function () { if (!alive) return; if (!document.hidden) fn(); next(); }, rnd(min, max)); })();
    return function () { alive = false; clearTimeout(id); };
  }

  var AMB = {
    home: function (d) { return [pad(d, [48, 55, 59, 64], { lp: 900, v: .016 })]; },
    services: function (d) { return [pad(d, [41, 48, 52, 57, 60], { lp: 800, v: .014, rate: .05 })]; },
    about: function (d) { return [pad(d, [45, 52, 55, 60], { lp: 850, v: .015, rate: .07 })]; },
    contact: function (d) {
      return [pad(d, [43, 50, 52, 59], { lp: 900, v: .014 }),
        every(2600, 5200, function () { tone({ f: N([79, 83, 86, 91][Math.floor(Math.random() * 4)]), d: .09, v: .01, type: "square", out: d, pan: rnd(-.7, .7) }); })];
    },
    starbucks: function (d) {
      // a café: room tone, murmuring voices, cups, a far espresso machine
      return [
        loopNoise(d, { brown: true, f: 420, v: .3 }),
        loopNoise(d, { ft: "bandpass", f: 520, q: .6, v: .05, lfo: .23, depth: .8 }),
        loopNoise(d, { ft: "bandpass", f: 950, q: .8, v: .025, lfo: .17, depth: .9 }),
        every(1200, 4200, function () { bell({ f: rnd(2300, 3700), d: rnd(.25, .5), v: rnd(.008, .02), ratio: 1.41, index: 2, out: d, pan: rnd(-.8, .8) }); }),
        every(9000, 16000, function () { noise({ ft: "highpass", f: 3000, d: 1.5, v: .01, a: .35, out: d, pan: rnd(-.5, .5) }); })
      ];
    },
    "default": function (d) {
      // a neon street at night: rain, a buzzing sign, a low synth drone
      return [
        loopNoise(d, { ft: "highpass", f: 1100, v: .045 }),
        loopNoise(d, { brown: true, f: 300, v: .12 }),
        pad(d, [33, 40, 45], { type: "sawtooth", lp: 380, v: .012, rate: .05 }),
        every(60, 260, function () { noise({ ft: "bandpass", f: rnd(2000, 5200), q: 4, d: .03, v: rnd(.004, .012), a: .002, out: d, pan: rnd(-.9, .9) }); }),
        every(5000, 11000, function () { buzz(0, rnd(.05, .2), .01); })
      ];
    }
  };

  function startAmb(name) {
    if (!ctx || amb.name === name) return;
    stopAmb();
    var builder = AMB[name] || AMB["default"];
    var g = ctx.createGain(); g.gain.value = .0001; g.connect(ambBus);
    g.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.6);
    amb.name = name; amb.gain = g; amb.stops = builder(g);
  }
  function stopAmb() {
    if (!amb.gain) return;
    var g = amb.gain, stops = amb.stops;
    g.gain.cancelScheduledValues(ctx.currentTime);
    g.gain.setValueAtTime(Math.max(.0001, g.gain.value), ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + 1.1);
    setTimeout(function () { stops.forEach(function (s) { s(); }); try { g.disconnect(); } catch (e) {} }, 1300);
    amb.name = null; amb.gain = null; amb.stops = [];
  }
  function applyAmbLevel() {
    if (!ctx) return;
    var target = on.amb ? (ducked ? .08 : .6) : .0001;
    ambBus.gain.cancelScheduledValues(ctx.currentTime);
    ambBus.gain.setValueAtTime(Math.max(.0001, ambBus.gain.value), ctx.currentTime);
    ambBus.gain.exponentialRampToValueAtTime(target, ctx.currentTime + .6);
  }

  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  window.ZMSound = {
    unlock: function () { return !!ensure(); },
    running: function () { return !!ctx && ctx.state === "running"; },
    play: function (name, arg) { if (!on.sfx || !ensure() || !FX[name]) return; try { FX[name](arg); } catch (e) {} },
    enter: function (scene) { if (!on.sfx || !ensure()) return; try { (ENTER[scene] || ENTER.home)(); } catch (e) {} },
    slide: function (theme, i) { if (!on.sfx || !ensure()) return; try { (SLIDE[theme] || SLIDE["default"])(i); } catch (e) {} },
    ambience: function (name) {
      amb.want = name;
      if (!ctx) return;
      if (on.amb) startAmb(name); else stopAmb();
    },
    set: function (key, value) {
      on[key] = !!value;
      if (key === "amb" && ctx) { applyAmbLevel(); if (value && amb.want) startAmb(amb.want); if (!value) stopAmb(); }
    },
    get: function (key) { return on[key]; },
    duck: function (v) { ducked = !!v; applyAmbLevel(); },
    levels: function () {
      if (!ctx || ctx.state !== "running") return null;
      analyser.getByteFrequencyData(freq); return freq;
    }
  };
})();

/*
 * ZEUSMESS — a glass OS for the portfolio.
 * Everything on the page is rendered from content.js (window.PORTFOLIO); edit that file, not this one.
 */
(function () {
  "use strict";

  var P = window.PORTFOLIO, LOGO = window.ZM_LOGO, S = window.ZMSound, G = window.gsap;
  if (window.ScrambleTextPlugin) G.registerPlugin(window.ScrambleTextPlugin);

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mq = function (q) { return window.matchMedia(q).matches; };
  var FINE = mq("(hover: hover) and (pointer: fine)");
  var REDUCED = mq("(prefers-reduced-motion: reduce)");
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var lang = store.get("zm-lang", P.defaultLang || "ar");
  if (lang !== "ar" && lang !== "en") lang = "ar";
  S.set("sfx", store.get("zm-sfx", "1") !== "0");
  S.set("amb", store.get("zm-amb", "1") !== "0");

  /* ---------- Words ---------- */
  var UI = {
    ar: {
      scenes: { home: "الرئيسية", services: "خدماتي", starbucks: "ستاربكس", work: "أعمالي", about: "عنّي", contact: "تواصل" },
      available: "متاح لمشاريع جديدة", ctaWorks: "ابدأ اللعب", ctaContact: "يلا نشتغل",
      unlock: "اسحب للدخول", unlockKnob: "ادخل الموقع",
      notes: function (n) {
        return [
          { ic: "cup", app: "ZEUSMESS", when: "دلوقتي", title: "مجموعة ستاربكس", body: n + " حملات ترويجية: تصوير، مونتاج، وفيديوهات AI.", go: "starbucks" },
          { ic: "chat", app: "WhatsApp", when: "من شوية", title: "يوسف أيمن", body: "متاح لمشاريع جديدة. ابعتلي فكرتك وهرد بسرعة.", go: "contact" }
        ];
      },
      soundOn: "الصوت شغال", soundOff: "الصوت مقفول",
      sfx: "المؤثرات الصوتية", amb: "صوت المكان", language: "اللغة", now: "صوت المكان: ",
      ambNames: { home: "باد هادي", services: "باد كريستال", starbucks: "كافيه", "default": "شارع نيون بالليل", about: "باد هادي", contact: "أركيد" },
      servicesKicker: "CONTROL CENTER", servicesTitle: "بعمل إيه", servicesLead: "دوس على أي خدمة وهوديك على الشغل اللي فيها.",
      projects: function (n) { return n === 1 ? "مشروع واحد" : n === 2 ? "مشروعين" : n <= 10 ? n + " مشاريع" : n + " مشروع"; },
      pieces: function (n) { return n === 1 ? "عمل واحد" : n === 2 ? "عملين" : n <= 10 ? n + " أعمال" : n + " عمل"; },
      seeWork: "شوف الشغل", open: "افتح", level: "LEVEL",
      aboutKicker: "عنّي", player: "PLAYER 1",
      statSbx: function (n) { return (n >= 3 && n <= 10 ? "حملات" : "حملة") + " لستاربكس"; }, statProjects: "مشروع في الأرشيف", statPieces: "فيديو وصورة",
      contactTitle: "عندك فكرة؟ يلا نعملها", contactLead: "ابعتلي على واتساب أو انستجرام، وهرد عليك بسرعة.",
      whatsapp: "كلمني واتساب", email: "ابعتلي إيميل", phone: "الموبايل", mail: "الإيميل", copy: "انسخ", copied: "اتنسخ ✓", selected: "اتحدد، انسخه",
      reelSound: "صوت الشوريل",
      wSbx: "مجموعة ستاربكس", wSbxSub: function () { return "حملات ترويجية"; }, wArchive: "الأرشيف", wVideos: "فيديو", wPhotos: "صورة", wProjects: "مشروع",
      next: "التالي", prev: "السابق", close: "إغلاق", sections: "الأقسام", sound: "الصوت", langName: "عربي"
    },
    en: {
      scenes: { home: "Home", services: "Skills", starbucks: "Starbucks", work: "Work", about: "About", contact: "Contact" },
      available: "Available for new projects", ctaWorks: "Start game", ctaContact: "Let's work",
      unlock: "Slide to enter", unlockKnob: "Enter the site",
      notes: function (n) {
        return [
          { ic: "cup", app: "ZEUSMESS", when: "now", title: "Starbucks Collection", body: n + " promotional campaigns: shoots, edits and AI films.", go: "starbucks" },
          { ic: "chat", app: "WhatsApp", when: "earlier", title: "Youssef Ayman", body: "Available for new projects. Send me your idea and I'll reply fast.", go: "contact" }
        ];
      },
      soundOn: "Sound on", soundOff: "Sound off",
      sfx: "Sound effects", amb: "Ambience", language: "Language", now: "Ambience: ",
      ambNames: { home: "Calm pad", services: "Crystal pad", starbucks: "Café", "default": "Neon street at night", about: "Calm pad", contact: "Arcade" },
      servicesKicker: "CONTROL CENTER", servicesTitle: "What I do", servicesLead: "Tap a skill to jump straight to the work that uses it.",
      projects: function (n) { return n + (n === 1 ? " project" : " projects"); },
      pieces: function (n) { return n + (n === 1 ? " piece" : " pieces"); },
      seeWork: "See the work", open: "Open", level: "LEVEL",
      aboutKicker: "About me", player: "PLAYER 1",
      statSbx: function (n) { return "Starbucks " + (n === 1 ? "campaign" : "campaigns"); }, statProjects: "projects in the archive", statPieces: "videos and photos",
      contactTitle: "Got an idea? Let's make it", contactLead: "Message me on WhatsApp or Instagram and I'll get back to you fast.",
      whatsapp: "Chat on WhatsApp", email: "Send an email", phone: "Phone", mail: "Email", copy: "Copy", copied: "Copied ✓", selected: "Selected, copy it",
      reelSound: "Showreel sound",
      wSbx: "Starbucks Collection", wSbxSub: function (n) { return n === 1 ? "campaign" : "campaigns"; }, wArchive: "Archive", wVideos: "videos", wPhotos: "photos", wProjects: "projects",
      next: "Next", prev: "Previous", close: "Close", sections: "Sections", sound: "Sound", langName: "English"
    }
  };
  var U = UI[lang];

  /* ---------- Pixel sprites (12×12) ---------- */
  var SPR = {
    camera: ["............", "....####....", "..########..", ".##########.", ".###....###.", ".##..##..##.", ".##.####.##.", ".##..##..##.", ".###....###.", ".##########.", "............", "............"],
    play: ["............", "...#........", "...###......", "...#####....", "...#######..", "...########.", "...#######..", "...#####....", "...###......", "...#........", "............", "............"],
    film: ["............", ".##..##..##.", ".##########.", "............", ".##########.", ".#........#.", ".#..####..#.", ".#..####..#.", ".#........#.", ".##########.", "............", "............"],
    wand: ["........#...", ".......###..", "........#..#", "......##....", ".....##.....", "....##......", "...##.......", "..##........", ".##.........", "##..........", "............", "............"],
    spark: ["......#.....", "......#.....", ".....###....", ".....###....", "...#######..", ".###########", "...#######..", ".....###....", ".....###....", "......#.....", "......#.....", "............"],
    brush: ["..........##", ".........###", "........###.", ".......###..", "......###...", ".....###....", "...##.#.....", "..####......", "..####......", ".####.......", "###.........", "............"],
    doc: ["..######....", "..#....##...", "..#.....##..", "..#......#..", "..#.####.#..", "..#......#..", "..#.####.#..", "..#......#..", "..#.###..#..", "..#......#..", "..########..", "............"],
    cup: ["............", "..########..", ".##########.", "..#......#..", "..#.####.#..", "..#.#..#.#..", "..#.####.#..", "...#....#...", "...#....#...", "...######...", "............", "............"],
    chat: ["...######...", "..#......#..", ".#........#.", ".#.##.....#.", ".#.##.....#.", ".#..##....#.", ".#...####.#.", ".#........#.", "..#......#..", ".#.######...", "##..........", "............"],
    insta: [".##########.", "#..........#", "#.......##.#", "#...####...#", "#..#....#..#", "#..#....#..#", "#..#....#..#", "#..#....#..#", "#...####...#", "#..........#", ".##########.", "............"],
    mail: ["............", "############", "##........##", "#.#......#.#", "#..#....#..#", "#...####...#", "#..........#", "#..........#", "############", "............", "............", "............"],
    soundOn: ["............", "....#.......", "...##...#...", "..###....#..", "####..#..#..", "####...#.#..", "####...#.#..", "####..#..#..", "..###....#..", "...##...#...", "....#.......", "............"],
    soundOff: ["............", "....#.......", "...##.......", "..###.#...#.", "####...#.#..", "####....#...", "####...#.#..", "..###.#...#.", "...##.......", "....#.......", "............", "............"],
    next: ["............", "...#........", "...##.......", "....##......", ".....##.....", "......##....", ".....##.....", "....##......", "...##.......", "...#........", "............", "............"],
    prev: ["............", "........#...", ".......##...", "......##....", ".....##.....", "....##......", ".....##.....", "......##....", ".......##...", "........#...", "............", "............"],
    close: ["##........##", ".##......##.", "..##....##..", "...##..##...", "....####....", ".....##.....", "....####....", "...##..##...", "..##....##..", ".##......##.", "##........##", "............"],
    user: ["....####....", "...######...", "..########..", "..########..", "...######...", "....####....", "............", "..########..", ".##########.", "############", "############", "............"],
    grid: ["............", ".####..####.", ".####..####.", ".####..####.", ".####..####.", "............", "............", ".####..####.", ".####..####.", ".####..####.", ".####..####.", "............"],
    globe: ["....####....", "..##.##.##..", ".#...##...#.", ".#..#..#..#.", "############", "#...#..#...#", "#...#..#...#", "############", ".#..#..#..#.", ".#...##...#.", "..##.##.##..", "....####...."],
    eq: ["............", ".........##.", ".....##..##.", ".....##..##.", ".##..##..##.", ".##..##..##.", ".##..##..##.", ".##..##..##.", ".##..##..##.", ".##..##..##.", "............", "............"],
    expand: ["#####..#####", "#..........#", "#..........#", "#..........#", "#..........#", "............", "............", "#..........#", "#..........#", "#..........#", "#..........#", "#####..#####"],
    copy: ["....########", "....#......#", "....#......#", "########...#", "#......#...#", "#......#...#", "#......#####", "#......#....", "#......#....", "#......#....", "########....", "............"],
    arrow: ["............", "............", ".......#....", ".......##...", ".......###..", "###########.", "###########.", ".......###..", ".......##...", ".......#....", "............", "............"],
    photo: ["............", "############", "#..........#", "#.##.......#", "#.##.......#", "#......#...#", "#.....###..#", "#..#.#####.#", "#.#########.", "############", "............", "............"]
  };

  function runs(rows) {
    var d = "";
    rows.forEach(function (row, y) {
      var x = 0;
      while (x < row.length) {
        if (row[x] === "#") { var s = x; while (x < row.length && row[x] === "#") x++; d += "M" + s + " " + y + "h" + (x - s) + "v1h-" + (x - s) + "z"; }
        else x++;
      }
    });
    return d;
  }
  var NS = "http://www.w3.org/2000/svg";
  function svgEl(rows, irisRows) {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 " + rows[0].length + " " + rows.length);
    s.setAttribute("class", "pix"); s.setAttribute("aria-hidden", "true");
    var p = document.createElementNS(NS, "path"); p.setAttribute("d", runs(rows)); s.appendChild(p);
    if (irisRows) { var q = document.createElementNS(NS, "path"); q.setAttribute("d", runs(irisRows)); q.setAttribute("class", "iris"); s.appendChild(q); }
    return s;
  }
  function pxEye(size) { var L = LOGO[String(size)]; return svgEl(L.eye, L.iris); }
  function ico(name, size) {
    var w = document.createElement("span"); w.className = "ico";
    if (size) w.style.setProperty("--s", size + "px");
    w.appendChild(name === "eye" ? pxEye(15) : svgEl(SPR[name] || SPR.spark));
    return w;
  }

  /* ---------- Small helpers ---------- */
  function h(tag, a) {
    var n = document.createElement(tag);
    if (a) Object.keys(a).forEach(function (k) {
      var v = a[k];
      if (v == null || v === false) return;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x != null && x !== false) n.append(x.nodeType ? x : document.createTextNode(x)); });
      else n.append(c.nodeType ? c : document.createTextNode(c));
    }
    return n;
  }
  function t(v) { return v && typeof v === "object" && !Array.isArray(v) ? (v[lang] != null ? v[lang] : v.en) : (v || ""); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function src(it) { return "media/" + (it.v || it.i) + (it.v ? ".mp4" : ".webp"); }
  function poster(it) { return "media/" + (it.v || it.i) + ".webp"; }
  function rtl() { return lang === "ar" ? -1 : 1; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function logoMark() {
    return h("span", { class: "logo-mark" },
      h("img", { class: "logo-eye", src: "media/logo-eye.png", alt: "", draggable: "false" }),
      h("img", { class: "logo-iris", src: "media/logo-iris.png", alt: "", draggable: "false" }));
  }
  var imgCache = {};
  function imgOf(url) { if (!imgCache[url]) { var i = new Image(); i.src = url; imgCache[url] = i; } return imgCache[url]; }
  function playSafe(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function makeVideo(it, loop) {
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.setAttribute("muted", ""); v.loop = !!loop; v.playsInline = true; v.setAttribute("playsinline", "");
    v.preload = "auto"; v.poster = poster(it); v.src = src(it);
    return v;
  }

  /* ---------- Data ---------- */
  var COLS = P.collections || [];
  var SCENES = [{ id: "home", icon: "eye" }, { id: "services", icon: "grid" }];
  COLS.forEach(function (c) { SCENES.push({ id: c.id, icon: c.theme === "starbucks" ? "cup" : "film", col: c }); });
  SCENES.push({ id: "about", icon: "user" }, { id: "contact", icon: "chat" });
  function sIndex(id) { for (var i = 0; i < SCENES.length; i++) if (SCENES[i].id === id) return i; return -1; }
  function sceneLabel(s) { return U.scenes[s.id] || (s.col ? t(s.col.title) : s.id); }
  function soundName(s) { return s.col ? (s.col.theme === "starbucks" ? "starbucks" : "work") : s.id; }
  function ambName(s) { return s.col ? (s.col.theme === "starbucks" ? "starbucks" : "default") : s.id; }

  var ALL = [];
  COLS.forEach(function (c) { c.groups.forEach(function (g, gi) { ALL.push({ c: c, g: g, gi: gi }); }); });
  var STATS = { projects: ALL.length, pieces: 0, videos: 0, photos: 0, sbx: 0 };
  ALL.forEach(function (x) { x.g.items.forEach(function (it) { STATS.pieces++; if (it.v) STATS.videos++; else STATS.photos++; }); });
  COLS.forEach(function (c) { if (c.theme === "starbucks") STATS.sbx += c.groups.length; });
  var SBX = COLS.filter(function (c) { return c.theme === "starbucks"; })[0] || COLS[0];

  // Which project tags belong to which skill tile (matched on the English tag names in content.js)
  var SKILL_TAGS = { film: ["Editing", "Motion", "Typography"], camera: ["Photography"], wand: ["Photo Editing", "Retouching", "Compositing"],
    play: ["AI Video", "AI Film"], spark: ["AI Imagery"], brush: ["Pixel Art", "Game Style", "Design"], doc: [] };
  function matches(icon) {
    var tags = SKILL_TAGS[icon] || [];
    return ALL.filter(function (x) { return (x.g.tags && x.g.tags.en || []).some(function (tg) { return tags.indexOf(tg) >= 0; }); });
  }

  var colState = {};
  COLS.forEach(function (c) { colState[c.id] = { i: 0, item: 0, cards: [] }; });

  /* ---------- State ---------- */
  var deck = $("#deck"), lockEl = $("#lock"), island = $("#island"), dock = $("#dock"), sheetEl = $("#sheet");
  var sceneEls = [], dockBtns = [], cur = 0, busy = false, unlocked = false, audioReady = false;
  var reel = null, lensX = 0, lensW = 0, islandOpen = false;

  function sfx(n, a) { if (audioReady) S.play(n, a); }
  var lastHover = 0;
  function hoverSfx() { var n = Date.now(); if (n - lastHover > 80) { lastHover = n; sfx("hover"); } }

  /* =========================================================
     Lock screen
     ========================================================= */
  function renderLock() {
    var eyeBox = $(".lock-eye"); eyeBox.innerHTML = ""; eyeBox.appendChild(logoMark());
    $$("[data-bind='name']").forEach(function (n) { n.textContent = t(P.name); });
    var notes = $("#lockNotes"); notes.innerHTML = "";
    U.notes(STATS.sbx).forEach(function (nt) {
      if (sIndex(nt.go) < 0) return;
      notes.appendChild(h("button", { class: "note glass", type: "button", "data-go": nt.go },
        h("span", { class: "note-ic" }, ico(nt.ic)),
        h("span", { class: "note-top" }, h("span", null, nt.app), h("span", null, nt.when)),
        h("span", { class: "note-body" }, h("b", null, nt.title), nt.body)));
    });
    $("#unlockText").textContent = U.unlock;
    var knob = $("#unlockKnob"); knob.innerHTML = ""; knob.appendChild(ico("arrow")); knob.setAttribute("aria-label", U.unlockKnob);
    paintSoundChips();
    var ll = $("#lockLang"); ll.innerHTML = ""; ll.append(ico("globe"), lang === "ar" ? "English" : "عربي");
    ll.setAttribute("lang", lang === "ar" ? "en" : "ar");
    tickClock();
  }
  function tickClock() {
    var d = new Date();
    $("#lockTime").textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
    try { $("#lockDate").textContent = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB", { weekday: "long", day: "numeric", month: "long" }).format(d); }
    catch (e) { $("#lockDate").textContent = d.toDateString(); }
  }
  setInterval(tickClock, 15000);

  function soundIsOn() { return S.get("sfx") || S.get("amb"); }
  function setAllSound(v) {
    S.set("sfx", v); S.set("amb", v);
    store.set("zm-sfx", v ? "1" : "0"); store.set("zm-amb", v ? "1" : "0");
    paintSoundChips(); renderIslandPanel();
    if (v) { audioReady = S.unlock() || audioReady; S.ambience(ambName(SCENES[cur])); sfx("on"); }
  }
  function paintSoundChips() {
    var on = soundIsOn();
    var b = $("#lockSound"); b.innerHTML = ""; b.append(ico(on ? "soundOn" : "soundOff"), on ? U.soundOn : U.soundOff); b.setAttribute("aria-pressed", on);
    var d = $("#dockSound");
    if (d) { d.innerHTML = ""; d.append(ico(on ? "soundOn" : "soundOff"), h("span", { class: "dock-lab" }, U.sound)); d.setAttribute("aria-pressed", on); d.setAttribute("aria-label", on ? U.soundOn : U.soundOff); }
    var viz = $("#islViz"); if (viz) viz.classList.toggle("off", !on);
  }

  function unlock(goId) {
    if (unlocked) return;
    unlocked = true;
    audioReady = S.unlock() || audioReady;
    S.ambience(ambName(SCENES[cur]));
    sfx("unlock");
    lockEl.setAttribute("aria-hidden", "true");
    [deck, island, dock].forEach(function (n) { n.inert = false; });
    var tl = G.timeline({ onComplete: function () { lockEl.classList.add("gone"); G.set(lockEl, { clearProps: "all" }); } });
    if (REDUCED) tl.to(lockEl, { opacity: 0, duration: .3 }).to([deck, island, dock], { opacity: 1, duration: .3, clearProps: "opacity" }, 0);
    else {
      tl.to(lockEl, { yPercent: -100, duration: .9, ease: "expo.inOut" })
        .fromTo(deck, { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "expo.out", clearProps: "transform,opacity" }, .26)
        .fromTo([island, dock], { y: function (k) { return k ? 120 : -90; }, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "expo.out", stagger: .08, clearProps: "transform,opacity" }, .5);
      var rv = $$("[data-rv]", sceneEls[cur]);
      if (rv.length) tl.from(rv, { y: 40, opacity: 0, duration: .9, stagger: .05, ease: "expo.out", clearProps: "transform,opacity" }, .45);
    }
    activate(cur);
    startMedia(cur);
    try { sceneEls[cur].focus({ preventScroll: true }); } catch (e) {}
    var target = goId ? sIndex(goId) : -1;
    if (target >= 0 && target !== cur) setTimeout(function () { go(target); }, REDUCED ? 350 : 1050);
  }

  function bindLock() {
    var knob = $("#unlockKnob"), track = $("#unlock"), text = $("#unlockText");
    var drag = null;
    knob.addEventListener("pointerdown", function (e) {
      e.stopPropagation();
      drag = { x: e.clientX, max: track.clientWidth - knob.offsetWidth - 12, p: 0, moved: false };
      try { knob.setPointerCapture(e.pointerId); } catch (er) {}
    });
    knob.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = (e.clientX - drag.x) * rtl();
      if (Math.abs(dx) > 4) drag.moved = true;
      drag.p = clamp(dx / drag.max, 0, 1);
      G.set(knob, { x: drag.p * drag.max * rtl() }); G.set(text, { opacity: 1 - drag.p * 1.6 });
    });
    function release(e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (!d.moved || d.p > .55) { G.to(knob, { x: d.max * rtl(), duration: .2 }); unlock(); }
      else { G.to(knob, { x: 0, duration: .6, ease: "elastic.out(1, .55)" }); G.to(text, { opacity: 1, duration: .3 }); }
      e.stopPropagation();
    }
    knob.addEventListener("pointerup", release);
    knob.addEventListener("pointercancel", release);
    knob.addEventListener("click", function (e) { e.stopPropagation(); if (e.detail === 0) unlock(); });

    // Swipe up anywhere, or tap, to enter
    var sw = null;
    lockEl.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".lock-tools, .unlock-knob")) return;
      sw = { y: e.clientY, x: e.clientX, dy: 0 };
    });
    lockEl.addEventListener("pointermove", function (e) {
      if (!sw || unlocked) return;
      sw.dy = Math.min(0, e.clientY - sw.y);
      if (sw.dy < -6 && !REDUCED) G.set(lockEl, { y: sw.dy * .7 });
    });
    lockEl.addEventListener("pointerup", function (e) {
      if (!sw || unlocked) { sw = null; return; }
      var s = sw; sw = null;
      var note = e.target.closest(".note");
      if (s.dy < -70 || (Math.abs(s.dy) < 8 && Math.abs(e.clientX - s.x) < 8)) { G.set(lockEl, { y: 0 }); unlock(note ? note.dataset.go : null); }
      else G.to(lockEl, { y: 0, duration: .5, ease: "elastic.out(1, .6)" });
    });
    lockEl.addEventListener("pointercancel", function () { sw = null; G.to(lockEl, { y: 0, duration: .4 }); });
    $("#lockSound").addEventListener("click", function (e) { e.stopPropagation(); setAllSound(!soundIsOn()); });
    $("#lockLang").addEventListener("click", function (e) { e.stopPropagation(); setLang(lang === "ar" ? "en" : "ar"); });
  }

  /* =========================================================
     Dynamic Island
     ========================================================= */
  function renderIsland() {
    var e = $(".isl-eye"); e.innerHTML = ""; e.appendChild(pxEye(15));
    $("#islBtn").setAttribute("aria-label", U.sections + ": " + U.sfx + ", " + U.amb + ", " + U.language);
    renderIslandPanel();
  }
  function renderIslandPanel() {
    var p = $("#islPanel"); p.innerHTML = "";
    function row(icon, label, key) {
      var sw = h("button", { class: "switch", type: "button", role: "switch", "aria-checked": String(S.get(key)), "aria-label": label });
      sw.addEventListener("click", function () {
        var v = !S.get(key); S.set(key, v); store.set(key === "sfx" ? "zm-sfx" : "zm-amb", v ? "1" : "0");
        if (v) { audioReady = S.unlock() || audioReady; if (key === "amb") S.ambience(ambName(SCENES[cur])); }
        sw.setAttribute("aria-checked", String(v)); if (audioReady) S.play(v ? "on" : "off");
        paintSoundChips(); paintNow();
      });
      return h("div", { class: "isl-row" }, ico(icon), h("span", { class: "lab" }, label), sw);
    }
    p.appendChild(row("soundOn", U.sfx, "sfx"));
    p.appendChild(row("eq", U.amb, "amb"));
    var seg = h("div", { class: "seg", role: "group", "aria-label": U.language });
    [["ar", "عربي"], ["en", "EN"]].forEach(function (l) {
      seg.appendChild(h("button", { type: "button", "aria-pressed": String(lang === l[0]), lang: l[0], onclick: function () { if (lang !== l[0]) setLang(l[0], true); } }, l[1]));
    });
    p.appendChild(h("div", { class: "isl-row" }, ico("globe"), h("span", { class: "lab" }, U.language), seg));
    p.appendChild(h("p", { class: "isl-now", id: "islNow" }));
    paintNow();
  }
  function paintNow() {
    var n = $("#islNow"); if (!n) return;
    n.textContent = S.get("amb") ? U.now + (U.ambNames[ambName(SCENES[cur])] || "") : "";
  }
  function toggleIsland(force) {
    var open = force == null ? !islandOpen : force;
    if (open === islandOpen) return;
    islandOpen = open;
    var from = island.getBoundingClientRect();
    $("#islPanel").hidden = !open; island.classList.toggle("open", open);
    $("#islBtn").setAttribute("aria-expanded", String(open));
    var to = island.getBoundingClientRect();
    if (!REDUCED) {
      G.fromTo(island, { width: from.width, height: from.height }, { width: to.width, height: to.height, duration: open ? .7 : .45, ease: open ? "elastic.out(1, .78)" : "expo.out", clearProps: "width,height" });
      if (open) G.from($("#islPanel").children, { opacity: 0, y: -10, duration: .4, stagger: .05, delay: .08, clearProps: "transform,opacity" });
    }
    sfx(open ? "open" : "close");
  }
  function islandShow(i) {
    var s = SCENES[i];
    $("#islNo").textContent = pad(i + 1) + "/" + pad(SCENES.length);
    var label = sceneLabel(s), el = $("#islLabel");
    G.killTweensOf(el);
    if (lang === "en" && window.ScrambleTextPlugin && !REDUCED) G.to(el, { duration: .7, scrambleText: { text: label, chars: "#/<>=+01", speed: .6 } });
    else el.textContent = label;
    if (!REDUCED && unlocked) G.fromTo(island, { scale: .92 }, { scale: 1, duration: .7, ease: "elastic.out(1.1, .45)", clearProps: "transform" });
    paintNow();
  }

  /* =========================================================
     Dock
     ========================================================= */
  function renderDock() {
    $$(".dock-btn, .dock-sep", dock).forEach(function (n) { n.remove(); });
    dock.setAttribute("aria-label", U.sections);
    dockBtns = SCENES.map(function (s, i) {
      var b = h("button", { class: "dock-btn", type: "button", "aria-label": sceneLabel(s), "data-i": i, onclick: function () { if (!go(i)) wiggleDock(i); } },
        ico(s.icon), h("span", { class: "dock-lab" }, sceneLabel(s)));
      if (FINE) b.addEventListener("mouseenter", hoverSfx);
      dock.appendChild(b); return b;
    });
    dock.appendChild(h("span", { class: "dock-sep", "aria-hidden": "true" }));
    var sb = h("button", { class: "dock-btn", id: "dockSound", type: "button", onclick: function () { setAllSound(!soundIsOn()); } });
    dock.appendChild(sb);
    paintSoundChips();
  }
  function wiggleDock(i) { if (i === cur && !REDUCED) G.fromTo(dockBtns[i], { y: -4 }, { y: 0, duration: .5, ease: "elastic.out(1.2, .4)", clearProps: "transform" }); }
  function moveLens(i, animate) {
    var b = dockBtns[i], lens = $("#dockLens"); if (!b) return;
    dockBtns.forEach(function (x, k) { if (k === i) x.setAttribute("aria-current", "page"); else x.removeAttribute("aria-current"); });
    var x = b.offsetLeft, w = b.offsetWidth;
    G.killTweensOf(lens);
    if (!animate || REDUCED || !lensW) { G.set(lens, { x: x, width: w, scaleX: 1, scaleY: 1 }); lensX = x; lensW = w; return; }
    var oL = lensX, oR = lensX + lensW, sL = Math.min(oL, x), sR = Math.max(oR, x + w);
    G.set(lens, { width: w, x: (oL + oR) / 2 - w / 2, scaleX: lensW / w });
    G.timeline()
      .to(lens, { x: (sL + sR) / 2 - w / 2, scaleX: (sR - sL) / w, duration: .2, ease: "power2.in" })
      .to(lens, { x: x, scaleX: 1, duration: .62, ease: "elastic.out(1, .62)" })
      .fromTo(lens, { scaleY: .82 }, { scaleY: 1, duration: .7, ease: "elastic.out(1.2, .4)" }, .18);
    lensX = x; lensW = w;
  }

  /* =========================================================
     Scenes
     ========================================================= */
  function shell(s) {
    var sec = h("section", { class: "scene", id: s.id, "aria-label": sceneLabel(s), tabindex: "-1" });
    var scroll = h("div", { class: "scene-scroll" }), body = h("div", { class: "scene-body" });
    scroll.appendChild(body); sec.appendChild(scroll);
    return { sec: sec, body: body };
  }
  function floaters(spots) {
    var box = h("div", { class: "floaters", "aria-hidden": "true" });
    spots.forEach(function (f) {
      var w = h("div", { class: "float" + (f[6] ? " dim" : "") }); w.style.left = f[2] + "%"; w.style.top = f[3] + "%"; w.style.setProperty("--d", f[4]);
      var i = ico(f[0]); i.style.setProperty("--size", f[1] + "px"); i.style.setProperty("--delay", f[5] + "s");
      w.appendChild(i); box.appendChild(w);
    });
    return box;
  }

  /* ---------- Home ---------- */
  function renderHome(s) {
    var o = shell(s);
    o.body.appendChild(floaters([["camera", 46, 4, 14, 1.4, 0], ["play", 40, 90, 10, 2, -.6], ["spark", 30, 84, 46, 1.1, -1.2], ["film", 36, 6, 70, 1.8, -.3],
      ["cup", 32, 48, 88, .8, -1.6], ["wand", 28, 60, 6, 1.2, -.9, 1], ["brush", 24, 30, 40, 2.4, -2, 1], ["doc", 22, 72, 78, 2.6, -1.4, 1]]));
    var roles = h("ul", { class: "roles", "data-rv": "" });
    t(P.role).split(" · ").forEach(function (r, i) { roles.appendChild(h("li", { class: "glass" }, ico(["film", "camera", "spark"][i % 3]), r)); });
    var first = COLS[0] ? sIndex(COLS[0].id) : 2;
    var hero = h("div", { class: "hero" },
      h("div", { class: "hero-eye", "data-rv": "", "aria-hidden": "true" }, logoMark()),
      h("p", { class: "tag glass", "data-rv": "" }, h("span", { class: "dot live" }), U.available),
      h("h1", { class: "title", "data-rv": "" }, P.nickname || "ZEUSMESS"),
      h("p", { class: "hero-name", "data-rv": "" }, t(P.name)),
      roles,
      h("p", { class: "tagline", "data-rv": "" }, t(P.tagline)),
      h("div", { class: "actions", "data-rv": "" },
        h("button", { class: "btn solid", type: "button", onclick: function () { go(first); } }, ico("play"), U.ctaWorks),
        h("button", { class: "btn glass", type: "button", onclick: function () { go(sIndex("contact")); } }, ico("chat"), U.ctaContact)));

    // Showreel widget
    var w = h("div", { class: "w w-reel glass", "data-rv": "" });
    reel = makeVideo(P.showreel, true); reel.setAttribute("aria-label", "Showreel");
    var prog = h("span", { class: "prog" }, h("i"));
    var sb = h("button", { class: "round glass", type: "button", "aria-label": U.reelSound, "aria-pressed": "false" });
    function paintReel() { sb.innerHTML = ""; sb.appendChild(ico(reel.muted ? "soundOff" : "soundOn")); sb.setAttribute("aria-pressed", String(!reel.muted)); }
    sb.addEventListener("click", function () {
      reel.muted = !reel.muted; paintReel(); S.duck(!reel.muted); sfx("tap"); if (reel.paused) playSafe(reel);
    });
    reel.addEventListener("timeupdate", function () { if (reel.duration) prog.firstChild.style.width = (reel.currentTime / reel.duration * 100).toFixed(2) + "%"; });
    reel.addEventListener("playing", function () { if (cur === 0) ambientFrom(reel); });
    paintReel();
    w.append(reel, h("span", { class: "shade" }), h("div", { class: "w-bar" }, h("span", { class: "w-name" }, "SHOWREEL.MP4"), sb), prog);

    // Starbucks widget
    var fan = h("div", { class: "fan", "aria-hidden": "true" });
    if (SBX) SBX.groups.slice(0, 3).forEach(function (g) { fan.appendChild(h("img", { src: poster(g.items[0]), alt: "", loading: "lazy", decoding: "async" })); });
    var sbx = SBX ? h("button", { class: "w w-small glass", type: "button", "data-rv": "", onclick: function () { go(sIndex(SBX.id)); } },
      h("span", { class: "w-label" }, U.wSbx), fan,
      h("span", null, h("b", { class: "w-big" }, pad(SBX.groups.length)), " ", h("span", { class: "w-sub" }, U.wSbxSub(SBX.groups.length)))) : null;
    var arch = h("div", { class: "w w-small glass", "data-rv": "" },
      h("span", { class: "w-label" }, U.wArchive),
      h("div", { class: "mini-stats" },
        h("div", null, h("b", null, pad(STATS.projects)), h("span", null, U.wProjects)),
        h("div", null, h("b", null, pad(STATS.videos)), h("span", null, U.wVideos)),
        h("div", null, h("b", null, pad(STATS.photos)), h("span", null, U.wPhotos))));
    var widgets = h("div", { class: "widgets" }, w, sbx, arch);
    o.body.appendChild(h("div", { class: "wrap home-grid" }, hero, widgets));
    if (FINE) $$(".btn, .w-small", o.body).forEach(function (n) { n.addEventListener("mouseenter", hoverSfx); });
    return o.sec;
  }

  /* ---------- Services ---------- */
  function renderServices(s) {
    var o = shell(s);
    var known = ["film", "camera", "wand", "play", "spark", "brush", "doc"];
    var icons = P.services.map(function (x) { return x.icon; });
    var useAreas = icons.length === 7 && known.every(function (k) { return icons.indexOf(k) >= 0; });
    var grid = h("div", { class: "cc" + (useAreas ? "" : " free") });
    P.services.forEach(function (sv, i) {
      var m = matches(sv.icon);
      var tile = h("button", { class: "cc-tile glass", type: "button", "data-k": sv.icon, "data-rv": "", "aria-pressed": "false" },
        h("span", { class: "cc-top" }, h("span", { class: "cc-ic" }, ico(sv.icon)), h("span", { class: "cc-no" }, pad(i + 1))),
        h("span", { style: "display:grid;gap:6px" }, h("span", { class: "cc-name" }, sv[lang] || sv.en), h("span", { class: "cc-desc" }, t(sv.d))),
        m.length ? h("span", { class: "cc-link" }, U.seeWork + " · " + U.projects(m.length), ico("arrow")) : null);
      tile.addEventListener("click", function () {
        var lit = !tile.classList.contains("lit");
        $$(".cc-tile.lit", grid).forEach(function (x) { x.classList.remove("lit"); x.setAttribute("aria-pressed", "false"); });
        if (lit) { tile.classList.add("lit"); tile.setAttribute("aria-pressed", "true"); }
        sfx(lit ? "on" : "off");
        if (lit && m.length) setTimeout(function () { jumpTo(m[0].c, m[0].gi); }, 380);
      });
      if (FINE) tile.addEventListener("mouseenter", hoverSfx);
      grid.appendChild(tile);
    });
    o.body.appendChild(h("div", { class: "wrap", style: "display:grid;gap:22px" },
      h("div", { class: "s-head", "data-rv": "" },
        h("span", { class: "kicker px" }, ico("grid", 12), U.servicesKicker),
        h("h2", { class: "s-title" }, U.servicesTitle),
        h("p", { class: "s-lead" }, U.servicesLead)),
      grid));
    return o.sec;
  }

  /* ---------- Collections: coverflow of projects ---------- */
  function renderCollection(s) {
    var c = s.col, st = colState[c.id], o = shell(s);
    var stage = h("div", { class: "stage", "data-rv": "" });
    var prev = h("button", { class: "round glass", type: "button", "aria-label": U.prev, onclick: function () { stepTo(c, st.i - 1); } }, ico("prev"));
    var next = h("button", { class: "round glass", type: "button", "aria-label": U.next, onclick: function () { stepTo(c, st.i + 1); } }, ico("next"));
    var count = h("span", { class: "col-count", "aria-live": "polite" });
    var info = h("div", { class: "info glass", "data-rv": "" });
    var head = h("div", { class: "col-head" },
      h("div", { class: "s-head", "data-rv": "" },
        h("span", { class: "kicker" }, c.theme === "starbucks" ? ico("cup", 16) : h("span", { class: "ico", style: "--s:22px" }, pxEye(15)), t(c.kicker)),
        h("h2", { class: "s-title" }, t(c.title)),
        h("p", { class: "s-lead col-intro" }, t(c.intro))),
      h("div", { class: "col-nav", "data-rv": "" }, prev, count, next));
    st.stage = stage; st.info = info; st.count = count; st.prev = prev; st.next = next; st.cards = [];
    c.groups.forEach(function (g, gi) {
      var card = h("button", { class: "card", type: "button" },
        h("img", { src: poster(g.items[0]), alt: g.title.en + " · " + g.title.ar, loading: gi < 4 ? "eager" : "lazy", decoding: "async" }),
        h("span", { class: "dim" }), h("span", { class: "card-badge" }),
        h("span", { class: "card-open round glass", "aria-hidden": "true" }, ico("expand")));
      card._g = g; card._gi = gi;
      card.addEventListener("click", function () {
        if (card._dragged) { card._dragged = false; return; }
        if (gi === st.i) openSheet(c, g, st.item); else stepTo(c, gi);
      });
      stage.appendChild(card); st.cards.push(card);
      setCardItem(c, card, g.items[gi === st.i ? st.item : 0], gi === st.i ? st.item : 0);
    });
    bindStage(c, stage);
    o.body.appendChild(h("div", { class: "wrap col" }, head, stage, info));
    fillInfo(c, false);
    return o.sec;
  }
  function setCardItem(c, card, it, k) {
    card._it = it;
    var img = card.querySelector("img"), want = poster(it);
    if (img.getAttribute("src") !== want) img.setAttribute("src", want);
    var v = card.querySelector("video");
    if (v) { v.pause(); v.remove(); }
    card.classList.remove("playing");
    var b = card.querySelector(".card-badge"); b.innerHTML = "";
    b.append(ico(it.v ? "play" : "photo", 10), (it.v ? "VIDEO" : "PHOTO") + " " + (k + 1) + "/" + card._g.items.length);
    card.setAttribute("aria-label", t(card._g.title) + " · " + (k + 1) + "/" + card._g.items.length + (card._gi === colState[c.id].i ? " · " + U.open : ""));
  }
  function playCard(c, card) {
    var it = card._it;
    if (!it || !it.v || SCENES[cur].id !== c.id || sheetOpen) return;
    var v = card.querySelector("video");
    if (!v) {
      v = makeVideo(it, true);
      v.addEventListener("playing", function () { if (card._want) { card.classList.add("playing"); if (SCENES[cur].id === c.id) ambientFrom(v); } });
      card.insertBefore(v, card.querySelector(".dim"));
    }
    card._want = true; playSafe(v);
  }
  // Start a video only after the slide has settled, so decoding never lands mid-animation
  var playT = 0;
  function deferPlay(c, card, ms) { clearTimeout(playT); playT = setTimeout(function () { if (card.classList.contains("active") && SCENES[cur].id === c.id && !busy) playCard(c, card); }, ms == null ? 480 : ms); }
  function stopCard(card) { if (!card) return; card._want = false; card.classList.remove("playing"); var v = card.querySelector("video"); if (v) v.pause(); }

  function cardSize(card, ch, maxW) {
    var r = (card._it && card._it.r) || .6, hh = ch, w = hh * r;
    if (w > maxW) { w = maxW; hh = Math.max(w / r, ch * .5); }
    if (w < hh * .5) w = hh * .5;
    return { w: Math.round(w), h: Math.round(hh) };
  }
  function layoutCards(c, animate, sizeAnim) {
    var st = colState[c.id], stage = st.stage; if (!stage) return;
    var W = stage.clientWidth, H = stage.clientHeight; if (!W || !H) return;
    var narrow = W < 640, dir = rtl();
    var ch = H * .96, sideH = ch * .82, sideW = Math.min(sideH * .64, W * (narrow ? .4 : .2));
    var maxW = W * (narrow ? .7 : .6);
    var aW = cardSize(st.cards[st.i], ch, maxW).w;
    st.cards.forEach(function (card, k) {
      var d = k - st.i, ad = Math.abs(d), side = Math.sign(d) * dir, sz = cardSize(card, ch, maxW);
      if (card._w !== sz.w || card._h !== sz.h) {
        // a card's own size changes only on resize or when its shown piece changes
        if (sizeAnim && d === 0 && card._w && !REDUCED) G.to(card, { width: sz.w, height: sz.h, duration: .55, ease: "expo.out" });
        else G.set(card, { width: sz.w, height: sz.h });
        card._w = sz.w; card._h = sz.h;
      }
      var p;
      if (d === 0) p = { x: 0, z: 0, rotationY: 0, rotationX: 0, scale: 1, opacity: 1 };
      else {
        var off = aW / 2 + (narrow ? 8 : 26) + sideW * .43 + (ad - 1) * sideW * (narrow ? .28 : .4);
        var sc = Math.min(sideH / sz.h, sideW * 1.3 / sz.w) * (1 - Math.min(ad - 1, 3) * .05);
        p = { x: side * off, z: -ad * 120, rotationY: -side * (narrow ? 24 : 32), rotationX: 0, scale: sc, opacity: ad > (narrow ? 2 : 3) ? 0 : 1 };
      }
      card.classList.toggle("active", d === 0);
      card.tabIndex = p.opacity ? 0 : -1;
      card.style.pointerEvents = p.opacity ? "" : "none";
      if (p.opacity) card.removeAttribute("aria-hidden"); else card.setAttribute("aria-hidden", "true");
      G.set(card, { xPercent: -50, yPercent: -50, zIndex: 50 - ad });
      if (animate && !REDUCED) G.to(card, Object.assign(p, { duration: .9, ease: "expo.out", overwrite: "auto", force3D: true }));
      else G.set(card, p);
    });
    st.prev.disabled = st.i === 0; st.next.disabled = st.i === c.groups.length - 1;
    st.count.innerHTML = ""; st.count.append(pad(st.i + 1), h("small", null, " / " + pad(c.groups.length)));
  }

  function fillInfo(c, animate) {
    var st = colState[c.id], g = c.groups[st.i], info = st.info, n = c.groups.length;
    var bar = h("span", { class: "lvl-bar", "aria-hidden": "true" });
    for (var b = 0; b < n; b++) bar.appendChild(h("i", { class: b <= st.i ? "on" : null }));
    var other = lang === "ar" ? "en" : "ar";
    var thumbs = null;
    if (g.items.length > 1) {
      thumbs = h("div", { class: "thumbs" });
      // Long galleries show 5 thumbnails and a "+N" that opens the viewer at the 6th piece
      var MAXT = 5, more = g.items.length > MAXT + 1 ? g.items.length - MAXT : 0;
      if (more) {
        var mb = h("button", { class: "thumb-more", type: "button", "aria-label": U.open + " +" + more }, "+" + more);
        mb.addEventListener("click", function () { openSheet(c, g, MAXT); });
      }
      g.items.forEach(function (it, k) {
        if (more && k >= MAXT) return;
        var th = h("button", { class: "thumb", type: "button", "aria-label": (it.v ? "VIDEO " : "PHOTO ") + (k + 1), "aria-current": String(k === st.item) },
          h("img", { src: poster(it), alt: "", loading: "lazy", decoding: "async" }), h("span", { class: "t-ic" }, ico(it.v ? "play" : "photo", 12)));
        th.addEventListener("click", function () { showItem(c, k); });
        thumbs.appendChild(th);
      });
      if (more) thumbs.appendChild(mb);
    }
    info.innerHTML = "";
    info.append(
      h("div", { class: "lvl" }, U.level + " " + pad(st.i + 1) + "/" + pad(n), bar),
      h("div", { class: "info-titles" },
        h("h3", { class: "info-title" }, g.title[lang] || g.title.en),
        h("p", { class: "info-sub", lang: other, dir: other === "ar" ? "rtl" : "ltr" }, g.title[other] || "")),
      h("ul", { class: "tags" }, t(g.tags).map(function (x) { return h("li", null, x); })),
      h("p", { class: "info-desc" }, t(g.desc)),
      thumbs,
      h("div", { class: "info-foot" },
        h("span", { class: "info-count" }, U.pieces(g.items.length)),
        h("button", { class: "btn glass", type: "button", onclick: function () { openSheet(c, g, st.item); } }, ico("expand", 16), U.open)));
    if (animate && !REDUCED) G.from(info.children, { opacity: 0, y: 16, duration: .55, stagger: .04, ease: "expo.out", clearProps: "transform,opacity" });
  }

  function showItem(c, k) {
    var st = colState[c.id], card = st.cards[st.i], g = c.groups[st.i];
    if (k === st.item) { openSheet(c, g, k); return; }
    st.item = k; stopCard(card);
    setCardItem(c, card, g.items[k], k);
    layoutCards(c, true, true);
    $$(".thumb", st.info).forEach(function (th, j) { th.setAttribute("aria-current", String(j === k)); });
    if (!REDUCED) G.fromTo(card.querySelector("img"), { opacity: .2, scale: 1.06 }, { opacity: 1, scale: 1, duration: .6, ease: "expo.out", clearProps: "transform,opacity" });
    sfx("step"); deferPlay(c, card); ambientFrom(card.querySelector("img"));
  }

  function stepTo(c, k, quiet) {
    var st = colState[c.id], n = c.groups.length;
    if (k < 0 || k >= n) {
      sfx("edge");
      var a = st.cards[st.i];
      if (a && !REDUCED) G.fromTo(a, { rotationY: (k < 0 ? -8 : 8) * rtl() }, { rotationY: 0, duration: .7, ease: "elastic.out(1.1, .4)" });
      return;
    }
    if (k === st.i) return;
    stopCard(st.cards[st.i]);
    var old = st.cards[st.i]; st.i = k; st.item = 0;
    setCardItem(c, old, old._g.items[0], 0);
    setCardItem(c, st.cards[k], c.groups[k].items[0], 0);
    layoutCards(c, true); fillInfo(c, true);
    if (!quiet && audioReady) S.slide(c.theme === "starbucks" ? "starbucks" : "default", k);
    if (SCENES[cur].id === c.id) { deferPlay(c, st.cards[k]); ambientFrom(st.cards[k].querySelector("img")); }
  }
  function jumpTo(c, gi) {
    var st = colState[c.id];
    if (st.i !== gi) {
      stopCard(st.cards[st.i]);
      var old = st.cards[st.i]; st.i = gi; st.item = 0;
      setCardItem(c, old, old._g.items[0], 0);
      setCardItem(c, st.cards[gi], c.groups[gi].items[0], 0);
      layoutCards(c, false); fillInfo(c, false);
    }
    go(sIndex(c.id));
  }

  function bindStage(c, stage) {
    var st = colState[c.id], d = null;
    stage.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse" || e.button !== 0) return; d = { x: e.clientX, moved: false, card: e.target.closest(".card") }; });
    window.addEventListener("pointermove", function (e) {
      if (d && Math.abs(e.clientX - d.x) > 8) d.moved = true;
      if (!FINE || REDUCED || SCENES[cur].id !== c.id || d) return;
      var a = st.cards[st.i]; if (!a) return;
      var r = a.getBoundingClientRect();
      if (e.clientX < r.left - 40 || e.clientX > r.right + 40 || e.clientY < r.top - 40 || e.clientY > r.bottom + 40) { if (a._tilt) { a._tilt = false; G.to(a, { rotationX: 0, rotationY: 0, duration: .8, ease: "expo.out" }); } return; }
      a._tilt = true;
      var nx = (e.clientX - (r.left + r.width / 2)) / r.width, ny = (e.clientY - (r.top + r.height / 2)) / r.height;
      G.to(a, { rotationY: nx * 10, rotationX: -ny * 8, duration: .6, ease: "power3.out", overwrite: "auto" });
    });
    window.addEventListener("pointerup", function (e) {
      if (!d) return;
      var d0 = d, dx = e.clientX - d.x, moved = d.moved; d = null;
      if (moved && Math.abs(dx) > 50) {
        if (d0.card) { d0.card._dragged = true; setTimeout(function () { d0.card._dragged = false; }, 60); }
        stepTo(c, st.i + (dx < 0 ? 1 : -1) * rtl());
      }
    });
  }

  /* ---------- About ---------- */
  function renderAbout(s) {
    var o = shell(s), a = P.about || {};
    var skills = h("ul", { class: "skills" });
    P.services.forEach(function (sv) { skills.appendChild(h("li", null, ico(sv.icon), sv[lang] || sv.en)); });
    var photo = h("div", { class: "p-photo glass", "data-rv": "" },
      a.image ? h("img", { src: poster(a.image), alt: t(P.name), loading: "lazy", decoding: "async" }) : null,
      h("span", { class: "p-tag" }, U.player));
    var card = h("div", { class: "p-card glass", "data-rv": "" },
      h("span", { class: "kicker" }, ico("user", 14), U.aboutKicker),
      h("h2", { class: "p-name" }, t(P.name), h("em", null, P.nickname || "ZEUSMESS")),
      h("p", { class: "p-text" }, t(a.text)),
      h("div", { class: "stats" },
        h("div", { class: "stat" }, h("b", null, pad(STATS.sbx)), h("span", null, U.statSbx(STATS.sbx))),
        h("div", { class: "stat" }, h("b", null, pad(STATS.projects)), h("span", null, U.statProjects)),
        h("div", { class: "stat" }, h("b", null, pad(STATS.pieces)), h("span", null, U.statPieces))),
      skills);
    o.body.appendChild(h("div", { class: "wrap about" }, photo, card));
    return o.sec;
  }

  /* ---------- Contact ---------- */
  function phoneText(w) { w = String(w || ""); return w.length > 8 ? "+" + w.slice(0, 2) + " " + w.slice(2, 5) + " " + w.slice(5, 8) + " " + w.slice(8) : w; }
  function renderContact(s) {
    var o = shell(s), C = P.contact || {};
    o.body.appendChild(floaters([["chat", 40, 6, 16, 1.6, 0], ["insta", 36, 88, 20, 2, -.8], ["mail", 30, 86, 76, 1.2, -1.4], ["spark", 24, 10, 78, 2.4, -.4, 1]]));
    var acts = h("div", { class: "cont-actions", "data-rv": "" });
    if (C.whatsapp) acts.appendChild(h("a", { class: "btn solid", href: "https://wa.me/" + C.whatsapp, target: "_blank", rel: "noopener" }, ico("chat"), U.whatsapp));
    (C.socials || []).forEach(function (x) { acts.appendChild(h("a", { class: "btn glass", href: x.url, target: "_blank", rel: "noopener" }, ico("insta"), h("bdi", null, "@" + x.label))); });
    if (C.email) acts.appendChild(h("a", { class: "btn glass", href: "mailto:" + C.email }, ico("mail"), U.email));
    $$("a", acts).forEach(function (a) { a.addEventListener("click", function () { sfx("tap"); }); if (FINE) a.addEventListener("mouseenter", hoverSfx); });
    function detail(label, value) {
      var b = h("button", { class: "round glass", type: "button", "aria-label": U.copy + " " + label }, ico("copy"));
      var bd = h("bdi", null, value);
      b.addEventListener("click", function () { copyText(value, bd); });
      return h("div", { class: "detail" }, h("div", null, h("small", null, label), bd), b);
    }
    var details = h("div", { class: "details", "data-rv": "" },
      C.whatsapp ? detail(U.phone, phoneText(C.whatsapp)) : null,
      C.email ? detail(U.mail, C.email) : null);
    var eye = h("div", { class: "cont-eye", "aria-hidden": "true" }, pxEye(31));
    o.body.appendChild(h("div", { class: "wrap", style: "display:grid;gap:18px;position:relative;z-index:1" },
      h("div", { class: "cont glass" },
        h("div", { "data-rv": "" }, eye),
        h("span", { class: "kicker px blink", "data-rv": "", dir: "ltr" }, "CONTINUE?"),
        h("h2", { class: "cont-title", "data-rv": "" }, U.contactTitle),
        h("p", { class: "cont-lead", "data-rv": "" }, U.contactLead),
        acts, details),
      h("p", { class: "foot", "data-rv": "" }, h("bdi", null, "© " + new Date().getFullYear() + " " + (P.nickname || "ZEUSMESS")), " · " + t(P.name))));
    return o.sec;
  }

  function copyText(value, node) {
    function done() { toast(U.copied); sfx("copy"); }
    function fallback() { try { var r = document.createRange(); r.selectNodeContents(node); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {} toast(U.selected); }
    try { navigator.clipboard.writeText(value).then(done, fallback); } catch (e) { fallback(); }
  }
  var toastT = 0;
  function toast(msg) { var n = $("#toast"); n.textContent = msg; n.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { n.classList.remove("show"); }, 1700); }

  /* =========================================================
     Deck: render, move between scenes
     ========================================================= */
  function renderAll() {
    U = UI[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    $$("video", deck).forEach(function (v) { v.pause(); });
    deck.innerHTML = "";
    sceneEls = SCENES.map(function (s) {
      var el = s.id === "home" ? renderHome(s) : s.id === "services" ? renderServices(s) : s.id === "about" ? renderAbout(s) : s.id === "contact" ? renderContact(s) : renderCollection(s);
      deck.appendChild(el); return el;
    });
    renderLock(); renderIsland(); renderDock();
    sceneEls.forEach(function (el, k) {
      el.classList.toggle("on", k === cur); el.inert = k !== cur;
      if (k === cur) el.removeAttribute("aria-hidden"); else el.setAttribute("aria-hidden", "true");
    });
    eyeCache = { root: null };
    COLS.forEach(function (c) { layoutCards(c, false); });
    requestAnimationFrame(function () { moveLens(cur, false); });
    islandShow(cur);
    if (!unlocked && reel) reel.addEventListener("loadeddata", function () { if (!unlocked) { ambientFrom(reel); playSafe(reel); } }, { once: true });
  }

  function setLang(l) {
    lang = l; store.set("zm-lang", l);
    var wasOpen = islandOpen;
    renderAll();
    if (unlocked) activate(cur, true);
    if (wasOpen) { $("#islPanel").hidden = false; island.classList.add("open"); $("#islBtn").setAttribute("aria-expanded", "true"); }
    sfx("tap");
  }

  function leave(i) {
    var el = sceneEls[i], s = SCENES[i];
    $$("video", el).forEach(function (v) { v.pause(); });
    if (s.id === "home" && reel && !reel.muted) { reel.muted = true; S.duck(false); var b = $(".w-reel .round", el); if (b) { b.innerHTML = ""; b.appendChild(ico("soundOff")); } }
    if (s.col) stopCard(colState[s.id].cards[colState[s.id].i]);
    $$(".cc-tile.lit", el).forEach(function (x) { x.classList.remove("lit"); x.setAttribute("aria-pressed", "false"); });
  }
  function activate(i, quiet) {
    var s = SCENES[i];
    moveLens(i, !quiet); islandShow(i);
    try { history.replaceState(null, "", "#" + s.id); } catch (e) {}
    S.ambience(ambName(s));
    setAmbientFor(i);
    if (s.col) layoutCards(s.col, false);
    if (quiet) startMedia(i);
  }
  function startMedia(i) {
    var s = SCENES[i];
    if (s.id === "home") { if (reel) playSafe(reel); shineTitle(); }
    if (s.col) { var st = colState[s.id]; deferPlay(s.col, st.cards[st.i], 0); }
  }
  function shineTitle() {
    var tt = $(".title", sceneEls[0]); if (!tt || REDUCED) return;
    tt.classList.remove("shine"); void tt.offsetWidth; tt.classList.add("shine");
  }

  var curTL = null;
  function go(i) {
    if (!unlocked || sheetOpen) return false;
    if (i < 0 || i >= SCENES.length) { sfx("edge"); return false; }
    if (i === cur) return false;
    if (busy && curTL) curTL.progress(1);
    if (islandOpen) toggleIsland(false);
    var from = sceneEls[cur], to = sceneEls[i], dir = i > cur ? 1 : -1, prev = cur;
    busy = true; cur = i;
    leave(prev);
    to.classList.add("on"); to.inert = false; to.removeAttribute("aria-hidden");
    var sc = $(".scene-scroll", to); sc.scrollTop = (dir < 0 && prev - i === 1) ? sc.scrollHeight : 0;
    var hadFocus = from.contains(document.activeElement);
    var rv = $$("[data-rv]", to);
    function done() {
      from.classList.remove("on"); from.inert = true; from.setAttribute("aria-hidden", "true");
      G.set([from, to], { clearProps: "transform,opacity,zIndex,borderRadius" });
      if (rv.length) G.set(rv, { clearProps: "transform,opacity" });
      busy = false; curTL = null;
      if (cur === i) startMedia(i);
      if (hadFocus || document.activeElement === document.body) { try { sceneEls[cur].focus({ preventScroll: true }); } catch (e) {} }
    }
    G.killTweensOf([from, to]);
    G.set(to, { zIndex: 2 }); G.set(from, { zIndex: 1 });
    var tl = curTL = G.timeline({ onComplete: done });
    if (REDUCED) tl.fromTo(to, { opacity: 0 }, { opacity: 1, duration: .3 }).to(from, { opacity: 0, duration: .3 }, 0);
    else {
      G.set(from, { borderRadius: 40 });
      tl.to(from, { y: -70 * dir, scale: .93, opacity: 0, duration: .55, ease: "power2.in", force3D: true }, 0)
        .fromTo(to, { y: 120 * dir, scale: 1.02, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.05, ease: "expo.out", force3D: true }, .12);
      if (rv.length) tl.fromTo(rv, { y: 46 * dir, opacity: 0 }, { y: 0, opacity: 1, duration: .95, stagger: .05, ease: "expo.out", force3D: true }, .16);
    }
    sfx("whoosh", dir);
    if (audioReady) setTimeout(function () { S.enter(soundName(SCENES[i])); }, 170);
    activate(i);
    return true;
  }

  /* =========================================================
     Ambient light: the current work, blurred, behind the glass
     ========================================================= */
  var cv = $("#ambient"); cv.width = 128; cv.height = 72;
  var cx = cv.getContext("2d"), ambSrc = null, ambLast = 0, sampLast = 0, ambCycle = 0, sampOk = false, settle = 0;
  function mkCanvas(w, hh) { var c = document.createElement("canvas"); c.width = w; c.height = hh; return c.getContext("2d"); }
  var SAMP = mkCanvas(48, 27), BLEND = mkCanvas(48, 27);
  [cx, SAMP, BLEND].forEach(function (x) { x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high"; x.fillStyle = "#000"; x.fillRect(0, 0, x.canvas.width, x.canvas.height); });
  // Blur and colour are baked into the tiny canvas, so the full-screen layer needs no filter.
  // Where canvas filters are missing, nine offset draws make the same soft blur by hand.
  var canFilter = false;
  try { cx.filter = "blur(4px) saturate(1.6) brightness(.92)"; canFilter = String(cx.filter).indexOf("blur") >= 0; } catch (e) {}
  if (canFilter) cv.classList.add("baked");
  var OFF = [[0, 0], [5, 0], [-5, 0], [0, 5], [0, -5], [4, 4], [-4, -4], [4, -4], [-4, 4]];
  function ambientFrom(node) { if (node !== ambSrc) { ambSrc = node; settle = 0; sampLast = 0; } }
  var LEVEL = { home: .85, services: .55, about: .75, contact: .7 };
  function setAmbientFor(i) {
    var s = SCENES[i];
    clearInterval(ambCycle);
    $(".bg").style.setProperty("--amb-o", s.col ? .95 : (LEVEL[s.id] || .7));
    if (s.id === "home") ambientFrom(reel && reel.readyState >= 2 && !reel.paused ? reel : imgOf(poster(P.showreel)));
    else if (s.id === "services") ambientFrom(imgOf(poster(P.showreel)));
    else if (s.col) {
      var st = colState[s.id], card = st.cards[st.i], v = card.querySelector("video");
      ambientFrom(v && card.classList.contains("playing") ? v : card.querySelector("img"));
    } else if (s.id === "about") ambientFrom(imgOf(poster((P.about && P.about.image) || P.showreel)));
    else {
      var k = 0, list = ALL.map(function (x) { return poster(x.g.items[0]); });
      var next = function () { ambientFrom(imgOf(list[k % list.length])); k++; };
      next(); ambCycle = setInterval(next, 3200);
    }
  }
  function ambTick(now) {
    if (now - ambLast < (FINE ? 33 : 50)) return;
    ambLast = now;
    var s = ambSrc, isVideo = !!s && s.tagName === "VIDEO" && !s.paused && s.readyState >= 2;
    if (!isVideo && settle > 90) return;            // a still picture has fully faded in: nothing left to draw
    settle++;
    if (now - sampLast > (FINE ? 120 : 200)) {
      sampLast = now;
      sampOk = !!s && (s.tagName === "VIDEO" ? s.readyState >= 2 : (s.complete && s.naturalWidth > 0));
      if (sampOk) { try { SAMP.globalAlpha = 1; SAMP.drawImage(s, 0, 0, 48, 27); } catch (e) { sampOk = false; } }
    }
    if (sampOk) { BLEND.globalAlpha = .09; BLEND.drawImage(SAMP.canvas, 0, 0); }
    else { BLEND.globalAlpha = .05; BLEND.fillStyle = "#000"; BLEND.fillRect(0, 0, 48, 27); }
    if (canFilter) { cx.globalAlpha = 1; cx.drawImage(BLEND.canvas, -10, -10, 148, 92); }
    else for (var k = 0; k < OFF.length; k++) { cx.globalAlpha = 1 / (k + 1); cx.drawImage(BLEND.canvas, OFF[k][0] - 10, OFF[k][1] - 10, 148, 92); }
  }

  /* =========================================================
     Pointer: eyes follow you, glass catches the light, iPad-style cursor
     ========================================================= */
  var px = -1, py = -1, lastMove = -1e9, eyeCache = { root: null }, fX = 0, fY = 0;
  function eyeTargets(root) {
    if (eyeCache.root === root && eyeCache.unlocked === unlocked) return eyeCache;
    eyeCache = { root: root, unlocked: unlocked, logo: $$(".logo-iris", root), pix: $$(".pix .iris", root).concat(unlocked ? $$(".isl-eye .iris") : []),
      floats: $$(".float", root).map(function (f) { return { el: f, d: parseFloat(f.style.getPropertyValue("--d")) || 1 }; }) };
    return eyeCache;
  }
  function setT(el, v) { if (el._t !== v) { el._t = v; el.style.transform = v; } }
  function eyes(now) {
    var vw = window.innerWidth, vh = window.innerHeight, idle = now - lastMove > 2600;
    if (idle && FINE && Math.abs(fX) < .05) return;   // desktop at rest: nothing moves
    var tx = px, ty = py;
    if (idle && !FINE) { tx = vw / 2 + Math.sin(now / 1300) * vw * .3; ty = vh / 2 + Math.cos(now / 1700) * vh * .2; }
    var root = unlocked ? sceneEls[cur] : lockEl;
    if (!root) return;
    var E = eyeTargets(root);
    var lr = E.logo.map(function (n) { return n.parentNode.getBoundingClientRect(); });
    var pr = E.pix.map(function (n) { return n.ownerSVGElement.getBoundingClientRect(); });
    E.logo.forEach(function (iris, k) {
      var r = lr[k]; if (r.width < 30) return;
      var dx = tx - (r.left + r.width / 2), dy = ty - (r.top + r.height / 2), d = Math.max(1, Math.hypot(dx, dy)), m = Math.min(1, d / 420) * r.width * .075;
      setT(iris, "translate(" + (dx / d * m).toFixed(1) + "px," + (dy / d * m * .7).toFixed(1) + "px)");
    });
    E.pix.forEach(function (iris, j) {
      var r = pr[j]; if (!r.width) return;
      var dx = tx - (r.left + r.width / 2), dy = ty - (r.top + r.height / 2), d = Math.max(1, Math.hypot(dx, dy));
      var k = Math.max(1, Math.round(iris.ownerSVGElement.viewBox.baseVal.width / 16)), m = Math.min(1, d / 300);
      setT(iris, "translate(" + Math.round(dx / d * k * m) + "px," + Math.round(dy / d * k * m * .7) + "px)");
    });
    if (FINE && unlocked && E.floats.length && !REDUCED) {
      var mx = idle ? 0 : (tx / vw - .5) * -18, my = idle ? 0 : (ty / vh - .5) * -18;
      fX += (mx - fX) * .08; fY += (my - fY) * .08;
      E.floats.forEach(function (f) { setT(f.el, "translate3d(" + (fX * f.d).toFixed(1) + "px," + (fY * f.d).toFixed(1) + "px,0)"); });
    }
  }
  var vizBars = null, vizLast = 0;
  function viz(now) {
    if (now - vizLast < 50) return;
    vizLast = now;
    if (!vizBars) vizBars = $$("#islViz i");
    var lv = soundIsOn() ? S.levels() : null;
    var bins = [2, 4, 7, 10, 14];
    vizBars.forEach(function (b, i) {
      var v = lv ? lv[bins[i]] / 255 : 0;
      setT(b, "scaleY(" + (.18 + v * .82).toFixed(2) + ")");
    });
  }
  var frameN = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    ambTick(now);
    viz(now);
    if (FINE || (frameN++ & 1) === 0) eyes(now);
  }

  function bindPointer() {
    var gTarget = null, gRaf = 0;
    function glow() {
      gRaf = 0;
      var g = gTarget && gTarget.closest && gTarget.closest(".glass");
      if (g) { var r = g.getBoundingClientRect(); g.style.setProperty("--sx", (px - r.left).toFixed(0) + "px"); g.style.setProperty("--sy", (py - r.top).toFixed(0) + "px"); }
    }
    window.addEventListener("pointermove", function (e) {
      px = e.clientX; py = e.clientY; lastMove = performance.now();
      if (e.pointerType === "mouse") { gTarget = e.target; if (!gRaf) gRaf = requestAnimationFrame(glow); }
    }, { passive: true });
    window.addEventListener("pointerdown", function (e) { px = e.clientX; py = e.clientY; lastMove = performance.now(); }, { passive: true });

    if (!FINE || REDUCED) return;
    document.documentElement.classList.add("has-cursor");
    var c = $("#cursor"), snapEl = null;
    var qx = G.quickTo(c, "x", { duration: .18, ease: "power3" }), qy = G.quickTo(c, "y", { duration: .18, ease: "power3" });
    var MAG = ".btn, .round, .chip, .dock-btn, .thumb, .isl-face, .seg button, .switch, .note, .unlock-knob, .tag, .roles li";
    function snap(el) {
      var r = el.getBoundingClientRect(), br = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 12, w = r.width + 12, hh = r.height + 12;
      c.classList.add("snap");
      G.to(c, { width: w, height: hh, borderRadius: Math.min(br + 6, hh / 2), duration: .32, ease: "power3.out", overwrite: "auto" });
      qx(r.left - 6); qy(r.top - 6);
    }
    function unsnap() { c.classList.remove("snap"); G.to(c, { width: 22, height: 22, borderRadius: 11, duration: .3, ease: "power3.out", overwrite: "auto" }); }
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      if (!c._shown) { c._shown = true; G.set(c, { opacity: 1 }); }
      var el = e.target.closest && e.target.closest(MAG);
      if (el && el.closest("[inert]")) el = null;
      if (el !== snapEl) { snapEl = el; if (el) snap(el); else unsnap(); }
      if (snapEl) { var r = snapEl.getBoundingClientRect(); qx(r.left - 6 + (px - r.left - r.width / 2) * .08); qy(r.top - 6 + (py - r.top - r.height / 2) * .08); }
      else { qx(px - 11); qy(py - 11); }
    }, { passive: true });
    document.addEventListener("mouseleave", function () { c._shown = false; G.to(c, { opacity: 0, duration: .2 }); });
    window.addEventListener("pointerdown", function () { if (!REDUCED) G.to(c, { scale: .86, duration: .12 }); });
    window.addEventListener("pointerup", function () { G.to(c, { scale: 1, duration: .4, ease: "elastic.out(1, .5)" }); });
  }

  /* =========================================================
     Input: wheel, touch, keys
     ========================================================= */
  function scroller() { return $(".scene-scroll", sceneEls[cur]); }
  function bindInput() {
    var wAcc = 0, wLast = 0, wQuiet = false, innerAt = 0, hAcc = 0, hQuiet = false;
    window.addEventListener("wheel", function (e) {
      if (sheetOpen) { e.preventDefault(); return; }
      if (!unlocked) { e.preventDefault(); if (e.deltaY > 25) unlock(); return; }
      if (e.target.closest && e.target.closest("#islPanel")) return;
      var now = performance.now(), gap = now - wLast; wLast = now;
      var dy = e.deltaY, dx = e.deltaX;
      if (e.deltaMode === 1) { dy *= 32; dx *= 32; }
      if (e.shiftKey && !dx) { dx = dy; dy = 0; }
      var s = SCENES[cur];
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
        if (!s.col || busy) return;
        if (hQuiet) { if (gap < 180) return; hQuiet = false; hAcc = 0; }
        if (gap > 250) hAcc = 0;
        hAcc += dx;
        if (Math.abs(hAcc) > 60) { stepTo(s.col, colState[s.id].i + Math.sign(hAcc) * rtl()); hAcc = 0; hQuiet = true; }
        return;
      }
      var sc = scroller();
      var canDown = sc.scrollTop + sc.clientHeight < sc.scrollHeight - 2, canUp = sc.scrollTop > 2;
      if ((dy > 0 && canDown) || (dy < 0 && canUp)) { innerAt = now; return; }
      e.preventDefault();
      if (busy) { wQuiet = true; return; }
      if (now - innerAt < 380) { innerAt = now; return; }
      if (wQuiet) { if (gap < 200) return; wQuiet = false; wAcc = 0; }
      if (gap > 260) wAcc = 0;
      wAcc += dy;
      if (Math.abs(wAcc) >= 40) { go(cur + Math.sign(wAcc)); wAcc = 0; wQuiet = true; }
    }, { passive: false });

    var ts = null;
    deck.addEventListener("touchstart", function (e) {
      if (sheetOpen || e.touches.length > 1) { ts = null; return; }
      var tt = e.touches[0], sc = scroller();
      ts = { x: tt.clientX, y: tt.clientY, at: performance.now(), top: sc.scrollTop <= 1, bottom: sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1,
        axis: null, inCol: !!(e.target.closest && e.target.closest(".stage, .info, .col-head")), pull: 0 };
    }, { passive: true });
    deck.addEventListener("touchmove", function (e) {
      if (!ts) return;
      var tt = e.touches[0], dx = tt.clientX - ts.x, dy = tt.clientY - ts.y;
      if (!ts.axis) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; ts.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"; }
      if (ts.axis === "y") {
        var edge = (dy < 0 && ts.bottom) || (dy > 0 && ts.top);
        if (edge) { if (e.cancelable) e.preventDefault(); ts.pull = dy; if (!REDUCED) G.set(sceneEls[cur], { y: dy * .22 }); }
      } else if (ts.inCol && e.cancelable) e.preventDefault();
    }, { passive: false });
    function endTouch(e) {
      if (!ts) return;
      var s0 = ts; ts = null;
      var tt = e.changedTouches[0], dx = tt.clientX - s0.x, dy = tt.clientY - s0.y, fast = performance.now() - s0.at < 320;
      if (s0.axis === "y" && s0.pull) {
        var moved = (Math.abs(dy) > 70 || (fast && Math.abs(dy) > 30)) && go(cur + (dy < 0 ? 1 : -1));
        if (!moved) G.to(sceneEls[cur], { y: 0, duration: .6, ease: "elastic.out(1, .6)" });
      } else if (s0.axis === "x" && s0.inCol && (Math.abs(dx) > 50 || (fast && Math.abs(dx) > 24))) {
        var s = SCENES[cur]; if (s.col) stepTo(s.col, colState[s.id].i + (dx < 0 ? 1 : -1) * rtl());
      }
    }
    deck.addEventListener("touchend", endTouch);
    deck.addEventListener("touchcancel", function () { ts = null; G.to(sceneEls[cur], { y: 0, duration: .4 }); });

    document.addEventListener("keydown", function (e) {
      if (sheetOpen) { sheetKeys(e); return; }
      if (!unlocked) {
        if (["Enter", " ", "ArrowDown", "ArrowUp", "PageDown"].indexOf(e.key) >= 0 && !(e.target.closest && e.target.closest(".lock-tools"))) { e.preventDefault(); unlock(); }
        return;
      }
      if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "Escape") { if (islandOpen) toggleIsland(false); return; }
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var sc = scroller(), canDown = sc.scrollTop + sc.clientHeight < sc.scrollHeight - 2, canUp = sc.scrollTop > 2;
      var onCtl = e.target.closest && e.target.closest("button, a, [role=switch]");
      var k = e.key;
      if (k === "ArrowDown" || k === "PageDown" || (k === " " && !onCtl && !e.shiftKey)) { if (canDown) return; e.preventDefault(); go(cur + 1); }
      else if (k === "ArrowUp" || k === "PageUp" || (k === " " && !onCtl && e.shiftKey)) { if (canUp) return; e.preventDefault(); go(cur - 1); }
      else if (k === "Home" && !onCtl) { e.preventDefault(); go(0); }
      else if (k === "End" && !onCtl) { e.preventDefault(); go(SCENES.length - 1); }
      else if ((k === "ArrowRight" || k === "ArrowLeft") && SCENES[cur].col) {
        e.preventDefault(); var s = SCENES[cur];
        stepTo(s.col, colState[s.id].i + (k === "ArrowRight" ? 1 : -1) * rtl());
      } else if (/^[1-9]$/.test(k) && +k <= SCENES.length) go(+k - 1);
    });

    $("#islBtn").addEventListener("click", function () { toggleIsland(); });
    document.addEventListener("pointerdown", function (e) { if (islandOpen && !island.contains(e.target)) toggleIsland(false); });

    // The first gesture anywhere wakes the audio
    function wake() {
      var ok = S.unlock();
      if (ok && !audioReady) { audioReady = true; if (unlocked) S.ambience(ambName(SCENES[cur])); }
    }
    ["pointerup", "keydown", "touchend"].forEach(function (ev) { window.addEventListener(ev, wake, true); });

    window.addEventListener("hashchange", function () {
      var i = sIndex(location.hash.slice(1));
      if (i < 0 || i === cur) return;
      if (!unlocked) { cur = i; renderAll(); unlock(); } else go(i);
    });
    var rt = 0;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { COLS.forEach(function (c) { layoutCards(c, false); }); moveLens(cur, false); }, 120);
    });
  }

  /* =========================================================
     Media viewer
     ========================================================= */
  var sheetOpen = false, sh = null, lastFocus = null;
  function openSheet(c, g, i) {
    if (sheetOpen) return;
    lastFocus = document.activeElement;
    sh = { c: c, g: g, i: i };
    sheetOpen = true; document.documentElement.classList.add("sheet-open");
    $$("video", deck).forEach(function (v) { v.pause(); });
    sheetEl.hidden = false;
    [deck, island, dock].forEach(function (n) { n.inert = true; });
    $("#sheetClose").innerHTML = ""; $("#sheetClose").appendChild(ico("close")); $("#sheetClose").setAttribute("aria-label", U.close);
    $("#sheetPrev").innerHTML = ""; $("#sheetPrev").appendChild(ico("prev")); $("#sheetPrev").setAttribute("aria-label", U.prev);
    $("#sheetNext").innerHTML = ""; $("#sheetNext").appendChild(ico("next")); $("#sheetNext").setAttribute("aria-label", U.next);
    showSheet(0);
    if (!REDUCED) {
      G.fromTo(sheetEl, { opacity: 0 }, { opacity: 1, duration: .35, clearProps: "opacity" });
      G.fromTo("#sheetStage", { scale: .86, y: 60 }, { scale: 1, y: 0, duration: .7, ease: "expo.out", clearProps: "transform" });
    }
    sfx("open");
    $("#sheetClose").focus();
  }
  function showSheet(dir) {
    var it = sh.g.items[sh.i], stage = $("#sheetStage"), n = sh.g.items.length;
    $$("video", stage).forEach(function (v) { v.pause(); });
    stage.innerHTML = "";
    var m;
    if (it.v) {
      m = makeVideo(it, false); m.muted = false; m.defaultMuted = false; m.removeAttribute("muted"); m.controls = true; m.autoplay = true;
      m.addEventListener("play", function () { S.duck(!m.muted); });
      m.addEventListener("volumechange", function () { S.duck(!m.muted && !m.paused); });
      m.addEventListener("pause", function () { S.duck(false); });
      var p = m.play(); if (p && p.catch) p.catch(function () { m.muted = true; playSafe(m); });
    } else m = h("img", { src: src(it), alt: t(sh.g.title) });
    stage.appendChild(m);
    $("#sheetTitle").textContent = t(sh.g.title);
    $("#sheetCount").textContent = pad(sh.i + 1) + " / " + pad(n) + " · " + (it.v ? "VIDEO" : "PHOTO");
    $("#sheetDesc").textContent = t(sh.g.desc);
    $("#sheetPrev").disabled = n < 2; $("#sheetNext").disabled = n < 2;
    if (dir && !REDUCED) G.fromTo(m, { x: 80 * dir * rtl(), opacity: 0 }, { x: 0, opacity: 1, duration: .55, ease: "expo.out", clearProps: "transform,opacity" });
  }
  function stepSheet(d) { var n = sh.g.items.length; if (n < 2) return; sh.i = (sh.i + d + n) % n; sfx("step"); showSheet(d); }
  function closeSheet() {
    if (!sheetOpen) return;
    $$("video", sheetEl).forEach(function (v) { v.pause(); });
    S.duck(false); sfx("close");
    var fin = function () {
      sheetEl.hidden = true; $("#sheetStage").innerHTML = ""; sheetOpen = false; document.documentElement.classList.remove("sheet-open");
      [deck, island, dock].forEach(function (n) { n.inert = false; });
      var s = SCENES[cur]; if (s.col) playCard(s.col, colState[s.id].cards[colState[s.id].i]);
      if (s.id === "home" && reel) playSafe(reel);
      if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
    };
    if (REDUCED) fin();
    else { G.to("#sheetStage", { scale: .9, y: 50, duration: .3, ease: "power2.in" }); G.to(sheetEl, { opacity: 0, duration: .3, onComplete: function () { G.set(["#sheetStage", sheetEl], { clearProps: "all" }); fin(); } }); }
  }
  function sheetKeys(e) {
    if (e.key === "Escape") { e.preventDefault(); closeSheet(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); stepSheet(rtl()); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); stepSheet(-rtl()); }
    else if (e.key === "Tab") {
      var f = $$("button:not([disabled]), video[controls]", sheetEl);
      if (!f.length) return;
      var a = f.indexOf(document.activeElement);
      if (e.shiftKey && a <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && a === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  }
  function bindSheet() {
    $("#sheetClose").addEventListener("click", closeSheet);
    $("#sheetPrev").addEventListener("click", function () { stepSheet(-1); });
    $("#sheetNext").addEventListener("click", function () { stepSheet(1); });
    sheetEl.addEventListener("click", function (e) { if (e.target === sheetEl || e.target.id === "sheetStage") closeSheet(); });
    var s0 = null;
    sheetEl.addEventListener("touchstart", function (e) { if (e.touches.length > 1) return; s0 = { x: e.touches[0].clientX, y: e.touches[0].clientY, axis: null }; }, { passive: true });
    sheetEl.addEventListener("touchmove", function (e) {
      if (!s0) return;
      var dx = e.touches[0].clientX - s0.x, dy = e.touches[0].clientY - s0.y;
      if (!s0.axis) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; s0.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"; }
      var m = $("#sheetStage > *"); if (!m || REDUCED) return;
      if (s0.axis === "x") G.set(m, { x: dx });
      else if (dy > 0) G.set(m, { y: dy, scale: 1 - Math.min(dy, 300) / 1200 });
    }, { passive: true });
    sheetEl.addEventListener("touchend", function (e) {
      if (!s0) return;
      var dx = e.changedTouches[0].clientX - s0.x, dy = e.changedTouches[0].clientY - s0.y, ax = s0.axis; s0 = null;
      var m = $("#sheetStage > *");
      if (ax === "x" && Math.abs(dx) > 60 && sh.g.items.length > 1) stepSheet((dx < 0 ? 1 : -1) * rtl());
      else if (ax === "y" && dy > 110) closeSheet();
      else if (m) G.to(m, { x: 0, y: 0, scale: 1, duration: .5, ease: "elastic.out(1, .7)" });
    });
  }

  /* =========================================================
     Boot
     ========================================================= */
  [deck, island, dock].forEach(function (n) { n.inert = true; });
  var startId = (location.hash || "").slice(1);
  if (startId === "top") startId = "home";
  var startI = sIndex(startId);
  if (startI > 0) cur = startI;
  renderAll();
  bindLock(); bindInput(); bindPointer(); bindSheet();
  requestAnimationFrame(loop);
  setAmbientFor(cur);
  if (startI > 0) {
    // A shared link to a section skips the lock screen
    unlocked = true; lockEl.classList.add("gone"); lockEl.setAttribute("aria-hidden", "true");
    [deck, island, dock].forEach(function (n) { n.inert = false; });
    activate(cur, true);
  } else {
    G.set([deck, island, dock], { opacity: 0 });
    G.from(".lock-clock, .lock-eye, .lock-brand, .note, .lock-foot", { y: 24, opacity: .15, duration: 1, stagger: .08, ease: "expo.out", clearProps: "transform,opacity", delay: .1 });
    setTimeout(function () { if (!unlocked) try { $("#unlockKnob").focus({ preventScroll: true }); } catch (e) {} }, 400);
  }
})();

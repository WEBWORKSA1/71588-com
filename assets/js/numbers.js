/* 71588.com — number intelligence engine: dictionary, analyzer, generator, pricing, zodiac, dates.
   Cultural-entertainment tool based on common Mandarin/Cantonese homophone traditions. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var DIGITS = {
    "0": { zh: "零", py: "líng", sounds: "灵 líng — spirit, wholeness", pun: "灵", score: 1, note: "A clean start and completeness; neutral-to-positive, often used to 'round out' lucky numbers." },
    "1": { zh: "一 / 幺", py: "yī / yāo", sounds: "要 yào — 'want / will'", pun: "要", score: 1, note: "Unity and being first. Read as yāo it puns with 要 'want', as in 518 我要发." },
    "2": { zh: "二 / 两", py: "èr / liǎng", sounds: "好事成双 — good things come in pairs", pun: "双", score: 2, note: "Harmony and pairs. Couples and business partners like doubled digits." },
    "3": { zh: "三", py: "sān", sounds: "生 shēng (Cantonese saam ≈ sang) — life, birth", pun: "生", score: 1, note: "Life and growth in Cantonese; in Mandarin it can also echo 散 'scatter', so it is mildly mixed." },
    "4": { zh: "四", py: "sì", sounds: "死 sǐ — death", pun: "死", score: -3, note: "The most avoided digit. Many buildings skip 4th/14th floors and buyers discount numbers containing 4." },
    "5": { zh: "五", py: "wǔ", sounds: "我 wǒ — 'me'; 五行 Five Elements", pun: "我", score: 0, note: "Personal ('me') and balanced (Five Elements). Meaning depends on neighbours: 518 good, 514 bad." },
    "6": { zh: "六", py: "liù", sounds: "流 / 溜 liú — smooth, flowing", pun: "顺", score: 3, note: "Things go smoothly — 六六大顺. Also online slang 666 = 'awesome'." },
    "7": { zh: "七", py: "qī", sounds: "起 qǐ — rise; 齐 qí — together", pun: "起", score: 1, note: "Rising and togetherness, and Qixi romance. The 7th lunar month is Ghost Month, so dates are treated with care." },
    "8": { zh: "八", py: "bā", sounds: "发 fā — prosper, make a fortune", pun: "发", score: 4, note: "The king of lucky numbers. Beijing opened the 2008 Olympics at 8:08 pm on 08-08-08." },
    "9": { zh: "九", py: "jiǔ", sounds: "久 jiǔ — long-lasting, eternal", pun: "久", score: 3, note: "Longevity and endurance; historically associated with the emperor. Popular for weddings (99, 999)." }
  };

  var COMBOS = [
    { n: "71588", zh: "起·要我发发", en: "Rise — I want to prosper, and prosper again", s: 3, cat: "prosperity", tag: "Signature" },
    { n: "168", zh: "一路发", en: "Prosperity all the way", s: 3, cat: "prosperity" },
    { n: "1688", zh: "一路发发", en: "Prosperity all the way, doubled", s: 3, cat: "prosperity" },
    { n: "518", zh: "我要发", en: "I will prosper", s: 3, cat: "prosperity" },
    { n: "5188", zh: "我要发发", en: "I will prosper greatly (popular reading)", s: 3, cat: "prosperity" },
    { n: "888", zh: "发发发", en: "Triple prosperity", s: 3, cat: "prosperity" },
    { n: "8888", zh: "发发发发", en: "Ultimate prosperity — record-setting phone and plate sales", s: 3, cat: "prosperity" },
    { n: "88", zh: "发发 / 拜拜", en: "Double prosperity; also internet slang for 'bye-bye'", s: 2, cat: "prosperity" },
    { n: "18", zh: "要发", en: "Will prosper (Cantonese: 实发 'sure to prosper')", s: 3, cat: "prosperity" },
    { n: "28", zh: "易发", en: "Easy prosperity (Cantonese yi-fat) — HK plate '28' sold for HK$18.1M", s: 2, cat: "prosperity" },
    { n: "38", zh: "生发", en: "Growing prosperity", s: 2, cat: "prosperity" },
    { n: "68", zh: "顺发 / 路发", en: "Smooth prosperity", s: 2, cat: "prosperity" },
    { n: "6688", zh: "顺顺发发", en: "Smooth and prosperous", s: 3, cat: "prosperity" },
    { n: "58", zh: "我发", en: "I prosper (Mandarin); Cantonese can hear 唔发 'won't prosper'", s: 1, cat: "prosperity" },
    { n: "66", zh: "六六大顺", en: "Everything goes smoothly", s: 3, cat: "smooth" },
    { n: "666", zh: "溜溜溜", en: "Smooth — and slang for 'awesome / skilful'", s: 3, cat: "smooth" },
    { n: "99", zh: "久久", en: "Forever and ever", s: 2, cat: "love" },
    { n: "999", zh: "久久久", en: "Everlasting — classic wedding number", s: 3, cat: "love" },
    { n: "520", zh: "我爱你", en: "I love you — May 20 is China's internet Valentine's Day", s: 2, cat: "love" },
    { n: "521", zh: "我愿意", en: "I'm willing / I do", s: 2, cat: "love" },
    { n: "1314", zh: "一生一世", en: "For a whole lifetime", s: 2, cat: "love" },
    { n: "5201314", zh: "我爱你一生一世", en: "I love you for a lifetime", s: 2, cat: "love" },
    { n: "3344", zh: "生生世世", en: "Life after life, forever", s: 2, cat: "love" },
    { n: "530", zh: "我想你", en: "I miss you", s: 1, cat: "love" },
    { n: "770", zh: "亲亲你", en: "Kiss you", s: 1, cat: "love" },
    { n: "9420", zh: "就是爱你", en: "It's you I love", s: 1, cat: "love" },
    { n: "886", zh: "拜拜了", en: "Bye-bye (chat slang)", s: 0, cat: "slang" },
    { n: "233", zh: "哈哈哈", en: "LOL (from a laughing emoticon code)", s: 0, cat: "slang" },
    { n: "555", zh: "呜呜呜", en: "Crying sounds", s: -1, cat: "slang" },
    { n: "250", zh: "二百五", en: "Idiot / fool — avoid in gifts and prices", s: -2, cat: "avoid" },
    { n: "14", zh: "要死", en: "'Want to die' — avoided in floors and plates", s: -3, cat: "avoid" },
    { n: "44", zh: "死死", en: "Double death", s: -3, cat: "avoid" },
    { n: "74", zh: "气死", en: "Furious / 'angry to death'", s: -3, cat: "avoid" },
    { n: "514", zh: "我要死", en: "'I want to die'", s: -3, cat: "avoid" },
    { n: "748", zh: "去死吧", en: "'Go die'", s: -3, cat: "avoid" },
    { n: "24", zh: "易死", en: "'Easy death' in Cantonese", s: -2, cat: "avoid" },
    { n: "7456", zh: "气死我了", en: "'I'm so angry'", s: -2, cat: "avoid" }
  ];
  var PUN = { "0": "灵", "1": "要", "2": "双", "3": "生", "4": "死", "5": "我", "6": "顺", "7": "起", "8": "发", "9": "久" };

  function digitsOnly(s) { return String(s || "").replace(/[^0-9]/g, ""); }

  function analyze(raw, mode) {
    var d = digitsOnly(raw);
    if (!d) return null;
    var n = d.length, sum = 0;
    var per = d.split("").map(function (c, i) { var x = DIGITS[c]; sum += x.score; return { c: c, x: x, i: i }; });
    var avg = sum / n;
    var score = 50 + avg * 9;
    var found = [];
    COMBOS.slice().sort(function (a, b) { return b.n.length - a.n.length; }).forEach(function (cb) {
      var idx = d.indexOf(cb.n);
      if (idx > -1 && !found.some(function (f) { return f.n.indexOf(cb.n) > -1 && f.n !== cb.n; })) found.push(cb);
    });
    var cbonus = 0; found.forEach(function (f) { cbonus += f.s * (f.s < 0 ? 6 : 3); });
    score += Math.max(-24, Math.min(20, cbonus));
    var last = DIGITS[d[n - 1]].score; score += last * 2.5;
    var notes = [];
    if (/(\d)\1\1/.test(d)) { var rep = d.match(/(\d)\1\1/)[1]; if (DIGITS[rep].score > 1) { score += 6; notes.push("Triple " + rep + " repetition amplifies its meaning."); } else if (DIGITS[rep].score < 0) { score -= 6; notes.push("Repeated " + rep + " amplifies a negative sound."); } }
    if (/(\d)(\d)\1\2/.test(d)) { score += 3; notes.push("ABAB rhythm — memorable and balanced."); }
    if (/(012|123|234|345|456|567|678|789)/.test(d)) { score += 3; notes.push("Rising sequence — 步步高升, 'step by step, higher and higher'."); }
    if (n > 2 && d === d.split("").reverse().join("")) { score += 4; notes.push("Palindrome — symmetry signals balance."); }
    var fours = (d.match(/4/g) || []).length;
    if (fours) notes.push("Contains " + fours + "× digit 4 — many Chinese buyers discount this.");
    else notes.push("No digit 4 — clears the most common objection.");
    var eights = (d.match(/8/g) || []).length;
    if (eights) notes.push(eights + "× digit 8 (发 prosper).");
    if (d[n - 1] === "8") notes.push("Ends in 8 — the ending carries the most weight in many readings.");
    if (mode === "phone" && n >= 4) notes.push("Phone numbers: the last 4 digits (" + d.slice(-4) + ") matter most to buyers.");
    if (mode === "plate") notes.push("Plates: short numbers and repeated 8/6/9 command the highest auction premiums.");
    if (mode === "price") notes.push("Pricing: endings like 8, 88, 68 and 168 are widely used in Chinese retail; avoid 4 and 250.");
    if (mode === "domain") notes.push("Numeric domains: shorter is rarer; 4-free, 8-heavy strings are most liquid with Chinese buyers.");
    score = Math.round(Math.max(1, Math.min(99, score)));
    var tier = score >= 90 ? ["大吉", "Supreme fortune", "great"] : score >= 75 ? ["吉", "Very lucky", "great"] : score >= 60 ? ["小吉", "Favourable", "good"] : score >= 45 ? ["平", "Neutral", ""] : score >= 30 ? ["杂", "Mixed", "bad"] : ["凶", "Use with caution", "bad"];
    var reading = d.split("").map(function (c) { return PUN[c]; }).join("");
    return { d: d, per: per, score: score, tier: tier, combos: found, notes: notes, reading: reading };
  }

  function renderAnalysis(res, box) {
    if (!res) { box.innerHTML = '<p class="muted">Enter at least one digit.</p>'; return; }
    var h = '<div class="grid g2" style="align-items:center">' +
      '<div class="center"><div class="gauge" style="--p:' + res.score + '"><div><div><b>' + res.score + '</b><div class="small muted">/ 100</div></div></div></div>' +
      '<h3 style="margin-top:14px"><span class="zh">' + res.tier[0] + "</span> · " + res.tier[1] + "</h3>" +
      '<p class="muted small">Sound-alike reading: <span class="zh" style="font-size:1.2rem;color:var(--red)">' + esc(res.reading) + "</span></p></div>" +
      "<div><h3>What each digit says</h3><div class=\"result-digits\" style=\"justify-content:flex-start\">" +
      res.per.map(function (p) { var cls = p.x.score >= 3 ? "great" : p.x.score >= 1 ? "good" : p.x.score < 0 ? "bad" : ""; return '<div class="rd ' + cls + '" title="' + esc(p.x.sounds) + '"><b>' + p.c + '</b><small>' + PUN[p.c] + "</small></div>"; }).join("") +
      "</div><ul class=\"clean combo-list\">" + res.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div></div>";
    if (res.combos.length) {
      h += '<h3 style="margin-top:24px">Meaningful combinations found</h3><div class="grid g2">' + res.combos.map(function (c) {
        return '<div class="card" style="padding:16px"><span class="tag ' + (c.s < 0 ? "red" : c.s >= 3 ? "" : "jade") + '">' + c.n + '</span> <b class="zh" style="font-size:1.15rem">' + c.zh + '</b><p class="small" style="margin-top:6px">' + esc(c.en) + "</p></div>";
      }).join("") + "</div>";
    }
    box.innerHTML = h;
    try { localStorage.setItem("last-number", res.d); } catch (e) {}
  }

  /* ---------- Analyzer UI ---------- */
  var af = $("#analyzer-form");
  if (af) {
    var box = $("#analyzer-result"), modeSel = $("#analyzer-mode");
    var run = function () {
      var v = $("#analyzer-input").value;
      var r = analyze(v, modeSel ? modeSel.value : "any");
      renderAnalysis(r, box);
      $$(".after-analysis").forEach(function (el) { el.classList.toggle("hidden", !r); });
      var hn = $("#report-number"); if (hn && r) hn.value = r.d + " (score " + r.score + ")";
      if (r && history.replaceState) history.replaceState(null, "", "?n=" + r.d + (modeSel ? "&mode=" + modeSel.value : ""));
    };
    af.addEventListener("submit", function (e) { e.preventDefault(); run(); });
    $$("[data-mode]").forEach(function (c) { c.addEventListener("click", function () { $$("[data-mode]").forEach(function (x) { x.classList.remove("active"); }); c.classList.add("active"); if (modeSel) modeSel.value = c.getAttribute("data-mode"); var ph = c.getAttribute("data-ph"); if (ph) $("#analyzer-input").placeholder = ph; }); });
    var q = new URLSearchParams(location.search);
    if (q.get("n")) { $("#analyzer-input").value = q.get("n"); if (q.get("mode") && modeSel) modeSel.value = q.get("mode"); run(); }
  }

  /* Home hero quick analyzer -> analyzer page */
  var hq = $("#hero-analyze");
  if (hq) hq.addEventListener("submit", function (e) { e.preventDefault(); var v = digitsOnly($("#hero-number").value); location.href = "analyzer.html" + (v ? "?n=" + v : ""); });

  /* ---------- Dictionary UI ---------- */
  var dict = $("#dictionary");
  if (dict) {
    var digitsHtml = Object.keys(DIGITS).map(function (k) {
      var x = DIGITS[k], cls = x.score >= 3 ? "good" : x.score < 0 ? "bad" : "";
      var stars = x.score < 0 ? "✕" : "★★★★★".slice(0, Math.max(1, Math.min(5, x.score + 1)));
      return '<div class="card dict-card" data-cat="digit" data-q="' + k + " " + x.zh + " " + x.py + " " + esc(x.sounds) + '"><div class="dict-num ' + cls + '">' + k + '</div><div><h3><span class="zh">' + x.zh + "</span> · " + x.py + '</h3><p class="small"><b>Sounds like:</b> <span class="zh">' + esc(x.sounds) + '</span></p><p class="small">' + esc(x.note) + '</p><span class="stars">' + stars + "</span></div></div>";
    }).join("");
    var combosHtml = COMBOS.map(function (c) {
      var cls = c.s >= 3 ? "good" : c.s < 0 ? "bad" : "";
      return '<div class="card dict-card" data-cat="' + c.cat + '" data-q="' + c.n + " " + c.zh + " " + esc(c.en) + '"><div class="dict-num ' + cls + '" style="font-size:' + (c.n.length > 4 ? "1.1rem" : "1.5rem") + '">' + c.n + '</div><div><h3 class="zh">' + c.zh + '</h3><p class="small">' + esc(c.en) + '</p><a class="small" href="analyzer.html?n=' + c.n + '">Analyze ' + c.n + " →</a></div></div>";
    }).join("");
    dict.innerHTML = digitsHtml + combosHtml;
    var filter = function () {
      var q = ($("#dict-search").value || "").toLowerCase().trim(), cat = ($(".chip.active[data-cat]") || {}).getAttribute ? $(".chip.active[data-cat]").getAttribute("data-cat") : "all";
      var shown = 0;
      $$(".dict-card", dict).forEach(function (el) {
        var ok = (cat === "all" || el.getAttribute("data-cat") === cat) && (!q || el.getAttribute("data-q").toLowerCase().indexOf(q) > -1);
        el.classList.toggle("hidden", !ok); if (ok) shown++;
      });
      $("#dict-count").textContent = shown + " entries";
    };
    $("#dict-search").addEventListener("input", filter);
    $$(".chip[data-cat]").forEach(function (c) { c.addEventListener("click", function () { $$(".chip[data-cat]").forEach(function (x) { x.classList.remove("active"); }); c.classList.add("active"); filter(); }); });
    filter();
  }

  /* ---------- Number of the day ---------- */
  $$("[data-notd]").forEach(function (el) {
    var t = new Date(), seed = t.getFullYear() * 372 + t.getMonth() * 31 + t.getDate();
    var pool = COMBOS.filter(function (c) { return c.s >= 2; }); var c = pool[seed % pool.length];
    el.innerHTML = '<div class="digits">' + c.n.split("").map(function (x) { return '<div class="digit">' + x + "<small>" + PUN[x] + "</small></div>"; }).join("") + '</div><div class="reading">' + c.zh + '</div><p style="color:#f3e6c8">' + esc(c.en) + '</p><a class="btn btn-gold btn-sm" href="analyzer.html?n=' + c.n + '">Analyze it →</a>';
  });

  /* ---------- Generator ---------- */
  var gf = $("#generator-form");
  if (gf) {
    gf.addEventListener("submit", function (e) {
      e.preventDefault();
      var len = Math.max(2, Math.min(12, parseInt($("#gen-length").value, 10) || 6));
      var style = $("#gen-style").value, must = digitsOnly($("#gen-include").value), end8 = $("#gen-end8").checked;
      var weights = { prosperity: "8886889916", smooth: "6668896619", longevity: "9998869916", love: "5201314998", balanced: "8691235708" }[style] || "8869";
      var seen = {}, out = [];
      for (var t = 0; t < 4000 && out.length < 60; t++) {
        var s = "";
        while (s.length < len) s += weights[Math.floor(Math.random() * weights.length)];
        if (must) { var pos = Math.floor(Math.random() * Math.max(1, len - must.length + 1)); s = (s.slice(0, pos) + must + s.slice(pos)).slice(0, Math.max(len, must.length)); }
        s = s.replace(/4/g, "8");
        if (end8) s = s.slice(0, -1) + "8";
        if (seen[s]) continue; seen[s] = 1;
        out.push(analyze(s));
      }
      out.sort(function (a, b) { return b.score - a.score; });
      $("#generator-result").innerHTML = out.slice(0, 12).map(function (r) {
        return '<a class="card" style="padding:16px" href="analyzer.html?n=' + r.d + '"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:1.4rem;letter-spacing:.06em">' + r.d + '</b><span class="tag">' + r.score + '</span></div><div class="zh muted small" style="margin-top:4px">' + r.reading + "</div></a>";
      }).join("");
    });
  }

  /* ---------- Lucky price finder ---------- */
  var pf = $("#price-form");
  if (pf) {
    pf.addEventListener("submit", function (e) {
      e.preventDefault();
      var p = parseFloat($("#price-base").value); if (!(p > 0)) return;
      var lo = p * 0.85, hi = p * 1.12, cands = {};
      var mags = [1, 10, 100, 1000, 10000, 100000];
      mags.forEach(function (m) {
        for (var k = Math.floor(lo / m); k <= Math.ceil(hi / m); k++) {
          [8, 88, 68, 98, 168, 888, 188, 288, 388, 588, 688, 988].forEach(function (end) {
            var base = Math.pow(10, String(end).length);
            var v = Math.floor(k * m / base) * base + end;
            if (v >= lo && v <= hi) cands[v] = 1;
          });
        }
      });
      if (p < 100) { [p - (p % 1) + 0.88, Math.floor(p) + 0.68, Math.floor(p) - 1 + 0.88].forEach(function (v) { if (v >= lo && v <= hi) cands[v.toFixed(2)] = 1; }); }
      var list = Object.keys(cands).map(Number).filter(function (v) { return String(v).indexOf("4") < 0 && String(v).indexOf("250") < 0; })
        .map(function (v) { var r = analyze(String(v)); return { v: v, r: r, diff: Math.abs(v - p) / p }; })
        .sort(function (a, b) { return (b.r.score - b.diff * 120) - (a.r.score - a.diff * 120); }).slice(0, 8);
      $("#price-result").innerHTML = list.length ? list.map(function (x) {
        var pct = ((x.v - p) / p * 100).toFixed(1);
        return '<div class="card" style="padding:16px"><b style="font-size:1.5rem">' + x.v.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</b> <span class="tag">' + x.r.score + '</span><p class="small muted" style="margin:6px 0 0">' + (pct > 0 ? "+" : "") + pct + "% vs your price · <span class=\"zh\">" + x.r.reading + "</span></p></div>";
      }).join("") : '<p class="muted">Try a slightly different base price.</p>';
    });
  }

  /* ---------- Zodiac ---------- */
  var ANIMALS = [
    { en: "Rat", zh: "鼠", lucky: "2, 3", traits: "Quick-witted, resourceful, thrifty" },
    { en: "Ox", zh: "牛", lucky: "1, 4", traits: "Diligent, dependable, determined" },
    { en: "Tiger", zh: "虎", lucky: "1, 3, 4", traits: "Brave, competitive, confident" },
    { en: "Rabbit", zh: "兔", lucky: "3, 4, 6", traits: "Gentle, elegant, responsible" },
    { en: "Dragon", zh: "龙", lucky: "1, 6, 7", traits: "Ambitious, energetic, charismatic" },
    { en: "Snake", zh: "蛇", lucky: "2, 8, 9", traits: "Wise, intuitive, discreet" },
    { en: "Horse", zh: "马", lucky: "2, 3, 7", traits: "Active, independent, warm-hearted" },
    { en: "Goat", zh: "羊", lucky: "3, 4, 9", traits: "Creative, calm, kind" },
    { en: "Monkey", zh: "猴", lucky: "4, 9", traits: "Clever, curious, playful" },
    { en: "Rooster", zh: "鸡", lucky: "5, 7, 8", traits: "Observant, hardworking, courageous" },
    { en: "Dog", zh: "狗", lucky: "3, 4, 9", traits: "Loyal, honest, protective" },
    { en: "Pig", zh: "猪", lucky: "2, 5, 8", traits: "Generous, compassionate, easy-going" }
  ];
  var ELEMENTS = [["Wood", "木"], ["Fire", "火"], ["Earth", "土"], ["Metal", "金"], ["Water", "水"]];
  function lunar(date) {
    try {
      var parts = new Intl.DateTimeFormat("en-u-ca-chinese", { year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC" }).formatToParts(date);
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var y = parseInt(o.relatedYear || o.year, 10);
      if (isNaN(y) || y < 1000) throw 0;
      return { year: y, month: String(o.month), day: parseInt(o.day, 10), leap: /bis|leap/i.test(o.month), exact: true };
    } catch (e) {
      var yy = date.getUTCFullYear(); if (date.getUTCMonth() === 0 || (date.getUTCMonth() === 1 && date.getUTCDate() < 4)) yy--;
      return { year: yy, month: "?", day: NaN, exact: false };
    }
  }
  function sign(year) { var a = ANIMALS[((year - 4) % 12 + 12) % 12], st = ((year - 4) % 10 + 10) % 10; return { a: a, el: ELEMENTS[Math.floor(st / 2)], yin: st % 2 === 1 }; }
  window.NUM71588 = { analyze: analyze, lunar: lunar, sign: sign, DIGITS: DIGITS, COMBOS: COMBOS };

  var zf = $("#zodiac-form");
  if (zf) {
    zf.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("#zodiac-date").value; if (!v) return;
      var dt = new Date(v + "T12:00:00Z"), L = lunar(dt), s = sign(L.year);
      $("#zodiac-result").innerHTML = '<div class="card" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap"><div class="dict-num good" style="font-size:2.6rem;width:110px;height:110px" ><span class="zh">' + s.a.zh + '</span></div><div><h2 style="margin:0">' + s.el[0] + " " + s.a.en + ' <span class="zh muted" style="font-size:1.2rem">' + s.el[1] + s.a.zh + '</span></h2><p class="muted">' + (s.yin ? "Yin" : "Yang") + " · Lunar year " + L.year + (L.exact ? " · Lunar date: month " + L.month + ", day " + L.day : " · (approximate — your browser lacks Chinese-calendar support)") + '</p><p><b>Traits:</b> ' + s.a.traits + '</p><p><b>Traditionally lucky numbers:</b> ' + s.a.lucky + ' <span class="small muted">(sources vary)</span></p><a class="btn btn-primary btn-sm" href="blueprint.html?topic=Personal%20lucky%20numbers%20(' + s.a.en + ')">Get my personal number blueprint →</a></div></div>';
    });
  }
  var cf = $("#compat-form");
  if (cf) {
    var opts = ANIMALS.map(function (a, i) { return '<option value="' + i + '">' + a.en + " " + a.zh + "</option>"; }).join("");
    $("#compat-a").innerHTML = opts; $("#compat-b").innerHTML = opts; $("#compat-b").value = "4";
    var TRI = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]], SIX = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]], CLASH = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];
    function has(list, a, b) { return list.some(function (g) { return g.indexOf(a) > -1 && g.indexOf(b) > -1; }); }
    cf.addEventListener("submit", function (e) {
      e.preventDefault();
      var a = +$("#compat-a").value, b = +$("#compat-b").value, sc, txt;
      if (a === b) { sc = 70; txt = "Same sign — you understand each other instinctively, but share the same blind spots."; }
      else if (has(SIX, a, b)) { sc = 95; txt = "Six Harmonies (六合) — a classic, highly supportive pairing."; }
      else if (has(TRI, a, b)) { sc = 90; txt = "Triad allies (三合) — shared values and natural teamwork."; }
      else if (has(CLASH, a, b)) { sc = 35; txt = "Six Clashes (六冲) — opposite signs; strong attraction or friction. Needs patience."; }
      else { sc = 62; txt = "Neutral pairing — success depends on effort, not stars."; }
      $("#compat-result").innerHTML = '<div class="card"><h3>' + ANIMALS[a].en + " + " + ANIMALS[b].en + ": " + sc + '/100</h3><div class="bar"><i style="width:' + sc + '%"></i></div><p style="margin-top:10px">' + txt + "</p></div>";
    });
  }
  var zt = $("#zodiac-table");
  if (zt) {
    var cy = lunar(new Date()).year, rows = "";
    ANIMALS.forEach(function (a, i) {
      var ys = []; for (var y = 1936; y <= 2031; y++) if (((y - 4) % 12 + 12) % 12 === i) ys.push(y);
      rows += "<tr><td><b>" + a.en + '</b> <span class="zh">' + a.zh + "</span></td><td>" + ys.join(", ") + "</td><td>" + a.lucky + "</td><td>" + a.traits + "</td></tr>";
    });
    zt.innerHTML = rows;
    var cs = sign(cy), el = $("#current-year"); if (el) el.textContent = cy + " — Year of the " + cs.el[0] + " " + cs.a.en + " (" + cs.el[1] + cs.a.zh + ")";
  }

  /* ---------- Auspicious date calendar ---------- */
  var dcal = $("#date-cal");
  if (dcal) {
    var mi = $("#date-month");
    var now = new Date(); mi.value = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    var draw = function () {
      var parts = mi.value.split("-"), Y = +parts[0], M = +parts[1] - 1;
      var first = new Date(Date.UTC(Y, M, 1)), days = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();
      var h = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(function (x) { return '<div class="hd">' + x + "</div>"; }).join("");
      for (var i = 0; i < first.getUTCDay(); i++) h += '<div class="hd"></div>';
      var best = [];
      for (var d = 1; d <= days; d++) {
        var dt = new Date(Date.UTC(Y, M, d)), L = lunar(dt), mm = String(M + 1), dd = String(d);
        var r = analyze(mm + dd), sc = r.score, flags = [];
        if (dd.indexOf("8") > -1) { sc += 6; }
        if (dd.indexOf("4") > -1) { sc -= 12; flags.push("4"); }
        if (L.exact && [8, 18, 28].indexOf(L.day) > -1) { sc += 6; flags.push("lunar " + L.day); }
        var ghost = L.exact && String(L.month) === "7" && !L.leap;
        if (ghost) { sc -= 25; flags.push("Ghost Month"); }
        if (L.exact && L.month === "1" && L.day <= 15) { sc += 5; flags.push("New Year period"); }
        sc = Math.max(1, Math.min(99, Math.round(sc)));
        var cls = ghost || sc < 45 ? "d-caution" : sc >= 80 ? "d-great" : sc >= 62 ? "d-good" : "";
        if (!ghost && sc >= 80) best.push(Y + "-" + (M + 1) + "-" + d + " (" + sc + ")");
        h += '<div class="' + cls + '" title="' + flags.join(", ") + '"><b>' + d + "</b><small>" + (L.exact ? "L" + L.month + "/" + L.day : "") + "</small><small>" + sc + "</small></div>";
      }
      dcal.innerHTML = h;
      $("#date-best").innerHTML = best.length ? "<b>Top-scoring dates:</b> " + best.slice(0, 8).join(" · ") : "No top-tier dates this month — check the next month.";
    };
    mi.addEventListener("change", draw); draw();
  }
})();

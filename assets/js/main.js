/* 71588.com — core site behaviour: theme, nav, forms, ads, videos, donations, UX helpers */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Private inbox resolver (never rendered to the page) ---------- */
  function inbox() {
    var r = C._r || [];
    return r.slice().reverse().map(function (n) { return String.fromCharCode(n ^ 71); }).join("");
  }
  function endpoint() {
    return "https://formsubmit.co/ajax/" + (C.formAlias ? C.formAlias : inbox());
  }
  window.SITE_MAIL = function (subject, body) {
    var href = "mail" + "to:" + inbox() + "?subject=" + encodeURIComponent(subject || "71588.com inquiry") + (body ? "&body=" + encodeURIComponent(body) : "");
    window.location.href = href;
  };

  /* ---------- Theme ---------- */
  var saved = store("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      var dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next); store("theme", next);
    });
  });

  /* ---------- Mobile nav ---------- */
  var burger = $(".burger"), menu = $(".menu");
  if (burger && menu) burger.addEventListener("click", function () {
    var o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o ? "true" : "false");
  });
  var path = location.pathname.split("/").pop() || "index.html";
  $$(".menu a").forEach(function (a) { if (a.getAttribute("href") === path) a.setAttribute("aria-current", "page"); });

  /* ---------- Mail links (address built on click only) ---------- */
  $$("[data-mail]").forEach(function (a) {
    a.setAttribute("href", "#contact");
    a.addEventListener("click", function (e) { e.preventDefault(); window.SITE_MAIL(a.getAttribute("data-mail") || "71588.com inquiry"); });
  });

  /* ---------- Forms ---------- */
  function serialize(form) {
    var data = {};
    $$("input,select,textarea", form).forEach(function (el) {
      if (!el.name || el.name === "_honey") return;
      if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
      if (data[el.name]) data[el.name] += ", " + el.value; else data[el.name] = el.value;
    });
    return data;
  }
  function status(form, cls, msg) {
    var s = $(".form-status", form);
    if (!s) { s = document.createElement("div"); s.className = "form-status"; s.setAttribute("role", "status"); form.appendChild(s); }
    s.className = "form-status " + cls; s.textContent = msg;
  }
  window.SITE_SUBMIT = function (form, extra) {
    var hp = form.querySelector("[name=_honey]");
    if (hp && hp.value) return Promise.resolve(true);
    var data = serialize(form);
    var name = form.getAttribute("data-form") || "General inquiry";
    data._subject = "[71588.com] " + name + (data.name ? " — " + data.name : "");
    data._template = "table"; data._captcha = "false";
    data["Form"] = name; data["Page"] = location.href; data["Submitted"] = new Date().toISOString();
    if (extra) for (var k in extra) data[k] = extra[k];
    if (data.email) data._replyto = data.email;
    var btn = form.querySelector("[type=submit]"); if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending…"; }
    return fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(j.message || "Send failed"); return j; }); })
      .then(function () {
        status(form, "ok", form.getAttribute("data-success") || "Thank you! Your message was received — we reply within 1–2 business days.");
        form.reset(); if (window.gtag) window.gtag("event", "generate_lead", { form_name: name });
        return true;
      })
      .catch(function () {
        status(form, "err", "Our form service didn't respond. Opening your email app instead so nothing is lost…");
        var body = Object.keys(data).filter(function (k) { return k.charAt(0) !== "_"; }).map(function (k) { return k + ": " + data[k]; }).join("\n");
        setTimeout(function () { window.SITE_MAIL(data._subject, body); }, 900);
        return false;
      })
      .finally(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t; } });
  };
  $$("form[data-form]").forEach(function (form) {
    if (!form.querySelector("[name=_honey]")) {
      var hp = document.createElement("input"); hp.type = "text"; hp.name = "_honey"; hp.className = "hp"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true"); form.appendChild(hp);
    }
    if (form.hasAttribute("data-custom")) return;
    form.addEventListener("submit", function (e) { e.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; } window.SITE_SUBMIT(form); });
  });

  /* ---------- Multi-step forms ---------- */
  $$("[data-multistep]").forEach(function (form) {
    var steps = $$(".step", form), bars = $$(".steps span", form), i = 0;
    function show(n) {
      i = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach(function (s, k) { s.classList.toggle("active", k === i); });
      bars.forEach(function (b, k) { b.classList.toggle("on", k <= i); });
    }
    $$("[data-next]", form).forEach(function (b) { b.addEventListener("click", function () {
      var ok = $$("input,select,textarea", steps[i]).every(function (el) { return el.checkValidity(); });
      if (!ok) { $$("input,select,textarea", steps[i]).some(function (el) { if (!el.checkValidity()) { el.reportValidity(); return true; } }); return; }
      show(i + 1);
    }); });
    $$("[data-prev]", form).forEach(function (b) { b.addEventListener("click", function () { show(i - 1); }); });
    show(0);
  });

  /* ---------- Prefill from query (?topic=...&number=...) ---------- */
  var qs = new URLSearchParams(location.search);
  qs.forEach(function (v, k) { $$('[name="' + k + '"]').forEach(function (el) { if (el.type !== "radio" && el.type !== "checkbox") el.value = v; }); });

  /* ---------- Ads: AdSense if configured, house ads otherwise ---------- */
  var slots = $$(".ad-slot");
  if (C.adsenseClient && slots.length) {
    var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsenseClient;
    document.head.appendChild(s);
    slots.forEach(function (slot) {
      var type = slot.getAttribute("data-ad") || "banner";
      slot.classList.add("has-ad");
      slot.innerHTML = '<ins class="adsbygoogle" style="display:block;width:100%" data-ad-client="' + C.adsenseClient + '"' +
        (C.adsenseSlots && C.adsenseSlots[type] ? ' data-ad-slot="' + C.adsenseSlots[type] + '"' : "") +
        ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  } else {
    var house = [
      ["Your brand here — reach a prosperity-minded audience", "advertise.html", "See ad packages"],
      ["Sponsor the Lucky 88 Challenge", "advertise.html#sponsor", "Become a sponsor"],
      ["Own a lucky number? Get a free valuation", "marketplace.html#sell", "Get valuation"],
      ["Free Prosperity Blueprint for your business", "blueprint.html", "Get my blueprint"]
    ];
    slots.forEach(function (slot, k) {
      var h = house[k % house.length];
      slot.innerHTML = '<div><span class="ad-label">Advertisement</span><strong>' + h[0] + '</strong><br><a class="btn btn-sm btn-ghost" style="margin-top:8px" href="' + h[1] + '">' + h[2] + " →</a></div>";
    });
  }

  /* ---------- Analytics (optional) ---------- */
  if (C.gaId && store("cookie-ok") === "1") {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + C.gaId; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); }; window.gtag("js", new Date()); window.gtag("config", C.gaId);
  }

  /* ---------- Videos (lite YouTube facade) ---------- */
  function videoEl(v) {
    var d = document.createElement("div");
    d.className = "card"; d.style.padding = "12px";
    d.innerHTML = '<div class="video" role="button" tabindex="0" aria-label="Play: ' + v.title.replace(/"/g, "") + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg"><div class="play"><span>▶</span></div></div>' +
      '<div style="padding:12px 4px 4px"><span class="tag">' + (v.topic || "Video") + '</span><h3 style="margin-top:8px;font-size:1.02rem">' + v.title + '</h3><p class="small muted" style="margin:0">' + (v.channel || "") + "</p></div>";
    var box = d.querySelector(".video");
    function play() { box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0" title="' + v.title.replace(/"/g, "") + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; }
    box.addEventListener("click", play); box.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
    return d;
  }
  $$("[data-videos]").forEach(function (wrap) {
    var n = parseInt(wrap.getAttribute("data-videos"), 10) || 99;
    (C.videos || []).slice(0, n).forEach(function (v) { wrap.appendChild(videoEl(v)); });
  });

  /* ---------- Donations ---------- */
  window.SITE_DONATE = function (amount, note) {
    amount = amount || "";
    var sl = C.stripeLinks && C.stripeLinks[amount];
    if (sl) { window.open(sl, "_blank", "noopener"); return; }
    if (C.paypalEnabled) {
      var u = "https://www.paypal.com/donate?business=" + encodeURIComponent(inbox()) + "&currency_code=" + (C.currency || "USD") +
        (amount ? "&amount=" + amount : "") + "&item_name=" + encodeURIComponent(note || "Support 71588.com operations");
      window.open(u, "_blank", "noopener"); return;
    }
    location.href = "support.html#pledge";
  };
  $$("[data-donate]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); window.SITE_DONATE(b.getAttribute("data-donate"), b.getAttribute("data-note")); }); });
  $$("[data-link]").forEach(function (a) { var u = C[a.getAttribute("data-link")]; if (u) { a.href = u; a.classList.remove("hidden"); } });
  var social = $("[data-social]");
  if (social && C.social) Object.keys(C.social).forEach(function (k) { if (C.social[k]) { var li = document.createElement("li"); li.innerHTML = '<a rel="noopener" target="_blank" href="' + C.social[k] + '">' + k.charAt(0).toUpperCase() + k.slice(1) + "</a>"; social.appendChild(li); } });

  /* ---------- Countdown ---------- */
  $$("[data-countdown]").forEach(function (el) {
    var end = new Date(el.getAttribute("data-countdown") || (C.contest && C.contest.deadline)).getTime();
    function tick() {
      var d = Math.max(0, end - Date.now()), s = Math.floor(d / 1000);
      var parts = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      el.innerHTML = ["Days", "Hours", "Min", "Sec"].map(function (l, k) { return "<div><b>" + parts[k] + "</b><small>" + l + "</small></div>"; }).join("");
    }
    tick(); setInterval(tick, 1000);
  });

  /* ---------- Fund progress ---------- */
  $$("[data-fund]").forEach(function (el) {
    var g = C.fundGoal || 8888, r = C.fundRaised || 0, p = Math.min(100, Math.round(r / g * 100));
    el.innerHTML = '<div class="progress"><i style="width:' + Math.max(p, 2) + '%"></i></div><p class="small muted" style="margin-top:8px">$' + r.toLocaleString() + " raised of $" + g.toLocaleString() + " operating goal (" + p + "%)</p>";
  });

  /* ---------- Tabs ---------- */
  $$("[data-tabs]").forEach(function (t) {
    var btns = $$(".tabs button", t), panels = $$(".tabpanel", t);
    btns.forEach(function (b, k) { b.addEventListener("click", function () {
      btns.forEach(function (x) { x.classList.remove("active"); }); panels.forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active"); if (panels[k]) panels[k].classList.add("active");
    }); });
  });

  /* ---------- Modal (exit-intent lead capture, once per visitor) ---------- */
  var modal = $("#lead-modal");
  function openModal() { if (modal && store("modal-seen") !== "1") { modal.classList.add("show"); store("modal-seen", "1"); } }
  if (modal) {
    $$("[data-close]", modal).forEach(function (b) { b.addEventListener("click", function () { modal.classList.remove("show"); }); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.remove("show"); });
    document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY < 8) openModal(); });
    setTimeout(function () { if (window.scrollY > 1200) openModal(); }, 45000);
  }

  /* ---------- Cookie notice ---------- */
  var ck = $(".cookie");
  if (ck && !store("cookie-ok")) { ck.classList.add("show"); }
  $$("[data-cookie]").forEach(function (b) { b.addEventListener("click", function () { store("cookie-ok", b.getAttribute("data-cookie")); ck.classList.remove("show"); }); });

  /* ---------- Back to top + reveal ---------- */
  var top = $(".to-top");
  window.addEventListener("scroll", function () { if (top) top.classList.toggle("show", window.scrollY > 700); }, { passive: true });
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("in"); });

  /* ---------- Share ---------- */
  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-share") || document.title, u = location.href;
      if (navigator.share) navigator.share({ title: t, url: u }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(t + " " + u).then(function () { b.textContent = "Link copied ✓"; });
    });
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

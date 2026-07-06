(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── scroll reveal ── */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ── back-to-top button ── */
  const backTop = document.getElementById("backTop");
  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.hidden = window.scrollY < 400;
      backTop.classList.toggle("visible", window.scrollY >= 400);
    }, { passive: true });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ── BPM jitter ── */
  const bpmEl = document.getElementById("bpm");
  if (bpmEl && !reduced) {
    setInterval(() => { bpmEl.textContent = 57 + Math.floor(Math.random() * 10); }, 1900);
  }

  /* ── cursor glow on pillar cards ── */
  document.querySelectorAll(".pillar-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ── tabs ── */
  const tabs     = document.querySelectorAll(".tab");
  const panels   = document.querySelectorAll(".tab-panel");
  const underline = document.getElementById("tabUnderline");

  function moveUnderline(tab) {
    if (!underline) return;
    underline.style.width     = `${tab.offsetWidth}px`;
    underline.style.transform = `translateX(${tab.offsetLeft - 5}px)`;
  }

  function activateTab(tab) {
    tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    const target = tab.dataset.tab;
    panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === target));
    moveUnderline(tab);
    // make sure active tab is visible when row scrolls
    tab.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab)));

  function initUnderline() {
    const active = document.querySelector(".tab.active");
    if (active) moveUnderline(active);
  }
  window.addEventListener("load", initUnderline);
  window.addEventListener("resize", initUnderline);

  /* ── quotes: typewriter + pills ── */
  const quotes = [
    "I've buried better people than you.",
    "Trust actions. Words are cheap.",
    "The good news is you're not dying. Yet.",
    "I don't trust optimists. They make terrible decisions.",
  ];

  const quoteTextEl = document.getElementById("quoteText");
  const quoteListEl = document.getElementById("quoteList");
  let quoteIndex = 0;
  let typeTimer  = null;
  let cycleTimer = null;

  quotes.forEach((q, i) => {
    const pill = document.createElement("button");
    pill.className = "quote-pill";
    pill.type = "button";
    pill.textContent = `#${i + 1}`;
    pill.addEventListener("click", () => showQuote(i, true));
    quoteListEl.appendChild(pill);
  });

  function setActivePill(i) {
    quoteListEl.querySelectorAll(".quote-pill")
      .forEach((p, idx) => p.classList.toggle("active", idx === i));
  }

  function typeQuote(text) {
    if (reduced) { quoteTextEl.textContent = text; return; }
    clearInterval(typeTimer);
    quoteTextEl.textContent = "";
    quoteTextEl.classList.add("cursor-blink");
    let i = 0;
    typeTimer = setInterval(() => {
      quoteTextEl.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(typeTimer); quoteTextEl.classList.remove("cursor-blink"); }
    }, 26);
  }

  function showQuote(i, manual) {
    quoteIndex = i;
    setActivePill(i);
    typeQuote(quotes[i]);
    if (manual) { clearInterval(cycleTimer); startCycle(); }
  }

  function startCycle() {
    if (reduced) return;
    clearInterval(cycleTimer);
    cycleTimer = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      showQuote(quoteIndex, false);
    }, 6000);
  }

  showQuote(0, false);
  startCycle();

  /* ── polaroid lightbox ── */
  const lightbox        = document.getElementById("lightbox");
  const lightboxImg     = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose   = document.getElementById("lightboxClose");

  function openLightbox(src, caption) {
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".polaroid").forEach((fig) => {
    fig.addEventListener("click", () => {
      const img     = fig.querySelector("img");
      const caption = fig.dataset.caption || (fig.querySelector("figcaption") || {}).textContent || "";
      if (img) openLightbox(img.src, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", (e) => { e.stopPropagation(); closeLightbox(); });
  if (lightbox) {
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });
})();

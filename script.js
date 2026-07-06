(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---- BPM jitter ---- */
  const bpmEl = document.getElementById("bpm");
  if (bpmEl && !prefersReducedMotion) {
    setInterval(() => {
      const bpm = 58 + Math.floor(Math.random() * 9);
      bpmEl.textContent = bpm;
    }, 1800);
  }

  /* ---- cursor glow on pillar cards ---- */
  document.querySelectorAll(".pillar-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  /* ---- tabs ---- */
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  const underline = document.getElementById("tabUnderline");

  function moveUnderline(tab) {
    if (!underline) return;
    underline.style.width = `${tab.offsetWidth}px`;
    underline.style.transform = `translateX(${tab.offsetLeft - 5}px)`;
  }

  function activateTab(tab) {
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const target = tab.dataset.tab;
    panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === target));
    moveUnderline(tab);
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab)));

  window.addEventListener("load", () => {
    const active = document.querySelector(".tab.active");
    if (active) moveUnderline(active);
  });
  window.addEventListener("resize", () => {
    const active = document.querySelector(".tab.active");
    if (active) moveUnderline(active);
  });

  /* ---- quotes: typewriter + clickable pills ---- */
  const quotes = [
    "I've buried better people than you.",
    "Trust actions. Words are cheap.",
    "The good news is you're not dying. Yet.",
    "I don't trust optimists. They make terrible decisions.",
  ];

  const quoteTextEl = document.getElementById("quoteText");
  const quoteListEl = document.getElementById("quoteList");
  let quoteIndex = 0;
  let typeTimer = null;
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
    quoteListEl.querySelectorAll(".quote-pill").forEach((p, idx) => {
      p.classList.toggle("active", idx === i);
    });
  }

  function typeQuote(text) {
    if (prefersReducedMotion) {
      quoteTextEl.textContent = text;
      quoteTextEl.classList.remove("cursor-blink");
      return;
    }
    clearInterval(typeTimer);
    quoteTextEl.textContent = "";
    quoteTextEl.classList.add("cursor-blink");
    let i = 0;
    typeTimer = setInterval(() => {
      quoteTextEl.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) {
        clearInterval(typeTimer);
        quoteTextEl.classList.remove("cursor-blink");
      }
    }, 28);
  }

  function showQuote(i, manual) {
    quoteIndex = i;
    setActivePill(i);
    typeQuote(quotes[i]);
    if (manual) {
      clearInterval(cycleTimer);
      startCycle();
    }
  }

  function startCycle() {
    if (prefersReducedMotion) return;
    clearInterval(cycleTimer);
    cycleTimer = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      showQuote(quoteIndex, false);
    }, 6000);
  }

  showQuote(0, false);
  startCycle();
})();

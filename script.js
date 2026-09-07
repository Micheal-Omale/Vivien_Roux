/* =========================================================
   Vivien Roux — motion
   House wiring from ~/inspiration/PATTERNS.md §0/§1/§2/§4/§9.
   Pacing is deliberately ~2.5x the corpus default: this site
   is loud, but it is never in a hurry.
   ========================================================= */

document.documentElement.classList.add("anim");

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

/* ---------- tunable constants live here, never in the tween ---------- */
const CONFIG = {
  preloader: { count: 2.6, hold: 0.15, curtain: 1.1 },

  // slow vocabulary — corpus default entrance is 0.75s
  dur:     { hero: 2.0, line: 1.5, copy: 1.2, piece: 1.0 },
  stagger: { chars: 0.045, lines: 0.14, copy: 0.09 },
  exitRatio: 3,               // §9: exits ~3x faster than entrances

  marquee: { copies: 3, speed: 34 },   // seconds per full cycle

  preview: { lerp: 0.055 },   // heavy lag — the cut-out drags behind the hand

  // Absolute seconds on the hero reveal timeline. The title owns the opening
  // beat alone; nothing else moves until it has landed. Relative offsets used
  // to put the card in at 0.95s, halfway through the title climb.
  heroBeat: { card: 1.9, portrait: 2.05, copy: 2.5, stats: 2.62, nav: 2.75 },

  // Closing CTA. The third line is the word SLOWLY, so it arrives slowly —
  // the sentence performs itself. Everything else here serves that gag.
  contact: {
    line: 1.3,          // seconds for LET'S MAKE / SOMETHING
    slow: 3.6,          // ...and for SLOWLY
    charStagger: 0.03,
    slowStagger: 0.12,
    tilt: 2.6,          // resting hand-set angle, degrees

    // Scatter is PROXIMITY driven: letters flee the cursor and stay fled
    // while it is near them. A velocity-only version reads as almost nothing
    // when the pointer moves slowly or holds still.
    radius: 360,        // reach of the disturbance, px
    scatter: 170,       // how far a letter runs at the centre of it, px
    spin: 30,           // degrees of tumble at full strength
    skew: 0.38,         // radians of per-letter bias on the escape direction
    lift: 0.2,          // scale bump, as if the letter were picked up

    push: 0.55,         // extra kick from a fast flick, on top of the above
    maxPush: 60,
    decay: 0.88,        // cursor velocity dies each frame — see tick()

    stiffness: 0.05,    // spring back to rest
    friction: 0.87,
    drift: 0.7,         // idle sway amplitude, px
  },

  assembly: {
    // 11 pieces at step 0.064 put the last one down at 0.90 (0.64 + span).
    // At the old 0.058/6-viewport pairing everything had landed by 0.84,
    // leaving ~960px — a full viewport — of scrolling with nothing moving.
    viewports: 5,             // §1: express pin length in viewports
    step: 0.064,              // phase offset between consecutive pieces
    span: 0.26,               // how long one piece takes to land
    captureAt: 0.92,          // caption latch, just after the last piece
  },
};

CustomEase.create("ink",   "0.16, 1, 0.3, 1");    // long settle — the default here
CustomEase.create("press", "0.9, 0, 0.1, 1");     // hard in / hard out — curtains
CustomEase.create("lay",   "0.22, 1, 0.24, 1");   // a piece being set down

/* =========================================================
   0. Lenis wired into the GSAP ticker  (PATTERNS §0)
   ========================================================= */
const lenis = new Lenis({ duration: 1.6, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* =========================================================
   Collage recipes — stand-ins until images/PROMPTS.md is run.
   Each returns markup matching the .collage system in CSS.
   ========================================================= */
const ART = {
  1: `<img src="images/work-1.png" alt="Saltmarsh Editions">`,
  2: `<img src="images/work-2.png" alt="Ottolinger Archive">`,
  3: `<img src="images/work-3.png" alt="Verdigris Press">`,
  4: `<img src="images/work-4.png" alt="Nocturne Radio">`,
  5: `<img src="images/work-5.png" alt="Hollow Bones">`,
  6: `<img src="images/work-6.png" alt="Papier Mâché">`,
};

/* solid / textural scraps used in the assembly, no portrait */
const SCRAP = {
  yellowBar: `<span class="c-bg" style="background:var(--yellow)"></span>`,
  pinkBar:   `<img src="images/scrap-pink.png" alt="">`,
  paper:     `<img src="images/scrap-paper.png" alt="">`,
  acid:      `<img src="images/scrap-acid.png" alt="">`,
  zag:       `<span class="c-bg coral"></span><span class="c-zag"></span>`,
  diamond:   `<span class="c-bg" style="background:var(--teal)"></span><span class="c-diamonds"></span>`,
  band:      `<img src="images/scrap-band.png" alt="">`,
};

/* =========================================================
   1. Preloader — the site announces its pace immediately
   ========================================================= */
function runPreloader() {
  const pre = document.getElementById("preloader");
  const num = document.getElementById("preCount");
  const counter = { v: 0 };

  lenis.stop();

  const tl = gsap.timeline({
    onComplete: () => {
      pre.remove();
      lenis.start();
      ScrollTrigger.refresh();
      revealHero();
    },
  });

  tl.to(counter, {
    v: 100,
    duration: CONFIG.preloader.count,
    ease: "power2.inOut",
    onUpdate: () => {
      num.textContent = String(Math.round(counter.v)).padStart(2, "0");
    },
  })
    .to(".pre-label", {
      yPercent: -110,
      duration: CONFIG.preloader.count / CONFIG.exitRatio,
      ease: "press",
    }, `>-${CONFIG.preloader.hold}`)
    .to(num, {
      yPercent: -110,
      duration: CONFIG.preloader.count / CONFIG.exitRatio,
      ease: "press",
    }, "<0.06")
    .to(pre, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: CONFIG.preloader.curtain,
      ease: "press",
    }, "<0.25");

  gsap.set(pre, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
}

/* =========================================================
   2. Hero reveal — masked chars  (PATTERNS §2, stretched)
   ========================================================= */
let heroSplit = null;

/* The curtain wipes away to expose the hero, so the hero's start state has to
   exist BEFORE that happens. Previously only the title was pre-hidden (via
   CSS) and the rest was left to gsap.from() inside revealHero(), which runs on
   the preloader's onComplete — so the card, copy, stats and nav sat fully
   visible through the whole wipe, then popped out and slid back in. */
function prepHero() {
  gsap.set(".hero-title .ht-line", { visibility: "visible" });

  heroSplit = SplitText.create(".hero-title", { type: "chars", mask: "chars" });

  gsap.set(heroSplit.chars, { yPercent: 110 });
  gsap.set(".hero-card", {
    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    yPercent: 14,
  });
  gsap.set(".hero-card img, .hero-card .c-bust", { yPercent: 24 });
  gsap.set(".hero-intro .body-copy, .hero-intro .btn", { opacity: 0, y: 26 });
  gsap.set(".hero-stats li", { opacity: 0, y: 26 });
  gsap.set(".nav > *", { opacity: 0, y: -14 });
}

/* =========================================================
   2. Hero reveal — masked chars  (PATTERNS §2, stretched)
   Every tween is placed at an absolute time so the order is
   readable at a glance and tunable from CONFIG.heroBeat.
   ========================================================= */
function revealHero() {
  if (!heroSplit) prepHero();
  const B = CONFIG.heroBeat;

  gsap.timeline()
    .to(heroSplit.chars, {
      yPercent: 0,
      duration: CONFIG.dur.hero,
      stagger: CONFIG.stagger.chars,
      ease: "ink",
    }, 0)
    .to(".hero-card", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      yPercent: 0,
      duration: 1.8,
      ease: "ink",
    }, B.card)
    .to(".hero-card img, .hero-card .c-bust", {
      yPercent: 0,
      duration: 2.2,
      ease: "ink",
    }, B.portrait)
    .to(".hero-intro .body-copy, .hero-intro .btn", {
      opacity: 1,
      y: 0,
      duration: CONFIG.dur.copy,
      stagger: CONFIG.stagger.copy,
      ease: "ink",
    }, B.copy)
    .to(".hero-stats li", {
      opacity: 1,
      y: 0,
      duration: CONFIG.dur.copy,
      stagger: CONFIG.stagger.copy,
      ease: "ink",
    }, B.stats)
    .to(".nav > *", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.07,
      ease: "ink",
    }, B.nav);
}

/* =========================================================
   3. Marquee — seamless, slow
   ========================================================= */
function buildMarquee() {
  const names = ["Kinfolk", "Aesop", "Monocle", "Frieze", "Hermès", "Wallpaper*", "Nocturne"];
  const wrap = document.getElementById("marquee");
  const rowHTML = names
    .map((n) => `<span>${n}</span><span class="dot"></span>`)
    .join("");

  for (let i = 0; i < CONFIG.marquee.copies; i++) {
    const row = document.createElement("div");
    row.className = "mq-row";
    row.innerHTML = rowHTML;
    wrap.appendChild(row);
  }

  const one = wrap.firstElementChild.offsetWidth;
  gsap.to(wrap, {
    x: -one,
    duration: CONFIG.marquee.speed,
    ease: "none",
    repeat: -1,
  });
}

/* =========================================================
   4. Scroll-triggered section reveals
   ========================================================= */
function initSectionReveals() {
  // These titles are already hand-set two-liners in the markup, and the
  // second line carries an .indent. SplitText type:"lines" re-flows them
  // into a single measured line and the composition is lost — so mask each
  // authored span instead of letting the plugin decide where lines break.
  document.querySelectorAll(".section-title, .asm-title").forEach((el) => {
    const inners = [...el.children].map((span) => {
      span.style.visibility = "visible";
      span.classList.add("mask-line");

      const inner = document.createElement("span");
      inner.className = "mask-inner";
      inner.innerHTML = span.innerHTML;
      span.innerHTML = "";
      span.appendChild(inner);
      return inner;
    });

    gsap.set(inners, { yPercent: 110 });

    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(inners, {
          yPercent: 0,
          duration: CONFIG.dur.line,
          stagger: CONFIG.stagger.lines,
          ease: "ink",
        }),
    });
  });

  // body copy, eyebrows, buttons, cards
  gsap.utils
    .toArray(".studio-copy .body-copy, .studio .btn, .eyebrow, .card, .studio-card")
    .forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 34,
        duration: CONFIG.dur.copy,
        ease: "ink",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

  // work index rows wipe up one at a time
  gsap.from(".row", {
    opacity: 0,
    y: 44,
    duration: CONFIG.dur.copy,
    stagger: 0.11,
    ease: "ink",
    scrollTrigger: { trigger: ".index", start: "top 82%", once: true },
  });

  // contact
  // the closing CTA has its own module — see initContact()
}

/* =========================================================
   5. Work index — cursor-lagged cut-out
   Recombines CG17122025 (pure rAF pointer) with the clipPath
   reveal of CG05112025. gsap.set per frame, never a tween (§9).
   ========================================================= */
function initWorkIndex() {
  const preview = document.getElementById("preview");
  const rows = gsap.utils.toArray(".row");

  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  const eased = { x: pointer.x, y: pointer.y };
  let active = null;

  // cached so the ticker never reads layout (§9: recompute on resize)
  let half = { w: 0, h: 0 };
  const measure = () => {
    half.w = preview.offsetWidth / 2;
    half.h = preview.offsetHeight / 2;
  };
  measure();
  window.addEventListener("resize", measure);

  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  gsap.ticker.add(() => {
    eased.x += (pointer.x - eased.x) * CONFIG.preview.lerp;
    eased.y += (pointer.y - eased.y) * CONFIG.preview.lerp;

    const drag = gsap.utils.clamp(-10, 10, (pointer.x - eased.x) * 0.12);

    gsap.set(preview, {
      x: eased.x - half.w,
      y: eased.y - half.h,
      rotation: drag,          // the cut-out swings as the hand moves
    });
  });

  function show(row) {
    if (active === row) return;
    active = row;
    rows.forEach((r) => r.classList.toggle("on", r === row));

    preview.innerHTML = `<div class="collage">${ART[row.dataset.art]}</div>`;
    gsap.killTweensOf(preview);
    gsap.to(preview, {
      opacity: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.1,
      ease: "ink",
    });
    gsap.from(preview.querySelector(".collage"), {
      scale: 1.3,
      duration: 1.8,
      ease: "ink",
    });
  }

  function hide() {
    if (!active) return;
    active = null;
    rows.forEach((r) => r.classList.remove("on"));
    gsap.killTweensOf(preview);
    gsap.to(preview, {
      opacity: 0,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      duration: 1.1 / CONFIG.exitRatio,     // §9 exits are faster
      ease: "press",
    });
  }

  rows.forEach((row) => {
    row.addEventListener("pointerenter", () => show(row));
    // slide the name a little as the pointer crosses it
    row.addEventListener("pointermove", (e) => {
      const rect = row.getBoundingClientRect();
      const t = (e.clientX - rect.left) / rect.width;
      gsap.to(row.querySelector(".r-name"), {
        x: gsap.utils.interpolate(-14, 14, t),
        duration: 1.4,
        ease: "ink",
        overwrite: "auto",
      });
    });
    row.addEventListener("pointerleave", () => {
      gsap.to(row.querySelector(".r-name"), {
        x: 0,
        duration: 1.4 / CONFIG.exitRatio,
        ease: "ink",
        overwrite: "auto",
      });
    });
  });

  document.getElementById("index").addEventListener("pointerleave", hide);
}

/* =========================================================
   6. SIGNATURE — the assembly.
   Not in the corpus. Nearest relatives are CG25032026 (a pile
   snaps to a grid via Flip) and CG11022026 (cards scatter from
   the viewport edges). Neither builds. Here every piece flies
   in from off-canvas on its own slice of scroll progress and is
   set down — arrival eased inside the phase so it lands and
   settles instead of tracking the wheel linearly.
   ========================================================= */
const PIECES = [
  // x/y are % of stage, w is % of stage width, ar = aspect ratio.
  // Positions deliberately leave the centre band (x 34-66, y 34-64) open:
  // the poster frames the headline, it does not bury it.
  { x: 17, y: 27, w: 17, ar: 0.72, rot:  -7, from: "left",   art: ART[5] },
  { x: 50, y: 11, w: 24, ar: 5.00, rot:  -2, from: "top",    art: SCRAP.acid },
  { x: 83, y: 22, w: 14, ar: 1.30, rot:   6, from: "right",  art: SCRAP.yellowBar },
  { x: 80, y: 62, w: 19, ar: 0.78, rot:   4, from: "right",  art: ART[2] },
  { x: 93, y: 86, w: 11, ar: 0.90, rot:  11, from: "right",  art: ART[4] },
  { x: 72, y: 91, w: 20, ar: 3.00, rot:  -3, from: "bottom", art: SCRAP.band },
  { x: 27, y: 76, w: 15, ar: 1.15, rot:  -5, from: "bottom", art: SCRAP.zag },
  { x:  8, y: 55, w: 11, ar: 1.00, rot: -13, from: "left",   art: SCRAP.pinkBar },
  { x: 24, y: 47, w:  9, ar: 1.60, rot:   9, from: "left",   art: SCRAP.paper },
  { x: 70, y: 28, w: 13, ar: 0.85, rot:   3, from: "top",    art: SCRAP.diamond },
  { x: 88, y: 45, w: 10, ar: 1.05, rot: -10, from: "right",  art: ART[6] },
];

function originFor(from, stage, i) {
  // Deterministic per piece rather than gsap.utils.random(): build() re-runs on
  // every ScrollTrigger refresh, and a re-rolled origin makes a piece that is
  // already in flight jump sideways.
  const jitter = () => ((((i * 37) % 21) - 10) / 55) * stage.h;
  switch (from) {
    case "left":   return { x: -stage.w * 0.55, y: jitter() };
    case "right":  return { x:  stage.w * 0.55, y: jitter() };
    case "top":    return { x: jitter(), y: -stage.h * 0.75 };
    default:       return { x: jitter(), y:  stage.h * 0.75 };
  }
}

function initAssembly() {
  const stageEl = document.getElementById("asmStage");
  const holder = document.getElementById("asmPieces");
  const caption = document.getElementById("asmCaption");

  const captionSplit = SplitText.create(caption, { type: "lines", mask: "lines" });
  gsap.set(captionSplit.lines, { yPercent: 110 });

  let stage = { w: 0, h: 0 };
  let built = [];

  function build() {
    holder.innerHTML = "";
    stage = { w: stageEl.offsetWidth, h: stageEl.offsetHeight };

    built = PIECES.map((p, i) => {
      const el = document.createElement("div");
      el.className = "piece";
      el.innerHTML = `<div class="collage">${p.art}</div>`;

      const w = (p.w / 100) * stage.w;
      const h = w / p.ar;

      Object.assign(el.style, {
        width: `${w}px`,
        height: `${h}px`,
        left: `${(p.x / 100) * stage.w - w / 2}px`,
        top: `${(p.y / 100) * stage.h - h / 2}px`,
      });

      holder.appendChild(el);
      return { el, cfg: p, origin: originFor(p.from, stage, i) };
    });
  }

  build();

  const easeLay = gsap.parseEase("lay");
  const easeSpin = gsap.parseEase("power2.out");
  let captured = false;

  /* Placing every piece for a given progress. Pulled out of onUpdate because
     build() wipes and recreates the DOM on each refresh, leaving fresh nodes
     with no transform — i.e. sitting at their final left/top. With the work
     trapped inside onUpdate the poster showed up FULLY ASSEMBLED at progress 0
     and only scattered once the first scroll event fired. */
  function layout(p) {
    built.forEach(({ el, cfg, origin }, i) => {
      // each piece owns a slice of the scroll; slices overlap (§1)
      const raw = gsap.utils.clamp(
        0, 1,
        (p - i * CONFIG.assembly.step) / CONFIG.assembly.span
      );

      const lay = easeLay(raw);     // position settles early
      const spin = easeSpin(raw);   // rotation lands last — that is the "press"

      gsap.set(el, {
        x: gsap.utils.interpolate(origin.x, 0, lay),
        y: gsap.utils.interpolate(origin.y, 0, lay),
        rotation: gsap.utils.interpolate(cfg.rot * 6, cfg.rot, spin),
        scale: gsap.utils.interpolate(1.18, 1, lay),
        opacity: gsap.utils.clamp(0, 1, raw * 5),
      });
    });

    // latched one-shot (§1) — caption arrives only once the poster is whole
    if (p >= CONFIG.assembly.captureAt && !captured) {
      captured = true;
      gsap.to(captionSplit.lines, {
        yPercent: 0,
        duration: 1.3,
        stagger: 0.12,
        ease: "ink",
      });
    } else if (p < CONFIG.assembly.captureAt && captured) {
      captured = false;
      gsap.to(captionSplit.lines, {
        yPercent: 110,
        duration: 1.3 / CONFIG.exitRatio,
        stagger: -0.06,          // §9: retreat in reverse order
        ease: "press",
      });
    }
  }

  const st = ScrollTrigger.create({
    trigger: ".assembly",
    start: "top top",
    end: () => `+=${window.innerHeight * CONFIG.assembly.viewports}px`,
    pin: ".asm-stage",
    pinSpacing: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onRefreshInit: build,
    onRefresh: (self) => layout(self.progress),
    onUpdate: (self) => layout(self.progress),
  });

  layout(st.progress);   // scatter the stage before the first scroll arrives
}

/* Mobile has no pin and no pointer, so the assembly becomes what the
   poster would be if you simply laid it on a table: a static collage that
   staggers in. Hiding the pieces left the section an empty indigo void. */
function initAssemblyStatic() {
  const holder = document.getElementById("asmPieces");
  const caption = document.getElementById("asmCaption");
  if (!holder) return;

  const picks = [ART[5], ART[2], ART[4], ART[6], ART[1], ART[3]];
  const tilt = [-4, 3, -2, 5, -5, 2];

  holder.innerHTML = "";
  const els = picks.map((art) => {
    const el = document.createElement("div");
    el.className = "piece";
    el.innerHTML = `<div class="collage">${art}</div>`;
    holder.appendChild(el);
    return el;
  });

  gsap.set(els, { rotate: (i) => tilt[i] });
  gsap.from(els, {
    opacity: 0,
    y: 44,
    duration: CONFIG.dur.copy,
    stagger: 0.12,
    ease: "ink",
    scrollTrigger: { trigger: holder, start: "top 85%", once: true },
  });
  gsap.from(caption, {
    opacity: 0,
    y: 24,
    duration: CONFIG.dur.copy,
    ease: "ink",
    scrollTrigger: { trigger: caption, start: "top 92%", once: true },
  });
}

/* =========================================================
   6b. Closing CTA — type that behaves like the sentence.

   Two things the corpus does not do:
   - "SLOWLY" arrives at roughly 3x the duration of the lines above it, so
     the word demonstrates its own meaning instead of just stating it.
   - The letters stay loose afterwards. CG27052026 springs four cards away
     from a fast cursor; the same velocity-push / spring-return physics is
     applied here to ~28 individual characters, so the headline behaves like
     hand-set lead type nudged around on a bench.

   NOTE: no mask on this split. mask:"chars" wraps each glyph in an
   overflow-clipped box, which would shave the drift and the pointer push.
   The masked rise stays the hero's move; the closer earns a different one.
   ========================================================= */
function initContact() {
  const C = CONFIG.contact;
  const lines = [...document.querySelectorAll(".cta-title .ht-line")];
  if (!lines.length) return;

  gsap.set(lines, { visibility: "visible" });

  // split per line so the last one can be timed on its own
  const perLine = lines.map((line) =>
    SplitText.create(line, { type: "chars" }).chars
  );
  const all = perLine.flat();

  // deterministic hand-set angle per character — nothing lands square
  const restR = all.map((_, i) => ((((i * 41) % 21) - 10) / 10) * C.tilt);

  gsap.set(all, { y: 130, opacity: 0, rotation: (i) => restR[i] * 4 });

  const tl = gsap.timeline({ paused: true });

  perLine.forEach((chars, i) => {
    const last = i === perLine.length - 1;
    tl.to(chars, {
      y: 0,
      opacity: 1,
      rotation: (k) => restR[perLine.slice(0, i).flat().length + k],
      duration: last ? C.slow : C.line,
      stagger: last ? C.slowStagger : C.charStagger,
      ease: "ink",
    }, i * 0.42);
  });

  tl.from(".contact .btn", {
    opacity: 0,
    y: 30,
    duration: CONFIG.dur.copy,
    ease: "ink",
  }, ">-1.2");

  // the spring loop and the arrival tween both write transform; the loop must
  // not start until the letters have actually landed
  let landed = false;
  tl.eventCallback("onComplete", () => { landed = true; measure(); });

  ScrollTrigger.create({
    trigger: ".contact",
    start: "top 70%",
    once: true,
    onEnter: () => tl.play(),
  });

  /* Char centres cached relative to .contact, so the per-frame loop reads ONE
     rect instead of 28. Re-measured on landing and on resize. */
  const section = document.querySelector(".contact");
  let rel = [];
  function measure() {
    const s = section.getBoundingClientRect();
    rel = all.map((el) => {
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2 - s.left, y: b.top + b.height / 2 - s.top };
    });
  }
  window.addEventListener("resize", () => { if (landed) measure(); });

  /* ---- loose type: one rAF loop owns the transform (§9) ---- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 861px) and (pointer: fine)", () => {
    const cursor = { x: 0, y: 0, vx: 0, vy: 0 };
    let px = 0, py = 0;

    const P = all.map((el, i) => ({
      el, i,
      x: 0, y: 0, r: restR[i], s: 1,
      vx: 0, vy: 0, vr: 0,
      phase: (i % 7) * 0.9 + (i % 3),   // desynced idle sway
      wob: ((((i * 29) % 13) - 6) / 6),  // -1..1, stable per letter
    }));

    const onMove = (e) => {
      cursor.vx = cursor.vx * 0.75 + (e.clientX - px) * 0.25;
      cursor.vy = cursor.vy * 0.75 + (e.clientY - py) * 0.25;
      px = cursor.x = e.clientX;
      py = cursor.y = e.clientY;
    };
    const onLeave = () => { cursor.x = -9999; cursor.y = -9999; };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    onLeave();   // nothing is disturbed until the pointer actually shows up

    const tick = () => {
      if (!landed || !rel.length) return;

      // One rect read per frame, doubling as the off-screen gate. A
      // ScrollTrigger onToggle was used for this and never fired true.
      const s = section.getBoundingClientRect();
      if (s.bottom < 0 || s.top > window.innerHeight) return;

      const t = gsap.ticker.time;

      // Velocity has to bleed off every frame. Decaying it only inside the
      // pointermove handler meant a cursor that stopped moving left its last
      // velocity applied forever, so the letters were shoved and never came
      // home — 125px off rest, permanently.
      cursor.vx *= C.decay;
      cursor.vy *= C.decay;

      const speed = Math.hypot(cursor.vx, cursor.vy);

      const cap = gsap.utils.clamp.bind(null, -C.maxPush, C.maxPush);

      P.forEach((c) => {
        const cx = s.left + rel[c.i].x;
        const cy = s.top + rel[c.i].y;

        // vector pointing from the cursor at the letter — the escape direction
        const dx = cx - cursor.x;
        const dy = cy - cursor.y;
        const d = Math.hypot(dx, dy) || 1;

        // quadratic falloff: a wider, more legible bloom than the cubic one
        const rep = d < C.radius ? (1 - d / C.radius) ** 2 : 0;

        // Escape direction, skewed per letter. Pure radial repulsion punches a
        // perfect circle out of the block, which reads machined; a few degrees
        // of per-letter bias makes the void look torn instead.
        const a = Math.atan2(dy, dx) + c.wob * C.skew;
        const ux = Math.cos(a), uy = Math.sin(a);
        const reach = rep * C.scatter * (1 + c.wob * 0.18);

        // rest is not fixed — it sways, so the block breathes even at rest
        const rx = Math.sin(t * 0.55 + c.phase) * C.drift;
        const ry = Math.cos(t * 0.42 + c.phase) * C.drift;

        let tx = rx + ux * reach;
        let ty = ry + uy * reach;

        if (speed > 0.5 && rep > 0) {        // a fast flick throws them further
          tx += cap(cursor.vx * C.push * rep);
          ty += cap(cursor.vy * C.push * rep);
        }

        // tumble away from the cursor — continuous in ux, so letters near the
        // vertical axis barely turn while the outer ones swing hard
        const tr = restR[c.i] + rep * C.spin * (ux * 1.15 + c.wob * 0.55);

        c.vx = (c.vx + (tx - c.x) * C.stiffness) * C.friction;
        c.vy = (c.vy + (ty - c.y) * C.stiffness) * C.friction;
        c.vr = (c.vr + (tr - c.r) * C.stiffness) * C.friction;

        c.x += c.vx; c.y += c.vy; c.r += c.vr;
        c.s += (1 + rep * C.lift - c.s) * 0.12;   // lift, no spring needed

        gsap.set(c.el, { x: c.x, y: c.y, rotation: c.r, scale: c.s });
      });
    };

    gsap.ticker.add(tick);

    return () => {                       // matchMedia cleanup
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.set(all, { x: 0, y: 0, scale: 1, rotation: (i) => restR[i] });
    };
  });
}

/* =========================================================
   7. Theme handoff — a torn paper edge, not a hard cut.
   The reference butts indigo against lime with a straight
   line. Here the incoming colour arrives on a ragged edge
   that flattens as you scroll: the sheet being laid down.
   PATTERNS §4 (clipPath over opacity) + §1 (scrub, gsap.set).
   ========================================================= */
const TEAR = [
  // % offsets along the top edge — irregular on purpose
  0, 2.4, 0.8, 3.6, 1.2, 4.4, 0.4, 3.0, 1.8, 4.8, 0.6, 2.2, 3.4, 0.9, 4.1, 1.5,
];

function tornPolygon(amount) {
  // amount 1 = fully ragged, 0 = flat
  const n = TEAR.length;
  const pts = TEAR.map((t, i) => {
    const x = (i / (n - 1)) * 100;
    return `${x.toFixed(2)}% ${(t * amount).toFixed(2)}%`;
  });
  return `polygon(${pts.join(", ")}, 100% 100%, 0% 100%)`;
}

function tornBottomPolygon(amount) {
  const n = TEAR.length;
  const pts = TEAR.map((t, i) => {
    const x = 100 - (i / (n - 1)) * 100;
    return `${x.toFixed(2)}% ${(100 - t * amount).toFixed(2)}%`;
  });
  return `polygon(0% 0%, 100% 0%, ${pts.join(", ")})`;
}

function initTornEdges() {
  // the lime section hands off to indigo on a ragged bottom edge.
  // .assembly itself is pinned, so the tear lives on the outgoing sheet.
  const work = document.querySelector(".work");
  if (work) {
    ScrollTrigger.create({
      trigger: ".assembly",
      start: "top bottom",
      end: "top 55%",
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(work, { clipPath: tornBottomPolygon(1 - self.progress) });
      },
    });
    gsap.set(work, { clipPath: tornBottomPolygon(1) });
  }

  // only the boundaries that are not inside a pin
  gsap.utils.toArray(".marquee-wrap, .contact").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "top 45%",
      scrub: 1,
      onUpdate: (self) => {
        // gsap.set inside a per-frame callback, never gsap.to (§9)
        gsap.set(section, { clipPath: tornPolygon(1 - self.progress) });
      },
    });
    gsap.set(section, { clipPath: tornPolygon(1) });
  });

  // body colour only matters for overscroll rubber-banding
  gsap.utils.toArray("[data-theme]").forEach((section) => {
    const ink = section.dataset.theme === "ink";
    ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.to("body", {
          backgroundColor: ink ? "#2A19B0" : "#D8F63D",
          duration: 1.4,
          ease: "ink",
          overwrite: "auto",
        });
      },
    });
  });
}

/* =========================================================
   boot
   ========================================================= */
function boot() {
  // SplitText measures glyphs. Splitting before Poppins/Space Mono land
  // gives fallback-font line breaks that never re-measure. The preloader
  // exists precisely to cover this wait.
  if (!document.fonts || !document.fonts.load) return start();

  // fonts.ready alone resolves before faces that nothing has painted yet
  // are even requested — ask for each face this page actually sets.
  const faces = [
    "800 10rem Poppins",
    "600 1rem Poppins",
    "500 1rem Poppins",
    "400 1rem Poppins",
    "400 1rem 'Space Mono'",
    "700 1rem 'Space Mono'",
  ];

  // the accented glyphs live in Google's latin-ext subset, which is a second
  // @font-face request — without naming them, fonts.status flips back to
  // "loading" mid-split and SplitText measures the fallback.
  const HINT = "AaGg0189 Mâché Hermès Wallpaper*";

  Promise.all(faces.map((f) => document.fonts.load(f, HINT).catch(() => {})))
    .then(() => document.fonts.ready)
    .then(start)
    .catch(start);
}

function start() {
  prepHero();          // must precede runPreloader() — see prepHero()
  buildMarquee();
  initSectionReveals();
  initTornEdges();
  initContact();

  // pointer choreography and the pin are desktop-only (§9: matchMedia,
  // not innerWidth branches inside the animation)
  const mm = gsap.matchMedia();
  mm.add("(min-width: 861px)", () => {
    initWorkIndex();
    initAssembly();
  });
  mm.add("(max-width: 860px)", initAssemblyStatic);

  runPreloader();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

window.addEventListener("resize", () => ScrollTrigger.refresh());

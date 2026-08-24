(() => {
  const MOVE_INTERVAL_MS = 30 * 60 * 1000;
  const MEOW_MIN_MS = 2.5 * 60 * 1000;
  const MEOW_MAX_MS = 6 * 60 * 1000;
  const MIN_WALK_MS = 1600;
  const MAX_WALK_MS = 5200;

  const spots = [
    { x: 0.025, y: 0.13, pose: "peek", flip: 1 },
    { x: 0.91, y: 0.15, pose: "peek", flip: -1 },
    { x: 0.035, y: 0.72, pose: "floor", flip: 1 },
    { x: 0.90, y: 0.72, pose: "floor", flip: -1 },
    { x: 0.12, y: 0.46, pose: "perch", flip: 1 },
    { x: 0.82, y: 0.48, pose: "perch", flip: -1 },
    { x: 0.44, y: 0.86, pose: "floor", flip: 1 },
  ];

  const meows = {
    en: ["meow", "mrrp", "mew"],
    fi: ["miau", "mrrp", "mau"],
    de: ["miau", "mrrp", "mau"],
  };

  let stage;
  let currentSpotIndex = -1;
  let moveTimer = null;
  let meowTimer = null;
  let isWalking = false;
  let meowHideTimer = null;

  function language() {
    const active = document.querySelector("#languageToggle .lang-chip.active[data-lang]")?.dataset.lang;
    if (meows[active]) return active;
    try {
      const stored = JSON.parse(localStorage.getItem("homeflow-board-v2") || "null")?.settings?.language;
      if (meows[stored]) return stored;
    } catch (_) {}
    return "en";
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function buildCat() {
    if (document.getElementById("homeflowCatLayer")) return document.getElementById("homeflowCatStage");

    const layer = document.createElement("div");
    layer.id = "homeflowCatLayer";
    layer.className = "homeflow-cat-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <div class="homeflow-cat-stage" id="homeflowCatStage" data-pose="floor">
        <div class="homeflow-cat-bubble" id="homeflowCatBubble"></div>
        <div class="homeflow-cat-orientation">
          <div class="homeflow-cat" role="presentation">
            <div class="homeflow-cat-tail"></div>
            <div class="homeflow-cat-body">
              <div class="homeflow-cat-paw left"></div>
              <div class="homeflow-cat-paw right"></div>
            </div>
            <div class="homeflow-cat-head">
              <div class="homeflow-cat-ear left"></div>
              <div class="homeflow-cat-ear right"></div>
              <div class="homeflow-cat-eye left"></div>
              <div class="homeflow-cat-eye right"></div>
              <div class="homeflow-cat-nose"></div>
              <div class="homeflow-cat-mouth"></div>
              <div class="homeflow-cat-whiskers left"></div>
              <div class="homeflow-cat-whiskers right"></div>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(layer);

    const catStage = layer.querySelector("#homeflowCatStage");
    catStage.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isWalking) return;
      catStage.classList.add("is-poked");
      window.setTimeout(() => catStage.classList.remove("is-poked"), 420);
      if (Math.random() < 0.55) showMeow();
      moveToAnotherSpot(true);
    });

    return catStage;
  }

  function usablePosition(spot) {
    const rect = stage.getBoundingClientRect();
    const width = rect.width || 80;
    const height = rect.height || 78;
    const padding = 8;
    const x = clamp(window.innerWidth * spot.x, padding - width * 0.18, window.innerWidth - width - padding + width * 0.18);
    const y = clamp(window.innerHeight * spot.y, padding, window.innerHeight - height - padding);
    return { x, y };
  }

  function currentPosition() {
    const rect = stage.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  }

  function chooseNextSpot(forceDifferent = true) {
    if (spots.length <= 1) return 0;
    let next = currentSpotIndex;
    for (let tries = 0; tries < 8 && (!forceDifferent || next === currentSpotIndex); tries += 1) {
      next = Math.floor(Math.random() * spots.length);
    }
    if (next === currentSpotIndex) next = (currentSpotIndex + 1) % spots.length;
    return next;
  }

  function setWalkingAppearance(from, to) {
    const dx = to.x - from.x;
    stage.style.setProperty("--cat-flip", dx < 0 ? -1 : 1);
    stage.dataset.pose = "floor";
    stage.classList.add("is-walking");
    stage.classList.remove("is-sitting");
    isWalking = true;
    hideMeow();
  }

  function settleAtSpot(index) {
    const spot = spots[index];
    stage.dataset.pose = spot.pose;
    stage.style.setProperty("--cat-flip", String(spot.flip));
    stage.classList.remove("is-walking");
    stage.classList.add("is-sitting");
    isWalking = false;
    currentSpotIndex = index;
    scheduleMeow();
  }

  function walkToSpot(index, { initial = false } = {}) {
    const spot = spots[index];
    const target = usablePosition(spot);
    const from = currentPosition();
    const distance = Math.hypot(target.x - from.x, target.y - from.y);
    const duration = initial ? 2600 : clamp(distance * 7.2, MIN_WALK_MS, MAX_WALK_MS);

    setWalkingAppearance(from, target);
    stage.style.transitionDuration = `${duration}ms`;
    stage.style.setProperty("--cat-x", `${target.x}px`);
    stage.style.setProperty("--cat-y", `${target.y}px`);

    window.setTimeout(() => settleAtSpot(index), duration + 40);
  }

  function moveToAnotherSpot(fromPoke = false) {
    if (!stage || isWalking) return;
    const next = chooseNextSpot(true);
    walkToSpot(next);
    resetMoveTimer();
    if (fromPoke) scheduleMeow(9000, 18000);
  }

  function resetMoveTimer() {
    if (moveTimer) window.clearTimeout(moveTimer);
    moveTimer = window.setTimeout(() => moveToAnotherSpot(false), MOVE_INTERVAL_MS);
  }

  function hideMeow() {
    const bubble = document.getElementById("homeflowCatBubble");
    if (!bubble) return;
    bubble.classList.remove("is-visible");
    if (meowHideTimer) window.clearTimeout(meowHideTimer);
  }

  function showMeow() {
    if (!stage || isWalking) return;
    const bubble = document.getElementById("homeflowCatBubble");
    if (!bubble) return;
    const pool = meows[language()] || meows.en;
    bubble.textContent = pool[Math.floor(Math.random() * pool.length)];
    bubble.classList.remove("is-visible");
    requestAnimationFrame(() => bubble.classList.add("is-visible"));
    if (meowHideTimer) window.clearTimeout(meowHideTimer);
    meowHideTimer = window.setTimeout(() => bubble.classList.remove("is-visible"), 2800);
  }

  function scheduleMeow(min = MEOW_MIN_MS, max = MEOW_MAX_MS) {
    if (meowTimer) window.clearTimeout(meowTimer);
    const delay = Math.round(min + Math.random() * (max - min));
    meowTimer = window.setTimeout(() => {
      if (!isWalking && document.visibilityState === "visible") showMeow();
      scheduleMeow();
    }, delay);
  }

  function repositionCurrent() {
    if (!stage || currentSpotIndex < 0 || isWalking) return;
    const target = usablePosition(spots[currentSpotIndex]);
    stage.style.transitionDuration = "260ms";
    stage.style.setProperty("--cat-x", `${target.x}px`);
    stage.style.setProperty("--cat-y", `${target.y}px`);
  }

  function boot() {
    stage = buildCat();
    if (!stage) return;

    const first = Math.floor(Math.random() * spots.length);
    const startY = clamp(window.innerHeight * .82, 20, window.innerHeight - 90);
    stage.style.transitionDuration = "0ms";
    stage.style.setProperty("--cat-x", "-110px");
    stage.style.setProperty("--cat-y", `${startY}px`);
    stage.style.setProperty("--cat-flip", "1");
    stage.classList.add("is-sitting");

    requestAnimationFrame(() => requestAnimationFrame(() => walkToSpot(first, { initial: true })));
    resetMoveTimer();

    window.addEventListener("resize", repositionCurrent, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        repositionCurrent();
        scheduleMeow(45000, 120000);
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();

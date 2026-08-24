(() => {
  const MOVE_INTERVAL_MS = 30 * 60 * 1000;
  const MEOW_MIN_MS = 2.5 * 60 * 1000;
  const MEOW_MAX_MS = 6 * 60 * 1000;
  const MIN_SEGMENT_MS = 520;
  const MAX_SEGMENT_MS = 2600;
  const EDGE_MARGIN = 10;

  const meows = {
    en: ["meow", "mrrp", "mew"],
    fi: ["miau", "mrrp", "mau"],
    de: ["miau", "mrrp", "mau"],
  };

  let stage;
  let currentSpotId = null;
  let moveTimer = null;
  let meowTimer = null;
  let meowHideTimer = null;
  let isWalking = false;

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
      if (Math.random() < 0.58) showMeow();
      moveToAnotherSpot(true);
    });

    return catStage;
  }

  function catSize() {
    const rect = stage?.getBoundingClientRect();
    return {
      width: rect?.width || 92,
      height: rect?.height || 105,
    };
  }

  function appBounds() {
    return document.querySelector(".app-shell")?.getBoundingClientRect() || null;
  }

  function candidateSpots() {
    const { width, height } = catSize();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxX = Math.max(EDGE_MARGIN, vw - width - EDGE_MARGIN);
    const maxY = Math.max(EDGE_MARGIN, vh - height - EDGE_MARGIN);
    const y1 = clamp(vh * .18, EDGE_MARGIN, maxY);
    const y2 = clamp(vh * .43, EDGE_MARGIN, maxY);
    const y3 = clamp(vh * .68, EDGE_MARGIN, maxY);
    const bottom = maxY;
    const left = EDGE_MARGIN;
    const right = maxX;

    const spots = [
      { id: "edge-left-high", x: left, y: y1, pose: "peek", flip: 1 },
      { id: "edge-right-high", x: right, y: y1, pose: "peek", flip: -1 },
      { id: "edge-left-mid", x: left, y: y2, pose: "perch", flip: 1 },
      { id: "edge-right-mid", x: right, y: y2, pose: "perch", flip: -1 },
      { id: "edge-left-low", x: left, y: y3, pose: "floor", flip: 1 },
      { id: "edge-right-low", x: right, y: y3, pose: "floor", flip: -1 },
      { id: "bottom-left", x: left, y: bottom, pose: "floor", flip: 1 },
      { id: "bottom-right", x: right, y: bottom, pose: "floor", flip: -1 },
    ];

    const app = appBounds();
    if (app) {
      const leftGap = app.left;
      const rightGap = vw - app.right;
      if (leftGap >= width + 18) {
        const gutterX = clamp(app.left - width - 10, EDGE_MARGIN, maxX);
        spots.push(
          { id: "gutter-left-high", x: gutterX, y: y1, pose: "peek", flip: 1 },
          { id: "gutter-left-mid", x: gutterX, y: y2, pose: "perch", flip: 1 },
          { id: "gutter-left-low", x: gutterX, y: y3, pose: "floor", flip: 1 },
        );
      }
      if (rightGap >= width + 18) {
        const gutterX = clamp(app.right + 10, EDGE_MARGIN, maxX);
        spots.push(
          { id: "gutter-right-high", x: gutterX, y: y1, pose: "peek", flip: -1 },
          { id: "gutter-right-mid", x: gutterX, y: y2, pose: "perch", flip: -1 },
          { id: "gutter-right-low", x: gutterX, y: y3, pose: "floor", flip: -1 },
        );
      }
    }

    return spots;
  }

  function expandedRect(rect, amount = 8) {
    return {
      left: rect.left - amount,
      top: rect.top - amount,
      right: rect.right + amount,
      bottom: rect.bottom + amount,
    };
  }

  function overlapArea(a, b) {
    const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return width * height;
  }

  function protectedRects() {
    const selectors = [
      "button",
      "a",
      "input",
      "select",
      "textarea",
      "dialog[open]",
      ".task-card",
      ".calendar-view-switch",
      ".board-tools",
      ".top-controls",
      ".tool-drawer",
      ".school-club-button",
      "#afternoonClubCompatOverlay:not([hidden])",
    ];

    return Array.from(document.querySelectorAll(selectors.join(",")))
      .filter((element) => !element.closest("#homeflowCatLayer"))
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth)
      .map((rect) => expandedRect(rect));
  }

  function candidateScore(spot, protectedAreas) {
    const { width, height } = catSize();
    const rect = {
      left: spot.x,
      top: spot.y,
      right: spot.x + width,
      bottom: spot.y + height,
    };
    let score = 0;
    protectedAreas.forEach((protectedRect) => {
      score += overlapArea(rect, protectedRect);
    });

    /* Prefer actual gutters/outer edges when scores are otherwise equal. */
    if (spot.id.startsWith("gutter-")) score -= 800;
    if (spot.id.startsWith("bottom-")) score -= 180;
    return score;
  }

  function chooseNextSpot(forceDifferent = true) {
    const all = candidateSpots();
    if (!all.length) return { id: "fallback", x: EDGE_MARGIN, y: EDGE_MARGIN, pose: "floor", flip: 1 };

    const protectedAreas = protectedRects();
    let choices = all.filter((spot) => !forceDifferent || spot.id !== currentSpotId);
    if (!choices.length) choices = all;

    const ranked = choices
      .map((spot) => ({ spot, score: candidateScore(spot, protectedAreas) }))
      .sort((a, b) => a.score - b.score);

    const bestScore = ranked[0]?.score ?? 0;
    const nearBest = ranked.filter((entry) => entry.score <= bestScore + 140).slice(0, 4);
    return (nearBest[Math.floor(Math.random() * nearBest.length)] || ranked[0]).spot;
  }

  function currentPosition() {
    const rect = stage.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
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

  function settleAtSpot(spot) {
    stage.dataset.pose = spot.pose;
    stage.style.setProperty("--cat-flip", String(spot.flip));
    stage.classList.remove("is-walking");
    stage.classList.add("is-sitting");
    isWalking = false;
    currentSpotId = spot.id;
    scheduleMeow();
  }

  function segmentDuration(from, to, initial = false) {
    if (initial) return 2100;
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    return clamp(distance * 4.4, MIN_SEGMENT_MS, MAX_SEGMENT_MS);
  }

  function moveSegment(from, to, initial = false) {
    const duration = segmentDuration(from, to, initial);
    stage.style.transitionDuration = `${duration}ms`;
    stage.style.setProperty("--cat-x", `${to.x}px`);
    stage.style.setProperty("--cat-y", `${to.y}px`);
    return new Promise((resolve) => window.setTimeout(resolve, duration + 35));
  }

  function movementPath(from, target) {
    const { width, height } = catSize();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fromLeft = from.x + width / 2 < vw / 2;
    const targetLeft = target.x + width / 2 < vw / 2;

    /* Crossing the screen goes around the bottom edge instead of through the board. */
    if (fromLeft !== targetLeft) {
      const corridorY = Math.max(EDGE_MARGIN, vh - height - EDGE_MARGIN);
      return [
        { x: from.x, y: corridorY },
        { x: target.x, y: corridorY },
        target,
      ];
    }

    /* Same-side moves stay near that edge/gutter. */
    return [target];
  }

  async function walkToSpot(spot, { initial = false } = {}) {
    const target = { x: spot.x, y: spot.y };
    const from = currentPosition();
    setWalkingAppearance(from, target);
    const path = initial ? [target] : movementPath(from, target);
    let previous = from;

    for (let index = 0; index < path.length; index += 1) {
      const point = path[index];
      if (Math.hypot(point.x - previous.x, point.y - previous.y) < 3) continue;
      stage.style.setProperty("--cat-flip", point.x - previous.x < 0 ? -1 : 1);
      await moveSegment(previous, point, initial && index === 0);
      previous = point;
    }

    settleAtSpot(spot);
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
    if (!stage || isWalking) return;
    const spots = candidateSpots();
    const current = spots.find((spot) => spot.id === currentSpotId) || chooseNextSpot(false);
    currentSpotId = current.id;
    stage.style.transitionDuration = "260ms";
    stage.style.setProperty("--cat-x", `${current.x}px`);
    stage.style.setProperty("--cat-y", `${current.y}px`);
  }

  function boot() {
    stage = buildCat();
    if (!stage) return;

    const first = chooseNextSpot(false);
    const { height } = catSize();
    const startY = clamp(window.innerHeight * .80, 20, window.innerHeight - height - 10);
    stage.style.transitionDuration = "0ms";
    stage.style.setProperty("--cat-x", "-120px");
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

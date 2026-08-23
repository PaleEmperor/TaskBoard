(() => {
  const CLUB_KEY = "homeflow-afternoon-club-v1";
  const QUICK_TIMES = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
  const SCHOOL_END = {
    monday: "12:40",
    tuesday: "12:55",
    wednesday: "11:55",
    thursday: "12:55",
    friday: "11:55",
  };

  const copy = {
    en: {
      title: "Afternoon Club",
      forDay: "For {day}",
      endTime: "End time",
      quick: "Quick times",
      custom: "Or choose any time",
      schoolEnds: "School ends {time}",
      save: "Save",
      cancel: "Cancel",
      remove: "Remove",
      invalid: "The club has to end after school ({time}).",
      weekdays: { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" },
    },
    fi: {
      title: "Iltapäiväkerho",
      forDay: "Päivälle {day}",
      endTime: "Päättymisaika",
      quick: "Pikavalinnat",
      custom: "Tai valitse muu aika",
      schoolEnds: "Koulu päättyy klo {time}",
      save: "Tallenna",
      cancel: "Peruuta",
      remove: "Poista",
      invalid: "Kerhon täytyy päättyä koulupäivän jälkeen ({time}).",
      weekdays: { monday: "Maanantai", tuesday: "Tiistai", wednesday: "Keskiviikko", thursday: "Torstai", friday: "Perjantai" },
    },
    de: {
      title: "Nachmittagsbetreuung",
      forDay: "Für {day}",
      endTime: "Endzeit",
      quick: "Schnellauswahl",
      custom: "Oder eine andere Zeit wählen",
      schoolEnds: "Schule endet um {time}",
      save: "Speichern",
      cancel: "Abbrechen",
      remove: "Entfernen",
      invalid: "Die Betreuung muss nach Schulschluss ({time}) enden.",
      weekdays: { monday: "Montag", tuesday: "Dienstag", wednesday: "Mittwoch", thursday: "Donnerstag", friday: "Freitag" },
    },
  };

  let activeDate = null;
  let activeDay = null;

  function language() {
    const active = document.querySelector("#languageToggle .lang-chip.active[data-lang]")?.dataset.lang;
    if (copy[active]) return active;
    try {
      const stored = JSON.parse(localStorage.getItem("homeflow-board-v2") || "null")?.settings?.language;
      if (copy[stored]) return stored;
    } catch (_) {}
    return "en";
  }

  function parseTime(value) {
    const [hours, minutes] = String(value || "00:00").split(":").map(Number);
    return hours * 60 + minutes;
  }

  function readClubs() {
    try {
      const value = JSON.parse(localStorage.getItem(CLUB_KEY) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_) {
      return {};
    }
  }

  function writeClubs(value) {
    localStorage.setItem(CLUB_KEY, JSON.stringify(value));
  }

  function formatDate(dateKey, lang) {
    const [year, month, day] = String(dateKey).split("-").map(Number);
    const date = new Date(year, month - 1, day, 12);
    return new Intl.DateTimeFormat({ en: "en-GB", fi: "fi-FI", de: "de-DE" }[lang] || "en-GB", {
      day: "numeric",
      month: "short",
    }).format(date);
  }

  function refreshSchoolView() {
    const grid = document.getElementById("weekGrid");
    if (!grid) return;
    const marker = document.createComment("afternoon-club-refresh");
    grid.appendChild(marker);
    marker.remove();
  }

  function ensureOverlay() {
    if (document.getElementById("afternoonClubCompatOverlay")) return;

    const style = document.createElement("style");
    style.textContent = `
      .afternoon-club-compat-overlay[hidden]{display:none!important}
      .afternoon-club-compat-overlay{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:14px;background:rgba(30,43,50,.38);backdrop-filter:blur(5px)}
      .afternoon-club-compat-panel{width:min(520px,100%);max-height:calc(100vh - 28px);overflow:auto;border:1px solid rgba(104,133,150,.2);border-radius:22px;background:rgba(252,254,255,.99);color:#2d4552;box-shadow:0 28px 80px rgba(31,50,61,.3)}
      .afternoon-club-compat-head{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(104,133,150,.12);background:linear-gradient(135deg,rgba(255,249,230,.96),rgba(241,248,252,.98))}
      .afternoon-club-compat-title{display:flex;align-items:center;gap:10px}.afternoon-club-compat-title>span{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;background:rgba(255,240,197,.82);font-size:1.2rem}.afternoon-club-compat-title div{display:flex;flex-direction:column;gap:2px}.afternoon-club-compat-title strong{font-size:1rem}.afternoon-club-compat-title small{color:#7b8d98;font-size:.72rem;font-weight:750}
      .afternoon-club-compat-close{width:36px;height:36px;border:0;border-radius:999px;background:rgba(224,234,239,.78);color:#5e727e;cursor:pointer;font:inherit;font-size:1.4rem;line-height:1}
      .afternoon-club-compat-body{display:grid;gap:12px;padding:16px}.afternoon-club-compat-time{display:grid;gap:7px;color:#5c707d;font-size:.76rem;font-weight:850}.afternoon-club-compat-time input{width:100%;min-width:0;height:58px;box-sizing:border-box;padding:0 14px;border:1px solid rgba(106,137,154,.22);border-radius:14px;background:#fff;color:#2d4552;font:inherit;font-size:1.35rem;font-weight:900;font-variant-numeric:tabular-nums}.afternoon-club-compat-label,.afternoon-club-compat-helper{color:#7b8c96;font-size:.69rem;font-weight:800}.afternoon-club-compat-quick{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.afternoon-club-compat-quick button{min-height:42px;border:1px solid rgba(106,137,154,.18);border-radius:12px;background:rgba(242,247,250,.92);color:#506773;cursor:pointer;font:inherit;font-weight:900;font-variant-numeric:tabular-nums}.afternoon-club-compat-quick button.active{border-color:rgba(190,151,83,.32);background:rgba(255,246,220,.96);color:#7b6135}.afternoon-club-compat-error{min-height:18px;color:#a34e4e;font-size:.7rem;font-weight:800}
      .afternoon-club-compat-actions{display:grid;grid-template-columns:auto 1fr auto auto;gap:8px;align-items:center;padding:12px 16px 16px;border-top:1px solid rgba(104,133,150,.1)}.afternoon-club-compat-actions button{min-height:40px;padding:8px 13px;border-radius:12px;cursor:pointer;font:inherit;font-size:.74rem;font-weight:900}.afternoon-club-compat-remove{border:1px solid rgba(176,91,91,.18);background:rgba(253,239,239,.92);color:#9b5555}.afternoon-club-compat-cancel{border:1px solid rgba(106,137,154,.16);background:rgba(242,247,250,.92);color:#5c707d}.afternoon-club-compat-save{border:0;background:linear-gradient(135deg,#314c5d,#243844);color:#fff;box-shadow:0 7px 16px rgba(36,56,68,.16)}
      body.dark-mode .afternoon-club-compat-panel{background:#1c2b33;color:#eaf3f7;border-color:rgba(255,255,255,.08)}body.dark-mode .afternoon-club-compat-head{background:linear-gradient(135deg,rgba(69,57,36,.94),rgba(30,46,54,.98));border-color:rgba(255,255,255,.07)}body.dark-mode .afternoon-club-compat-time input{background:#23343d;color:#eef6f8;border-color:rgba(255,255,255,.1);color-scheme:dark}body.dark-mode .afternoon-club-compat-quick button,body.dark-mode .afternoon-club-compat-cancel{background:#263943;color:#c7d5dc;border-color:rgba(255,255,255,.08)}body.dark-mode .afternoon-club-compat-quick button.active{background:#594a30;color:#f0dba9;border-color:rgba(218,179,101,.18)}body.dark-mode .afternoon-club-compat-save{background:linear-gradient(135deg,#eef5f8,#dce8ed);color:#243844}
      @media(max-width:500px){.afternoon-club-compat-quick{grid-template-columns:repeat(2,minmax(0,1fr))}.afternoon-club-compat-actions{grid-template-columns:1fr 1fr}.afternoon-club-compat-actions .compat-spacer{display:none}.afternoon-club-compat-remove{grid-column:1}.afternoon-club-compat-cancel{grid-column:1;grid-row:2}.afternoon-club-compat-save{grid-column:2;grid-row:2}}
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "afternoonClubCompatOverlay";
    overlay.className = "afternoon-club-compat-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="afternoon-club-compat-panel" role="dialog" aria-modal="true" aria-labelledby="afternoonClubCompatTitle">
        <div class="afternoon-club-compat-head">
          <div class="afternoon-club-compat-title"><span aria-hidden="true">🌤️</span><div><strong id="afternoonClubCompatTitle"></strong><small data-compat-date></small></div></div>
          <button class="afternoon-club-compat-close" type="button" data-compat-close aria-label="Close">×</button>
        </div>
        <div class="afternoon-club-compat-body">
          <label class="afternoon-club-compat-time"><span data-compat-end-label></span><input type="time" step="1800" data-compat-time /></label>
          <div class="afternoon-club-compat-label" data-compat-quick-label></div>
          <div class="afternoon-club-compat-quick">${QUICK_TIMES.map((time) => `<button type="button" data-compat-quick="${time}">${time}</button>`).join("")}</div>
          <div class="afternoon-club-compat-helper" data-compat-helper></div>
          <div class="afternoon-club-compat-error" data-compat-error aria-live="polite"></div>
        </div>
        <div class="afternoon-club-compat-actions">
          <button class="afternoon-club-compat-remove" type="button" data-compat-remove></button><span class="compat-spacer"></span><button class="afternoon-club-compat-cancel" type="button" data-compat-close></button><button class="afternoon-club-compat-save" type="button" data-compat-save></button>
        </div>
      </section>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeOverlay();
    });
    overlay.querySelectorAll("[data-compat-close]").forEach((button) => button.addEventListener("click", closeOverlay));
    overlay.querySelectorAll("[data-compat-quick]").forEach((button) => button.addEventListener("click", () => {
      overlay.querySelector("[data-compat-time]").value = button.dataset.compatQuick;
      overlay.querySelectorAll("[data-compat-quick]").forEach((item) => item.classList.toggle("active", item === button));
      overlay.querySelector("[data-compat-error]").textContent = "";
    }));
    overlay.querySelector("[data-compat-save]").addEventListener("click", saveActive);
    overlay.querySelector("[data-compat-remove]").addEventListener("click", removeActive);
  }

  function closeOverlay() {
    const overlay = document.getElementById("afternoonClubCompatOverlay");
    if (overlay) overlay.hidden = true;
    activeDate = null;
    activeDay = null;
  }

  function openOverlay(dateKey, dayKey) {
    ensureOverlay();
    activeDate = dateKey;
    activeDay = dayKey;
    const overlay = document.getElementById("afternoonClubCompatOverlay");
    const lang = language();
    const t = copy[lang];
    const clubs = readClubs();
    const existing = clubs[dateKey] || "";
    const schoolEnd = SCHOOL_END[dayKey];
    const input = overlay.querySelector("[data-compat-time]");

    overlay.querySelector("#afternoonClubCompatTitle").textContent = t.title;
    overlay.querySelector("[data-compat-date]").textContent = t.forDay.replace("{day}", `${t.weekdays[dayKey]} ${formatDate(dateKey, lang)}`);
    overlay.querySelector("[data-compat-end-label]").textContent = t.endTime;
    overlay.querySelector("[data-compat-quick-label]").textContent = t.quick;
    overlay.querySelector("[data-compat-helper]").textContent = `${t.custom} · ${t.schoolEnds.replace("{time}", schoolEnd)}`;
    overlay.querySelector("[data-compat-save]").textContent = t.save;
    overlay.querySelector("[data-compat-cancel]").textContent = t.cancel;
    overlay.querySelector("[data-compat-remove]").textContent = t.remove;
    overlay.querySelector("[data-compat-remove]").hidden = !existing;
    overlay.querySelector("[data-compat-error]").textContent = "";
    input.min = schoolEnd;
    input.value = existing || "15:00";
    overlay.querySelectorAll("[data-compat-quick]").forEach((button) => button.classList.toggle("active", button.dataset.compatQuick === input.value));
    overlay.hidden = false;
    requestAnimationFrame(() => input.focus());
  }

  function saveActive() {
    if (!activeDate || !activeDay) return;
    const overlay = document.getElementById("afternoonClubCompatOverlay");
    const input = overlay.querySelector("[data-compat-time]");
    const schoolEnd = SCHOOL_END[activeDay];
    if (!input.value || parseTime(input.value) <= parseTime(schoolEnd)) {
      overlay.querySelector("[data-compat-error]").textContent = copy[language()].invalid.replace("{time}", schoolEnd);
      return;
    }
    const clubs = readClubs();
    clubs[activeDate] = input.value;
    writeClubs(clubs);
    closeOverlay();
    refreshSchoolView();
  }

  function removeActive() {
    if (!activeDate) return;
    const clubs = readClubs();
    delete clubs[activeDate];
    writeClubs(clubs);
    closeOverlay();
    refreshSchoolView();
  }

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-club-date]") : null;
    if (!target || !document.getElementById("schoolWeekGrid")?.contains(target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openOverlay(target.dataset.clubDate, target.dataset.clubDay);
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !document.getElementById("afternoonClubCompatOverlay")?.hidden) {
      event.preventDefault();
      closeOverlay();
    }
  });
})();
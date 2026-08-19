(() => {
  const VIEW_KEY = "homeflow-calendar-view-v1";
  const START_MINUTES = 8 * 60;
  const END_MINUTES = 13 * 60;
  const DAY_MINUTES = END_MINUTES - START_MINUTES;
  const weekdayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  const translations = {
    en: {
      tasks: "Tasks",
      school: "School",
      switchLabel: "Calendar view",
      schoolWeek: "Linnea's school week",
      repeatNote: "Same timetable every week",
      today: "Today",
      now: "Now",
      next: "Next",
      starts: "starts",
      until: "until",
      finished: "School is finished for today",
      noSchool: "No school today",
      noSchoolInView: "This timetable repeats every school week",
      room: "Room",
      weekdays: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
      },
    },
    fi: {
      tasks: "Tehtävät",
      school: "Koulu",
      switchLabel: "Kalenterinäkymä",
      schoolWeek: "Linnean kouluviikko",
      repeatNote: "Sama lukujärjestys joka viikko",
      today: "Tänään",
      now: "Nyt",
      next: "Seuraava",
      starts: "alkaa",
      until: "asti",
      finished: "Koulupäivä on tältä päivältä ohi",
      noSchool: "Ei koulua tänään",
      noSchoolInView: "Tämä lukujärjestys toistuu joka kouluviikko",
      room: "Luokka",
      weekdays: {
        monday: "Maanantai",
        tuesday: "Tiistai",
        wednesday: "Keskiviikko",
        thursday: "Torstai",
        friday: "Perjantai",
      },
    },
    de: {
      tasks: "Aufgaben",
      school: "Schule",
      switchLabel: "Kalenderansicht",
      schoolWeek: "Linneas Schulwoche",
      repeatNote: "Gleicher Stundenplan jede Woche",
      today: "Heute",
      now: "Jetzt",
      next: "Als Nächstes",
      starts: "beginnt",
      until: "bis",
      finished: "Der Schultag ist für heute vorbei",
      noSchool: "Heute ist keine Schule",
      noSchoolInView: "Dieser Stundenplan wiederholt sich jede Schulwoche",
      room: "Raum",
      weekdays: {
        monday: "Montag",
        tuesday: "Dienstag",
        wednesday: "Mittwoch",
        thursday: "Donnerstag",
        friday: "Freitag",
      },
    },
  };

  const subjects = {
    MU: {
      icon: "🎵",
      name: { en: "Music", fi: "Musiikki", de: "Musik" },
    },
    SUK: {
      icon: "📚",
      name: { en: "Finnish language & literature", fi: "Suomen kieli ja kirjallisuus", de: "Finnisch & Literatur" },
    },
    KS: {
      icon: "🧵",
      name: { en: "Crafts", fi: "Käsityö", de: "Werken" },
    },
    ENA1: {
      icon: "🇬🇧",
      name: { en: "English A1", fi: "Englanti A1", de: "Englisch A1" },
    },
    MA: {
      icon: "➗",
      name: { en: "Mathematics", fi: "Matematiikka", de: "Mathematik" },
    },
    YM: {
      icon: "🌍",
      name: { en: "Environmental studies", fi: "Ympäristöoppi", de: "Umweltkunde" },
    },
    UEEL: {
      icon: "💭",
      name: { en: "Religion / ethics", fi: "Uskonto / elämänkatsomustieto", de: "Religion / Ethik" },
    },
    LI: {
      icon: "🏃",
      name: { en: "Physical education", fi: "Liikunta", de: "Sport" },
    },
    KU: {
      icon: "🎨",
      name: { en: "Visual arts", fi: "Kuvataide", de: "Kunst" },
    },
  };

  const timetable = {
    monday: [
      ["08:00", "08:45", "MU", "KAT B407"],
      ["09:00", "09:45", "SUK", ""],
      ["09:55", "10:40", "SUK", ""],
      ["10:55", "11:40", "LI", "KAT ETT A108_2"],
      ["12:10", "12:55", "LI", "KAT ETT A108_2"],
    ],
    tuesday: [
      ["09:00", "09:45", "KS", "KAT B203"],
      ["09:55", "10:40", "ENA1", "KAT B203"],
      ["10:55", "11:40", "MA", ""],
      ["12:10", "12:55", "UEEL", ""],
    ],
    wednesday: [
      ["08:00", "08:45", "MA", ""],
      ["09:00", "09:45", "SUK", ""],
      ["09:55", "10:40", "SUK", ""],
      ["10:55", "11:40", "YM", ""],
    ],
    thursday: [
      ["09:00", "09:45", "KS", "KAT B203"],
      ["09:55", "10:40", "SUK", ""],
      ["10:55", "11:40", "SUK", ""],
      ["12:10", "12:55", "KU", "KAT B203"],
    ],
    friday: [
      ["09:00", "09:45", "SUK", ""],
      ["09:55", "10:40", "SUK", ""],
      ["10:55", "11:40", "MA", ""],
      ["12:10", "12:55", "YM", ""],
    ],
  };

  const localeFor = (language) => ({ en: "en-GB", fi: "fi-FI", de: "de-DE" }[language] || "en-GB");

  function parseTime(value) {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function dateFromKey(key) {
    const [year, month, day] = String(key || "").split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  function currentLanguage() {
    const activeChip = document.querySelector("#languageToggle .lang-chip.active[data-lang]");
    if (activeChip?.dataset.lang && translations[activeChip.dataset.lang]) {
      return activeChip.dataset.lang;
    }

    try {
      const stored = JSON.parse(localStorage.getItem("homeflow-board-v2") || "null");
      const language = stored?.settings?.language;
      if (translations[language]) return language;
    } catch (error) {
      // The main app owns this storage. A malformed value should not break the school view.
    }

    return "en";
  }

  function fallbackDates() {
    const now = new Date();
    const monday = new Date(now);
    monday.setHours(12, 0, 0, 0);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    return weekdayKeys.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }

  function displayedDates() {
    const dates = Array.from(document.querySelectorAll("#weekGrid .day-column[data-date]"))
      .slice(0, 5)
      .map((column) => dateFromKey(column.dataset.date))
      .filter((date) => !Number.isNaN(date.getTime()));
    return dates.length === 5 ? dates : fallbackDates();
  }

  function lessonStateFor(dayKey, lesson, displayedDate) {
    if (dateKey(displayedDate) !== dateKey(new Date())) return "";
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const start = parseTime(lesson[0]);
    const end = parseTime(lesson[1]);
    if (nowMinutes >= start && nowMinutes < end) return "current";

    const lessons = timetable[dayKey] || [];
    const nextLesson = lessons.find((item) => parseTime(item[0]) > nowMinutes);
    return nextLesson === lesson ? "next" : "";
  }

  function currentDayStatus(language, dates) {
    const t = translations[language];
    const today = new Date();
    const todayKey = dateKey(today);
    const displayedIndex = dates.findIndex((date) => dateKey(date) === todayKey);
    if (displayedIndex === -1) {
      return { icon: "🔁", label: t.noSchoolInView, tone: "neutral" };
    }

    const dayKey = weekdayKeys[displayedIndex];
    const lessons = timetable[dayKey] || [];
    if (!lessons.length) return { icon: "🌙", label: t.noSchool, tone: "neutral" };

    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    const current = lessons.find((lesson) => nowMinutes >= parseTime(lesson[0]) && nowMinutes < parseTime(lesson[1]));
    if (current) {
      const subject = subjects[current[2]];
      return {
        icon: subject.icon,
        label: `${t.now}: ${subject.name[language]} · ${t.until} ${current[1]}`,
        tone: "current",
      };
    }

    const next = lessons.find((lesson) => parseTime(lesson[0]) > nowMinutes);
    if (next) {
      const subject = subjects[next[2]];
      return {
        icon: subject.icon,
        label: `${t.next}: ${subject.name[language]} · ${t.starts} ${next[0]}`,
        tone: "next",
      };
    }

    return { icon: "✨", label: t.finished, tone: "done" };
  }

  function formatDayDate(date, language) {
    return new Intl.DateTimeFormat(localeFor(language), { day: "numeric", month: "short" }).format(date);
  }

  function timeLabels() {
    const labels = [];
    for (let minutes = START_MINUTES; minutes <= END_MINUTES; minutes += 60) {
      const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
      const mins = String(minutes % 60).padStart(2, "0");
      labels.push({ value: `${hours}:${mins}`, top: ((minutes - START_MINUTES) / DAY_MINUTES) * 100 });
    }
    return labels;
  }

  function lessonMarkup(dayKey, lesson, displayedDate, language) {
    const [start, end, code, room] = lesson;
    const subject = subjects[code];
    const startMinutes = parseTime(start);
    const endMinutes = parseTime(end);
    const top = ((startMinutes - START_MINUTES) / DAY_MINUTES) * 100;
    const height = ((endMinutes - startMinutes) / DAY_MINUTES) * 100;
    const state = lessonStateFor(dayKey, lesson, displayedDate);
    const stateText = state === "current" ? translations[language].now : state === "next" ? translations[language].next : "";

    return `
      <article class="school-lesson school-subject-${code.toLowerCase()}${state ? ` is-${state}` : ""}"
        style="--lesson-top:${top}%;--lesson-height:${height}%" title="${subject.name[language]} · ${start}–${end}${room ? ` · ${room}` : ""}">
        <div class="school-lesson-topline">
          <span class="school-subject-icon" aria-hidden="true">${subject.icon}</span>
          <span class="school-subject-code">${code}</span>
          ${stateText ? `<span class="school-live-badge">${stateText}</span>` : ""}
        </div>
        <strong>${subject.name[language]}</strong>
        <div class="school-lesson-meta">
          <span>${start}–${end}</span>
          ${room ? `<span>${room}</span>` : ""}
        </div>
      </article>
    `;
  }

  function renderSchoolView() {
    const view = document.getElementById("schoolWeekGrid");
    if (!view) return;

    const language = currentLanguage();
    const t = translations[language];
    const dates = displayedDates();
    const todayKey = dateKey(new Date());
    const status = currentDayStatus(language, dates);

    const headers = weekdayKeys.map((dayKey, index) => {
      const isToday = dateKey(dates[index]) === todayKey;
      return `
        <div class="school-day-heading${isToday ? " is-today" : ""}">
          <span class="school-day-name">${t.weekdays[dayKey]}</span>
          <span class="school-day-date">${formatDayDate(dates[index], language)}</span>
          ${isToday ? `<span class="school-today-pill">${t.today}</span>` : ""}
        </div>
      `;
    }).join("");

    const labels = timeLabels().map((item) => `
      <span class="school-time-label" style="--time-top:${item.top}%">${item.value}</span>
    `).join("");

    const lanes = weekdayKeys.map((dayKey, index) => {
      const date = dates[index];
      const isToday = dateKey(date) === todayKey;
      return `
        <div class="school-day-lane${isToday ? " is-today" : ""}">
          ${(timetable[dayKey] || []).map((lesson) => lessonMarkup(dayKey, lesson, date, language)).join("")}
        </div>
      `;
    }).join("");

    const mobileDays = weekdayKeys.map((dayKey, index) => {
      const date = dates[index];
      const isToday = dateKey(date) === todayKey;
      return `
        <section class="school-mobile-day${isToday ? " is-today" : ""}">
          <header>
            <div>
              <strong>${t.weekdays[dayKey]}</strong>
              <span>${formatDayDate(date, language)}</span>
            </div>
            ${isToday ? `<span class="school-today-pill">${t.today}</span>` : ""}
          </header>
          <div class="school-mobile-lessons">
            ${(timetable[dayKey] || []).map((lesson) => {
              const [start, end, code, room] = lesson;
              const subject = subjects[code];
              const state = lessonStateFor(dayKey, lesson, date);
              const stateText = state === "current" ? t.now : state === "next" ? t.next : "";
              return `
                <article class="school-mobile-lesson school-subject-${code.toLowerCase()}${state ? ` is-${state}` : ""}">
                  <div class="school-mobile-time"><strong>${start}</strong><span>${end}</span></div>
                  <div class="school-mobile-subject">
                    <div class="school-mobile-title"><span aria-hidden="true">${subject.icon}</span><strong>${subject.name[language]}</strong>${stateText ? `<span class="school-live-badge">${stateText}</span>` : ""}</div>
                    <div class="school-mobile-meta"><span>${code}</span>${room ? `<span>${room}</span>` : ""}</div>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </section>
      `;
    }).join("");

    view.innerHTML = `
      <section class="school-overview">
        <div class="school-overview-icon" aria-hidden="true">🎒</div>
        <div class="school-overview-copy">
          <span class="school-overview-kicker">${t.school}</span>
          <strong>${t.schoolWeek}</strong>
          <span>${t.repeatNote}</span>
        </div>
        <div class="school-status school-status-${status.tone}">
          <span aria-hidden="true">${status.icon}</span>
          <strong>${status.label}</strong>
        </div>
      </section>

      <div class="school-desktop-timetable">
        <div class="school-timetable-header">
          <div class="school-time-heading">⏰</div>
          ${headers}
        </div>
        <div class="school-timeline">
          <div class="school-time-rail">${labels}</div>
          <div class="school-lanes">${lanes}</div>
        </div>
      </div>

      <div class="school-mobile-timetable">${mobileDays}</div>
    `;
  }

  function updateToggleLanguage() {
    const language = currentLanguage();
    const t = translations[language];
    const switcher = document.getElementById("calendarViewSwitch");
    if (!switcher) return;
    switcher.setAttribute("aria-label", t.switchLabel);
    const tasksLabel = switcher.querySelector('[data-view="tasks"] .calendar-view-label');
    const schoolLabel = switcher.querySelector('[data-view="school"] .calendar-view-label');
    if (tasksLabel) tasksLabel.textContent = t.tasks;
    if (schoolLabel) schoolLabel.textContent = t.school;
  }

  function setView(viewName, persist = true) {
    const targetView = viewName === "school" ? "school" : "tasks";
    const taskGrid = document.getElementById("weekGrid");
    const schoolGrid = document.getElementById("schoolWeekGrid");
    const switcher = document.getElementById("calendarViewSwitch");
    if (!taskGrid || !schoolGrid || !switcher) return;

    const schoolActive = targetView === "school";
    taskGrid.hidden = schoolActive;
    schoolGrid.hidden = !schoolActive;
    document.body.classList.toggle("school-calendar-active", schoolActive);

    switcher.querySelectorAll("[data-view]").forEach((button) => {
      const active = button.dataset.view === targetView;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });

    if (schoolActive) renderSchoolView();
    if (persist) localStorage.setItem(VIEW_KEY, targetView);
  }

  function install() {
    const taskGrid = document.getElementById("weekGrid");
    const boardHeader = document.querySelector(".board-panel-header");
    const boardTools = boardHeader?.querySelector(".board-tools");
    if (!taskGrid || !boardHeader || !boardTools || document.getElementById("calendarViewSwitch")) return;

    const switcher = document.createElement("div");
    switcher.id = "calendarViewSwitch";
    switcher.className = "calendar-view-switch";
    switcher.setAttribute("role", "tablist");
    switcher.innerHTML = `
      <button type="button" class="calendar-view-option active" data-view="tasks" role="tab" aria-selected="true">
        <span class="calendar-view-icon" aria-hidden="true">📋</span>
        <span class="calendar-view-label">Tasks</span>
      </button>
      <button type="button" class="calendar-view-option" data-view="school" role="tab" aria-selected="false" tabindex="-1">
        <span class="calendar-view-icon" aria-hidden="true">🎒</span>
        <span class="calendar-view-label">School</span>
      </button>
    `;
    boardHeader.insertBefore(switcher, boardTools);

    const schoolGrid = document.createElement("div");
    schoolGrid.id = "schoolWeekGrid";
    schoolGrid.className = "school-week-view";
    schoolGrid.hidden = true;
    taskGrid.insertAdjacentElement("afterend", schoolGrid);

    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-view]");
      if (!button) return;
      setView(button.dataset.view);
    });

    switcher.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const nextView = event.key === "ArrowRight" ? "school" : "tasks";
      setView(nextView);
      switcher.querySelector(`[data-view="${nextView}"]`)?.focus();
    });

    const languageToggle = document.getElementById("languageToggle");
    if (languageToggle) {
      new MutationObserver(() => {
        updateToggleLanguage();
        renderSchoolView();
      }).observe(languageToggle, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    }

    new MutationObserver(() => {
      if (!schoolGrid.hidden) renderSchoolView();
    }).observe(taskGrid, { childList: true, subtree: false });

    updateToggleLanguage();
    renderSchoolView();
    setView(localStorage.getItem(VIEW_KEY) || "tasks", false);
    window.setInterval(() => {
      if (!schoolGrid.hidden) renderSchoolView();
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();

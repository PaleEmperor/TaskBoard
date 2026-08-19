(() => {
  const VIEW_KEY = "homeflow-calendar-view-v1";
  const SCHOOL_CALENDAR_URL = "./data/rovaniemi-school-calendar-2026-2027.json";
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
      today: "Today",
      now: "Now",
      next: "Next",
      starts: "starts",
      until: "until",
      finished: "School is finished for today",
      holidayToday: "School holiday today",
      dayLength: "School day",
      lessons: "lessons",
      lesson: "lesson",
      noLessons: "No classes",
      holiday: "Holiday",
      yayNextWeek: "Yay — {holiday} next week!",
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
      today: "Tänään",
      now: "Nyt",
      next: "Seuraava",
      starts: "alkaa",
      until: "asti",
      finished: "Koulupäivä on tältä päivältä ohi",
      holidayToday: "Tänään on koululoma",
      dayLength: "Koulupäivä",
      lessons: "tuntia",
      lesson: "tunti",
      noLessons: "Ei oppitunteja",
      holiday: "Loma",
      yayNextWeek: "Jee — ensi viikolla {holiday}!",
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
      today: "Heute",
      now: "Jetzt",
      next: "Als Nächstes",
      starts: "beginnt",
      until: "bis",
      finished: "Der Schultag ist für heute vorbei",
      holidayToday: "Heute sind Schulferien",
      dayLength: "Schultag",
      lessons: "Stunden",
      lesson: "Stunde",
      noLessons: "Kein Unterricht",
      holiday: "Ferien",
      yayNextWeek: "Juhu — nächste Woche {holiday}!",
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
    MU: { icon: "🎵", name: { en: "Music", fi: "Musiikki", de: "Musik" } },
    SUK: { icon: "📚", name: { en: "Finnish language & literature", fi: "Suomen kieli ja kirjallisuus", de: "Finnisch & Literatur" } },
    KS: { icon: "🧵", name: { en: "Crafts", fi: "Käsityö", de: "Werken" } },
    ENA1: { icon: "🇬🇧", name: { en: "English A1", fi: "Englanti A1", de: "Englisch A1" } },
    MA: { icon: "➗", name: { en: "Mathematics", fi: "Matematiikka", de: "Mathematik" } },
    YM: { icon: "🌍", name: { en: "Environmental studies", fi: "Ympäristöoppi", de: "Umweltkunde" } },
    UEEL: { icon: "💭", name: { en: "Religion / ethics", fi: "Uskonto / elämänkatsomustieto", de: "Religion / Ethik" } },
    LI: { icon: "🏃", name: { en: "Physical education", fi: "Liikunta", de: "Sport" } },
    KU: { icon: "🎨", name: { en: "Visual arts", fi: "Kuvataide", de: "Kunst" } },
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

  let schoolCalendar = null;

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

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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
    return weekdayKeys.map((_, index) => addDays(monday, index));
  }

  function displayedDates() {
    const dates = Array.from(document.querySelectorAll("#weekGrid .day-column[data-date]"))
      .slice(0, 5)
      .map((column) => dateFromKey(column.dataset.date))
      .filter((date) => !Number.isNaN(date.getTime()));
    return dates.length === 5 ? dates : fallbackDates();
  }

  function holidayName(holiday, language) {
    return holiday?.name?.[language] || holiday?.name?.en || "";
  }

  function holidayForDate(date) {
    if (!schoolCalendar?.holidays) return null;
    const key = dateKey(date);
    return schoolCalendar.holidays.find((holiday) => key >= holiday.start && key <= holiday.end) || null;
  }

  function isInsideTerm(date) {
    if (!schoolCalendar?.termStart || !schoolCalendar?.termEnd) return true;
    const key = dateKey(date);
    return key >= schoolCalendar.termStart && key <= schoolCalendar.termEnd;
  }

  function dayLessons(dayKey, date) {
    if (!isInsideTerm(date) || holidayForDate(date)) return [];
    return timetable[dayKey] || [];
  }

  function focusedIndex(dates) {
    const today = dateKey(new Date());
    const todayIndex = dates.findIndex((date) => dateKey(date) === today);
    if (todayIndex >= 0) return todayIndex;
    const weekday = new Date().getDay();
    return weekday >= 1 && weekday <= 5 ? weekday - 1 : 0;
  }

  function lessonStateFor(dayKey, lesson, displayedDate) {
    if (dateKey(displayedDate) !== dateKey(new Date())) return "";
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const start = parseTime(lesson[0]);
    const end = parseTime(lesson[1]);
    if (nowMinutes >= start && nowMinutes < end) return "current";
    const lessons = dayLessons(dayKey, displayedDate);
    const nextLesson = lessons.find((item) => parseTime(item[0]) > nowMinutes);
    return nextLesson === lesson ? "next" : "";
  }

  function currentDayStatus(language, dates) {
    const t = translations[language];
    const today = new Date();
    const displayedIndex = dates.findIndex((date) => dateKey(date) === dateKey(today));
    if (displayedIndex === -1) return null;

    const holiday = holidayForDate(today);
    if (holiday) {
      return {
        icon: "🌙",
        label: `${t.holidayToday} · ${holidayName(holiday, language)}`,
        tone: "holiday",
      };
    }

    const dayKey = weekdayKeys[displayedIndex];
    const lessons = dayLessons(dayKey, today);
    if (!lessons.length) return null;

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

  function nextWeekHoliday(dates) {
    if (!schoolCalendar?.holidays?.length || !dates.length) return null;
    const weekStart = dates[0];
    const nextWeekStart = addDays(weekStart, 7);
    const nextWeekEnd = addDays(weekStart, 13);
    const startKey = dateKey(nextWeekStart);
    const endKey = dateKey(nextWeekEnd);
    return schoolCalendar.holidays.find((holiday) => holiday.start >= startKey && holiday.start <= endKey) || null;
  }

  function formatDayDate(date, language) {
    return new Intl.DateTimeFormat(localeFor(language), { day: "numeric", month: "short" }).format(date);
  }

  function daySpan(lessons) {
    if (!lessons.length) return null;
    const start = lessons[0][0];
    const end = lessons[lessons.length - 1][1];
    return { start, end, minutes: parseTime(end) - parseTime(start) };
  }

  function durationText(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins ? `${hours} h ${mins} min` : `${hours} h`;
  }

  function lessonCountText(count, language) {
    const t = translations[language];
    return `${count} ${count === 1 ? t.lesson : t.lessons}`;
  }

  function timeLabels() {
    const labels = [];
    for (let minutes = START_MINUTES; minutes <= END_MINUTES; minutes += 60) {
      labels.push({
        value: `${String(Math.floor(minutes / 60)).padStart(2, "0")}:00`,
        top: ((minutes - START_MINUTES) / DAY_MINUTES) * 100,
      });
    }
    return labels;
  }

  function expandedLessonMarkup(dayKey, lesson, displayedDate, language) {
    const [start, end, code, room] = lesson;
    const subject = subjects[code];
    const top = ((parseTime(start) - START_MINUTES) / DAY_MINUTES) * 100;
    const height = ((parseTime(end) - parseTime(start)) / DAY_MINUTES) * 100;
    const state = lessonStateFor(dayKey, lesson, displayedDate);
    const stateText = state === "current" ? translations[language].now : state === "next" ? translations[language].next : "";

    return `
      <article class="school-expanded-lesson school-subject-${code.toLowerCase()}${state ? ` is-${state}` : ""}"
        style="--lesson-top:${top}%;--lesson-height:${height}%"
        title="${subject.name[language]} · ${start}–${end}${room ? ` · ${room}` : ""}">
        <div class="school-expanded-lesson-top">
          <span class="school-subject-icon" aria-hidden="true">${subject.icon}</span>
          <strong>${subject.name[language]}</strong>
          ${stateText ? `<span class="school-live-badge">${stateText}</span>` : ""}
        </div>
        <div class="school-expanded-lesson-meta">
          <span>${start}–${end}</span>
          <span>${code}</span>
          ${room ? `<span>${room}</span>` : ""}
        </div>
      </article>
    `;
  }

  function compactSubjects(lessons, language) {
    return lessons.map((lesson) => {
      const code = lesson[2];
      const subject = subjects[code];
      return `<span class="school-compact-subject school-subject-${code.toLowerCase()}" title="${subject.name[language]}"><span aria-hidden="true">${subject.icon}</span><b>${code}</b></span>`;
    }).join("");
  }

  function renderExpandedDay(dayKey, date, language, isToday) {
    const t = translations[language];
    const holiday = holidayForDate(date);
    const lessons = dayLessons(dayKey, date);
    const span = daySpan(lessons);
    const labels = timeLabels().map((item) => `<span class="school-time-label" style="--time-top:${item.top}%">${item.value}</span>`).join("");

    if (holiday) {
      return `
        <section class="school-day-card is-expanded is-holiday${isToday ? " is-today" : ""}">
          <header class="school-day-card-header">
            <div><strong>${t.weekdays[dayKey]}</strong><span>${formatDayDate(date, language)}</span></div>
            ${isToday ? `<span class="school-today-pill">${t.today}</span>` : ""}
          </header>
          <div class="school-expanded-holiday">
            <span aria-hidden="true">🌿</span>
            <strong>${holidayName(holiday, language)}</strong>
            <small>${t.holiday}</small>
          </div>
        </section>
      `;
    }

    return `
      <section class="school-day-card is-expanded${isToday ? " is-today" : ""}">
        <header class="school-day-card-header">
          <div>
            <strong>${t.weekdays[dayKey]}</strong>
            <span>${formatDayDate(date, language)}</span>
          </div>
          ${isToday ? `<span class="school-today-pill">${t.today}</span>` : ""}
        </header>
        ${span ? `
          <div class="school-day-range expanded">
            <div><small>${t.dayLength}</small><strong>${span.start} → ${span.end}</strong></div>
            <span>${durationText(span.minutes)}</span>
          </div>
          <div class="school-expanded-timeline">
            <div class="school-time-rail">${labels}</div>
            <div class="school-expanded-lane">
              ${lessons.map((lesson) => expandedLessonMarkup(dayKey, lesson, date, language)).join("")}
            </div>
          </div>
        ` : `<div class="school-no-lessons">${t.noLessons}</div>`}
      </section>
    `;
  }

  function renderCompactDay(dayKey, date, language, isToday) {
    const t = translations[language];
    const holiday = holidayForDate(date);
    const lessons = dayLessons(dayKey, date);
    const span = daySpan(lessons);

    return `
      <section class="school-day-card is-compact${holiday ? " is-holiday" : ""}${isToday ? " is-today" : ""}">
        <header class="school-day-card-header">
          <div><strong>${t.weekdays[dayKey]}</strong><span>${formatDayDate(date, language)}</span></div>
          ${isToday ? `<span class="school-today-pill">${t.today}</span>` : ""}
        </header>
        ${holiday ? `
          <div class="school-compact-holiday">
            <span aria-hidden="true">🌿</span>
            <strong>${holidayName(holiday, language)}</strong>
          </div>
        ` : span ? `
          <div class="school-day-range compact">
            <strong>${span.start}</strong>
            <span aria-hidden="true">↓</span>
            <strong>${span.end}</strong>
            <small>${durationText(span.minutes)}</small>
          </div>
          <div class="school-compact-count">${lessonCountText(lessons.length, language)}</div>
          <div class="school-compact-subjects">${compactSubjects(lessons, language)}</div>
        ` : `<div class="school-no-lessons compact">${t.noLessons}</div>`}
      </section>
    `;
  }

  function renderHolidayTeaser(holiday, language) {
    if (!holiday) return "";
    const t = translations[language];
    const name = holidayName(holiday, language);
    const message = t.yayNextWeek.replace("{holiday}", name);
    return `
      <aside class="school-holiday-teaser" role="status">
        <span class="school-holiday-spark" aria-hidden="true">✦</span>
        <strong>${message}</strong>
        <span class="school-holiday-spark second" aria-hidden="true">✦</span>
      </aside>
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
    const teaserHoliday = nextWeekHoliday(dates);
    const expandedIndex = focusedIndex(dates);

    const dayCards = weekdayKeys.map((dayKey, index) => {
      const date = dates[index];
      const isToday = dateKey(date) === todayKey;
      return index === expandedIndex
        ? renderExpandedDay(dayKey, date, language, isToday)
        : renderCompactDay(dayKey, date, language, isToday);
    }).join("");

    view.innerHTML = `
      <div class="school-top-row">
        <div class="school-title">
          <span aria-hidden="true">🎒</span>
          <strong>${t.schoolWeek}</strong>
        </div>
        ${status ? `<div class="school-status school-status-${status.tone}"><span aria-hidden="true">${status.icon}</span><strong>${status.label}</strong></div>` : ""}
      </div>
      ${renderHolidayTeaser(teaserHoliday, language)}
      <div class="school-week-days">${dayCards}</div>
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

  async function loadSchoolCalendar() {
    try {
      const response = await fetch(SCHOOL_CALENDAR_URL);
      if (response.ok) schoolCalendar = await response.json();
    } catch (error) {
      // The timetable still works if the optional local school-calendar file is unavailable.
    }
    renderSchoolView();
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
      if (button) setView(button.dataset.view);
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
    loadSchoolCalendar();

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

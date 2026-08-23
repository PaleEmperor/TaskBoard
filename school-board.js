(() => {
  const VIEW_KEY = "homeflow-calendar-view-v1";
  const CLUB_KEY = "homeflow-afternoon-club-v1";
  const SCHOOL_CALENDAR_URL = "./data/rovaniemi-school-calendar-2026-2027.json";
  const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const BASE_START = 8 * 60;
  const BASE_END = 13 * 60;
  const LUNCH_AT = 10 * 60 + 20;
  const QUICK_TIMES = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  const i18n = {
    en: {
      tasks: "Tasks", school: "School", switchLabel: "Calendar view", schoolWeek: "Linnea's school week",
      today: "Today", now: "Now", next: "Next", finished: "School is finished for today",
      holidayToday: "School holiday today", dayLength: "School day", lessons: "lessons", lesson: "lesson",
      noLessons: "No classes", holiday: "Holiday", lunch: "Lunch", yayNextWeek: "Yay — {holiday} next week!",
      club: "Afternoon Club", addClub: "Add Afternoon Club", editClub: "Afternoon Club until {time}",
      clubTitle: "Afternoon Club", clubFor: "For {day}", endTime: "End time", quickTimes: "Quick times",
      customTime: "Or choose any time", save: "Save", cancel: "Cancel", remove: "Remove",
      invalidTime: "The club has to end after school ({time}).",
      weekdays: { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" }
    },
    fi: {
      tasks: "Tehtävät", school: "Koulu", switchLabel: "Kalenterinäkymä", schoolWeek: "Linnean kouluviikko",
      today: "Tänään", now: "Nyt", next: "Seuraava", finished: "Koulupäivä on tältä päivältä ohi",
      holidayToday: "Tänään on koululoma", dayLength: "Koulupäivä", lessons: "tuntia", lesson: "tunti",
      noLessons: "Ei oppitunteja", holiday: "Loma", lunch: "Ruoka", yayNextWeek: "Jee — ensi viikolla {holiday}!",
      club: "Iltapäiväkerho", addClub: "Lisää iltapäiväkerho", editClub: "Iltapäiväkerho klo {time} asti",
      clubTitle: "Iltapäiväkerho", clubFor: "Päivälle {day}", endTime: "Päättymisaika", quickTimes: "Pikavalinnat",
      customTime: "Tai valitse muu aika", save: "Tallenna", cancel: "Peruuta", remove: "Poista",
      invalidTime: "Kerhon täytyy päättyä koulupäivän jälkeen ({time}).",
      weekdays: { monday: "Maanantai", tuesday: "Tiistai", wednesday: "Keskiviikko", thursday: "Torstai", friday: "Perjantai" }
    },
    de: {
      tasks: "Aufgaben", school: "Schule", switchLabel: "Kalenderansicht", schoolWeek: "Linneas Schulwoche",
      today: "Heute", now: "Jetzt", next: "Als Nächstes", finished: "Der Schultag ist für heute vorbei",
      holidayToday: "Heute sind Schulferien", dayLength: "Schultag", lessons: "Stunden", lesson: "Stunde",
      noLessons: "Kein Unterricht", holiday: "Ferien", lunch: "Mittagessen", yayNextWeek: "Juhu — nächste Woche {holiday}!",
      club: "Nachmittagsbetreuung", addClub: "Nachmittagsbetreuung hinzufügen", editClub: "Nachmittagsbetreuung bis {time}",
      clubTitle: "Nachmittagsbetreuung", clubFor: "Für {day}", endTime: "Endzeit", quickTimes: "Schnellauswahl",
      customTime: "Oder eine andere Zeit wählen", save: "Speichern", cancel: "Abbrechen", remove: "Entfernen",
      invalidTime: "Die Betreuung muss nach Schulschluss ({time}) enden.",
      weekdays: { monday: "Montag", tuesday: "Dienstag", wednesday: "Mittwoch", thursday: "Donnerstag", friday: "Freitag" }
    }
  };

  const subjects = {
    MU: { icon: "🎵", label: "MU", name: { en: "Music", fi: "Musiikki", de: "Musik" } },
    SUK: { icon: "📚", label: "SUK", name: { en: "Finnish language & literature", fi: "Suomen kieli ja kirjallisuus", de: "Finnisch & Literatur" } },
    KS: { icon: "🧵", label: "KS", name: { en: "Crafts", fi: "Käsityö", de: "Werken" } },
    EN: { icon: "🇬🇧", label: "EN", name: { en: "English", fi: "Englanti", de: "Englisch" } },
    MA: { icon: "➗", label: "MA", name: { en: "Mathematics", fi: "Matematiikka", de: "Mathematik" } },
    YM: { icon: "🌍", label: "YM", name: { en: "Environmental studies", fi: "Ympäristöoppi", de: "Umweltkunde" } },
    UEET: { icon: "💭", label: "UE/ET", name: { en: "Religion / ethics", fi: "Uskonto / elämänkatsomustieto", de: "Religion / Ethik" } },
    LI: { icon: "🏃", label: "LI", name: { en: "Physical education", fi: "Liikunta", de: "Sport" } },
    KU: { icon: "🎨", label: "KU", name: { en: "Visual arts", fi: "Kuvataide", de: "Kunst" } }
  };

  const timetable = {
    monday: [
      { start: "08:00", end: "08:45", code: "MU" },
      { start: "09:00", end: "09:45", code: "SUK" },
      { start: "09:45", end: "10:30", code: "SUK" },
      { start: "11:10", end: "11:55", code: "LI" },
      { start: "12:10", end: "12:40", code: "LI" }
    ],
    tuesday: [
      { start: "09:00", end: "09:45", code: "KS" },
      { start: "09:45", end: "10:30", code: "EN" },
      { start: "11:10", end: "11:55", code: "MA" },
      { start: "12:10", end: "12:55", code: "UEET" }
    ],
    wednesday: [
      { start: "08:00", end: "08:45", code: "MA" },
      { start: "09:00", end: "09:45", code: "SUK" },
      { start: "09:45", end: "10:30", code: "SUK" },
      { start: "11:10", end: "11:55", code: "YM" }
    ],
    thursday: [
      { start: "09:00", end: "09:45", code: "KS" },
      { start: "09:45", end: "10:30", code: "SUK" },
      { start: "11:10", end: "11:55", code: "SUK" },
      { start: "12:10", end: "12:55", code: "KU" }
    ],
    friday: [
      { start: "08:00", end: "08:45", code: "MA" },
      { start: "09:00", end: "09:45", code: "SUK" },
      { start: "09:45", end: "10:30", code: "SUK" },
      { start: "11:10", end: "11:55", code: "YM" }
    ]
  };

  let schoolCalendar = null;
  let selectedDateKey = null;
  let activeClubDateKey = null;

  const localeFor = (lang) => ({ en: "en-GB", fi: "fi-FI", de: "de-DE" }[lang] || "en-GB");
  const parseTime = (value) => { const [h, m] = String(value || "00:00").split(":").map(Number); return h * 60 + m; };
  const minuteTime = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  const keyFor = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const fromKey = (key) => { const [y, m, d] = String(key).split("-").map(Number); return new Date(y, m - 1, d, 12); };
  const addDays = (date, n) => { const result = new Date(date); result.setDate(result.getDate() + n); return result; };

  function language() {
    const active = document.querySelector("#languageToggle .lang-chip.active[data-lang]")?.dataset.lang;
    if (i18n[active]) return active;
    try {
      const stored = JSON.parse(localStorage.getItem("homeflow-board-v2") || "null")?.settings?.language;
      if (i18n[stored]) return stored;
    } catch (_) {}
    return "en";
  }

  function loadClubs() {
    try {
      const value = JSON.parse(localStorage.getItem(CLUB_KEY) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_) { return {}; }
  }

  const saveClubs = (clubs) => localStorage.setItem(CLUB_KEY, JSON.stringify(clubs));
  const clubEnd = (date) => loadClubs()[keyFor(date)] || null;

  function fallbackDates() {
    const now = new Date();
    const monday = new Date(now);
    monday.setHours(12, 0, 0, 0);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    return WEEKDAYS.map((_, index) => addDays(monday, index));
  }

  function displayedDates() {
    const dates = Array.from(document.querySelectorAll("#weekGrid .day-column[data-date]"))
      .slice(0, 5).map((el) => fromKey(el.dataset.date)).filter((date) => !Number.isNaN(date.getTime()));
    return dates.length === 5 ? dates : fallbackDates();
  }

  const holidayName = (holiday, lang) => holiday?.name?.[lang] || holiday?.name?.en || "";
  function holidayFor(date) {
    if (!schoolCalendar?.holidays) return null;
    const key = keyFor(date);
    return schoolCalendar.holidays.find((holiday) => key >= holiday.start && key <= holiday.end) || null;
  }

  function insideTerm(date) {
    if (!schoolCalendar?.termStart || !schoolCalendar?.termEnd) return true;
    const key = keyFor(date);
    return key >= schoolCalendar.termStart && key <= schoolCalendar.termEnd;
  }

  function lessonsFor(dayKey, date) {
    if (!insideTerm(date) || holidayFor(date)) return [];
    return timetable[dayKey] || [];
  }

  function schoolEnd(dayKey, date) {
    const lessons = lessonsFor(dayKey, date);
    return lessons.length ? lessons[lessons.length - 1].end : null;
  }

  function resolveSelectedIndex(dates) {
    const keys = dates.map(keyFor);
    const selectedIndex = selectedDateKey ? keys.indexOf(selectedDateKey) : -1;
    if (selectedIndex >= 0) return selectedIndex;
    const todayIndex = keys.indexOf(keyFor(new Date()));
    let index = todayIndex;
    if (index < 0) {
      const day = new Date().getDay();
      index = day >= 1 && day <= 5 ? day - 1 : 0;
    }
    selectedDateKey = keys[index] || keys[0] || null;
    return Math.max(0, index);
  }

  function lessonState(dayKey, lesson, date) {
    if (keyFor(date) !== keyFor(new Date())) return "";
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    if (minutes >= parseTime(lesson.start) && minutes < parseTime(lesson.end)) return "current";
    const nextLesson = lessonsFor(dayKey, date).find((item) => parseTime(item.start) > minutes);
    return nextLesson === lesson ? "next" : "";
  }

  function currentStatus(lang, dates) {
    const t = i18n[lang];
    const today = new Date();
    const index = dates.findIndex((date) => keyFor(date) === keyFor(today));
    if (index < 0) return null;
    const holiday = holidayFor(today);
    if (holiday) return { icon: "🌙", label: `${t.holidayToday} · ${holidayName(holiday, lang)}`, tone: "holiday" };
    const end = schoolEnd(WEEKDAYS[index], today);
    if (!end) return null;
    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    return nowMinutes >= parseTime(end) ? { icon: "✨", label: t.finished, tone: "done" } : null;
  }

  function nextWeekHoliday(dates) {
    if (!schoolCalendar?.holidays?.length || !dates.length) return null;
    const start = keyFor(addDays(dates[0], 7));
    const end = keyFor(addDays(dates[0], 13));
    return schoolCalendar.holidays.find((holiday) => holiday.start >= start && holiday.start <= end) || null;
  }

  const formatDate = (date, lang) => new Intl.DateTimeFormat(localeFor(lang), { day: "numeric", month: "short" }).format(date);
  function daySpan(lessons) {
    if (!lessons.length) return null;
    const start = lessons[0].start, end = lessons[lessons.length - 1].end;
    return { start, end, minutes: parseTime(end) - parseTime(start) };
  }
  const durationText = (minutes) => `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ""}`;
  const lessonCount = (count, lang) => `${count} ${count === 1 ? i18n[lang].lesson : i18n[lang].lessons}`;
  const subjectClass = (code) => `school-subject-${code.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

  function rangeFor(dayKey, date) {
    const end = schoolEnd(dayKey, date);
    const club = clubEnd(date);
    const rangeEnd = Math.max(BASE_END, end ? parseTime(end) : BASE_END, club ? parseTime(club) : BASE_END);
    return { start: BASE_START, end: rangeEnd, total: rangeEnd - BASE_START };
  }

  function labelsFor(range) {
    const labels = [];
    for (let minute = range.start; minute <= range.end; minute += 60) {
      labels.push({ value: minuteTime(minute), top: ((minute - range.start) / range.total) * 100 });
    }
    if ((range.end - range.start) % 60) labels.push({ value: minuteTime(range.end), top: 100 });
    return labels;
  }

  function expandedLesson(dayKey, lesson, date, lang, range) {
    const subject = subjects[lesson.code];
    const top = ((parseTime(lesson.start) - range.start) / range.total) * 100;
    const height = ((parseTime(lesson.end) - parseTime(lesson.start)) / range.total) * 100;
    const state = lessonState(dayKey, lesson, date);
    const stateText = state === "current" ? i18n[lang].now : state === "next" ? i18n[lang].next : "";
    return `<article class="school-expanded-lesson ${subjectClass(lesson.code)}${state ? ` is-${state}` : ""}" style="--lesson-top:${top}%;--lesson-height:${height}%" title="${subject.name[lang]} · ${lesson.start}–${lesson.end}">
      <div class="school-expanded-lesson-top"><span class="school-subject-icon" aria-hidden="true">${subject.icon}</span><strong>${subject.name[lang]}</strong>${stateText ? `<span class="school-live-badge">${stateText}</span>` : ""}</div>
      <div class="school-expanded-lesson-meta"><span>${lesson.start}–${lesson.end}</span><span>${subject.label}</span></div>
    </article>`;
  }

  function expandedClub(dayKey, date, lang, range) {
    const start = schoolEnd(dayKey, date), end = clubEnd(date);
    if (!start || !end || parseTime(end) <= parseTime(start)) return "";
    const top = ((parseTime(start) - range.start) / range.total) * 100;
    const height = ((parseTime(end) - parseTime(start)) / range.total) * 100;
    return `<article class="school-afternoon-block" style="--lesson-top:${top}%;--lesson-height:${height}%">
      <div class="school-afternoon-block-title"><span aria-hidden="true">🌤️</span><strong>${i18n[lang].club}</strong></div>
      <div class="school-afternoon-block-meta">${start} → ${end}</div>
    </article>`;
  }

  function miniLesson(lesson) {
    const subject = subjects[lesson.code];
    const total = BASE_END - BASE_START;
    const top = ((parseTime(lesson.start) - BASE_START) / total) * 100;
    const height = ((parseTime(lesson.end) - parseTime(lesson.start)) / total) * 100;
    return `<span class="school-mini-lesson ${subjectClass(lesson.code)}" style="--mini-top:${top}%;--mini-height:${height}%" title="${subject.label} · ${lesson.start}–${lesson.end}"><span aria-hidden="true">${subject.icon}</span><b>${subject.label}</b></span>`;
  }

  function clubButton(dayKey, date, lang) {
    const t = i18n[lang], end = clubEnd(date), school = schoolEnd(dayKey, date);
    if (!school) return "";
    const label = end ? t.editClub.replace("{time}", end) : t.addClub;
    return `<button class="school-club-button${end ? " has-club" : ""}" type="button" data-club-date="${keyFor(date)}" data-club-day="${dayKey}"><span aria-hidden="true">${end ? "🌤️" : "＋"}</span><span>${label}</span></button>`;
  }

  function renderExpanded(dayKey, date, lang, isToday) {
    const t = i18n[lang], holiday = holidayFor(date), lessons = lessonsFor(dayKey, date), span = daySpan(lessons);
    if (holiday) return `<section class="school-day-card is-expanded is-holiday${isToday ? " is-today" : ""}" data-expanded-date="${keyFor(date)}"><header class="school-day-card-header"><div><strong>${t.weekdays[dayKey]}</strong><span>${formatDate(date, lang)}</span></div>${isToday ? `<span class="school-today-pill">${t.today}</span>` : ""}</header><div class="school-expanded-holiday"><span aria-hidden="true">🌿</span><strong>${holidayName(holiday, lang)}</strong><small>${t.holiday}</small></div></section>`;
    if (!span) return `<section class="school-day-card is-expanded${isToday ? " is-today" : ""}" data-expanded-date="${keyFor(date)}"><header class="school-day-card-header"><div><strong>${t.weekdays[dayKey]}</strong><span>${formatDate(date, lang)}</span></div></header><div class="school-no-lessons">${t.noLessons}</div></section>`;

    const range = rangeFor(dayKey, date);
    const labels = labelsFor(range).map((item) => `<span class="school-time-label" style="--time-top:${item.top}%">${item.value}</span>`).join("");
    const lunchTop = ((LUNCH_AT - range.start) / range.total) * 100;
    const timelineHeight = Math.max(350, Math.min(700, Math.round((range.total / 60) * 82)));
    return `<section class="school-day-card is-expanded${isToday ? " is-today" : ""}" data-expanded-date="${keyFor(date)}">
      <header class="school-day-card-header"><div><strong>${t.weekdays[dayKey]}</strong><span>${formatDate(date, lang)}</span></div>${isToday ? `<span class="school-today-pill">${t.today}</span>` : ""}</header>
      <div class="school-day-range expanded"><div><small>${t.dayLength}</small><strong>${span.start} → ${span.end}</strong></div><span>${durationText(span.minutes)} · ${lessonCount(lessons.length, lang)}</span></div>
      <div class="school-expanded-timeline" style="--timeline-height:${timelineHeight}px"><div class="school-time-rail">${labels}</div><div class="school-expanded-lane"><div class="school-lunch-line" style="--lunch-top:${lunchTop}%"><span>${t.lunch} 10:20</span></div>${lessons.map((lesson) => expandedLesson(dayKey, lesson, date, lang, range)).join("")}${expandedClub(dayKey, date, lang, range)}</div></div>
      <div class="school-day-footer">${clubButton(dayKey, date, lang)}</div>
    </section>`;
  }

  function renderCompact(dayKey, date, lang, isToday) {
    const t = i18n[lang], holiday = holidayFor(date), lessons = lessonsFor(dayKey, date), span = daySpan(lessons), club = clubEnd(date);
    return `<section class="school-day-card is-compact${holiday ? " is-holiday" : ""}${isToday ? " is-today" : ""}">
      <button class="school-day-select" type="button" data-school-select-date="${keyFor(date)}" aria-label="${t.weekdays[dayKey]} ${formatDate(date, lang)}">
        <header class="school-day-card-header"><div><strong>${t.weekdays[dayKey]}</strong><span>${formatDate(date, lang)}</span></div><div class="school-card-header-actions">${isToday ? `<span class="school-today-pill">${t.today}</span>` : ""}<span class="school-expand-chevron" aria-hidden="true">›</span></div></header>
        ${holiday ? `<div class="school-compact-holiday"><span aria-hidden="true">🌿</span><strong>${holidayName(holiday, lang)}</strong></div>` : span ? `<div class="school-compact-range"><strong>${span.start} → ${span.end}</strong><span>${lessonCount(lessons.length, lang)}</span></div><div class="school-mini-timeline"><div class="school-mini-hours" aria-hidden="true"><span>08</span><span>10</span><span>12</span></div><div class="school-mini-lane">${lessons.map(miniLesson).join("")}</div></div>${club ? `<div class="school-mini-club"><span aria-hidden="true">🌤️</span><strong>${span.end} → ${club}</strong></div>` : ""}` : `<div class="school-no-lessons compact">${t.noLessons}</div>`}
      </button>
      ${span ? `<div class="school-compact-footer">${clubButton(dayKey, date, lang)}</div>` : ""}
    </section>`;
  }

  function holidayTeaser(holiday, lang) {
    if (!holiday) return "";
    const message = i18n[lang].yayNextWeek.replace("{holiday}", holidayName(holiday, lang));
    return `<aside class="school-holiday-teaser" role="status"><span class="school-holiday-spark" aria-hidden="true">✦</span><strong>${message}</strong><span class="school-holiday-spark second" aria-hidden="true">✦</span></aside>`;
  }

  function renderSchool() {
    const view = document.getElementById("schoolWeekGrid");
    if (!view) return;
    const lang = language(), t = i18n[lang], dates = displayedDates(), today = keyFor(new Date());
    const expandedIndex = resolveSelectedIndex(dates), status = currentStatus(lang, dates), teaser = nextWeekHoliday(dates);
    const cards = WEEKDAYS.map((dayKey, index) => index === expandedIndex ? renderExpanded(dayKey, dates[index], lang, keyFor(dates[index]) === today) : renderCompact(dayKey, dates[index], lang, keyFor(dates[index]) === today)).join("");
    view.innerHTML = `<div class="school-top-row"><div class="school-title"><span aria-hidden="true">🎒</span><strong>${t.schoolWeek}</strong></div>${status ? `<div class="school-status school-status-${status.tone}"><span aria-hidden="true">${status.icon}</span><strong>${status.label}</strong></div>` : ""}</div>${holidayTeaser(teaser, lang)}<div class="school-week-days">${cards}</div>`;
  }

  function updateToggleLanguage() {
    const switcher = document.getElementById("calendarViewSwitch");
    if (!switcher) return;
    const t = i18n[language()];
    switcher.setAttribute("aria-label", t.switchLabel);
    switcher.querySelector('[data-view="tasks"] .calendar-view-label').textContent = t.tasks;
    switcher.querySelector('[data-view="school"] .calendar-view-label').textContent = t.school;
  }

  function setView(name, persist = true) {
    const taskGrid = document.getElementById("weekGrid"), schoolGrid = document.getElementById("schoolWeekGrid"), switcher = document.getElementById("calendarViewSwitch");
    if (!taskGrid || !schoolGrid || !switcher) return;
    const target = name === "school" ? "school" : "tasks", schoolActive = target === "school";
    taskGrid.hidden = schoolActive; schoolGrid.hidden = !schoolActive; document.body.classList.toggle("school-calendar-active", schoolActive);
    switcher.querySelectorAll("[data-view]").forEach((button) => { const active = button.dataset.view === target; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1; });
    if (schoolActive) renderSchool();
    if (persist) localStorage.setItem(VIEW_KEY, target);
  }

  function ensureClubDialog() {
    if (document.getElementById("afternoonClubDialog")) return;
    const dialog = document.createElement("dialog");
    dialog.id = "afternoonClubDialog"; dialog.className = "school-club-dialog";
    dialog.innerHTML = `<form class="school-club-form" novalidate><div class="school-club-dialog-head"><div><span class="school-club-dialog-icon" aria-hidden="true">🌤️</span><div><strong data-club-title></strong><span data-club-date-label></span></div></div><button class="school-club-close" type="button" data-club-close aria-label="Close">×</button></div><div class="school-club-dialog-body"><label class="school-club-time-label"><span data-club-end-label></span><input id="afternoonClubTime" type="time" step="1800" required /></label><div class="school-club-quick-label" data-club-quick-label></div><div class="school-club-quick-times">${QUICK_TIMES.map((time) => `<button type="button" data-club-quick="${time}">${time}</button>`).join("")}</div><div class="school-club-helper" data-club-custom-label></div><div class="school-club-error" data-club-error aria-live="polite"></div></div><div class="school-club-dialog-actions"><button class="school-club-remove" type="button" data-club-remove></button><span></span><button class="school-club-cancel" type="button" data-club-close></button><button class="school-club-save" type="submit"></button></div></form>`;
    document.body.appendChild(dialog);

    dialog.querySelectorAll("[data-club-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
    dialog.querySelectorAll("[data-club-quick]").forEach((button) => button.addEventListener("click", () => {
      dialog.querySelector("#afternoonClubTime").value = button.dataset.clubQuick;
      dialog.querySelectorAll("[data-club-quick]").forEach((item) => item.classList.toggle("active", item === button));
      dialog.querySelector("[data-club-error]").textContent = "";
    }));
    dialog.querySelector("[data-club-remove]").addEventListener("click", () => {
      if (!activeClubDateKey) return;
      const clubs = loadClubs(); delete clubs[activeClubDateKey]; saveClubs(clubs); dialog.close(); renderSchool();
    });
    dialog.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!activeClubDateKey) return;
      const date = fromKey(activeClubDateKey), dates = displayedDates(), index = dates.findIndex((item) => keyFor(item) === activeClubDateKey);
      if (index < 0) return;
      const endOfSchool = schoolEnd(WEEKDAYS[index], date), input = dialog.querySelector("#afternoonClubTime"), t = i18n[language()];
      if (!endOfSchool || !input.value || parseTime(input.value) <= parseTime(endOfSchool)) { dialog.querySelector("[data-club-error]").textContent = t.invalidTime.replace("{time}", endOfSchool || "-"); return; }
      const clubs = loadClubs(); clubs[activeClubDateKey] = input.value; saveClubs(clubs); dialog.close(); renderSchool();
    });
  }

  function openClubDialog(dateKey, dayKey) {
    ensureClubDialog(); activeClubDateKey = dateKey;
    const dialog = document.getElementById("afternoonClubDialog"), lang = language(), t = i18n[lang], date = fromKey(dateKey), endOfSchool = schoolEnd(dayKey, date), existing = clubEnd(date), input = dialog.querySelector("#afternoonClubTime");
    dialog.querySelector("[data-club-title]").textContent = t.clubTitle;
    dialog.querySelector("[data-club-date-label]").textContent = t.clubFor.replace("{day}", `${t.weekdays[dayKey]} ${formatDate(date, lang)}`);
    dialog.querySelector("[data-club-end-label]").textContent = t.endTime;
    dialog.querySelector("[data-club-quick-label]").textContent = t.quickTimes;
    dialog.querySelector("[data-club-custom-label]").textContent = `${t.customTime} · ${t.dayLength}: ${endOfSchool || "-"}`;
    dialog.querySelector("[data-club-save]").textContent = t.save; dialog.querySelector("[data-club-cancel]").textContent = t.cancel; dialog.querySelector("[data-club-remove]").textContent = t.remove;
    dialog.querySelector("[data-club-remove]").hidden = !existing; dialog.querySelector("[data-club-error]").textContent = "";
    input.min = endOfSchool || "00:00"; input.value = existing || "15:00";
    dialog.querySelectorAll("[data-club-quick]").forEach((button) => button.classList.toggle("active", button.dataset.clubQuick === input.value));
    dialog.showModal ? dialog.showModal() : dialog.setAttribute("open", "");
  }

  async function loadSchoolCalendar() {
    try { const response = await fetch(SCHOOL_CALENDAR_URL); if (response.ok) schoolCalendar = await response.json(); } catch (_) {}
    renderSchool();
  }

  function install() {
    const taskGrid = document.getElementById("weekGrid"), boardHeader = document.querySelector(".board-panel-header"), boardTools = boardHeader?.querySelector(".board-tools");
    if (!taskGrid || !boardHeader || !boardTools || document.getElementById("calendarViewSwitch")) return;
    const switcher = document.createElement("div"); switcher.id = "calendarViewSwitch"; switcher.className = "calendar-view-switch"; switcher.setAttribute("role", "tablist");
    switcher.innerHTML = `<button type="button" class="calendar-view-option active" data-view="tasks" role="tab" aria-selected="true"><span class="calendar-view-icon" aria-hidden="true">📋</span><span class="calendar-view-label">Tasks</span></button><button type="button" class="calendar-view-option" data-view="school" role="tab" aria-selected="false" tabindex="-1"><span class="calendar-view-icon" aria-hidden="true">🎒</span><span class="calendar-view-label">School</span></button>`;
    boardHeader.insertBefore(switcher, boardTools);
    const schoolGrid = document.createElement("div"); schoolGrid.id = "schoolWeekGrid"; schoolGrid.className = "school-week-view"; schoolGrid.hidden = true; taskGrid.insertAdjacentElement("afterend", schoolGrid);
    switcher.addEventListener("click", (event) => { const button = event.target.closest("[data-view]"); if (button) setView(button.dataset.view); });
    schoolGrid.addEventListener("click", (event) => {
      const club = event.target.closest("[data-club-date]"); if (club) { openClubDialog(club.dataset.clubDate, club.dataset.clubDay); return; }
      const day = event.target.closest("[data-school-select-date]"); if (day) { selectedDateKey = day.dataset.schoolSelectDate; renderSchool(); requestAnimationFrame(() => document.querySelector(`[data-expanded-date="${selectedDateKey}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" })); }
    });
    const languageToggle = document.getElementById("languageToggle");
    if (languageToggle) new MutationObserver(() => { updateToggleLanguage(); renderSchool(); }).observe(languageToggle, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    new MutationObserver(() => { if (!schoolGrid.hidden) renderSchool(); }).observe(taskGrid, { childList: true, subtree: false });
    ensureClubDialog(); updateToggleLanguage(); renderSchool(); setView(localStorage.getItem(VIEW_KEY) || "tasks", false); loadSchoolCalendar();
    window.setInterval(() => { if (!schoolGrid.hidden) renderSchool(); }, 60000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true }); else install();
})();
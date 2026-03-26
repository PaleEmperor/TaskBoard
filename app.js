(function () {
  const STORAGE_KEY = "homeflow-board-v2";
  const AUTO_REFRESH_MS = 60000;
  const APP_VERSION = "v1";
  const BOARD_DENSITY = {
    everyone: "everyone",
    mine: "mine",
    family: "family",
  };
  const WEATHER_FALLBACK = { name: "Rovaniemi", latitude: 66.5039, longitude: 25.7294 };

  const users = [
    { id: "bjorn", name: "Björn", emoji: "🍄", role: { en: "Planner", fi: "Suunnittelija", de: "Planer" } },
    { id: "sini", name: "Sini", emoji: "🌿", role: { en: "Home captain", fi: "Kodinhoitaja", de: "Haushaltsprofi" } },
    { id: "linnea", name: "Linnea", emoji: "🦄", role: { en: "Kid explorer", fi: "Pikku tutkija", de: "Kinderheldin" } },
    { id: "nina", name: "Nina", emoji: "🐾", role: { en: "Dog buddy", fi: "Koirakaveri", de: "Hundekumpel" } },
  ];

  const USER_COLORS = {
    bjorn: "#7b5cff",
    sini: "#f2c94c",
    linnea: "#f3a6ac",
    nina: "#7a2434",
  };

  const languages = [
    { id: "en", flag: "🇬🇧", short: "EN" },
    { id: "fi", flag: "🇫🇮", short: "FI" },
    { id: "de", flag: "🇩🇪", short: "DE" },
  ];

  const iconChoices = [
    "🧺", "🍽️", "🧹", "🪣", "🧽", "🧼", "🧴", "🪥", "🚿", "🛁", "🧻", "🗑️",
    "🪠", "🛏️", "🛋️", "🚪", "🪟", "🪴", "💡", "🔑", "📦", "🧯", "🔋", "🪫",
    "🐶", "🦮", "🐕", "🐾", "🦴", "🥣", "🧸", "🪀", "🎲", "🧩", "🎨", "🖍️",
    "🎒", "📚", "✏️", "📝", "📎", "✂️", "📌", "📖", "🧮", "🎵", "🎹", "🏃",
    "🚲", "⚽", "🏀", "🧦", "👕", "👖", "🧥", "🧢", "👟", "🪮", "💊", "🩹",
    "🪥", "🍎", "🥪", "🍞", "🥛", "🍼", "🍌", "🍓", "🥕", "🍲", "🍳", "🥣",
    "☕", "🫖", "🍽️", "🥄", "🔪", "🛒", "💌", "📅", "⏰", "✅", "⭐", "❤️",
    "🌿", "🌼", "☀️", "🌙", "❄️", "☔", "🎁", "🚗", "🚌", "🏠", "🛠️", "🔧",
    "🔨", "🪛", "🧰", "💻", "📱", "🔌", "🎬", "🎮", "🧃", "🍪", "🧁", "🍕",
    "🍝", "🥗", "🧹", "🪜", "📷", "🪙", "💳", "🛍️", "🎈", "🕯️", "🙏", "💤"
  ];
  const effortOptions = ["light", "steady", "big"];
  const weekdayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const quickTaskTemplates = [
    { id: "dishes", icon: "🍽️", category: "kitchen", effort: "light", title: { en: "Dishes", fi: "Tiskit", de: "Geschirr" } },
    { id: "laundry", icon: "🧺", category: "laundry", effort: "steady", title: { en: "Laundry", fi: "Pyykki", de: "Wäsche" } },
    { id: "trash", icon: "🗑️", category: "home", effort: "light", title: { en: "Trash", fi: "Roskis", de: "Müll" } },
    { id: "dogwalk", icon: "🐶", category: "dog", effort: "steady", title: { en: "Dog walk", fi: "Koiralenkki", de: "Hundespaziergang" } },
    { id: "tidy", icon: "🧹", category: "cleaning", effort: "steady", title: { en: "Quick tidy", fi: "Pikasiivous", de: "Kurz aufräumen" } },
    { id: "shopping", icon: "🛒", category: "shopping", effort: "steady", title: { en: "Shopping", fi: "Kauppa", de: "Einkauf" } },
    { id: "school", icon: "🎒", category: "school", effort: "light", title: { en: "School bag", fi: "Reppu", de: "Schultasche" } },
    { id: "bath", icon: "🛁", category: "family", effort: "steady", title: { en: "Bath time", fi: "Kylpy", de: "Badezeit" } }
  ];

  const messages = {
    en: {
      heroEyebrow: "Tablet-first family command center",
      title: "HomeFlow Board",
      subtitle:
        "Beautiful, low-typing weekly planning for a busy household with children, dog walks, recurring routines, and clear ownership.",
      whoLabel: "Who are you today?",
      quickAdd: "Add task",
      everyone: "Everyone",
      mine: "My tasks",
      family: "Family flow",
      dueThisWeek: "Due this week",
      overdue: "Overdue",
      completed: "Done today",
      recurring: "Recurring",
      refreshNote: "Refreshes itself every minute for wall-tablet use",
      boardLabel: "Current week",
      focusLabel: "Quick view",
      focusSummaryHeading: "Week highlights",
      quickAssignLabel: "Drag here to reassign",
      familyHeading: "Family dock",
      templatesLabel: "One-tap routines",
      templatesHeading: "Household shortcuts",
      noTemplates: "No preset tasks. Add your own household routines.",
      doneZoneLabel: "Finish fast",
      doneHeading: "Done zone",
      doneDrop: "Drop a task here to mark it done",
      prevWeek: "Earlier",
      nextWeek: "Later",
      today: "This week",
      focusTitle: "Keep the week flowing",
      focusOverdue: "Needs attention",
      focusToday: "Today on deck",
      focusUpcoming: "Coming up next",
      addTask: "Create task",
      editTask: "Edit task",
      taskTitle: "Task title",
      taskIcon: "Task icon",
      taskCategory: "Category",
      taskOwner: "Owner",
      taskResponsible: "Responsible",
      taskDay: "Day",
      taskRepeat: "Repeat",
      taskInterval: "Every how many days?",
      taskWeekday: "Preferred weekday",
      taskEffort: "Effort",
      taskNotes: "Notes",
      save: "Save task",
      cancel: "Cancel",
      delete: "Delete",
      complete: "Complete",
      reopen: "Reopen",
      edit: "Edit",
      emptyDay: "Drop tasks here or use a quick routine",
      owner: "Owner",
      responsible: "Responsible",
      dueToday: "Due today",
      dueTomorrow: "Tomorrow",
      overdueBy: "Overdue by {days} d",
      repeatNever: "No repeat",
      repeatDaily: "Daily",
      repeatWeekdays: "Weekdays",
      repeatWeekly: "Weekly",
      repeatBiweekly: "Every 2 weeks",
      repeatMonthly: "Monthly",
      repeatInterval: "Custom interval",
      light: "Quick",
      steady: "Regular",
      big: "Big",
      categoryCleaning: "Cleaning",
      categoryKitchen: "Kitchen",
      categoryLaundry: "Laundry",
      categoryFamily: "Family",
      categoryDog: "Dog",
      categorySchool: "School",
      categoryShopping: "Shopping",
      categoryHome: "Home",
      categoryWellbeing: "Wellbeing",
      categoryMisc: "Misc",
      statusRecurring: "Repeats",
      statusEffort: "Effort",
      plusTasks: "{count} tasks",
      plusTask: "1 task",
      openTasks: "{count} open",
      dragHint: "Drag tasks between days, people, or the done zone.",
      tapHint: "On touch devices, tap a task once and then tap a day, person, or done zone.",
      currentWeek: "Week {weekNumber}",
      noFocusItems: "Nothing urgent right now",
      weatherNow: "Now",
      weatherLoading: "Loading weather",
      weatherUnavailable: "Weather unavailable",
      weatherFallback: "Helsinki",
      weekdayLong: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
      },
    },
    fi: {
      heroEyebrow: "Tabletille tehty perheen ohjauspaneeli",
      title: "HomeFlow Board",
      subtitle:
        "Kaunis viikkonäkymä kotiin, lapsiperheen arkeen ja koiran hoitoon. Mahdollisimman vähän kirjoittamista, mahdollisimman paljon sujuvaa käyttöä.",
      whoLabel: "Kuka käyttää nyt?",
      quickAdd: "Lisää tehtävä",
      everyone: "Kaikki",
      mine: "Minun tehtävät",
      family: "Perheen virta",
      dueThisWeek: "Tällä viikolla",
      overdue: "Myöhässä",
      completed: "Valmiit tänään",
      recurring: "Toistuvat",
      refreshNote: "Päivittyy automaattisesti minuutin välein seinätablettia varten",
      boardLabel: "Nykyinen viikko",
      focusLabel: "Pikanäkymä",
      focusSummaryHeading: "Viikon kohokohdat",
      quickAssignLabel: "Vedä tähän uudelle henkilölle",
      familyHeading: "Perhedock",
      templatesLabel: "Nopeat rutiinit",
      templatesHeading: "Kotiarjen pikanapit",
      noTemplates: "Ei valmiita tehtäviä. Lisää omat kotirutiinit.",
      doneZoneLabel: "Valmis nopeasti",
      doneHeading: "Valmis-alue",
      doneDrop: "Pudota tehtävä tähän merkataaksesi sen valmiiksi",
      prevWeek: "Aiempi",
      nextWeek: "Seuraava",
      today: "Tämä viikko",
      focusTitle: "Pidä viikko liikkeessä",
      focusOverdue: "Tarvitsee huomiota",
      focusToday: "Tänään vuorossa",
      focusUpcoming: "Tulossa seuraavaksi",
      addTask: "Luo tehtävä",
      editTask: "Muokkaa tehtävää",
      taskTitle: "Tehtävän nimi",
      taskIcon: "Tehtävän ikoni",
      taskCategory: "Kategoria",
      taskOwner: "Omistaja",
      taskResponsible: "Vastuuhenkilö",
      taskDay: "Päivä",
      taskRepeat: "Toistuvuus",
      taskInterval: "Kuinka monen päivän välein?",
      taskWeekday: "Suosittu viikonpäivä",
      taskEffort: "Työmäärä",
      taskNotes: "Muistiinpanot",
      save: "Tallenna tehtävä",
      cancel: "Peruuta",
      delete: "Poista",
      complete: "Valmis",
      reopen: "Avaa uudelleen",
      edit: "Muokkaa",
      emptyDay: "Pudota tehtäviä tähän tai käytä pikanappia",
      owner: "Omistaja",
      responsible: "Vastuu",
      dueToday: "Tänään",
      dueTomorrow: "Huomenna",
      overdueBy: "Myöhässä {days} pv",
      repeatNever: "Ei toistu",
      repeatDaily: "Päivittäin",
      repeatWeekdays: "Arkipäivisin",
      repeatWeekly: "Viikoittain",
      repeatBiweekly: "2 viikon välein",
      repeatMonthly: "Kuukausittain",
      repeatInterval: "Mukautettu väli",
      light: "Nopea",
      steady: "Tavallinen",
      big: "Iso",
      categoryCleaning: "Siivous",
      categoryKitchen: "Keittiö",
      categoryLaundry: "Pyykki",
      categoryFamily: "Perhe",
      categoryDog: "Koira",
      categorySchool: "Koulu",
      categoryShopping: "Ostokset",
      categoryHome: "Koti",
      categoryWellbeing: "Hyvinvointi",
      categoryMisc: "Muut",
      statusRecurring: "Toistuu",
      statusEffort: "Työmäärä",
      plusTasks: "{count} tehtävää",
      plusTask: "1 tehtävä",
      openTasks: "{count} avoinna",
      dragHint: "Vedä tehtäviä päivien, henkilöiden tai valmis-alueen välillä.",
      tapHint: "Kosketuslaitteella napauta tehtävää kerran ja sitten päivää, henkilöä tai valmis-aluetta.",
      currentWeek: "Viikko {weekNumber}",
      noFocusItems: "Ei kiireellistä juuri nyt",
      weatherNow: "Nyt",
      weatherLoading: "Ladataan säätä",
      weatherUnavailable: "Sää ei saatavilla",
      weatherFallback: "Helsinki",
      weekdayLong: {
        monday: "Maanantai",
        tuesday: "Tiistai",
        wednesday: "Keskiviikko",
        thursday: "Torstai",
        friday: "Perjantai",
        saturday: "Lauantai",
        sunday: "Sunnuntai",
      },
    },
    de: {
      heroEyebrow: "Tabletfreundliche Familienzentrale",
      title: "HomeFlow Board",
      subtitle:
        "Eine schöne Wochenübersicht für Haushalt, Kinderalltag und Hund. Wenig Tippen, viel Ziehen, klare Zuständigkeiten.",
      whoLabel: "Wer benutzt es gerade?",
      quickAdd: "Aufgabe hinzufügen",
      everyone: "Alle",
      mine: "Meine Aufgaben",
      family: "Familienfluss",
      dueThisWeek: "Diese Woche",
      overdue: "Überfällig",
      completed: "Heute erledigt",
      recurring: "Wiederkehrend",
      refreshNote: "Aktualisiert sich jede Minute automatisch für die Wand-Tablet-Nutzung",
      boardLabel: "Aktuelle Woche",
      focusLabel: "Schnellansicht",
      focusSummaryHeading: "Wochenübersicht",
      quickAssignLabel: "Hierher ziehen zum Neu-Zuweisen",
      familyHeading: "Familien-Dock",
      templatesLabel: "Routinen mit einem Tipp",
      templatesHeading: "Haushaltsschnellzugriff",
      noTemplates: "Keine vorgeplanten Aufgaben. Eigene Routinen hinzufügen.",
      doneZoneLabel: "Schnell abschließen",
      doneHeading: "Erledigt-Zone",
      doneDrop: "Aufgabe hier ablegen, um sie als erledigt zu markieren",
      prevWeek: "Früher",
      nextWeek: "Später",
      today: "Diese Woche",
      focusTitle: "Die Woche im Fluss halten",
      focusOverdue: "Braucht Aufmerksamkeit",
      focusToday: "Heute dran",
      focusUpcoming: "Als Nächstes",
      addTask: "Aufgabe erstellen",
      editTask: "Aufgabe bearbeiten",
      taskTitle: "Aufgabentitel",
      taskIcon: "Aufgaben-Icon",
      taskCategory: "Kategorie",
      taskOwner: "Besitzer",
      taskResponsible: "Verantwortlich",
      taskDay: "Tag",
      taskRepeat: "Wiederholung",
      taskInterval: "Alle wie viele Tage?",
      taskWeekday: "Bevorzugter Wochentag",
      taskEffort: "Aufwand",
      taskNotes: "Notizen",
      save: "Aufgabe speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      complete: "Erledigt",
      reopen: "Wieder öffnen",
      edit: "Bearbeiten",
      emptyDay: "Aufgaben hier ablegen oder eine Routine benutzen",
      owner: "Besitzer",
      responsible: "Verantwortlich",
      dueToday: "Heute",
      dueTomorrow: "Morgen",
      overdueBy: "{days} T überfällig",
      repeatNever: "Keine Wiederholung",
      repeatDaily: "Täglich",
      repeatWeekdays: "Werktags",
      repeatWeekly: "Wöchentlich",
      repeatBiweekly: "Alle 2 Wochen",
      repeatMonthly: "Monatlich",
      repeatInterval: "Eigener Rhythmus",
      light: "Kurz",
      steady: "Normal",
      big: "Groß",
      categoryCleaning: "Reinigung",
      categoryKitchen: "Küche",
      categoryLaundry: "Wäsche",
      categoryFamily: "Familie",
      categoryDog: "Hund",
      categorySchool: "Schule",
      categoryShopping: "Einkauf",
      categoryHome: "Zuhause",
      categoryWellbeing: "Wohlbefinden",
      categoryMisc: "Sonstiges",
      statusRecurring: "Wiederholt sich",
      statusEffort: "Aufwand",
      plusTasks: "{count} Aufgaben",
      plusTask: "1 Aufgabe",
      openTasks: "{count} offen",
      dragHint: "Aufgaben zwischen Tagen, Personen oder der Erledigt-Zone ziehen.",
      tapHint: "Auf Touch-Geräten Aufgabe antippen und danach Tag, Person oder Erledigt-Zone antippen.",
      currentWeek: "Woche {weekNumber}",
      noFocusItems: "Im Moment nichts Dringendes",
      weatherNow: "Jetzt",
      weatherLoading: "Wetter lädt",
      weatherUnavailable: "Kein Wetter verfügbar",
      weatherFallback: "Helsinki",
      weekdayLong: {
        monday: "Montag",
        tuesday: "Dienstag",
        wednesday: "Mittwoch",
        thursday: "Donnerstag",
        friday: "Freitag",
        saturday: "Samstag",
        sunday: "Sonntag",
      },
    },
  };

  const categories = [
    { id: "cleaning", key: "categoryCleaning" },
    { id: "kitchen", key: "categoryKitchen" },
    { id: "laundry", key: "categoryLaundry" },
    { id: "family", key: "categoryFamily" },
    { id: "dog", key: "categoryDog" },
    { id: "school", key: "categorySchool" },
    { id: "shopping", key: "categoryShopping" },
    { id: "home", key: "categoryHome" },
    { id: "wellbeing", key: "categoryWellbeing" },
    { id: "misc", key: "categoryMisc" },
  ];

  function createSeedData() {
    return {
      settings: {
        language: "en",
        currentUserId: "bjorn",
        boardDensity: BOARD_DENSITY.everyone,
        weekOffset: 0,
        activeFilter: "all",
        showCompleted: false,
      },
      taskLibrary: [],
      tasks: [],
    };
  }

  function buildTask(config) {
    return {
      id: crypto.randomUUID(),
      title: typeof config.title === "string" ? config.title : config.title.en,
      titleTranslations: typeof config.title === "string" ? null : config.title,
      icon: config.icon,
      category: config.category,
      ownerId: config.owner,
      responsibleId: config.responsible,
      dueDate: formatDateKey(config.dueDate),
      recurrence: config.recurrence || "none",
      interval: config.interval || 1,
      weekday: typeof config.weekday === "number" ? config.weekday : null,
      effort: config.effort || "steady",
      notes: typeof config.notes === "string" ? config.notes : config.notes?.en || "",
      notesTranslations: typeof config.notes === "string" ? null : config.notes || null,
      status: "open",
      completedAt: null,
      completionDates: [],
      exceptionDates: [],
      libraryId: config.libraryId || null,
      seriesId: config.seriesId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastGeneratedAt: null,
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createSeedData();
      }
      const parsed = JSON.parse(raw);
      if (!parsed?.tasks || !parsed?.settings) {
        return createSeedData();
      }
      if (!Array.isArray(parsed.taskLibrary)) {
        parsed.taskLibrary = [];
      }
      if (typeof parsed.settings.showCompleted !== "boolean") {
        parsed.settings.showCompleted = false;
      }
      return parsed;
    } catch (error) {
      return createSeedData();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  const state = loadState();
  const ui = {
    dialogMode: "create",
    editingTaskId: null,
    dragTaskId: null,
    selectedTaskId: null,
    expandedCards: {},
    focusDateKey: null,
    drawerOpen: false,
    weather: {
      status: "loading",
      place: WEATHER_FALLBACK.name,
      temperature: null,
      wind: null,
      condition: "",
      theme: "clear",
    },
  };

  const refs = {
    heroEyebrow: document.getElementById("heroEyebrow"),
    weatherBanner: document.getElementById("weatherBanner"),
    weatherSymbol: document.getElementById("weatherSymbol"),
    weatherKicker: document.getElementById("weatherKicker"),
    weatherTemp: document.getElementById("weatherTemp"),
    weatherCondition: document.getElementById("weatherCondition"),
    weatherPlace: document.getElementById("weatherPlace"),
    weatherDetails: document.getElementById("weatherDetails"),
    appTitle: document.getElementById("appTitle"),
    appSubtitle: document.getElementById("appSubtitle"),
    languageToggle: document.getElementById("languageToggle"),
    quickAddButton: document.getElementById("quickAddButton"),
    toolDrawerToggle: document.getElementById("toolDrawerToggle"),
    toolDrawer: document.getElementById("toolDrawer"),
    toolDrawerClose: document.getElementById("toolDrawerClose"),
    toolDrawerTitle: document.getElementById("toolDrawerTitle"),
    showCompletedLabel: document.getElementById("showCompletedLabel"),
    showCompletedToggle: document.getElementById("showCompletedToggle"),
    summaryGrid: document.getElementById("summaryGrid"),
    viewSwitch: document.getElementById("viewSwitch"),
    filterChips: document.getElementById("filterChips"),
    refreshNote: document.getElementById("refreshNote"),
    focusPanel: document.getElementById("focusPanel"),
    focusLabel: document.getElementById("focusLabel"),
    focusSummaryHeading: document.getElementById("focusSummaryHeading"),
    boardLabel: document.getElementById("boardLabel"),
    weekHeading: document.getElementById("weekHeading"),
    prevWeekButton: document.getElementById("prevWeekButton"),
    nextWeekButton: document.getElementById("nextWeekButton"),
    todayButton: document.getElementById("todayButton"),
    weekGrid: document.getElementById("weekGrid"),
    quickAssignLabel: document.getElementById("quickAssignLabel"),
    familyHeading: document.getElementById("familyHeading"),
    familyDock: document.getElementById("familyDock"),
    familyPanel: document.getElementById("familyPanel"),
    savedTasksHeading: document.getElementById("savedTasksHeading"),
    savedTasksStrip: document.getElementById("savedTasksStrip"),
    quickTasksHeading: document.getElementById("quickTasksHeading"),
    quickTasksStrip: document.getElementById("quickTasksStrip"),
    taskDialog: document.getElementById("taskDialog"),
    taskForm: document.getElementById("taskForm"),
    closeDialogButton: document.getElementById("closeDialogButton"),
    dialogEyebrow: document.getElementById("dialogEyebrow"),
    dialogTitle: document.getElementById("dialogTitle"),
    fieldTitleLabel: document.getElementById("fieldTitleLabel"),
    fieldIconLabel: document.getElementById("fieldIconLabel"),
    fieldCategoryLabel: document.getElementById("fieldCategoryLabel"),
    fieldOwnerLabel: document.getElementById("fieldOwnerLabel"),
    fieldResponsibleLabel: document.getElementById("fieldResponsibleLabel"),
    fieldDayLabel: document.getElementById("fieldDayLabel"),
    fieldRepeatLabel: document.getElementById("fieldRepeatLabel"),
    fieldIntervalLabel: document.getElementById("fieldIntervalLabel"),
    fieldWeekdayLabel: document.getElementById("fieldWeekdayLabel"),
    fieldEffortLabel: document.getElementById("fieldEffortLabel"),
    fieldNotesLabel: document.getElementById("fieldNotesLabel"),
    iconGrid: document.getElementById("iconGrid"),
    taskTitleInput: document.getElementById("taskTitleInput"),
    taskIconInput: document.getElementById("taskIconInput"),
    taskCategoryInput: document.getElementById("taskCategoryInput"),
    taskOwnerInput: document.getElementById("taskOwnerInput"),
    taskResponsibleInput: document.getElementById("taskResponsibleInput"),
    taskDayInput: document.getElementById("taskDayInput"),
    taskRecurrenceInput: document.getElementById("taskRecurrenceInput"),
    taskIntervalInput: document.getElementById("taskIntervalInput"),
    taskWeekdayInput: document.getElementById("taskWeekdayInput"),
    taskEffortInput: document.getElementById("taskEffortInput"),
    taskNotesInput: document.getElementById("taskNotesInput"),
    intervalField: document.getElementById("intervalField"),
    weekdayField: document.getElementById("weekdayField"),
    deleteTaskButton: document.getElementById("deleteTaskButton"),
    deleteSeriesButton: document.getElementById("deleteSeriesButton"),
    cancelTaskButton: document.getElementById("cancelTaskButton"),
    saveTaskButton: document.getElementById("saveTaskButton"),
    taskCardTemplate: document.getElementById("taskCardTemplate"),
  };

  hydrateRecurringTasks();
  registerServiceWorker();
  hydrateWeather();
  bindEvents();
  renderApp();
  setInterval(() => {
    renderApp();
  }, AUTO_REFRESH_MS);

  function bindEvents() {
    refs.quickAddButton.addEventListener("click", () => openTaskDialog());
    refs.toolDrawerToggle.addEventListener("click", () => {
      ui.drawerOpen = true;
      renderApp();
    });
    refs.toolDrawerClose.addEventListener("click", () => {
      ui.drawerOpen = false;
      renderApp();
    });
    refs.showCompletedToggle.addEventListener("change", () => {
      state.settings.showCompleted = refs.showCompletedToggle.checked;
      saveState();
      renderApp();
    });
    refs.closeDialogButton.addEventListener("click", closeDialog);
    refs.cancelTaskButton.addEventListener("click", closeDialog);
    refs.prevWeekButton.addEventListener("click", () => {
      state.settings.weekOffset -= 1;
      saveState();
      renderApp();
    });
    refs.nextWeekButton.addEventListener("click", () => {
      state.settings.weekOffset += 1;
      saveState();
      renderApp();
    });
    refs.todayButton.addEventListener("click", () => {
      state.settings.boardDensity = BOARD_DENSITY.everyone;
      state.settings.weekOffset = 0;
      state.settings.activeFilter = "all";
      saveState();
      renderApp();
    });
    refs.taskRecurrenceInput.addEventListener("change", syncDialogFields);
    refs.taskForm.addEventListener("submit", handleTaskSubmit);
    refs.deleteTaskButton.addEventListener("click", deleteEditingTask);
    refs.deleteSeriesButton.addEventListener("click", deleteEditingSeries);
  }

  function renderApp() {
    const t = currentMessages();
    renderWeatherBanner();
    if (refs.heroEyebrow) {
      refs.heroEyebrow.textContent = t.heroEyebrow;
    }
    if (refs.appTitle) {
      refs.appTitle.textContent = t.title;
    }
    if (refs.appSubtitle) {
      refs.appSubtitle.textContent = "";
      refs.appSubtitle.classList.add("hidden");
    }
    refs.quickAddButton.textContent = t.quickAdd;
    refs.refreshNote.textContent = "";
    refs.refreshNote.classList.add("hidden");
    refs.boardLabel.textContent = t.boardLabel;
    if (refs.focusLabel) {
      refs.focusLabel.textContent = t.focusLabel;
    }
    if (refs.focusSummaryHeading) {
      refs.focusSummaryHeading.textContent = t.focusSummaryHeading;
    }
    if (refs.quickAssignLabel) {
      refs.quickAssignLabel.textContent = t.quickAssignLabel;
    }
    refs.familyHeading.textContent = t.familyHeading;
    refs.savedTasksHeading.textContent = "Saved tasks";
    refs.quickTasksHeading.textContent = t.quickTasksHeading || "Quick tasks";
    refs.toolDrawerTitle.textContent = "Tools";
    refs.showCompletedLabel.textContent = "Show completed";
    refs.showCompletedToggle.checked = Boolean(state.settings.showCompleted);
    refs.toolDrawer.classList.toggle("open", ui.drawerOpen);
    refs.prevWeekButton.textContent = t.prevWeek;
    refs.nextWeekButton.textContent = t.nextWeek;
    refs.todayButton.textContent = t.everyone;
    fillDialogLabels();
    renderLanguageToggle();
    state.settings.activeFilter = "all";
    renderWeekGrid();
    renderFamilyDock();
    renderSavedTasks();
    renderQuickTasks();
    renderDialogOptions();
  }

  function renderWeatherBanner() {
    const t = currentMessages();
    const weather = ui.weather;
    refs.weatherBanner.dataset.weather = weather.theme || "clear";
    refs.weatherSymbol.textContent = symbolForWeatherTheme(weather.theme || "clear");
    refs.weatherKicker.textContent = t.weatherNow;

    if (weather.status === "loading") {
      refs.weatherTemp.textContent = "--°";
      refs.weatherCondition.textContent = t.weatherLoading;
      refs.weatherPlace.textContent = t.weatherFallback;
      refs.weatherDetails.textContent = "";
      return;
    }

    if (weather.status === "error") {
      refs.weatherTemp.textContent = "--°";
      refs.weatherCondition.textContent = t.weatherUnavailable;
      refs.weatherPlace.textContent = weather.place || t.weatherFallback;
      refs.weatherDetails.textContent = "";
      return;
    }

    refs.weatherTemp.textContent = `${Math.round(weather.temperature)}°`;
    refs.weatherCondition.textContent = weather.condition;
    refs.weatherPlace.textContent = weather.place;
    refs.weatherDetails.textContent = weather.wind ? `${Math.round(weather.wind)} km/h` : "";
  }

  function symbolForWeatherTheme(theme) {
    const map = {
      clear: "☀",
      partly: "⛅",
      clouds: "☁",
      rain: "☂",
      snow: "❄",
      storm: "⚡",
      fog: "◌",
      night: "☾",
    };
    return map[theme] || "◌";
  }

  function renderLanguageToggle() {
    refs.languageToggle.innerHTML = "";
    languages.forEach((language) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `lang-chip${language.id === state.settings.language ? " active" : ""}`;
      button.setAttribute("aria-label", language.short);
      button.title = language.short;
      button.innerHTML = `<span>${language.flag}</span>`;
      button.addEventListener("click", () => {
        state.settings.language = language.id;
        saveState();
        renderApp();
      });
      refs.languageToggle.appendChild(button);
    });
  }

  function renderSummaryGrid() {
    const t = currentMessages();
    const tasksForWeek = getVisibleItemsForCurrentWeek();
    const completedToday = countCompletedToday();
    const recurringCount = state.tasks.filter((task) => task.recurrence !== "none").length;
    const cards = [
      { label: t.dueThisWeek, value: tasksForWeek.length, accent: "var(--blue)" },
      { label: t.overdue, value: tasksForWeek.filter(isItemOverdue).length, accent: "var(--rose)" },
      { label: t.completed, value: completedToday, accent: "var(--teal)" },
      { label: t.recurring, value: recurringCount, accent: "var(--gold)" },
    ];
    refs.summaryGrid.innerHTML = "";
    cards.forEach((card) => {
      const el = document.createElement("article");
      el.className = "summary-card";
      el.innerHTML = `<span>${card.label}</span><strong style="color:${card.accent}">${card.value}</strong>`;
      refs.summaryGrid.appendChild(el);
    });
  }

  function renderFocusPanel() {
    const t = currentMessages();
    const weekTasks = getVisibleItemsForCurrentWeek();
    const overdue = weekTasks.filter(isItemOverdue).slice(0, 3);
    const todayTasks = weekTasks.filter((item) => isSameDay(parseDateKey(item.dateKey), new Date()) && !item.done).slice(0, 3);
    const upcoming = weekTasks
      .filter((item) => parseDateKey(item.dateKey) > startOfDay(new Date()) && !item.done)
      .sort(compareBoardItems)
      .slice(0, 3);

    refs.focusPanel.innerHTML = `
      <div class="board-panel-header">
        <div>
          <div class="panel-label">${t.boardLabel}</div>
          <h2>${t.focusTitle}</h2>
        </div>
      </div>
    `;

    const band = document.createElement("div");
    band.className = "focus-band";
    [
      { title: t.focusOverdue, items: overdue, className: "overdue" },
      { title: t.focusToday, items: todayTasks, className: "" },
      { title: t.focusUpcoming, items: upcoming, className: "" },
    ].forEach((section) => {
      const card = document.createElement("section");
      card.className = `focus-card ${section.className}`.trim();
      const list = section.items.length
        ? section.items
            .map((item) => `<div class="focus-pill">${item.icon} ${resolveTaskTitle(item.task)} <br><small>${describeBoardItemLine(item)}</small></div>`)
            .join("")
          : `<div class="focus-pill">${t.noFocusItems}</div>`;
      card.innerHTML = `<h3>${section.title}</h3><div class="focus-list">${list}</div>`;
      band.appendChild(card);
    });
    refs.focusPanel.appendChild(band);
  }

  function renderWeekGrid() {
    const t = currentMessages();
    const weekStart = getDisplayedWeekStart();
    refs.weekHeading.textContent = `${formatDateRange(weekStart)} • ${t.currentWeek.replace("{weekNumber}", String(getWeekNumber(weekStart)))}`;
    refs.weekGrid.innerHTML = "";

    for (let index = 0; index < 7; index += 1) {
      const dayDate = addDays(weekStart, index);
      const tasks = getItemsForDay(dayDate);
      const column = document.createElement("section");
      column.className = `day-column${isSameDay(dayDate, new Date()) ? " today" : ""}`;
      column.dataset.date = formatDateKey(dayDate);
      column.addEventListener("dragover", handleDragOver);
      column.addEventListener("dragleave", handleDragLeave);
      column.addEventListener("drop", (event) => {
        handleDragLeave(event);
        if (ui.dragTaskId) {
          if (String(ui.dragTaskId).startsWith("saved:")) {
            createTaskFromLibrary(ui.dragTaskId.replace("saved:", ""), column.dataset.date);
          } else if (String(ui.dragTaskId).startsWith("quick:")) {
            createQuickTaskFromTemplate(ui.dragTaskId.replace("quick:", ""), column.dataset.date);
          } else {
            moveBoardItemToDate(ui.dragTaskId, column.dataset.date);
          }
        }
      });
      column.addEventListener("click", () => {
        if (ui.selectedTaskId) {
          moveTaskToDate(ui.selectedTaskId, column.dataset.date);
        }
      });

      const openCount = tasks.filter((item) => !item.done).length;
      const overdueCount = tasks.filter(isItemOverdue).length;
      column.innerHTML = `
        <div class="day-heading">
          <div>
            <strong>${t.weekdayLong[weekdayKeys[index]]}</strong>
            <span>${formatNumericDate(dayDate)}</span>
          </div>
          <button class="ghost-button small-button day-add-button" type="button">+ ${t.quickAdd}</button>
        </div>
        <div class="day-overview">
          <span class="badge">${openCount === 1 ? t.plusTask : t.plusTasks.replace("{count}", String(openCount))}</span>
          ${overdueCount ? `<span class="badge">${t.overdue}</span>` : ""}
        </div>
      `;
      column.querySelector(".day-add-button").addEventListener("click", (event) => {
        event.stopPropagation();
        openTaskDialog(null, { dueDate: column.dataset.date });
      });

      const taskList = document.createElement("div");
      taskList.className = "task-list";
      if (!tasks.length) {
        const empty = document.createElement("button");
        empty.type = "button";
        empty.className = "empty-drop";
        empty.textContent = t.emptyDay;
        empty.addEventListener("click", (event) => {
          event.stopPropagation();
          openTaskDialog(null, { dueDate: column.dataset.date });
        });
        taskList.appendChild(empty);
      } else {
        tasks.forEach((item) => taskList.appendChild(createTaskCard(item)));
      }

      column.appendChild(taskList);
      refs.weekGrid.appendChild(column);
    }
  }

  function renderWeekGrid() {
    const t = currentMessages();
    const weekStart = getDisplayedWeekStart();
    refs.weekHeading.textContent = `${formatDateRange(weekStart)} • ${t.currentWeek.replace("{weekNumber}", String(getWeekNumber(weekStart)))}`;
    refs.weekGrid.innerHTML = "";

    const todayKey = formatDateKey(startOfDay(new Date()));
    const weekDateKeys = Array.from({ length: 7 }, (_, index) => formatDateKey(addDays(weekStart, index)));
    if (!ui.focusDateKey || !weekDateKeys.includes(ui.focusDateKey)) {
      ui.focusDateKey = weekDateKeys.includes(todayKey) ? todayKey : weekDateKeys[0];
    }
    refs.weekGrid.style.gridTemplateColumns = weekDateKeys
      .map((dateKey) => (dateKey === ui.focusDateKey ? "minmax(300px, 2.3fr)" : "minmax(68px, 0.5fr)"))
      .join(" ");

    for (let index = 0; index < 7; index += 1) {
      const dayDate = addDays(weekStart, index);
      const dayKey = formatDateKey(dayDate);
      const tasks = getItemsForDay(dayDate);
      const isFocused = dayKey === ui.focusDateKey;
      const column = document.createElement("section");
      column.className = `day-column${isSameDay(dayDate, new Date()) ? " today" : ""}${isFocused ? " focused" : " collapsed"}`;
      column.dataset.date = dayKey;
      column.addEventListener("dragover", handleDragOver);
      column.addEventListener("dragleave", handleDragLeave);
      column.addEventListener("drop", (event) => {
        handleDragLeave(event);
        if (ui.dragTaskId) {
          if (String(ui.dragTaskId).startsWith("saved:")) {
            createTaskFromLibrary(ui.dragTaskId.replace("saved:", ""), column.dataset.date);
          } else if (String(ui.dragTaskId).startsWith("quick:")) {
            createQuickTaskFromTemplate(ui.dragTaskId.replace("quick:", ""), column.dataset.date);
          } else {
            moveBoardItemToDate(ui.dragTaskId, column.dataset.date);
          }
        }
      });
      column.addEventListener("click", () => {
        if (!isFocused && !ui.selectedTaskId) {
          ui.focusDateKey = column.dataset.date;
          renderApp();
          return;
        }
        if (ui.selectedTaskId) {
          moveTaskToDate(ui.selectedTaskId, column.dataset.date);
        }
      });

      const openCount = tasks.filter((item) => !item.done).length;
      const overdueCount = tasks.filter(isItemOverdue).length;
      if (isFocused) {
        column.innerHTML = `
          <div class="day-heading">
            <div>
              <strong>${t.weekdayLong[weekdayKeys[index]]}</strong>
              <span>${formatNumericDate(dayDate)}</span>
            </div>
            <button class="ghost-button small-button day-add-button" type="button">+ ${t.quickAdd}</button>
          </div>
          <div class="day-overview">
            <span class="badge">${openCount === 1 ? t.plusTask : t.plusTasks.replace("{count}", String(openCount))}</span>
            ${overdueCount ? `<span class="badge">${t.overdue}</span>` : ""}
          </div>
        `;
        column.querySelector(".day-add-button").addEventListener("click", (event) => {
          event.stopPropagation();
          openTaskDialog(null, { dueDate: column.dataset.date });
        });

        const taskList = document.createElement("div");
        taskList.className = "task-list";
        if (!tasks.length) {
          const empty = document.createElement("button");
          empty.type = "button";
          empty.className = "empty-drop";
          empty.textContent = t.emptyDay;
          empty.addEventListener("click", (event) => {
            event.stopPropagation();
            openTaskDialog(null, { dueDate: column.dataset.date });
          });
          taskList.appendChild(empty);
        } else {
          tasks.forEach((item) => taskList.appendChild(createTaskCard(item)));
        }
        column.appendChild(taskList);
      } else {
        const taskIcons = tasks
          .slice(0, 3)
          .map(
            (item) =>
              `<span class="day-strip-symbol" style="--responsible-color: ${colorForUser(item.task.responsibleId)}">${item.task.icon}</span>`
          )
          .join("");
        column.innerHTML = `
          <div class="day-strip">
            <div class="day-strip-day">${t.weekdayLong[weekdayKeys[index]].slice(0, 1)}</div>
            <div class="day-strip-symbols">${taskIcons || "○"}</div>
            ${openCount ? `<div class="day-strip-count">${openCount}</div>` : ""}
            ${overdueCount ? `<div class="day-strip-alert">!</div>` : ""}
          </div>
        `;
      }

      refs.weekGrid.appendChild(column);
    }
  }

  function renderFamilyDock() {
    refs.familyDock.innerHTML = "";
    users.forEach((user) => {
      const assigned = state.tasks.filter((task) => task.responsibleId === user.id && task.status === "open").length;
      const button = document.createElement("button");
      button.type = "button";
      const isActiveMember =
        state.settings.boardDensity === BOARD_DENSITY.mine && state.settings.currentUserId === user.id;
      button.className = `member-tile${isActiveMember ? " active" : ""}`;
      button.dataset.userId = user.id;
      button.style.setProperty("--responsible-color", colorForUser(user.id));
      button.addEventListener("click", () => {
        if (ui.selectedTaskId) {
          reassignTask(ui.selectedTaskId, user.id);
          return;
        }
        if (isActiveMember) {
          state.settings.boardDensity = BOARD_DENSITY.everyone;
          saveState();
          renderApp();
          return;
        }
        state.settings.currentUserId = user.id;
        state.settings.boardDensity = BOARD_DENSITY.mine;
        saveState();
        renderApp();
      });
      button.addEventListener("dragover", handleDragOver);
      button.addEventListener("dragleave", handleDragLeave);
      button.addEventListener("drop", (event) => {
        handleDragLeave(event);
        if (ui.dragTaskId) {
          reassignBoardItem(ui.dragTaskId, user.id);
        }
      });
      button.innerHTML = `<strong>${user.emoji} ${user.name}</strong><span>${currentMessages().openTasks.replace("{count}", String(assigned))}</span>`;
      refs.familyDock.appendChild(button);
    });
  }

  function renderQuickTasks() {
    refs.quickTasksStrip.innerHTML = "";
    quickTaskTemplates.forEach((template) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quick-task-chip";
      button.draggable = true;
      button.innerHTML = `<span class="quick-task-icon">${template.icon}</span><span>${template.title[state.settings.language] || template.title.en}</span>`;
      button.addEventListener("dragstart", (event) => {
        ui.dragTaskId = `quick:${template.id}`;
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "copy";
          event.dataTransfer.setData("text/plain", `quick:${template.id}`);
        }
      });
      button.addEventListener("dragend", () => {
        ui.dragTaskId = null;
        clearDropTargets();
      });
      button.addEventListener("click", () => {
        openTaskDialog(null, {
          dueDate: formatDateKey(startOfDay(new Date())),
          title: template.title[state.settings.language] || template.title.en,
          icon: template.icon,
          category: template.category,
          effort: template.effort,
        });
      });
      refs.quickTasksStrip.appendChild(button);
    });
  }

  function renderSavedTasks() {
    refs.savedTasksStrip.innerHTML = "";
    state.taskLibrary.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quick-task-chip saved-task-chip";
      button.draggable = true;
      button.innerHTML = `<span class="quick-task-icon">${entry.icon}</span><span>${resolveLibraryTitle(entry)}</span>`;
      button.addEventListener("dragstart", (event) => {
        ui.dragTaskId = `saved:${entry.id}`;
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "copy";
          event.dataTransfer.setData("text/plain", `saved:${entry.id}`);
        }
      });
      button.addEventListener("dragend", () => {
        ui.dragTaskId = null;
        clearDropTargets();
      });
      button.addEventListener("click", () => {
        openTaskDialog(null, {
          dueDate: formatDateKey(startOfDay(new Date())),
          title: resolveLibraryTitle(entry),
          icon: entry.icon,
          category: entry.category,
          ownerId: state.settings.currentUserId,
          responsibleId: state.settings.currentUserId,
          effort: entry.effort,
          notes: resolveLibraryNotes(entry),
        });
      });
      refs.savedTasksStrip.appendChild(button);
    });
  }

  function renderDialogOptions() {
    fillSelect(
      refs.taskCategoryInput,
      categories.map((category) => ({
        value: category.id,
        label: messageForCategory(category.id),
      }))
    );
    fillSelect(refs.taskOwnerInput, users.map((user) => ({ value: user.id, label: `${user.emoji} ${user.name}` })));
    fillSelect(
      refs.taskResponsibleInput,
      [{ value: "everyone", label: currentMessages().everyone }].concat(users.map((user) => ({ value: user.id, label: `${user.emoji} ${user.name}` })))
    );
    fillSelect(refs.taskEffortInput, effortOptions.map((effort) => ({ value: effort, label: currentMessages()[effort] })));
    fillSelect(refs.taskWeekdayInput, weekdayKeys.map((key, index) => ({ value: String(index), label: currentMessages().weekdayLong[key] })));
    fillSelect(refs.taskRecurrenceInput, [
      { value: "none", label: currentMessages().repeatNever },
      { value: "daily", label: currentMessages().repeatDaily },
      { value: "weekdays", label: currentMessages().repeatWeekdays },
      { value: "weekly", label: currentMessages().repeatWeekly },
      { value: "biweekly", label: currentMessages().repeatBiweekly },
      { value: "monthly", label: currentMessages().repeatMonthly },
      { value: "interval", label: currentMessages().repeatInterval },
    ]);
    renderIconGrid();
    syncDialogFields();
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    if (!["http:", "https:"].includes(window.location.protocol)) {
      return;
    }
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(`./sw.js?${APP_VERSION}`).catch(() => {});
    });
  }

  async function hydrateWeather() {
    try {
      const place = await resolveWeatherPlace();
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
        `&current=temperature_2m,weather_code,is_day,wind_speed_10m&timezone=auto`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("weather_fetch_failed");
      }
      const payload = await response.json();
      const current = payload.current || {};
      const visual = mapWeatherCode(current.weather_code, current.is_day);
      ui.weather = {
        status: "ready",
        place: place.name,
        temperature: Number(current.temperature_2m) || 0,
        wind: Number(current.wind_speed_10m) || 0,
        condition: visual.label,
        theme: visual.theme,
      };
    } catch (error) {
      ui.weather = {
        status: "error",
        place: WEATHER_FALLBACK.name,
        temperature: null,
        wind: null,
        condition: "",
        theme: "clouds",
      };
    }
    renderApp();
  }

  function resolveWeatherPlace() {
    return Promise.resolve(WEATHER_FALLBACK);
  }

  function mapWeatherCode(code, isDay) {
    const day = Number(isDay) === 1;
    if (code === 0) {
      return { theme: day ? "clear" : "night", label: day ? "Sunny" : "Clear night" };
    }
    if ([1, 2].includes(code)) {
      return { theme: "partly", label: "Partly cloudy" };
    }
    if (code === 3) {
      return { theme: "clouds", label: "Cloudy" };
    }
    if ([45, 48].includes(code)) {
      return { theme: "fog", label: "Fog" };
    }
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
      return { theme: "rain", label: "Rain" };
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return { theme: "snow", label: "Snow" };
    }
    if ([95, 96, 99].includes(code)) {
      return { theme: "storm", label: "Storm" };
    }
    return { theme: day ? "partly" : "night", label: day ? "Fair" : "Night" };
  }

  function renderIconGrid(selectedIcon) {
    refs.iconGrid.innerHTML = "";
    const activeIcon = selectedIcon || refs.taskIconInput.value || iconChoices[0];
    refs.taskIconInput.value = activeIcon;
    iconChoices.forEach((icon) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `icon-option${icon === activeIcon ? " active" : ""}`;
      button.textContent = icon;
      button.setAttribute("aria-pressed", icon === activeIcon ? "true" : "false");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        refs.taskIconInput.value = icon;
        renderIconGrid(icon);
      });
      refs.iconGrid.appendChild(button);
    });
  }

  function fillDialogLabels() {
    const t = currentMessages();
    refs.dialogEyebrow.textContent = ui.dialogMode === "edit" ? t.editTask : t.addTask;
    refs.dialogTitle.textContent = ui.dialogMode === "edit" ? t.editTask : t.addTask;
    refs.fieldTitleLabel.textContent = t.taskTitle;
    refs.fieldIconLabel.textContent = t.taskIcon;
    refs.fieldCategoryLabel.textContent = t.taskCategory;
    refs.fieldOwnerLabel.textContent = t.taskOwner;
    refs.fieldResponsibleLabel.textContent = t.taskResponsible;
    refs.fieldDayLabel.textContent = t.taskDay;
    refs.fieldRepeatLabel.textContent = t.taskRepeat;
    refs.fieldIntervalLabel.textContent = t.taskInterval;
    refs.fieldWeekdayLabel.textContent = t.taskWeekday;
    refs.fieldEffortLabel.textContent = t.taskEffort;
    refs.fieldNotesLabel.textContent = t.taskNotes;
    refs.deleteTaskButton.textContent = t.delete;
    refs.deleteSeriesButton.textContent = "Delete series";
    refs.cancelTaskButton.textContent = t.cancel;
    refs.saveTaskButton.textContent = t.save;
  }

  function createTaskCard(item) {
    const t = currentMessages();
    const fragment = refs.taskCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".task-card");
    const detailsShell = fragment.querySelector(".task-details-shell");
    const summary = fragment.querySelector(".task-summary");
    const complete = fragment.querySelector(".complete-chip");
    const icon = fragment.querySelector(".task-icon");
    const title = fragment.querySelector(".task-title");
    const meta = fragment.querySelector(".task-meta");
    const badges = fragment.querySelector(".task-badges");
    const editButton = fragment.querySelector(".edit-task-button");

    const task = item.task;
    const overdue = isItemOverdue(item);
    const responsibleColor = colorForUser(task.responsibleId);
    card.dataset.taskId = task.id;
    card.dataset.dateKey = item.dateKey;
    card.style.setProperty("--responsible-color", responsibleColor);
    detailsShell.open = Boolean(ui.expandedCards[item.id]);
    card.classList.toggle("overdue", overdue);
    card.classList.toggle("done", item.done);
    card.classList.toggle("selected", ui.selectedTaskId === task.id);
    summary.addEventListener("click", () => {
      ui.expandedCards[item.id] = !detailsShell.open;
    });
    card.addEventListener("dragstart", (event) => {
      ui.dragTaskId = item.id;
      ui.selectedTaskId = task.id;
      card.classList.add("dragging");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", item.id);
      }
    });
    card.addEventListener("dragend", () => {
      ui.dragTaskId = null;
      card.classList.remove("dragging");
      clearDropTargets();
    });

    icon.textContent = task.icon;
    title.textContent = resolveTaskTitle(task);
    meta.textContent = describeBoardItemLine(item);
    complete.textContent = item.done ? t.reopen : t.complete;
    complete.addEventListener("click", () => toggleTaskCompletion(item, !item.done));
    editButton.textContent = t.edit;
    editButton.addEventListener("click", () => openTaskDialog(task.id));

    badges.appendChild(createBadge(`${t.owner}: ${displayUser(task.ownerId)}`));
    badges.appendChild(createBadge(`${t.responsible}: ${displayUser(task.responsibleId)}`));
    badges.appendChild(createBadge(`${t.statusEffort}: ${t[task.effort]}`));
    if (task.recurrence !== "none") {
      badges.appendChild(createBadge(`${t.statusRecurring}: ${recurrenceLabel(task.recurrence)}`));
    }
    if (overdue) {
      badges.appendChild(createBadge(t.overdueBy.replace("{days}", String(daysBetween(parseDateKey(item.dateKey), startOfDay(new Date()))))));
    }

    return fragment;
  }

  function createBadge(text) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = text;
    return badge;
  }

  function openTaskDialog(taskId, defaults) {
    ui.dialogMode = taskId ? "edit" : "create";
    ui.editingTaskId = taskId || null;
    fillDialogLabels();
    renderDialogOptions();

    const task = taskId ? state.tasks.find((item) => item.id === taskId) : null;
    const today = formatDateKey(startOfDay(new Date()));
    refs.taskTitleInput.value = task ? resolveTaskTitle(task) : "";
    refs.taskIconInput.value = task?.icon || defaults?.icon || iconChoices[0];
    refs.taskCategoryInput.value = task?.category || defaults?.category || "home";
    refs.taskOwnerInput.value = task?.ownerId || defaults?.ownerId || state.settings.currentUserId;
    refs.taskResponsibleInput.value = task?.responsibleId || defaults?.responsibleId || state.settings.currentUserId;
    refs.taskDayInput.value = task?.dueDate || defaults?.dueDate || today;
    refs.taskRecurrenceInput.value = task?.recurrence || "none";
    refs.taskIntervalInput.value = String(task?.interval || 1);
    refs.taskWeekdayInput.value = String(task?.weekday ?? getWeekdayIndex(startOfDay(new Date())));
    refs.taskEffortInput.value = task?.effort || defaults?.effort || "steady";
    refs.taskNotesInput.value = task ? resolveTaskNotes(task) : defaults?.notes || "";
    refs.taskTitleInput.value = task ? resolveTaskTitle(task) : defaults?.title || "";
    refs.deleteTaskButton.classList.toggle("hidden", !task);
    refs.deleteSeriesButton.classList.toggle("hidden", !(task && task.recurrence !== "none"));
    renderIconGrid(task?.icon || defaults?.icon || iconChoices[0]);
    syncDialogFields();
    refs.taskDialog.showModal();
  }

  function createQuickTaskFromTemplate(templateId, dateKey) {
    const template = quickTaskTemplates.find((item) => item.id === templateId);
    if (!template) {
      return;
    }
    const selectedUserId = state.settings.currentUserId;
    state.tasks.push({
      id: crypto.randomUUID(),
      title: template.title.en,
      titleTranslations: template.title,
      icon: template.icon,
      category: template.category,
      ownerId: selectedUserId,
      responsibleId: selectedUserId,
      dueDate: dateKey,
      recurrence: "none",
      interval: 1,
      weekday: null,
      effort: template.effort,
      notes: "",
      notesTranslations: null,
      status: "open",
      completedAt: null,
      completionDates: [],
      exceptionDates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastGeneratedAt: null,
    });
    ui.dragTaskId = null;
    saveState();
    renderApp();
  }

  function createTaskFromLibrary(libraryId, dateKey) {
    const entry = state.taskLibrary.find((item) => item.id === libraryId);
    if (!entry) {
      return;
    }
    const selectedUserId = state.settings.currentUserId;
    const task = buildTask({
      title: entry.titleTranslations || entry.title,
      icon: entry.icon,
      category: entry.category,
      owner: selectedUserId,
      responsible: selectedUserId,
      dueDate: dateKey,
      recurrence: entry.recurrence,
      interval: entry.interval,
      weekday: entry.weekday,
      effort: entry.effort,
      notes: entry.notesTranslations || entry.notes,
      libraryId: entry.id,
    });
    if (task.recurrence !== "none") {
      task.seriesId = task.id;
    }
    state.tasks.push(task);
    ui.dragTaskId = null;
    saveState();
    hydrateRecurringTasks();
    renderApp();
  }

  function closeDialog() {
    refs.taskDialog.close();
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const payload = {
      title: refs.taskTitleInput.value.trim(),
      icon: refs.taskIconInput.value || iconChoices[0],
      category: refs.taskCategoryInput.value,
      ownerId: refs.taskOwnerInput.value,
      responsibleId: refs.taskResponsibleInput.value,
      dueDate: refs.taskDayInput.value,
      recurrence: refs.taskRecurrenceInput.value,
      interval: Number(refs.taskIntervalInput.value) || 1,
      weekday: Number(refs.taskWeekdayInput.value),
      effort: refs.taskEffortInput.value,
      notes: refs.taskNotesInput.value.trim(),
    };

    if (!payload.title || !payload.dueDate) {
      return;
    }

    let taskToPersist;

    if (ui.dialogMode === "edit" && ui.editingTaskId) {
      const task = state.tasks.find((item) => item.id === ui.editingTaskId);
      if (!task) {
        return;
      }
      Object.assign(task, payload, {
        titleTranslations: null,
        notesTranslations: null,
        completionDates: task.completionDates || [],
        updatedAt: new Date().toISOString(),
      });
      if (task.recurrence !== "none" && !task.seriesId) {
        task.seriesId = task.id;
      }
      taskToPersist = task;
    } else {
      taskToPersist = buildTask({
        title: payload.title,
        icon: payload.icon,
        category: payload.category,
        owner: payload.ownerId,
        responsible: payload.responsibleId,
        dueDate: payload.dueDate,
        recurrence: payload.recurrence,
        interval: payload.interval,
        weekday: payload.weekday,
        effort: payload.effort,
        notes: payload.notes,
      });
      if (taskToPersist.recurrence !== "none") {
        taskToPersist.seriesId = taskToPersist.id;
      }
      state.tasks.push(taskToPersist);
    }

    upsertTaskLibraryFromTask(taskToPersist);

    saveState();
    closeDialog();
    hydrateRecurringTasks();
    renderApp();
  }

  function deleteEditingTask() {
    if (!ui.editingTaskId) {
      return;
    }
    state.tasks = state.tasks.filter((task) => task.id !== ui.editingTaskId);
    saveState();
    closeDialog();
    renderApp();
  }

  function deleteEditingSeries() {
    if (!ui.editingTaskId) {
      return;
    }
    const task = state.tasks.find((item) => item.id === ui.editingTaskId);
    if (!task || task.recurrence === "none") {
      return;
    }
    const rootSeriesId = task.seriesId || task.id;
    state.tasks = state.tasks.filter((item) => item.id !== rootSeriesId && item.seriesId !== rootSeriesId);
    saveState();
    closeDialog();
    renderApp();
  }

  function syncDialogFields() {
    const recurrence = refs.taskRecurrenceInput.value;
    refs.intervalField.classList.toggle("hidden", recurrence !== "interval");
    refs.weekdayField.classList.toggle("hidden", !["weekly", "biweekly"].includes(recurrence));
  }

  function upsertTaskLibraryFromTask(task) {
    if (!task) {
      return;
    }
    const libraryId = task.libraryId || crypto.randomUUID();
    task.libraryId = libraryId;
    const entry = {
      id: libraryId,
      title: task.title,
      titleTranslations: task.titleTranslations,
      icon: task.icon,
      category: task.category,
      ownerId: task.ownerId,
      responsibleId: task.responsibleId,
      recurrence: task.recurrence || "none",
      interval: task.interval || 1,
      weekday: typeof task.weekday === "number" ? task.weekday : null,
      effort: task.effort || "steady",
      notes: task.notes || "",
      notesTranslations: task.notesTranslations || null,
      updatedAt: new Date().toISOString(),
    };
    const existingIndex = state.taskLibrary.findIndex((item) => item.id === libraryId);
    if (existingIndex >= 0) {
      state.taskLibrary.splice(existingIndex, 1, entry);
    } else {
      state.taskLibrary.unshift(entry);
    }
  }

  function resolveLibraryTitle(entry) {
    if (!entry) {
      return "";
    }
    if (entry.titleTranslations && entry.titleTranslations[state.settings.language]) {
      return entry.titleTranslations[state.settings.language];
    }
    return entry.title || entry.titleTranslations?.en || "";
  }

  function resolveLibraryNotes(entry) {
    if (!entry) {
      return "";
    }
    if (entry.notesTranslations && entry.notesTranslations[state.settings.language]) {
      return entry.notesTranslations[state.settings.language];
    }
    return entry.notes || entry.notesTranslations?.en || "";
  }

  function moveTaskToDate(taskId, dateKey) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    task.dueDate = dateKey;
    task.updatedAt = new Date().toISOString();
    ui.selectedTaskId = null;
    saveState();
    renderApp();
  }

  function moveBoardItemToDate(itemId, dateKey) {
    const item = findBoardItemById(itemId);
    if (!item) {
      return;
    }
    if (item.kind === "single") {
      moveTaskToDate(item.task.id, dateKey);
      return;
    }
    moveRecurringOccurrence(item, { dueDate: dateKey });
  }

  function reassignTask(taskId, userId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    task.responsibleId = userId;
    task.updatedAt = new Date().toISOString();
    ui.selectedTaskId = null;
    saveState();
    renderApp();
  }

  function reassignBoardItem(itemId, userId) {
    const item = findBoardItemById(itemId);
    if (!item) {
      return;
    }
    if (item.kind === "single") {
      reassignTask(item.task.id, userId);
      return;
    }
    moveRecurringOccurrence(item, { responsibleId: userId });
  }

  function moveRecurringOccurrence(item, changes) {
    const task = state.tasks.find((entry) => entry.id === item.task.id);
    if (!task) {
      return;
    }
    task.exceptionDates = Array.isArray(task.exceptionDates) ? task.exceptionDates : [];
    if (!task.exceptionDates.includes(item.dateKey)) {
      task.exceptionDates.push(item.dateKey);
    }

    state.tasks.push({
      id: crypto.randomUUID(),
      title: task.title,
      titleTranslations: task.titleTranslations,
      icon: task.icon,
      category: task.category,
      ownerId: task.ownerId,
      responsibleId: changes.responsibleId || task.responsibleId,
      dueDate: changes.dueDate || item.dateKey,
      recurrence: "none",
      interval: 1,
      weekday: null,
      effort: task.effort,
      notes: task.notes,
      notesTranslations: task.notesTranslations,
      libraryId: task.libraryId || null,
      seriesId: task.seriesId || task.id,
      status: "open",
      completedAt: null,
      completionDates: [],
      exceptionDates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastGeneratedAt: null,
    });

    ui.selectedTaskId = null;
    saveState();
    renderApp();
  }

  function findBoardItemById(itemId) {
    const weekStart = getDisplayedWeekStart();
    const weekEnd = addDays(weekStart, 6);
    return state.tasks.flatMap((task) => getBoardItemsForTask(task, weekStart, weekEnd)).find((item) => item.id === itemId) || null;
  }

  function toggleTaskCompletion(boardItem, shouldComplete) {
    const task = state.tasks.find((item) => item.id === boardItem.task.id);
    if (!task) {
      return;
    }
    if (task.recurrence !== "none") {
      task.completionDates = Array.isArray(task.completionDates) ? task.completionDates : [];
      if (shouldComplete) {
        if (!task.completionDates.includes(boardItem.dateKey)) {
          task.completionDates.push(boardItem.dateKey);
        }
      } else {
        task.completionDates = task.completionDates.filter((dateKey) => dateKey !== boardItem.dateKey);
      }
    } else {
      task.status = shouldComplete ? "done" : "open";
      task.completedAt = shouldComplete ? new Date().toISOString() : null;
    }
    task.updatedAt = new Date().toISOString();
    ui.selectedTaskId = null;
    saveState();
    renderApp();
  }

  function hydrateRecurringTasks() {
    let changed = false;
    state.tasks.forEach((task) => {
      if (typeof task.interval !== "number" || Number.isNaN(task.interval) || task.interval < 1) {
        task.interval = 1;
        changed = true;
      }
      if (!task.status) {
        task.status = "open";
        changed = true;
      }
      if (!task.createdAt) {
        task.createdAt = new Date().toISOString();
        changed = true;
      }
      if (!task.updatedAt) {
        task.updatedAt = new Date().toISOString();
        changed = true;
      }
      if (!Array.isArray(task.completionDates)) {
        task.completionDates = [];
        changed = true;
      }
      if (!Array.isArray(task.exceptionDates)) {
        task.exceptionDates = [];
        changed = true;
      }
    });
    if (changed) {
      saveState();
    }
  }

  function getVisibleItemsForCurrentWeek() {
    const weekStart = getDisplayedWeekStart();
    const weekEnd = addDays(weekStart, 6);
    return state.tasks.flatMap((task) => getBoardItemsForTask(task, weekStart, weekEnd)).filter(matchesBoardFilters).sort(compareBoardItems);
  }

  function getItemsForDay(dayDate) {
    return getVisibleItemsForCurrentWeek().filter((item) => isSameDay(parseDateKey(item.dateKey), dayDate));
  }

  function getBoardItemsForTask(task, rangeStart, rangeEnd) {
    const anchor = parseDateKey(task.dueDate);
    if (task.recurrence === "none") {
      return anchor >= rangeStart && anchor <= rangeEnd ? [buildBoardItem(task, task.dueDate)] : [];
    }

    const items = [];
    let cursor = rangeStart > anchor ? rangeStart : anchor;
    while (cursor <= rangeEnd) {
      if (occursOnDate(task, cursor)) {
        items.push(buildBoardItem(task, formatDateKey(cursor)));
      }
      cursor = addDays(cursor, 1);
    }
    return items;
  }

  function buildBoardItem(task, dateKey) {
    const done = task.recurrence === "none"
      ? task.status === "done"
      : Array.isArray(task.completionDates) && task.completionDates.includes(dateKey);
    return {
      id: task.recurrence === "none" ? task.id : `${task.id}:${dateKey}`,
      kind: task.recurrence === "none" ? "single" : "recurring",
      task,
      dateKey,
      icon: task.icon,
      done,
    };
  }

  function occursOnDate(task, date) {
    const anchor = parseDateKey(task.dueDate);
    const current = startOfDay(date);
    if (current < anchor) {
      return false;
    }
    if (Array.isArray(task.exceptionDates) && task.exceptionDates.includes(formatDateKey(current))) {
      return false;
    }
    const diffDays = daysBetween(anchor, current);

    switch (task.recurrence) {
      case "daily":
        return true;
      case "weekdays":
        return !isWeekend(current);
      case "weekly":
        return diffDays % 7 === 0 && weekdayMatches(task, current);
      case "biweekly":
        return diffDays % 14 === 0 && weekdayMatches(task, current);
      case "monthly":
        return current.getDate() === anchor.getDate();
      case "interval":
        return diffDays % Math.max(1, Number(task.interval) || 1) === 0;
      default:
        return false;
    }
  }

  function weekdayMatches(task, date) {
    return typeof task.weekday === "number" ? getWeekdayIndex(date) === task.weekday : true;
  }

  function matchesBoardFilters(item) {
    const task = item.task;
    if (!state.settings.showCompleted && item.done) {
      return false;
    }
    if (state.settings.activeFilter === "today" && !isSameDay(parseDateKey(item.dateKey), startOfDay(new Date()))) {
      return false;
    }
    if (state.settings.activeFilter === "overdue" && !isItemOverdue(item)) {
      return false;
    }
    if (state.settings.boardDensity === BOARD_DENSITY.mine && task.responsibleId !== state.settings.currentUserId) {
      return false;
    }
    return true;
  }

  function compareBoardItems(left, right) {
    if (left.done !== right.done) {
      return left.done ? 1 : -1;
    }
    if (left.task.responsibleId === state.settings.currentUserId && right.task.responsibleId !== state.settings.currentUserId) {
      return -1;
    }
    return resolveTaskTitle(left.task).localeCompare(resolveTaskTitle(right.task));
  }

  function currentMessages() {
    return messages[state.settings.language] || messages.en;
  }

  function messageForCategory(categoryId) {
    const category = categories.find((item) => item.id === categoryId);
    return category ? currentMessages()[category.key] : categoryId;
  }

  function displayUser(userId) {
    if (userId === "everyone") {
      return currentMessages().everyone;
    }
    return users.find((user) => user.id === userId)?.name || userId;
  }

  function colorForUser(userId) {
    return USER_COLORS[userId] || "#8aa0b6";
  }

  function describeBoardItemLine(item) {
    const t = currentMessages();
    const task = item.task;
    const dueDate = parseDateKey(item.dateKey);
    let dueLabel = formatNumericDate(dueDate);
    if (isSameDay(dueDate, new Date())) {
      dueLabel = t.dueToday;
    } else if (isSameDay(dueDate, addDays(startOfDay(new Date()), 1))) {
      dueLabel = t.dueTomorrow;
    }
    return `${messageForCategory(task.category)} • ${displayUser(task.responsibleId)} • ${dueLabel}`;
  }

  function resolveTaskTitle(task) {
    return task.titleTranslations?.[state.settings.language] || task.title;
  }

  function resolveTaskNotes(task) {
    return task.notesTranslations?.[state.settings.language] || task.notes || "";
  }

  function recurrenceLabel(recurrence) {
    const t = currentMessages();
    const map = {
      none: t.repeatNever,
      daily: t.repeatDaily,
      weekdays: t.repeatWeekdays,
      weekly: t.repeatWeekly,
      biweekly: t.repeatBiweekly,
      monthly: t.repeatMonthly,
      interval: t.repeatInterval,
    };
    return map[recurrence] || recurrence;
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add("drop-target");
  }

  function handleDragLeave(event) {
    event.currentTarget.classList.remove("drop-target");
  }

  function clearDropTargets() {
    document.querySelectorAll(".drop-target").forEach((element) => element.classList.remove("drop-target"));
  }

  function getDisplayedWeekStart() {
    return addDays(startOfWeek(new Date()), state.settings.weekOffset * 7);
  }

  function fillSelect(select, options) {
    const previous = select.value;
    select.innerHTML = "";
    options.forEach((option) => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      select.appendChild(element);
    });
    if (options.some((option) => option.value === previous)) {
      select.value = previous;
    }
  }

  function isItemOverdue(item) {
    return !item.done && parseDateKey(item.dateKey) < startOfDay(new Date());
  }

  function countCompletedToday() {
    const todayKey = formatDateKey(startOfDay(new Date()));
    return state.tasks.reduce((count, task) => {
      if (task.recurrence !== "none") {
        return count + (Array.isArray(task.completionDates) && task.completionDates.includes(todayKey) ? 1 : 0);
      }
      return count + (task.completedAt ? (isSameDay(new Date(task.completedAt), new Date()) ? 1 : 0) : 0);
    }, 0);
  }

  function startOfWeek(date) {
    const base = startOfDay(date);
    const day = (base.getDay() + 6) % 7;
    return addDays(base, -day);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, amount) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function parseDateKey(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function isSameDay(left, right) {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  }

  function isWeekend(date) {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  function formatNumericDate(date) {
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function formatDateRange(weekStart) {
    const weekEnd = addDays(weekStart, 6);
    return `${formatNumericDate(weekStart)}-${formatNumericDate(weekEnd)}`;
  }

  function getWeekNumber(date) {
    const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    return Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
  }

  function daysBetween(older, newer) {
    return Math.round((newer - older) / 86400000);
  }

  function getWeekdayIndex(date) {
    return (date.getDay() + 6) % 7;
  }
})();

(function () {
  const STORAGE_KEY = "homeflow-board-v2";
  const AUTO_REFRESH_MS = 60000;
  const WEATHER_REFRESH_MS = 300000;
  const IDLE_SCROLL_TOP_MS = 300000;
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
    { id: "en", countryCode: "GB", short: "EN" },
    { id: "fi", countryCode: "FI", short: "FI" },
    { id: "de", countryCode: "DE", short: "DE" },
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
    { id: "vacuum", icon: "🪠", category: "cleaning", effort: "big", title: { en: "Vacuuming", fi: "Imurointi", de: "Staubsaugen" } },
    { id: "bedsheets", icon: "🛏️", category: "home", effort: "steady", title: { en: "Change bed sheets", fi: "Vaihda lakanat", de: "Bettwäsche wechseln" } },
    { id: "shopping", icon: "🛒", category: "shopping", effort: "steady", title: { en: "Shopping", fi: "Kauppa", de: "Einkauf" } },
    { id: "school", icon: "🎒", category: "school", effort: "light", title: { en: "School bag", fi: "Reppu", de: "Schultasche" } },
    { id: "bath", icon: "🛁", category: "family", effort: "steady", title: { en: "Bath time", fi: "Kylpy", de: "Badezeit" } }
  ];

  const celebrationWords = {
    en: ["Nice", "Good", "Great", "Super", "Yes", "Done"],
    fi: ["Hyvä", "Jes", "Hieno", "Loisto", "Super", "Valmis"],
    de: ["Gut", "Klasse", "Super", "Prima", "Top", "Erledigt"],
  };

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
      prevWeek: "<- Week",
      nextWeek: "Week ->",
      today: "Today",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit fullscreen",
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
      taskTime: "Time",
      taskEndTime: "Until",
      taskRepeat: "Repeat",
      taskInterval: "Every how many days?",
      taskWeekday: "Preferred weekday",
      taskEffort: "Effort",
      taskClaimable: "Send to claim area",
      taskSomeday: "Save for someday",
      taskNotes: "Notes",
      previewLabel: "Preview",
      backupHeading: "Backup",
      claimPoolHeading: "Claim tasks",
      somedayHeading: "Someday tasks",
      claimNow: "Claim",
      somedayPlanNow: "Schedule now",
      removeClaimTask: "Remove",
      claimEmpty: "Drop tasks here or create them as claimable.",
      sendToClaimInbox: "Send to claim inbox",
      sendToSomeday: "Save for someday",
      requestedBy: "Requested by {user}",
      claimInbox: "Claim inbox",
      somedayInbox: "Someday tasks",
      openClaimTasks: "Open claim tasks: {count}",
      openSomedayTasks: "Someday: {count}",
      claimWho: "Who are you?",
      claimInboxCopy: "Claim a task and it will be added to today with no time.",
      somedayInboxCopy: "Keep tasks here until you want to schedule them.",
      exportData: "Export data",
      importData: "Import data",
      save: "Save task",
      cancel: "Cancel",
      delete: "Delete",
      deleteFromPlan: "Delete from plan",
      complete: "Complete",
      reopen: "Reopen",
      didItFor: "I did it for {user}",
      countedFor: "Counted for {user}",
      claimTask: "Claim for me",
      claimedTask: "Claimed by me",
      dayCleared: "Day complete",
      dayClearedSub: "Everything for today is done",
      participantEyebrow: "Completion",
      participantTitle: "Who participated?",
      participantCopy: "Choose one or more people for the leaderboard.",
      confirmParticipants: "Complete task",
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
      repeatLinneaWeeks: "Linnea Weeks",
      repeatNotLinneaWeeks: "Not Linnea Weeks",
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
      tasksDoneToday: "Tasks done today",
      doneThisWeek: "Done this week",
      bestWeek: "Best week",
      noBestWeek: "No record yet",
      overdueTasks: "Overdue tasks",
      noOverdueTasks: "Nothing overdue",
      goToTask: "Go to",
      rankingTitle: "Family progress",
      rankingGold: "Gold",
      rankingSilver: "Silver",
      rankingBronze: "Bronze",
      teamworkDone: "{count} tasks together",
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
      prevWeek: "<- Viikko",
      nextWeek: "Viikko ->",
      today: "Tänään",
      fullscreen: "Koko näyttö",
      exitFullscreen: "Poistu koko näytöstä",
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
      taskTime: "Aika",
      taskEndTime: "Asti",
      taskRepeat: "Toistuvuus",
      taskInterval: "Kuinka monen päivän välein?",
      taskWeekday: "Suosittu viikonpäivä",
      taskEffort: "Työmäärä",
      taskClaimable: "Lähetä claim-alueelle",
      taskSomeday: "Tallenna myöhemmäksi",
      taskNotes: "Muistiinpanot",
      previewLabel: "Esikatselu",
      backupHeading: "Varmuuskopio",
      claimPoolHeading: "Claim-tehtävät",
      somedayHeading: "Emme tiedä vielä milloin",
      claimNow: "Claim",
      somedayPlanNow: "Joskus on tänään",
      removeClaimTask: "Poista",
      claimEmpty: "Vedä tehtäviä tähän tai luo ne claimattaviksi.",
      sendToClaimInbox: "Lähetä claim-tehtäviin",
      sendToSomeday: "Tallenna myöhemmäksi",
      requestedBy: "Pyytänyt: {user}",
      claimInbox: "Claim-tehtävät",
      somedayInbox: "Joskus on tänään",
      openClaimTasks: "Avaa claim-tehtävät: {count}",
      openSomedayTasks: "Joskus on tänään: {count}",
      claimWho: "Kuka olet?",
      claimInboxCopy: "Claimattu tehtävä lisätään tälle päivälle ilman aikaa.",
      somedayInboxCopy: "Tehtävät odottavat täällä siihen asti, kunnes päätät että nyt on oikea hetki.",
      exportData: "Vie tiedot",
      importData: "Tuo tiedot",
      save: "Tallenna tehtävä",
      cancel: "Peruuta",
      delete: "Poista",
      deleteFromPlan: "Poista suunnitelmasta",
      complete: "Valmis",
      reopen: "Avaa uudelleen",
      didItFor: "Minä tein tämän: {user}",
      countedFor: "Laskettu käyttäjälle {user}",
      claimTask: "Merkitse minulle",
      claimedTask: "Merkitty minulle",
      dayCleared: "Päivä valmis",
      dayClearedSub: "Kaikki tämän päivän tehtävät on tehty",
      participantEyebrow: "Valmis",
      participantTitle: "Ketkä osallistuivat?",
      participantCopy: "Valitse yksi tai useampi henkilö pistelistaa varten.",
      confirmParticipants: "Merkitse valmiiksi",
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
      repeatLinneaWeeks: "Linnea-viikot",
      repeatNotLinneaWeeks: "Ei Linnea-viikot",
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
      tasksDoneToday: "Tehty tänään",
      doneThisWeek: "Tehty tällä viikolla",
      bestWeek: "Paras viikko",
      noBestWeek: "Ei vielä ennätystä",
      overdueTasks: "Myöhässä olevat",
      noOverdueTasks: "Ei myöhässä olevia",
      goToTask: "Siirry",
      rankingTitle: "Perheen eteneminen",
      rankingGold: "Kulta",
      rankingSilver: "Hopea",
      rankingBronze: "Pronssi",
      teamworkDone: "{count} tehtävää yhdessä",
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
      prevWeek: "<- Woche",
      nextWeek: "Woche ->",
      today: "Heute",
      fullscreen: "Vollbild",
      exitFullscreen: "Vollbild beenden",
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
      taskTime: "Uhrzeit",
      taskEndTime: "Bis",
      taskRepeat: "Wiederholung",
      taskInterval: "Alle wie viele Tage?",
      taskWeekday: "Bevorzugter Wochentag",
      taskEffort: "Aufwand",
      taskClaimable: "In den Claim-Bereich legen",
      taskSomeday: "Für irgendwann speichern",
      taskNotes: "Notizen",
      previewLabel: "Vorschau",
      backupHeading: "Sicherung",
      claimPoolHeading: "Claim-Aufgaben",
      somedayHeading: "Irgendwann-Aufgaben",
      claimNow: "Claim",
      somedayPlanNow: "Jetzt einplanen",
      removeClaimTask: "Entfernen",
      claimEmpty: "Aufgaben hierher ziehen oder direkt als claimbar erstellen.",
      sendToClaimInbox: "In Claim-Aufgaben legen",
      sendToSomeday: "Für irgendwann speichern",
      requestedBy: "Angefragt von {user}",
      claimInbox: "Claim-Aufgaben",
      somedayInbox: "Irgendwann-Aufgaben",
      openClaimTasks: "Claim-Aufgaben öffnen: {count}",
      openSomedayTasks: "Irgendwann: {count}",
      claimWho: "Wer bist du?",
      claimInboxCopy: "Eine geclaimte Aufgabe wird ohne Uhrzeit zu heute hinzugefügt.",
      somedayInboxCopy: "Aufgaben bleiben hier, bis du sie einplanen willst.",
      exportData: "Daten exportieren",
      importData: "Daten importieren",
      save: "Aufgabe speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      deleteFromPlan: "Aus Plan löschen",
      complete: "Erledigt",
      reopen: "Wieder öffnen",
      didItFor: "Ich habe das für {user} gemacht",
      countedFor: "Gezählt für {user}",
      claimTask: "Für mich beanspruchen",
      claimedTask: "Für mich beansprucht",
      dayCleared: "Tag geschafft",
      dayClearedSub: "Alles für diesen Tag ist erledigt",
      participantEyebrow: "Erledigt",
      participantTitle: "Wer hat mitgemacht?",
      participantCopy: "Wähle eine oder mehrere Personen für die Rangliste.",
      confirmParticipants: "Aufgabe erledigen",
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
      repeatLinneaWeeks: "Linnea-Wochen",
      repeatNotLinneaWeeks: "Nicht-Linnea-Wochen",
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
      tasksDoneToday: "Heute geschafft",
      doneThisWeek: "Diese Woche geschafft",
      bestWeek: "Beste Woche",
      noBestWeek: "Noch kein Rekord",
      overdueTasks: "Überfällige Aufgaben",
      noOverdueTasks: "Nichts überfällig",
      goToTask: "Öffnen",
      rankingTitle: "Familienfortschritt",
      rankingGold: "Gold",
      rankingSilver: "Silber",
      rankingBronze: "Bronze",
      teamworkDone: "{count} Aufgaben zusammen",
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
        darkMode: false,
      },
      claimPool: [],
      somedayPool: [],
      taskLibrary: [],
      tasks: [],
    };
  }

  function buildTask(config) {
    const responsibleIds = normalizeResponsibleIds(config.responsible);
    const finalResponsibleIds = responsibleIds.length ? responsibleIds : ["everyone"];
    return {
      id: crypto.randomUUID(),
      title: typeof config.title === "string" ? config.title : config.title.en,
      titleTranslations: typeof config.title === "string" ? null : config.title,
      icon: config.icon,
      category: config.category,
      ownerId: config.owner,
      responsibleId: finalResponsibleIds[0],
      responsibleIds: finalResponsibleIds,
      dueDate: formatDateKey(config.dueDate),
      dueTime: typeof config.dueTime === "string" ? config.dueTime : "",
      endTime: typeof config.endTime === "string" ? config.endTime : "",
      recurrence: config.recurrence || "none",
      interval: config.interval || 1,
      weekday: typeof config.weekday === "number" ? config.weekday : null,
      effort: config.effort || "steady",
      notes: typeof config.notes === "string" ? config.notes : config.notes?.en || "",
      notesTranslations: typeof config.notes === "string" ? null : config.notes || null,
      status: "open",
      completedAt: null,
      completedById: null,
      completedByIds: [],
      completionDates: [],
      completionByDate: {},
      completionParticipantsByDate: {},
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
      return normalizeState(JSON.parse(raw));
    } catch (error) {
      return createSeedData();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function normalizeState(data) {
    if (!data?.tasks || !data?.settings) {
      return createSeedData();
    }
    const normalized = typeof structuredClone === "function" ? structuredClone(data) : JSON.parse(JSON.stringify(data));
    if (!Array.isArray(normalized.claimPool)) {
      normalized.claimPool = [];
    }
    if (!Array.isArray(normalized.somedayPool)) {
      normalized.somedayPool = [];
    }
    if (!Array.isArray(normalized.taskLibrary)) {
      normalized.taskLibrary = [];
    }
    if (typeof normalized.settings.showCompleted !== "boolean") {
      normalized.settings.showCompleted = false;
    }
    if (typeof normalized.settings.darkMode !== "boolean") {
      normalized.settings.darkMode = false;
    }
    normalized.tasks = normalized.tasks.map((task) => normalizeResponsibleRecord(task));
    normalized.taskLibrary = normalized.taskLibrary.map((entry) => normalizeResponsibleRecord(entry));
    normalized.claimPool = normalized.claimPool.map((entry) => normalizeClaimRecord(entry));
    normalized.somedayPool = normalized.somedayPool.map((entry) => normalizeSomedayRecord(entry));
    normalized.tasks.forEach((task) => {
      task.endTime = typeof task.endTime === "string" ? task.endTime : "";
      task.completedById = normalizeCompletionUserId(task.completedById, task);
      task.completedByIds = normalizeCompletionUserIds(task.completedByIds, task, task.completedById);
      task.completionByDate = normalizeCompletionByDate(task.completionByDate, task);
      task.completionParticipantsByDate = normalizeCompletionParticipantsByDate(task.completionParticipantsByDate, task, task.completionByDate);
    });
    normalized.taskLibrary.forEach((entry) => {
      entry.endTime = typeof entry.endTime === "string" ? entry.endTime : "";
    });
    normalized.claimPool.forEach((entry) => {
      entry.dueTime = "";
      entry.endTime = "";
    });
    normalized.somedayPool.forEach((entry) => {
      entry.dueTime = "";
      entry.endTime = "";
    });
    return normalized;
  }

  const state = loadState();
  const ui = {
    dialogMode: "create",
    editingTaskId: null,
    pendingSomedayEntryId: null,
    pendingCompletionItemId: null,
    claimDialogUserId: null,
    dragTaskId: null,
    selectedTaskId: null,
    expandedCards: {},
    focusDateKey: null,
    drawerOpen: false,
    reopenDrawerAfterDrag: false,
    weather: {
      status: "loading",
      place: WEATHER_FALLBACK.name,
      temperature: null,
      wind: null,
      condition: "",
      theme: "clear",
    },
    progressGardenFrame: null,
    headerClockTimer: null,
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
    weatherMidCard: document.getElementById("weatherMidCard"),
    weatherOverdueCard: document.getElementById("weatherOverdueCard"),
    weatherRanking: document.getElementById("weatherRanking"),
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
    darkModeLabel: document.getElementById("darkModeLabel"),
    darkModeToggle: document.getElementById("darkModeToggle"),
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
    todayButton: document.getElementById("todayButton"),
    nextWeekButton: document.getElementById("nextWeekButton"),
    fullscreenButton: document.getElementById("fullscreenButton"),
    claimBellButton: document.getElementById("claimBellButton"),
    claimBellText: document.getElementById("claimBellText"),
    claimBellCount: document.getElementById("claimBellCount"),
    somedayButton: document.getElementById("somedayButton"),
    somedayText: document.getElementById("somedayText"),
    somedayCount: document.getElementById("somedayCount"),
    weekGrid: document.getElementById("weekGrid"),
    quickAssignLabel: document.getElementById("quickAssignLabel"),
    familyHeading: document.getElementById("familyHeading"),
    familyDock: document.getElementById("familyDock"),
    familyPanel: document.getElementById("familyPanel"),
    savedTasksHeading: document.getElementById("savedTasksHeading"),
    savedTasksStrip: document.getElementById("savedTasksStrip"),
    quickTasksHeading: document.getElementById("quickTasksHeading"),
    quickTasksStrip: document.getElementById("quickTasksStrip"),
    backupHeading: document.getElementById("backupHeading"),
    exportDataButton: document.getElementById("exportDataButton"),
    importDataButton: document.getElementById("importDataButton"),
    importDataInput: document.getElementById("importDataInput"),
    celebrationLayer: document.getElementById("celebrationLayer"),
    deleteDropZone: document.getElementById("deleteDropZone"),
    deleteDropZoneLabel: document.getElementById("deleteDropZoneLabel"),
    claimDropZone: document.getElementById("claimDropZone"),
    claimDropZoneLabel: document.getElementById("claimDropZoneLabel"),
    somedayDropZone: document.getElementById("somedayDropZone"),
    somedayDropZoneLabel: document.getElementById("somedayDropZoneLabel"),
    taskDialog: document.getElementById("taskDialog"),
    participantDialog: document.getElementById("participantDialog"),
    participantForm: document.getElementById("participantForm"),
    participantEyebrow: document.getElementById("participantEyebrow"),
    participantTitle: document.getElementById("participantTitle"),
    participantCopy: document.getElementById("participantCopy"),
    participantPicker: document.getElementById("participantPicker"),
    closeParticipantDialogButton: document.getElementById("closeParticipantDialogButton"),
    cancelParticipantButton: document.getElementById("cancelParticipantButton"),
    confirmParticipantButton: document.getElementById("confirmParticipantButton"),
    claimDialog: document.getElementById("claimDialog"),
    claimDialogForm: document.getElementById("claimDialogForm"),
    claimDialogEyebrow: document.getElementById("claimDialogEyebrow"),
    claimDialogTitle: document.getElementById("claimDialogTitle"),
    claimDialogCopy: document.getElementById("claimDialogCopy"),
    claimDialogWhoLabel: document.getElementById("claimDialogWhoLabel"),
    claimDialogUserPicker: document.getElementById("claimDialogUserPicker"),
    claimDialogList: document.getElementById("claimDialogList"),
    closeClaimDialogButton: document.getElementById("closeClaimDialogButton"),
    closeClaimDialogFooterButton: document.getElementById("closeClaimDialogFooterButton"),
    somedayDialog: document.getElementById("somedayDialog"),
    somedayDialogForm: document.getElementById("somedayDialogForm"),
    somedayDialogEyebrow: document.getElementById("somedayDialogEyebrow"),
    somedayDialogTitle: document.getElementById("somedayDialogTitle"),
    somedayDialogCopy: document.getElementById("somedayDialogCopy"),
    somedayDialogList: document.getElementById("somedayDialogList"),
    closeSomedayDialogButton: document.getElementById("closeSomedayDialogButton"),
    closeSomedayDialogFooterButton: document.getElementById("closeSomedayDialogFooterButton"),
    taskForm: document.getElementById("taskForm"),
    closeDialogButton: document.getElementById("closeDialogButton"),
    dialogEyebrow: document.getElementById("dialogEyebrow"),
    dialogTitle: document.getElementById("dialogTitle"),
    dialogPreviewLabel: document.getElementById("dialogPreviewLabel"),
    taskPreviewCard: document.getElementById("taskPreviewCard"),
    fieldTitleLabel: document.getElementById("fieldTitleLabel"),
    fieldIconLabel: document.getElementById("fieldIconLabel"),
    fieldCategoryLabel: document.getElementById("fieldCategoryLabel"),
    fieldOwnerLabel: document.getElementById("fieldOwnerLabel"),
    fieldResponsibleLabel: document.getElementById("fieldResponsibleLabel"),
    fieldDayLabel: document.getElementById("fieldDayLabel"),
    fieldTimeLabel: document.getElementById("fieldTimeLabel"),
    fieldEndTimeLabel: document.getElementById("fieldEndTimeLabel"),
    fieldRepeatLabel: document.getElementById("fieldRepeatLabel"),
    fieldIntervalLabel: document.getElementById("fieldIntervalLabel"),
    fieldWeekdayLabel: document.getElementById("fieldWeekdayLabel"),
    fieldEffortLabel: document.getElementById("fieldEffortLabel"),
    fieldClaimableLabel: document.getElementById("fieldClaimableLabel"),
    fieldSomedayLabel: document.getElementById("fieldSomedayLabel"),
    fieldNotesLabel: document.getElementById("fieldNotesLabel"),
    iconGrid: document.getElementById("iconGrid"),
    taskTitleInput: document.getElementById("taskTitleInput"),
    taskIconInput: document.getElementById("taskIconInput"),
    taskCategoryInput: document.getElementById("taskCategoryInput"),
    taskOwnerInput: document.getElementById("taskOwnerInput"),
    taskResponsibleInput: document.getElementById("taskResponsibleInput"),
    taskDayInput: document.getElementById("taskDayInput"),
    taskTimeInput: document.getElementById("taskTimeInput"),
    taskEndTimeInput: document.getElementById("taskEndTimeInput"),
    taskRecurrenceInput: document.getElementById("taskRecurrenceInput"),
    taskIntervalInput: document.getElementById("taskIntervalInput"),
    taskWeekdayInput: document.getElementById("taskWeekdayInput"),
    taskEffortInput: document.getElementById("taskEffortInput"),
    taskClaimableInput: document.getElementById("taskClaimableInput"),
    taskSomedayInput: document.getElementById("taskSomedayInput"),
    taskNotesInput: document.getElementById("taskNotesInput"),
    intervalField: document.getElementById("intervalField"),
    weekdayField: document.getElementById("weekdayField"),
    deleteTaskButton: document.getElementById("deleteTaskButton"),
    deleteSeriesButton: document.getElementById("deleteSeriesButton"),
    cancelTaskButton: document.getElementById("cancelTaskButton"),
    saveTaskButton: document.getElementById("saveTaskButton"),
    taskCardTemplate: document.getElementById("taskCardTemplate"),
  };
  let idleScrollTimer = null;

  hydrateRecurringTasks();
  registerServiceWorker();
  hydrateWeather();
  bindEvents();
  renderApp();
  resetIdleScrollTimer();
  setInterval(() => {
    renderApp();
  }, AUTO_REFRESH_MS);
  setInterval(() => {
    hydrateWeather();
  }, WEATHER_REFRESH_MS);
  if (!ui.headerClockTimer) {
    ui.headerClockTimer = window.setInterval(() => {
      updateHeaderClock();
    }, 1000);
  }

  function bindEvents() {
    const activityOptions = { passive: true, capture: true };
    document.addEventListener("pointerdown", resetIdleScrollTimer, activityOptions);
    document.addEventListener("keydown", resetIdleScrollTimer, true);
    document.addEventListener("scroll", resetIdleScrollTimer, activityOptions);
    document.addEventListener("touchstart", resetIdleScrollTimer, activityOptions);

    refs.quickAddButton.addEventListener("click", () => openTaskDialog());
    refs.toolDrawerToggle.addEventListener("click", () => {
      ui.drawerOpen = true;
      renderApp();
    });
    refs.toolDrawerClose.addEventListener("click", () => {
      ui.drawerOpen = false;
      renderApp();
    });
    refs.claimBellButton.addEventListener("click", () => openClaimDialog());
    refs.claimBellButton.addEventListener("dragover", handleDragOver);
    refs.claimBellButton.addEventListener("dragleave", handleDragLeave);
    refs.claimBellButton.addEventListener("drop", handleClaimBellDrop);
    refs.somedayButton.addEventListener("click", () => openSomedayDialog());
    refs.somedayButton.addEventListener("dragover", handleDragOver);
    refs.somedayButton.addEventListener("dragleave", handleDragLeave);
    refs.somedayButton.addEventListener("drop", handleSomedayDrop);
    document.addEventListener("pointerdown", (event) => {
      if (!ui.drawerOpen) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (refs.toolDrawer.contains(target) || refs.toolDrawerToggle.contains(target)) {
        return;
      }
      ui.drawerOpen = false;
      renderApp();
    });
    refs.showCompletedToggle.addEventListener("change", () => {
      state.settings.showCompleted = refs.showCompletedToggle.checked;
      saveState();
      renderApp();
    });
    refs.darkModeToggle.addEventListener("change", () => {
      state.settings.darkMode = refs.darkModeToggle.checked;
      saveState();
      renderApp();
    });
    refs.exportDataButton.addEventListener("click", exportBoardData);
    refs.importDataButton.addEventListener("click", () => refs.importDataInput.click());
    refs.importDataInput.addEventListener("change", importBoardData);
    refs.deleteDropZone.addEventListener("dragover", handleDragOver);
    refs.deleteDropZone.addEventListener("dragleave", handleDragLeave);
    refs.deleteDropZone.addEventListener("drop", (event) => {
      handleDragLeave(event);
      if (!ui.dragTaskId) {
        return;
      }
      deleteDraggedItem(ui.dragTaskId);
      hideDeleteDropZone();
      hideClaimDropZone();
      hideSomedayDropZone();
    });
    refs.claimDropZone.addEventListener("dragover", handleDragOver);
    refs.claimDropZone.addEventListener("dragleave", handleDragLeave);
    refs.claimDropZone.addEventListener("drop", (event) => {
      handleDragLeave(event);
      if (!ui.dragTaskId) {
        return;
      }
      handleClaimBellDrop(event);
      hideDeleteDropZone();
      hideClaimDropZone();
      hideSomedayDropZone();
    });
    refs.somedayDropZone.addEventListener("dragover", handleDragOver);
    refs.somedayDropZone.addEventListener("dragleave", handleDragLeave);
    refs.somedayDropZone.addEventListener("drop", (event) => {
      handleDragLeave(event);
      if (!ui.dragTaskId) {
        return;
      }
      handleSomedayDrop(event);
      hideDeleteDropZone();
      hideClaimDropZone();
      hideSomedayDropZone();
    });
    [
      refs.taskTitleInput,
      refs.taskCategoryInput,
      refs.taskOwnerInput,
      refs.taskResponsibleInput,
      refs.taskDayInput,
      refs.taskTimeInput,
      refs.taskEndTimeInput,
      refs.taskRecurrenceInput,
      refs.taskIntervalInput,
      refs.taskWeekdayInput,
      refs.taskEffortInput,
    ].forEach((element) => {
      element.addEventListener("input", renderTaskPreview);
      element.addEventListener("change", renderTaskPreview);
    });
    refs.saveTaskButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (!refs.taskForm.reportValidity()) {
        return;
      }
      handleTaskSubmit(event);
    });
    refs.taskTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        refs.taskTitleInput.blur();
      }
    });
    refs.closeDialogButton.addEventListener("click", closeDialog);
    refs.cancelTaskButton.addEventListener("click", closeDialog);
    refs.prevWeekButton.addEventListener("click", () => {
      state.settings.weekOffset -= 1;
      saveState();
      renderApp();
    });
    refs.todayButton.addEventListener("click", () => {
      state.settings.weekOffset = 0;
      ui.focusDateKey = formatDateKey(new Date());
      saveState();
      renderApp();
    });
    refs.nextWeekButton.addEventListener("click", () => {
      state.settings.weekOffset += 1;
      saveState();
      renderApp();
    });
    refs.weatherOverdueCard.addEventListener("click", (event) => {
      const button = event.target.closest("[data-jump-date]");
      if (!button) {
        return;
      }
      jumpToDate(button.dataset.jumpDate);
    });
    refs.fullscreenButton.addEventListener("click", toggleFullscreenMode);
    document.addEventListener("fullscreenchange", renderApp);
    refs.taskRecurrenceInput.addEventListener("change", syncDialogFields);
    refs.taskClaimableInput.addEventListener("change", () => {
      if (refs.taskClaimableInput.checked) {
        refs.taskSomedayInput.checked = false;
      }
      syncDialogFields();
    });
    refs.taskSomedayInput.addEventListener("change", () => {
      if (refs.taskSomedayInput.checked) {
        refs.taskClaimableInput.checked = false;
      }
      syncDialogFields();
    });
    refs.taskForm.addEventListener("submit", handleTaskSubmit);
    refs.deleteTaskButton.addEventListener("click", deleteEditingTask);
    refs.deleteSeriesButton.addEventListener("click", deleteEditingSeries);
    refs.closeParticipantDialogButton.addEventListener("click", closeParticipantDialog);
    refs.cancelParticipantButton.addEventListener("click", closeParticipantDialog);
    refs.participantForm.addEventListener("submit", handleParticipantSubmit);
    refs.closeClaimDialogButton.addEventListener("click", closeClaimDialog);
    refs.closeClaimDialogFooterButton.addEventListener("click", closeClaimDialog);
    refs.closeSomedayDialogButton.addEventListener("click", closeSomedayDialog);
    refs.closeSomedayDialogFooterButton.addEventListener("click", closeSomedayDialog);
  }

  function resetIdleScrollTimer() {
    if (idleScrollTimer) {
      clearTimeout(idleScrollTimer);
    }
    idleScrollTimer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, IDLE_SCROLL_TOP_MS);
  }

  function isFullscreenActive() {
    return Boolean(document.fullscreenElement);
  }

  async function toggleFullscreenMode() {
    try {
      if (isFullscreenActive()) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      // Ignore unsupported fullscreen requests on restrictive tablet browsers.
    } finally {
      renderApp();
    }
  }

  function renderApp() {
    const t = currentMessages();
    const effectiveDarkMode = shouldUseDarkMode();
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
    refs.backupHeading.textContent = t.backupHeading;
    refs.exportDataButton.textContent = t.exportData;
    refs.importDataButton.textContent = t.importData;
    refs.toolDrawerTitle.textContent = "Tools";
    refs.showCompletedLabel.textContent = "Show completed";
    refs.showCompletedToggle.checked = Boolean(state.settings.showCompleted);
    refs.darkModeLabel.textContent = state.settings.language === "fi" ? "Tumma tila" : state.settings.language === "de" ? "Dunkelmodus" : "Dark mode";
    refs.darkModeToggle.checked = Boolean(state.settings.darkMode);
    refs.toolDrawer.classList.toggle("open", ui.drawerOpen);
    refs.deleteDropZoneLabel.textContent = t.deleteFromPlan;
    refs.deleteDropZone.classList.toggle("visible", shouldShowDeleteDropZone());
    refs.claimDropZoneLabel.textContent = t.sendToClaimInbox;
    refs.claimDropZone.classList.toggle("visible", shouldShowDeleteDropZone());
    refs.somedayDropZoneLabel.textContent = t.sendToSomeday;
    refs.somedayDropZone.classList.toggle("visible", shouldShowDeleteDropZone());
    refs.claimBellText.textContent = t.openClaimTasks.replace("{count}", String(state.claimPool.length));
    refs.claimBellButton.setAttribute("aria-label", t.openClaimTasks.replace("{count}", String(state.claimPool.length)));
    refs.claimBellCount.textContent = state.claimPool.length ? String(state.claimPool.length) : "";
    refs.claimBellButton.classList.toggle("has-items", state.claimPool.length > 0);
    refs.claimBellButton.classList.toggle("ringing", state.claimPool.length > 0);
    refs.somedayText.textContent = t.openSomedayTasks.replace("{count}", String(state.somedayPool.length));
    refs.somedayButton.setAttribute("aria-label", t.openSomedayTasks.replace("{count}", String(state.somedayPool.length)));
    refs.somedayButton.title = t.openSomedayTasks.replace("{count}", String(state.somedayPool.length));
    refs.somedayCount.textContent = state.somedayPool.length ? String(state.somedayPool.length) : "";
    refs.somedayButton.classList.toggle("has-items", state.somedayPool.length > 0);
    document.body.dataset.theme = effectiveDarkMode ? "dark" : "light";
    refs.prevWeekButton.textContent = t.prevWeek;
    refs.todayButton.textContent = t.today;
    refs.nextWeekButton.textContent = t.nextWeek;
    refs.fullscreenButton.textContent = isFullscreenActive() ? "⤡" : "⤢";
    refs.fullscreenButton.setAttribute("aria-label", isFullscreenActive() ? t.exitFullscreen : t.fullscreen);
    refs.fullscreenButton.title = isFullscreenActive() ? t.exitFullscreen : t.fullscreen;
    fillDialogLabels();
    renderLanguageToggle();
    state.settings.activeFilter = "all";
    state.settings.boardDensity = BOARD_DENSITY.everyone;
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
      renderWeatherRanking();
      return;
    }

    if (weather.status === "error") {
      refs.weatherTemp.textContent = "--°";
      refs.weatherCondition.textContent = t.weatherUnavailable;
      refs.weatherPlace.textContent = weather.place || t.weatherFallback;
      refs.weatherDetails.textContent = "";
      renderWeatherRanking();
      return;
    }

    refs.weatherTemp.textContent = `${Math.round(weather.temperature)}°`;
    refs.weatherCondition.textContent = localizeWeatherCondition(weather.condition);
    refs.weatherPlace.textContent = weather.place;
    refs.weatherDetails.textContent = weather.wind ? `🌬 ${formatWindMetersPerSecond(weather.wind)} m/s` : "";
    renderWeatherRanking();
  }

  function localizeWeatherCondition(condition) {
    const label = String(condition || "");
    const map = {
      en: {
        Sunny: "Sunny",
        "Clear night": "Clear night",
        "Partly cloudy": "Partly cloudy",
        Cloudy: "Cloudy",
        Fog: "Fog",
        Rain: "Rain",
        Snow: "Snow",
        Storm: "Storm",
        Fair: "Fair",
        Night: "Night",
      },
      fi: {
        Sunny: "Aurinkoista",
        "Clear night": "Selkeä yö",
        "Partly cloudy": "Puolipilvistä",
        Cloudy: "Pilvistä",
        Fog: "Sumua",
        Rain: "Sadetta",
        Snow: "Lunta",
        Storm: "Myrskyä",
        Fair: "Selkeää",
        Night: "Yö",
      },
      de: {
        Sunny: "Sonnig",
        "Clear night": "Klare Nacht",
        "Partly cloudy": "Teilweise bewölkt",
        Cloudy: "Bewölkt",
        Fog: "Nebel",
        Rain: "Regen",
        Snow: "Schnee",
        Storm: "Sturm",
        Fair: "Heiter",
        Night: "Nacht",
      },
    };
    return map[state.settings.language]?.[label] || label;
  }

  function formatWindMetersPerSecond(windSpeedKmh) {
    return (Number(windSpeedKmh || 0) / 3.6).toFixed(1);
  }

  function renderWeatherRanking() {
    const t = currentMessages();
    const now = new Date();
    const localeMap = {
      en: "en-GB",
      fi: "fi-FI",
      de: "de-DE",
    };
    const locale = localeMap[state.settings.language] || "en-GB";
    const timeLabel = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
    const dateLabel = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(now);
    const weekLabel = t.currentWeek.replace("{weekNumber}", String(getWeekNumber(startOfDay(now))));
    const completedToday = countCompletedToday();
    const totalToday = countTasksForDate(formatDateKey(startOfDay(now)));
    const todayRatio = totalToday > 0 ? completedToday / totalToday : 0;
    const todayProgressColor = getCompletionProgressColor(todayRatio);
    const completedThisWeek = countCompletedThisWeek(now);
    const bestWeek = getBestCompletedWeek();
    const overdueItems = getHeaderOverdueItems().slice(0, 2);
    if (ui.progressGardenFrame) {
      cancelAnimationFrame(ui.progressGardenFrame);
      ui.progressGardenFrame = null;
    }
    refs.weatherMidCard.innerHTML = `
      <div class="weather-mid-label">${t.tasksDoneToday}</div>
      <div class="weather-mid-value" style="--progress-color: ${todayProgressColor}">${completedToday}<span class="weather-mid-total">/${totalToday}</span></div>
      <div class="weather-mid-weekline">${t.doneThisWeek}: <strong>${completedThisWeek}</strong></div>
      <div class="weather-mid-record">${t.bestWeek}: <strong>${bestWeek ? `${bestWeek.label} · ${bestWeek.count}` : t.noBestWeek}</strong></div>
    `;
    refs.weatherOverdueCard.innerHTML = `
      <div class="weather-overdue-title">${t.overdueTasks}</div>
      <div class="weather-overdue-list">
        ${overdueItems.length
          ? overdueItems
              .map(
                (item) => `
                  <div class="weather-overdue-item">
                    <div class="weather-overdue-copy">
                      <span class="weather-overdue-icon">${item.task.icon || "•"}</span>
                      <span class="weather-overdue-name">${escapeHtml(item.task.title)}</span>
                    </div>
                    <button class="ghost-button weather-overdue-go" type="button" data-jump-date="${item.dateKey}">
                      ${t.goToTask}
                    </button>
                  </div>
                `
              )
              .join("")
          : `<div class="weather-overdue-empty">${t.noOverdueTasks}</div>`}
      </div>
    `;
    refs.weatherOverdueCard.classList.toggle("is-empty", overdueItems.length === 0);
    refs.weatherRanking.innerHTML = `
      <div class="weather-info-card">
        <div class="weather-clock-row">
          ${buildOrbitClockMarkup()}
          <div class="weather-clock-copy">
            <div class="weather-clock-date">${dateLabel}</div>
            <div class="weather-clock-week">${weekLabel}</div>
          </div>
        </div>
      </div>
    `;
    updateHeaderClock(now);
  }

  function buildOrbitClockMarkup() {
    return `
      <div class="orbit-clock" aria-hidden="true">
        <div class="orbit-hour-value">00</div>
        <div class="orbit-minute-value">00</div>
      </div>
    `;
  }

  function updateHeaderClock(now = new Date()) {
    const root = refs.weatherRanking?.querySelector(".orbit-clock");
    if (!root) {
      return;
    }
    const minuteValue = root.querySelector(".orbit-minute-value");
    const hourValue = root.querySelector(".orbit-hour-value");
    if (!(minuteValue && hourValue)) {
      return;
    }
    const minutes = now.getMinutes();
    const hours = now.getHours();
    hourValue.textContent = String(hours).padStart(2, "0");
    minuteValue.textContent = String(minutes).padStart(2, "0");
  }

  function getHeaderOverdueItems() {
    const today = startOfDay(new Date());
    const lookbackStart = addDays(today, -120);
    return state.tasks
      .flatMap((task) => {
        if (task.recurrence === "none") {
          return [buildBoardItem(task, task.dueDate)];
        }
        const taskStart = parseDateKey(task.dueDate);
        const rangeStart = taskStart > lookbackStart ? taskStart : lookbackStart;
        return getBoardItemsForTask(task, rangeStart, today);
      })
      .filter(isItemOverdue)
      .sort((left, right) => parseDateKey(left.dateKey) - parseDateKey(right.dateKey) || left.task.title.localeCompare(right.task.title));
  }

  function jumpToDate(dateKey) {
    const targetDate = parseDateKey(dateKey);
    if (Number.isNaN(targetDate.getTime())) {
      return;
    }
    const currentWeekStart = startOfWeek(new Date());
    const targetWeekStart = startOfWeek(targetDate);
    const diffDays = Math.round((targetWeekStart - currentWeekStart) / 86400000);
    state.settings.weekOffset = Math.round(diffDays / 7);
    ui.focusDateKey = formatDateKey(targetDate);
    saveState();
    renderApp();
  }

  function createSeededRandom(seed) {
    let value = seed >>> 0;
    return function nextRandom() {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function buildBouquetMarkup(progress, totalDone, allDoneToday) {
      const userIds = progress.flatMap((entry) => Array.from({ length: entry.count }, () => entry.user.id));
      const visible = buildBouquetFieldLayout(userIds, allDoneToday);
      const defs = visible
        .map((flower) => buildBouquetFlowerDefs(flower))
        .join("");
    const blooms = visible
      .slice()
      .sort((left, right) => left.layer - right.layer)
      .map((flower) => buildBouquetFlower(flower))
      .join("");
    const sparkleMarkup = allDoneToday
      ? Array.from({ length: 8 }, (_, index) => {
          const x = 74 + (index * 29) % 220;
          const y = 22 + (index * 13) % 42;
          return `<circle class="bouquet-sparkle" style="--delay:${index * 0.18}s" cx="${x}" cy="${y}" r="${index % 2 === 0 ? 2.2 : 1.6}" />`;
        }).join("")
      : "";
      return `
        <svg class="bouquet-scene" viewBox="0 0 360 180" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="bouquetBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fff8fb" />
              <stop offset="38%" stop-color="#f7eff7" />
              <stop offset="72%" stop-color="#edf5f1" />
              <stop offset="100%" stop-color="#e6f0e8" />
            </linearGradient>
            <radialGradient id="bouquetSunwash" cx="50%" cy="10%" r="82%">
              <stop offset="0%" stop-color="${colorWithAlpha("#ffffff", 0.88)}" />
              <stop offset="48%" stop-color="${colorWithAlpha("#fff7df", 0.34)}" />
              <stop offset="100%" stop-color="${colorWithAlpha("#ffffff", 0)}" />
            </radialGradient>
            <radialGradient id="bouquetGlowLeft" cx="18%" cy="18%" r="60%">
              <stop offset="0%" stop-color="${colorWithAlpha("#f2cfe7", 0.92)}" />
              <stop offset="56%" stop-color="${colorWithAlpha("#f2cfe7", 0.16)}" />
              <stop offset="100%" stop-color="${colorWithAlpha("#f2cfe7", 0)}" />
            </radialGradient>
            <radialGradient id="bouquetGlowRight" cx="82%" cy="20%" r="58%">
              <stop offset="0%" stop-color="${colorWithAlpha("#d5ecf6", 0.9)}" />
              <stop offset="56%" stop-color="${colorWithAlpha("#d5ecf6", 0.16)}" />
              <stop offset="100%" stop-color="${colorWithAlpha("#d5ecf6", 0)}" />
            </radialGradient>
            <linearGradient id="bouquetMist" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${colorWithAlpha("#ffffff", 0.12)}" />
              <stop offset="50%" stop-color="${colorWithAlpha("#ffffff", 0.22)}" />
              <stop offset="100%" stop-color="${colorWithAlpha("#ffffff", 0.1)}" />
            </linearGradient>
            <linearGradient id="bouquetHillBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${colorWithAlpha("#d2e3d2", 0.72)}" />
              <stop offset="100%" stop-color="${colorWithAlpha("#aec6ab", 0.7)}" />
            </linearGradient>
            <linearGradient id="bouquetHillFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${colorWithAlpha("#c1d8bf", 0.82)}" />
              <stop offset="100%" stop-color="${colorWithAlpha("#8fb28d", 0.88)}" />
            </linearGradient>
            <radialGradient id="bouquetGlow" cx="50%" cy="42%" r="58%">
              <stop offset="0%" stop-color="${colorWithAlpha("#ffffff", 0.82)}" />
              <stop offset="100%" stop-color="${colorWithAlpha("#ffffff", 0)}" />
            </radialGradient>
            <linearGradient id="bouquetVeil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${colorWithAlpha("#ffffff", 0.26)}" />
              <stop offset="100%" stop-color="${colorWithAlpha("#ffffff", 0)}" />
            </linearGradient>
            <filter id="bouquetBlur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <filter id="bouquetSoftBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <filter id="bouquetShadow" x="-30%" y="-30%" width="160%" height="170%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(79, 101, 83, 0.18)" />
            </filter>
            ${defs}
          </defs>
          <rect width="360" height="180" fill="url(#bouquetBg)" />
          <rect width="360" height="180" fill="url(#bouquetSunwash)" />
          <rect width="360" height="180" fill="url(#bouquetGlowLeft)" />
          <rect width="360" height="180" fill="url(#bouquetGlowRight)" />
          <ellipse cx="180" cy="30" rx="164" ry="36" fill="${colorWithAlpha("#ffffff", 0.54)}" filter="url(#bouquetBlur)" />
          <ellipse cx="86" cy="46" rx="74" ry="28" fill="${colorWithAlpha("#f0f6e9", 0.38)}" filter="url(#bouquetBlur)" />
          <ellipse cx="282" cy="56" rx="70" ry="30" fill="${colorWithAlpha("#efe3f6", 0.34)}" filter="url(#bouquetBlur)" />
          <path d="M0 142 C54 110 104 104 154 114 C212 126 272 118 360 92 L360 180 L0 180 Z" fill="url(#bouquetHillBack)" />
          <path d="M0 158 C70 132 118 126 178 132 C240 138 294 126 360 108 L360 180 L0 180 Z" fill="url(#bouquetHillFront)" />
          <path d="M0 128 C62 118 126 122 182 114 C244 106 298 92 360 98" fill="none" stroke="${colorWithAlpha("#f7fbf3", 0.46)}" stroke-width="2.8" stroke-linecap="round" />
          <ellipse cx="182" cy="84" rx="110" ry="52" fill="url(#bouquetGlow)" />
          <g class="bouquet-wallpaper" opacity="0.34">
            <path d="M24 118 C64 84 110 66 152 50" />
            <path d="M54 144 C94 110 136 84 182 62" />
            <path d="M118 154 C150 120 184 96 220 72" />
            <path d="M338 114 C296 82 252 64 206 48" />
            <path d="M308 142 C268 108 226 84 180 62" />
            <path d="M244 154 C214 120 182 96 144 70" />
          </g>
          <g class="bouquet-bokeh">
            <circle cx="54" cy="34" r="8" fill="${colorWithAlpha("#ffffff", 0.34)}" />
            <circle cx="104" cy="24" r="5" fill="${colorWithAlpha("#fff4d6", 0.24)}" />
            <circle cx="250" cy="34" r="7" fill="${colorWithAlpha("#f7dff0", 0.26)}" />
            <circle cx="318" cy="28" r="5" fill="${colorWithAlpha("#dff0f7", 0.26)}" />
          </g>
          <rect y="114" width="360" height="26" fill="url(#bouquetMist)" opacity="0.5" />
          <rect width="360" height="180" fill="url(#bouquetVeil)" />
          ${blooms || buildBouquetSprout()}
          ${sparkleMarkup}
        </svg>
      `;
    }

    function buildBouquetFieldLayout(userIds, allDoneToday) {
      const sourceIds = userIds.length ? userIds.slice() : [];
      const targetCount = allDoneToday ? Math.max(18, sourceIds.length + 8) : Math.min(Math.max(sourceIds.length, 1), 12);
      const flowerIds = [];
      for (let index = 0; index < targetCount; index += 1) {
        if (sourceIds.length) {
          flowerIds.push(sourceIds[index % sourceIds.length]);
        } else {
          flowerIds.push(null);
        }
      }
      const seeded = createSeededRandom(907 + sourceIds.join("").length * 17 + flowerIds.length * 13 + (allDoneToday ? 401 : 0));
      const rows = allDoneToday
        ? [
            { count: 7, yMin: 134, yMax: 146, scaleMin: 0.98, scaleMax: 1.2, rootYOffset: 26, spread: 320, types: ["rosette", "rosette", "daisy", "tulip"] },
            { count: 6, yMin: 106, yMax: 126, scaleMin: 0.78, scaleMax: 0.98, rootYOffset: 34, spread: 292, types: ["daisy", "star", "tulip", "rosette"] },
            { count: 5, yMin: 78, yMax: 104, scaleMin: 0.58, scaleMax: 0.76, rootYOffset: 42, spread: 262, types: ["star", "tulip", "daisy"] },
          ]
        : [
            { count: Math.min(4, flowerIds.length), yMin: 128, yMax: 142, scaleMin: 0.96, scaleMax: 1.16, rootYOffset: 26, spread: 280, types: ["rosette", "daisy", "tulip"] },
            { count: Math.min(4, Math.max(flowerIds.length - 4, 0)), yMin: 100, yMax: 122, scaleMin: 0.74, scaleMax: 0.94, rootYOffset: 34, spread: 246, types: ["daisy", "star", "tulip"] },
            { count: Math.min(4, Math.max(flowerIds.length - 8, 0)), yMin: 72, yMax: 98, scaleMin: 0.54, scaleMax: 0.72, rootYOffset: 42, spread: 218, types: ["star", "tulip"] },
          ];
      const layout = [];
      let flowerIndex = 0;
      rows.forEach((row, rowIndex) => {
        for (let rowSlot = 0; rowSlot < row.count && flowerIndex < flowerIds.length; rowSlot += 1) {
          const t = row.count === 1 ? 0.5 : rowSlot / (row.count - 1);
          const baseX = 180 - (row.spread / 2) + (row.spread * t);
          const x = clamp(baseX + (seeded() - 0.5) * 28, 34, 326);
          const y = row.yMin + (row.yMax - row.yMin) * seeded();
          const scale = row.scaleMin + (row.scaleMax - row.scaleMin) * seeded();
          const rootX = clamp(x + (seeded() - 0.5) * 36, 26, 334);
          const rootY = Math.min(178, y + row.rootYOffset + seeded() * 6);
          const stemCurve = (rootX - x) * (0.92 + seeded() * 0.45);
          layout.push({
            userId: flowerIds[flowerIndex],
            index: flowerIndex,
            x,
            y,
            scale,
            rootX,
            rootY,
            stemCurve,
            type: row.types[(flowerIndex + rowIndex) % row.types.length],
            layer: rowIndex + 1,
          });
          flowerIndex += 1;
        }
      });
      return layout
        .sort((left, right) => left.layer - right.layer || left.y - right.y)
        .map((flower, index) => ({ ...flower, index }));
    }

  function buildBouquetFlowerDefs(flower) {
    const base = colorForUser(flower.userId);
    const light = shadeHexColor(base, 0.42);
    const dark = shadeHexColor(base, -0.26);
    return `
      <radialGradient id="flowerGrad-${flower.index}" cx="34%" cy="28%" r="80%">
        <stop offset="0%" stop-color="${light}" />
        <stop offset="48%" stop-color="${base}" />
        <stop offset="100%" stop-color="${dark}" />
      </radialGradient>
      <radialGradient id="flowerGlow-${flower.index}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${colorWithAlpha(light, 0.42)}" />
        <stop offset="100%" stop-color="${colorWithAlpha(base, 0)}" />
      </radialGradient>
    `;
  }

    function buildBouquetFlower(flower) {
      const stemStartX = flower.rootX ?? (180 + flower.stemCurve * 0.1);
      const stemStartY = flower.rootY ?? 182;
      const stemPath = `M ${stemStartX} ${stemStartY} C ${stemStartX + flower.stemCurve * 0.18} ${stemStartY - 24}, ${flower.x + flower.stemCurve * 0.34} ${flower.y + 42}, ${flower.x} ${flower.y + 10}`;
      const petalFill = `url(#flowerGrad-${flower.index})`;
      const glowFill = `url(#flowerGlow-${flower.index})`;
      const rotation = (flower.index % 2 === 0 ? -4 : 4);
      const leafLeft = `<ellipse class="bouquet-leaf" cx="${flower.x - 12}" cy="${flower.y + 34}" rx="12" ry="5" transform="rotate(-28 ${flower.x - 12} ${flower.y + 34})" />`;
      const leafRight = `<ellipse class="bouquet-leaf" cx="${flower.x + 10}" cy="${flower.y + 42}" rx="10" ry="4.5" transform="rotate(28 ${flower.x + 10} ${flower.y + 42})" />`;
    return `
      <g class="bouquet-flower type-${flower.type}" style="--delay:${flower.index * 0.18}s">
        <path class="bouquet-stem" d="${stemPath}" />
        ${leafLeft}
        ${leafRight}
        <g transform="translate(${flower.x} ${flower.y})">
          <g class="bouquet-bloom" transform="rotate(${rotation}) scale(${flower.scale})" filter="url(#bouquetShadow)">
            <circle class="bouquet-halo" r="30" fill="${glowFill}" />
            ${buildBouquetBloomShape(flower.type, petalFill)}
          </g>
        </g>
      </g>
    `;
  }

  function buildBouquetBloomShape(type, fill) {
    if (type === "tulip") {
      return `
        <g class="bouquet-bloom-shape">
          <path d="M -14 12 C -16 -8 -8 -22 0 -26 C 8 -22 16 -8 14 12 C 10 6 6 2 0 0 C -6 2 -10 6 -14 12 Z" fill="${fill}" />
          <path d="M -2 0 C -2 -12 4 -24 12 -28 C 12 -10 12 2 8 12 Z" fill="${colorWithAlpha("#ffffff", 0.18)}" />
          <circle class="bouquet-core" r="5.6" cy="1" />
        </g>
      `;
    }
    if (type === "daisy") {
      return `
        <g class="bouquet-bloom-shape">
          ${Array.from({ length: 12 }, (_, index) => {
            const angle = (360 / 12) * index;
            return `<ellipse rx="5.2" ry="13.8" fill="${fill}" transform="rotate(${angle}) translate(0 -16)" />`;
          }).join("")}
          <circle class="bouquet-core" r="8.4" />
        </g>
      `;
    }
    if (type === "star") {
      return `
        <g class="bouquet-bloom-shape">
          ${Array.from({ length: 7 }, (_, index) => {
            const angle = (360 / 7) * index;
            return `<ellipse rx="6.2" ry="16" fill="${fill}" transform="rotate(${angle}) translate(0 -15)" />`;
          }).join("")}
          <circle class="bouquet-core" r="7.2" />
        </g>
      `;
    }
    return `
      <g class="bouquet-bloom-shape">
        ${Array.from({ length: 10 }, (_, index) => {
          const angle = (360 / 10) * index;
          return `<ellipse rx="8" ry="18" fill="${fill}" transform="rotate(${angle}) translate(0 -15)" />`;
        }).join("")}
        ${Array.from({ length: 7 }, (_, index) => {
          const angle = (360 / 7) * index + 10;
          return `<ellipse rx="6" ry="12" fill="${fill}" transform="rotate(${angle}) translate(0 -9)" opacity="0.86" />`;
        }).join("")}
        <circle class="bouquet-core" r="7" />
      </g>
    `;
  }

    function buildBouquetSprout() {
    return `
      <g class="bouquet-sprout">
        <path class="bouquet-stem" d="M 180 182 C 176 154, 178 132, 180 114" />
        <ellipse class="bouquet-leaf" cx="170" cy="118" rx="12" ry="5" transform="rotate(-28 170 118)" />
        <ellipse class="bouquet-leaf" cx="190" cy="116" rx="12" ry="5" transform="rotate(28 190 116)" />
        <circle class="bouquet-core" cx="180" cy="108" r="8" />
      </g>
    `;
  }

  function startFlowerFieldScene(canvas, progress, totalDone, allDoneToday) {
    if (ui.progressGardenFrame) {
      cancelAnimationFrame(ui.progressGardenFrame);
      ui.progressGardenFrame = null;
    }

    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let flowers = [];
    const darkMode = document.body.dataset.theme === "dark";
    const palette = darkMode
      ? {
          skyTop: "#243039",
          skyBottom: "#1d262d",
          haze: "rgba(212, 228, 236, 0.08)",
          glow: "rgba(255,255,255,0.1)",
          stem: "rgba(124, 182, 120, 0.96)",
          leaf: "rgba(100, 148, 95, 0.96)",
          center: "#f0cf72",
          sprout: "#9cd38e",
          soil: "rgba(28, 35, 30, 0.62)",
        }
      : {
          skyTop: "#eef4f7",
          skyBottom: "#e9f1eb",
          haze: "rgba(145, 176, 154, 0.09)",
          glow: "rgba(255,255,255,0.22)",
          stem: "rgba(88, 141, 86, 0.96)",
          leaf: "rgba(104, 154, 89, 0.95)",
          center: "#f7d45a",
          sprout: "#7fc874",
          soil: "rgba(96, 118, 89, 0.12)",
        };

    const resize = () => {
      const nextWidth = Math.max(220, Math.round(canvas.clientWidth || 360));
      const nextHeight = Math.max(92, Math.round(canvas.clientHeight || 118));
      if (nextWidth === width && nextHeight === height) {
        return;
      }
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      flowers = buildFlowerFieldLayout(progress, totalDone, width, height, allDoneToday);
    };

    const drawFlower = (flower, timeSeconds) => {
      const sway = Math.sin(timeSeconds * 1.8 + flower.phase) * flower.sway;
      const bloomX = flower.x + sway;
      const bloomY = flower.y;
      const stemBaseX = flower.baseX ?? flower.x;
      const stemBaseY = flower.baseY ?? (height + 6);
      context.strokeStyle = palette.stem;
      context.lineWidth = flower.size <= 11 ? 2 : 2.6;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(stemBaseX, stemBaseY);
      context.quadraticCurveTo(stemBaseX + sway * 0.8, bloomY + 18, bloomX, bloomY + 5);
      context.stroke();

      context.fillStyle = palette.leaf;
      context.beginPath();
      context.ellipse(flower.x - 5, bloomY + 18, 6, 3, -0.6, 0, Math.PI * 2);
      context.ellipse(flower.x + 5, bloomY + 20, 6, 3, 0.6, 0, Math.PI * 2);
      context.fill();

      const glow = context.createRadialGradient(bloomX, bloomY, 0, bloomX, bloomY, flower.size * 1.6);
      glow.addColorStop(0, colorWithAlpha(flower.color, 0.18));
      glow.addColorStop(1, colorWithAlpha(flower.color, 0));
      context.fillStyle = glow;
      context.beginPath();
      context.arc(bloomX, bloomY, flower.size * 1.6, 0, Math.PI * 2);
      context.fill();

      const petalLayers = [
        { petals: 8, radius: flower.size * 0.82, size: flower.size * 0.34, alpha: 0.96 },
        { petals: 7, radius: flower.size * 0.46, size: flower.size * 0.24, alpha: 0.74 },
      ];
      petalLayers.forEach((layer, layerIndex) => {
        for (let index = 0; index < layer.petals; index += 1) {
          const angle = (Math.PI * 2 * index) / layer.petals + timeSeconds * (0.1 + layerIndex * 0.02) + flower.phase * (1 + layerIndex * 0.16);
          const petalX = bloomX + Math.cos(angle) * layer.radius;
          const petalY = bloomY + Math.sin(angle) * layer.radius;
          const petal = context.createRadialGradient(
            petalX - layer.size * 0.2,
            petalY - layer.size * 0.2,
            0,
            petalX,
            petalY,
            layer.size * 1.35
          );
          petal.addColorStop(0, colorWithAlpha("#ffffff", 0.6 * layer.alpha));
          petal.addColorStop(0.28, colorWithAlpha(flower.color, layer.alpha));
          petal.addColorStop(1, colorWithAlpha(shadeHexColor(flower.color, -0.18), layer.alpha));
          context.fillStyle = petal;
          context.beginPath();
          context.ellipse(
            petalX,
            petalY,
            layer.size * 0.92,
            layer.size * 0.62,
            angle,
            0,
            Math.PI * 2
          );
          context.fill();
        }
      });

      const crown = context.createRadialGradient(bloomX, bloomY, 0, bloomX, bloomY, flower.size * 0.85);
      crown.addColorStop(0, "#fff7cf");
      crown.addColorStop(0.46, palette.center);
      crown.addColorStop(1, "#d9a941");
      context.fillStyle = crown;
      context.beginPath();
      context.arc(bloomX, bloomY, flower.size * 0.38, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = colorWithAlpha("#fffbe2", 0.8);
      context.beginPath();
      context.arc(bloomX - flower.size * 0.1, bloomY - flower.size * 0.12, flower.size * 0.12, 0, Math.PI * 2);
      context.fill();
    };

    const draw = (timestamp) => {
      if (!document.body.contains(canvas)) {
        ui.progressGardenFrame = null;
        return;
      }
      resize();
      const timeSeconds = timestamp / 1000;
      context.clearRect(0, 0, width, height);

      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, palette.skyTop);
      sky.addColorStop(1, palette.skyBottom);
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      for (let index = 0; index < 5; index += 1) {
        const x = width * (0.16 + index * 0.18);
        const y = height * (0.22 + (index % 2) * 0.08);
        const r = 16 + (index % 3) * 8;
        context.fillStyle = palette.haze;
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2);
        context.fill();
      }

      if (!flowers.length) {
        const sproutX = width / 2;
        const sproutY = height * 0.78;
        context.strokeStyle = palette.stem;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(sproutX, sproutY + 12);
        context.quadraticCurveTo(sproutX - 4, sproutY - 10, sproutX, sproutY - 22);
        context.stroke();
        context.fillStyle = palette.sprout;
        context.beginPath();
        context.ellipse(sproutX - 7, sproutY - 23, 8, 4, -0.7, 0, Math.PI * 2);
        context.ellipse(sproutX + 7, sproutY - 23, 8, 4, 0.7, 0, Math.PI * 2);
        context.fill();
      } else {
        flowers
          .slice()
          .sort((left, right) => left.y - right.y)
          .forEach((flower) => drawFlower(flower, timeSeconds));
      }

      const foregroundShade = context.createLinearGradient(0, height * 0.72, 0, height);
      foregroundShade.addColorStop(0, colorWithAlpha(palette.soil, 0));
      foregroundShade.addColorStop(1, palette.soil);
      context.fillStyle = foregroundShade;
      context.fillRect(0, height * 0.72, width, height * 0.28);

      ui.progressGardenFrame = requestAnimationFrame(draw);
    };

    ui.progressGardenFrame = requestAnimationFrame(draw);
  }

  function buildFlowerFieldLayout(progress, totalDone, width, height, allDoneToday) {
    const flowerOwners = [];
    progress.forEach((entry) => {
      for (let index = 0; index < entry.count; index += 1) {
        flowerOwners.push(entry.user.id);
      }
    });
    if (!flowerOwners.length) {
      return [];
    }
    const visibleOwners = flowerOwners.slice(0, 18);
    if (!allDoneToday && visibleOwners.length === 1) {
      return [
        {
          x: width * 0.5,
          y: height * 0.44,
          size: Math.min(width, height) * 0.24,
          sway: 1.1,
          phase: 0.4,
          color: colorForUser(visibleOwners[0]),
          baseX: width * 0.5,
          baseY: height * 0.96,
        },
      ];
    }
    if (!allDoneToday && visibleOwners.length === 2) {
      return visibleOwners.map((userId, index) => ({
        x: width * (index === 0 ? 0.4 : 0.63),
        y: height * (index === 0 ? 0.5 : 0.46),
        size: Math.min(width, height) * (index === 0 ? 0.2 : 0.17),
        sway: 1.2 + index * 0.18,
        phase: 0.9 + index,
        color: colorForUser(userId),
        baseX: width * (index === 0 ? 0.43 : 0.6),
        baseY: height * 0.98,
      }));
    }
    if (!allDoneToday && visibleOwners.length <= 4) {
      return visibleOwners.map((userId, index) => {
        const spread = [0.24, 0.46, 0.63, 0.81];
        return {
          x: width * spread[index],
          y: height * (0.6 - (index % 2) * 0.08 - Math.floor(index / 2) * 0.04),
          size: Math.min(width, height) * (0.16 - index * 0.008),
          sway: 1.2 + index * 0.16,
          phase: 0.5 + index * 0.9,
          color: colorForUser(userId),
          baseX: width * (0.3 + index * 0.14),
          baseY: height * 0.99,
        };
      });
    }
    if (!allDoneToday && visibleOwners.length <= 7) {
      return visibleOwners.map((userId, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const xSlots = [0.22, 0.5, 0.78];
        return {
          x: width * xSlots[col] + (row % 2 === 1 ? 8 : 0),
          y: height * (0.66 - row * 0.14 - (col === 1 ? 0.05 : 0)),
          size: Math.min(width, height) * (0.12 - row * 0.012),
          sway: 1.2 + index * 0.12,
          phase: 0.3 + index * 0.8,
          color: colorForUser(userId),
          baseX: width * (0.26 + col * 0.18 + row * 0.06),
          baseY: height * 0.99,
        };
      });
    }
    const depthRows = allDoneToday ? 4 : 3;
    return visibleOwners.map((userId, index) => {
      const hash = seededUnit(index + userId.length * 17);
      const row = index % depthRows;
      const depth = row / Math.max(1, depthRows - 1);
      const xBandStart = 30 + depth * 24;
      const xBandEnd = width - 30 - depth * 24;
      const clusterWidth = Math.max(40, xBandEnd - xBandStart);
      const clusterCenter = xBandStart + clusterWidth * seededUnit(index * 3.17 + 9);
      const swayOffset = (hash - 0.5) * (18 - depth * 6);
      const rowWave = Math.sin(index * 0.9) * 7;
      const x = Math.min(width - 24, Math.max(24, clusterCenter + swayOffset + rowWave));
      const yBase = height * (0.7 - depth * 0.18);
      const y = Math.max(20, yBase - hash * (12 - depth * 5));
      const size = Math.max(9, 16 - depth * 4 + (hash - 0.5) * 1.6);
      return {
        x,
        y,
        size,
        sway: 1.1 + (1 - depth) * 1.2 + hash * 0.5,
        phase: hash * Math.PI * 2,
        color: colorForUser(userId),
        baseX: width * (0.18 + seededUnit(index * 2.71 + 4) * 0.64),
        baseY: height * (0.99 - depth * 0.03),
      };
    });
  }

  function seededUnit(seed) {
    const value = Math.sin(seed * 127.1) * 43758.5453123;
    return value - Math.floor(value);
  }

  function colorWithAlpha(hex, alpha) {
    const value = hex.replace("#", "");
    const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
    const channel = (index) => Number.parseInt(normalized.slice(index, index + 2), 16);
    return `rgba(${channel(0)}, ${channel(2)}, ${channel(4)}, ${alpha})`;
  }

  function shadeHexColor(hex, amount) {
    const value = hex.replace("#", "");
    const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
    const apply = (index) => {
      const base = Number.parseInt(normalized.slice(index, index + 2), 16);
      const next = amount >= 0 ? base + (255 - base) * amount : base * (1 + amount);
      return Math.max(0, Math.min(255, Math.round(next)));
    };
    return `#${[0, 2, 4].map((index) => apply(index).toString(16).padStart(2, "0")).join("")}`;
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
      button.dataset.lang = language.id;
      button.setAttribute("aria-label", language.short);
      button.title = language.short;
      button.innerHTML = `<span class="sr-only">${language.short}</span>`;
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
      if (isFocused) {
        let touchStartX = 0;
        let touchStartY = 0;
        column.addEventListener(
          "touchstart",
          (event) => {
            const touch = event.changedTouches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
          },
          { passive: true }
        );
        column.addEventListener(
          "touchend",
          (event) => {
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            if (Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY)) {
              return;
            }
            const currentIndex = weekDateKeys.indexOf(ui.focusDateKey);
            if (deltaX < 0 && currentIndex < weekDateKeys.length - 1) {
              ui.focusDateKey = weekDateKeys[currentIndex + 1];
              renderApp();
            } else if (deltaX > 0 && currentIndex > 0) {
              ui.focusDateKey = weekDateKeys[currentIndex - 1];
              renderApp();
            }
          },
          { passive: true }
        );
      }

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
              `<span class="day-strip-symbol" style="--responsible-color: ${colorForUser(getResponsibleIds(item.task)[0])}"><span class="day-strip-symbol-icon">${item.task.icon}</span><span class="day-strip-symbol-title">${resolveTaskTitle(item.task)}</span></span>`
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
      const assigned = state.tasks.filter((task) => getResponsibleIds(task).includes(user.id) && task.status === "open").length;
      const button = document.createElement("button");
      button.type = "button";
      const isActiveMember = state.settings.currentUserId === user.id;
      button.className = `member-tile${isActiveMember ? " active" : ""}`;
      button.dataset.userId = user.id;
      button.style.setProperty("--responsible-color", colorForUser(user.id));
      button.addEventListener("click", () => {
        if (ui.selectedTaskId) {
          reassignTask(ui.selectedTaskId, user.id);
          return;
        }
        state.settings.currentUserId = user.id;
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

  function renderClaimPool(container = refs.claimDialogList, claimUserId = ui.claimDialogUserId || state.settings.currentUserId) {
    const t = currentMessages();
    container.innerHTML = "";
    if (!state.claimPool.length) {
      const empty = document.createElement("div");
      empty.className = "claim-pool-empty";
      empty.textContent = t.claimEmpty;
      container.appendChild(empty);
      return;
    }
    state.claimPool.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "claim-pool-card";
      card.innerHTML = `
        <div class="claim-pool-top">
          <span class="quick-task-icon">${entry.icon}</span>
          <strong>${resolveLibraryTitle(entry)}</strong>
        </div>
        <div class="claim-pool-meta">${messageForCategory(entry.category)}</div>
        <div class="claim-pool-requested">${t.requestedBy.replace("{user}", displayUser(entry.ownerId))}</div>
      `;
      const claimButton = document.createElement("button");
      claimButton.type = "button";
      claimButton.className = "ghost-button small-button";
      claimButton.textContent = t.claimNow;
      claimButton.addEventListener("click", () => claimPoolTask(entry.id, claimUserId));
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "ghost-button small-button";
      removeButton.textContent = t.removeClaimTask;
      removeButton.addEventListener("click", () => removeClaimPoolTask(entry.id));
      const actions = document.createElement("div");
      actions.className = "claim-pool-actions";
      actions.append(claimButton, removeButton);
      card.appendChild(actions);
      container.appendChild(card);
    });
  }

  function renderSomedayPool(container = refs.somedayDialogList) {
    const t = currentMessages();
    container.innerHTML = "";
    if (!state.somedayPool.length) {
      const empty = document.createElement("div");
      empty.className = "claim-pool-empty";
      empty.textContent = t.somedayInboxCopy;
      container.appendChild(empty);
      return;
    }
    state.somedayPool.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "claim-pool-card";
      card.innerHTML = `
        <div class="claim-pool-top">
          <span class="quick-task-icon">${entry.icon}</span>
          <strong>${resolveLibraryTitle(entry)}</strong>
        </div>
        <div class="claim-pool-meta">${messageForCategory(entry.category)}</div>
        <div class="claim-pool-requested">${t.requestedBy.replace("{user}", displayUser(entry.ownerId))}</div>
      `;
      const planButton = document.createElement("button");
      planButton.type = "button";
      planButton.className = "ghost-button small-button";
      planButton.textContent = t.somedayPlanNow;
      planButton.addEventListener("click", () => promoteSomedayTask(entry.id));
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "ghost-button small-button";
      removeButton.textContent = t.removeClaimTask;
      removeButton.addEventListener("click", () => removeSomedayPoolTask(entry.id));
      const actions = document.createElement("div");
      actions.className = "claim-pool-actions";
      actions.append(planButton, removeButton);
      card.appendChild(actions);
      container.appendChild(card);
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
        closeToolDrawerForDrag();
        showDeleteDropZone();
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "copy";
          event.dataTransfer.setData("text/plain", `quick:${template.id}`);
        }
      });
      button.addEventListener("dragend", () => {
        ui.dragTaskId = null;
        clearDropTargets();
        hideDeleteDropZone();
        hideClaimDropZone();
        hideSomedayDropZone();
        reopenToolDrawerAfterDrag();
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
        closeToolDrawerForDrag();
        showDeleteDropZone();
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "copy";
          event.dataTransfer.setData("text/plain", `saved:${entry.id}`);
        }
      });
      button.addEventListener("dragend", () => {
        ui.dragTaskId = null;
        clearDropTargets();
        hideDeleteDropZone();
        hideClaimDropZone();
        hideSomedayDropZone();
        reopenToolDrawerAfterDrag();
      });
      button.addEventListener("click", () => {
        openTaskDialog(null, {
          dueDate: formatDateKey(startOfDay(new Date())),
          title: resolveLibraryTitle(entry),
          icon: entry.icon,
          category: entry.category,
          ownerId: state.settings.currentUserId,
          responsibleId: state.settings.currentUserId,
          dueTime: entry.dueTime || "",
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
    renderResponsiblePicker();
    fillSelect(refs.taskEffortInput, effortOptions.map((effort) => ({ value: effort, label: currentMessages()[effort] })));
    fillSelect(refs.taskWeekdayInput, weekdayKeys.map((key, index) => ({ value: String(index), label: currentMessages().weekdayLong[key] })));
    fillSelect(refs.taskRecurrenceInput, [
      { value: "none", label: currentMessages().repeatNever },
      { value: "daily", label: currentMessages().repeatDaily },
      { value: "weekdays", label: currentMessages().repeatWeekdays },
      { value: "weekly", label: currentMessages().repeatWeekly },
      { value: "biweekly", label: currentMessages().repeatBiweekly },
      { value: "linneaWeeks", label: currentMessages().repeatLinneaWeeks },
      { value: "notLinneaWeeks", label: currentMessages().repeatNotLinneaWeeks },
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
        renderTaskPreview();
      });
      refs.iconGrid.appendChild(button);
    });
  }

  function renderResponsiblePicker(selectedIds) {
    const activeIds = normalizeResponsibleIds(selectedIds || refs.taskResponsibleInput.dataset.value?.split(",") || state.settings.currentUserId);
    refs.taskResponsibleInput.dataset.value = activeIds.join(",");
    refs.taskResponsibleInput.innerHTML = "";
    [{ id: "everyone", label: currentMessages().everyone }].concat(
      users.map((user) => ({ id: user.id, label: `${user.emoji} ${user.name}` }))
    ).forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `responsible-chip${activeIds.includes(entry.id) ? " active" : ""}`;
      button.textContent = entry.label;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        let nextIds;
        if (entry.id === "everyone") {
          nextIds = ["everyone"];
        } else {
          const currentIds = normalizeResponsibleIds(refs.taskResponsibleInput.dataset.value?.split(","));
          nextIds = currentIds.filter((id) => id !== "everyone");
          if (nextIds.includes(entry.id)) {
            nextIds = nextIds.filter((id) => id !== entry.id);
          } else {
            nextIds.push(entry.id);
          }
          if (!nextIds.length) {
            nextIds = [state.settings.currentUserId];
          }
        }
        renderResponsiblePicker(nextIds);
        renderTaskPreview();
      });
      refs.taskResponsibleInput.appendChild(button);
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
    refs.fieldTimeLabel.textContent = t.taskTime;
    refs.fieldEndTimeLabel.textContent = t.taskEndTime;
    refs.fieldRepeatLabel.textContent = t.taskRepeat;
    refs.fieldIntervalLabel.textContent = t.taskInterval;
    refs.fieldWeekdayLabel.textContent = t.taskWeekday;
    refs.fieldEffortLabel.textContent = t.taskEffort;
    refs.fieldClaimableLabel.textContent = t.taskClaimable;
    refs.fieldSomedayLabel.textContent = t.taskSomeday;
    refs.fieldNotesLabel.textContent = t.taskNotes;
    refs.dialogPreviewLabel.textContent = t.previewLabel;
    refs.deleteTaskButton.textContent = t.delete;
    refs.deleteSeriesButton.textContent = "Delete series";
    refs.cancelTaskButton.textContent = t.cancel;
    refs.saveTaskButton.textContent = t.save;
  }

  function renderTaskPreview() {
    const title = refs.taskTitleInput.value.trim() || "Task title";
    const icon = refs.taskIconInput.value || iconChoices[0];
    const ownerId = refs.taskOwnerInput.value || state.settings.currentUserId;
    const responsibleIds = normalizeResponsibleIds(refs.taskResponsibleInput.dataset.value?.split(",") || state.settings.currentUserId);
    const responsibleId = responsibleIds[0] || state.settings.currentUserId;
    const dueDate = refs.taskDayInput.value || formatDateKey(startOfDay(new Date()));
    const dueTime = refs.taskTimeInput.value || "";
    const endTime = refs.taskEndTimeInput.value || "";
    const recurrence = refs.taskRecurrenceInput.value || "none";
    const effort = refs.taskEffortInput.value || "steady";
    const category = refs.taskCategoryInput.value || "home";
    const t = currentMessages();
    const fragment = refs.taskCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".task-card");
    const detailsShell = fragment.querySelector(".task-details-shell");
    const complete = fragment.querySelector(".complete-chip");
    const iconNode = fragment.querySelector(".task-icon");
    const titleNode = fragment.querySelector(".task-title");
    const metaNode = fragment.querySelector(".task-meta");
    const badges = fragment.querySelector(".task-badges");
    const editButton = fragment.querySelector(".edit-task-button");

    card.classList.add("preview-card");
    card.style.setProperty("--responsible-color", colorForUser(responsibleId));
    card.draggable = false;
    detailsShell.open = true;
    iconNode.textContent = icon;
    titleNode.textContent = title;
    metaNode.textContent = buildPreviewMetaLine({ category, responsibleIds, dueDate, dueTime, endTime });
    complete.textContent = t.complete;
    complete.disabled = true;
    editButton.remove();

    badges.appendChild(createBadge(`${t.owner}: ${displayUser(ownerId)}`));
    badges.appendChild(createBadge(`${t.responsible}: ${displayUsers(responsibleIds)}`));
    badges.appendChild(createBadge(`${t.statusEffort}: ${t[effort]}`));
    if (recurrence !== "none") {
      badges.appendChild(createBadge(`${t.statusRecurring}: ${recurrenceLabel(recurrence)}`));
    }

    refs.taskPreviewCard.innerHTML = "";
    refs.taskPreviewCard.appendChild(fragment);
  }

  function buildPreviewMetaLine({ category, responsibleIds, dueDate, dueTime, endTime }) {
    const due = parseDateKey(dueDate);
    const t = currentMessages();
    let dueLabel = formatNumericDate(due);
    if (isSameDay(due, new Date())) {
      dueLabel = t.dueToday;
    } else if (isSameDay(due, addDays(startOfDay(new Date()), 1))) {
      dueLabel = t.dueTomorrow;
    }
    const timeLabel = formatTaskTimeRange({ dueTime, endTime });
    const timePrefix = timeLabel ? `${timeLabel} • ` : "";
    return `${messageForCategory(category)} • ${displayUsers(responsibleIds)} • ${timePrefix}${dueLabel}`;
  }

  function createTaskCard(item) {
    const t = currentMessages();
    const fragment = refs.taskCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".task-card");
    const detailsShell = fragment.querySelector(".task-details-shell");
    const summary = fragment.querySelector(".task-summary");
    const complete = fragment.querySelector(".complete-chip");
    const claimButton = fragment.querySelector(".claim-chip");
    const icon = fragment.querySelector(".task-icon");
    const title = fragment.querySelector(".task-title");
    const meta = fragment.querySelector(".task-meta");
    const badges = fragment.querySelector(".task-badges");
    const editButton = fragment.querySelector(".edit-task-button");
    const creditButton = fragment.querySelector(".credit-task-button");

    const task = item.task;
    const overdue = isItemOverdue(item);
    const responsibleIds = getResponsibleIds(task);
    const responsibleColor = colorForUser(responsibleIds[0]);
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
      showDeleteDropZone();
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", item.id);
      }
    });
    card.addEventListener("dragend", () => {
      ui.dragTaskId = null;
      card.classList.remove("dragging");
      clearDropTargets();
      hideDeleteDropZone();
      hideClaimDropZone();
      hideSomedayDropZone();
    });

    icon.textContent = task.icon;
    title.textContent = resolveTaskTitle(task);
    meta.textContent = describeBoardItemLine(item);
    complete.textContent = item.done ? t.reopen : t.complete;
    complete.addEventListener("click", () => handleCompleteAction(item));
    editButton.textContent = t.edit;
    editButton.addEventListener("click", () => openTaskDialog(task.id));
    if (item.done && getResponsibleIds(task).filter((id) => id !== "everyone").length <= 1) {
      const currentCreditId = getCompletionUserIdForItem(item);
      const targetUserId = state.settings.currentUserId;
      claimButton.classList.remove("hidden");
      claimButton.disabled = currentCreditId === targetUserId;
      claimButton.textContent = currentCreditId === targetUserId ? t.claimedTask : t.claimTask;
      claimButton.addEventListener("click", () => creditTaskCompletion(item, targetUserId));
    }

    badges.appendChild(createBadge(`${t.owner}: ${displayUser(task.ownerId)}`));
    badges.appendChild(createBadge(`${t.responsible}: ${displayUsers(responsibleIds)}`));
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
    renderResponsiblePicker(task?.responsibleIds || defaults?.responsibleIds || task?.responsibleId || defaults?.responsibleId || state.settings.currentUserId);
    refs.taskDayInput.value = task?.dueDate || defaults?.dueDate || today;
    refs.taskTimeInput.value = task?.dueTime || defaults?.dueTime || "";
    refs.taskEndTimeInput.value = task?.endTime || defaults?.endTime || "";
    refs.taskRecurrenceInput.value = task?.recurrence || "none";
    refs.taskIntervalInput.value = String(task?.interval || 1);
    refs.taskWeekdayInput.value = String(task?.weekday ?? getWeekdayIndex(startOfDay(new Date())));
    refs.taskEffortInput.value = task?.effort || defaults?.effort || "steady";
    refs.taskClaimableInput.checked = Boolean(defaults?.claimable);
    refs.taskSomedayInput.checked = Boolean(defaults?.someday);
    refs.taskNotesInput.value = task ? resolveTaskNotes(task) : defaults?.notes || "";
    refs.taskTitleInput.value = task ? resolveTaskTitle(task) : defaults?.title || "";
    ui.pendingSomedayEntryId = defaults?.somedayEntryId || null;
    refs.deleteTaskButton.classList.toggle("hidden", !task);
    refs.deleteSeriesButton.classList.toggle("hidden", !(task && task.recurrence !== "none"));
    renderIconGrid(task?.icon || defaults?.icon || iconChoices[0]);
    syncDialogFields();
    renderTaskPreview();
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
      responsibleIds: [selectedUserId],
      dueDate: dateKey,
      endTime: "",
      recurrence: "none",
      interval: 1,
      weekday: null,
      effort: template.effort,
      notes: "",
      notesTranslations: null,
      status: "open",
      completedAt: null,
      completedById: null,
      completedByIds: [],
      completionDates: [],
      completionByDate: {},
      completionParticipantsByDate: {},
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
      responsible: getResponsibleIds(entry).length > 1 ? getResponsibleIds(entry) : selectedUserId,
      dueDate: dateKey,
      dueTime: entry.dueTime || "",
      endTime: entry.endTime || "",
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

  function claimPoolTask(entryId, userId = state.settings.currentUserId) {
    const entry = state.claimPool.find((item) => item.id === entryId);
    if (!entry) {
      return;
    }
    const selectedUserId = userId || state.settings.currentUserId;
    const task = buildTask({
      title: entry.titleTranslations || entry.title,
      icon: entry.icon,
      category: entry.category,
      owner: entry.ownerId,
      responsible: selectedUserId,
      dueDate: formatDateKey(startOfDay(new Date())),
      dueTime: "",
      endTime: "",
      recurrence: "none",
      effort: entry.effort,
      notes: entry.notesTranslations || entry.notes,
    });
    state.tasks.push(task);
    state.claimPool = state.claimPool.filter((item) => item.id !== entryId);
    state.settings.currentUserId = selectedUserId;
    saveState();
    renderApp();
    if (!state.claimPool.length && refs.claimDialog.open) {
      closeClaimDialog();
    } else if (refs.claimDialog.open) {
      renderClaimDialog();
    }
  }

  function removeClaimPoolTask(entryId) {
    state.claimPool = state.claimPool.filter((item) => item.id !== entryId);
    saveState();
    renderApp();
    if (refs.claimDialog.open) {
      if (!state.claimPool.length) {
        closeClaimDialog();
      } else {
        renderClaimDialog();
      }
    }
  }

  function addClaimEntryFromLibrary(libraryId) {
    const entry = state.taskLibrary.find((item) => item.id === libraryId);
    if (!entry) {
      return;
    }
    state.claimPool.unshift(
      normalizeClaimRecord({
        ...entry,
        id: crypto.randomUUID(),
        dueTime: "",
        endTime: "",
        updatedAt: new Date().toISOString(),
      })
    );
    ui.dragTaskId = null;
    saveState();
    renderApp();
  }

  function addClaimEntryFromQuickTemplate(templateId) {
    const template = quickTaskTemplates.find((item) => item.id === templateId);
    if (!template) {
      return;
    }
    state.claimPool.unshift(
      normalizeClaimRecord({
        id: crypto.randomUUID(),
        title: template.title.en,
        titleTranslations: template.title,
        icon: template.icon,
        category: template.category,
        ownerId: state.settings.currentUserId,
        responsibleId: "everyone",
        responsibleIds: ["everyone"],
        dueTime: "",
        endTime: "",
        effort: template.effort,
        notes: "",
        notesTranslations: null,
        updatedAt: new Date().toISOString(),
      })
    );
    ui.dragTaskId = null;
    saveState();
    renderApp();
  }

  function addSomedayEntryFromLibrary(libraryId) {
    const entry = state.taskLibrary.find((item) => item.id === libraryId);
    if (!entry) {
      return;
    }
    state.somedayPool.unshift(
      normalizeSomedayRecord({
        ...entry,
        id: crypto.randomUUID(),
        dueTime: "",
        endTime: "",
        recurrence: "none",
        interval: 1,
        weekday: null,
        updatedAt: new Date().toISOString(),
      })
    );
    ui.dragTaskId = null;
    saveState();
    renderApp();
  }

  function addSomedayEntryFromQuickTemplate(templateId) {
    const template = quickTaskTemplates.find((item) => item.id === templateId);
    if (!template) {
      return;
    }
    state.somedayPool.unshift(
      normalizeSomedayRecord({
        id: crypto.randomUUID(),
        title: template.title.en,
        titleTranslations: template.title,
        icon: template.icon,
        category: template.category,
        ownerId: state.settings.currentUserId,
        responsibleId: state.settings.currentUserId,
        responsibleIds: [state.settings.currentUserId],
        dueTime: "",
        endTime: "",
        effort: template.effort,
        notes: "",
        notesTranslations: null,
        updatedAt: new Date().toISOString(),
      })
    );
    ui.dragTaskId = null;
    saveState();
    renderApp();
  }

  function promoteSomedayTask(entryId) {
    const entry = state.somedayPool.find((item) => item.id === entryId);
    if (!entry) {
      return;
    }
    if (refs.somedayDialog.open) {
      closeSomedayDialog();
    }
    openTaskDialog(null, {
      somedayEntryId: entry.id,
      title: resolveLibraryTitle(entry),
      icon: entry.icon,
      category: entry.category,
      ownerId: entry.ownerId,
      responsibleIds: getResponsibleIds(entry),
      effort: entry.effort,
      notes: resolveLibraryNotes(entry),
      dueDate: formatDateKey(startOfDay(new Date())),
    });
  }

  function removeSomedayPoolTask(entryId) {
    state.somedayPool = state.somedayPool.filter((item) => item.id !== entryId);
    saveState();
    renderApp();
    if (refs.somedayDialog.open) {
      if (!state.somedayPool.length) {
        closeSomedayDialog();
      } else {
        renderSomedayDialog();
      }
    }
  }

  function closeDialog() {
    ui.pendingSomedayEntryId = null;
    refs.taskDialog.close();
  }

  function exportBoardData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: "HomeFlow Board",
      version: APP_VERSION,
      data: state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `homeflow-board-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function importBoardData(event) {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        const imported = normalizeState(parsed.data || parsed);
        Object.keys(state).forEach((key) => delete state[key]);
        Object.assign(state, imported);
        ui.drawerOpen = false;
        ui.selectedTaskId = null;
        ui.dragTaskId = null;
        saveState();
        hydrateRecurringTasks();
        renderApp();
      } catch (error) {
        window.alert("Import failed. Please select a valid board backup JSON file.");
      } finally {
        refs.importDataInput.value = "";
      }
    });
    reader.readAsText(file);
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const payload = {
      title: refs.taskTitleInput.value.trim(),
      icon: refs.taskIconInput.value || iconChoices[0],
      category: refs.taskCategoryInput.value,
      ownerId: refs.taskOwnerInput.value,
      responsibleIds: normalizeResponsibleIds(refs.taskResponsibleInput.dataset.value?.split(",") || state.settings.currentUserId),
      dueDate: refs.taskDayInput.value,
      dueTime: refs.taskTimeInput.value,
      endTime: refs.taskEndTimeInput.value,
      recurrence: refs.taskRecurrenceInput.value,
      interval: Number(refs.taskIntervalInput.value) || 1,
      weekday: Number(refs.taskWeekdayInput.value),
      effort: refs.taskEffortInput.value,
      claimable: refs.taskClaimableInput.checked,
      someday: refs.taskSomedayInput.checked,
      notes: refs.taskNotesInput.value.trim(),
    };

    if (!payload.title || (!payload.claimable && !payload.someday && !payload.dueDate)) {
      return;
    }

    let taskToPersist;

    if (payload.claimable) {
      const claimEntry = buildClaimRecordFromPayload(payload);
      if (ui.dialogMode === "edit" && ui.editingTaskId) {
        state.tasks = state.tasks.filter((task) => task.id !== ui.editingTaskId);
      }
      state.claimPool.unshift(claimEntry);
      saveState();
      closeDialog();
      renderApp();
      return;
    }

    if (payload.someday) {
      const somedayEntry = buildSomedayRecordFromPayload(payload);
      if (ui.dialogMode === "edit" && ui.editingTaskId) {
        state.tasks = state.tasks.filter((task) => task.id !== ui.editingTaskId);
      }
      state.somedayPool.unshift(somedayEntry);
      saveState();
      closeDialog();
      renderApp();
      return;
    }

    if (ui.dialogMode === "edit" && ui.editingTaskId) {
      const task = state.tasks.find((item) => item.id === ui.editingTaskId);
      if (!task) {
        return;
      }
      Object.assign(task, payload, {
        responsibleId: payload.responsibleIds[0] || "everyone",
        titleTranslations: null,
        notesTranslations: null,
        completionDates: task.completionDates || [],
        completionByDate: normalizeCompletionByDate(task.completionByDate, task),
        completedById: normalizeCompletionUserId(task.completedById, task),
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
        responsible: payload.responsibleIds,
        dueDate: payload.dueDate,
        dueTime: payload.dueTime,
        endTime: payload.endTime,
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
    if (ui.pendingSomedayEntryId) {
      state.somedayPool = state.somedayPool.filter((entry) => entry.id !== ui.pendingSomedayEntryId);
      ui.pendingSomedayEntryId = null;
    }

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
    const somedayMode = refs.taskSomedayInput.checked;
    const claimMode = refs.taskClaimableInput.checked;
    const unscheduledMode = somedayMode || claimMode;
    [refs.taskDayInput, refs.taskTimeInput, refs.taskEndTimeInput, refs.taskRecurrenceInput]
      .map((element) => element.closest(".field"))
      .forEach((field) => field?.classList.toggle("hidden", unscheduledMode));
    refs.intervalField.classList.toggle("hidden", recurrence !== "interval");
    refs.weekdayField.classList.toggle("hidden", !["weekly", "biweekly", "linneaWeeks", "notLinneaWeeks"].includes(recurrence));
    if (unscheduledMode) {
      refs.intervalField.classList.add("hidden");
      refs.weekdayField.classList.add("hidden");
    }
    renderTaskPreview();
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
      responsibleIds: getResponsibleIds(task),
      dueTime: task.dueTime || "",
      endTime: task.endTime || "",
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

  function buildClaimRecordFromPayload(payload) {
    return normalizeClaimRecord({
      id: crypto.randomUUID(),
      title: payload.title,
      titleTranslations: null,
      icon: payload.icon,
      category: payload.category,
      ownerId: payload.ownerId,
      responsibleId: payload.responsibleIds[0] || "everyone",
      responsibleIds: payload.responsibleIds,
      dueTime: "",
      endTime: "",
      effort: payload.effort || "steady",
      notes: payload.notes || "",
      notesTranslations: null,
      updatedAt: new Date().toISOString(),
    });
  }

  function buildSomedayRecordFromPayload(payload) {
    return normalizeSomedayRecord({
      id: crypto.randomUUID(),
      title: payload.title,
      titleTranslations: null,
      icon: payload.icon,
      category: payload.category,
      ownerId: payload.ownerId,
      responsibleId: payload.responsibleIds[0] || "everyone",
      responsibleIds: payload.responsibleIds,
      dueTime: "",
      endTime: "",
      effort: payload.effort || "steady",
      notes: payload.notes || "",
      notesTranslations: null,
      updatedAt: new Date().toISOString(),
    });
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

  function deleteBoardItemFromPlan(itemId) {
    const item = findBoardItemById(itemId);
    if (!item) {
      return;
    }
    if (item.kind === "single") {
      state.tasks = state.tasks.filter((task) => task.id !== item.task.id);
    } else {
      const task = state.tasks.find((entry) => entry.id === item.task.id);
      if (!task) {
        return;
      }
      task.exceptionDates = Array.isArray(task.exceptionDates) ? task.exceptionDates : [];
      if (!task.exceptionDates.includes(item.dateKey)) {
        task.exceptionDates.push(item.dateKey);
      }
      task.updatedAt = new Date().toISOString();
    }
    ui.dragTaskId = null;
    ui.selectedTaskId = null;
    saveState();
    renderApp();
  }

  function deleteDraggedItem(itemId) {
    const value = String(itemId);
    if (value.startsWith("saved:") || value.startsWith("quick:")) {
      ui.dragTaskId = null;
      clearDropTargets();
      hideDeleteDropZone();
      hideClaimDropZone();
      hideSomedayDropZone();
      return;
    }
    deleteBoardItemFromPlan(itemId);
  }

  function moveBoardItemToClaimPool(itemId) {
    const item = findBoardItemById(itemId);
    if (!item) {
      return;
    }
    state.claimPool.unshift(
      normalizeClaimRecord({
        id: crypto.randomUUID(),
        title: item.task.title,
        titleTranslations: item.task.titleTranslations,
        icon: item.task.icon,
        category: item.task.category,
        ownerId: item.task.ownerId,
        responsibleId: item.task.responsibleId,
        responsibleIds: getResponsibleIds(item.task),
        dueTime: "",
        endTime: "",
        effort: item.task.effort,
        notes: item.task.notes,
        notesTranslations: item.task.notesTranslations,
        updatedAt: new Date().toISOString(),
      })
    );
    deleteBoardItemFromPlan(itemId);
  }

  function moveBoardItemToSomedayPool(itemId) {
    const item = findBoardItemById(itemId);
    if (!item) {
      return;
    }
    state.somedayPool.unshift(
      normalizeSomedayRecord({
        id: crypto.randomUUID(),
        title: item.task.title,
        titleTranslations: item.task.titleTranslations,
        icon: item.task.icon,
        category: item.task.category,
        ownerId: item.task.ownerId,
        responsibleId: item.task.responsibleId,
        responsibleIds: getResponsibleIds(item.task),
        dueTime: "",
        endTime: "",
        effort: item.task.effort,
        notes: item.task.notes,
        notesTranslations: item.task.notesTranslations,
        recurrence: "none",
        interval: 1,
        weekday: null,
        updatedAt: new Date().toISOString(),
      })
    );
    deleteBoardItemFromPlan(itemId);
  }

  function reassignTask(taskId, userId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    task.responsibleId = userId;
    task.responsibleIds = [userId];
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
    moveRecurringOccurrence(item, { responsibleId: userId, responsibleIds: [userId] });
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
      responsibleIds: changes.responsibleIds || getResponsibleIds(task),
      dueDate: changes.dueDate || item.dateKey,
      dueTime: task.dueTime || "",
      endTime: task.endTime || "",
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
      completedById: null,
      completedByIds: [],
      completionDates: [],
      completionByDate: {},
      completionParticipantsByDate: {},
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

  function handleCompleteAction(boardItem) {
    if (boardItem.done) {
      toggleTaskCompletion(boardItem, false);
      return;
    }
    const participantIds = getResponsibleIds(boardItem.task).filter((id) => id !== "everyone");
    if (participantIds.length > 1) {
      openParticipantDialog(boardItem);
      return;
    }
    toggleTaskCompletion(boardItem, true);
  }

  function toggleTaskCompletion(boardItem, shouldComplete) {
    const explicitParticipants = arguments[2];
    const task = state.tasks.find((item) => item.id === boardItem.task.id);
    if (!task) {
      return;
    }
    const openBefore = countOpenBoardItemsForDate(boardItem.dateKey);
    if (task.recurrence !== "none") {
      task.completionDates = Array.isArray(task.completionDates) ? task.completionDates : [];
      task.completionByDate = normalizeCompletionByDate(task.completionByDate, task);
      task.completionParticipantsByDate = normalizeCompletionParticipantsByDate(task.completionParticipantsByDate, task, task.completionByDate);
      if (shouldComplete) {
        if (!task.completionDates.includes(boardItem.dateKey)) {
          task.completionDates.push(boardItem.dateKey);
        }
        const participantIds = normalizeCompletionUserIds(explicitParticipants, task, getDefaultCompletionUserId(task));
        task.completionParticipantsByDate[boardItem.dateKey] = participantIds;
        task.completionByDate[boardItem.dateKey] = participantIds[0] || getDefaultCompletionUserId(task);
      } else {
        task.completionDates = task.completionDates.filter((dateKey) => dateKey !== boardItem.dateKey);
        delete task.completionByDate[boardItem.dateKey];
        delete task.completionParticipantsByDate[boardItem.dateKey];
      }
    } else {
      task.status = shouldComplete ? "done" : "open";
      task.completedAt = shouldComplete ? new Date().toISOString() : null;
      task.completedByIds = shouldComplete
        ? normalizeCompletionUserIds(explicitParticipants, task, getDefaultCompletionUserId(task))
        : [];
      task.completedById = shouldComplete ? (task.completedByIds[0] || getDefaultCompletionUserId(task)) : null;
    }
    task.updatedAt = new Date().toISOString();
    ui.selectedTaskId = null;
    saveState();
    renderApp();
    if (shouldComplete) {
      launchCelebrationBurst();
      const openAfter = countOpenBoardItemsForDate(boardItem.dateKey);
      if (openBefore > 0 && openAfter === 0) {
        launchDayCompletionCelebration();
      }
    }
  }

  function launchCelebrationBurst() {
    if (!refs.celebrationLayer) {
      return;
    }
    const words = celebrationWords[state.settings.language] || celebrationWords.en;
    const chip = document.createElement("div");
    chip.className = "celebration-chip";
    chip.textContent = words[Math.floor(Math.random() * words.length)];
    chip.style.setProperty("--x", "50%");
    chip.style.setProperty("--delay", "0s");
    chip.style.setProperty("--duration", "1.4s");
    chip.style.setProperty("--drift", "0px");
    chip.style.setProperty("--rotate", "0deg");
    refs.celebrationLayer.appendChild(chip);
    window.setTimeout(() => chip.remove(), 1800);
  }

  function launchDayCompletionCelebration() {
    if (!refs.celebrationLayer) {
      return;
    }
    const t = currentMessages();
    const banner = document.createElement("div");
    banner.className = "day-clear-banner";
    banner.innerHTML = `<strong>${t.dayCleared}</strong><span>${t.dayClearedSub}</span>`;
    refs.celebrationLayer.appendChild(banner);
    window.setTimeout(() => banner.remove(), 3600);

    for (let index = 0; index < 46; index += 1) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.setProperty("--x", `${4 + Math.random() * 92}%`);
      piece.style.setProperty("--delay", `${Math.random() * 0.18}s`);
      piece.style.setProperty("--duration", `${2.2 + Math.random() * 1.2}s`);
      piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 160}px`);
      piece.style.setProperty("--spin", `${240 + Math.random() * 240}deg`);
      piece.style.setProperty("--confetti-color", confettiColorForIndex(index));
      refs.celebrationLayer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 3800);
    }
  }

  function openParticipantDialog(boardItem) {
    const t = currentMessages();
    ui.pendingCompletionItemId = boardItem.id;
    refs.participantEyebrow.textContent = t.participantEyebrow;
    refs.participantTitle.textContent = t.participantTitle;
    refs.participantCopy.textContent = `${resolveTaskTitle(boardItem.task)}. ${t.participantCopy}`;
    refs.cancelParticipantButton.textContent = t.cancel;
    refs.confirmParticipantButton.textContent = t.confirmParticipants;
    renderParticipantPicker(
      getResponsibleIds(boardItem.task).filter((id) => id !== "everyone"),
      [state.settings.currentUserId].filter((id) => getResponsibleIds(boardItem.task).includes(id))
    );
    refs.participantDialog.showModal();
  }

  function closeParticipantDialog() {
    ui.pendingCompletionItemId = null;
    refs.participantDialog.close();
  }

  function openClaimDialog() {
    ui.claimDialogUserId = state.settings.currentUserId;
    renderClaimDialog();
    refs.claimDialog.showModal();
  }

  function closeClaimDialog() {
    refs.claimDialog.close();
  }

  function openSomedayDialog() {
    renderSomedayDialog();
    refs.somedayDialog.showModal();
  }

  function closeSomedayDialog() {
    refs.somedayDialog.close();
  }

  function renderClaimDialogUserPicker(selectedUserId) {
    refs.claimDialogUserPicker.innerHTML = "";
    users.forEach((user) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `responsible-chip${selectedUserId === user.id ? " active" : ""}`;
      button.textContent = `${user.emoji} ${user.name}`;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        ui.claimDialogUserId = user.id;
        renderClaimDialog();
      });
      refs.claimDialogUserPicker.appendChild(button);
    });
  }

  function renderClaimDialog() {
    const t = currentMessages();
    const selectedUserId = ui.claimDialogUserId || state.settings.currentUserId;
    refs.claimDialogEyebrow.textContent = t.claimPoolHeading;
    refs.claimDialogTitle.textContent = t.claimInbox;
    refs.claimDialogCopy.textContent = t.claimInboxCopy;
    refs.claimDialogWhoLabel.textContent = t.claimWho;
    refs.closeClaimDialogFooterButton.textContent = t.cancel;
    renderClaimDialogUserPicker(selectedUserId);
    renderClaimPool(refs.claimDialogList, selectedUserId);
  }

  function renderSomedayDialog() {
    const t = currentMessages();
    refs.somedayDialogEyebrow.textContent = t.somedayHeading;
    refs.somedayDialogTitle.textContent = t.somedayInbox;
    refs.somedayDialogCopy.textContent = t.somedayInboxCopy;
    refs.closeSomedayDialogFooterButton.textContent = t.cancel;
    renderSomedayPool(refs.somedayDialogList);
  }

  function handleSomedayDrop(event) {
    handleDragLeave(event);
    if (!ui.dragTaskId) {
      return;
    }
    if (String(ui.dragTaskId).startsWith("saved:")) {
      addSomedayEntryFromLibrary(ui.dragTaskId.replace("saved:", ""));
    } else if (String(ui.dragTaskId).startsWith("quick:")) {
      addSomedayEntryFromQuickTemplate(ui.dragTaskId.replace("quick:", ""));
    } else {
      moveBoardItemToSomedayPool(ui.dragTaskId);
    }
  }

  function renderParticipantPicker(allowedIds, selectedIds) {
    const activeIds = normalizeCompletionUserIds(selectedIds, null, allowedIds[0]).filter((id) => allowedIds.includes(id));
    refs.participantPicker.dataset.value = activeIds.join(",");
    refs.participantPicker.innerHTML = "";
    allowedIds.forEach((userId) => {
      const user = users.find((entry) => entry.id === userId);
      if (!user) {
        return;
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = `responsible-chip${activeIds.includes(userId) ? " active" : ""}`;
      button.textContent = `${user.emoji} ${user.name}`;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const currentIds = normalizeCompletionUserIds(refs.participantPicker.dataset.value?.split(","), null, allowedIds[0]).filter((id) => allowedIds.includes(id));
        let nextIds = currentIds.includes(userId)
          ? currentIds.filter((id) => id !== userId)
          : currentIds.concat(userId);
        if (!nextIds.length) {
          nextIds = [userId];
        }
        renderParticipantPicker(allowedIds, nextIds);
      });
      refs.participantPicker.appendChild(button);
    });
  }

  function handleParticipantSubmit(event) {
    event.preventDefault();
    const boardItem = findBoardItemById(ui.pendingCompletionItemId);
    if (!boardItem) {
      closeParticipantDialog();
      return;
    }
    const allowedIds = getResponsibleIds(boardItem.task).filter((id) => id !== "everyone");
    const selectedIds = normalizeCompletionUserIds(refs.participantPicker.dataset.value?.split(","), null, allowedIds[0]).filter((id) => allowedIds.includes(id));
    if (!selectedIds.length) {
      return;
    }
    closeParticipantDialog();
    toggleTaskCompletion(boardItem, true, selectedIds);
  }

  function creditTaskCompletion(boardItem, userId) {
    const task = state.tasks.find((item) => item.id === boardItem.task.id);
    if (!task || !users.some((user) => user.id === userId)) {
      return;
    }
    if (task.recurrence !== "none") {
      task.completionDates = Array.isArray(task.completionDates) ? task.completionDates : [];
      if (!task.completionDates.includes(boardItem.dateKey)) {
        return;
      }
      task.completionByDate = normalizeCompletionByDate(task.completionByDate, task);
      task.completionParticipantsByDate = normalizeCompletionParticipantsByDate(task.completionParticipantsByDate, task, task.completionByDate);
      task.completionByDate[boardItem.dateKey] = userId;
      task.completionParticipantsByDate[boardItem.dateKey] = [userId];
    } else if (task.status === "done") {
      task.completedById = userId;
      task.completedByIds = [userId];
    } else {
      return;
    }
    task.updatedAt = new Date().toISOString();
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
      const normalizedCompletionByDate = normalizeCompletionByDate(task.completionByDate, task);
      if (JSON.stringify(task.completionByDate || {}) !== JSON.stringify(normalizedCompletionByDate)) {
        task.completionByDate = normalizedCompletionByDate;
        changed = true;
      }
      const normalizedCompletedById = normalizeCompletionUserId(task.completedById, task);
      if (task.completedById !== normalizedCompletedById) {
        task.completedById = normalizedCompletedById;
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

  function getAllBoardItemsForDate(dateKey) {
    const date = parseDateKey(dateKey);
    return state.tasks.flatMap((task) => getBoardItemsForTask(task, date, date));
  }

  function countOpenBoardItemsForDate(dateKey) {
    return getAllBoardItemsForDate(dateKey).filter((item) => !item.done).length;
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
    const specialWeekRecurrence = task.recurrence === "linneaWeeks" || task.recurrence === "notLinneaWeeks";
    const effectiveAnchor = specialWeekRecurrence ? startOfWeek(anchor) : anchor;
    if (current < effectiveAnchor) {
      return false;
    }
    if (Array.isArray(task.exceptionDates) && task.exceptionDates.includes(formatDateKey(current))) {
      return false;
    }
    const diffDays = daysBetween(effectiveAnchor, current);

    switch (task.recurrence) {
      case "daily":
        return true;
      case "weekdays":
        return !isWeekend(current);
      case "weekly":
        return diffDays % 7 === 0 && weekdayMatches(task, current);
      case "biweekly":
        return diffDays % 14 === 0 && weekdayMatches(task, current);
      case "linneaWeeks":
        return isLinneaWeek(current) && weekdayMatches(task, current);
      case "notLinneaWeeks":
        return !isLinneaWeek(current) && weekdayMatches(task, current);
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
    return true;
  }

  function compareBoardItems(left, right) {
    if (left.done !== right.done) {
      return left.done ? 1 : -1;
    }
    const leftTime = left.task.dueTime || "99:99";
    const rightTime = right.task.dueTime || "99:99";
    if (leftTime !== rightTime) {
      return leftTime.localeCompare(rightTime);
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

  function normalizeResponsibleIds(value) {
    const raw = Array.isArray(value) ? value : [value];
    const cleaned = raw.filter((entry) => entry === "everyone" || users.some((user) => user.id === entry));
    const unique = Array.from(new Set(cleaned));
    if (unique.includes("everyone")) {
      return ["everyone"];
    }
    return unique;
  }

  function normalizeResponsibleRecord(record) {
    if (!record) {
      return record;
    }
    const responsibleIds = normalizeResponsibleIds(record.responsibleIds?.length ? record.responsibleIds : record.responsibleId);
    record.responsibleIds = responsibleIds.length ? responsibleIds : ["everyone"];
    record.responsibleId = record.responsibleIds[0];
    return record;
  }

  function normalizeClaimRecord(record) {
    if (!record) {
      return record;
    }
    const normalized = normalizeResponsibleRecord(record);
    normalized.dueTime = "";
    normalized.endTime = "";
    normalized.effort = normalized.effort || "steady";
    normalized.notes = normalized.notes || "";
    normalized.notesTranslations = normalized.notesTranslations || null;
    return normalized;
  }

  function normalizeSomedayRecord(record) {
    return normalizeClaimRecord(record);
  }

  function getDefaultCompletionUserId(task) {
    const responsibleIds = getResponsibleIds(task).filter((id) => id !== "everyone");
    return responsibleIds[0] || task?.ownerId || state.settings.currentUserId || "bjorn";
  }

  function normalizeCompletionUserId(userId, task) {
    if (userId == null) {
      return userId;
    }
    return users.some((user) => user.id === userId) ? userId : getDefaultCompletionUserId(task);
  }

  function normalizeCompletionUserIds(userIds, task, fallbackUserId) {
    const raw = Array.isArray(userIds) ? userIds : [userIds];
    const cleaned = Array.from(
      new Set(
        raw.filter((entry) => users.some((user) => user.id === entry))
      )
    );
    if (cleaned.length) {
      return cleaned;
    }
    const fallback = fallbackUserId || normalizeCompletionUserId(null, task) || getDefaultCompletionUserId(task);
    return fallback ? [fallback] : [];
  }

  function normalizeCompletionByDate(map, task) {
    if (!map || typeof map !== "object" || Array.isArray(map)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(map).filter(
        ([dateKey, userId]) => /^\d{4}-\d{2}-\d{2}$/.test(dateKey) && normalizeCompletionUserId(userId, task) === userId
      )
    );
  }

  function normalizeCompletionParticipantsByDate(map, task, fallbackMap) {
    const source = map && typeof map === "object" && !Array.isArray(map) ? map : {};
    const fallbackSource = fallbackMap && typeof fallbackMap === "object" && !Array.isArray(fallbackMap) ? fallbackMap : {};
    const normalized = {};
    const keys = new Set([...Object.keys(source), ...Object.keys(fallbackSource)]);
    keys.forEach((dateKey) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        return;
      }
      normalized[dateKey] = normalizeCompletionUserIds(source[dateKey], task, fallbackSource[dateKey]);
    });
    return normalized;
  }

  function getResponsibleIds(task) {
    return normalizeResponsibleIds(task?.responsibleIds?.length ? task.responsibleIds : task?.responsibleId);
  }

  function getCompletionUserIdForItem(item) {
    const task = item?.task;
    if (!task) {
      return null;
    }
    if (task.recurrence !== "none") {
      const completionByDate = normalizeCompletionByDate(task.completionByDate, task);
      return completionByDate[item.dateKey] || getDefaultCompletionUserId(task);
    }
    return normalizeCompletionUserId(task.completedById, task) || getDefaultCompletionUserId(task);
  }

  function getCompletionUserIdsForItem(item) {
    const task = item?.task;
    if (!task) {
      return [];
    }
    if (task.recurrence !== "none") {
      const participantsByDate = normalizeCompletionParticipantsByDate(task.completionParticipantsByDate, task, task.completionByDate);
      return participantsByDate[item.dateKey] || [getCompletionUserIdForItem(item)];
    }
    return normalizeCompletionUserIds(task.completedByIds, task, task.completedById);
  }

  function displayUsers(userIds) {
    const ids = normalizeResponsibleIds(userIds);
    return ids.map(displayUser).join(", ");
  }

  function colorForUser(userId) {
    return USER_COLORS[userId] || "#8aa0b6";
  }

  function confettiColorForIndex(index) {
    const palette = ["#7b5cff", "#f2c94c", "#f3a6ac", "#7a2434", "#1b8f8a", "#4277cf"];
    return palette[index % palette.length];
  }

  function formatTaskTimeRange(task) {
    const start = task?.dueTime || "";
    const end = task?.endTime || "";
    if (start && end) {
      return `${start}-${end}`;
    }
    return start || "";
  }

  function parseTimeValue(value) {
    if (typeof value !== "string" || !value.includes(":")) {
      return null;
    }
    const [hours, minutes] = value.split(":").map(Number);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
      return null;
    }
    return { hours, minutes };
  }

  function buildDateTime(date, timeValue) {
    const parsed = parseTimeValue(timeValue);
    if (!parsed) {
      return null;
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), parsed.hours, parsed.minutes, 0, 0);
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
    const timeRange = formatTaskTimeRange(task);
    const timeLabel = timeRange ? `${timeRange} • ` : "";
    return `${messageForCategory(task.category)} • ${displayUsers(getResponsibleIds(task))} • ${timeLabel}${dueLabel}`;
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
      linneaWeeks: t.repeatLinneaWeeks,
      notLinneaWeeks: t.repeatNotLinneaWeeks,
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

  function shouldShowDeleteDropZone() {
    return Boolean(ui.dragTaskId);
  }

  function handleClaimBellDrop(event) {
    handleDragLeave(event);
    if (!ui.dragTaskId) {
      return;
    }
    if (String(ui.dragTaskId).startsWith("saved:")) {
      addClaimEntryFromLibrary(ui.dragTaskId.replace("saved:", ""));
    } else if (String(ui.dragTaskId).startsWith("quick:")) {
      addClaimEntryFromQuickTemplate(ui.dragTaskId.replace("quick:", ""));
    } else {
      moveBoardItemToClaimPool(ui.dragTaskId);
    }
  }

  function showDeleteDropZone() {
    if (!shouldShowDeleteDropZone()) {
      return;
    }
    refs.deleteDropZone.classList.add("visible");
    refs.claimDropZone.classList.add("visible");
    refs.somedayDropZone.classList.add("visible");
  }

  function hideDeleteDropZone() {
    refs.deleteDropZone.classList.remove("visible", "drop-target");
  }

  function hideClaimDropZone() {
    refs.claimDropZone.classList.remove("visible", "drop-target");
  }

  function hideSomedayDropZone() {
    refs.somedayDropZone.classList.remove("visible", "drop-target");
  }

  function closeToolDrawerForDrag() {
    ui.reopenDrawerAfterDrag = ui.drawerOpen;
    ui.drawerOpen = false;
    refs.toolDrawer.classList.remove("open");
  }

  function reopenToolDrawerAfterDrag() {
    if (!ui.reopenDrawerAfterDrag) {
      return;
    }
    ui.reopenDrawerAfterDrag = false;
    ui.drawerOpen = true;
    refs.toolDrawer.classList.add("open");
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
    if (item.done) {
      return false;
    }
    const now = new Date();
    const itemDate = parseDateKey(item.dateKey);
    const today = startOfDay(now);
    if (itemDate < today) {
      return true;
    }
    if (!isSameDay(itemDate, now)) {
      return false;
    }
    const overdueAt = buildDateTime(itemDate, item.task.endTime || item.task.dueTime);
    return overdueAt ? now > overdueAt : false;
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

  function countTasksForDate(dateKey) {
    return getAllBoardItemsForDate(dateKey).length;
  }

  function countCompletedThisWeek(referenceDate = new Date()) {
    const weekStart = startOfWeek(referenceDate);
    let total = 0;
    for (let offset = 0; offset < 7; offset += 1) {
      const dateKey = formatDateKey(addDays(weekStart, offset));
      total += state.tasks.reduce((count, task) => {
        if (task.recurrence !== "none") {
          return count + (Array.isArray(task.completionDates) && task.completionDates.includes(dateKey) ? 1 : 0);
        }
        return count + (task.completedAt && isSameDay(new Date(task.completedAt), parseDateKey(dateKey)) ? 1 : 0);
      }, 0);
    }
    return total;
  }

  function getBestCompletedWeek() {
    const completionMap = new Map();
    state.tasks.forEach((task) => {
      if (task.recurrence !== "none") {
        const completionDates = Array.isArray(task.completionDates) ? task.completionDates : [];
        completionDates.forEach((dateKey) => {
          const parsed = parseDateKey(dateKey);
          if (Number.isNaN(parsed.getTime())) {
            return;
          }
          const key = getWeekRecordKey(parsed);
          completionMap.set(key, (completionMap.get(key) || 0) + 1);
        });
        return;
      }
      if (!task.completedAt) {
        return;
      }
      const completedDate = new Date(task.completedAt);
      if (Number.isNaN(completedDate.getTime())) {
        return;
      }
      const key = getWeekRecordKey(completedDate);
      completionMap.set(key, (completionMap.get(key) || 0) + 1);
    });
    let best = null;
    completionMap.forEach((count, key) => {
      if (!best || count > best.count) {
        best = { key, count };
      }
    });
    if (!best) {
      return null;
    }
    const [year, weekNumber] = best.key.split("-W");
    return {
      count: best.count,
      label: `${year} · KW ${weekNumber}`,
    };
  }

  function getWeekRecordKey(date) {
    const weekStartDate = startOfWeek(date);
    const weekYear = getWeekYear(weekStartDate);
    return `${weekYear}-W${String(getWeekNumber(weekStartDate)).padStart(2, "0")}`;
  }

  function getWeekYear(date) {
    const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - dayNum);
    return target.getUTCFullYear();
  }

  function getCompletionProgressColor(ratio) {
    const clamped = clamp(ratio, 0, 1);
    if (clamped <= 0.5) {
      return mixHexColors("#d99097", "#e7c56d", clamped / 0.5);
    }
    return mixHexColors("#e7c56d", "#81be8e", (clamped - 0.5) / 0.5);
  }

  function mixHexColors(startHex, endHex, ratio) {
    const start = hexToRgb(startHex);
    const end = hexToRgb(endHex);
    const mix = {
      r: Math.round(start.r + (end.r - start.r) * ratio),
      g: Math.round(start.g + (end.g - start.g) * ratio),
      b: Math.round(start.b + (end.b - start.b) * ratio),
    };
    return `rgb(${mix.r}, ${mix.g}, ${mix.b})`;
  }

  function hexToRgb(hex) {
    const normalized = hex.replace("#", "");
    const value = normalized.length === 3
      ? normalized.split("").map((part) => `${part}${part}`).join("")
      : normalized;
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getTodayCompletionLeaderboard() {
    const today = new Date();
    const todayKey = formatDateKey(startOfDay(today));
    return users.map((user) => ({
      user,
      count: state.tasks.reduce((total, task) => {
        if (task.recurrence !== "none") {
          if (!Array.isArray(task.completionDates) || !task.completionDates.includes(todayKey)) {
            return total;
          }
          const participantsByDate = normalizeCompletionParticipantsByDate(task.completionParticipantsByDate, task, task.completionByDate);
          return total + ((participantsByDate[todayKey] || [getDefaultCompletionUserId(task)]).includes(user.id) ? 1 : 0);
        }
        if (!task.completedAt || !isSameDay(new Date(task.completedAt), today)) {
          return total;
        }
        return total + (normalizeCompletionUserIds(task.completedByIds, task, task.completedById).includes(user.id) ? 1 : 0);
      }, 0),
    }));
  }

  function getCompletionLeaderboard() {
    return users
      .map((user) => ({
        user,
        count: state.tasks.reduce((total, task) => {
          if (task.recurrence !== "none") {
            const completionDates = Array.isArray(task.completionDates) ? task.completionDates : [];
            const participantsByDate = normalizeCompletionParticipantsByDate(task.completionParticipantsByDate, task, task.completionByDate);
            return total + completionDates.filter((dateKey) => (participantsByDate[dateKey] || [getDefaultCompletionUserId(task)]).includes(user.id)).length;
          }
          return total + (task.completedAt && normalizeCompletionUserIds(task.completedByIds, task, task.completedById).includes(user.id) ? 1 : 0);
        }, 0),
      }))
      .sort((left, right) => right.count - left.count || left.user.name.localeCompare(right.user.name));
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
    const normalized = typeof date === "string" ? parseDateKey(date) : date;
    if (!(normalized instanceof Date) || Number.isNaN(normalized.getTime())) {
      return "";
    }
    return `${normalized.getFullYear()}-${String(normalized.getMonth() + 1).padStart(2, "0")}-${String(normalized.getDate()).padStart(2, "0")}`;
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

  function isLinneaWeek(date) {
    const weekNumber = getWeekNumber(date);
    const patternOffset = ((weekNumber - 10) % 4 + 4) % 4;
    return patternOffset < 2;
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

  function shouldUseDarkMode(now = new Date()) {
    if (state.settings.darkMode) {
      return true;
    }
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours > 18 || (hours === 18 && minutes >= 30);
  }
})();

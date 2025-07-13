import React, { createContext, useContext, useState, useEffect } from "react";

// Translation type definitions
export type Language = "en" | "lt" | "ru";

export interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.events": "Events",
    "nav.team": "Team",
    "nav.settings": "Settings",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.create": "Create",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.today": "Today",
    "common.week": "This Week",
    "common.month": "This Month",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.totalEvents": "Total Events",
    "dashboard.upcomingEvents": "Upcoming Events",
    "dashboard.totalEarnings": "Total Earnings",
    "dashboard.recentActivity": "Recent Activity",

    // Events
    "events.title": "Events",
    "events.createEvent": "Create Event",
    "events.listView": "List",
    "events.calendarView": "Calendar",
    "events.totalEvents": "Total Events",
    "events.upcoming": "Upcoming",
    "events.live": "Live Events",
    "events.completed": "Completed",
    "events.cancelled": "Cancelled",
    "events.noEvents": "No events found",
    "events.noEventsDesc":
      "No events match your current filters. Try adjusting your filters or create a new event.",
    "events.createFirst": "Create Your First Event",

    // Create Event
    "createEvent.title": "Create New Event",
    "createEvent.eventDetails": "Event Details",
    "createEvent.eventName": "Event Name",
    "createEvent.description": "Description",
    "createEvent.venue": "Venue/Location",
    "createEvent.date": "Date",
    "createEvent.time": "Time",
    "createEvent.djSettings": "DJ Settings",
    "createEvent.allowFreeRequests": "Allow Free Requests",
    "createEvent.songRequestPrice": "Song Request Price ($)",
    "createEvent.menuSelection": "Menu Selection",
    "createEvent.staffAssignment": "Staff Assignment",
    "createEvent.eventCreated": "Event Created Successfully!",
    "createEvent.generateQR": "Generate QR Code",
    "createEvent.createAnother": "Create Another Event",

    // Team
    "team.title": "Team Management",
    "team.manageMember": "Manage your team members and their roles",
    "team.inviteMember": "Invite Member",
    "team.totalMembers": "Total Members",
    "team.activeMembers": "Active Members",
    "team.pendingInvites": "Pending Invites",
    "team.noMembers": "No team members yet",
    "team.noMembersDesc":
      "Start building your team by inviting DJs, baristas, and hosts to join your events.",
    "team.inviteFirst": "Invite Your First Member",

    // Settings
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.notifications": "Notifications",
    "settings.payment": "Payment",
    "settings.privacy": "Privacy",
    "settings.appearance": "Appearance",
    "settings.language": "Language",
    "settings.theme": "Theme",

    // Roles
    "role.dj": "DJ",
    "role.barista": "Barista",
    "role.host": "Host",
    "role.company": "Company",

    // Status
    "status.active": "Active",
    "status.inactive": "Inactive",
    "status.pending": "Pending",
    "status.live": "Live",
    "status.upcoming": "Upcoming",
    "status.completed": "Completed",
    "status.cancelled": "Cancelled",
  },

  lt: {
    // Navigation
    "nav.dashboard": "Valdymo skydas",
    "nav.events": "Renginiai",
    "nav.team": "Komanda",
    "nav.settings": "Nustatymai",

    // Common
    "common.loading": "Kraunama...",
    "common.error": "Klaida",
    "common.save": "Išsaugoti",
    "common.cancel": "Atšaukti",
    "common.edit": "Redaguoti",
    "common.delete": "Ištrinti",
    "common.create": "Sukurti",
    "common.search": "Ieškoti",
    "common.filter": "Filtruoti",
    "common.all": "Visi",
    "common.today": "Šiandien",
    "common.week": "Šią savaitę",
    "common.month": "Šį mėnesį",

    // Dashboard
    "dashboard.title": "Valdymo skydas",
    "dashboard.welcome": "Sveiki sugrįžę",
    "dashboard.totalEvents": "Visi renginiai",
    "dashboard.upcomingEvents": "Artėjantys renginiai",
    "dashboard.totalEarnings": "Bendri uždarbiai",
    "dashboard.recentActivity": "Paskutinė veikla",

    // Events
    "events.title": "Renginiai",
    "events.createEvent": "Sukurti renginį",
    "events.listView": "Sąrašas",
    "events.calendarView": "Kalendorius",
    "events.totalEvents": "Visi renginiai",
    "events.upcoming": "Artėjantys",
    "events.live": "Vykstantys renginiai",
    "events.completed": "Užbaigti",
    "events.cancelled": "Atšaukti",
    "events.noEvents": "Renginių nerasta",
    "events.noEventsDesc":
      "Nėra renginių, atitinkančių jūsų filtrus. Pabandykite keisti filtrus arba sukurkite naują renginį.",
    "events.createFirst": "Sukurkite pirmą renginį",

    // Create Event
    "createEvent.title": "Sukurti naują renginį",
    "createEvent.eventDetails": "Renginio informacija",
    "createEvent.eventName": "Renginio pavadinimas",
    "createEvent.description": "Aprašymas",
    "createEvent.venue": "Vieta",
    "createEvent.date": "Data",
    "createEvent.time": "Laikas",
    "createEvent.djSettings": "DJ nustatymai",
    "createEvent.allowFreeRequests": "Leisti nemokamus užsakymus",
    "createEvent.songRequestPrice": "Dainoս užsakymo kaina ($)",
    "createEvent.menuSelection": "Meniu pasirinkimas",
    "createEvent.staffAssignment": "Darbuotojų paskyrimas",
    "createEvent.eventCreated": "Renginys sėkmingai sukurtas!",
    "createEvent.generateQR": "Generuoti QR kodą",
    "createEvent.createAnother": "Sukurti kitą renginį",

    // Team
    "team.title": "Komandos valdymas",
    "team.manageMember": "Valdykite komandos narius ir jų roles",
    "team.inviteMember": "Pakviesti narį",
    "team.totalMembers": "Visi nariai",
    "team.activeMembers": "Aktyvūs nariai",
    "team.pendingInvites": "Laukiantys kvietimai",
    "team.noMembers": "Komandos narių dar nėra",
    "team.noMembersDesc":
      "Pradėkite kurti komandą pakviesdami DJ, barmenis ir vedėjus prie savo renginių.",
    "team.inviteFirst": "Pakvieskite pirmą narį",

    // Settings
    "settings.title": "Nustatymai",
    "settings.profile": "Profilis",
    "settings.notifications": "Pranešimai",
    "settings.payment": "Mokėjimai",
    "settings.privacy": "Privatumas",
    "settings.appearance": "Išvaizda",
    "settings.language": "Kalba",
    "settings.theme": "Tema",

    // Roles
    "role.dj": "DJ",
    "role.barista": "Barist.",
    "role.host": "Vedėjas",
    "role.company": "Įmonė",

    // Status
    "status.active": "Aktyvus",
    "status.inactive": "Neaktyvus",
    "status.pending": "Laukiantis",
    "status.live": "Vyksta",
    "status.upcoming": "Artėja",
    "status.completed": "Užbaigtas",
    "status.cancelled": "Atšauktas",
  },

  ru: {
    // Navigation
    "nav.dashboard": "Панель управления",
    "nav.events": "События",
    "nav.team": "Команда",
    "nav.settings": "Настройки",

    // Common
    "common.loading": "Загрузка...",
    "common.error": "Ошибка",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.edit": "Редактировать",
    "common.delete": "Удалить",
    "common.create": "Создать",
    "common.search": "Поиск",
    "common.filter": "Фильтр",
    "common.all": "Все",
    "common.today": "Сегодня",
    "common.week": "На этой неделе",
    "common.month": "В этом месяце",

    // Dashboard
    "dashboard.title": "Панель управления",
    "dashboard.welcome": "Добро пожаловать",
    "dashboard.totalEvents": "Всего событий",
    "dashboard.upcomingEvents": "Предстоящие события",
    "dashboard.totalEarnings": "Общий доход",
    "dashboard.recentActivity": "Последняя активность",

    // Events
    "events.title": "События",
    "events.createEvent": "Создать событие",
    "events.listView": "Список",
    "events.calendarView": "Календарь",
    "events.totalEvents": "Всего событий",
    "events.upcoming": "Предстоящие",
    "events.live": "Текущие события",
    "events.completed": "Завершенные",
    "events.cancelled": "Отмененные",
    "events.noEvents": "События не найдены",
    "events.noEventsDesc":
      "Нет событий, соответствующих вашим фильтрам. Попробуйте изменить фильтры или создать новое событие.",
    "events.createFirst": "Создайте ваше первое событие",

    // Create Event
    "createEvent.title": "Создать новое событие",
    "createEvent.eventDetails": "Детали события",
    "createEvent.eventName": "Название события",
    "createEvent.description": "Описание",
    "createEvent.venue": "Место проведения",
    "createEvent.date": "Дата",
    "createEvent.time": "Время",
    "createEvent.djSettings": "Настройки DJ",
    "createEvent.allowFreeRequests": "Разрешить бесплатные заказы",
    "createEvent.songRequestPrice": "Цена заказа песни ($)",
    "createEvent.menuSelection": "Выбор меню",
    "createEvent.staffAssignment": "Назначение персонала",
    "createEvent.eventCreated": "Событие успешно создано!",
    "createEvent.generateQR": "Генерировать QR код",
    "createEvent.createAnother": "Создать еще событие",

    // Team
    "team.title": "Управление командой",
    "team.manageMember": "Управляйте участниками команды и их ролями",
    "team.inviteMember": "Пригласить участника",
    "team.totalMembers": "Всего участников",
    "team.activeMembers": "Активные участники",
    "team.pendingInvites": "Ожидающие приглашения",
    "team.noMembers": "Участников команды пока нет",
    "team.noMembersDesc":
      "Начните создавать команду, приглашая DJ, бариста и ведущих на ваши события.",
    "team.inviteFirst": "Пригласите первого участника",

    // Settings
    "settings.title": "Настройки",
    "settings.profile": "Профиль",
    "settings.notifications": "Уведомления",
    "settings.payment": "Платежи",
    "settings.privacy": "Конфиденциальность",
    "settings.appearance": "Внешний вид",
    "settings.language": "Язык",
    "settings.theme": "Тема",

    // Roles
    "role.dj": "DJ",
    "role.barista": "Бариста",
    "role.host": "Ведущий",
    "role.company": "Компания",

    // Status
    "status.active": "Активный",
    "status.inactive": "Неактивный",
    "status.pending": "��жидает",
    "status.live": "Идёт",
    "status.upcoming": "Предстоящий",
    "status.completed": "Завершенный",
    "status.cancelled": "Отмененный",
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("eventflow_language");
    return (stored as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("eventflow_language", language);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation =
      translations[language][key] || translations.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value));
      });
    }

    return translation;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};

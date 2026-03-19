export const languages = {
  pl: 'Polski',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'pl';

export const routeMap: Record<string, Record<Lang, string>> = {
  buildings:   { pl: 'budynki',      en: 'buildings' },
  supervision: { pl: 'nadzor',       en: 'supervision' },
  solutions:   { pl: 'rozwiazania',  en: 'solutions' },

  about:       { pl: 'o-nas',        en: 'about' },
  contact:     { pl: 'kontakt',      en: 'contact' },
};

export const rawNavLinks: Record<Lang, { label: string; href: string }[]> = {
  pl: [
    { label: 'Strona Główna', href: '/pl/' },
    { label: 'Budynki', href: '/pl/budynki/' },
    { label: 'Nadzór', href: '/pl/nadzor/' },
    { label: 'Rozwiązania', href: '/pl/rozwiazania/' },

    { label: 'O Nas', href: '/pl/o-nas/' },
  ],
  en: [
    { label: 'Homepage', href: '/en/' },
    { label: 'Buildings', href: '/en/buildings/' },
    { label: 'Supervision', href: '/en/supervision/' },
    { label: 'Solutions', href: '/en/solutions/' },

    { label: 'About', href: '/en/about/' },
  ],
};

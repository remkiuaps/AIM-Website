import { languages, defaultLang, routeMap } from './config';
import type { Lang } from './config';
import plContent from '../content/pl.json';
import enContent from '../content/en.json';

const contentMap: Record<Lang, typeof enContent> = {
  pl: plContent as typeof enContent,
  en: enContent,
};

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function getLangFromUrl(url: URL): Lang {
  const pathWithoutBase = url.pathname.replace(base, '');
  const [, lang] = pathWithoutBase.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function getContent(lang: Lang) {
  return contentMap[lang];
}

export function url(path: string): string {
  if (path.startsWith(base)) return path;
  return `${base}${path}`;
}

export function getAlternateUrl(currentPath: string, targetLang: Lang): string {
  const pathWithoutBase = currentPath.replace(base, '');
  const currentLang = pathWithoutBase.split('/')[1] as Lang;
  if (!(currentLang in languages)) return url(`/${targetLang}/`);

  let path = pathWithoutBase;
  path = path.replace(`/${currentLang}/`, `/${targetLang}/`);

  for (const route of Object.values(routeMap)) {
    if (route[currentLang] && route[targetLang]) {
      path = path.replace(route[currentLang], route[targetLang]);
    }
  }
  return url(path);
}

export function getContactUrl(lang: Lang): string {
  return url(lang === 'pl' ? '/pl/kontakt/' : '/en/contact/');
}

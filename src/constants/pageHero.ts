/**
 * Legacy gradient hero surface (light blue / slate). Prefer the shared
 * `PageHeader` component for new screens; these tokens remain for any stragglers.
 */
export const PAGE_HERO_SURFACE =
  "absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50";

/** Optional dot texture on light heroes (slate, low contrast). */
export const PAGE_HERO_PATTERN_LIGHT =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.14'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export const PAGE_HERO_HEADER_CLASS =
  "relative overflow-hidden border-b border-slate-200/90";

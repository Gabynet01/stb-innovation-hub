import { API_ORIGIN, API_PREFIX_PATH } from "@/config/environment";
import type { IdeahubIdeaCategory, IdeahubIdeaSource } from "@/types/ideahub";
let categoriesCache: IdeahubIdeaCategory[] | null = null;
let sourcesCache: IdeahubIdeaSource[] | null = null;

export async function loadIdeaCategories(): Promise<IdeahubIdeaCategory[]> {
  if (categoriesCache) return categoriesCache;
  const url = `${API_ORIGIN}${API_PREFIX_PATH}/idea-categories/`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load idea categories: ${res.status}`);
  }
  categoriesCache = (await res.json()) as IdeahubIdeaCategory[];
  return categoriesCache;
}

export async function loadIdeaSources(): Promise<IdeahubIdeaSource[]> {
  if (sourcesCache) return sourcesCache;
  const url = `${API_ORIGIN}${API_PREFIX_PATH}/idea-sources/`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load idea sources: ${res.status}`);
  }
  sourcesCache = (await res.json()) as IdeahubIdeaSource[];
  return sourcesCache;
}

export function categoriesByIdMap(
  list: IdeahubIdeaCategory[]
): Map<number, IdeahubIdeaCategory> {
  return new Map(list.map((c) => [c.id, c]));
}

/** Clear caches (e.g. after tests or forced refresh). */
export function clearIdeaCatalogCache(): void {
  categoriesCache = null;
  sourcesCache = null;
}

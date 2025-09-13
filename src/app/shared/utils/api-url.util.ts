import { environment } from 'environments/environment';

export function apiUrl(path: string): string {
  const base = environment.api.baseUrl.replace(/\/+$/, '');
  const basePath = environment.api.basePath
    .replace(/^\/?/, '/')
    .replace(/\/+$/, '');
  const p = path.replace(/^\/?/, '/');
  return `${base}${basePath}${p}`;
}

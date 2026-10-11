export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`/api/v1${path}`, { method, headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store' });
  if (response.status === 204) return undefined as T;
  const json = await response.json();
  if (!response.ok) throw new Error(json.error?.message ?? 'Request failed.');
  return json.data as T;
}

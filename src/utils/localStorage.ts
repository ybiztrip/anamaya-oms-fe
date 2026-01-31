type StoredValue<T> = {
  v: T;
  createdAt: number;
  expiresAt?: number;
};

export function localStorageSet<T>(key: string, value: T, opts?: { ttlMs?: number }) {
  const now = Date.now();
  const data: StoredValue<T> = {
    v: value,
    createdAt: now,
    expiresAt: opts?.ttlMs ? now + opts.ttlMs : undefined,
  };
  localStorage.setItem(key, JSON.stringify(data));
}

export function localStorageGet<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredValue<T>;

    if (!parsed || !('v' in parsed)) return parsed as unknown as T;

    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.v ?? null;
  } catch {
    return null;
  }
}

export function localStorageRemove(key: string) {
  localStorage.removeItem(key);
}

export function localStorageClear() {
  localStorage.clear();
}

export function localStorageClearByPrefix(prefix: string) {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) localStorage.removeItem(k);
  }
}

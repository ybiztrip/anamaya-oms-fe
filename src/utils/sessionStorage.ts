type StoredValue<T> = {
  v: T;
  createdAt: number;
  expiresAt?: number;
};

export function sessionStorageSet<T>(key: string, value: T, opts?: { ttlMs?: number }) {
  const now = Date.now();
  const data: StoredValue<T> = {
    v: value,
    createdAt: now,
    expiresAt: opts?.ttlMs ? now + opts.ttlMs : undefined,
  };
  sessionStorage.setItem(key, JSON.stringify(data));
}

export function sessionStorageGet<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredValue<T>;

    if (!parsed || !('v' in parsed)) return parsed as unknown as T;

    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.v ?? null;
  } catch {
    return null;
  }
}

export function sessionStorageRemove(key: string) {
  sessionStorage.removeItem(key);
}

export function sessionStorageClear() {
  sessionStorage.clear();
}

export function sessionStorageClearByPrefix(prefix: string) {
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const k = sessionStorage.key(i);
    if (k && k.startsWith(prefix)) sessionStorage.removeItem(k);
  }
}

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Persist tool settings to localStorage with debounced writes.
 *
 * Returns [settings, update, reset]:
 * - update: shallow-merges a patch into current settings
 * - reset: reverts to defaults immediately
 */
export function useSettings<T extends Record<string, unknown>>(
  key: string,
  defaults: T,
): [T, (patch: Partial<T>) => void, () => void] {
  const storageKey = `studio:${key}`;

  const [settings, setSettings] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<T>;
        return { ...defaults, ...parsed };
      }
    } catch {
      // corrupted data — fall through to defaults
    }
    return defaults;
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced write to localStorage
  const writeToStorage = useCallback(
    (value: T) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        localStorage.setItem(storageKey, JSON.stringify(value));
      }, 200);
    },
    [storageKey],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const update = useCallback(
    (patch: Partial<T>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        writeToStorage(next);
        return next;
      });
    },
    [writeToStorage],
  );

  const reset = useCallback(() => {
    setSettings(defaults);
    localStorage.setItem(storageKey, JSON.stringify(defaults));
  }, [defaults, storageKey]);

  return [settings, update, reset];
}

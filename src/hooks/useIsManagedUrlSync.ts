import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

/**
 * Hook to detect if URL sync settings are managed by enterprise policy
 * Returns true if browser.storage.managed contains urlSync configuration
 */
export function useIsManagedUrlSync(): boolean {
  const [isManaged, setIsManaged] = useState(false);

  useEffect(() => {
    async function checkManagedStorage() {
      try {
        // Check if managed storage is available
        if (!browser.storage.managed) {
          setIsManaged(false);
          return;
        }

        const managed = await browser.storage.managed.get("urlSync");
        setIsManaged(!!managed.urlSync);
      } catch (error) {
        console.error("Error checking managed storage:", error);
        setIsManaged(false);
      }
    }

    checkManagedStorage();

    // Listen for managed storage changes
    if (browser.storage.managed?.onChanged) {
      const listener = (changes: Record<string, { oldValue?: unknown; newValue?: unknown }>) => {
        if (changes.urlSync) {
          setIsManaged(!!changes.urlSync.newValue);
        }
      };

      browser.storage.managed.onChanged.addListener(listener);

      return () => {
        browser.storage.managed?.onChanged.removeListener(listener);
      };
    }
  }, []);

  return isManaged;
}

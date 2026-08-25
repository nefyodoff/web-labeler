import browser from "webextension-polyfill"
import { Options, UrlSyncSettings } from "@/options/types"
import { logger } from "@/utils/logger"
import { STORAGE_KEY } from "../config"

/**
 * Read managed storage configuration (enterprise policies)
 * Returns partial options containing only managed settings (e.g., urlSync)
 */
export async function getManagedOptions(): Promise<Partial<Options>> {
  try {
    // Check if browser.storage.managed is available (Chrome enterprise only)
    if (!browser.storage.managed) {
      return {}
    }

    const managed = await browser.storage.managed.get(null)

    if (!managed || Object.keys(managed).length === 0) {
      return {}
    }

    logger.info("Managed policies loaded:", managed)

    // Only return the urlSync if it exists in managed storage
    const result: Partial<Options> = {}
    if (managed.urlSync) {
      result.urlSync = managed.urlSync as UrlSyncSettings
    }

    return result
  } catch (error) {
    logger.error("Error reading from managed storage:", error)
    return {}
  }
}

/**
 * Get effective options by merging managed policies with user preferences
 * Priority: managed settings > user settings
 */
export async function getEffectiveOptions(): Promise<Options | undefined> {
  try {
    // Get both managed and sync storage
    const [managedOptions, syncStorage] = await Promise.all([
      getManagedOptions(),
      browser.storage.sync.get(STORAGE_KEY),
    ])

    const syncOptions = syncStorage[STORAGE_KEY] as Options | undefined

    if (!syncOptions) {
      // No user options yet
      // If we have managed urlSync, return minimal options with it
      // This allows immediate sync on first install
      if (managedOptions.urlSync) {
        return {
          labels: [],
          isActive: true, // Enable extension by default for managed installs
          urlSync: managedOptions.urlSync,
        }
      }
      // No managed options either, return undefined (will trigger default initialization)
      return undefined
    }

    // Merge: managed urlSync takes precedence over user urlSync
    const effectiveOptions: Options = {
      ...syncOptions,
      ...(managedOptions.urlSync && { urlSync: managedOptions.urlSync }),
    }

    return effectiveOptions
  } catch (error) {
    logger.error("Error getting effective options:", error)
    return undefined
  }
}

/**
 * Check if urlSync is managed by enterprise policy
 */
export async function isUrlSyncManaged(): Promise<boolean> {
  const managedOptions = await getManagedOptions()
  return !!managedOptions.urlSync
}

export async function getOptions(): Promise<Options | undefined> {
  return getEffectiveOptions()
}

export async function setOptions(options: Options): Promise<void> {
  try {
    await browser.storage.sync.set({ [STORAGE_KEY]: options })
  } catch (error) {
    logger.error("Error writing to storage:", error)
    throw error
  }
}

export async function updateSyncError(
  options: Options,
  error: string
): Promise<void> {
  if (!options.urlSync) {
    return
  }

  const updatedOptions: Options = {
    ...options,
    urlSync: {
      ...options.urlSync,
      lastError: error,
    },
  }

  await setOptions(updatedOptions)
  logger.error("Sync error saved to storage:", error)
}

export async function updateSyncSuccess(
  options: Options,
  newLabels: Options["labels"],
  newCount: number,
  updatedCount: number
): Promise<void> {
  if (!options.urlSync) {
    return
  }

  const updatedOptions: Options = {
    ...options,
    labels: newLabels,
    urlSync: {
      ...options.urlSync,
      lastUpdate: Date.now(),
      lastError: undefined,
    },
  }

  await setOptions(updatedOptions)
  logger.info(
    `Sync success: ${newCount} new, ${updatedCount} updated labels saved to storage`
  )
}

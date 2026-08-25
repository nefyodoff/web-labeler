/**
 * Background Service Worker - Entry Point
 * Initializes all background functionality for the extension
 *
 * - sync/: URL fetching, validation, merging, and synchronization
 * - storage/: Chrome storage operations
 * - alarms/: Periodic sync alarm management
 * - messages/: Message handling from UI components
 */
import browser from "webextension-polyfill"
import type { Options } from "@/options/types"
import { logger } from "@/utils/logger"
import {
  checkAndRunMissedSync,
  initializeAlarm,
  setupAlarmListener,
  updateAlarm,
} from "./alarms/alarmManager"
import { STORAGE_KEY } from "./config"
import { setupMessageListener } from "./messages/handlers"
import { getOptions, setOptions } from "./storage/storageManager"

// ============================================================================
// Extension Lifecycle Listeners
// ============================================================================

browser.runtime.onStartup.addListener(async () => {
  try {
    await initializeAlarm()
    await checkAndRunMissedSync()
  } catch (error) {
    logger.error("Error on startup:", error)
  }
})

browser.runtime.onInstalled.addListener(async () => {
  try {
    await initializeAlarm()
    await checkAndRunMissedSync()
  } catch (error) {
    logger.error("Error on install:", error)
  }
})

// ============================================================================
// Storage Change Listener
// ============================================================================

browser.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === "sync" && changes[STORAGE_KEY]) {
    const oldOptions = changes[STORAGE_KEY].oldValue as Options | undefined
    const newOptions = changes[STORAGE_KEY].newValue as Options | undefined

    const oldSync = oldOptions?.urlSync
    const newSync = newOptions?.urlSync

    // Check if the alarm-relevant fields actually changed
    const enabledChanged = oldSync?.enabled !== newSync?.enabled
    const frequencyChanged =
      oldSync?.updateFrequency !== newSync?.updateFrequency

    // Only update alarm if settings that affect it changed
    if (enabledChanged || frequencyChanged) {
      try {
        await updateAlarm(
          newSync?.enabled || false,
          newSync?.updateFrequency || 0
        )

        // Clear lastUpdate when sync is disabled to avoid false "missed sync" detection
        if (!newSync?.enabled && newSync?.lastUpdate) {
          const options = await getOptions()
          if (options?.urlSync) {
            await setOptions({
              ...options,
              urlSync: {
                ...options.urlSync,
                lastUpdate: null,
              },
            })
          }
        }
      } catch (error) {
        logger.error("Error updating alarm from storage change:", error)
      }
    }
  }
})

// ============================================================================
// Managed Storage Change Listener (Enterprise Policies)
// ============================================================================

// Listen for changes to managed storage (enterprise policy updates)
if (browser.storage.managed) {
  browser.storage.managed.onChanged.addListener(async (changes) => {
    logger.info("Managed storage policy changed:", changes)

    // Check if urlSync policy changed
    if (changes.urlSync) {
      const oldUrlSync = changes.urlSync.oldValue as
        | Options["urlSync"]
        | undefined
      const newUrlSync = changes.urlSync.newValue as
        | Options["urlSync"]
        | undefined

      logger.info("URL sync policy updated", { oldUrlSync, newUrlSync })

      // Update alarm based on new managed settings
      const enabledChanged = oldUrlSync?.enabled !== newUrlSync?.enabled
      const frequencyChanged =
        oldUrlSync?.updateFrequency !== newUrlSync?.updateFrequency
      const urlChanged = oldUrlSync?.url !== newUrlSync?.url

      if (enabledChanged || frequencyChanged) {
        try {
          await updateAlarm(
            newUrlSync?.enabled || false,
            newUrlSync?.updateFrequency || 0
          )
          logger.info("Alarm updated from managed policy change")
        } catch (error) {
          logger.error("Error updating alarm from managed policy:", error)
        }
      }

      // If URL changed or sync was re-enabled, trigger immediate sync
      if ((urlChanged || enabledChanged) && newUrlSync?.enabled) {
        logger.info("Triggering immediate sync due to managed policy change")
        // Import dynamically to avoid circular dependency
        const { syncLabelsFromUrl } = await import("./sync/synchronizer")
        await syncLabelsFromUrl()
      }
    }
  })
}

// ============================================================================
// Setup Event Listeners
// ============================================================================

setupAlarmListener()
setupMessageListener()

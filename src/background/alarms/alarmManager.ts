import browser from "webextension-polyfill"
import { logger } from "@/utils/logger"
import { ALARM_NAME } from "../config"
import { getOptions } from "../storage/storageManager"
import { syncLabelsFromUrl } from "../sync/synchronizer"

export async function updateAlarm(
  enabled: boolean,
  updateFrequency: number
): Promise<void> {
  try {
    // Clear existing alarm
    await browser.alarms.clear(ALARM_NAME)

    if (enabled && updateFrequency > 0) {
      // Create new alarm with the specified frequency
      await browser.alarms.create(ALARM_NAME, {
        periodInMinutes: updateFrequency,
      })
    }
  } catch (error) {
    logger.error("Error updating alarm:", error)
  }
}

export async function initializeAlarm(): Promise<void> {
  try {
    const options = await getOptions()

    if (options?.urlSync?.enabled && options.urlSync.updateFrequency > 0) {
      // Check if alarm already exists before recreating
      const existingAlarm = await browser.alarms.get(ALARM_NAME)
      if (!existingAlarm) {
        await browser.alarms.create(ALARM_NAME, {
          periodInMinutes: options.urlSync.updateFrequency,
        })
      }
    } else {
      // Ensure alarm is cleared if disabled
      await browser.alarms.clear(ALARM_NAME)
    }
  } catch (error) {
    logger.error("Error initializing alarm:", error)
  }
}

export async function checkAndRunMissedSync(): Promise<void> {
  try {
    const options = await getOptions()

    if (!options?.urlSync?.enabled || !options.urlSync.url) {
      return
    }

    const { lastUpdate, updateFrequency } = options.urlSync

    // If updateFrequency is disabled, don't sync
    if (updateFrequency <= 0) {
      return
    }

    // If no lastUpdate, this is first run - sync immediately
    if (!lastUpdate) {
      logger.info("First sync detected, running immediately")
      await syncLabelsFromUrl()
      return
    }

    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdate
    const frequencyMs = updateFrequency * 60 * 1000

    // Check if we missed a sync (with small buffer for timing precision)
    if (timeSinceLastUpdate >= frequencyMs) {
      logger.info("Missed sync detected, running now")
      await syncLabelsFromUrl()
    }
  } catch (error) {
    logger.error("Error checking for missed sync:", error)
  }
}

export function setupAlarmListener(): void {
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_NAME) {
      await syncLabelsFromUrl()
    }
  })
}

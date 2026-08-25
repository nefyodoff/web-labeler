import { beforeEach, describe, expect, it, vi } from "vitest"
import browser from "webextension-polyfill"
import type { Options, UrlSyncSettings } from "@/options/types"
import {
  getEffectiveOptions,
  getManagedOptions,
  isUrlSyncManaged,
} from "../storageManager"

// Mock webextension-polyfill
vi.mock("webextension-polyfill", () => ({
  default: {
    storage: {
      managed: null as any,
      sync: {
        get: vi.fn(),
      },
    },
  },
}))

describe("Managed Storage Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getManagedOptions", () => {
    it("should return empty object if managed storage is not available", async () => {
      // @ts-ignore - Setting to undefined to simulate unavailable
      browser.storage.managed = undefined

      const result = await getManagedOptions()

      expect(result).toEqual({})
    })

    it("should return empty object if no managed policies configured", async () => {
      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({}),
      } as any

      const result = await getManagedOptions()

      expect(result).toEqual({})
    })

    it("should return urlSync from managed storage when configured", async () => {
      const managedUrlSync: UrlSyncSettings = {
        enabled: true,
        url: "https://company.com/labels.json",
        updateFrequency: 60,
      }

      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({ urlSync: managedUrlSync }),
      } as any

      const result = await getManagedOptions()

      expect(result).toEqual({ urlSync: managedUrlSync })
    })

    it("should handle errors gracefully", async () => {
      browser.storage.managed = {
        get: vi.fn().mockRejectedValue(new Error("Storage error")),
      } as any

      const result = await getManagedOptions()

      expect(result).toEqual({})
    })
  })

  describe("getEffectiveOptions", () => {
    it("should return undefined if no sync storage exists", async () => {
      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({}),
      } as any

      vi.mocked(browser.storage.sync.get).mockResolvedValue({})

      const result = await getEffectiveOptions()

      expect(result).toBeUndefined()
    })

    it("should return sync options when no managed storage", async () => {
      const syncOptions: Options = {
        labels: [],
        isActive: true,
        urlSync: {
          enabled: false,
          url: "https://user.com/labels.json",
          updateFrequency: 0,
        },
      }

      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({}),
      } as any

      vi.mocked(browser.storage.sync.get).mockResolvedValue({
        options: syncOptions,
      })

      const result = await getEffectiveOptions()

      expect(result).toEqual(syncOptions)
    })

    it("should prefer managed urlSync over user urlSync", async () => {
      const userUrlSync: UrlSyncSettings = {
        enabled: false,
        url: "https://user.com/labels.json",
        updateFrequency: 0,
      }

      const managedUrlSync: UrlSyncSettings = {
        enabled: true,
        url: "https://company.com/labels.json",
        updateFrequency: 60,
      }

      const syncOptions: Options = {
        labels: [
          {
            id: "1",
            name: "Production",
            bgColor: "#ff0000",
            textColor: "#ffffff",
            opacity: 1,
            shape: "triangle",
            position: "right-top",
            rules: [],
            isActive: true,
          },
        ],
        isActive: true,
        urlSync: userUrlSync,
      }

      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({ urlSync: managedUrlSync }),
      } as any

      vi.mocked(browser.storage.sync.get).mockResolvedValue({
        options: syncOptions,
      })

      const result = await getEffectiveOptions()

      expect(result).toEqual({
        ...syncOptions,
        urlSync: managedUrlSync, // Managed takes precedence
      })
    })

    it("should return managed urlSync with defaults on first install (no sync storage)", async () => {
      const managedUrlSync: UrlSyncSettings = {
        enabled: true,
        url: "https://company.com/labels.json",
        updateFrequency: 60,
      }

      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({ urlSync: managedUrlSync }),
      } as any

      // No sync storage yet (first install)
      vi.mocked(browser.storage.sync.get).mockResolvedValue({})

      const result = await getEffectiveOptions()

      expect(result).toEqual({
        labels: [],
        isActive: true, // Extension should be enabled for managed installs
        urlSync: managedUrlSync,
      })
    })

    it("should preserve user labels when merging managed urlSync", async () => {
      const managedUrlSync: UrlSyncSettings = {
        enabled: true,
        url: "https://company.com/labels.json",
        updateFrequency: 60,
      }

      const syncOptions: Options = {
        labels: [
          {
            id: "1",
            name: "My Custom Label",
            bgColor: "#00ff00",
            textColor: "#000000",
            opacity: 0.9,
            shape: "ribbon",
            position: "left-top",
            rules: [{ type: "contains", value: "localhost" }],
            isActive: true,
          },
        ],
        isActive: true,
        locale: "en",
      }

      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({ urlSync: managedUrlSync }),
      } as any

      vi.mocked(browser.storage.sync.get).mockResolvedValue({
        options: syncOptions,
      })

      const result = await getEffectiveOptions()

      expect(result?.labels).toEqual(syncOptions.labels)
      expect(result?.isActive).toEqual(syncOptions.isActive)
      expect(result?.locale).toEqual(syncOptions.locale)
      expect(result?.urlSync).toEqual(managedUrlSync)
    })

    it("should handle errors gracefully", async () => {
      browser.storage.managed = {
        get: vi.fn().mockRejectedValue(new Error("Managed storage error")),
      } as any

      vi.mocked(browser.storage.sync.get).mockRejectedValue(
        new Error("Sync storage error")
      )

      const result = await getEffectiveOptions()

      expect(result).toBeUndefined()
    })
  })

  describe("isUrlSyncManaged", () => {
    it("should return false when no managed storage", async () => {
      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({}),
      } as any

      const result = await isUrlSyncManaged()

      expect(result).toBe(false)
    })

    it("should return true when managed urlSync exists", async () => {
      const managedUrlSync: UrlSyncSettings = {
        enabled: true,
        url: "https://company.com/labels.json",
        updateFrequency: 60,
      }

      browser.storage.managed = {
        get: vi.fn().mockResolvedValue({ urlSync: managedUrlSync }),
      } as any

      const result = await isUrlSyncManaged()

      expect(result).toBe(true)
    })

    it("should return false on error", async () => {
      browser.storage.managed = {
        get: vi.fn().mockRejectedValue(new Error("Storage error")),
      } as any

      const result = await isUrlSyncManaged()

      expect(result).toBe(false)
    })
  })
})

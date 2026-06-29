import browser from "webextension-polyfill"
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useOptionsContext } from "@/contexts/OptionsContext"
import { MessageKey, SupportedLocale, TranslationFunction, RTL_LOCALES } from "@/i18n"
import { DEFAULT_LOCALE } from "@/i18n"

interface MessageEntry {
  message: string
  description?: string
}

type MessagesMap = Record<string, MessageEntry>

export interface TranslationContextValue {
  t: TranslationFunction
  currentLocale: SupportedLocale
  isRtl: boolean
  isReady: boolean
}

const TranslationContext = createContext<TranslationContextValue | undefined>(
  undefined
)

const messagesCache = new Map<SupportedLocale, MessagesMap>()

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { options, isInitialized } = useOptionsContext()
  const userLocale = options.locale

  const browserLocale = browser.i18n
    .getUILanguage()
    .split("-")[0] as SupportedLocale
  const effectiveLocale = userLocale || browserLocale || DEFAULT_LOCALE

  const [messages, setMessages] = useState<MessagesMap | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Don't load messages until options are initialized
    if (!isInitialized) {
      setIsReady(false)
      return
    }

    const loadMessages = async () => {
      if (!userLocale) {
        setMessages(null)
        setIsReady(true) // Ready immediately when using browser default
        return
      }

      if (messagesCache.has(effectiveLocale)) {
        setMessages(messagesCache.get(effectiveLocale)!)
        setIsReady(true) // Ready immediately when cached
        return
      }

      setIsReady(false) // Not ready while fetching
      try {
        const response = await fetch(
          `/_locales/${effectiveLocale}/messages.json`
        )
        const loadedMessages = await response.json()
        messagesCache.set(effectiveLocale, loadedMessages)
        setMessages(loadedMessages)
        setIsReady(true) // Ready after successful fetch
      } catch (error) {
        console.error(`Failed to load locale ${effectiveLocale}:`, error)
        if (effectiveLocale !== DEFAULT_LOCALE) {
          try {
            const response = await fetch(
              `/_locales/${DEFAULT_LOCALE}/messages.json`
            )
            const fallbackMessages = await response.json()
            setMessages(fallbackMessages)
            setIsReady(true) // Ready after fallback loads
          } catch (fallbackError) {
            console.error("Failed to load fallback locale:", fallbackError)
            setIsReady(true) // Ready even if fallback fails (will use key as fallback)
          }
        } else {
          setIsReady(true) // Ready even if fetch fails (will use key as fallback)
        }
      }
    }

    loadMessages()
  }, [effectiveLocale, userLocale, isInitialized])

  const t = useCallback<TranslationFunction>(
    (key: MessageKey, substitutions?: string | string[]) => {
      if (!userLocale) {
        return browser.i18n.getMessage(key, substitutions)
      }

      if (messages && messages[key]) {
        let message = messages[key].message

        if (substitutions) {
          const subs = Array.isArray(substitutions)
            ? substitutions
            : [substitutions]
          subs.forEach((sub, index) => {
            message = message.replace(`$${index + 1}`, sub)
          })
        }

        return message
      }

      const browserMessage = browser.i18n.getMessage(key, substitutions)
      if (browserMessage) {
        return browserMessage
      }

      console.warn(`Translation missing for key: ${key}`)
      return key
    },
    [messages, userLocale]
  )

  const isRtl = RTL_LOCALES.includes(effectiveLocale)

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr"
  }, [isRtl])

  const value = useMemo(
    () => ({ t, currentLocale: effectiveLocale, isRtl, isReady }),
    [t, effectiveLocale, isRtl, isReady]
  )

  // Wait for options to initialize before rendering
  // This prevents flash of browser locale before user locale loads
  if (!isInitialized) {
    return null
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export { TranslationContext }

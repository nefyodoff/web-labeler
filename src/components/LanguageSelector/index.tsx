import { useState } from "react"
import {
  ActionIcon,
  Combobox,
  Divider,
  Group,
  Stack,
  Text,
  useCombobox,
} from "@mantine/core"
import { IconWorld } from "@tabler/icons-react"
import * as flags from "country-flag-icons/react/1x1"
import browser from "webextension-polyfill"
import { useOptionsContext, useTranslation } from "@/contexts"
import { SUPPORTED_LANGUAGES, SupportedLocale } from "@/i18n"
import styles from "./styles.module.css"

function LanguageSelector() {
  const { options, dispatch } = useOptionsContext()
  const { t, currentLocale } = useTranslation()
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      combobox.focusTarget()
      setSearch("")
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput()
    },
  })
  const [search, setSearch] = useState("")

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLocale) ||
    SUPPORTED_LANGUAGES[0]

  const handleLanguageChange = (locale: SupportedLocale) => {
    dispatch({ type: "setLocale", payload: { locale } })
    combobox.closeDropdown()
  }

  const clearLanguageOverride = () => {
    dispatch({ type: "setLocale", payload: { locale: undefined } })
    combobox.closeDropdown()
  }

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (language) =>
      language.name.toLowerCase().includes(search.toLowerCase()) ||
      language.nativeName.toLowerCase().includes(search.toLowerCase())
  )

  const CurrentFlag =
    flags[currentLanguage.flag as keyof typeof flags] || IconWorld

  return (
    <Combobox
      store={combobox}
      position="bottom-end"
      shadow="md"
      width={330}
      onOptionSubmit={(value) => {
        if (value === "browser") {
          clearLanguageOverride()
        } else {
          handleLanguageChange(value as SupportedLocale)
        }
      }}
    >
      <Combobox.Target>
        <ActionIcon
          variant="default"
          size="lg"
          radius="xl"
          aria-label="Select language"
          title={`${t("language_select")}: ${currentLanguage.nativeName}`}
          onClick={() => combobox.toggleDropdown()}
        >
          <CurrentFlag className={styles.flag} />
        </ActionIcon>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={t("language_select")}
        />

        <Combobox.Options className={styles.optionsWrapper}>
          <Stack gap={0}>
            {filteredLanguages.map((language) => {
              const Flag =
                flags[language.flag as keyof typeof flags] || IconWorld
              return (
                <Combobox.Option
                  key={language.code}
                  value={language.code}
                  className={
                    currentLocale === language.code
                      ? `${styles.option} ${styles.optionSelected}`
                      : styles.option
                  }
                >
                  <Group gap="xs" wrap="nowrap">
                    <Flag className={styles.flag} />
                    <Group
                      justify="space-between"
                      className={styles.optionContent}
                      gap="xs"
                      wrap="nowrap"
                    >
                      <Text size="sm" className={styles.languageName}>
                        {language.name}
                      </Text>
                      <Text size="xs" c="dimmed" className={styles.nativeName}>
                        {language.nativeName}
                      </Text>
                    </Group>
                  </Group>
                </Combobox.Option>
              )
            })}
          </Stack>
        </Combobox.Options>

        <Divider />

        <Combobox.Option
          value="browser"
          disabled={!options.locale}
          className={styles.option}
        >
          <Text size="sm" c="dimmed" className={styles.browserOption}>
            {browser.i18n.getMessage("language_useBrowser")}
          </Text>
        </Combobox.Option>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default LanguageSelector

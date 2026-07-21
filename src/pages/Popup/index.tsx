import { useCallback, useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  Image,
  Loader,
  ScrollArea,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { IconCheck, IconSettings } from "@tabler/icons-react"
import browser from "webextension-polyfill"
import { LabelListCompact } from "@/components/Label/List"
import { useOptionsContext } from "@/contexts"
import { useTranslation } from "@/contexts"
import {
  type LabelMatch,
  isBrowserUrl,
  matchLabelWithRule,
} from "@/utils/labelMatching"
import PopupAddRule from "./components/PopupAddRule"
import PopupMatchedLabel from "./components/PopupMatchedLabel"

function Popup() {
  const { options, dispatch } = useOptionsContext()
  const { t } = useTranslation()

  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [labelMatch, setLabelMatch] = useState<LabelMatch | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bannerMessage, setBannerMessage] = useState<string | null>(null)
  const bannerTimer = useRef<ReturnType<typeof setTimeout>>()
  const { ref: contentRef, height: contentHeight } = useElementSize()

  const showBanner = useCallback((message: string) => {
    clearTimeout(bannerTimer.current)
    setBannerMessage(message)
    bannerTimer.current = setTimeout(() => setBannerMessage(null), 2000)
  }, [])

  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const url = tabs[0]?.url || ""
      setCurrentUrl(url)

      // Match label if URL is not a chrome URL
      if (!isBrowserUrl(url)) {
        const matched = matchLabelWithRule(options, url, false, false)
        setLabelMatch(matched)
      } else {
        setLabelMatch(null)
      }

      setIsLoading(false)
    })
  }, [options])

  // Render content based on current state
  const renderContent = () => {
    if (isLoading) {
      return (
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      )
    }

    // View 1: Chrome URLs or empty - show compact list
    if (isBrowserUrl(currentUrl)) {
      return (
        <ScrollArea.Autosize mah={250} type="auto" offsetScrollbars="present">
          <LabelListCompact />
        </ScrollArea.Autosize>
      )
    }

    // View 3: URL matches a label
    if (labelMatch) {
      return (
        <PopupMatchedLabel
          label={labelMatch.label}
          matchedRule={labelMatch.rule}
          currentUrl={currentUrl}
          onRuleSaved={() => showBanner(t("popup_ruleSaved"))}
        />
      )
    }

    // View 2: URL doesn't match - show add rule form
    return (
      <PopupAddRule
        currentUrl={currentUrl}
        onRuleSaved={() => showBanner(t("popup_ruleAdded"))}
      />
    )
  }

  return (
    <Container p={12} w={300}>
      <Box
        style={{
          height: contentHeight,
          overflow: "hidden",
          transition: "height 200ms ease",
        }}
      >
        <Box ref={contentRef}>
          <Stack gap={16}>
            <Group wrap="nowrap" justify="space-between">
              <Group wrap="nowrap" gap={6}>
                <Image src="/icon/icon-16.png" w={16} h={16} />
                <Title order={1} size="h5">
                  {t("popup_title")}
                </Title>
              </Group>
              <Group wrap="nowrap" gap={6}>
                <Switch
                  size="sm"
                  onLabel={t("popup_switchOn")}
                  offLabel={t("popup_switchOff")}
                  checked={options.isActive}
                  onChange={() => {
                    dispatch({ type: "toggleActive" })
                  }}
                />
              </Group>
            </Group>

            {renderContent()}
          </Stack>

          {!!bannerMessage && (
            <Group gap={6} mt={16} c="green">
              <IconCheck size={13} />
              <Text size="xs" fw={500}>
                {bannerMessage}
              </Text>
            </Group>
          )}

          <Divider my={16} />

          <Button
            size="xs"
            fullWidth
            variant="default"
            leftSection={<IconSettings size={14} />}
            onClick={() => {
              browser.runtime.openOptionsPage()
            }}
          >
            {t("popup_manageLabels")}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Popup

import {
  Button,
  CloseButton,
  Group,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
  Badge,
} from "@mantine/core"
import { IconRefresh, IconLock } from "@tabler/icons-react"
import { useOptionsContext } from "@/contexts"
import { useTranslation } from "@/contexts"
import { UPDATE_FREQUENCIES } from "@/utils/constants.ts"
import { SyncAlerts } from "./SyncAlerts.tsx"
import { getCloudIcon, getTooltipText } from "./cloudServiceHelpers.tsx"
import { ICON_SIZE } from "./constants.ts"
import { useCloudUrl } from "./useCloudUrl.ts"
import { useImportFromUrlForm } from "./useImportFromUrlForm.ts"
import { useIsManagedUrlSync } from "@/hooks/useIsManagedUrlSync.ts"

function ConfigurationImportFromUrl({
  closeConfigurationManager,
}: {
  closeConfigurationManager?: () => void
}) {
  const { options, dispatch } = useOptionsContext()
  const urlSync = options.urlSync
  const { t } = useTranslation()
  const isManaged = useIsManagedUrlSync()

  const updateFrequencyOptions = UPDATE_FREQUENCIES.map((freq) => ({
    value: freq.value,
    label: t(freq.labelKey),
  }))

  const {
    form,
    permissionError,
    errorMessage,
    handleClear,
    handleSync,
    handleSaveSettings,
    isLoading,
  } = useImportFromUrlForm({
    urlSync,
    dispatch,
    closeConfigurationManager,
  })

  const { cloudService, hasTransformation } = useCloudUrl(form.values.url)

  return (
    <Stack gap="md">
      {isManaged && (
        <Badge
          variant="light"
          color="blue"
          leftSection={<IconLock size={12} />}
          size="lg"
        >
          Managed by your organization
        </Badge>
      )}

      <TextInput
        label={t("importFromUrl_label")}
        description={t("importFromUrl_description")}
        placeholder={t("importFromUrl_placeholder")}
        {...form.getInputProps("url")}
        disabled={isManaged}
        leftSection={
          <Tooltip
            label={getTooltipText(cloudService, hasTransformation)}
            position="right"
          >
            {getCloudIcon(cloudService)}
          </Tooltip>
        }
        rightSection={
          <CloseButton
            aria-label={t("importFromUrl_clearInput")}
            onClick={handleClear}
            style={{ display: form.values.url ? undefined : "none" }}
            disabled={isManaged}
          />
        }
      />

      <Input.Wrapper
        label={t("importFromUrl_autoSync")}
        description={t("importFromUrl_autoSync_description")}
        styles={{
          description: { marginBottom: 4 },
        }}
      >
        <Group gap="sm">
          <Select
            data={updateFrequencyOptions}
            {...form.getInputProps("updateFrequency")}
            allowDeselect={false}
            style={{ flexGrow: 1 }}
            disabled={isManaged}
          />
          <Switch 
            {...form.getInputProps("enabled", { type: "checkbox" })} 
            disabled={isManaged}
          />
        </Group>
      </Input.Wrapper>

      {urlSync?.lastUpdate && (
        <Text size="xs" c="dimmed">
          {t("importFromUrl_lastSynced", [
            new Date(urlSync.lastUpdate).toLocaleString(),
          ])}
        </Text>
      )}

      <Group gap="xs">
        <Button
          variant="light"
          size="sm"
          leftSection={<IconRefresh size={ICON_SIZE} />}
          onClick={handleSync}
          disabled={!form.values.url.trim() || isLoading}
          loading={isLoading}
        >
          {t("importFromUrl_syncNow")}
        </Button>

        <Button
          variant="filled"
          size="sm"
          onClick={handleSaveSettings}
          disabled={!form.isDirty() || isManaged}
        >
          {t("importFromUrl_saveSettings")}
        </Button>
      </Group>

      <SyncAlerts
        permissionError={permissionError}
        errorMessage={errorMessage}
      />
    </Stack>
  )
}

export default ConfigurationImportFromUrl

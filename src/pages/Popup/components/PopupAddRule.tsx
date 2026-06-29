import { useState } from "react"
import { Button, Stack, Text } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { LabelSelector } from "@/components/Label"
import { useOptionsContext, useTranslation } from "@/contexts"
import { useLabelOperations } from "@/hooks/useLabelOperations"
import { Rule } from "@/options/types"
import FormHeader from "./FormHeader"
import RuleForm from "./RuleForm"

interface PopupAddRuleProps {
  currentUrl: string
}

function PopupAddRule({ currentUrl }: PopupAddRuleProps) {
  const { options } = useOptionsContext()
  const { t } = useTranslation()
  const { addRuleToLabel } = useLabelOperations()

  const [showForm, setShowForm] = useState<boolean>(false)
  const [selectedLabelId, setSelectedLabelId] = useState<string>("")

  if (options.labels.length === 0) {
    return (
      <Text size="xs" c="dimmed" ta="center">
        {t("popup_noLabels")}
      </Text>
    )
  }

  if (!showForm) {
    return (
      <Stack gap={8}>
        <Text size="xs" c="dimmed" ta="center">
          {t("popup_noMatchInfo")}
        </Text>
        <Button
          size="xs"
          fullWidth
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={() => setShowForm(true)}
        >
          {t("popup_addToLabel")}
        </Button>
      </Stack>
    )
  }

  const handleSaveRule = (newRule: Rule) => {
    if (!selectedLabelId) {
      return
    }

    addRuleToLabel(selectedLabelId, newRule)

    // Close form to provide feedback that rule was added
    // If rule matches current tab, parent will show matched view
    // If rule doesn't match, user sees initial "Add to Label" button
    setShowForm(false)

    // Reset selected label for next add operation
    setSelectedLabelId("")
  }

  return (
    <Stack gap={8}>
      <FormHeader
        title={t("popup_addRuleTitle")}
        onClose={() => setShowForm(false)}
      />

      <LabelSelector
        selectedLabelId={selectedLabelId}
        onSelect={setSelectedLabelId}
      />

      <RuleForm
        currentUrl={currentUrl}
        selectedLabelId={selectedLabelId}
        onSave={handleSaveRule}
        autoSwitchOnEdit
      />
    </Stack>
  )
}

export default PopupAddRule

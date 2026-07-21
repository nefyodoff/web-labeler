import { useState } from "react"
import { ActionIcon, Group, Stack, Switch, Text, Tooltip } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconEdit, IconReplace, IconTrash } from "@tabler/icons-react"
import ConfirmationModal from "@/components/ConfirmationModal"
import { LabelBadge } from "@/components/Label"
import { LabelSelector } from "@/components/Label"
import { useOptionsContext, useTranslation } from "@/contexts"
import { useLabelOperations } from "@/hooks/useLabelOperations"
import { positions } from "@/options/constants"
import { Label, Rule } from "@/options/types"
import { formatRuleInfo } from "@/utils/ruleFormatters"
import FormHeader from "./FormHeader"
import RuleForm from "./RuleForm"
import styles from "./PopupMatchedLabel.module.scss"

interface PopupMatchedLabelProps {
  label: Label
  matchedRule: Rule
  currentUrl: string
  onRuleSaved: () => void
}

function PopupMatchedLabel({
  label,
  matchedRule,
  currentUrl,
  onRuleSaved,
}: PopupMatchedLabelProps) {
  const { options, dispatch } = useOptionsContext()
  const { t } = useTranslation()
  const { updateRuleInLabel, moveRuleBetweenLabels, deleteRuleFromLabel } =
    useLabelOperations()

  const [isEditing, setIsEditing] = useState(false)
  const [selectedLabelId, setSelectedLabelId] = useState(label.id)

  const handleToggleActive = () => {
    dispatch({
      type: "toggleLabelStatus",
      payload: { id: label.id },
    })
  }

  const handleCyclePosition = () => {
    const currentIndex = positions.indexOf(label.position)
    const nextIndex = (currentIndex + 1) % positions.length
    const nextPosition = positions[nextIndex]

    const updatedLabel: Label = {
      ...label,
      position: nextPosition,
    }

    dispatch({
      type: "updateLabel",
      payload: { label: updatedLabel },
    })
  }

  const handleSaveEdit = (updatedRule: Rule) => {
    if (selectedLabelId !== label.id) {
      moveRuleBetweenLabels(label.id, selectedLabelId, matchedRule, updatedRule)
    } else {
      updateRuleInLabel(label.id, matchedRule, updatedRule)
    }
    setIsEditing(false)
    onRuleSaved()
  }

  const handleDeleteRule = () => {
    modals.open({
      title: t("popup_deleteRuleTitle"),
      size: "sm",
      centered: true,
      styles: { title: { fontSize: 14 } },
      transitionProps: { transition: "pop-bottom-right" },
      children: (
        <ConfirmationModal
          variant="compact"
          message={t("popup_deleteRuleConfirm")}
          onConfirm={() => {
            deleteRuleFromLabel(label.id, matchedRule)
            modals.closeAll()
          }}
          onClose={() => modals.closeAll()}
        />
      ),
    })
  }

  const showPositionSwitcher = label.shape !== "frame"

  const ruleInfo = formatRuleInfo(matchedRule, t)

  if (isEditing) {
    return (
      <Stack gap={8}>
        <FormHeader
          title={t("popup_editRuleTitle")}
          onClose={() => setIsEditing(false)}
        />

        <LabelSelector
          selectedLabelId={selectedLabelId}
          onSelect={setSelectedLabelId}
        />

        <RuleForm
          currentUrl={currentUrl}
          initialRule={matchedRule}
          onSave={handleSaveEdit}
        />
      </Stack>
    )
  }

  return (
    <Stack gap={8}>
      <Text size="xs" fw={500} c="dimmed">
        {t("popup_matchedLabel")}
      </Text>

      <Group wrap="nowrap" gap={6} justify="space-between">
        <LabelBadge label={label} size="sm" p={8} />

        <Group gap={6} wrap="nowrap">
          {showPositionSwitcher && (
            <Tooltip
              openDelay={1000}
              label={<Text size="xs">{t("popup_cyclePosition")}</Text>}
              withArrow
            >
              <ActionIcon
                variant="default"
                size="sm"
                radius="xl"
                onClick={handleCyclePosition}
                aria-label={t("popup_cyclePosition")}
              >
                <IconReplace size={14} />
              </ActionIcon>
            </Tooltip>
          )}

          <Switch
            size="xs"
            disabled={!options.isActive}
            checked={label.isActive}
            onChange={handleToggleActive}
          />
        </Group>
      </Group>

      <Group wrap="nowrap" gap={6} justify="space-between" align="center">
        <Text size="xs" c="dimmed" className={styles.ruleInfo}>
          {ruleInfo}
        </Text>
        <Group gap={4} wrap="nowrap">
          <Tooltip
            openDelay={1000}
            label={<Text size="xs">{t("popup_editRule")}</Text>}
            withArrow
          >
            <ActionIcon
              variant="light"
              color="blue"
              size="sm"
              radius="xl"
              onClick={() => setIsEditing(true)}
              aria-label={t("popup_editRule")}
            >
              <IconEdit size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            openDelay={1000}
            label={<Text size="xs">{t("popup_deleteRule")}</Text>}
            withArrow
          >
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              radius="xl"
              onClick={handleDeleteRule}
              aria-label={t("popup_deleteRule")}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Stack>
  )
}

export default PopupMatchedLabel

export type SupportedLocale =
  | "en"
  | "ru"
  | "de"
  | "es"
  | "fr"
  | "hi"
  | "it"
  | "ja"
  | "ko"
  | "pt_BR"
  | "pt_PT"
  | "uk"
  | "zh_CN"
  | "ar"      // Arabic
  | "he"      // Hebrew
  | "cs"      // Czech
  | "et"      // Estonian
  | "fi"      // Finnish
  | "fil"     // Filipino
  | "hu"      // Hungarian
  | "id"      // Indonesian
  | "lt"      // Lithuanian
  | "lv"      // Latvian
  | "ro"      // Romanian
  | "sk"      // Slovak
  | "sr"      // Serbian
  | "sv"      // Swedish
  | "tr"      // Turkish

export interface LanguageConfig {
  code: SupportedLocale
  name: string
  nativeName: string
  flag: string
}

// Define all message keys as a const array
export const MESSAGE_KEYS = [
  // App metadata
  "appName",
  "appDescription",
  // Common strings
  "common_save",
  "common_confirm",
  "common_cancel",
  "common_delete",
  "common_noname",
  // Options page
  "optionsPage_title",
  "optionsPage_switchOn",
  "optionsPage_switchOff",
  // Popup
  "popup_title",
  "popup_switchOn",
  "popup_switchOff",
  "popup_manageLabels",
  "popup_noLabels",
  "popup_noMatchInfo",
  "popup_addToLabel",
  "popup_addRuleTitle",
  "popup_selectLabel_placeholder",
  "popup_addRule",
  "popup_matchedLabel",
  "popup_cyclePosition",
  "popup_currentPosition",
  "popup_editRule",
  "popup_editRuleTitle",
  "popup_deleteRule",
  "popup_deleteRuleTitle",
  "popup_deleteRuleConfirm",
  // Label form fields
  "label_name",
  "label_name_placeholder",
  "label_shape",
  "label_backgroundColor",
  "label_backgroundColor_placeholder",
  "label_textColor",
  "label_textColor_placeholder",
  "label_opacity",
  "label_hoveredOpacity",
  "label_scale",
  "label_fontSize",
  "label_border",
  "label_borderColor",
  "label_borderColor_placeholder",
  "label_borderWidth",
  "label_settings",
  "label_preview",
  "label_preview_window",
  "label_preview_yourTab",
  // Shape options
  "label_shape_triangle",
  "label_shape_ribbon",
  "label_shape_banner",
  "label_shape_frame",
  // Border options
  "label_border_none",
  "label_border_solid",
  "label_border_dashed",
  "label_border_dotted",
  // Icon settings
  "label_faviconStyling",
  "label_iconOnlyMode",
  "label_iconOnlyMode_description",
  "label_iconOnlyMode_alert_title",
  "label_iconOnlyMode_alert_message",
  "label_iconStyle_none",
  "label_iconStyle_badge",
  // Collapse button
  "label_collapseButton_less",
  "label_collapseButton_more",
  // Rules
  "rules_addRule",
  "rules_placeholder_regexp",
  "rules_placeholder_fullUrl",
  "rules_placeholder_hostname",
  "rules_validation_empty",
  "rules_validation_invalidRegexp",
  // Rule types
  "ruleType_contains",
  "ruleType_startsWith",
  "ruleType_endsWith",
  "ruleType_matches",
  "ruleType_regexp",
  // Source types
  "sourceType_hostname",
  "sourceType_fullUrl",
  // Label list
  "labelList_addLabel",
  "labelList_newLabel",
  "labelList_deleteLabels",
  "labelList_deleteLabel",
  "labelList_deleteConfirm_multiple",
  "labelList_deleteConfirm_single",
  "labelList_combine",
  "labelList_combineTitle",
  "labelList_header_name",
  "labelList_header_rules",
  "labelList_header_settings",
  "labelList_header_actions",
  "labelList_empty",
  "labelList_tooltip_reorder",
  // Label settings
  "labelSettings_badge",
  "labelSettings_badge_iconOnly",
  "labelSettings_icon",
  "labelSettings_rules",
  "labelSettings_rules_tooltip",
  "labelSettings_experimental",
  "labelSettings_experimental_message",
  "labelSettings_experimental_enjoy",
  // Combine modal
  "combineModal_selectTarget",
  "combineModal_explanation",
  "combineModal_confirmQuestion",
  // Confirmation modal
  "confirmationModal_defaultMessage",
  // Position control
  "positionControl_tooltip",
  // Export
  "export_selected",
  "export_all",
  // Import
  "import_title",
  "import_button",
  "import_fromFile",
  "import_fromUrl",
  "import_fromExtension",
  // Import tabs
  "importTab_fromFile",
  "importTab_fromUrl",
  "importTab_fromExtension",
  // Import from file
  "importFromFile_dropzone",
  "importFromFile_dropzone_description",
  "importFromFile_error_title",
  // Import from URL
  "importFromUrl_label",
  "importFromUrl_description",
  "importFromUrl_placeholder",
  "importFromUrl_clearInput",
  "importFromUrl_autoSync",
  "importFromUrl_autoSync_description",
  "importFromUrl_lastSynced",
  "importFromUrl_syncNow",
  "importFromUrl_saveSettings",
  "importFromUrl_cloudService_generic",
  "importFromUrl_cloudService_detected",
  "importFromUrl_cloudService_direct",
  "importFromUrl_permissionRequired",
  "importFromUrl_syncFailed",
  // Cloud services
  "cloudService_googleDrive",
  "cloudService_oneDrive",
  "cloudService_dropbox",
  // Import from extension
  "importFromExtension_alert_title",
  "importFromExtension_alert_message",
  "importFromExtension_selectLabel",
  "importFromExtension_combineMode",
  "importFromExtension_combineMode_description",
  "importFromExtension_dropzone",
  "importFromExtension_dropzone_description",
  "importFromExtension_error_title",
  // Import labels modal
  "importLabels_title_default",
  "importLabels_title_fromFile",
  "importLabels_title_fromUrl",
  "importLabels_title_fromExtension",
  "importLabels_prefix_default",
  "importLabels_prefix_file",
  "importLabels_prefix_url",
  "importLabels_prefix_extension",
  "importLabels_prefix_extension_combined",
  "importLabels_message_new",
  "importLabels_message_updated",
  "importLabels_label_singular",
  "importLabels_label_plural",
  // Validation errors
  "validation_invalidUrl",
  "validation_permissionDenied",
  "validation_invalidArray",
  "validation_emptyFile",
  "validation_invalidItem",
  "validation_missingField",
  "validation_invalidLabels",
  "validation_invalidLabelsUrl",
  "validation_communicationError",
  "validation_fetchFailed",
  "validation_error",
  "validation_unknownError",
  // Update frequencies
  "updateFrequency_disabled",
  "updateFrequency_15min",
  "updateFrequency_30min",
  "updateFrequency_1hour",
  "updateFrequency_6hours",
  "updateFrequency_24hours",
  // Auto sync
  "autoSync_label",
  "autoSync_syncUrl",
  "autoSync_lastPrefix",
  "autoSync_error",
  "autoSync_syncError",
  "autoSync_syncNow",
  // Relative time
  "relativeTime_justNow",
  "relativeTime_minutesAgo",
  "relativeTime_minutesAgo_plural",
  "relativeTime_hoursAgo",
  "relativeTime_hoursAgo_plural",
  "relativeTime_daysAgo",
  "relativeTime_daysAgo_plural",
  // Footer
  "footer_helpful",
  "footer_rate",
  // Feature badges
  "featureBadge_contactDeveloper",
  "featureBadge_rate",
  // Theme switcher
  "themeSwitcher_ariaLabel",
  // Language selector
  "language_select",
  "language_useBrowser",
  "languageSelector_ariaLabel",
] as const

// Derive the MessageKey type from the array
export type MessageKey = (typeof MESSAGE_KEYS)[number]

export type TranslationFunction = (
  key: MessageKey,
  substitutions?: string | string[]
) => string

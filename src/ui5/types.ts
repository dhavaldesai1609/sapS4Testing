/**
 * Shared types for UI5 control discovery and proxies.
 */

export type UI5ControlType =
  | 'sap.m.Button'
  | 'sap.m.Input'
  | 'sap.m.Text'
  | 'sap.m.Title'
  | 'sap.m.Label'
  | 'sap.m.Select'
  | 'sap.m.ComboBox'
  | 'sap.m.MultiComboBox'
  | 'sap.m.CheckBox'
  | 'sap.m.RadioButton'
  | 'sap.m.Switch'
  | 'sap.m.DatePicker'
  | 'sap.m.DateTimePicker'
  | 'sap.m.TimePicker'
  | 'sap.m.TextArea'
  | 'sap.m.SearchField'
  | 'sap.m.Table'
  | 'sap.m.List'
  | 'sap.m.Dialog'
  | 'sap.m.MessageBox'
  | 'sap.m.MessageToast'
  | 'sap.m.MessageStrip'
  | 'sap.m.ObjectHeader'
  | 'sap.m.ObjectIdentifier'
  | 'sap.m.ObjectStatus'
  | 'sap.m.ObjectNumber'
  | 'sap.m.Link'
  | 'sap.m.IconTabBar'
  | 'sap.m.IconTabFilter'
  | 'sap.m.Page'
  | 'sap.m.NavContainer'
  | 'sap.m.OverflowToolbar'
  | 'sap.m.Toolbar'
  | 'sap.m.Bar'
  | 'sap.ui.table.Table'
  | 'sap.ui.table.Column'
  | 'sap.ui.comp.smarttable.SmartTable'
  | 'sap.ui.comp.smartfilterbar.SmartFilterBar'
  | 'sap.ui.comp.smartfield.SmartField'
  | 'sap.ui.comp.valuehelpdialog.ValueHelpDialog'
  | 'sap.uxap.ObjectPageLayout'
  | 'sap.uxap.ObjectPageSection'
  | 'sap.uxap.ObjectPageSubSection'
  | 'sap.f.DynamicPage'
  | 'sap.f.DynamicPageHeader'
  | 'sap.f.DynamicPageTitle'
  | 'sap.ui.mdc.Table'
  | 'sap.ui.mdc.FilterBar'
  | string;

export interface ControlQuery {
  id?: string | RegExp;
  controlType?: UI5ControlType;
  properties?: Record<string, string | number | boolean | RegExp>;
  searchOpenDialogs?: boolean;
  viewName?: string;
  viewNamespace?: string;
  visible?: boolean;
  index?: number;
}

export interface ControlInfo {
  id: string;
  controlType: string;
  visible: boolean;
  enabled: boolean;
  text?: string;
  value?: string;
  selectedKey?: string;
  properties: Record<string, unknown>;
  domRefId?: string;
}

export type InteractionStrategy = 'UI5Native' | 'DomFirst' | 'Hybrid';

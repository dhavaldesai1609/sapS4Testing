/**
 * @deprecated Prefer imports from `src/ui5` (ControlProxy, waits, registry).
 * This file re-exports for backward compatibility with early v1 specs.
 */
export { waitForUI5Stable, waitForControl, waitForMessage, waitForBusyGone } from '../ui5/waits';
export { control, controls, UI5ControlProxy } from '../ui5/ControlProxy';
export type { ControlQuery, ControlInfo, UI5ControlType, InteractionStrategy } from '../ui5/types';
export { navigateToApp } from './navigation';

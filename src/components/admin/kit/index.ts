// Building blocks for dashboard screens. See README.md next to this file.
export { AdminPage, type Crumb } from "./AdminPage";
export { AdminHub, type HubGroup, type HubItem } from "./AdminHub";
export { SaveBar } from "./SaveBar";
export { ReadError } from "./ReadError";
export { useDraft } from "./useDraft";
export { useUnsavedChangesGuard } from "./useUnsavedChangesGuard";
export { useAdminDoc, useAdminDocPeek, peekAdminDoc, invalidateAdminDocs, type AdminDoc, type SaveOptions } from "../data/useAdminDoc";
export { useAdminList, invalidateAdminLists, type AdminList, type AdminListOptions } from "../data/useAdminList";
export { useAdminCounts, refreshAdminCounts, type AdminCounts } from "../data/useAdminCounts";

import type { AuditStatus } from "../data/materials";
import { STATUS_DESCRIPTIONS, STATUS_LABELS } from "../lib/format";

export function StatusBadge({ status }: { status: AuditStatus }) {
  return (
    <span className={`status-badge status-badge--${status.toLowerCase()}`} title={STATUS_DESCRIPTIONS[status]}>
      {STATUS_LABELS[status]}
    </span>
  );
}

import { ApplicationStatus } from "@/lib/generated/prisma/enums";

const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-100",
  [ApplicationStatus.REVIEWED]: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  [ApplicationStatus.SHORTLISTED]: "bg-gold-100 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400",
  [ApplicationStatus.OFFERED]: "bg-teal-500 text-white dark:bg-teal-500",
  [ApplicationStatus.REJECTED]: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "Applied",
  [ApplicationStatus.REVIEWED]: "Reviewed",
  [ApplicationStatus.SHORTLISTED]: "Shortlisted",
  [ApplicationStatus.OFFERED]: "Offered",
  [ApplicationStatus.REJECTED]: "Rejected",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASSES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

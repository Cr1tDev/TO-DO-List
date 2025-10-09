export function formatDueDate(date) {
  if (!date) return "No due Date";

  const today = new Date();
  const due = new Date(date);

  // Remove time part for accurate day difference
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffInMs = due - today;
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Tomorrow";
  if (diffInDays > 1) return `In ${diffInDays} days`;
  if (diffInDays === -1) return "Yesterday";
  if (diffInDays < -1) return `${Math.abs(diffInDays)} days ago`;
}

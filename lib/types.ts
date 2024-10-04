export type Task = {
  id?: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "To do" | "In Progress" | "Completed";
  dueDate: Date | undefined;
};
// @ts-nocheck
export function formatDate(isDateString: any) {
  const date = new Date(isDateString?.toString());
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

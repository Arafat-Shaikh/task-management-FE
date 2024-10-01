export type Task = {
  id?: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "To do" | "In Progress" | "Completed";
  dueDate: Date | undefined;
};

export function formatDate(isoDateString: any) {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

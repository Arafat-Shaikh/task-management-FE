import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Low":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Medium":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "High":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

export const getColumnColor = (status: string) => {
  switch (status) {
    case "To do":
      return "bg-blue-50 border-blue-200";
    case "In Progress":
      return "bg-yellow-50 border-yellow-200";
    case "Completed":
      return "bg-green-50 border-green-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

export const getBorderColor = (status: string) => {
  switch (status) {
    case "Low":
      return "border-green-100";
    case "Medium":
      return "border-yellow-100";
    case "High":
      return "border-red-100";
    default:
      return "border-gray-200";
  }
};

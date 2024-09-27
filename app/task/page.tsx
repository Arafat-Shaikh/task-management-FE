import React from "react";
import TaskClientPage from "./TaskClientPage";
import ClientOnly from "@/components/Clientonly";

const TaskPage = () => {
  return (
    <ClientOnly>
      <TaskClientPage />
    </ClientOnly>
  );
};

export default TaskPage;

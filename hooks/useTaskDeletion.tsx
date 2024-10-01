import { BASE_URL } from "@/lib/utils";
import { taskState } from "@/recoilAtoms/taskAtom";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

export const useTaskDeletion = () => {
  const [isDeleting, setIsLoading] = useState(false);
  const [tasks, setTasks] = useRecoilState(taskState);

  const handleDeleteTask = async (taskId: any) => {
    if (isDeleting) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.delete(`${BASE_URL}/api/task/${taskId}`, {
        withCredentials: true,
      });
      if (response.data) {
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
        toast.success("Task deleted successfully");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting the task");
    }
    setIsLoading(false);
  };

  return { handleDeleteTask, isDeleting };
};

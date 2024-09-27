"use client";

import { taskState } from "@/recoilAtoms/taskAtom";
import { userIdState } from "@/recoilAtoms/userAtom";
import axios from "axios";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const useTasks = () => {
  const userId = useRecoilValue(userIdState);
  const [tasks, setTasks] = useRecoilState(taskState);

  if (!userId) {
    return null;
  }

  useEffect(() => {
    async function getTasks() {
      const response = await axios.get("http://localhost:8080/api/v1/task");
      const tasks = response.data;
      if (tasks) {
        setTasks(tasks);
      }
    }
    getTasks();
  }, []);

  return tasks;
};

export default useTasks;

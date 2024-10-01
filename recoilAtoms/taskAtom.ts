"use client";

import { Task } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import axios from "axios";
import { atom, selector } from "recoil";

// const tasksSelector = selector({
//   key: "tasksSelector",
//   get: async () => {
//     const response = await axios.get(`${BASE_URL}/api/task`, {
//       withCredentials: true,
//     });
//     return response.data;
//   },
// });

export const taskState = atom<Task[]>({
  key: "taskState",
  default: [],
});

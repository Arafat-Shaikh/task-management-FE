"use client";

import axios from "axios";
import { atom, selector } from "recoil";

// const tasksSelector = selector({
//   key: "tasksSelector",
//   get: async () => {
//     const response = await axios.get("http://localhost:8080/api/task", {
//       withCredentials: true,
//     });
//     return response.data;
//   },
// });

export const taskState = atom<[] | any>({
  key: "taskState",
  default: [],
});

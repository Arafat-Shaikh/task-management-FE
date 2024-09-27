import { atom } from "recoil";

// const getInitialUserId = () => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("user-unique-id") || null;
//   }
//   return null;
// };

export const userIdState = atom({
  key: "userIdState",
  default: "",
});

import { userIdState } from "@/recoilAtoms/userAtom";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const useUserId = () => {
  const [userId, setUserId] = useRecoilState(userIdState);

  useEffect(() => {
    const userId = localStorage.getItem("user-unique-id");
    if (userId) {
      setUserId(userId);
      console.log(userId);
    }
  }, []);

  return userId;
};

export default useUserId;

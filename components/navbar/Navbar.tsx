"use client";

import useSignInModal from "@/hooks/useSignInModal";
import { userIdState } from "@/recoilAtoms/userAtom";
import axios from "axios";
import { ListTodo } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilState } from "recoil";

const Navbar = () => {
  const signInModal = useSignInModal();
  const [userId, setUserId] = useRecoilState(userIdState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoading(true);
    if (isLoading) {
      return;
    }
    const response = await axios.post(
      "http://localhost:8080/api/v1/logout",
      {},
      { withCredentials: true }
    );
    if (!response.data) {
      setIsLoading(false);
      return alert("Something went wrong while logging out");
    }
    setUserId("");
    localStorage.removeItem("user-unique-id");
    setIsLoading(false);
  };

  return (
    <div className="w-full bg-white fixed z-10 border-b border-gray-100 shadow-sm">
      <div className="max-w-[2520px] mx-auto ">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <ListTodo className="h-6 w-6" />
            <span className="sr-only">TaskMaster</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              Contact
            </Link>
            <div>
              <button
                onClick={userId ? () => logout() : () => signInModal.onOpen()}
                className="text-sm font-medium rounded-full bg-black text-white px-4 py-1 shadow-sm hover:bg-white hover:text-black transition hover:border-black border "
              >
                {userId ? "Logout" : "Sign In"}
              </button>
            </div>
          </nav>
        </header>
      </div>
    </div>
  );
};

export default Navbar;

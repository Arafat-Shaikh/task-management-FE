"use client";

import useSignInModal from "@/hooks/useSignInModal";
import { BASE_URL } from "@/lib/utils";
import { userIdState } from "@/recoilAtoms/userAtom";
import axios from "axios";
import { ListTodo, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

const Navbar = () => {
  const signInModal = useSignInModal();
  const [userId, setUserId] = useRecoilState(userIdState);
  const [isLoading, setIsLoading] = useState(false);
  // const [tasks, setTasks] = useRecoilState(taskState);
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    setIsLoading(true);
    if (isLoading) {
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/logout`,
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
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong while logging out");
      console.log(error);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("user-unique-id");
    if (id) {
      setUserId(id);
    }
  }, []);

  return (
    <div className="w-full bg-white fixed z-10 border-b border-gray-100 shadow-sm">
      <div className="max-w-[2520px] mx-auto ">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="/">
            <ListTodo className="h-6 w-6" />
            <span className="sr-only">Taskify</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <Link
              className="text-sm hidden sm:block font-medium hover:underline underline-offset-4"
              href="#"
            >
              Features
            </Link>
            <Link
              className="text-sm hidden sm:block font-medium hover:underline underline-offset-4"
              href="#"
            >
              Pricing
            </Link>
            {pathname === "/task" && userId && (
              <Link
                className=" text-sm font-medium rounded-xl bg-black text-white px-4 py-1 shadow-sm hover:bg-white hover:text-black transition hover:border-black border"
                href="/dashboard"
              >
                Dashboard
              </Link>
            )}
            <div>
              <button
                onClick={userId ? () => logout() : () => signInModal.onOpen()}
                className="text-sm font-medium rounded-xl border px-3 py-1 underline-offset-4 "
              >
                {userId ? <LogOut className="h-4 w-4" /> : "Sign In"}
              </button>
            </div>
          </nav>
        </header>
      </div>
    </div>
  );
};

export default Navbar;

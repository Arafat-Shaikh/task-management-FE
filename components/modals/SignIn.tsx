"use client";

import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import useSignInModal from "@/hooks/useSignInModal";
import { useRouter } from "next/navigation";
import useSignupModal from "@/hooks/useSignupModal";
import { useSetRecoilState } from "recoil";
import { userIdState } from "@/recoilAtoms/userAtom";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";
import toast from "react-hot-toast";

interface SignInType {
  email: string;
  password: string;
}

const SignIn = () => {
  const signInModal = useSignInModal();
  const router = useRouter();
  const signUpModal = useSignupModal();
  const setUserId = useSetRecoilState(userIdState);
  const [userDetails, setUserDetails] = useState<SignInType>({
    email: "",
    password: "",
  });

  const toggle = useCallback(() => {
    signInModal.onClose();
    signUpModal.onOpen();
  }, [signInModal, signUpModal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/signin`,
        userDetails,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.userId) {
        localStorage.setItem("user-unique-id", data.userId);
        setUserId(data.userId);
        router.push("/task");
        signInModal.onClose();
        toast.success("Login successful");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      if (error.status == 403) {
        toast.error("User not found");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <Dialog open={signInModal.isOpen} onOpenChange={signInModal.onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Enter your details to sign in to your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails((prevDetails) => ({
                      ...prevDetails,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userDetails.password}
                  onChange={(e) =>
                    setUserDetails((prevDetails) => ({
                      ...prevDetails,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <div className="flex flex-col w-full space-y-2 text-center">
                <Button className="w-full" type="submit">
                  Sign In
                </Button>
                <p className="text-sm">
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={toggle}
                    className="hover:underline cursor-pointer"
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignIn;

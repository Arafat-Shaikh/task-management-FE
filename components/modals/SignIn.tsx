"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { useRecoilState } from "recoil";
import { userIdState } from "@/recoilAtoms/userAtom";
import axios from "axios";

interface SignInType {
  email: string;
  password: string;
}

const SignIn = () => {
  const signInModal = useSignInModal();
  const router = useRouter();
  const signUpModal = useSignupModal();
  const [userId, setUserId] = useRecoilState(userIdState);
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
        "http://localhost:8080/api/user/signin",
        userDetails,
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log(data.userId);
      if (data.userId) {
        localStorage.setItem("user-unique-id", data.userId);

        setUserId(data.userId);
        signInModal.onClose();
        router.push("/task");
      }
    } catch (error) {
      console.log(error);
    }

    // const response = await axios.get("http://localhost:8080/api/v1/check");
    // const userId = response.data.message;
    // console.log(userId);
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
                  Don't have an account?{" "}
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

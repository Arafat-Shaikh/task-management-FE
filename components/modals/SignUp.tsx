"use client";

import React, { FormEventHandler, useState } from "react";
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
import toast from "react-hot-toast";

interface SignUpType {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const signUpModal = useSignupModal();
  const signInModal = useSignInModal();
  const [userId, setUserId] = useRecoilState(userIdState);
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<SignUpType>({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/signup",
        userDetails,
        { withCredentials: true }
      );
      if (!response.data) {
        alert("Something went wrong while Signing up");
      }
      const data = response.data;

      if (data.userId) {
        localStorage.setItem("user-unique-id", data.userId);
        setUserId(data.userId);
        signUpModal.onClose();
        router.push("/task");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  const handleModalSwitch = () => {
    signUpModal.onClose();
    signInModal.onOpen();
  };

  return (
    <Dialog open={signUpModal.isOpen} onOpenChange={signUpModal.onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign up</DialogTitle>
          <DialogDescription>Enter your details to sign up..</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    name: e.target.value,
                  }))
                }
                required
              />
            </div>
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
                Sign up
              </Button>
              <p className="text-sm">
                Don't have an account?{" "}
                <span
                  onClick={handleModalSwitch}
                  className="hover:underline cursor-pointer"
                >
                  Sign In
                </span>
              </p>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUp;

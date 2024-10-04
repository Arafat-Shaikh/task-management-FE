"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { CheckCircle, Share2, Zap } from "lucide-react";
import useSignInModal from "@/hooks/useSignInModal";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/recoilAtoms/userAtom";

const Landing = () => {
  const { onOpen } = useSignInModal();
  const router = useRouter();
  const userId = useRecoilValue(userIdState);

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-22 ">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Tasks with Ease
                </h1>
                <div className="w-full py-6 md:py-12  rounded-full shadow-md bg-gradient-to-r from-black to-gray-800">
                  <div className="container px-4 md:px-6 mx-auto ">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center text-white drop-shadow-[0_5px_3px_rgba(255,255,255,0.1)]">
                      Get things done effortlessly with{" "}
                      <span className="rounded-full inline-flex mt-4 px-4 py-1 bg-neutral-50/20 text-white">
                        Taskify
                      </span>
                    </h1>
                  </div>
                </div>

                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Taskify helps you organize, track, and complete your tasks
                  efficiently. Boost your productivity today!
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  onClick={userId ? () => router.push("/task") : () => onOpen()}
                >
                  Get Started
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold mb-2">Task Organization</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easily create, categorize, and prioritize your tasks.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Share2 className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-d mb-2">Collaboration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share tasks and projects with team members for seamless
                  cooperation.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold mb-2">Productivity Boost</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track your progress and improve your efficiency over time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Taskify. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Landing;

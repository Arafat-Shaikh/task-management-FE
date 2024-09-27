"use client";

import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import ClientOnly from "@/components/Clientonly";
import { Toaster } from "react-hot-toast";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  return (
    <ClientOnly>
      <RecoilRoot>
        {children}
        <Toaster />
      </RecoilRoot>
    </ClientOnly>
  );
};

export default Provider;

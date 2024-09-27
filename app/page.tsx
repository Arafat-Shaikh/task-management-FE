import ClientOnly from "@/components/Clientonly";
import Landing from "@/components/landing/Landing";

import React from "react";

const Home = () => {
  // return <UserClient />;
  return (
    <ClientOnly>
      <Landing />
    </ClientOnly>
  );
};

export default Home;

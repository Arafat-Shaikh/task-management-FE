"use client";

import React, { useEffect, useState } from "react";
import SignIn from "../modals/SignIn";
import SignUp from "../modals/SignUp";
import axios from "axios";
import AddTaskModal from "../modals/AddTask";
import DeleteModal from "../modals/DeleteModal";

const Modals = () => {
  return (
    <>
      <SignIn />
      <SignUp />
      <AddTaskModal />
    </>
  );
};

export default Modals;

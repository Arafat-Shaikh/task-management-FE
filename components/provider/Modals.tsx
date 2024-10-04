"use client";

import SignIn from "../modals/SignIn";
import SignUp from "../modals/SignUp";
import AddTaskModal from "../modals/AddTask";
import { Fragment } from "react";

const Modals = () => {
  return (
    <Fragment>
      <SignIn />
      <SignUp />
      <AddTaskModal />
    </Fragment>
  );
};

export default Modals;

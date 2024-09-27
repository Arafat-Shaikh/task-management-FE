"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronsUpDown, Edit, Trash } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RecoilState, useRecoilState, useRecoilValue } from "recoil";
import { taskState } from "@/recoilAtoms/taskAtom";
import axios from "axios";
import { userIdState } from "@/recoilAtoms/userAtom";
import { useRouter } from "next/navigation";
import useAddTaskModal from "@/hooks/useAddTaskModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useUserId from "@/hooks/useUserId";
import toast from "react-hot-toast";
import UpdateTaskDialog from "@/components/modals/updateTask";

type Task = {
  id?: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "To do" | "In progress" | "Completed";
  dueDate: string;
  userId?: string;
};

const TaskListPage = () => {
  const baseUrl = "http://localhost:8080/api/task";
  const [isUpdateDialog, setIsUpdateDialog] = useState(false);
  const [taskToUpdateId, setTaskToUpdateId] = useState<string | "">("");
  const userId = useRecoilValue(userIdState);
  const [tasks, setTasks] = useRecoilState(taskState);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const addTaskModal = useAddTaskModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    async function getTasks() {
      if (!userId) {
        router.push("/");
      }
      try {
        const params = new URLSearchParams();

        if (statusFilter) {
          params.append("status", statusFilter);
        }

        if (priorityFilter) {
          params.append("priority", priorityFilter);
        }

        if (dateFilter.start && dateFilter.end) {
          params.delete("status");
          params.delete("priority");
          params.append("startDate", dateFilter.start);
        }
        if (dateFilter.end) {
          params.append("endDate", dateFilter.end);
        }

        const urlWithParams = params.toString()
          ? `${baseUrl}?${params.toString()}`
          : baseUrl;

        console.log(urlWithParams);

        const response = await axios.get(urlWithParams, {
          withCredentials: true,
        });
        const tasks = response.data;
        console.log(tasks);
        if (tasks) {
          setTasks(tasks);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
    getTasks();
  }, [statusFilter, priorityFilter, dateFilter]);

  useEffect(() => {
    if (!userId) {
      return router.push("/");
    }
  }, []);

  async function handleEditTask(updateTask: any) {
    console.log(updateTask.dueDate);
    console.log(new Date(updateTask.dueDate));
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/${taskToUpdateId}`,
        updateTask,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        let copyTasks = [...tasks];
        let latestTask = copyTasks.map((task) =>
          task.id === taskToUpdateId ? response.data : task
        );
        setTasks(latestTask);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while delete the task");
    }
    setIsLoading(false);
  }

  function formatDate(isoDateString: any) {
    const date = new Date(isoDateString);
    console.log(date);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  function handleRemoveFilters() {
    setPriorityFilter(null);
    setStatusFilter(null);
    setDateFilter({
      start: "",
      end: "",
    });
  }

  async function handleDeleteTask(taskId: string) {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.delete(`${baseUrl}/${taskId}`, {
        withCredentials: true,
      });
      if (response.data) {
        let copyTasks = [...tasks];
        let latestTask = copyTasks.filter((t) => t.id !== taskId);
        setTasks(latestTask);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while delete the task");
    }
    setIsLoading(false);
  }

  if (!userId) {
    return null;
  }

  if (
    !tasks.length &&
    !statusFilter &&
    !priorityFilter &&
    !dateFilter.start &&
    !dateFilter.end
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 rounded-lg shadow-md">
        <p className="text-gray-500 mb-4">No tasks available</p>
        <button
          onClick={addTaskModal.onOpen}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-300"
        >
          Add Task
        </button>
      </div>
    );
  } else if (
    !tasks.length &&
    (statusFilter || priorityFilter || dateFilter.start)
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 rounded-lg shadow-md">
        <p className="text-gray-500 mb-4">No tasks available</p>
        <button
          onClick={handleRemoveFilters}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-300"
        >
          Remove Filters
        </button>
      </div>
    );
  }

  return (
    <div className=" -mt-4 md:mt-0 flex flex-col md:flex-row bg-gray-100 h-full">
      {/* Left side - Filters */}
      <div
        className={`w-full sm:px-28 px-10 md:w-1/3 md:px-4 lg:px-10 py-4 space-y-4`}
      >
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full -ml-2 px-6 sm:px-8 space-y-2 transition-all "
        >
          <CollapsibleTrigger asChild>
            {/* {false && ( */}
            <div className="cursor-pointer flex items-center hover:shadow-sm hover:border-[2px] justify-between border rounded-md space-x-4 px-4 hover:bg-gray-100 bg-gray-200 border-gray-300">
              <h4 className="text-sm font-semibold">Filters</h4>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </div>

            {/* // )} */}
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-2 transition-all duration-300 ease-in-out overflow-hidden">
            <DropdownMenu
              open={openDropdown === "priority"}
              onOpenChange={() => handleDropdownToggle("priority")}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {priorityFilter || "Select Priority"}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 lg:w-60">
                <DropdownMenuItem
                  className=""
                  onSelect={() => setPriorityFilter("Low")}
                >
                  Low
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => setPriorityFilter("Medium")}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPriorityFilter("High")}>
                  High
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu
              open={openDropdown === "status"}
              onOpenChange={() => handleDropdownToggle("status")}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {statusFilter || "Select Status"}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 lg:w-60">
                <DropdownMenuItem onSelect={() => setStatusFilter("To do")}>
                  To do
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setStatusFilter("In Progress")}
                >
                  In progress
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("Completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu
              open={openDropdown === "date"}
              onOpenChange={() => handleDropdownToggle("date")}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Filter by Date <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 lg:w-60">
                <div className="p-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) =>
                      setDateFilter((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="p-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) =>
                      setDateFilter((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </CollapsibleContent>
        </Collapsible>
        <div className="w-full px-7 sm:px-8 md:px-12 -ml-2 space-y-2">
          <Button
            onClick={() => addTaskModal.onOpen()}
            className="w-full hover:shadow-md"
          >
            Add Task
          </Button>

          <Button
            onClick={handleRemoveFilters}
            variant={"outline"}
            className="w-full hover:bg-white border hover:border-gray-300 transition "
          >
            Remove Filters
          </Button>
        </div>
      </div>

      {/* Right side - Task List */}
      <div className="w-full px-8 md:w-2/3 py-4 sm:px-4 max-h-1/2 md:max-h-[620px] overflow-y-auto">
        <div className="space-y-4">
          {tasks?.map((task: any) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600 italic">{task.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">
                      Priority
                    </span>
                    : {task.priority}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    <span className="font-semibold text-gray-800">Status</span>:{" "}
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    <span className="font-semibold text-gray-800">Due</span>:{" "}
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            setIsUpdateDialog(true);
                            setTaskToUpdateId(task.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="transition-colors duration-300 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Task</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleDeleteTask(task.id)}
                          variant="ghost"
                          size="sm"
                          className="transition-colors duration-300 hover:bg-gray-100"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Task</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
          <div>
            {
              <UpdateTaskDialog
                isOpen={isUpdateDialog}
                setOnClose={() => setIsUpdateDialog(false)}
                onUpdate={handleEditTask}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListPage;

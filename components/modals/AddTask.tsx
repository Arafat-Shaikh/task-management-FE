"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { BASE_URL, cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAddTaskModal from "@/hooks/useAddTaskModal";
import toast from "react-hot-toast";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { taskState } from "@/recoilAtoms/taskAtom";
import { formatDate, Task } from "@/lib/types";

enum StatusType {
  ToDo = "To do",
  InProgress = "In Progress",
  Completed = "Completed",
}

enum PriorityType {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

const AddTaskModal = () => {
  const addTaskModal = useAddTaskModal();
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    status: StatusType.ToDo,
    priority: PriorityType.Medium,
    dueDate: undefined,
  });
  const setTasks = useSetRecoilState(taskState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      return null;
    }

    if (!newTask.status || !newTask.priority || !newTask.dueDate) {
      toast.error("All details required");
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/task`, newTask, {
        withCredentials: true,
      });

      if (response.data) {
        setTasks((prevTasks: Task[]) => [response.data, ...prevTasks]);

        setNewTask((prevTask: Task) => ({
          ...prevTask,
          title: "",
          description: "",
        }));
      }
      addTaskModal.onClose();
      toast.success("Task created successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={addTaskModal.isOpen} onOpenChange={addTaskModal.onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Enter the details for the new task
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newTask.status}
                onValueChange={(
                  value:
                    | StatusType.ToDo
                    | StatusType.InProgress
                    | StatusType.Completed
                ) => setNewTask({ ...newTask, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StatusType.ToDo}>To do</SelectItem>
                  <SelectItem value={StatusType.InProgress}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={StatusType.Completed}>
                    Completed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: PriorityType) =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PriorityType.Low}>Low</SelectItem>
                  <SelectItem value={PriorityType.Medium}>Medium</SelectItem>
                  <SelectItem value={PriorityType.High}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !newTask.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTask.dueDate ? (
                      formatDate(newTask.dueDate)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTask.dueDate}
                    onSelect={(date) =>
                      setNewTask({ ...newTask, dueDate: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;

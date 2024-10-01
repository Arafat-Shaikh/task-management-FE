"use client";

import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { taskState } from "@/recoilAtoms/taskAtom";
import axios from "axios";
import { userIdState } from "@/recoilAtoms/userAtom";
import { getColumnColor, getPriorityIcon } from "@/lib/icons";
import { Task } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { useTaskDeletion } from "@/hooks/useTaskDeletion";

const TaskCard: React.FC<{
  task: Task;
  onStatusChange: (id: string, status: Task["status"]) => void;
}> = ({ task, onStatusChange }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const { isDeleting, handleDeleteTask } = useTaskDeletion();

  const setDragRef = (element: HTMLDivElement | null) => {
    if (element) {
      drag(element);
    }
  };

  return (
    <div
      ref={setDragRef}
      className={`bg-white p-4 mb-3 rounded-lg shadow-md transition-all duration-300 ${
        isDragging ? "opacity-50 scale-105" : "opacity-100 hover:shadow-lg"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
            task.priority === "Low"
              ? "bg-green-100 text-green-800"
              : task.priority === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {getPriorityIcon(task.priority)}
          <span className="ml-1">{task.priority}</span>
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3 italic">{task.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-700 px-2 py-1.5 bg-gray-100 rounded-md font-semibold">
          {task.status}
        </span>
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mr-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDeleteTask(task.id)}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Column: React.FC<{
  status: Task["status"];
  tasks: Task[];
  onStatusChange: (id: string, status: Task["status"]) => void;
}> = ({ status, tasks, onStatusChange }) => {
  const [, drop] = useDrop<any>(() => ({
    accept: "task",
    drop: (item: { id: string }) => onStatusChange(item.id, status),
  }));

  const setDropRef = (element: HTMLDivElement | null) => {
    if (element) {
      drop(element);
    }
  };

  return (
    <div
      ref={setDropRef}
      className={`p-4 rounded-lg w-full md:w-1/3 ${getColumnColor(
        status
      )} border-t-4`}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">{status}</h2>
      <div className="space-y-3">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
            />
          ))}
      </div>
    </div>
  );
};

export default function KanbanDashboard() {
  const [tasks, setTasks] = useRecoilState(taskState);
  const userId = useRecoilValue(userIdState);

  const handleStatusChange = async (id: string, newStatus: Task["status"]) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/task/${id.toString()}`,
        { status: newStatus.toString() },
        { withCredentials: true }
      );

      // const fetchTasks = await axios.get("http://localhost:8080/api/task", {
      //   withCredentials: true,
      // });
      // console.log(fetchTasks.data);

      if (response.data) {
        setTasks((prevTasks: any) =>
          prevTasks.map((task: any) =>
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getTasks() {
      if (userId) {
        try {
          const response = await axios.get(`${BASE_URL}/api/task`, {
            withCredentials: true,
          });
          const tasks = response.data;
          if (tasks) {
            console.log(tasks);
            setTasks(tasks);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    getTasks();
  }, [userId]);

  if (!tasks) {
    return null;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Task Dashboard
          </h1>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Column
              status="To do"
              tasks={tasks}
              onStatusChange={handleStatusChange}
            />
            <Column
              status="In Progress"
              tasks={tasks}
              onStatusChange={handleStatusChange}
            />
            <Column
              status="Completed"
              tasks={tasks}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

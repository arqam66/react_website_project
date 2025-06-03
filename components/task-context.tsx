"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

// Define Task type
export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

// Define filter type
export type FilterType = "all" | "active" | "completed"

// Define state type
interface TaskState {
  tasks: Task[]
  filter: FilterType
}

// Define action types
type TaskAction =
  | { type: "ADD_TASK"; payload: { text: string } }
  | { type: "TOGGLE_TASK"; payload: { id: string } }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "SET_FILTER"; payload: { filter: FilterType } }

// Initial state
const initialState: TaskState = {
  tasks: [],
  filter: "all",
}

// Create context
const TaskContext = createContext<
  | {
      state: TaskState
      dispatch: React.Dispatch<TaskAction>
    }
  | undefined
>(undefined)

// Reducer function
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: Date.now().toString(),
            text: action.payload.text,
            completed: false,
            createdAt: new Date(),
          },
        ],
      }
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, completed: !task.completed } : task,
        ),
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      }
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload.filter,
      }
    default:
      return state
  }
}

// Provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>
}

// Custom hook to use the task context
export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

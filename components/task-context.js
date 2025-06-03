"use client"

import { createContext, useContext, useReducer } from "react"

// Create context
const TaskContext = createContext(undefined)

// Default categories
const defaultCategories = [
  { id: "work", name: "Work", color: "#3b82f6" }, // blue
  { id: "personal", name: "Personal", color: "#10b981" }, // green
  { id: "study", name: "Study", color: "#8b5cf6" }, // purple
  { id: "health", name: "Health", color: "#ef4444" }, // red
  { id: "finance", name: "Finance", color: "#f59e0b" }, // amber
]

// Load tasks from localStorage
const loadTasks = () => {
  if (typeof window !== "undefined") {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        // Convert string dates back to Date objects and ensure categoryId exists
        return parsedTasks.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          categoryId: task.categoryId || "none", // Ensure categoryId exists
        }))
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e)
        return []
      }
    }
  }
  return []
}

// Load categories from localStorage
const loadCategories = () => {
  if (typeof window !== "undefined") {
    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories)
      } catch (e) {
        console.error("Failed to parse categories from localStorage", e)
        return defaultCategories
      }
    }
  }
  return defaultCategories
}

// Initial state
const initialState = {
  tasks: [],
  categories: defaultCategories,
  filter: "all",
  categoryFilter: "all",
  editingTaskId: null,
  editingCategoryId: null,
}

// Reducer function
function taskReducer(state, action) {
  let newState

  switch (action.type) {
    case "ADD_TASK":
      newState = {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: Date.now().toString(),
            text: action.payload.text,
            description: action.payload.description || "",
            categoryId: action.payload.categoryId || "none", // Ensure categoryId is set
            completed: false,
            createdAt: new Date(),
          },
        ],
      }
      break

    case "TOGGLE_TASK":
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, completed: !task.completed } : task,
        ),
      }
      break

    case "DELETE_TASK":
      newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
        editingTaskId: state.editingTaskId === action.payload.id ? null : state.editingTaskId,
      }
      break

    case "SET_FILTER":
      newState = {
        ...state,
        filter: action.payload.filter,
      }
      break

    case "SET_CATEGORY_FILTER":
      newState = {
        ...state,
        categoryFilter: action.payload.categoryId,
      }
      break

    case "SET_EDITING_TASK":
      newState = {
        ...state,
        editingTaskId: action.payload.id,
      }
      break

    case "UPDATE_TASK":
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                text: action.payload.text,
                description: action.payload.description || task.description,
                categoryId: action.payload.categoryId || task.categoryId,
              }
            : task,
        ),
        editingTaskId: null,
      }
      break

    case "CANCEL_EDIT":
      newState = {
        ...state,
        editingTaskId: null,
        editingCategoryId: null,
      }
      break

    case "ADD_CATEGORY":
      const newCategory = {
        id: Date.now().toString(),
        name: action.payload.name,
        color: action.payload.color || "#6b7280", // Default gray color
      }
      newState = {
        ...state,
        categories: [...state.categories, newCategory],
      }
      break

    case "UPDATE_CATEGORY":
      newState = {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id
            ? {
                ...category,
                name: action.payload.name,
                color: action.payload.color,
              }
            : category,
        ),
        editingCategoryId: null,
      }
      break

    case "DELETE_CATEGORY":
      // When deleting a category, set tasks with that category to "none"
      newState = {
        ...state,
        categories: state.categories.filter((category) => category.id !== action.payload.id),
        tasks: state.tasks.map((task) =>
          task.categoryId === action.payload.id ? { ...task, categoryId: "none" } : task,
        ),
        categoryFilter: state.categoryFilter === action.payload.id ? "all" : state.categoryFilter,
      }
      break

    case "SET_EDITING_CATEGORY":
      newState = {
        ...state,
        editingCategoryId: action.payload.id,
      }
      break

    default:
      return state
  }

  // Save tasks to localStorage whenever they change
  if (typeof window !== "undefined") {
    if (newState.tasks !== state.tasks) {
      localStorage.setItem("tasks", JSON.stringify(newState.tasks))
    }
    if (newState.categories !== state.categories) {
      localStorage.setItem("categories", JSON.stringify(newState.categories))
    }
  }

  return newState
}

// Provider component
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, {
    ...initialState,
    tasks: loadTasks(),
    categories: loadCategories(),
  })

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

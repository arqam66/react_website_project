"use client"
import { useState } from "react"
import { TaskProvider } from "./task-context"
import TaskList from "./task-list"
import TaskForm from "./task-form"
import TaskFilter from "./task-filter"
import TaskStats from "./task-stats"
import Dashboard from "./dashboard"
import CategoryManager from "./category-manager"
import { LayoutGrid, ListTodo, Settings } from "lucide-react"

export default function TaskApp() {
  const [activeView, setActiveView] = useState("tasks") // "tasks", "dashboard", or "settings"

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskProvider>
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0">React App</h1>
            <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setActiveView("tasks")}
                className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                  activeView === "tasks" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ListTodo className="h-4 w-4 mr-2" />
                <span>Tasks</span>
              </button>
              <button
                onClick={() => setActiveView("dashboard")}
                className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                  activeView === "dashboard" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveView("settings")}
                className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                  activeView === "settings" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>Categories</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {activeView === "tasks" && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 md:p-6">
                  <TaskForm />
                  <div className="mt-4 md:mt-6">
                    <TaskFilter />
                  </div>
                  <div className="mt-4">
                    <TaskStats compact={true} />
                  </div>
                  <div className="mt-4 md:mt-6">
                    <TaskList />
                  </div>
                </div>
              </div>
            )}

            {activeView === "dashboard" && <Dashboard />}

            {activeView === "settings" && <CategoryManager />}
          </div>
        </div>
      </TaskProvider>
    </div>
  )
}

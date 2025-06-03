"use client"
import { TaskProvider } from "@/components/task-context"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import TaskFilter from "@/components/task-filter"
import TaskStats from "@/components/task-stats"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>

        <TaskProvider>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <TaskForm />
              <div className="mt-6">
                <TaskFilter />
              </div>
              <div className="mt-4">
                <TaskStats />
              </div>
              <div className="mt-6">
                <TaskList />
              </div>
            </div>
          </div>
        </TaskProvider>
      </div>
    </div>
  )
}

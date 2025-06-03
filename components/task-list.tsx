"use client"

import { useEffect, useState } from "react"
import { useTaskContext, type Task } from "./task-context"
import { Trash2, Check, Circle } from "lucide-react"

export default function TaskList() {
  const { state, dispatch } = useTaskContext()
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])

  // Effect to filter tasks based on the current filter
  useEffect(() => {
    let result = [...state.tasks]

    if (state.filter === "active") {
      result = result.filter((task) => !task.completed)
    } else if (state.filter === "completed") {
      result = result.filter((task) => task.completed)
    }

    // Sort by creation date (newest first)
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    setFilteredTasks(result)
  }, [state.tasks, state.filter])

  // Toggle task completion status
  const toggleTask = (id: string) => {
    dispatch({ type: "TOGGLE_TASK", payload: { id } })
  }

  // Delete a task
  const deleteTask = (id: string) => {
    dispatch({ type: "DELETE_TASK", payload: { id } })
  }

  if (filteredTasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">No tasks found. Add some tasks to get started!</div>
  }

  return (
    <ul className="divide-y divide-gray-200">
      {filteredTasks.map((task) => (
        <li key={task.id} className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleTask(task.id)}
                className="focus:outline-none"
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <span className={`text-gray-800 ${task.completed ? "line-through text-gray-500" : ""}`}>{task.text}</span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Delete task"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

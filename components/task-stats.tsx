"use client"

import { useMemo } from "react"
import { useTaskContext } from "./task-context"

export default function TaskStats() {
  const { state } = useTaskContext()

  // Calculate statistics using useMemo to avoid recalculation on every render
  const stats = useMemo(() => {
    const total = state.tasks.length
    const completed = state.tasks.filter((task) => task.completed).length
    const active = total - completed
    const percentComplete = total === 0 ? 0 : Math.round((completed / total) * 100)

    return { total, completed, active, percentComplete }
  }, [state.tasks])

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Task Statistics</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-semibold">{stats.total}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-lg font-semibold">{stats.active}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-lg font-semibold">{stats.completed}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Progress</p>
          <p className="text-lg font-semibold">{stats.percentComplete}%</p>
        </div>
      </div>
      {stats.total > 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${stats.percentComplete}%` }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

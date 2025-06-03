"use client"
import { useTaskContext, type FilterType } from "./task-context"

export default function TaskFilter() {
  const { state, dispatch } = useTaskContext()

  const setFilter = (filter: FilterType) => {
    dispatch({ type: "SET_FILTER", payload: { filter } })
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setFilter("all")}
        className={`px-3 py-1 rounded-md ${
          state.filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        All
      </button>
      <button
        onClick={() => setFilter("active")}
        className={`px-3 py-1 rounded-md ${
          state.filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Active
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={`px-3 py-1 rounded-md ${
          state.filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Completed
      </button>
    </div>
  )
}

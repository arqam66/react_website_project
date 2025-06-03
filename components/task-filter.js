"use client"
import { useTaskContext } from "./task-context"

export default function TaskFilter() {
  const { state, dispatch } = useTaskContext()

  const setFilter = (filter) => {
    dispatch({ type: "SET_FILTER", payload: { filter } })
  }

  const setCategoryFilter = (categoryId) => {
    dispatch({ type: "SET_CATEGORY_FILTER", payload: { categoryId } })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md text-sm ${
            state.filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded-md text-sm ${
            state.filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-md text-sm ${
            state.filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>

      {state.categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1 rounded-md text-sm ${
                state.categoryFilter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Categories
            </button>
            {state.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`px-3 py-1 rounded-md text-sm flex items-center ${
                  state.categoryFilter === category.id ? "text-white" : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                }`}
                style={{
                  backgroundColor: state.categoryFilter === category.id ? category.color : undefined,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: state.categoryFilter === category.id ? "white" : category.color }}
                ></div>
                {category.name}
              </button>
            ))}
            <button
              onClick={() => setCategoryFilter("none")}
              className={`px-3 py-1 rounded-md text-sm flex items-center ${
                state.categoryFilter === "none"
                  ? "bg-gray-600 text-white"
                  : "text-gray-700 bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: state.categoryFilter === "none" ? "white" : "#6b7280" }}
              ></div>
              No Category
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

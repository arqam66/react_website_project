"use client"

import { useMemo, useState } from "react"
import { useTaskContext } from "./task-context"
import TaskStats from "./task-stats"
import { CheckCircle, Clock, Calendar, TrendingUp, AlertCircle, Circle, Tag } from "lucide-react"

export default function Dashboard() {
  const { state, dispatch } = useTaskContext()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const dashboardStats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Filter tasks by selected category if needed
    let filteredTasks = state.tasks
    if (selectedCategory !== "all") {
      filteredTasks = state.tasks.filter((task) => task.categoryId === selectedCategory)
    }

    const tasksAddedToday = filteredTasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate.getTime() === today.getTime()
    }).length

    const completedToday = filteredTasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      taskDate.setHours(0, 0, 0, 0)
      return task.completed && taskDate.getTime() === today.getTime()
    }).length

    const recentTasks = [...filteredTasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    const urgentTasks = filteredTasks.filter((task) => !task.completed).slice(0, 3)

    // Calculate tasks by category
    const categoryCounts = {}
    state.categories.forEach((category) => {
      categoryCounts[category.id] = {
        total: 0,
        completed: 0,
        name: category.name,
        color: category.color,
      }
    })

    // Add "No Category" entry
    categoryCounts["none"] = {
      total: 0,
      completed: 0,
      name: "No Category",
      color: "#6b7280",
    }

    state.tasks.forEach((task) => {
      const categoryId = task.categoryId || "none"
      if (categoryCounts[categoryId]) {
        categoryCounts[categoryId].total++
        if (task.completed) {
          categoryCounts[categoryId].completed++
        }
      }
    })

    // Convert to array and sort by total tasks
    const categoryStats = Object.keys(categoryCounts)
      .map((id) => ({
        id,
        ...categoryCounts[id],
        percentage:
          categoryCounts[id].total > 0
            ? Math.round((categoryCounts[id].completed / categoryCounts[id].total) * 100)
            : 0,
      }))
      .sort((a, b) => b.total - a.total)

    return {
      tasksAddedToday,
      completedToday,
      recentTasks,
      urgentTasks,
      categoryStats,
    }
  }, [state.tasks, state.categories, selectedCategory])

  // Calculate completion rate by day of week
  const weekdayStats = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dayStats = Array(7).fill(0)
    const dayCounts = Array(7).fill(0)

    // Filter tasks by selected category if needed
    let filteredTasks = state.tasks
    if (selectedCategory !== "all") {
      filteredTasks = state.tasks.filter((task) => task.categoryId === selectedCategory)
    }

    filteredTasks.forEach((task) => {
      const date = new Date(task.createdAt)
      const dayIndex = date.getDay()
      dayCounts[dayIndex]++
      if (task.completed) {
        dayStats[dayIndex]++
      }
    })

    return days.map((day, index) => ({
      day,
      rate: dayCounts[index] ? Math.round((dayStats[index] / dayCounts[index]) * 100) : 0,
      count: dayCounts[index],
    }))
  }, [state.tasks, selectedCategory])

  // Get category color
  const getCategoryColor = (id) => {
    if (id === "none") return "#6b7280" // Default gray
    const category = state.categories.find((cat) => cat.id === id)
    return category ? category.color : "#6b7280"
  }

  // Get category name
  const getCategoryName = (id) => {
    if (id === "none") return "No Category"
    const category = state.categories.find((cat) => cat.id === id)
    return category ? category.name : "No Category"
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-8 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
              >
                <option value="all">All Categories</option>
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value="none">No Category</option>
              </select>
              <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <TaskStats />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700 flex items-center mb-3">
                <Calendar className="h-4 w-4 mr-2" />
                Today's Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-xs text-gray-500">Added Today</p>
                  <p className="text-lg font-semibold">{dashboardStats.tasksAddedToday}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-xs text-gray-500">Completed Today</p>
                  <p className="text-lg font-semibold">{dashboardStats.completedToday}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700 flex items-center mb-3">
                <TrendingUp className="h-4 w-4 mr-2" />
                Weekly Performance
              </h3>
              <div className="flex justify-between items-end h-24">
                {weekdayStats.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                    <div
                      className="w-6 bg-green-200 rounded-t-sm"
                      style={{ height: `${day.count ? day.count * 20 : 4}px`, maxHeight: "80px" }}
                    >
                      <div className="w-full bg-green-500 rounded-t-sm" style={{ height: `${day.rate}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 flex items-center mb-3">
                <Clock className="h-4 w-4 mr-2" />
                Recent Tasks
              </h3>
              {dashboardStats.recentTasks.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {dashboardStats.recentTasks.map((task) => (
                    <li key={task.id} className="py-2">
                      <div className="flex items-center">
                        {task.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            {task.categoryId !== "none" && (
                              <div
                                className="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                                style={{ backgroundColor: getCategoryColor(task.categoryId) }}
                              ></div>
                            )}
                            <span
                              className={`text-sm truncate ${
                                task.completed ? "line-through text-gray-500" : "text-gray-700"
                              }`}
                            >
                              {task.text}
                            </span>
                          </div>
                          {task.description && (
                            <div className="ml-3 mt-1 text-xs text-gray-500 truncate">
                              {task.description.length > 60
                                ? `${task.description.substring(0, 60)}...`
                                : task.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 py-2">No tasks yet. Add some tasks to get started!</p>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-700 flex items-center mb-3">
                <AlertCircle className="h-4 w-4 mr-2" />
                Tasks To Focus On
              </h3>
              {dashboardStats.urgentTasks.length > 0 ? (
                <ul className="space-y-2">
                  {dashboardStats.urgentTasks.map((task) => (
                    <li key={task.id} className="bg-white p-2 rounded-md shadow-sm">
                      <div className="flex items-center">
                        {task.categoryId !== "none" && (
                          <div
                            className="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                            style={{ backgroundColor: getCategoryColor(task.categoryId) }}
                          ></div>
                        )}
                        <span className="text-sm text-gray-700">{task.text}</span>
                      </div>
                      {task.description && (
                        <div className="ml-3 mt-1 text-xs text-gray-500 truncate">
                          {task.description.length > 60 ? `${task.description.substring(0, 60)}...` : task.description}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 py-2">No active tasks. Great job!</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Tasks by Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dashboardStats.categoryStats.map((category) => (
                <div key={category.id} className="bg-white p-3 rounded-md shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

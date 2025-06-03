"use client"

import { useRef } from "react"
import { useEffect, useState } from "react"
import { useTaskContext } from "./task-context"
import { Trash2, Check, Circle, Edit2, X, Save, ChevronDown, ChevronUp, Tag } from "lucide-react"

export default function TaskList() {
  const { state, dispatch } = useTaskContext()
  const [filteredTasks, setFilteredTasks] = useState([])
  const [editText, setEditText] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editCategoryId, setEditCategoryId] = useState("none")
  const [expandedTasks, setExpandedTasks] = useState({})
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const editInputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Effect to filter tasks based on the current filter and category filter
  useEffect(() => {
    let result = [...state.tasks]

    // Status filter
    if (state.filter === "active") {
      result = result.filter((task) => !task.completed)
    } else if (state.filter === "completed") {
      result = result.filter((task) => task.completed)
    }

    // Category filter
    if (state.categoryFilter !== "all") {
      result = result.filter((task) => task.categoryId === state.categoryFilter)
    }

    // Sort by creation date (newest first)
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    setFilteredTasks(result)
  }, [state.tasks, state.filter, state.categoryFilter])

  // Focus the edit input when a task is set to edit mode
  useEffect(() => {
    if (state.editingTaskId && editInputRef.current) {
      const task = state.tasks.find((t) => t.id === state.editingTaskId)
      if (task) {
        setEditText(task.text)
        setEditDescription(task.description || "")
        setEditCategoryId(task.categoryId || "none")
        editInputRef.current.focus()
      }
    }
  }, [state.editingTaskId, state.tasks])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Toggle task completion status
  const toggleTask = (id) => {
    dispatch({ type: "TOGGLE_TASK", payload: { id } })
  }

  // Delete a task
  const deleteTask = (id) => {
    dispatch({ type: "DELETE_TASK", payload: { id } })
  }

  // Start editing a task
  const startEditTask = (id) => {
    dispatch({ type: "SET_EDITING_TASK", payload: { id } })
  }

  // Save edited task
  const saveEditTask = (id) => {
    if (editText.trim()) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          id,
          text: editText.trim(),
          description: editDescription.trim(),
          categoryId: editCategoryId,
        },
      })
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" })
  }

  // Handle edit form submission
  const handleEditSubmit = (e, id) => {
    e.preventDefault()
    saveEditTask(id)
  }

  // Toggle task description visibility
  const toggleTaskExpand = (id) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

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

  if (filteredTasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">No tasks found. Add some tasks to get started!</div>
  }

  return (
    <ul className="divide-y divide-gray-200">
      {filteredTasks.map((task) => (
        <li key={task.id} className="py-3 md:py-4">
          {state.editingTaskId === task.id ? (
            <form onSubmit={(e) => handleEditSubmit(e, task.id)} className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
                    aria-label="Select category"
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: getCategoryColor(editCategoryId) }}
                    ></div>
                    <Tag className="h-4 w-4" />
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200">
                        Select Category
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditCategoryId("none")
                          setShowCategoryDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                      >
                        <div className="w-3 h-3 rounded-full mr-2 bg-gray-400"></div>
                        No Category
                      </button>
                      {state.categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setEditCategoryId(category.id)
                            setShowCategoryDropdown(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                        >
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button
                    type="submit"
                    className="p-1 text-green-500 hover:text-green-700 focus:outline-none"
                    aria-label="Save"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Cancel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Task description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
              />
            </form>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 focus:outline-none"
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className={`text-gray-800 truncate ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.text}
                      </span>
                      {(task.description || task.categoryId !== "none") && (
                        <button
                          onClick={() => toggleTaskExpand(task.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                          aria-label={expandedTasks[task.id] ? "Hide details" : "Show details"}
                        >
                          {expandedTasks[task.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => startEditTask(task.id)}
                    className="p-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                    aria-label="Edit task"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {expandedTasks[task.id] && (
                <div className="ml-8 pl-3 border-l-2 border-gray-200 space-y-2">
                  {task.categoryId && task.categoryId !== "none" && (
                    <div className="flex items-center text-sm">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getCategoryColor(task.categoryId) }}
                      ></div>
                      <span className="text-gray-600">{getCategoryName(task.categoryId)}</span>
                    </div>
                  )}
                  {task.description && (
                    <div className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

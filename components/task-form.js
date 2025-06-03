"use client"

import { useState, useRef, useEffect } from "react"
import { useTaskContext } from "./task-context"
import { Plus, ChevronDown, ChevronUp, Tag } from "lucide-react"

export default function TaskForm() {
  const [text, setText] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("none")
  const [showDescription, setShowDescription] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const { state, dispatch } = useTaskContext()
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

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

  const handleSubmit = (e) => {
    e.preventDefault()

    if (text.trim()) {
      dispatch({
        type: "ADD_TASK",
        payload: {
          text: text.trim(),
          description: description.trim(),
          categoryId, // Pass the selected categoryId
        },
      })
      setText("")
      setDescription("")
      setShowDescription(false)
      // Don't reset categoryId to keep the last selected category
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
            aria-label="Select category"
            title={`Category: ${getCategoryName(categoryId)}`}
          >
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getCategoryColor(categoryId) }}></div>
            <Tag className="h-5 w-5" />
          </button>
          {showCategoryDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200">
                Select Category
              </div>
              <button
                type="button"
                onClick={() => {
                  setCategoryId("none")
                  setShowCategoryDropdown(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                  categoryId === "none" ? "bg-gray-100" : ""
                }`}
              >
                <div className="w-3 h-3 rounded-full mr-2 bg-gray-400"></div>
                No Category
              </button>
              {state.categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(category.id)
                    setShowCategoryDropdown(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                    categoryId === category.id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowDescription(!showDescription)}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showDescription ? "Hide description field" : "Show description field"}
        >
          {showDescription ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {showDescription && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(categoryId) }}></div>
            <span className="text-sm text-gray-600">{getCategoryName(categoryId)}</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
          />
        </div>
      )}
    </form>
  )
}
